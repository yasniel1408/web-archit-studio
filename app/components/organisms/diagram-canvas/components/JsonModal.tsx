import React from 'react';
import { Modal } from '@/app/components/atoms/modal';

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
  className = ''
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="JSON del Diagrama"
      size="large"
      className={className}
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto">
          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-[60vh]">
            {json}
          </pre>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Copiar al portapapeles
          </button>
        </div>
      </div>
    </Modal>
  );
}; 