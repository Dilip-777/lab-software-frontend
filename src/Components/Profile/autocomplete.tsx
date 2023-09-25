import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function Autocomplete({
  createTest,
  setTestIds,
  tests,
  testIds,
  label,
  placeholder,
  className,
  comparator = "name",
}: {
  createTest?: (name: string) => Promise<void>;
  setTestIds: React.Dispatch<React.SetStateAction<any[]>>;
  tests: any[];
  testIds: any[];
  label?: string;
  placeholder?: string;
  className?: string;
  comparator?: string;
}) {
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  console.log(tests, comparator);

  const filteredTests =
    query === ""
      ? tests.map((p) => {
          return { id: p.id, name: p[comparator] };
        })
      : tests
          .filter((test) =>
            test[comparator]
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          )
          .map((p) => {
            return { id: p.id, name: p[comparator] };
          });

  return (
    <div className={`flex  items-center  mx-3 my-3   ${className}`}>
      <div className="w-full">
        <Combobox
          // value={selected}
          value=""
          onChange={(name) => {
            if (name) {
              if (!testIds.find((i) => i[comparator] === name)) {
                setTestIds((t) => [
                  ...t,
                  tests.find((i) => i[comparator] === name),
                ]);
              }
            } else {
              if (createTest) createTest(query);
              // setQuery("");
            }
            console.log(name, "name");
          }}
        >
          <div className="relative mt-0 w-full">
            <p className="text-sm font-semibold text-gray-700 ">{label}</p>
            <div
              className={`relative w-full cursor-default border-2 border-gray-400 focus-within:border-blue-600 overflow-hidden text-left shadow-md  sm:text-sm my-2 ${className}`}
            >
              <Combobox.Input
                className={`  border-none focus:border-none focus-visible:border-none focus-visible:outline-none py-3 pl-4 pr-10 text-md leading-5 h-9 text-gray-900 w-full  ${className}`}
                displayValue={(person: any) => person.name}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                autoComplete="off"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto  bg-white  py-1  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {filteredTests.length === 0 && createTest && (
                  <Combobox.Option
                    value={undefined}
                    className="p-3 cursor-pointer bg-teal-600 text-white"
                  >
                    Create "{query}"
                  </Combobox.Option>
                )}

                {filteredTests.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredTests.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={person.name}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate cursor-pointer ${
                              testIds.find((t) => t[comparator] === person.name)
                                ? "font-medium"
                                : "font-normal"
                            }`}
                          >
                            {person.name}
                          </span>
                          {testIds.find(
                            (t) => t[comparator] === person.name
                          ) ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
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
