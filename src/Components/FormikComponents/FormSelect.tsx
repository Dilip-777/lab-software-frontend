import { useField } from "formik";
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  placeholder: string;
  options: { value: string | number; label: string }[];
  classname?: string;
  className?: string;
}

export default function FormSelect({
  name,
  label,
  placeholder,
  classname,
  options,
  className,
  ...rest
}: Props) {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  return (
    <div className={`flex flex-col mx-4 my-4 ${classname}`}>
      {label && (
        <label className="text-sm font-bold text-gray-700">{label}</label>
      )}
      <select
        {...field}
        className={`border-2 ${
          isError
            ? "border-red-500 text-red-400"
            : "border-gray-400 focus:border-blue-600"
        }  outline-none shadow-sm text-sm  h-10 px-3 font-semibold ${
          field.value ? "text-gray-700" : "text-gray-400"
        } my-2 min-w-[270px] max-w-[10rem] ${className}`}
        {...rest}
      >
        <option value="" selected>
          {placeholder}
        </option>
        {options.map((option) => (
          <option className="text-gray-600" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isError && <div className="text-red-500 text-sm">{meta.error}</div>}
    </div>
  );
}
