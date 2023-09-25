import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function PatientAutocomplete({
  // setItem,
  items,
  item,
  handleChange,
  label,
  placeholder,
  className,
  setFieldValue,
  value,
  name,
  name1,
  options1,
  type,
}: {
  // setItem: React.Dispatch<React.SetStateAction<any>>;
  items: any[];
  item: any;
  handleChange: (d: any) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  value: any;
  name: string;
  name1?: string;
  options1?: string[];
  type?: string;
}) {
  const [query, setQuery] = useState(
    (item?.nameprefix || "") +
      (item?.name || "") +
      " " +
      (item?.gender || "") +
      " " +
      (item?.age?.toString() || "") +
      (item?.agesuffix || "") || ""
  );

  const filteredTests =
    query === ""
      ? items.map((p) => {
          return {
            id: p.id,
            name1: (p.nameprefix || "") + p.name,
            gender: p.gender,
            age: p.age?.toString() + p.agesuffix,
            phonenumber: p.phonenumber,
            name:
              (p.nameprefix || "") +
              p.name +
              " " +
              p.gender +
              " " +
              p.age?.toString() +
              p.agesuffix,
          };
        })
      : items
          .filter((p) =>
            (name === "phonenumber"
              ? p.phonenumber
              : (p.nameprefix || "") + p.name
            )
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          )
          .map((p) => {
            console.log(
              (p.nameprefix || "") + p.name + type === "number"
                ? p.phonenumber
                : ""
            );

            return {
              id: p?.id,
              name1: (p.nameprefix || "") + p.name,
              gender: p.gender,
              age: p.age?.toString() + p.agesuffix,
              phonenumber: p.phonenumber,
              name:
                (p.nameprefix || "") +
                p.name +
                " " +
                p.gender +
                " " +
                p.age?.toString() +
                p.agesuffix,
            };
          });

  // console.log(filteredTests, "filteredTests");
  console.log(value, "value");

  return (
    <div className={`flex  items-center  mx-3 my-3 ${className}`}>
      <div className="w-full">
        <Combobox
          // value={selected}
          // value=""
          value={value}
          onChange={(id) => {
            if (id) {
              handleChange(items.find((i) => i?.id === parseInt(id)));
              const i = items.find((i) => i?.id === parseInt(id));
              setQuery(i.name);
            }
          }}
        >
          <div className="relative mt-0 w-full">
            <p className="text-sm font-bold w-full text-gray-700 ">{label}</p>
            <div className="flex items-center">
              {options1 && name1 && (
                <select
                  className={`border-2 px-3 py-2 border-r-0 border-gray-400 outline-none appearance-none bg-white text-sm font-semibold  h-10 my-2`}
                  // {...rest}
                  value={item?.nameprefix}
                  onChange={(e) => {
                    setFieldValue(name1, e.target.value);
                    handleChange(undefined);
                  }}
                >
                  {options1.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              )}

              <div className="relative w-full cursor-default border-2 border-gray-400 focus-within:border-blue-600 overflow-hidden  text-left shadow-md  h-10  sm:text-sm my-2 font-semibold">
                <Combobox.Input
                  className="w-full border-none focus:border-none focus-visible:border-none focus-visible:outline-none py-2 pl-4  pr-10 text-md leading-5 text-gray-900 min-w-full "
                  displayValue={(person: any) => person.name}
                  onChange={(event) => {
                    let s = event.target.value;
                    if (type === "number") {
                      s = s.replace(/[^0-9]/g, "");
                    }
                    setQuery(s);
                    setFieldValue(name, s);
                    handleChange(undefined);
                  }}
                  placeholder={placeholder}
                  value={value}
                  autoComplete="off"
                />
                <Combobox.Button className="absolute inset-y-0  right-0 flex item-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400 my-auto"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
            </div>
            {(filteredTests.length > 0 || query !== "") && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                // afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white  py-1  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {/* {filteredTests.length === 0 && (
                  <Combobox.Option
                    value={undefined}
                    className="p-3 cursor-pointer bg-teal-600 text-white"
                  >
                    Create "{query}"
                    </Combobox.Option>
                )} */}

                  {filteredTests.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredTests.map((person) => (
                      <Combobox.Option
                        key={person?.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={person?.id}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex flex-col">
                              <span
                                className={`block truncate cursor-pointer ${
                                  item?.id ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name1}
                              </span>
                              <ul
                                className="flex list-disc"
                                style={{ listStyleType: "circle" }}
                              >
                                <li
                                  className={`mr-4 block truncate cursor-pointer ${
                                    item?.id ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {person.age}
                                </li>
                                <li
                                  className={`mr-4 block truncate cursor-pointer ${
                                    item?.id ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {person.gender}
                                </li>
                                <li
                                  className={`mr-0 block truncate cursor-pointer ${
                                    item?.id ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {person.phonenumber}
                                </li>
                              </ul>
                              {/* <span
                                className={`block truncate cursor-pointer ${
                                  item?.id ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.age +
                                  "   " +
                                  person.gender +
                                  "   " +
                                  person.phonenumber}
                              </span> */}
                            </div>
                            {item?.id ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex item-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            )}
          </div>
        </Combobox>
      </div>
    </div>
  );
}
