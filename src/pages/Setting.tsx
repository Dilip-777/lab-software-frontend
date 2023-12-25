import { useEffect, useRef, useState } from "react";
import FormSelect from "../ui/FormSelect";
import { cn } from "../utils";
import { api, getDepartments } from "../Api";
import { Button } from "../ui/Buttons";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import FormInput from "../ui/FormInput";
import DialogBox from "../ui/DialogBox";
import Divider from "../ui/Divider";
import SignsUpload from "../Components/settings";

export default function Setting() {
  const [printSetting, setPrintSetting] = useState<PrintSetting>({
    uploadletterhead: false,
    letterhead: null,
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
    departmentwisesigns: false,
    topmargin: 0,
    bottommargin: 0,
    leftmargin: 0,
    rightmargin: 0,
    profilefirst: false,
    commonsigns: false,
  });
  const [loading, setLoading] = useState(false);
  const [contentloading, setContentLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);

  const fetchSettings = async () => {
    setContentLoading(true);
    const res = await api.get("/setting/getSettings");
    if (res.data.settings) setPrintSetting(res.data.settings);
    setContentLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await api.post("/upload", formData, config);
    const data = res.data?.data;
    if (data)
      setPrintSetting({
        ...printSetting,
        uploadletterhead: true,
        letterhead: data[0]?.filename,
      });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { signs, ...rest } = printSetting;
      const res = await api.post("/setting/save", {
        settings: {
          ...rest,
          topmargin: Number(rest.topmargin),
          bottommargin: Number(rest.bottommargin),
          leftmargin: Number(rest.leftmargin),
          rightmargin: Number(rest.rightmargin),
        },
        departments: departments,
      });
      if (res.data.success) alert("Settings Saved Successfully");
      setPrintSetting(res.data.settings);
      fetchDepartments();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
            <SettingItem
              label="Print Profile Before Tests"
              value={printSetting?.profilefirst || false}
              handleChange={(value) =>
                setPrintSetting({ ...printSetting, profilefirst: value })
              }
            />
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">Print End Report Text:</p>
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
                inputClassName="!border-0 !border-b  rounded-b-none h-9 focus-within:border-b-2"
                divClassName="border-0"
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
            <div className="flex items-center w-2/3 justify-between">
              <SettingItem
                label="Upload Letter Head"
                value={printSetting?.showendline || false}
                handleChange={(value) =>
                  setPrintSetting({ ...printSetting, showendline: value })
                }
                className="font-semibold"
              />

              <label htmlFor="upload" className="cursor-pointer">
                <span className="w-full py-2 bg-black/5">
                  {printSetting.letterhead ? (
                    <div>
                      <div className="w-30 h-24 shadow-md border border-black/10">
                        <img
                          src={`http://localhost:5000/uploadedFiles/${printSetting.letterhead}`}
                          alt=""
                          className="h-full w-full"
                        />
                      </div>
                      <p className="text-[11px] text-center w-full py-2 px-2 bg-black/80 border border-black/20 text-white">
                        Upload Letter Head
                      </p>
                    </div>
                  ) : (
                    <p className="px-2 bg-btnBackground text-white py-2 rounded-sm">
                      Upload Letter Head
                    </p>
                  )}
                </span>
                <input type="file" id="upload" hidden onChange={handleUpload} />
              </label>
              <div className="grid grid-cols-2">
                <FormInput
                  label="Top Margin"
                  value={printSetting?.topmargin || 0}
                  type="number"
                  handleChange={(value) =>
                    setPrintSetting({
                      ...printSetting,
                      topmargin: value as number,
                    })
                  }
                  className="outline-none border-b border-gray-300 focus-within:border-blue-500 focus-within:border-b-2  focus-within:py-1 text-sm font-semibold transition-all duration-300 ease-in-out px-2 py-2 min-w-[10rem]"
                  placeholder="Top Margin"
                />
                <FormInput
                  label="Bottom Margin"
                  value={printSetting?.bottommargin || 0}
                  type="number"
                  handleChange={(value) =>
                    setPrintSetting({
                      ...printSetting,
                      bottommargin: value as number,
                    })
                  }
                  className="outline-none border-b border-gray-300 focus-within:border-blue-500 focus-within:border-b-2  focus-within:py-1 text-sm font-semibold transition-all duration-300 ease-in-out px-2 py-2 min-w-[10rem]"
                  placeholder="Bottom Margin"
                />
                <FormInput
                  label="Left Margin"
                  value={printSetting?.leftmargin || 0}
                  type="number"
                  handleChange={(value) =>
                    setPrintSetting({
                      ...printSetting,
                      leftmargin: value as number,
                    })
                  }
                  className="outline-none border-b border-gray-300 focus-within:border-blue-500 focus-within:border-b-2  focus-within:py-1 text-sm font-semibold transition-all duration-300 ease-in-out px-2 py-2 min-w-[10rem]"
                  placeholder="Left Margin"
                />
                <FormInput
                  label="Right Margin"
                  value={printSetting?.rightmargin || 0}
                  type="number"
                  handleChange={(value) =>
                    setPrintSetting({
                      ...printSetting,
                      rightmargin: value as number,
                    })
                  }
                  className="outline-none border-b border-gray-300 focus-within:border-blue-500 focus-within:border-b-2  focus-within:py-1 text-sm font-semibold transition-all duration-300 ease-in-out px-2 py-2 min-w-[10rem]"
                  placeholder="Right Margin"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <SettingItem
                label="Department Wise Signatures"
                value={printSetting?.departmentwisesigns || false}
                handleChange={(value) =>
                  setPrintSetting({
                    ...printSetting,
                    departmentwisesigns: value,
                    commonsigns: !value,
                  })
                }
                className="font-semibold"
              />
              <p className="text-sm font-semibold">OR</p>
              <Button label="Add Signature" onClick={() => setOpen(true)} />
            </div>
            <SettingItem
              label="Common Signatures"
              value={printSetting?.commonsigns || false}
              handleChange={(value) =>
                setPrintSetting({
                  ...printSetting,
                  commonsigns: value,
                  departmentwisesigns: !value,
                })
              }
              className="font-semibold"
            />
            <div className="flex gap-4 p-2">
              {printSetting.signs?.map((sign) => (
                <div className="flex flex-col ">
                  <img
                    src={`http://localhost:5000/uploadedFiles/${sign.signature}`}
                    alt=""
                    className="w-40 my-2 shadow-md border border-black/10"
                  />
                  <p className="text-sm text-gray-700">{sign.doctorname}</p>
                  <p className="text-xs text-gray-500">{sign.specialisation}</p>
                </div>
              ))}
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
      <DialogBox open={open} setOpen={setOpen}>
        <div className="p-4">
          <p className="text-md font-semibold">Add Signature</p>
          <Divider className="my-2 border !border-t-gray-400" />
          <SignsUpload
            id={printSetting.id}
            handleClose={() => setOpen(false)}
          />
          {/* <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-4 items-center">
              <SettingItem
                label="Department Wise Signatures"
                value={printSetting?.departmentwisesigns || false}
                handleChange={(value) =>
                  setPrintSetting({
                    ...printSetting,
                    departmentwisesigns: value,
                  })
                }
                className="font-semibold"
              />
              <p className="text-sm font-semibold">OR</p>
              <Button label="Add Signature" onClick={() => setOpen(true)} />
            </div>
          </div> */}
        </div>
      </DialogBox>
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
  return (
    <div className={cn("flex gap-2 ", className)}>
      <input
        className="w-4 h-4 transition-all duration-300 ease-in-out rounded-sm border-gray-500 outline-none cursor-pointer"
        type="checkbox"
        id={label}
        checked={value}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
      />
      <label htmlFor={label} className="text-sm cursor-pointer">
        {label}
      </label>
    </div>
  );
};
