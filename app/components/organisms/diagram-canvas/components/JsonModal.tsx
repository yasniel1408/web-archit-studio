import React from 'react';

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
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">JSON del Diagrama</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-auto flex-grow">
          <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-[60vh]">
            {json}
          </pre>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Copiar al portapapeles
          </button>
        </div>
      </div>
    </div>
  );
}; 