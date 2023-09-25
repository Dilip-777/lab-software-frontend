import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function Autocomplete1({
  // setItem,
  items,
  item,
  handleChange,
  label,
  placeholder,
  comparator,
}: {
  // setItem: React.Dispatch<React.SetStateAction<any>>;
  items: any[];
  item: any;
  comparator: string;
  handleChange: (d: any) => void;
  label?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(item?.[comparator] || "");

  const filteredTests =
    query === ""
      ? items.map((p) => {
          return { id: p.id, name: p[comparator] };
        })
      : items
          .filter((test) =>
            test[comparator]
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          )
          .map((p) => {
            return { id: p?.id, name: p[comparator] };
          });

  // console.log(filteredTests, "filteredTests");

  return (
    <div className="flex  item-center  mx-3 my-4">
      <div className="w-full">
        <Combobox
          // value={selected}
          value=""
          onChange={(id) => {
            if (id) {
              handleChange(items.find((i) => i?.id === parseInt(id)));
              setQuery(items.find((i) => i?.id === parseInt(id))?.[comparator]);
            }
          }}
        >
          <div className="relative mt-1 w-full">
            <p className="text-sm font-bold w-full text-gray-700 mb-1">
              {label}
            </p>
            <div className="relative w-full cursor-default border-2 border-gray-400 focus-within:border-blue-600 overflow-hidden  text-left shadow-md  sm:text-sm">
              <Combobox.Input
                className="w-full border-none focus:border-none focus-visible:border-none focus-visible:outline-none py-3 pl-4 pr-10 text-md leading-5 text-gray-900 min-w-full "
                displayValue={(person: any) => person[comparator]}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                value={query}
                autoComplete="off"
              />
              <Combobox.Button className="absolute inset-y-0  right-0 flex item-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400 my-auto"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
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
                          <span
                            className={`block truncate cursor-pointer ${
                              item?.id ? "font-medium" : "font-normal"
                            }`}
                          >
                            {person.name}
                          </span>
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
          </div>
        </Combobox>
      </div>
    </div>
  );
}
