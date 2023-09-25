interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  handleChange: (v: string | number) => void;
  placeholder: string;
  label?: string;
  divClassName?: string;
  inputClassName?: string;
}

export default function FormInput({
  value,
  handleChange,
  placeholder,
  label,
  divClassName,
  inputClassName,
  ...rest
}: Props) {
  return (
    <div className={`flex flex-col mx-4 my-4 ${divClassName} `}>
      {label && <p className="text-black  text-sm font-semibold">{label}</p>}
      <input
        className={`border-[1px] 
          border-gray-400 focus:border-blue-600
        focus:border-[2px] outline-none rounded-md h-10 px-3 text-sm font-semibold my-2 min-w-[270px] ${inputClassName}`}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
