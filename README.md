# 🏥 Clinical Dossier & 3D Interactive Medical Web Application
### Patient: Ram Kewal Mahato (62 Years / Male)

[![Live Web Application](https://img.shields.io/badge/Live_App-GitHub_Pages-2563eb?style=for-the-badge&logo=github)](https://amitk432.github.io/Reports/)
[![Download PDF Report](https://img.shields.io/badge/Download-Vector_PDF_Report-ef4444?style=for-the-badge&logo=adobeacrobatreader)](./Lab_Values_Progress_Report.pdf)
[![Download Excel Data](https://img.shields.io/badge/Download-Excel_Data_Workbook-10b981?style=for-the-badge&logo=microsoftexcel)](./Lab_Values_Progress_Report.xlsx)

---

## 🌐 Live Web Application & Interactive 3D Anatomy
Experience the full 3D interactive web application directly in your browser:
👉 **[https://amitk432.github.io/Reports/](https://amitk432.github.io/Reports/)**

### Key Web Application Features:
1. **Interactive 3D WebGL Anatomical Model**:
   - **Rotate 360°**: Click and drag to orbit around the body.
   - **Zoom In / Out**: Scroll or pinch to inspect microscopic lesions or view the full body.
   - **Camera Presets**: Instant fly-to navigation for `🧠 Brain`, `🫀 Heart`, `🫘 Kidneys`, `🦴 Left Hip`, and `🩸 Vascular Highway`.
   - **Animated Particle Streams**: Watch bacteria rise from the infected left hip through the pelvic veins into the heart, and septic emboli launch into the brain.
2. **Interactive 6-Stage Disease Progression Walkthrough**:
   - Auto-Play simulation with synchronized 3D camera fly-throughs.
   - Complete pathophysiology narrative from diabetic kidney failure to cardioembolic strokes.
3. **Visual 5-Stage Domino Causal Flowchart**:
   - Explains the bodily chain reaction in plain language with laboratory proofs.
4. **4 Micro-Anatomical Organ Cutaway Diagrams**:
   - Mitral valve vegetation (1.9 × 1.8 cm, LVEF 40%).
   - Brain cerebral & cerebellar cardioembolic infarctions with petechial microbleeds.
   - Left hip prosthesis titanium stem with Klebsiella biofilm.
   - Sclerotic diabetic glomerulus (50-60% fibrosis, Kimmelstiel-Wilson lesions).
5. **Hospital Archive Explorer**:
   - Direct access to records and summaries from 10 healthcare facilities (110 records).
6. **Plain-Language Family Q&A**:
   - Clear answers explaining why strokes occurred, why platelets dropped to 64K, and why blood thinners are contraindicated.
7. **Longitudinal Laboratory Data with Real-Time Search & Filtering**:
   - 13 serial testing dates across 6 months with instant parameter search.

---

## 📊 Summary of Critical Diagnoses
1. **End-Stage Renal Disease (CKD Stage G5 on MHD thrice weekly)** secondary to Diabetic Nephropathy (GB Pant Biopsy: 50–60% fibrosis).
2. **Infective Endocarditis** with 1.9 × 1.8 cm mobile anterior mitral valve vegetation and LVEF 40% (Chandra Laxmi Echo).
3. **Cardioembolic Multi-Infarct CVA** in bilateral cerebral & cerebellar hemispheres with petechial microbleeds (Brain MRI 30-Sep-2026).
4. **Severe Septic Shock** with Procalcitonin 11.16 ng/mL and CRP 113.84 mg/L.
5. **Left Hip Prosthetic Joint Infection** with culture-positive *Klebsiella species* (SilverStreak Hospital).

---

## 📁 Repository Structure
```
├── index.html                           # Main 3D Web Application entry point
├── Lab_Values_Progress_Report.html      # Direct report URL alias
├── Lab_Values_Progress_Report.pdf       # High-resolution vector PDF (1.7 MB)
├── Lab_Values_Progress_Report.xlsx      # Multi-tab longitudinal Excel workbook
├── Complete_Treatment_Summary.md        # Master clinical narrative & hospital index
├── Lab_Values_Progress_Report.md        # Markdown tables
├── js/
│   ├── three.min.js                     # Offline Three.js library
│   └── OrbitControls.js                 # Offline OrbitControls
├── 📄 Documents/                        # 110 categorized hospital records
│   ├── Chandra Laxmi Hospital/ (23 files)
│   ├── Dr Lal PathLabs/ (17 files)
│   ├── GB Pant Hospital/ (1 file - Biopsy)
│   ├── Janakpuri Super Speciality/ (42 files)
│   ├── SilverStreak Hospital/ (10 files)
│   ├── Sir Ganga Ram Hospital/ (4 files)
│   ├── Thyrovision Labs/ (5 files)
│   ├── Artemis Hospital/ (1 file)
│   ├── Prognosis Laboratories/ (1 file)
│   └── Other/ (6 files)
└── .github/workflows/deploy.yml         # GitHub Actions automated deployment
```

---

## 🚀 Deployment Instructions
This repository automatically deploys to GitHub Pages via GitHub Actions:
- **Repository:** [https://github.com/amitk432/Reports](https://github.com/amitk432/Reports)
- **Deployment URL:** [https://amitk432.github.io/Reports/](https://amitk432.github.io/Reports/)
