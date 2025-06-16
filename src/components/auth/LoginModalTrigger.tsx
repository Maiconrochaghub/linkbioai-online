
import { useState } from "react";
import { LoginModal } from "./LoginModal";

interface LoginModalTriggerProps {
  children: React.ReactNode;
}

export function LoginModalTrigger({ children }: LoginModalTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <LoginModal open={open} onOpenChange={setOpen} />
    </>
  );
}
