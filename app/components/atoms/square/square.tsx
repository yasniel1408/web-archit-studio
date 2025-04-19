import React, { useState } from 'react';

interface SquareProps {
  className?: string;
  text?: string;
  editable?: boolean;
  initialText?: string;
}

export function Square({ 
  className = "", 
  text = "", 
  editable = false,
  initialText = ""
}: SquareProps) {
  const [innerText, setInnerText] = useState(initialText || text);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerText(e.target.value);
  };
  
  return (
    <div 
      className={`w-full h-full bg-white border border-gray-300 rounded shadow-md 
                 flex items-center justify-center p-2 ${className}`}
    >
      {editable ? (
        <input
          type="text"
          value={innerText}
          onChange={handleTextChange}
          className="w-full h-full text-center focus:outline-none bg-transparent"
          placeholder="Texto aquí"
        />
      ) : (
        <div className="text-center w-full overflow-hidden text-black">
          {innerText || text}
        </div>
      )}
    </div>
  );
}
