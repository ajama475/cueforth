"use client";

import { useCallback, useMemo, useState } from "react";

/* ---- Icons ---- */

function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconChevron({ direction = "right" }) {
  const rotation = direction === "left" ? "rotate(180)" : "";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: rotation }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function IconZoomOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

/* ---- Mock data ---- */

const mockItems = [
  {
    id: 1,
    course: "HIST 202",
    title: "Midterm Research Paper",
    dueDate: "Oct 18, 2024",
    dueDateRaw: "2024-10-18",
    confidence: 92,
    extraction: "automatic",
    snippet:
      '...the Midterm Research Paper (30% of final grade) must be uploaded to the portal by Friday, October 18th at 11:59 PM EST. Late submissions will...',
    highlightedTerms: ["Midterm Research Paper", "Friday, October 18th"],
    detectionId: "042",
    sourcePage: 4,
    sourceFile: "SYLLABUS_HIST202_FALL24.PDF",
    totalPages: 12,
    status: "pending",
  },
  {
    id: 2,
    course: "CS 301",
    title: "Final Group Project",
    dueDate: "Dec 12, 2024",
    dueDateRaw: "2024-12-12",
    confidence: 84,
    extraction: "automatic",
    snippet:
      '...the Final Group Project proposal (worth 25%) is due by December 12th. Each group must submit a working prototype along with...',
    highlightedTerms: ["Final Group Project", "December 12th"],
    detectionId: "017",
    sourcePage: 7,
    sourceFile: "CS301_SYLLABUS_F24.PDF",
    totalPages: 9,
    status: "pending",
  },
  {
    id: 3,
    course: "ECON 101",
    title: "Quiz 4: Market Dynamics",
    dueDate: "Sep 30, 2024",
    dueDateRaw: "2024-09-30",
    confidence: 98,
    extraction: "automatic",
    snippet:
      '...Quiz 4 covering Market Dynamics (Chapters 8-10) will be held on September 30th during class time. The quiz is worth 5% of your final...',
    highlightedTerms: ["Quiz 4", "September 30th"],
    detectionId: "008",
    sourcePage: 3,
    sourceFile: "ECON101_COURSE_OUTLINE.PDF",
    totalPages: 6,
    status: "pending",
  },
  {
    id: 4,
    course: "BIOL 440",
    title: "Lab Report 3: Enzyme Kinetics",
    dueDate: "Nov 5, 2024",
    dueDateRaw: "2024-11-05",
    confidence: 81,
    extraction: "automatic",
    snippet:
      '...Lab Report #3 on Enzyme Kinetics must follow APA format and is due November 5th. Reports submitted after the deadline will receive...',
    highlightedTerms: ["Lab Report #3", "November 5th"],
    detectionId: "023",
    sourcePage: 5,
    sourceFile: "BIOL440_SYLLABUS.PDF",
    totalPages: 8,
    status: "pending",
  },
  {
    id: 5,
    course: "MATH 225",
    title: "Problem Set 7",
    dueDate: "Oct 28, 2024",
    dueDateRaw: "2024-10-28",
    confidence: 95,
    extraction: "automatic",
    snippet:
      '...Problem Set 7 covers sections 5.1 through 5.4 and is due Monday, October 28th. Solutions must be handwritten and stapled...',
    highlightedTerms: ["Problem Set 7", "October 28th"],
    detectionId: "031",
    sourcePage: 2,
    sourceFile: "MATH225_SYLLABUS_F24.PDF",
    totalPages: 5,
    status: "pending",
  },
  {
    id: 6,
    course: "HIST 202",
    title: "Primary Source Analysis",
    dueDate: "Nov 15, 2024",
    dueDateRaw: "2024-11-15",
    confidence: 73,
    extraction: "automatic",
    snippet:
      '...students will submit a Primary Source Analysis (10%) by November 15. The analysis should be 4-6 pages examining a document from...',
    highlightedTerms: ["Primary Source Analysis", "November 15"],
    detectionId: "044",
    sourcePage: 5,
    sourceFile: "SYLLABUS_HIST202_FALL24.PDF",
    totalPages: 12,
    status: "pending",
  },
];

/* ---- Confidence helpers ---- */

function confidenceClass(score) {
  if (score >= 90) return "tag tag--green";
  if (score >= 75) return "tag tag--yellow";
  return "tag tag--orange";
}

function confidenceIcon(score) {
  if (score >= 90) return "✓";
  if (score >= 75) return "⚠";
  return "!";
}

/* ---- Render snippet with highlights ---- */

function SnippetText({ text, terms }) {
  if (!terms || terms.length === 0) return <span>{text}</span>;

  const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isHighlight = terms.some((t) => t.toLowerCase() === part.toLowerCase());
        return isHighlight ? (
          <mark key={i} className="review-highlight">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

/* ---- PDF mock lines ---- */

function MockPdfLines({ count = 5 }) {
  return (
    <div className="pdf-mock-lines">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="pdf-mock-line"
          style={{ width: `${60 + Math.random() * 35}%` }}
        />
      ))}
    </div>
  );
}

/* ---- Page ---- */

export default function ReviewPage() {
  const [items, setItems] = useState(mockItems);
  const [selectedId, setSelectedId] = useState(mockItems[0]?.id ?? null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  const pendingItems = useMemo(
    () => items.filter((i) => i.status === "pending"),
    [items]
  );

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  const selectedIndex = useMemo(
    () => pendingItems.findIndex((i) => i.id === selectedId),
    [pendingItems, selectedId]
  );

  /* Actions */
  const handleApprove = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "approved" } : i))
      );
      /* Select next pending */
      const remaining = items.filter((i) => i.status === "pending" && i.id !== id);
      if (remaining.length) setSelectedId(remaining[0].id);
    },
    [items]
  );

  const handleReject = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "rejected" } : i))
      );
      const remaining = items.filter((i) => i.status === "pending" && i.id !== id);
      if (remaining.length) setSelectedId(remaining[0].id);
    },
    [items]
  );

  const handleStartEdit = useCallback(
    (item) => {
      setEditingId(item.id);
      setEditDraft({ title: item.title, dueDate: item.dueDateRaw });
    },
    []
  );

  const handleSaveEdit = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                title: editDraft.title || i.title,
                dueDateRaw: editDraft.dueDate || i.dueDateRaw,
                dueDate: editDraft.dueDate
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(editDraft.dueDate + "T00:00:00"))
                  : i.dueDate,
              }
            : i
        )
      );
      setEditingId(null);
    },
    [editDraft]
  );

  const handleNav = useCallback(
    (dir) => {
      const newIdx = selectedIndex + dir;
      if (newIdx >= 0 && newIdx < pendingItems.length) {
        setSelectedId(pendingItems[newIdx].id);
      }
    },
    [selectedIndex, pendingItems]
  );

  return (
    <>
      <div className="review-layout">
        {/* ======== LEFT: PDF Viewer ======== */}
        <div className="review-pdf">
          {/* Toolbar */}
          <div className="review-pdf__toolbar">
            <span className="review-pdf__filename">
              {selected?.sourceFile ?? "No file selected"}
            </span>
            {selected && (
              <span className="review-pdf__page-badge">
                Page {selected.sourcePage} of {selected.totalPages}
              </span>
            )}
          </div>

          {/* PDF Canvas */}
          <div className="review-pdf__canvas">
            {selected ? (
              <div className="review-pdf__page">
                {/* Simulated text before detection */}
                <MockPdfLines count={4} />

                {/* Detection region */}
                <div className="review-pdf__detection">
                  <span className="review-pdf__detection-label">
                    Detection {selected.detectionId}
                  </span>
                  <blockquote className="review-pdf__quote">
                    <SnippetText
                      text={selected.snippet}
                      terms={selected.highlightedTerms}
                    />
                  </blockquote>
                </div>

                {/* More text after */}
                <MockPdfLines count={6} />
              </div>
            ) : (
              <div className="review-pdf__empty">
                <p>Select an item from the review queue to see its source.</p>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          {selected && (
            <div className="review-pdf__controls">
              <div className="review-pdf__zoom">
                <button className="review-pdf__zoom-btn" type="button" aria-label="Zoom out">
                  <IconZoomOut />
                </button>
                <span className="review-pdf__zoom-level">100%</span>
                <button className="review-pdf__zoom-btn" type="button" aria-label="Zoom in">
                  <IconZoomIn />
                </button>
              </div>
              <div className="review-pdf__pagination">
                <button className="review-pdf__zoom-btn" type="button" aria-label="Previous page">
                  <IconChevron direction="left" />
                </button>
                <span className="review-pdf__zoom-level">
                  {selected.sourcePage} / {selected.totalPages}
                </span>
                <button className="review-pdf__zoom-btn" type="button" aria-label="Next page">
                  <IconChevron direction="right" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======== RIGHT: Review Queue ======== */}
        <div className="review-queue">
          {/* Header */}
          <div className="review-queue__header">
            <div>
              <h2 className="review-queue__title">Review Queue</h2>
              <p className="review-queue__count">
                {pendingItems.length} pending verification{pendingItems.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="review-queue__list">
            {pendingItems.length === 0 ? (
              <div className="review-queue__done">
                <p className="review-queue__done-text">
                  All items reviewed. Nice work.
                </p>
              </div>
            ) : (
              pendingItems.map((item) => {
                const isSelected = item.id === selectedId;
                const isEditing = item.id === editingId;

                return (
                  <div
                    key={item.id}
                    className={`review-card${isSelected ? " review-card--selected" : ""}`}
                    onClick={() => setSelectedId(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedId(item.id);
                    }}
                  >
                    {/* Top row: course + confidence */}
                    <div className="review-card__top">
                      <span className="review-card__course">{item.course}</span>
                      <span className={confidenceClass(item.confidence)}>
                        {item.confidence}% {confidenceIcon(item.confidence)}
                      </span>
                    </div>

                    {/* Title */}
                    {isEditing ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editDraft.title}
                        autoFocus
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(item.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="review-card__title">{item.title}</h3>
                    )}

                    {/* Date */}
                    <div className="review-card__date">
                      <IconCalendar />
                      {isEditing ? (
                        <input
                          className="inline-input"
                          type="date"
                          value={editDraft.dueDate}
                          onChange={(e) =>
                            setEditDraft((d) => ({
                              ...d,
                              dueDate: e.target.value,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          style={{ maxWidth: 160 }}
                        />
                      ) : (
                        <>
                          <span className="review-card__date-label">
                            Due Date
                          </span>
                          <span className="review-card__date-value">
                            {item.dueDate}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Expanded details */}
                    {isSelected && (
                      <>
                        <div className="review-card__snippet-section">
                          <span className="review-card__snippet-label">
                            Source snippet
                          </span>
                          <p className="review-card__snippet">
                            &ldquo;
                            <SnippetText
                              text={item.snippet}
                              terms={item.highlightedTerms}
                            />
                            &rdquo;
                          </p>
                        </div>

                        <div className="review-card__extraction">
                          {item.extraction === "automatic"
                            ? "Automatic extraction"
                            : "Manual entry"}
                        </div>

                        {/* Actions */}
                        <div className="review-card__actions">
                          <button
                            className="review-action review-action--reject"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(item.id);
                            }}
                          >
                            <IconX /> Reject
                          </button>

                          {isEditing ? (
                            <button
                              className="review-action review-action--edit"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(item.id);
                              }}
                            >
                              <IconCheck /> Save
                            </button>
                          ) : (
                            <button
                              className="review-action review-action--edit"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(item);
                              }}
                            >
                              <IconEdit /> Edit
                            </button>
                          )}

                          <button
                            className="review-action review-action--approve"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(item.id);
                            }}
                          >
                            <IconCheck /> Approve
                          </button>
                        </div>
                      </>
                    )}

                    {/* Collapsed chevron */}
                    {!isSelected && (
                      <span className="review-card__chevron">
                        <IconChevron />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom navigation */}
          {pendingItems.length > 0 && (
            <div className="review-queue__footer">
              <div className="review-queue__progress">
                <div className="review-queue__progress-bar">
                  <div
                    className="review-queue__progress-fill"
                    style={{
                      width: `${((mockItems.length - pendingItems.length) / mockItems.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="review-queue__progress-text">
                  {mockItems.length - pendingItems.length} of {mockItems.length} reviewed
                </span>
              </div>

              <div className="review-queue__nav">
                <button
                  className="btn-ghost"
                  type="button"
                  disabled={selectedIndex <= 0}
                  onClick={() => handleNav(-1)}
                >
                  Previous
                </button>
                <button
                  className="btn-primary"
                  type="button"
                  disabled={selectedIndex >= pendingItems.length - 1}
                  onClick={() => handleNav(1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
