# 🩺 Papa's Clinical Dossier — Full-Stack Web Application

A full-stack medical web application featuring a realistic **3D anatomical patient model** with exact infection loci mapping, longitudinal laboratory progress matrices, and a master document archive indexing all 121 multi-hospital medical records with direct viewing and downloading links.

---

## 🏗️ Architecture

- **Backend (`webapp/server/`):**
  - **Node.js & Express API Engine**
  - `/api/patient`: Clinical profile, demographics, comorbidities, critical alert parameters.
  - `/api/infections`: 3D coordinates, pathogen specs (*Klebsiella pneumoniae* MDR), antibiogram, severity, and hospital references.
  - `/api/labs`: Multi-milestone serial lab matrix across 13 dates with reference ranges and status alerts.
  - `/api/documents`: Full catalog of 121 indexed records across 10 hospitals with keyword search and category filtering.
  - `/documents-file/*`: High-speed binary document streaming with MIME type resolution for in-app viewing and downloads.

- **Frontend (`webapp/src/`):**
  - **React 18 + Vite + Three.js**
  - **Realistic 3D Anatomical Diagram:** Realistic silhouette, skull/brain with stroke lesions, heart with oscillating 1.9 cm mitral vegetation, aorta & vascular tree, bilateral kidneys (CKD Stage 5), and left hip prosthesis with sinus tract.
  - **Exact Infection Loci Plotted in 3D:** Interactive pulsing biohazard hotspots with raycasting click detection, smooth camera fly-to, and animated bacteremia particle streams.
  - **Master Document Archive:** Live filterable grid and table view of all 121 medical records across 10 hospitals with preview modal.
  - **Serial Labs Progress Matrix:** 13-date comparative laboratory table with critical status indicators and filter search.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ (tested on v24.5)
- npm v9+

### 1. Install Dependencies
```bash
# From workspace root:
npm --prefix webapp install

# Or inside webapp directory:
cd webapp
npm install
```

### 2. Run in Development Mode
Starts both Express backend (`http://localhost:5001`) and Vite frontend (`http://localhost:3000`):
```bash
npm run dev
```

### 3. Production Build & Start
```bash
npm run build
npm start
```
The server will serve the compiled React application and all REST APIs at `http://localhost:5001`.
