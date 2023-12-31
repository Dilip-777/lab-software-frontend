import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { getTest } from "../../Api";
import { Button } from "../../ui/Buttons";

function Test({
  test,
  handleOpen,
  setTestIds,
  handleDelete,
}: {
  test: any;
  handleOpen?: (id: any) => void;
  setTestIds: React.Dispatch<React.SetStateAction<any[]>>;
  handleDelete?: (test: Test) => void;
}) {
  const [references, setReferences] = useState<any[]>([]);
  const fetchReferences = async () => {
    const res = await getTest(test.id);
    setReferences(res?.references || []);
  };
  useEffect(() => {
    fetchReferences();
  }, []);

  return (
    <div className="my-3">
      <div className="flex">
        <div className="min-w-[40%]">
          <p className="text-lg font-semibold">{test.name}</p>
        </div>
        <div className="min-w-[30%]">
          {handleOpen && (
            <Button
              label="References"
              onClick={() => handleOpen(test)}
              className="h-10 my-auto"
              type="button"
            />
          )}
        </div>
        <div className="w-8 h-8 p-1 hover:bg-red-50 rounded-full">
          <XMarkIcon
            fontSize="10px"
            color="red"
            className="cursor-pointer"
            onClick={() => {
              if (handleDelete) {
                handleDelete(test);
              } else {
                setTestIds((prev) => prev.filter((p) => p.id !== test.id));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Test;
