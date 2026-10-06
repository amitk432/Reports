export const fileUrl = p => 'records/' + p.split('/').map(encodeURIComponent).join('/');
export const summaryUrl = p => 'reports/' + p.split('/').map(encodeURIComponent).join('/');

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const fmtSize = b => (b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB');

export const kind = p => (/\.pdf$/i.test(p) ? 'pdf' : /\.(jpe?g|png)$/i.test(p) ? 'image' : 'text');

export const FLAG = { H: 'High', L: 'Low', C: 'Critical', N: 'Normal' };

// Text blob used by the index search box.
export const searchText = r =>
  [r.title, r.hospital, r.issuer, r.collectedAt, r.doctor, r.reportType, r.summary, r.path, r.date,
   ...(r.keyPoints || []), ...(r.issues || []), ...(r.findings || []).map(f => `${f.test} ${f.value}`)]
    .join(' ').toLowerCase();

// Collapse lab-name variants ("Serum Creatinine", "Creatinine, Serum") into one trend key.
// ponytail: alias list is hand-tuned; add entries when a test shows up split in the Trends tab.
const ALIASES = [
  [/haemoglobin|hemoglobin|\bhb\b/, 'Haemoglobin'],
  [/total leu[ck]ocyte|\btlc\b|wbc|white blood/, 'White cells (TLC)'],
  [/platelet count|^platelets?$/, 'Platelets'],
  [/creatinine(?!.*ratio)/, 'Creatinine'],
  [/^urea$|blood urea$|^serum urea|urea, serum|^urea \(/, 'Urea'],
  [/urea nitrogen|\bbun\b(?!.*ratio)/, 'Urea nitrogen (BUN)'],
  [/sodium|\bna\+?\b/, 'Sodium'],
  [/potassium|\bk\+?\b/, 'Potassium'],
  [/chloride/, 'Chloride'],
  [/albumin(?!.*globulin| ratio|:)/, 'Albumin'],
  [/^total protein|protein, total/, 'Total protein'],
  [/calcium(?!.*ion)/, 'Calcium'],
  [/phosph/, 'Phosphorus'],
  [/uric acid/, 'Uric acid'],
  [/c-?reactive|\bcrp\b/, 'CRP'],
  [/procalcitonin/, 'Procalcitonin'],
  [/\besr\b|sedimentation/, 'ESR'],
  [/alkaline phosphatase|\balp\b/, 'Alkaline phosphatase'],
  [/sgot|\bast\b(?!.*ratio)/, 'AST (SGOT)'],
  [/sgpt|\balt\b/, 'ALT (SGPT)'],
  [/bilirubin.*total|total bilirubin/, 'Bilirubin total'],
  [/ferritin/, 'Ferritin'],
  [/transferrin sat|% sat|saturation/, 'Transferrin saturation'],
  [/^iron|serum iron|iron, serum/, 'Serum iron'],
  [/\binr\b/, 'INR'],
  [/hba1c|glycated|glycosylated/, 'HbA1c'],
  [/vitamin d|25.?oh/, 'Vitamin D'],
  [/egfr|gfr estimated|^gfr/, 'eGFR'],
];

export function trendKey(test) {
  const t = String(test).toLowerCase().trim();
  for (const [re, name] of ALIASES) if (re.test(t)) return name;
  return null; // only trend well-known tests
}

export const num = v => {
  const m = String(v ?? '').replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

export function parseRange(range) {
  const m = String(range ?? '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : null;
}

// Platelets/WBC are reported both as "72" (thou/mm3) and "72000" (/µL); put them on one scale.
export function normaliseValue(key, value, unit) {
  if ((key === 'Platelets' || key === 'White cells (TLC)') && value > 1000) return value / 1000;
  if (key === 'CRP' && /mg\/dl/i.test(unit || '')) return value * 10;
  return value;
}
