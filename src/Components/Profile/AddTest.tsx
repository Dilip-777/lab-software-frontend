import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "../../ui/Buttons";
import Autocomplete from "./autocomplete";
import Divider from "../../ui/Divider";
import Test from "./TestandReferences";
import { useEffect, useState } from "react";

interface AddTestProps {
  tests?: Test[];
  setTestIds: React.Dispatch<React.SetStateAction<any[]>>;
  createTest: (name: string) => Promise<void>;
  testIds: any[];
  heading: string;
  handleheadings: (
    oldheading: string,
    newHeading?: string,
    test?: Test,
    oldtest?: Test
  ) => void;
  addTests: (name: string, query: string, comparator: string) => void;
  handleClick: (id: any) => void;
  selected: Test[];
  addHeading?: boolean;
}

const AddTest = ({
  tests,
  setTestIds,
  createTest,
  testIds,
  heading,
  handleheadings,
  addTests,
  handleClick,
  selected,
  addHeading,
}: AddTestProps) => {
  const [value, setValue] = useState(heading || "");

  useEffect(() => {
    setValue(heading || "");
  }, [heading]);

  const handleFieldKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleheadings(heading, value);
      if (!heading) {
        setValue("");
      }
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-3 w-full items-center">
        {addHeading && (
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value.toString());
            }}
            onBlur={(e) => {
              handleheadings(heading, value);
              if (!heading) {
                setValue("");
              }
            }}
            onKeyDown={handleFieldKeyDown}
            onSubmit={() => {
              handleheadings(heading, value);
              if (!heading) {
                setValue("");
              }
            }}
            placeholder="New Heading"
            className="border-b-2 p-2 pl-0 border-bottom-2 border-gray-400 outline-none focus:border-b-2 focus:border-blue-600 focus:ring-0 focus:ring-blue-600 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-300 ease-in-out font-bold mx-3"
          />
        )}

        {addHeading &&
          (heading ? (
            <div
              className="w-8 h-8 p-1 hover:bg-red-50 rounded-full"
              onClick={() => handleheadings(heading, "")}
            >
              <XMarkIcon
                fontSize="10px"
                color="red"
                className="cursor-pointer"
              />
            </div>
          ) : (
            <Button
              type="button"
              label="Add"
              onClick={() => handleheadings("", value)}
              className="h-9 self-end my-4"
            />
          ))}
      </div>
      {tests && (
        <div className="pl-5">
          {selected?.map((test) => (
            <Test
              handleOpen={handleClick}
              test={test}
              setTestIds={setTestIds}
              handleDelete={(test) =>
                handleheadings(heading, undefined, undefined, test)
              }
            />
          ))}
        </div>
      )}

      {tests && (
        <Autocomplete
          tests={tests}
          setTestIds={setTestIds}
          createTest={createTest}
          handleChange={addTests}
          testIds={testIds}
          placeholder="Select the Tests"
          heading={heading}
          className="w-1/2"
        />
      )}

      <Divider className="!border-[1px] !border-gray-400" />
    </div>
  );
};

export default AddTest;
