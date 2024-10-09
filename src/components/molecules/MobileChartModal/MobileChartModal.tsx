"use client";
import { FC, useEffect, useState } from "react";
import { X } from "lucide-react";

interface MobileChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
  title: string;
}
export const MobileChartModal: FC<MobileChartModalProps> = ({
  isOpen, onClose, component, title,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeoutId = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`bg-[#272E48] rounded-lg max-w-[661px] p-8 w-full max-h-[90vh] overflow-y-auto relative transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-semibold text-white mb-4">
          {title}
        </h3>
        {component}
      </div>
    </div>
  );
};
