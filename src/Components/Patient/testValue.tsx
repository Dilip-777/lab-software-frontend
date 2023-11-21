import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

interface Props {
  test: OrderTest;
  patient: Patient;
  input: boolean;
  handleChange: (value: any, id: number, field: string) => void;
  focus: boolean;
  changes?: any[];
  handleFormula?: (profile: OrderProfile, test: OrderTest) => void;
  profile?: OrderProfile;
}

export default function TestValue({
  test,
  changes = [],
  patient,
  input,
  handleChange,
  focus,
  handleFormula,
  profile,
}: Props) {
  // return <div></div>;
  const ch = changes.find((c) => c.id === test.id);

  const [value, setValue] = useState(test.observedValue || "");
  const [highlight, setHighlight] = useState(test.highlight || "");
  const [testmethodtype, setTestmethodtype] = useState(
    test.testmethodtype || test.test.testmethodtype || ""
  );
  const [bold, setBold] = useState(test.bold || false);

  const items = ["Normal", "High", "Low"];
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (ch && ch.observedValue) {
      setValue(ch?.observedValue);
      const h = handleHighlight(parseInt(ch?.observedValue));
      if (h !== highlight) {
        setHighlight(h);
        handleChange(h, test.id, "highlight");
      }
    }
  }, [changes]);

  useEffect(() => {
    handleFormula && profile && handleFormula(profile, test);
    console.log(changes, "changes");
  }, []);

  const filteredPeople =
    highlight === ""
      ? items
      : items.filter((person) =>
          person
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(highlight.toLowerCase().replace(/\s+/g, ""))
        );

  const getReferenceValue = (test: Test) => {
    let r = test.referencesValues.find(
      (ref) =>
        patient && ref.minAge <= patient?.age && ref.maxAge >= patient?.age
    );
    if (test.referencesValues.length === 0)
      return {
        arr: [0, 0, "-"],
        str: ["-"],
        unit: "-",
      };
    if (!r) r = test.referencesValues[0];

    const str = r.note
      ? r.note.split("\n")
      : [`${r.lowerValue} - ${r.upperValue} `];

    return {
      arr: [r?.lowerValue, r?.upperValue, r?.unit],
      str: str,
      unit: r?.unit,
    };
  };

  const { arr, str, unit } = getReferenceValue(test.test);

  const handleHighlight = (value: number) => {
    if (value > (arr[1] as number)) return "High";
    else if (value < (arr[0] as number)) return "Low";
    else return "";
  };

  return (
    <tr>
      <td className="px-3 py-3 text-sm font-medium text-gray-800 min-w-[14rem]">
        <div>
          <p className="px-1">{test.name}</p>
          {!input ? (
            <p className="text-[0.8rem] text-gray-500">
              {test.testmethodtype || test.test.testmethodtype}
            </p>
          ) : (
            <div className=" border-b-2 border-teal-500 pb-1 px-1 max-w-[6rem]">
              <input
                // ref={firstInputElementRef}
                value={testmethodtype}
                onChange={(e) => {
                  setTestmethodtype(e.target.value);
                  // handleChange(e.target.value, test.id, "testmethodtype");

                  // const h = handleHighlight(parseInt(e.target.value));
                  // if (h !== highlight) {
                  //   setHighlight(h);
                  //   handleChange(h, test.id, "highlight");
                  // }
                }}
                onBlur={(e) => {
                  handleChange(e.target.value, test.id, "testmethodtype");
                }}
                className=" border-none focus:outline-none bg-transparent "
                autoFocus={focus}
              />
            </div>
          )}
        </div>
      </td>
      {!input ? (
        <td
          className="px-5 py-2 text-sm font-medium text-gray-800"
          // align="center"
        >
          {value}
        </td>
      ) : (
        <td className="px-3  text-sm font-medium text-gray-800 ">
          <div className="border-b-[1px] focus-within:border-b-2 focus-within:border-teal-500 border-gray-500 py-2 px-2 max-w-[6rem]">
            <input
              // ref={firstInputElementRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                handleChange(e.target.value, test.id, "observedValue");

                const h = handleHighlight(parseInt(e.target.value));
                if (h !== highlight) {
                  setHighlight(h);
                  if (h !== "") {
                    handleChange(true, test.id, "bold");
                    setBold(true);
                  } else {
                    handleChange(false, test.id, "bold");
                    setBold(false);
                  }
                  handleChange(h, test.id, "highlight");
                }
              }}
              onBlur={(e) => {
                if (
                  e.target.value !== "" &&
                  Number(e.target.value) !== test.observedValue
                )
                  handleChange(e.target.value, test.id, "observedValue");
              }}
              type="number"
              className=" border-none focus:outline-none bg-transparent "
              autoFocus={focus}
            />
          </div>
        </td>
      )}
      <td className="px-3 py-0 text-sm font-medium text-gray-800">
        {value &&
          (input ? (
            <div className="flex">
              <input
                type="checkbox"
                size={60}
                className="w-4 h-4 mt-auto mr-2 cursor-pointer"
                checked={bold}
                onChange={(e) => {
                  handleChange(e.target.checked, test.id, "bold");
                  setBold(e.target.checked);
                }}
              />
              <Combobox
                value={highlight}
                onChange={(v) => {
                  setHighlight(v);
                  handleChange(v, test.id, "highlight");
                }}
              >
                <div className="relative mt-1 ">
                  <div className="relative w-full cursor-default overflow-hidden text-left   sm:text-sm border-b-2 border-teal-500 py-2 px-2 max-w-[6rem]">
                    <Combobox.Input
                      className={`w-full pl-1  text-sm leading-5 text-gray-900 border-none focus:outline-none bg-transparent font-${
                        test.bold ? "bold" : "normal"
                      }`}
                      displayValue={(person: string) => person}
                      onChange={(event) => {
                        setHighlight(event.target.value);
                        handleChange(event.target.value, test.id, "highlight");
                      }}
                    />
                    {/* <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button> */}
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                      {filteredPeople.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredPeople.map((person) => (
                          <Combobox.Option
                            key={person}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 text-center z-10 ${
                                active
                                  ? "bg-teal-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={person}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {person}
                                </span>
                                {/* {selected ? (
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
                                ) : null} */}
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
          ) : (
            highlight
          ))}
      </td>
      <td className="px-3 py-2 text-sm font-medium text-gray-800">
        <div className="flex flex-col justify-center">
          {str.map((s) => (
            <p>{s}</p>
          ))}
        </div>
      </td>
      <td className="px-3 py-2 text-sm font-medium text-gray-800 ">{unit}</td>
    </tr>
  );
}
