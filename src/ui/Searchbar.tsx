interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  classname?: string;
}

export default function SearchBar({
  value,
  setValue,
  placeholder,
  classname,
}: Props) {
  return (
    <div className="relative max-w-sm flex items-center w-full h-12 rounded-lg focus-within:shadow-lg border-2 text-gray-600 border-gray-400 focus-within:border-palatinateBlue bg-white overflow-hidden ml-[10px]">
      <div className="grid place-items-center h-full w-12 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#4B5563"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        className="peer h-full w-full outline-none text-sm  pr-2"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
