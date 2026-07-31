import { useEffect, useState } from "react";
import "./App.css";

const STATUS = { idle: "idle", saving: "saving", saved: "saved", error: "error" };
const HEART_COUNT = 8;

export default function App() {
  const [tab, setTab] = useState(null);
  const [status, setStatus] = useState(STATUS.idle);
  const [progress, setProgress] = useState(0);
  const [clock, setClock] = useState(getTimeLabel());

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setClock(getTimeLabel()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  async function handleSave() {
    if (!tab || status === "saving") return;
    setStatus(STATUS.saving);
    setProgress(0);

    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 22, 96));
    }, 180);

    try {
      // TODO: wire to your real endpoint
      // await fetch(`${API_URL}/api/file/createFromUrl`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ title: tab.title, url: tab.url, favIconUrl: tab.favIconUrl }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearInterval(tick);
      setProgress(100);
      setStatus(STATUS.saved);
      setTimeout(() => setStatus(STATUS.idle), 2400);
    } catch (err) {
      console.error(err);
      clearInterval(tick);
      setStatus(STATUS.error);
      setTimeout(() => setStatus(STATUS.idle), 2400);
    }
  }

  const hostname = tab?.url ? safeHostname(tab.url) : "";
  const filledHearts = Math.round((progress / 100) * HEART_COUNT);

  return (
    <div className="app">
      <div className="window">
        {/* title bar */}
        <div className="title-bar">
          <div className="title-icon">∞</div>
          <span className="pixel-font title-text">MEMORYOS.EXE</span>
          <div className="title-controls">
            <button className="win-btn bevel-out">_</button>
            <button className="win-btn bevel-out">□</button>
            <button className="win-btn bevel-out" onClick={() => window.close && window.close()}>
              ✕
            </button>
          </div>
        </div>

        {/* menu bar */}
        <div className="menu-bar mono-font">
          <span>File</span>
          <span>Edit</span>
          <span>Capture</span>
          <span>Help</span>
        </div>

        {/* body */}
        <div className="body">
          <p className="mono-font prompt-text">Now viewing this page &mdash; save it to your memory?</p>

          {/* tab preview card */}
          <div className="tab-card bevel-in">
            {tab ? (
              <div className="tab-card-content">
                <div className="favicon-box">
                  {tab.favIconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tab.favIconUrl} alt="" />
                  ) : (
                    <span className="favicon-fallback">{hostname?.[0]?.toUpperCase() ?? "?"}</span>
                  )}
                </div>
                <div className="tab-info">
                  <p className="tab-title">{tab.title}</p>
                  <p className="mono-font tab-host">{hostname}</p>
                </div>
              </div>
            ) : (
              <div className="loading-row">
                <div className="loading-box" />
                <p className="mono-font loading-text">Reading tab...</p>
              </div>
            )}
          </div>

          {/* heart progress */}
          {status === "saving" && (
            <div className="progress-card bevel-in">
              <p className="mono-font progress-label">Please wait while memory loads your page...</p>
              <div className="hearts-row">
                {Array.from({ length: HEART_COUNT }).map((_, i) => (
                  <span key={i} className={`heart ${i < filledHearts ? "filled" : ""}`}>
                    {i < filledHearts ? "💗" : "🤍"}
                  </span>
                ))}
                <span className="mono-font progress-percent">{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {status === "saved" && (
            <div className="status-card success bevel-in">
              <span className="icon pop">💾</span>
              <p className="mono-font">Saved to memory! System.dat updated ♡</p>
            </div>
          )}

          {status === "error" && (
            <div className="status-card error bevel-in">
              <span className="icon">⚠</span>
              <p className="mono-font">System Error: capture failed. Try again?</p>
            </div>
          )}

          {/* save button */}
          <button
            onClick={handleSave}
            disabled={!tab || status === "saving"}
            className="save-btn pixel-font bevel-out"
          >
            {status === "idle" && <>💾 SAVE TO MEMORY</>}
            {status === "saving" && (
              <>
                <span className="spinner" />
                SAVING...
              </>
            )}
            {status === "saved" && <>✅ SAVED!</>}
            {status === "error" && <>↻ RETRY</>}
          </button>
        </div>

        {/* taskbar */}
        <div className="taskbar">
          <button className="open-os-btn bevel-out">
            <span>🖥</span>
            <span className="pixel-font">Open OS</span>
          </button>
          <span className="mono-font clock">{clock}</span>
        </div>
      </div>
    </div>
  );
}

function getTimeLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}