import { useField, useFormikContext } from "formik";
import { api } from "../../Api";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  placeholder: string;
  classname?: string;
  className?: string;
}

export default function FormUpload({
  name,
  label,
  placeholder,
  classname,
  className,
  ...rest
}: Props) {
  const [field, meta] = useField(name || "");
  const { setFieldValue } = useFormikContext();

  const handleChange = async (file: File) => {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await api.post("/upload", formData, config);
    const data = res.data?.data;
    if (data) setFieldValue(name || "", data[0]?.filename);
  };

  return (
    <div className={`flex flex-col mx-4 my-4  ${classname} `}>
      {label && (
        <label className="text-sm font-bold text-gray-700">{label}</label>
      )}
      <div className="flex items-center">
        <label
          htmlFor="file-upload"
          className={`flex items-center cursor-pointer border-2 rounded w border-gray-400 focus:border-blue-600 h-10 px-3 text-sm font-semibold my-2 min-w-[270px] ${className}`}
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </span>
          <span className="text-black  font-semibold">Upload File</span>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleChange(e.target.files[0]);
            }
          }}
          {...rest}
        />
      </div>
      <div className=" text-sm">
        <p>{field.value}</p>
      </div>
    </div>
    // <div className={`flex flex-col mx-4 my-4 ${classname} `}>
    //   {label && (
    //     <label className="text-sm font-bold text-gray-700">{label}</label>
    //   )}
    //   <div className="flex items-center">
    //     <label className="flex items-center cursor-pointer">
    //       <span className="mr-2">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="h-5 w-5"
    //           viewBox="0 0 20 20"
    //           fill="currentColor"
    //         >
    //           <path
    //             fill-rule="evenodd"
    //             d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 012 0v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H5a1 1 0 110-2h5V5z"
    //             clip-rule="evenodd"
    //           />
    //         </svg>
    //       </span>
    //       <span className="text-blue-500 font-medium">Upload File</span>
    //     </label>
    //     <input id="file-upload" type="file" className="hidden" />
    //   </div>
    //   {/* <input
    //     className={`border-[1px] ${
    //       isError
    //         ? "border-red-500 border-[2px]"
    //         : "border-gray-400 focus:border-blue-600"
    //     } focus:border-[2px] outline-none rounded-md h-10 px-3 text-sm font-semibold my-2 min-w-[270px] ${className}`}
    //     placeholder={placeholder}
    //     {...field}
    //     onChange={(e) => {
    //       if (e.target.files) {
    //         handleChange(e.target.files[0]);
    //       }
    //     }}
    //     {...rest}
    //     type="file"
    //   /> */}
    //   {isError && (
    //     <div className="text-red-500 text-sm w-fit">{meta.error}</div>
    //   )}
    // </div>
  );
}
