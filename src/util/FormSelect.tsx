interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: { value: string | number; label: string }[];
  placeholder: string;
  label?: string;
  divClassName?: string;
  inputClassName?: string;
}

export default function FormSelect({
  value,
  setValue,
  options,
  placeholder,
  label,
  divClassName,
  inputClassName,
}: Props) {
  return (
    <div className={`flex flex-col mx-10 ${divClassName}`}>
      {label && <p className="text-black  text-sm font-semibold">{label}</p>}
      <select
        className={`text-gray-600 pr-2  border-2 border-gray-400 focus-within:border-gray-500 bg-white rounded-md p-2 text-sm focus-within:shadow-lg h-12 w-[250px] ${inputClassName}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
