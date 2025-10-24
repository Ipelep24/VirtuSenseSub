// Modal.tsx
import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ title, content, onClose }: { title: string; content: React.ReactNode; onClose: () => void }) {
  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center h-full bg-black/50 px-4">
      <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl leading-none">&times;</button>
        </div>
        <div className="text-sm space-y-4 p-6 pt-4 overflow-y-auto">{content}</div>
      </div>
    </div>
  );

  // Render modal at document.body level, not inside parent component
  return createPortal(modalContent, document.body);
}