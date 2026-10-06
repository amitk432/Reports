// Fails the build if records/index.json and the files in records/ disagree.
import fs from 'node:fs';
import path from 'node:path';

const RECORDS = path.resolve(import.meta.dirname, '../../records');
const REPORTS = path.resolve(import.meta.dirname, '../../reports');
const index = JSON.parse(fs.readFileSync(path.join(RECORDS, 'index.json'), 'utf8'));

const onDisk = fs.readdirSync(RECORDS, { recursive: true })
  .filter(f => fs.statSync(path.join(RECORDS, f)).isFile() && !/(^|\/)(\.DS_Store|index\.json)$/.test(f));
const indexed = index.reports.map(r => r.path);

const problems = [
  ...onDisk.filter(f => !indexed.includes(f)).map(f => `not in index: ${f}`),
  ...indexed.filter(f => !onDisk.includes(f)).map(f => `missing file: ${f}`),
  ...indexed.filter((f, i) => indexed.indexOf(f) !== i).map(f => `duplicate index entry: ${f}`),
  ...index.reports.filter(r => !r.id || !r.title || !r.hospital).map(r => `incomplete entry: ${r.path}`),
  ...index.summaries.filter(s => !fs.existsSync(path.join(REPORTS, s.path))).map(s => `missing summary: ${s.path}`),
];

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`index ok: ${indexed.length} reports, ${index.summaries.length} summaries`);
