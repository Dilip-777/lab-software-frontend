import { useEffect, useRef, useState } from "react";
import FormSelect from "../ui/FormSelect";
import { cn } from "../utils";
import { api, getDepartments } from "../Api";
import { Button } from "../ui/Buttons";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

export default function Setting() {
  const [printSetting, setPrintSetting] = useState<PrintSetting>({
    uploadletterhead: false,
    departmentwise: false,
    disableqrcode: false,
    endline: "",
    endlineposition: "",
    id: 0,
    pagenumber: false,
    profilenewpage: false,
    showendline: false,
    signdepartmentwise: false,
    testnewpage: false,
    testprofilesamepage: false,
    topbottommargin: false,
  });
  const [loading, setLoading] = useState(false);
  const [contentloading, setContentLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchSettings = async () => {
    setContentLoading(true);
    const res = await api.get("/setting/getSettings");
    if (res.data.settings) setPrintSetting(res.data.settings);
    setContentLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await api.post("/setting/save", {
      settings: printSetting,
      departments: departments,
    });
    if (res.data.success) alert("Settings Saved Successfully");
    setPrintSetting(res.data.settings);
    fetchDepartments();
    setLoading(false);
  };

  const fetchDepartments = async () => {
    const res = await getDepartments();
    setDepartments(res);
  };

  useEffect(() => {
    fetchSettings();
    fetchDepartments();
  }, []);

  const dragPerson = useRef<number>(0);
  const draggedOverPerson = useRef<number>(0);

  function handleSort() {
    setDepartments((prev) => {
      return prev.map((department, index) => {
        if (index === dragPerson.current) {
          const d = departments[draggedOverPerson.current];
          return { ...d, order: departments.length - index };
        }
        if (index === draggedOverPerson.current) {
          const d = departments[dragPerson.current];
          return { ...d, order: departments.length - index };
        }
        return { ...department, order: departments.length - index };
      });
    });
  }

  console.log(departments);

  return (
    <div className="px-7 py-4">
      <div className=" py-2 px-8 rounded-md h-full w-full bg-white shadow-md">
        <p className="text-lg m-2 font-bold">Print Setting</p>
      </div>
      {!contentloading && (
        <div className="p-3 px-7 rounded-md h-full w-full bg-white shadow-md mt-3">
          <p className="text-md font-semibold">Lab Default Setting</p>
          <div className="flex flex-col gap-4 mt-4">
            <SettingItem
              label="Upload Lab Letterhead"
              value={printSetting?.uploadletterhead || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, uploadletterhead: value })
              }
            />
            <SettingItem
              label="Print QR Code"
              value={printSetting?.disableqrcode || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, disableqrcode: value })
              }
            />
            <SettingItem
              label="Print Page Number"
              value={printSetting?.pagenumber || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, pagenumber: value })
              }
            />
            <p className="text-md font-semibold mt-3">
              Reports Print & Share Default Settings
            </p>
            <SettingItem
              label="Test New Page"
              value={printSetting?.testnewpage || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, testnewpage: value })
              }
            />
            <SettingItem
              label="Profile New Page"
              value={printSetting?.profilenewpage || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, profilenewpage: value })
              }
            />
            <SettingItem
              label="Test Profile Same Page"
              value={printSetting?.testprofilesamepage || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, testprofilesamepage: value })
              }
            />
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold" draggable>
                Print End Report Text:
              </p>
              <SettingItem
                label="Show End Report Text"
                value={printSetting?.showendline || false}
                handleChange={(value) =>
                  setPrintSetting({ ...printSetting, showendline: value })
                }
              />

              <FormSelect
                value={printSetting?.endlineposition || ""}
                setValue={(value) =>
                  setPrintSetting({
                    ...printSetting,
                    endlineposition: value as string,
                  })
                }
                placeholder="Select End Line Position"
                options={[
                  { value: "true", label: "Show in Each Test End" },
                  { value: "false", label: "Show Last of Report" },
                ]}
                inputClassName="border-0 border-b rounded-b-none h-9"
              />
              <input
                value={printSetting?.endline || ""}
                onChange={(e) =>
                  setPrintSetting({ ...printSetting, endline: e.target.value })
                }
                placeholder="Enter End Line"
                className=" outline-none border-b border-gray-300 focus-within:border-blue-500 focus-within:border-b-2  focus-within:py-1 text-sm font-semibold transition-all duration-300 ease-in-out px-2 py-2 min-w-[15rem]"
              />
            </div>
            <SettingItem
              label="Department Order"
              value={printSetting?.departmentwise || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, departmentwise: value })
              }
              className="font-semibold"
            />
            {departments.map((department, index) => (
              <div
                key={department.id}
                draggable
                onDragStart={() => (dragPerson.current = index)}
                onDragEnter={() => (draggedOverPerson.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-move bg-gray-200 p-2 flex justify-between items-center"
              >
                <p>{department.name}</p>
                <div className="flex">
                  <ArrowUpIcon className="h-5 w-5" />
                  <ArrowDownIcon className="h-5 w-5" />
                </div>
              </div>
            ))}
            <Button
              label="Save"
              onClick={() => handleSave()}
              loading={loading}
              className="self-end mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface SettingItemProps {
  label: string;
  value: boolean;
  handleChange: (value: boolean) => void;
  className?: string;
}

const SettingItem = ({
  label,
  value,
  handleChange,
  className,
}: SettingItemProps) => {
  const [defaultValue, setDefaultValue] = useState(value || false);
  return (
    <div className={cn("flex gap-2 ", className)}>
      <input
        className="w-4 h-4 transition-all duration-300 ease-in-out rounded-sm border-gray-500 outline-none cursor-pointer"
        type="checkbox"
        id={label}
        checked={defaultValue}
        onChange={(e) => {
          setDefaultValue(e.target.checked);
          handleChange(e.target.checked);
        }}
      />
      <label htmlFor={label} className="text-sm cursor-pointer">
        {label}
      </label>
    </div>
  );
};
