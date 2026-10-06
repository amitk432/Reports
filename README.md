# Papa's Medical Records

All of Ram Kewal Mahato's medical reports, renamed and filed by hospital, plus a web app to search them.

**Live app:** https://amitk432.github.io/Reports/

## Folder structure

```
👴 Papa/
├── records/                     Original reports (photos/PDFs), one folder per hospital
│   ├── index.json               Master index: every report with date, source, doctor, all results, notes
│   └── <Hospital>/<Category>/<Type>_<YYYY-MM-DD>[_pN].jpg
├── reports/                     Documents prepared from the records (PDF, Excel, Markdown)
│   └── hospital-summaries/      Older per-hospital write-ups
├── app/                         Web app (React + Vite, static — no server)
│   ├── src/                     App code (Overview, Report Index, Lab Trends, Summaries, Viewer)
│   └── scripts/check-index.mjs  Fails the build if index.json and records/ disagree
└── .github/workflows/deploy.yml Builds app/ and publishes to GitHub Pages on push to main
```

Categories: `Lab_Reports`, `Microbiology`, `Radiology`, `Cardiology`, `Pathology`, `Prescriptions`,
`Clinical_Notes`, `Medication_Charts`, `Bills`, `Other`. Lab reports done by an outside lab
(e.g. Dr Lal PathLabs) on a hospital inpatient are filed under that hospital; the lab is shown as *Issued by*.

## Run the app locally

```bash
npm --prefix app install
npm run dev        # http://localhost:3000
npm run build      # checks the index, then builds app/dist
```

## Adding a new report

1. Save it as `records/<Hospital>/<Category>/<Type>_<YYYY-MM-DD>.jpg`.
2. Add an entry to `records/index.json` (copy an existing one; give it the next `R-` id).
3. `npm run check` confirms every file is indexed.

Values in the index are transcribed from photographs — confirm against the original before acting on them.

## CareAtlas interface

The redesigned app has a care overview, focused 3D damage and infection diagrams, a searchable
report library, a treatment timeline, lab trends, and prepared care summaries.

- **Damage & causes:** Focused brain, mitral valve, bloodstream, kidney and left-hip
  diagrams replace the full-body model. Select a report-named region to see the
  documented injury and open its source evidence. The latest brain MRI has nine
  selectable region groups, distinguishing infarcts, haemorrhage and chronic changes.
  Damage-process explanations include a play/pause illustration; possible causes
  distinguish confirmed findings from unconfirmed mechanisms. Dated evidence and
  missing follow-up information explain what can be said about progression.
  Highlight shapes and sizes are schematic, not MRI-derived lesion boundaries;
  precise lesion mapping requires scan data and clinical review. Animations are
  educational and do not show live infection spread or continuing patient injury.
- **Area notes:** Add observations or questions and optionally link a report. Notes
  are saved in this browser's local storage, labeled as family notes, and can be
  deleted. They do not synchronize between devices or alter the medical records.
- **All reports:** Search the original collection, filter by hospital/type/date or
  flagged findings, and view or download each original. The viewer includes
  transcribed results, source metadata, and transcription cautions. Photographed
  documents can be rotated, zoomed, and fitted to the viewer. Escape closes
  the viewer; arrow keys move between filtered reports.
- **Treatment timeline:** All dated and undated original records appear alongside
  the curated treatment milestones. The final June pus culture and October blood
  culture appear on their reporting dates, separately from collection. Expand a
  record for its summary and treatment details, or open the original. The October
  medication list is a historical chart, not confirmation of today's regimen.
- **Care summaries:** View prepared text, PDF, and web documents, or download them
  and the spreadsheet. Existing source cautions are retained.

The original report files and `records/index.json` remain the source of truth.

### Browser verification

With Google Chrome installed, start a local preview and run the interaction checks:

```bash
npm --prefix app run dev -- --host 127.0.0.1 --port 3010
npm --prefix app run test:ui
```

`TEST_BASE_URL` can point the suite at another local or deployed preview. The suite
checks 3D interactions, source downloads, note persistence, library filters,
all timeline records, prepared summaries, and mobile layouts. Screenshots and the
verification result are written to `Output/UI_Redesign/`.

## Current admission and new reports

As of the family update on 7 October 2026, Papa is in the **BLK-Max Hospital ICU
with ventilator support**. The exact admission date and current medication chart
have not been supplied. Inpatient MRI brain imaging is dated 6 October 2026.

File subsequent reports under `records/BLK-Max Hospital/<Category>/`, using the
actual examination or collection date printed on the document. The issuing lab
can differ from the admission hospital. Preserve both dates when the report is
issued later. Separate pages use `_p1`, `_p2`, etc.; they are pages of one study,
not separate examinations. Add each page to `records/index.json`.

The latest MRI pages are R-115 and R-116. The family explanation is
`reports/BLK_Max_MRI_Family_Review_2026-10-07.md`. MRI findings, family-reported
ventilator status, and an uncertain prognosis are kept distinct.
