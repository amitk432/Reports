import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Load static clinical datasets
const dataDir = path.join(__dirname, 'data');
const patientData = JSON.parse(fs.readFileSync(path.join(dataDir, 'patient.json'), 'utf8'));
const infectionsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'infections.json'), 'utf8'));
const labsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'labs.json'), 'utf8'));
const documentsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'documents.json'), 'utf8'));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Papas Clinical Dossier API', timestamp: new Date().toISOString() });
});

app.get('/api/patient', (req, res) => {
  res.json(patientData);
});

app.get('/api/infections', (req, res) => {
  res.json(infectionsData);
});

app.get('/api/infections/:id', (req, res) => {
  const item = infectionsData.find(i => i.id === req.params.id || i.key === req.params.id);
  if (!item) return res.status(404).json({ error: 'Infection locus not found' });
  res.json(item);
});

app.get('/api/labs', (req, res) => {
  const { category, search } = req.query;
  let results = labsData;
  if (category) {
    results = results.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.map(cat => ({
      ...cat,
      tests: cat.tests.filter(t => t.name.toLowerCase().includes(q) || t.trend.toLowerCase().includes(q))
    })).filter(cat => cat.tests.length > 0);
  }
  res.json(results);
});

app.get('/api/documents', (req, res) => {
  const { q, hospital, category, fileType } = req.query;
  let filtered = [...documentsData];

  if (hospital && hospital !== 'all') {
    filtered = filtered.filter(d => d.hospital.toLowerCase() === hospital.toLowerCase());
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }
  if (fileType && fileType !== 'all') {
    filtered = filtered.filter(d => d.fileType.toLowerCase() === fileType.toLowerCase());
  }
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(d => 
      d.displayName.toLowerCase().includes(query) ||
      d.filename.toLowerCase().includes(query) ||
      d.hospital.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query)
    );
  }

  res.json({
    total: filtered.length,
    documents: filtered
  });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = documentsData.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});

// Stream actual document files from workspace root
app.get('/documents-file/*', (req, res) => {
  const rawPath = req.params[0];
  const decodedPath = decodeURIComponent(rawPath);
  const safePath = path.resolve(workspaceRoot, decodedPath);

  // Security check: ensure path is within workspaceRoot
  if (!safePath.startsWith(workspaceRoot)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!fs.existsSync(safePath)) {
    return res.status(404).json({ error: 'File not found on disk', path: decodedPath });
  }

  const ext = path.extname(safePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  
  // Inline viewing for images, pdf, and markdown; download for others
  const isInline = ['.jpg', '.jpeg', '.png', '.pdf', '.md', '.txt'].includes(ext);
  const disposition = isInline ? 'inline' : 'attachment';
  res.setHeader('Content-Disposition', `${disposition}; filename="${path.basename(safePath)}"`);

  const fileStream = fs.createReadStream(safePath);
  fileStream.pipe(res);
});

// Production static file serving
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🩺 Papa's Clinical Dossier Backend API running on http://localhost:${PORT}`);
});
