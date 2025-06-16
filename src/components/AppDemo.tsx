
import { useState } from "react";
import { Dashboard } from "./dashboard/Dashboard";

export function AppDemo() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard onLogout={() => setShowDashboard(false)} />;
  }

  return null;
}
