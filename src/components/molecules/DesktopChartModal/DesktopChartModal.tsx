"use client";
import { FC, useEffect, useState } from "react";
import { X } from "lucide-react";

interface DesktopChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
  title: string;
}
export const DesktopChartModal: FC<DesktopChartModalProps> = ({
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
      className={`hidden lg:flex w-full max-h-[90vh] h-min max-w-[661px] mb-28 bg-[#272E48] rounded-lg transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="bg-[#272E48] rounded-lg h-min p-8 w-full overflow-y-auto relative max-h-[calc(100vh-100px)] transform transition-transform duration-300"
        style={{ transform: isOpen ? "scale(1)" : "scale(0.95)" }}
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
