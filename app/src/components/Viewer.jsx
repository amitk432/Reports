import React, { useEffect, useRef, useState } from "react";
import { fileUrl, summaryUrl, kind, fmtDate, FLAG } from "../lib.js";
import Icon from "./Icon.jsx";
export default function Viewer({ list, i, setI, close }) {
  const r = list[i],
    url = (r.isPrepared ? summaryUrl : fileUrl)(r.path),
    [zoom, setZoom] = useState(false),
    [rotation, setRotation] = useState(0),
    [imageSize, setImageSize] = useState({ width: 0, height: 0 }),
    [paneSize, setPaneSize] = useState({ width: 0, height: 0 }),
    [text, setText] = useState(""),
    [fileError, setFileError] = useState(""),
    dialog = useRef(null),
    body = useRef(null);
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setPaneSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(body.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setZoom(false);
    setRotation(0);
    setImageSize({ width: 0, height: 0 });
    setText("Loading document…");
    setFileError("");
    const controller = new AbortController();
    if (kind(r.path) === "text" && !/\.html$/i.test(r.path))
      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw Error("Document could not be loaded");
          return res.text();
        })
        .then(setText)
        .catch((e) => {
          if (e.name !== "AbortError") setFileError(e.message);
        });
    return () => controller.abort();
  }, [url, r.path]);
  useEffect(() => {
    const key = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight" && i < list.length - 1) setI(i + 1);
      if (e.key === "ArrowLeft" && i > 0) setI(i - 1);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [i, list.length, setI]);
  const sideways = rotation % 180 !== 0;
  const rotatedWidth = sideways ? imageSize.height : imageSize.width;
  const rotatedHeight = sideways ? imageSize.width : imageSize.height;
  const scale =
    imageSize.width && paneSize.width
      ? Math.min(
          paneSize.width / rotatedWidth,
          paneSize.height / rotatedHeight,
        ) * (zoom ? 2 : 1)
      : 0;
  return (
    <dialog
      ref={dialog}
      className="viewer"
      aria-label={r.title}
      onClose={close}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <header>
        <div>
          <div className="eyebrow">
            {r.isPrepared ? "PREPARED SUMMARY" : "ORIGINAL RECORD"} · {r.id}
          </div>
          <h2>{r.title}</h2>
          <p className="muted small">
            {fmtDate(r.date)} · {r.hospital}
          </p>
        </div>
        <div className="actions">
          <a className="btn" href={url} download={r.path.split("/").pop()}>
            <Icon name="down" size={17} />
            Download
          </a>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close viewer"
          >
            <Icon name="close" />
          </button>
        </div>
      </header>
      <div className="viewer-content">
        <div className="document-pane">
          <div className="document-toolbar">
            <span className="muted small">
              {kind(r.path) === "image"
                ? "Click document to zoom"
                : "Document preview"}
            </span>
            <div className="actions">
              {kind(r.path) === "image" && (
                <>
                  <button
                    className="icon-button"
                    aria-label="Rotate document"
                    title="Rotate document 90°"
                    onClick={() => setRotation((angle) => (angle + 90) % 360)}
                  >
                    <Icon name="rotate" size={16} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Fit document"
                    title="Fit document"
                    onClick={() => setZoom(false)}
                  >
                    <Icon name="expand" size={16} />
                  </button>
                </>
              )}
              <a
                className="text-action"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                Open original <Icon name="arrow" size={15} />
              </a>
            </div>
          </div>
          <div className="viewer-body" ref={body}>
            {fileError ? (
              <div className="empty-state" role="alert">
                <p>{fileError}</p>
                <a
                  className="btn ghost"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open original
                </a>
              </div>
            ) : kind(r.path) === "image" ? (
              <button
                className={"document-image " + (zoom ? "zoom" : "")}
                style={
                  scale
                    ? {
                        width: Math.max(paneSize.width, rotatedWidth * scale),
                        height: Math.max(
                          paneSize.height,
                          rotatedHeight * scale,
                        ),
                      }
                    : undefined
                }
                onClick={() => setZoom(!zoom)}
                aria-label={zoom ? "Zoom out document" : "Zoom in document"}
              >
                <img
                  src={url}
                  alt={r.title}
                  onLoad={(e) =>
                    setImageSize({
                      width: e.currentTarget.naturalWidth,
                      height: e.currentTarget.naturalHeight,
                    })
                  }
                  style={
                    scale
                      ? {
                          width: imageSize.width * scale,
                          height: imageSize.height * scale,
                          transform: `rotate(${rotation}deg)`,
                        }
                      : undefined
                  }
                  onError={() => setFileError("The image could not be loaded.")}
                />
              </button>
            ) : kind(r.path) === "pdf" || /\.html$/i.test(r.path) ? (
              <iframe
                src={url}
                title={r.title}
                sandbox={/\.html$/i.test(r.path) ? "allow-scripts" : undefined}
              />
            ) : (
              <pre>{text}</pre>
            )}
          </div>
        </div>
        <aside className="viewer-details">
          <span className="pill neutral">
            {r.reportType || "Prepared summary"}
          </span>
          <h3>Report context</h3>
          <p>{r.summary}</p>
          {r.caution && <div className="note">{r.caution}</div>}
          {r.findings?.length > 0 && (
            <>
              <h3>Transcribed findings</h3>
              <div className="scroll-x">
                <table className="findings">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Result / reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.findings.map((f, n) => (
                      <tr key={n} className={"f-" + (f.flag || "")}>
                        <td>{f.test}</td>
                        <td>
                          <b>
                            {f.value} {f.unit}
                          </b>
                          <small>
                            {f.range && "Ref: " + f.range}
                            {f.flag && " · " + (FLAG[f.flag] || "")}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {r.keyPoints?.length > 0 && (
            <>
              <h3>Recorded details</h3>
              <ul>
                {r.keyPoints.map((p, n) => (
                  <li key={n}>{p}</li>
                ))}
              </ul>
            </>
          )}
          {r.issues?.length > 0 && (
            <div className="note">
              <b>Transcription notes</b>
              <ul>
                {r.issues.map((p, n) => (
                  <li key={n}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          <dl className="meta">
            {[
              ["Issued by", r.issuer],
              ["Doctor", r.doctor],
              ["Reported", r.reportedDate && fmtDate(r.reportedDate)],
              ["Name on report", r.nameOnDoc],
              ["Lab / UHID", r.labNo],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </React.Fragment>
              ))}
          </dl>
          <p className="muted small">
            Check transcribed values against the original report.
          </p>
        </aside>
      </div>
      {list.length > 1 && (
        <footer className="viewer-footer">
          <button
            className="btn ghost"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            ← Previous
          </button>
          <span className="muted small">
            Report {i + 1} of {list.length} · Use ← → to navigate
          </span>
          <button
            className="btn ghost"
            disabled={i === list.length - 1}
            onClick={() => setI(i + 1)}
          >
            Next →
          </button>
        </footer>
      )}
    </dialog>
  );
}
