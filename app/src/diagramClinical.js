// Coordinates indicate report-named anatomical regions, never MRI-derived lesion boundaries.
const region = (id, name, position, scale, kind, detail) => ({
  id,
  name,
  position,
  scale,
  kind,
  detail,
});
export const DIAGRAMS = {
  brain: {
    title: "Brain · MRI region map",
    date: "2026-10-06",
    orientation: "Front view at reset · patient right is screen left",
    boundary:
      "Named regions from the MRI report. Highlight sizes, shapes and positions within each region are schematic; the MRI scan files are needed to map exact lesions.",
    regions: [
      region(
        "cerebral",
        "Both cerebral hemispheres",
        [-1.12, 0.48, 0.66],
        [0.15, 0.15, 0.12],
        "infarct",
        "Multiple acute infarcts are reported in both cerebral hemispheres. The total number, volume and exact cortical distribution are not supplied.",
      ),
      region(
        "frontal",
        "Right posterior frontal region",
        [-0.72, 1.03, 0.42],
        [0.22, 0.19, 0.12],
        "infarct",
        "The largest acute infarct is described in the right posterior frontal region. Its measurements and exact boundary are not given.",
      ),
      region(
        "callosum",
        "Posterior corpus callosum",
        [0.13, 0.3, -0.24],
        [0.1, 0.1, 0.12],
        "infarct",
        "A small acute diffusion-restricting focus is described in the posterior corpus callosum, left of the midline — the fibre bridge between the hemispheres.",
      ),
      region(
        "peri",
        "White matter beside both lateral ventricles",
        [0.31, 0.42, 0.06],
        [0.1, 0.14, 0.12],
        "infarct",
        "Tiny acute foci are reported in bilateral periventricular white matter, adjacent to the lateral ventricles.",
      ),
      region(
        "cerebellum",
        "Both cerebellar hemispheres",
        [-0.48, -0.93, -0.25],
        [0.19, 0.14, 0.13],
        "infarct",
        "Multiple acute infarcts affect both sides of the cerebellum, at the lower back of the brain. Small old left cerebellar infarcts are also described.",
      ),
      region(
        "temporal",
        "Right temporal region",
        [-1.12, -0.15, 0.3],
        [0.1, 0.1, 0.09],
        "bleed",
        "Tiny haemorrhage is reported in the right temporal region, along the side of the cerebrum. Its exact location and size are not supplied.",
      ),
      region(
        "parietal",
        "Right high parietal region",
        [-0.6, 1.22, -0.3],
        [0.1, 0.09, 0.1],
        "bleed",
        "Tiny haemorrhage is reported in the right high parietal region, toward the upper back of the cerebrum.",
      ),
      region(
        "ventricles",
        "Lateral ventricles & fourth ventricle",
        [-0.28, 0.18, -0.28],
        [0.09, 0.12, 0.1],
        "bleed",
        "Minimal blood is described in dependent portions of both lateral ventricles and the fourth ventricle. The blue structures show these fluid spaces; highlighted dots are region indicators.",
      ),
      region(
        "chronic",
        "Pons & chronic background changes",
        [0, -0.8, 0.07],
        [0.09, 0.09, 0.1],
        "chronic",
        "A small chronic pontine microbleed is reported. Diffuse cerebral atrophy and chronic white-matter ischaemic changes are also present; this marker locates the pons only.",
      ),
    ],
    steps: [
      "An artery becomes blocked, or overall blood delivery falls.",
      "Brain tissue receives too little oxygen and nutrients.",
      "Infarction means tissue injury from that loss of blood supply. Small areas of bleeding are a separate MRI finding.",
    ],
    processNote:
      "The animation illustrates an arterial blockage. It does not show a proven blockage, its source, or continuing injury in this patient.",
    causes: [
      {
        title: "Embolic mechanism · considered on MRI",
        text: "A travelling clot or debris may block brain arteries. The MRI distribution prompted this possibility; no clot origin is confirmed.",
      },
      {
        title: "Hypoperfusion · alternative on MRI",
        text: "Reduced overall blood flow may injure brain tissue. Blood-pressure and oxygen records are needed to assess this possibility.",
      },
      {
        title: "Mitral valve finding · possible link",
        text: "The earlier echo questioned a vegetation. A valve source remains unconfirmed; no TEE result is supplied. The cause of the tiny haemorrhages is also not established.",
      },
    ],
    history: [
      {
        date: "2026-09-30",
        title: "Earlier brain MRI",
        text: "Bilateral cerebral/cerebellar infarcts, mild left frontal subarachnoid blood and minimal ventricular blood were described.",
        sources: ["R-089"],
      },
      {
        date: "2026-10-06",
        title: "Latest BLK-Max MRI",
        text: "Multiterritorial acute infarcts and small haemorrhages; no significant mass effect or midline shift. No explicit comparison with the earlier scan.",
        sources: ["R-115", "R-116"],
      },
    ],
    current:
      "Progression cannot be measured from these two written descriptions. Newly mentioned regions do not prove new strokes, and unmentioned findings do not prove resolution. Ask the team to compare the actual scans and the examination with sedation accounted for.",
    education: {
      title: "NINDS · How strokes happen",
      url: "https://www.ninds.nih.gov/health-information/stroke/stroke-overview",
    },
  },
  heart: {
    title: "Mitral valve · leaflet close-up",
    date: "2026-09-29",
    orientation: "Schematic open valve · anterior leaflet highlighted",
    boundary:
      "Valve close-up, not a scan reconstruction. The possible vegetation was measured at 1.9 × 1.8 cm on echo; model dimensions are illustrative.",
    regions: [
      region(
        "leaflet",
        "Anterior mitral leaflet",
        [0, 0.37, 0.25],
        [0.23, 0.19, 0.16],
        "suspected",
        "The echo questions a 1.9 × 1.8 cm vegetation on the anterior mitral leaflet. This is the suspected site, not a confirmed diagnosis of endocarditis.",
      ),
    ],
    steps: [
      "In endocarditis, bacteria can attach to the inner heart lining or a valve.",
      "A vegetation can form on the valve and interfere with its function.",
      "Pieces may detach and obstruct vessels elsewhere. This route is possible, but is not proven in this patient.",
    ],
    processNote:
      "The moving particles illustrate blood passing through a valve. They do not establish infected material travelling to this patient's brain.",
    causes: [
      {
        title: "Valve infection · suspected",
        text: "Echo advised TEE to clarify the possible vegetation. The supplied records do not include that result.",
      },
      {
        title: "October blood culture · separate confirmed finding",
        text: "Enterobacter cloacae grew in blood. A link to this valve finding has not been established.",
      },
    ],
    history: [
      {
        date: "2026-09-29",
        title: "Echo finding",
        text: "Possible anterior mitral leaflet vegetation; LVEF 40%, moderate MR/TR; TEE advised.",
        sources: ["R-087", "R-084"],
      },
    ],
    current:
      "No later echo or TEE is supplied. The current size, persistence and treatment response of the suspected vegetation are unknown.",
    education: {
      title: "NHLBI · Endocarditis",
      url: "https://www.nhlbi.nih.gov/health/heart-inflammation/endocarditis",
    },
  },
  blood: {
    title: "Bloodstream · vessel close-up",
    date: "2026-10-04",
    orientation: "Illustrative vessel segment · no specific vessel identified",
    boundary:
      "A blood culture confirms an organism in the blood. It cannot locate the infection's entry point; bacteria shown here are illustrative.",
    regions: [
      region(
        "culture",
        "Circulating blood",
        [0, 0, 0.15],
        [0.16, 0.12, 0.1],
        "infection",
        "Enterobacter cloacae was isolated from blood collected on 1 October, finalised on 4 October. This represents the bloodstream, not an identified local source.",
      ),
    ],
    steps: [
      "An organism enters the bloodstream from a source that requires clinical investigation.",
      "A blood sample is cultured to identify the organism.",
      "Susceptibility results guide the treating team's antibiotic choice; repeat cultures and clinical observations help assess response.",
    ],
    processNote:
      "Particles represent circulation and a positive culture, not a measured bacterial load or a live view of infection spreading.",
    causes: [
      {
        title: "Entry site · not established",
        text: "The available culture does not identify a wound, line, lung, urinary tract or valve as the source.",
      },
      {
        title: "Earlier hip infection · no proven link",
        text: "June pus culture grew Klebsiella species, a different organism. The records do not connect these episodes.",
      },
    ],
    history: [
      {
        date: "2026-10-01",
        title: "Blood sample collected",
        text: "Blood culture specimen taken.",
        sources: ["R-098"],
      },
      {
        date: "2026-10-04",
        title: "Final culture",
        text: "Enterobacter cloacae identified with antibiotic susceptibility results.",
        sources: ["R-098"],
      },
    ],
    current:
      "No repeat BLK-Max blood culture or current antibiotic chart is supplied. Clearance, persistence and treatment response cannot yet be shown.",
  },
  kidneys: {
    title: "Kidney · tissue cutaway",
    date: "2026-04-29",
    orientation: "Illustrative kidney section · biopsy side not mapped",
    boundary:
      "The biopsy's 50–60% tubular atrophy / interstitial fibrosis refers to the sampled tissue. Highlighting is not a percentage map of an entire kidney.",
    regions: [
      region(
        "tissue",
        "Tubules & surrounding interstitial tissue",
        [0.75, 0.65, 0.56],
        [0.2, 0.2, 0.1],
        "chronic",
        "Biopsy documents diabetic nephropathy with 50–60% tubular atrophy / interstitial fibrosis in the sample. Nephrology records document CKD G5 and maintenance haemodialysis.",
      ),
    ],
    steps: [
      "Diabetes can damage the kidney's small blood vessels and filtering system over time.",
      "Tubules and surrounding tissue can become damaged and scarred.",
      "When kidney function is severely reduced, dialysis supports waste and fluid removal; it does not map or reverse the scarring shown by biopsy.",
    ],
    processNote:
      "The highlighted tissue represents biopsy-described damage. It is not a kidney infection or a measured current rate of decline.",
    causes: [
      {
        title: "Diabetic nephropathy · biopsy documented",
        text: "The biopsy supports diabetes-related kidney damage. The supplied evidence does not establish a kidney infection.",
      },
    ],
    history: [
      {
        date: "2026-04-29",
        title: "Kidney biopsy",
        text: "Diabetic nephropathy with tubular atrophy and interstitial fibrosis.",
        sources: ["R-031"],
      },
      {
        date: "2026-06-05",
        title: "Nephrology follow-up records",
        text: "CKD G5; maintenance haemodialysis three times weekly recorded in the June care records.",
        sources: ["R-055", "R-063"],
      },
    ],
    current:
      "Current BLK-Max dialysis schedule, urine output and laboratory trends are not supplied. The biopsy documents longstanding damage, not current progression.",
    education: {
      title: "NIDDK · Diabetic kidney disease",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-kidney-disease",
    },
  },
  hip: {
    title: "Left hip · surgical-site close-up",
    date: "2026-06-27",
    orientation: "Left hemiarthroplasty · surgical wound shown schematically",
    boundary:
      "The report locates pus around the left hip surgical site. It does not map a deep abscess or establish infection of bone or the implant.",
    regions: [
      region(
        "wound",
        "Left hip surgical wound",
        [0.65, 0.05, 0.42],
        [0.18, 0.38, 0.1],
        "historical",
        "June records describe active pus discharge around the left hip hemiarthroplasty. Pus culture grew Klebsiella species; the exact depth and extent are not established here.",
      ),
    ],
    steps: [
      "Pus discharge was observed at the surgical site.",
      "A pus sample grew Klebsiella species with a multidrug-resistant pattern.",
      "Treatment response requires wound examination and follow-up records; the October blood organism is different.",
    ],
    processNote:
      "The highlighted wound represents a historical June finding. It does not show active pus or current spread.",
    causes: [
      {
        title: "Surgical-site infection · historical",
        text: "Klebsiella was identified in pus. The records do not identify how it entered the wound or prove implant/bone involvement.",
      },
    ],
    history: [
      {
        date: "2026-06-27",
        title: "Pus discharge recorded",
        text: "Left hip surgical-site infection described.",
        sources: ["R-065"],
      },
      {
        date: "2026-06-29",
        title: "Final pus culture",
        text: "Klebsiella species identified with susceptibility results.",
        sources: ["R-066"],
      },
    ],
    current:
      "No recent wound examination or repeat culture is supplied. The current wound condition and whether this infection has resolved are unknown.",
  },
};
export const REGION_COLORS = {
  infarct: "#edba69",
  bleed: "#f0808c",
  chronic: "#93bab3",
  suspected: "#edba69",
  infection: "#f0808c",
  historical: "#b4a3d9",
};
