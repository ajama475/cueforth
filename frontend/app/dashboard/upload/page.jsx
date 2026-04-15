"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---- Icons ---- */

function IconCloud() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-tertiary)" }}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ---- Status labels ---- */

const STATUS_CONFIG = {
  uploading: { label: "Uploading", className: "tag tag--gray" },
  parsing:   { label: "Parsing…", className: "tag tag--blue" },
  ready:     { label: "Ready", className: "tag tag--green" },
  attention: { label: "Attention", className: "tag tag--orange" },
  error:     { label: "Error", className: "tag tag--red" },
};

/* ---- Helpers ---- */

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function truncateName(name, max = 28) {
  if (name.length <= max) return name;
  const ext = name.slice(name.lastIndexOf("."));
  return name.slice(0, max - ext.length - 1) + "…" + ext;
}

/* ---- Upload Page ---- */

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [courses, setCourses] = useState([]);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  /* Load courses from localStorage (saved during setup) */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sys-semester-setup");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.courses) setCourses(data.courses);
      }
    } catch {
      /* ignore parse errors */
    }
  }, []);

  /* Simulate parsing after upload */
  const simulateParsing = useCallback((fileId) => {
    /* Phase 1: uploading → parsing */
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "parsing" } : f))
      );

      /* Phase 2: parsing → ready or attention (random for demo) */
      setTimeout(() => {
        const isClean = Math.random() > 0.3;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: isClean ? "ready" : "attention",
                  message: isClean
                    ? null
                    : "Dates are blurry or non-standard format.",
                }
              : f
          )
        );
      }, 1800 + Math.random() * 1200);
    }, 600);
  }, []);

  function addFiles(fileList) {
    const newFiles = Array.from(fileList)
      .filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"))
      .map((f) => {
        const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        return {
          id,
          name: f.name,
          size: f.size,
          status: "uploading",
          courseId: "",
          message: null,
          file: f,
        };
      });

    if (newFiles.length === 0) return;

    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateParsing(f.id));
  }

  /* Drag handlers */
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  function handleFileInput(e) {
    if (e.target.files.length) addFiles(e.target.files);
    e.target.value = "";
  }

  function handleCourseMap(fileId, courseId) {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, courseId } : f))
    );
  }

  function handleRemoveFile(fileId) {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Upload Syllabus</h1>
      </header>

      <div className="upload-layout">
        {/* ---- Left: Drop zone + info cards ---- */}
        <div className="upload-main">
          {/* Drop zone */}
          <div
            className={`upload-dropzone${isDragging ? " upload-dropzone--active" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="upload-dropzone__icon">
              <IconCloud />
            </div>
            <p className="upload-dropzone__title">
              Drop your syllabus PDFs here
            </p>
            <p className="upload-dropzone__hint">
              Supported format: PDF. Maximum file size 25MB per document.
            </p>
            <button
              className="btn-primary"
              type="button"
              onClick={handleBrowse}
            >
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              style={{ display: "none" }}
              onChange={handleFileInput}
            />
          </div>

          {/* Info cards */}
          <div className="upload-features">
            <div className="upload-feature-card">
              <span className="upload-feature-card__icon">
                <IconSpark />
              </span>
              <div>
                <p className="upload-feature-card__title">
                  Intelligent Extraction
                </p>
                <p className="upload-feature-card__desc">
                  Our parser automatically identifies due dates, weights, and
                  reading requirements from your syllabus.
                </p>
              </div>
            </div>

            <div className="upload-feature-card">
              <span className="upload-feature-card__icon">
                <IconLink />
              </span>
              <div>
                <p className="upload-feature-card__title">Ledger Mapping</p>
                <p className="upload-feature-card__desc">
                  Assignments are instantly formatted to fit your master
                  calendar and scheduling view.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Right: File panel ---- */}
        <div className="upload-panel">
          <div className="upload-panel__section">
            <h3 className="upload-panel__heading">Uploaded files</h3>

            {files.length === 0 ? (
              <p className="upload-panel__empty">
                No files uploaded yet. Drop a syllabus PDF or click Browse.
              </p>
            ) : (
              <div className="upload-file-list">
                {files.map((f) => (
                  <div key={f.id} className="upload-file-item">
                    <div className="upload-file-item__top">
                      <span className="upload-file-item__icon">
                        <IconFile />
                      </span>
                      <span className="upload-file-item__name" title={f.name}>
                        {truncateName(f.name)}
                      </span>
                      <span className={STATUS_CONFIG[f.status]?.className}>
                        {STATUS_CONFIG[f.status]?.label}
                      </span>
                    </div>

                    <div className="upload-file-item__meta">
                      <span className="upload-file-item__size">
                        {formatFileSize(f.size)}
                      </span>
                    </div>

                    {/* Course mapping — shown when ready */}
                    {f.status === "ready" && courses.length > 0 && (
                      <div className="upload-file-item__mapping">
                        <label className="upload-file-item__mapping-label">
                          Map to course
                        </label>
                        <select
                          className="upload-file-item__select"
                          value={f.courseId}
                          onChange={(e) => handleCourseMap(f.id, e.target.value)}
                        >
                          <option value="">Select course…</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.code ? `${c.code}: ${c.name}` : c.name || c.code}
                            </option>
                          ))}
                        </select>
                        <button className="btn-ghost upload-file-item__action" type="button">
                          Review extracted data →
                        </button>
                      </div>
                    )}

                    {/* Attention message */}
                    {f.status === "attention" && (
                      <div className="upload-file-item__warning">
                        <p className="upload-file-item__warning-text">
                          {f.message || "Could not parse reliably."}
                        </p>
                        <button className="btn-ghost upload-file-item__action upload-file-item__action--warn" type="button">
                          Manual override
                        </button>
                      </div>
                    )}

                    {/* Remove */}
                    <button
                      className="upload-file-item__remove"
                      type="button"
                      onClick={() => handleRemoveFile(f.id)}
                      aria-label={`Remove ${f.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Capacity */}
          <div className="upload-panel__section">
            <h3 className="upload-panel__heading">Storage</h3>
            <div className="upload-capacity">
              <div className="upload-capacity__numbers">
                <span className="upload-capacity__current">{files.length}</span>
                <span className="upload-capacity__max">/ 50 documents</span>
              </div>
              <div className="upload-capacity__bar">
                <div
                  className="upload-capacity__fill"
                  style={{ width: `${Math.min((files.length / 50) * 100, 100)}%` }}
                />
              </div>
              <p className="upload-capacity__note">
                Local storage. All files stay on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
