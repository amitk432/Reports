// Every clinical marker links to the existing transcribed source records.
// Focused region coordinates and their limits are defined in diagramClinical.js.
export const AREAS = [
  {
    id: "heart",
    name: "Heart & mitral valve",
    short: "Mitral valve",
    status: "Suspected",
    type: "infection",
    color: "#edba69",
    date: "2026-09-29",
    title: "Possible mitral valve vegetation",
    detail:
      "The echo describes a possible 1.9 × 1.8 cm vegetation on the anterior mitral leaflet, with LVEF 40% and moderate MR/TR.",
    context:
      "TEE was advised. No TEE result is available in these records, so the valve infection remains suspected.",
    sources: ["R-087", "R-084"],
  },
  {
    id: "brain",
    name: "Brain",
    short: "Brain",
    status: "Documented",
    type: "complication",
    color: "#d89085",
    date: "2026-10-06",
    title: "Multiple acute strokes & small haemorrhages",
    detail:
      "BLK-Max MRI describes multiple acute infarcts in both cerebral and cerebellar hemispheres, posterior corpus callosum and periventricular regions. Tiny right temporal/right high parietal haemorrhages and minimal intraventricular bleeding are reported, without significant mass effect or midline shift.",
    context:
      "The radiologist considers an embolic or low-blood-flow mechanism and advises vascular / cardiac evaluation. The cause and whether these are new lesions since 30 September require confirmation. The model does not locate exact lesions or predict recovery.",
    sources: ["R-115", "R-116", "R-089"],
  },
  {
    id: "blood",
    name: "Bloodstream",
    short: "Bloodstream",
    status: "Confirmed",
    type: "infection",
    color: "#e97e76",
    date: "2026-10-01",
    title: "Enterobacter cloacae isolated",
    detail:
      "Blood collected on 1 October grew Enterobacter cloacae in the final culture reported on 4 October. The report includes its antibiotic susceptibility results.",
    context:
      "Bloodstream infection is confirmed by culture. The entry site and whether it caused the valve finding are not established in the supplied records.",
    sources: ["R-098", "R-099", "R-100"],
  },
  {
    id: "kidneys",
    name: "Kidneys",
    short: "Kidneys",
    status: "Documented",
    type: "condition",
    color: "#89b7b0",
    date: "2026-04-29",
    title: "Diabetic kidney disease · dialysis",
    detail:
      "Biopsy documents diabetic nephropathy with 50–60% tubular atrophy / interstitial fibrosis. Nephrology records document CKD G5 on maintenance haemodialysis three times weekly.",
    context:
      "This is a background condition. The records do not establish a kidney infection.",
    sources: ["R-031", "R-055", "R-063"],
  },
  {
    id: "hip",
    name: "Left hip surgical site",
    short: "Left hip",
    status: "Historical",
    type: "infection",
    color: "#b4a3d9",
    date: "2026-06-27",
    title: "Surgical site infection · Klebsiella",
    detail:
      "The June prescription describes active pus discharge around the left hip hemiarthroplasty. The pus culture grew Klebsiella species with a multidrug-resistant pattern.",
    context:
      "This is a documented previous infection. It is a different organism from the October blood culture; a link between the two episodes is not established.",
    sources: ["R-065", "R-066"],
  },
];
export function loadMarks() {
  try {
    const value = JSON.parse(
      localStorage.getItem("care-atlas-marks-v1") || "[]",
    );
    return Array.isArray(value)
      ? value.filter(
          (m) =>
            AREAS.some((a) => a.id === m.area) && typeof m.note === "string",
        )
      : [];
  } catch {
    return [];
  }
}

// Culture collection and final reporting are separate care milestones.
export function careMilestones(data) {
  const finalCultures = ["R-066", "R-098"].flatMap((id) => {
    const report = data.reports.find((r) => r.id === id);
    if (!report?.reportedDate || report.reportedDate === report.date) return [];
    return [
      {
        date: report.reportedDate,
        title:
          id === "R-098"
            ? "Final blood culture: Enterobacter cloacae"
            : "Final hip pus culture: Klebsiella species",
        detail: report.summary,
        sources: [id],
      },
    ];
  });
  return [...data.timeline, ...finalCultures].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}
