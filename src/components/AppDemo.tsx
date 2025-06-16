
import { useState } from "react";
import { Dashboard } from "./dashboard/Dashboard";

const mockUser = {
  id: "1",
  name: "João Silva",
  email: "joao@email.com",
  username: "joaosilva",
  avatar_url: undefined,
  bio: "Desenvolvedor Frontend & Criador de Conteúdo"
};

export function AppDemo() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard user={mockUser} onLogout={() => setShowDashboard(false)} />;
  }

  return null;
}
