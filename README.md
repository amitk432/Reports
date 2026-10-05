# 🩺 Papa's Clinical Dossier & 3D Interactive Web Application

[![Live Deployment](https://img.shields.io/badge/Live%20App-GitHub%20Pages-2563eb?style=for-the-badge&logo=github)](https://amitk432.github.io/Reports/)
[![Full-Stack Package](https://img.shields.io/badge/Full--Stack%20Package-Node.js%20%2B%20React%20%2B%20Three.js-0284c7?style=for-the-badge&logo=react)](file:///Users/amit/Downloads/👴%20Papa/webapp)
[![Total Documents](https://img.shields.io/badge/Medical%20Archive-121%20Documents-10b981?style=for-the-badge&logo=microsoftexcel)](https://amitk432.github.io/Reports/#documents)

A medical dossier and full-stack web application designed for interactive 3D anatomical disease visualization, longitudinal laboratory tracking, and medical record indexing across 10 hospital centers.

---

## 🌐 Live Web Application & Deployment

* **Live Interactive Application:** [https://amitk432.github.io/Reports/](https://amitk432.github.io/Reports/)
* **GitHub Repository:** [https://github.com/amitk432/Reports](https://github.com/amitk432/Reports)

---

## 📦 Project Structure

```
👴 Papa/
├── webapp/                               # 🚀 FULL-STACK WEB APPLICATION PACKAGE
│   ├── server/                           # Express.js REST API Backend
│   │   ├── server.js                     # REST API & document streaming endpoints
│   │   └── data/                         # Clinical datasets (JSON)
│   │       ├── patient.json              # Demographics, vitals & comorbidities
│   │       ├── infections.json           # Exact 3D coordinates & pathogen specs
│   │       ├── labs.json                 # Serial 13-date biomarker progress
│   │       └── documents.json            # 121 indexed documents with links
│   ├── src/                              # React 18 + Three.js Frontend
│   │   ├── components/
│   │   │   ├── ThreePatientScene.jsx     # Realistic 3D patient mesh & infection plotting
│   │   │   ├── InfectionDetailCard.jsx   # Clinical & microbiological inspection card
│   │   │   ├── DocumentArchive.jsx       # 121-document searchable archive explorer
│   │   │   ├── DocumentViewerModal.jsx   # In-app image/PDF/markdown viewer
│   │   │   ├── LongitudinalLabs.jsx      # Serial lab matrix with alert badges
│   │   │   ├── PatientHeader.jsx         # Clinical vitals & critical alert banner
│   │   │   └── ClinicalSummaryTab.jsx    # 6-stage pathophysiology breakdown
│   │   ├── App.jsx                       # Main application state & routing
│   │   └── index.css                     # Glassmorphic dark design system
│   ├── package.json                      # Webapp dependencies & scripts
│   └── vite.config.js                    # Vite bundler & API proxy configuration
├── index.html                            # Standalone WebGL Application for GitHub Pages
├── Lab_Values_Progress_Report.pdf        # Print-ready Vector PDF Report (1.7 MB)
├── Lab_Values_Progress_Report.xlsx       # Multi-sheet longitudinal Excel Workbook
├── Complete_Treatment_Summary.md         # Comprehensive Clinical Summary
├── package.json                          # Root convenience runner
└── 📄 Documents/                         # 📁 MASTER HOSPITAL ARCHIVES (121 Files)
    ├── Chandra Laxmi Hospital/           # 24 documents (ICU, Cardiology, Labs, Rx)
    ├── Janakpuri Super Speciality/       # 43 documents (Echo, KFT, LFT, Viral, FibroScan)
    ├── GB Pant Hospital/                 # 2 documents (Kidney Biopsy Report)
    ├── SilverStreak Hospital/            # 11 documents (Pus Culture, PCT 11.16, CBC)
    ├── Sir Ganga Ram Hospital/           # 5 documents (Nephrology Consultation, Labs)
    ├── Artemis Hospital/                 # 2 documents (Clinical notes)
    ├── Dr Lal PathLabs/                  # 18 documents (Outpatient serial labs)
    ├── Thyrovision Labs/                 # 6 documents (Outpatient serial labs)
    ├── Prognosis Laboratories/           # 2 documents (Outpatient serial labs)
    └── Other/                            # 7 documents (Vaccination, miscellaneous)
```

---

## 🧬 Exact 3D Infection Loci Plotted on Patient

| # | Anatomical Site | Exact 3D Coordinates | Pathogen & Lab Spec | Confirmatory Source |
|---|---|---|---|---|
| **1** | **Left Hip Joint (PJI Source)** | `X: -0.90, Y: -0.40, Z: 0.15` | *Klebsiella pneumoniae* (MDR, biofilm on hardware) | Pus Culture (SilverStreak 2026-06-27) |
| **2** | **Vascular Highway (IVC)** | `X: -0.20, Y: 0.70, Z: 0.10` | Sepsis / Bacteremia (Peak PCT: **11.16 ng/mL**) | Lab Report (SilverStreak 2026-05-23) |
| **3** | **Mitral Valve Leaflet** | `X: -0.15, Y: 1.65, Z: 0.45` | **1.9 cm x 0.8 cm mobile vegetation**, severe MR | 2D Echo (Janakpuri 2026-04-18) |
| **4** | **Brain (Bilateral Hemispheres)** | `X: -0.30, Y: 3.55, Z: 0.25` | Cardioembolic multifocal ischemic stroke infarcts | Neuro Consultation & Echo correlation |
| **5** | **Bilateral Kidneys** | `X: -0.55, Y: 1.15, Z: -0.20` | Diabetic Glomerulosclerosis + ATN (CKD Stage 5) | Renal Biopsy (GB Pant 2026-04-29) |

---

## 💻 Running the Full-Stack Web App Locally

```bash
# 1. Install dependencies
npm --prefix webapp install

# 2. Run backend API (port 5001) + frontend (port 3000) concurrently
npm run dev

# 3. Or build and run production server
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) (Dev) or [http://localhost:5001](http://localhost:5001) (Production).
