interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

export const FormInput = ({ label, icon, ...props }: FormInputProps) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
    />
  </div>
);
