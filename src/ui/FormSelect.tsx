import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: { value: string | number; label: string }[];
  placeholder: string;
  label?: string;
  divClassName?: string;
  inputClassName?: string;
}

const people = [
  { name: "Wade Cooper" },
  { name: "Arlene Mccoy" },
  { name: "Devon Webb" },
  { name: "Tom Cook" },
  { name: "Tanya Fox" },
  { name: "Hellen Schmidt" },
];

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
      <Listbox value={value} onChange={setValue}>
        <div className="relative">
          <Listbox.Button
            className={`text-gray-600 p-2  border-2 border-gray-400 focus-within:border-palatinateBlue bg-white rounded-md  text-sm focus-within:shadow-lg h-12 w-[250px] ${inputClassName}`}
          >
            <span className="text-left truncate block">
              {options.find((o) => o.value === value)?.label || placeholder}
            </span>
            {/* {selected.name} */}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-gray-200" : "text-gray-900"
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block  ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>

    // <div className={`flex flex-col mx-10 ${divClassName}`}>
    //   {label && <p className="text-black  text-sm font-semibold">{label}</p>}
    //   <select
    //     className={`text-gray-600 pr-2  border-2 border-gray-400 focus-within:border-gray-500 bg-white rounded-md p-2 text-sm focus-within:shadow-lg h-12 w-[250px] ${inputClassName}`}
    //     value={value}
    //     onChange={(e) => setValue(e.target.value)}
    //   >
    //     <option value="">{placeholder}</option>
    //     {options.map((option) => (
    //       <option key={option.value} value={option.value}>
    //         {option.label}
    //       </option>
    //     ))}
    //   </select>
    // </div>
  );
}
