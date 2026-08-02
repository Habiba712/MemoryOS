import { useEffect, useState } from "react";
import Login from "./auth/login/page";
import Capture from "./Capture";

export default function App() {
  const [session, setSession] = useState();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("sessionData");
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        localStorage.removeItem("sessionData");
      }
    }
    setChecked(true);
  }, []);

  function handleLoginSuccess(data) {
    console.log("handleLoginSuccess", data);

    setSession(data);
  }

  function handleLogout() {
    localStorage.removeItem("sessionData");
    setSession(null);
  }

   if (!checked) return null;

  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
console.log("session", session);
  return <Capture token={session.token} userId={session.userId} onLogout={handleLogout} />;
}