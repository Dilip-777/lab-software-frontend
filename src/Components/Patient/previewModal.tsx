import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { api, getDepartments } from "../../Api";
import { generateReport } from "../../ui/generateReport";
import Loader from "../../ui/Loader";
import { Button } from "../../ui/Buttons";

interface props {
  isOpen: boolean;
  closeModal: () => void;
  order: Order;
  patient: Patient | undefined;
}

interface selected {
  type: "test" | "profile" | "package";
  name: string;
}

export default function PreviewModal({
  closeModal,
  isOpen,
  order,
  patient,
}: props) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedTests, setSelectedTests] = useState<selected[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [printSetting, setPrintSetting] = useState<PrintSetting | undefined>(
    undefined
  );
  const [letterhead, setLetterhead] = useState<boolean>(
    printSetting?.uploadletterhead || false
  );

  const fetchPrintSetting = async () => {
    const res = await api.get("/setting/getSettings");
    if (res.data.settings) setPrintSetting(res.data.settings);
  };

  const fetchPDF = async (selected?: selected[]) => {
    setLoading(true);
    const url = await generateReport({
      packages: order.packages,
      tests: order.tests,
      order,
      patient: patient as Patient,
      profiles: order.profiles,
      selected: selected || selectedTests,
      departments: departments.filter((d) =>
        selectedDepartments.includes(d.id)
      ),
      letterhead,
      printSetting,
    });
    setPdfUrl(url as string);
    console.log(url, "url");

    setLoading(false);
  };

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    handleclickall();
    fetchPDF();
    fetchDepartments();
    fetchPrintSetting();
  }, [order, patient]);

  useEffect(() => {
    fetchDepartments();
  }, [pdfUrl]);

  const getValidity = (pkg: OrderPackage) => {
    pkg.tests.forEach((test) => {
      if (!test.observedValue) return false;
    });
    pkg.profiles.forEach((test) => {
      test.tests.forEach((test) => {
        if (!test.observedValue) return false;
      });
    });
    return true;
  };

  const getValidity2 = (pkg: OrderProfile) => {
    pkg.tests.forEach((test) => {
      if (!test.observedValue) return false;
    });
    return true;
  };

  const handleChange = (e: any, { type, name }: selected) => {
    console.log(e.target.checked, "checked");

    if (e.target.checked) setSelectedTests([...selectedTests, { type, name }]);
    else {
      setSelectedTests(
        selectedTests.filter((s) => !(s.name === name && s.type === type))
      );
    }
  };

  const handleclickall = (e?: any) => {
    console.log(e?.target?.checked, "checked");
    if (e && !e.target.checked) {
      setSelectedTests([]);
      return;
    }
    let selected: selected[] = [];
    order?.packages.forEach((pkg) => {
      pkg.tests.forEach((test) => {
        if (test.observedValue)
          selected.push({ type: "package", name: test.name });
      });
      pkg.profiles.forEach((profile) => {
        if (profile.tests.find((test) => test.observedValue))
          selected.push({ type: "package", name: profile.name });
      });
    });
    order?.profiles.forEach((profile) => {
      if (profile.tests.find((test) => test.observedValue))
        selected.push({ type: "profile", name: profile.name });
    });
    order?.tests.forEach((test) => {
      if (test.observedValue) selected.push({ type: "test", name: test.name });
    });
    console.log(selected, "selected");
    setSelectedTests(selected);
    fetchPDF(selected);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center  text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[75%] transform overflow-auto rounded-md bg-white  text-left align-middle shadow-xl transition-all h-[100vh]">
                  <Dialog.Title
                    as="h3"
                    className="text-sm font-medium leading-3 text-white flex justify-between items-center p-4 bg-[#1e88e5]"
                  >
                    <p>Print</p>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        closeModal();
                        setPdfUrl("");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </Dialog.Title>
                  <div className="flex"></div>

                  <div className="flex" style={{ height: "90%" }}>
                    <div
                      className="flex flex-col overflow-y-auto w-full"
                      // style={{ height: "90%" }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader />
                        </div>
                      ) : (
                        <iframe
                          src={pdfUrl}
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                          name="Name"
                          title="Title"
                        ></iframe>
                      )}
                    </div>
                    <div className="w-[40%]">
                      <div className="w-[100%] flex flex-col text-sm p-6 text-gray-950">
                        <p className="my-2 text-gray-600">
                          Select the tests you want to print
                        </p>
                        <ul className="flex flex-col gap-2">
                          <li className="flex gap-2 items-center">
                            <input
                              onChange={handleclickall}
                              type="checkbox"
                              name="kkk"
                              id="kkk"
                            />
                            <label htmlFor="kkk">Select all</label>
                          </li>
                          {order?.packages.map((pkg) => (
                            <li
                              className="flex gap-2 items-center"
                              key={pkg.id}
                            >
                              <input
                                onChange={(e) =>
                                  handleChange(e, {
                                    type: "package",
                                    name: pkg.name,
                                  })
                                }
                                checked={
                                  !!selectedTests.find(
                                    (s) => s.name === pkg.name
                                  )
                                }
                                className={`border-2 border-gray-700 ${
                                  !getValidity(pkg) && "bg-gray-700"
                                }`}
                                type="checkbox"
                                name=""
                                id=""
                              />
                              <label
                                className={`${
                                  getValidity(pkg) && "font-semibold"
                                }`}
                              >
                                {pkg.name}
                              </label>
                            </li>
                          ))}
                          {order?.profiles.map((profile) => (
                            <li
                              className="flex gap-2 items-center"
                              key={profile.id}
                            >
                              <input
                                checked={
                                  !!selectedTests.find(
                                    (s) => s.name === profile.name
                                  )
                                }
                                onChange={(e) =>
                                  handleChange(e, {
                                    type: "profile",
                                    name: profile.name,
                                  })
                                }
                                className={`border-2 border-gray-700 ${
                                  !getValidity2(profile) && "bg-gray-700"
                                }`}
                                type="checkbox"
                                name=""
                                id=""
                              />
                              <label
                                className={`${
                                  getValidity2(profile) && "font-semibold"
                                }`}
                                htmlFor=""
                              >
                                {profile.name}
                              </label>
                            </li>
                          ))}
                          {order?.tests.map((test) => (
                            <li
                              className="flex gap-2 items-center"
                              key={test.id}
                            >
                              <input
                                onChange={(e) =>
                                  handleChange(e, {
                                    type: "test",
                                    name: test.name,
                                  })
                                }
                                checked={
                                  !!selectedTests.find(
                                    (s) =>
                                      s.type === "test" && s.name === test.name
                                  )
                                }
                                className={`border-2 border-gray-700 ${
                                  !test.observedValue && "bg-gray-700"
                                }`}
                                type="checkbox"
                                name=""
                                id={test.name + "test"}
                                disabled={!test.observedValue}
                              />
                              <label
                                className={`${
                                  test.observedValue && "font-semibold"
                                }`}
                                defaultChecked={!!test.observedValue}
                                htmlFor={test.name + "test"}
                              >
                                {test.name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2 items-center px-6 text-gray-950">
                        <input
                          className="border-2 border-gray-700"
                          type="checkbox"
                          checked={letterhead}
                          onChange={() => setLetterhead(!letterhead)}
                          name="letterhead"
                          id=""
                        />
                        <label className="font-semibold" htmlFor="letterhead">
                          Letter Head
                        </label>
                      </div>
                      <div className="w-[100%] flex flex-col text-sm p-6 text-gray-950">
                        <p className="my-2 text-gray-600">Select Doctor</p>
                        <ul className="flex flex-col gap-2">
                          <li className="flex gap-2 items-center">
                            <input
                              onChange={(e) => {
                                if (e.target.checked)
                                  setSelectedDepartments(
                                    departments.map((d) => d.id)
                                  );
                                else {
                                  setSelectedDepartments([]);
                                }
                              }}
                              checked={
                                selectedDepartments.length ===
                                departments.length
                              }
                              className="border-2 border-gray-700"
                              type="checkbox"
                              name=""
                              id=""
                            />
                            <label htmlFor="">Select all</label>
                          </li>
                          {departments.map((department) => (
                            <li
                              className="flex gap-2 items-center"
                              key={department.id}
                            >
                              <input
                                onChange={() => {
                                  if (
                                    selectedDepartments.includes(department.id)
                                  )
                                    setSelectedDepartments(
                                      selectedDepartments.filter(
                                        (s) => s !== department.id
                                      )
                                    );
                                  else
                                    setSelectedDepartments([
                                      ...selectedDepartments,
                                      department.id,
                                    ]);
                                }}
                                checked={selectedDepartments.includes(
                                  department.id
                                )}
                                className={`border-2 border-gray-700`}
                                type="checkbox"
                                name=""
                                id=""
                              />
                              <label className="font-semibold" htmlFor="">
                                {department.doctor}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="absolute  bottom-0 right-0 flex gap-4 items-center p-4">
                        <Button
                          label="Print"
                          onClick={() => fetchPDF(selectedTests)}
                        />
                        <Button
                          label="Cancel"
                          variant="outlined"
                          onClick={() => {
                            closeModal();
                            setPdfUrl("");
                            setSelectedDepartments([]);
                            setSelectedTests([]);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
