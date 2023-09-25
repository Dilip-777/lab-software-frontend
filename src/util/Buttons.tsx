interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export const Button = ({
  label,
  loading,
  className,
  onClick,
  ...rest
}: Props) => {
  return (
    <button
      className={` ${
        loading
          ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
          : "bg-blue-500  hover:bg-blue-700  text-white"
      } font-bold py-2 px-3 text-sm rounded my-3 ${className}`}
      onClick={onClick}
      {...rest}
    >
      {label}
      {loading && (
        <div
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ml-1"
          role="status"
        ></div>
      )}
    </button>
  );
};
