import React, { useEffect, useState } from "react";
import ReportIndex from "./components/ReportIndex.jsx";
import LabTrends from "./components/LabTrends.jsx";
import Summaries from "./components/Summaries.jsx";
import Viewer from "./components/Viewer.jsx";
import Portal from "./components/Portal.jsx";
import TreatmentTimeline from "./components/TreatmentTimeline.jsx";
import Icon from "./components/Icon.jsx";
import { fmtDate } from "./lib.js";
import { careMilestones } from "./clinical.js";

const TABS = [
  ["overview", "Care overview", "grid"],
  ["portal", "Damage & causes", "diagram"],
  ["index", "All reports", "file"],
  ["timeline", "Treatment timeline", "timeline"],
  ["trends", "Lab trends", "trend"],
  ["summaries", "Care summaries", "heart"],
];
const tabFromHash = () =>
  TABS.some(([k]) => k === location.hash.slice(1))
    ? location.hash.slice(1)
    : "overview";
export default function App() {
  const [data, setData] = useState(null),
    [error, setError] = useState(null),
    [tab, setTab] = useState(tabFromHash),
    [viewing, setViewing] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("records/index.json", { signal: controller.signal })
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    const onHash = () => {
      setTab(tabFromHash());
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", onHash);
    return () => {
      controller.abort();
      removeEventListener("hashchange", onHash);
    };
  }, []);
  if (error)
    return (
      <div className="load-screen">
        <Icon name="info" />
        <h1>Records could not be loaded</h1>
        <p>{error}</p>
        <button className="btn" onClick={() => location.reload()}>
          Try again
        </button>
      </div>
    );
  if (!data)
    return (
      <div className="load-screen">
        <div className="brand-symbol">
          <Icon name="heart" size={26} />
        </div>
        <h1>Opening your care space</h1>
        <p className="muted">Gathering records and treatment history…</p>
      </div>
    );
  const byId = Object.fromEntries(data.reports.map((r) => [r.id, r]));
  const open = (report, list = [report]) =>
    setViewing({ list, i: Math.max(0, list.indexOf(report)) });
  const openId = (id) => byId[id] && open(byId[id]);
  const milestones = careMilestones(data);
  const title = {
    overview: "A clearer picture of care.",
    portal: "Explore the story behind each finding.",
    index: "Every report. One place.",
    timeline: "Every step of the care journey.",
    trends: "See how results change.",
    summaries: "The bigger picture, explained.",
  }[tab];
  const subtitle = {
    overview:
      "Understand the findings, revisit the evidence, and follow the journey.",
    portal: "Explore report-named locations, how damage happens, possible causes and dated evidence.",
    index:
      "Search original documents, inspect findings, and download your records.",
    timeline:
      "Investigations, treatments, and hospital visits connected to their evidence.",
    trends: "Longitudinal laboratory results, linked to the original reports.",
    summaries:
      "Family reviews and prepared summaries alongside their source cautions.",
  }[tab];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview">
          <span className="brand-symbol">
            <Icon name="heart" size={23} />
          </span>
          <span>
            Care<span className="brand-light">Atlas</span>
            <small>A FAMILY CARE SPACE</small>
          </span>
        </a>
        <div className="nav-caption">YOUR WORKSPACE</div>
        <nav aria-label="Sections">
          {TABS.map(([k, label, icon]) => (
            <a
              key={k}
              href={"#" + k}
              className={tab === k ? "on" : ""}
              aria-current={tab === k ? "page" : undefined}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {k === "index" && (
                <span className="nav-count">{data.reports.length}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="tiny-dot" /> Connected to original records
          <p>One thoughtful space for the people caring for Papa.</p>
        </div>
        <div className="sidebar-patient">
          <span className="avatar">RM</span>
          <div>
            <b>Ram Kewal Mahato</b>
            <small>Family care profile</small>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="workspace-header">
          <div className="breadcrumb">
            Family workspace <Icon name="chevron" size={13} />
            <span>{TABS.find(([k]) => k === tab)[1]}</span>
          </div>
          <div className="header-right">
            <span className="sync-dot" /> Records updated{" "}
            {fmtDate(data.generated)}
            <span className="avatar small-avatar">AK</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {tab === "overview"
                  ? "CARE, WITH CONTEXT"
                  : TABS.find(([k]) => k === tab)[1].toUpperCase()}
              </div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <a
              className="btn ghost heading-action"
              href={tab === "index" ? "#timeline" : "#index"}
            >
              <Icon name={tab === "index" ? "timeline" : "file"} size={17} />
              {tab === "index" ? "View timeline" : "Browse reports"}
              <Icon name="arrow" size={16} />
            </a>
          </div>
          {tab === "overview" && (
            <>
              <section className="patient-strip">
                <span className="avatar patient-avatar">RM</span>
                <div className="patient-title">
                  <h2>{data.patient.name}</h2>
                  <p>
                    {data.patient.sex} · {data.patient.age} ·{" "}
                    <b>{data.patient.bloodGroup}</b>
                  </p>
                </div>
                <div className="strip-item">
                  <small>
                    {data.patient.currentCare
                      ? "CURRENT CARE · FAMILY UPDATE"
                      : "LATEST HOSPITAL EPISODE"}
                  </small>
                  <b>
                    {data.patient.currentCare?.hospital ||
                      "Chandra Laxmi Hospital"}
                  </b>
                  <span>
                    {data.patient.currentCare
                      ? `${data.patient.currentCare.setting} · ${data.patient.currentCare.support}`
                      : "ICU admission · 28 Sep 2026"}
                  </span>
                </div>
                <div className="strip-item">
                  <small>RECORD COLLECTION</small>
                  <b>{data.reports.length} original reports</b>
                  <span>
                    {new Set(data.reports.map((r) => r.hospital)).size}{" "}
                    hospitals & labs
                  </span>
                </div>
              </section>
              <Portal data={data} openId={openId} compact />
              <div className="overview-bottom">
                <section className="card">
                  <div className="section-heading">
                    <div>
                      <div className="eyebrow">RECENT MILESTONES</div>
                      <h2>The care journey</h2>
                    </div>
                    <a className="text-action" href="#timeline">
                      Full timeline <Icon name="arrow" size={16} />
                    </a>
                  </div>
                  {milestones
                    .slice(-3)
                    .reverse()
                    .map((e) => (
                      <button
                        key={e.date + e.title}
                        className="milestone"
                        onClick={() =>
                          e.sources.length
                            ? openId(e.sources[0])
                            : (location.hash = "timeline")
                        }
                      >
                        <span className="milestone-dot" />
                        <div>
                          <small>{fmtDate(e.date)}</small>
                          <b>{e.title}</b>
                          <p>{e.detail}</p>
                        </div>
                        <Icon name="chevron" size={16} />
                      </button>
                    ))}
                </section>
                <section className="card medication-card">
                  <div className="eyebrow">DOCUMENTED TREATMENT</div>
                  <h2>Last available medication chart</h2>
                  <p className="muted small">{data.patient.medications.asOf}</p>
                  {data.patient.medications.items.slice(0, 4).map((m) => (
                    <div className="med-row" key={m.name}>
                      <span className="med-icon">+</span>
                      <div>
                        <b>{m.name}</b>
                        <small>{m.dose}</small>
                      </div>
                    </div>
                  ))}
                  <button
                    className="text-action"
                    onClick={() => openId(data.patient.medications.sources[0])}
                  >
                    View all {data.patient.medications.items.length} medicines{" "}
                    <Icon name="arrow" size={16} />
                  </button>
                  <p className="chart-caution">
                    Historical chart; subsequent medication changes are not
                    documented here.
                    {data.patient.currentCare?.medicationUpdateAvailable ===
                      false &&
                      " No BLK-Max medication chart has been supplied."}
                  </p>
                </section>
              </div>
              <section className="recorded-alerts">
                <div className="eyebrow">
                  KEY FINDINGS IN THE LATEST RECORDS
                </div>
                <div className="clinical-alerts">
                  {data.patient.alerts.map((alert) => (
                    <details className="card clinical-alert" key={alert.title}>
                      <summary>
                        <Icon name="info" size={18} />
                        <b>{alert.title}</b>
                        <Icon name="plus" size={15} />
                      </summary>
                      <p>{alert.detail}</p>
                      <div className="sources">
                        {alert.sources.map((id) => (
                          <button
                            key={id}
                            className="text-action"
                            onClick={() => openId(id)}
                          >
                            {id}
                            <Icon name="arrow" size={13} />
                          </button>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}
          {tab === "portal" && <Portal data={data} openId={openId} />}
          {tab === "index" && (
            <ReportIndex reports={data.reports} open={open} />
          )}
          {tab === "timeline" && (
            <TreatmentTimeline data={data} openId={openId} />
          )}
          {tab === "trends" && <LabTrends reports={data.reports} open={open} />}
          {tab === "summaries" && <Summaries summaries={data.summaries} />}
          <footer className="disclaimer">
            <Icon name="shield" size={16} />
            <span>
              Family record-keeping · Findings are transcribed from reports.
              Confirm details with the original document and treating team.
            </span>
          </footer>
        </main>
      </div>
      {viewing && (
        <Viewer
          {...viewing}
          setI={(i) => setViewing((v) => ({ ...v, i }))}
          close={() => setViewing(null)}
        />
      )}
    </div>
  );
}
