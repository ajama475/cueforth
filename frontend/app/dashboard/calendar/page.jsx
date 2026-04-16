"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getParentTasks,
  getTaskUrgency,
  getNextAction,
  isPrepWindowOpen,
  toggleTaskCompletion,
  formatISO,
} from "../../../lib/tasks/taskHelpers";

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  const startOffset = firstDay.getDay();
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  const endOffset = 42 - days.length;
  for (let i = 1; i <= endOffset; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
}

function formatDateLong(isoDate) {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

function formatDateShort(isoDate) {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

/* Calendar event cell item */
function CalendarEvent({ task, isMilestone, onClick, isStartBy }) {
  const isDone = task.status === "done";
  const urgency = getTaskUrgency(task.dueDate, task.status);

  const classes = [
    "calendar-event",
    `calendar-event--${urgency.color}`,
    isDone ? "calendar-event--done" : "",
    isMilestone ? "calendar-event--milestone" : "",
    isStartBy ? "calendar-event--start-by" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      title={`${isMilestone ? "[Prep] " : isStartBy ? "[Start by] " : ""}${task.title}`}
      onClick={() => onClick(task)}
    >
      {isStartBy && <span className="calendar-event__start-icon">▸</span>}
      {isMilestone && <span className="calendar-event__ms-icon">↳</span>}
      <span className="calendar-event__label">{isMilestone ? task._msLabel : task.title}</span>
    </div>
  );
}

/* Day detail panel */
function DayPanel({ dateIso, items, onClose, onToggle }) {
  if (!dateIso) return null;

  const formatTitle = formatDateLong(dateIso);

  return (
    <div className="calendar-panel">
      <div className="calendar-panel__header">
        <h3 className="calendar-panel__date">{formatTitle}</h3>
        <button className="modal__close" onClick={onClose} aria-label="Close panel">×</button>
      </div>
      <div className="calendar-panel__list">
        {items.length === 0 ? (
          <p className="calendar-panel__empty">Nothing scheduled</p>
        ) : (
          items.map((item) => {
            const urgency = getTaskUrgency(item.dueDate, item.status);
            const isDone = item.status === "done";
            const nextAction = item.milestones ? getNextAction(item) : null;
            const prepOpen = isPrepWindowOpen(item);

            return (
              <div key={item._key} className={`calendar-panel__item${isDone ? " calendar-panel__item--done" : ""}`}>
                <div className="calendar-panel__item-top">
                  {item._isMilestone ? (
                    <span className="calendar-panel__ms-badge">Prep</span>
                  ) : item._isStartBy ? (
                    <span className="calendar-panel__start-badge">Start by</span>
                  ) : (
                    <span className={`tag tag--${urgency.color}`}>{urgency.label}</span>
                  )}
                  {item.course && item.course !== "—" && (
                    <span className="cell-course-badge">{item.course}</span>
                  )}
                </div>

                <h4 className="calendar-panel__item-title">
                  {item._isMilestone ? `↳ ${item._msLabel}` : item.title}
                </h4>

                {item._isMilestone && item._msParentTitle && (
                  <p className="calendar-panel__item-parent">for {item._msParentTitle}</p>
                )}

                {!item._isMilestone && !item._isStartBy && nextAction && prepOpen && (
                  <div className="calendar-panel__next-action">
                    <span className="calendar-panel__action-label">Next action:</span> {nextAction.label}
                    {nextAction.why && (
                      <span className="calendar-panel__action-why"> — {nextAction.why}</span>
                    )}
                  </div>
                )}

                {!item._isMilestone && item._isStartBy && (
                  <p className="calendar-panel__start-hint">
                    This is a good day to begin preparation. Due {formatDateShort(item.dueDate)}.
                  </p>
                )}

                {!item._isMilestone && !isDone && (
                  <button
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: "2px 6px", marginTop: 4 }}
                    onClick={() => onToggle(item)}
                  >
                    Mark done
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const loadTasks = useCallback(async () => {
    const data = await getParentTasks();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  async function handleToggle(task) {
    await toggleTaskCompletion(task);
    loadTasks();
  }

  function goPrev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function goNext() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }
  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  // Build a date → items map that includes:
  // 1. Real tasks on their due date (primary)
  // 2. Milestone items on their dates (prep)
  // 3. Start-by markers on startByDate
  const dateMap = useMemo(() => {
    const map = {};
    function add(dateStr, item) {
      if (!dateStr) return;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(item);
    }

    for (const task of tasks) {
      // Real due date entry
      if (task.dueDate) {
        add(task.dueDate, { ...task, _key: task.id, _isMilestone: false, _isStartBy: false });
      }

      // Milestones
      if (task.milestones && task.status !== "done") {
        for (const ms of task.milestones) {
          if (ms.done) continue;
          add(ms.date, {
            ...task,
            _key: `${task.id}::${ms.id}`,
            _isMilestone: true,
            _isStartBy: false,
            _msLabel: ms.label,
            _msParentTitle: task.title,
            _msId: ms.id,
          });
        }
      }

      // Start-by marker (only if different from due date and first milestone)
      if (task.startByDate && task.status !== "done" && task.startByDate !== task.dueDate) {
        const firstMsDate = task.milestones?.[0]?.date;
        if (task.startByDate !== firstMsDate) {
          add(task.startByDate, {
            ...task,
            _key: `${task.id}::start-by`,
            _isMilestone: false,
            _isStartBy: true,
          });
        }
      }
    }

    return map;
  }, [tasks]);

  if (loading) {
    return (
      <>
        <header className="page-header"><h1 className="page-title">Calendar</h1></header>
        <div className="calendar-view">
          <p className="cell-placeholder" style={{ padding: 40 }}>Loading...</p>
        </div>
      </>
    );
  }

  const daysGrid = getMonthMatrix(viewYear, viewMonth);
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(viewYear, viewMonth, 1));
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIso = formatISO(today);

  const selectedItems = selectedDate ? (dateMap[selectedDate] || []) : [];

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Calendar</h1>
      </header>

      <div className={`calendar-layout${selectedDate ? " calendar-layout--panel-open" : ""}`}>
        <div className="calendar-view">
          <div className="calendar-header">
            <h2 className="calendar-title">{monthName} {viewYear}</h2>
            <div className="calendar-nav">
              <button className="btn-ghost" onClick={goToday}>Today</button>
              <button className="btn-ghost" onClick={goPrev} aria-label="Previous month" style={{ padding: "0 8px" }}>←</button>
              <button className="btn-ghost" onClick={goNext} aria-label="Next month" style={{ padding: "0 8px" }}>→</button>
            </div>
          </div>

          <div className="calendar-grid">
            {weekDays.map((day) => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}

            {daysGrid.map((dateObj, i) => {
              const iso = formatISO(dateObj);
              const isOther = dateObj.getMonth() !== viewMonth;
              const isToday = iso === todayIso;
              const isSelected = iso === selectedDate;
              const dayItems = dateMap[iso] || [];

              // Count by category for visual density
              const deadlines = dayItems.filter((it) => !it._isMilestone && !it._isStartBy);
              const milestones = dayItems.filter((it) => it._isMilestone);
              const startBys = dayItems.filter((it) => it._isStartBy);

              return (
                <div
                  key={iso + i}
                  className={`calendar-cell${isOther ? " calendar-cell--other-month" : ""}${isToday ? " calendar-cell--today" : ""}${isSelected ? " calendar-cell--selected" : ""}`}
                  onClick={() => setSelectedDate(iso === selectedDate ? null : iso)}
                >
                  <div className="calendar-cell__date">{dateObj.getDate()}</div>
                  <div className="calendar-cell__events">
                    {deadlines.slice(0, 3).map((item) => (
                      <CalendarEvent key={item._key} task={item} isMilestone={false} isStartBy={false} onClick={() => setSelectedDate(iso)} />
                    ))}
                    {startBys.slice(0, 2).map((item) => (
                      <CalendarEvent key={item._key} task={item} isMilestone={false} isStartBy={true} onClick={() => setSelectedDate(iso)} />
                    ))}
                    {milestones.slice(0, 2).map((item) => (
                      <CalendarEvent key={item._key} task={item} isMilestone={true} isStartBy={false} onClick={() => setSelectedDate(iso)} />
                    ))}
                    {dayItems.length > 5 && (
                      <div className="calendar-cell__more">+{dayItems.length - 5} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span className="calendar-legend__item"><span className="calendar-legend__swatch calendar-legend__swatch--deadline" /> Deadline</span>
            <span className="calendar-legend__item"><span className="calendar-legend__swatch calendar-legend__swatch--prep" /> Prep step</span>
            <span className="calendar-legend__item"><span className="calendar-legend__swatch calendar-legend__swatch--start" /> Start by</span>
          </div>
        </div>

        <DayPanel
          dateIso={selectedDate}
          items={selectedItems}
          onClose={() => setSelectedDate(null)}
          onToggle={handleToggle}
        />
      </div>
    </>
  );
}
