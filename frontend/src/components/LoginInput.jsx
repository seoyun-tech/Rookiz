import { twMerge } from "tailwind-merge";
import { Label } from "./Typography";

export function LoginInput({ label, placeholder, type = "text", value, onChange, className }) {
  return (
    <div className={twMerge("flex flex-col gap-1.5 w-full", className)}>
      <Label size="sm" className="text-gray-800 font-bold">
        {label}
      </Label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-400 rounded-2xl px-4 py-3.5 text-sm text-gray-950 placeholder:text-gray-400 outline-none focus:border-primary-500 transition-colors"
      />
    </div>
  );
}
