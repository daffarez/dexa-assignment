import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export const FormSelect = ({
  label,
  icon,
  options,
  value,
  onChange,
}: FormSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-50 border ${
          isOpen ? "border-blue-500 ring-2 ring-blue-500/10" : "border-gray-100"
        } rounded-2xl px-5 py-3.5 text-sm font-bold flex justify-between items-center cursor-pointer transition-all hover:bg-white`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-300"}>
          {selectedOption ? selectedOption.label : "Pilih..."}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  value === opt.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
                {value === opt.value && <Check size={14} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
