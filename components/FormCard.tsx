export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-cardBorder rounded-lg px-6 py-6 shadow-sm">
      {children}
    </div>
  );
}

export function Label({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-base text-[#202124] mb-4">
      {children}
      {required && <span className="text-required ml-1">*</span>}
    </label>
  );
}

export function TextInput({
  id,
  name,
  type = "text",
  required,
  placeholder = "Your answer",
  value,
  onChange,
}: {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-0 border-b border-[#DADCE0] focus:border-accent focus:border-b-2 focus:outline-none text-base placeholder:text-muted py-2 transition-colors"
    />
  );
}

export function Radio({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-5 h-5 accent-accent"
      />
      <span className="text-base">{label}</span>
    </label>
  );
}
