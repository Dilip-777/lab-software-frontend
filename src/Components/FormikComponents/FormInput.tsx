import { useField } from "formik";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder: string;
  classname?: string;
  className?: string;
}

export default function FormInput({
  name,
  label,
  placeholder,
  classname,
  className,
  ...rest
}: Props) {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  return (
    <div className={`flex flex-col mx-4 my-4 ${classname} `}>
      {label && (
        <label className="text-sm font-bold text-gray-700">{label}</label>
      )}
      {/* <div className="relative flex">
        <select
          className="border border-gray-400 rounded-l-md px-3 py-2 outline-none appearance-none bg-white text-sm font-semibold  h-10 border-right-none my-2"
          // {...field}
          // {...rest}
        >
          <option value="Mr.">Mr.</option>
          <option value="Mrs.">Mrs.</option>
        </select>
        <input
          className={`border-[1px] ${
            isError
              ? "border-red-500 border-[2px]"
              : "border-gray-400 focus:border-blue-600"
          } focus:border-[2px] outline-none rounded-r-md pl-2 pr-3 py-2 text-sm font-semibold my-2 min-w-[270px] ${className}`}
          placeholder={placeholder}
          {...field}
          {...rest}
        />
      </div> */}
      <input
        className={`border-2 ${
          isError ? "border-red-500 " : "border-gray-400 focus:border-blue-600"
        } focus:border-[2px] outline-none  shadow-sm h-10 px-3 text-sm font-semibold my-2 min-w-[270px] ${className}`}
        placeholder={placeholder}
        {...field}
        {...rest}
      />
      {isError && (
        <div className="text-red-500 text-sm w-fit">{meta.error}</div>
      )}
    </div>
  );
}
