import { useField } from "formik";

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  placeholder: string;
  classname?: string;
  className?: string;
}

export default function TextArea({
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
    <div className={`flex flex-col mx-4 my-4 w-full ${classname} `}>
      {label && (
        <label className="text-sm font-bold text-gray-700">{label}</label>
      )}
      <textarea
        className={`border-[1px] ${
          isError
            ? "border-red-500 border-[2px]"
            : "border-gray-400 focus:border-blue-600"
        } focus:border-[2px] outline-none roun p-3 text-sm font-semibold my-2 w-full ${className}`}
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
