import { useEffect, useState } from "react";

const STATUS = { idle: "idle", thinking: "thinking", saved: "saved", error: "error" };

export default function Capture({ token,userId, onLogout }) {
    console.log("Capture token", token, userId);
  const [tab, setTab] = useState(null);
  const [status, setStatus] = useState(STATUS.idle);
  const [progress, setProgress] = useState(0);
  const [tags, setTags] = useState([]);
const [screenshot, setScreenshot] = useState(null);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
  }, [token]);

  useEffect(() => {
    getScreenshot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },  [tab]);
  const getScreenshot = async  () => {
   const screenshot = await chrome.tabs.captureVisibleTab(null, {
    format: "jpeg",
    quality: 70
})
 
setScreenshot(screenshot);
  }

  async function handleSave() {
    if (!tab || status === "thinking") return;
    setStatus(STATUS.thinking);
    setProgress(0);
    setTags([]);

    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 20, 92));
    }, 160);
console.log('screen', screenshot)
    try {
      // TODO: point this at your real endpoint once it's ready — should return AI-generated tags for the page
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/url/saveUrl`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: tab.title, url: tab.url, user: userId, screenshot: screenshot }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();

      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearInterval(tick);
      setProgress(100);

      const generatedTags = guessTags(tab.title, safeHostname(tab.url));
      setTags(generatedTags);
      setStatus(STATUS.saved);
      setTimeout(() => setStatus(STATUS.idle), 3200);
    } catch (err) {
      console.error(err);
      clearInterval(tick);
      setStatus(STATUS.error);
      setTimeout(() => setStatus(STATUS.idle), 2400);
    }
  }

  const hostname = tab?.url ? safeHostname(tab.url) : "";
 

  return (
    <div className="app">
      <div className="glow glow-violet" />
      <div className="glow glow-cyan" />

      <div className="content">
        {/* header */}
        <div className="header">
          <div className="logo-mark">
            <SparkleIcon />
          </div>
          <span className="wordmark">MemoryOS</span>
          <span className="status-pill">
            <span className="status-dot" />
            AI Ready
          </span>
        </div>

        {/* tab preview */}
        <div className="glass-card">
          {tab ? (
            <div className="tab-row">
              <div className="favicon-box">
                {tab.favIconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tab.favIconUrl} alt="" />
                ) : (
                  <span className="favicon-fallback">{hostname?.[0]?.toUpperCase() ?? "?"}</span>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <p className="tab-title">{tab.title}</p>
                <p className="tab-host">{hostname}</p>
              </div>
            </div>
          ) : (
            <div className="skeleton-row">
              <div className="skeleton-box" />
              <div className="skeleton-lines">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          )}
        </div>

        {/* thinking state */}
        {status === "thinking" && (
          <div className="glass-card">
            <div className="thinking-label">
              <SparkleIcon size={12} />
              Reading &amp; understanding this page
              <span className="thinking-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
            <div className="shimmer-bar">
              <div className="shimmer-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* saved state with generated tags */}
        {status === "saved" && (
          <div className="glass-card">
            <p className="tags-label">
              <SparkleIcon size={11} />
              AI tagged this as
            </p>
            <div className="tags-row">
              {tags.map((tag, i) => (
                <span key={tag} className="tag-chip" style={{ animationDelay: `${i * 90}ms` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* error state */}
        {status === "error" && (
          <div className="glass-card error-card">
            <span>⚠</span>
            Couldn&apos;t read this page — try again.
          </div>
        )}

        {/* action */}
        <button
          onClick={handleSave}
          disabled={!tab || status === "thinking"}
          className={`save-btn ${status === "saved" ? "saved" : ""} ${status === "error" ? "error" : ""}`}
        >
          {status === "idle" && (
            <>
              <SparkleIcon size={14} />
              Save to MemoryOS
            </>
          )}
          {status === "thinking" && (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          )}
          {status === "saved" && (
            <>
              <CheckIcon />
              Saved &amp; indexed
            </>
          )}
          {status === "error" && "Retry"}
        </button>

        <div className="footer">
          <button className="footer-link">
            Open MemoryOS
            <ArrowIcon />
          </button>
          <span className="footer-dot">·</span>
          <button className="footer-link" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

// Placeholder tag guesser — replace with the real tags your backend returns.
// Just pulls a few meaningful words from the title + the site name so the
// demo doesn't feel hardcoded while you wire up the real endpoint.
function guessTags(title = "", hostname = "") {
  const stopWords = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "how", "your"]);
  const words = title
    .split(/[\s\-|:]+/)
    .map((w) => w.replace(/[^\w]/g, ""))
    .filter((w) => w.length > 2 && !stopWords.has(w.toLowerCase()));

  const unique = [...new Set(words.map((w) => w.toLowerCase()))].slice(0, 3);
  const siteName = hostname.split(".")[0];

  return [siteName, ...unique].filter(Boolean).slice(0, 4);
}