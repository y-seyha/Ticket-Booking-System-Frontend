"use client";

import type { Screen } from "../../screen.types";
import ScreenFormModalContent from "./ScreenFormModalContent";

interface FormModalProps {
  isOpen: boolean;
  screenToEdit?: Screen | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScreenFormModal({
  isOpen,
  screenToEdit,
  onClose,
  onSuccess,
}: FormModalProps) {
  // Generates a distinct key to completely unmount/remount internal state cleanly
  const instanceKey = isOpen ? `modal-${screenToEdit?.id || "new"}` : "closed";

  if (!isOpen) return null;

  return (
    <ScreenFormModalContent
      key={instanceKey}
      screenToEdit={screenToEdit}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}
