"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllSemesterTasks, toggleTaskCompletion, getNextAction, isPrepWindowOpen } from "../../lib/tasks/taskHelpers";

function IconFocus() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));
}

export default function CalmModePage() {
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [completing, setCompleting] = useState(false);

  async function loadMostUrgentTask() {
    setLoading(true);
    const tasks = await getAllSemesterTasks();
    
    // Filter active tasks
    let active = tasks.filter((t) => t.status !== "done");

    if (active.length === 0) {
      setTask(null);
      setLoading(false);
      return;
    }

    // Sort by urgency score descending. If tied, sort by date ascending.
    active.sort((a, b) => {
      const uA = a.urgency?.score ?? 0;
      const uB = b.urgency?.score ?? 0;
      if (uA !== uB) return uB - uA; // High score first
      
      // Fallback to active date
      const dateA = a.bucket === "today" ? new Date().toISOString() : (a.dueDate || "9999-12-31");
      const dateB = b.bucket === "today" ? new Date().toISOString() : (b.dueDate || "9999-12-31");
      return new Date(dateA) - new Date(dateB);
    });

    setTask(active[0]);
    setLoading(false);
  }

  useEffect(() => {
    loadMostUrgentTask();
  }, []);

  async function handleMarkDone() {
    if (!task || completing) return;
    setCompleting(true);
    
    await toggleTaskCompletion(task);
    
    // Load next task after a slight dealy for UX
    setTimeout(() => {
      loadMostUrgentTask().finally(() => setCompleting(false));
    }, 400);
  }

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text-tertiary)" }}>
        Focusing...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "var(--bg)", 
      padding: 40,
      position: "relative",
      color: "var(--text)"
    }}>
      <Link 
        href="/dashboard" 
        className="topbar__calm-link" 
        style={{ 
          position: "absolute", 
          top: 32, 
          left: 32,
          padding: "0 16px",
          background: "transparent",
          border: "1px solid var(--border)"
        }}
      >
        <span>← Exit Focus</span>
      </Link>

      <div style={{ textAlign: "center", maxWidth: 700, width: "100%", animation: "fade-in 0.8s ease-out" }}>
        {!task ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ color: "var(--tag-green-text)", marginBottom: 24, opacity: 0.8 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.02em" }}>Everything is captured.</h1>
            <p style={{ color: "var(--text-tertiary)", fontSize: 16 }}>Your agenda is currently clear. Enjoy the quiet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              fontSize: 12, 
              textTransform: "uppercase", 
              padding: "4px 12px",
              background: "var(--bg-secondary)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              letterSpacing: "0.08em", 
              color: "var(--accent)", 
              fontWeight: 700, 
              marginBottom: 40,
              opacity: 0.9
            }}>
              <IconFocus /> Current Priority
            </div>
            
            <h1 style={{ 
              fontSize: "clamp(32px, 5vw, 56px)", 
              lineHeight: 1.05, 
              fontWeight: 800, 
              color: "var(--text)", 
              marginBottom: 20, 
              letterSpacing: "-0.03em",
              maxWidth: "100%"
            }}>
              {task.title}
            </h1>
            
            <div style={{ 
              fontSize: 18, 
              color: "var(--text-secondary)", 
              marginBottom: 60,
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <span>
                {task.courseLabel && task.courseLabel !== "—" && (
                  <span style={{ fontWeight: 600, color: "var(--text-tertiary)" }}>{task.courseLabel} · </span>
                )}
                {task.action ? task.action.label : "Primary objective"}
              </span>
              {task.action?.why && (
                <span style={{ fontSize: 14, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  &ldquo;{task.action.why.toLowerCase()}&rdquo;
                </span>
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ 
                fontSize: 15, 
                fontWeight: 600,
                padding: "0 40px", 
                height: 52, 
                borderRadius: 26, 
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                opacity: completing ? 0.6 : 1, 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: completing ? "scale(0.98)" : "scale(1)"
              }}
              onClick={handleMarkDone}
              disabled={completing}
            >
              {completing ? "Verifying..." : "I finished this"}
            </button>
            
            {task.dueDate && (
              <div style={{ 
                marginTop: 48, 
                fontSize: 13, 
                color: "var(--text-tertiary)",
                padding: "4px 12px",
                border: "1px solid var(--border)",
                borderRadius: "6px"
              }}>
                Deadline: {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}} />
    </div>
  );
}
