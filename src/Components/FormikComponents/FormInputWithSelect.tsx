import { useField } from "formik";
import { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  name1: string;
  options?: string[];
  options1?: string[];
  label?: string;
  placeholder: string;
  classname?: string;
  className?: string;
}

export default function FormInput1({
  name,
  name1,
  label,
  placeholder,
  options,
  options1,
  classname,
  className,
  ...rest
}: Props) {
  const [field, meta] = useField(name);
  const [field1, meta1] = useField(name1);
  const isError = Boolean(meta.touched && meta.error);
  return (
    <div className={`flex flex-col mx-4 my-4 ${classname} `}>
      {label && (
        <label className="text-sm font-bold text-gray-700">{label}</label>
      )}
      <div className="relative flex">
        {options && (
          <select
            className={`border-2  ${
              isError ? "border-red-500 " : "border-gray-400"
            }  px-3 py-2 border-r-0 outline-none appearance-none bg-white text-sm font-semibold  h-10 my-2 `}
            {...field1}
            // {...rest}
          >
            {options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        )}
        <input
          className={`border-2 ${
            isError
              ? "border-red-500 "
              : "border-gray-400 focus:border-blue-600"
          } outline-none ${options && ""} ${
            options1 && "rou"
          } shadow-sm pl-2 pr-3 py-2 text-sm font-semibold my-2 min-w-[205px] ${className}`}
          placeholder={placeholder}
          {...field}
          {...rest}
        />
        {options1 && (
          <select
            className={`border-2  ${
              isError ? "border-red-500 " : "border-gray-400"
            } round px-3 py-2 border-l-0 outline-none appearance-none bg-white text-sm font-semibold  h-10 border-left-none my-2 min-w-[70px]`}
            {...field1}
            // {...rest}
          >
            {options1?.map((option) => (
              <option value={option}>{option}</option>
            ))}
            {/* <option value="Mr.">Mr.</option>
          <option value="Mrs.">Mrs.</option> */}
          </select>
        )}
      </div>
      {/* <input
        className={`border-[1px] ${
          isError
            ? "border-red-500 border-[2px]"
            : "border-gray-400 focus:border-blue-600"
        } focus:border-[2px] outline-none rounded-md h-10 px-3 text-sm font-semibold my-2 min-w-[270px] ${className}`}
        placeholder={placeholder}
        {...field}
        {...rest}
      /> */}
      {isError && (
        <div className="text-red-500 text-sm w-fit">{meta.error}</div>
      )}
    </div>
  );
}
