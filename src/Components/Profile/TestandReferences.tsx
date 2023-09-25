import React, { useState, useEffect, SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { getTest } from "../../Api";

function Test({
  test,
  handleOpen,
  setTestIds,
}: {
  test: any;
  handleOpen?: (id: any) => void;
  setTestIds: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [references, setReferences] = useState<any[]>([]);
  const fetchReferences = async () => {
    const res = await getTest(test.id);
    setReferences(res?.references || []);
  };
  useEffect(() => {
    fetchReferences();
  }, []);

  console.log(test, "tests");

  return (
    <div className="my-3">
      <div className="flex">
        <div className="min-w-[40%]">
          <p className="text-lg font-semibold">{test.name}</p>
        </div>
        <div className="min-w-[30%]">
          {handleOpen && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded h-10 my-auto"
              type="button"
              onClick={() => handleOpen(test)}
            >
              References
            </button>
          )}
        </div>
        <div className="w-8 h-2 ">
          <XMarkIcon
            fontSize="10px"
            color="red"
            className="text-red text-sm cursor-pointer"
            onClick={() =>
              setTestIds((prev) => prev.filter((p) => p.id !== test.id))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Test;
