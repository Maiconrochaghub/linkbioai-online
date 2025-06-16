
import { useState } from "react";
import { SignupModal } from "./SignupModal";

interface SignupModalTriggerProps {
  children: React.ReactNode;
}

export function SignupModalTrigger({ children }: SignupModalTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <SignupModal open={open} onOpenChange={setOpen} />
    </>
  );
}
