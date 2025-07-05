import React from "react";

import { Modal } from "@/app/components/atoms/modal";

export type JsonModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  json: string;
  onCopy: () => void;
  className?: string;
};

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen = true,
  onClose,
  json,
  onCopy,
  className = "",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="JSON del Diagrama"
      size="large"
      className={className}
    >
      <div className="flex h-full flex-col">
        <div className="flex-grow overflow-auto">
          <pre className="max-h-[60vh] overflow-auto rounded border bg-gray-50 p-3 text-xs">
            {json}
          </pre>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onCopy}
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            Copiar al portapapeles
          </button>
        </div>
      </div>
    </Modal>
  );
};
