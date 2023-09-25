import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Divider from "../../util/Divider";
import { api } from "../../Api";
import TestValue from "./testValue";

interface props {
  isOpen: boolean;
  closeModal: () => void;
  order: Order | undefined;
  patient: Patient | undefined;
  fetchOrders?: () => void;
}

export default function ResultModal({
  closeModal,
  isOpen,
  order,
  patient,
  fetchOrders,
}: props) {
  const [changes, setChanges] = useState<any[]>([]);
  const [discard, setDiscard] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(false);
  const [focus, setFocus] = useState<number | undefined>(undefined);

  const handleChange = (value: any, id: number, field: string) => {
    const change = changes.find((c) => c.id === id);
    const v = field === "observedValue" ? Number(value) : value;
    if (change) {
      change[field] = v;
      setChanges([...changes]);
    } else {
      setChanges([...changes, { id, [field]: v }]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await api.put("/order/updateOrder", {
      tests: changes,
      orderId: order?.id,
    });
    closeModal();
    setInput(false);
    setChanges([]);
    setLoading(false);
    fetchOrders && fetchOrders();
  };

  console.log(changes, "changes");

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
                <Dialog.Panel className="w-full max-w-[60%] transform overflow-auto rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all h-[100vh]">
                  {!input && (
                    <div
                      className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-200 mx-2 cursor-pointer"
                      onClick={() => setInput(!input)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                  )}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Test Result
                  </Dialog.Title>
                  <Divider />
                  <div
                    className="flex flex-col overflow-y-auto"
                    style={{ height: "calc(100vh - 150px)" }}
                  >
                    {/* Packages */}
                    {order?.packages.map((pkg) => (
                      <div className="w-full">
                        <p className="mb-3 font-semibold text-center text-md">
                          {pkg.name}
                        </p>
                        <table className="min-w-full divide-y divide-gray-200">
                          {<TableHeader />}
                          <tbody className="divide-y divide-gray-200">
                            {pkg.profiles.map((profile) => (
                              <>
                                <tr>
                                  <td className="px-3 py-2 text-sm font-semibold text-gray-800 ">
                                    {profile.name}
                                  </td>
                                </tr>
                                {profile.tests.map((test, index) => (
                                  <TestValue
                                    focus={index === 0}
                                    test={test}
                                    patient={patient as Patient}
                                    input={input}
                                    handleChange={handleChange}
                                  />
                                ))}
                              </>
                            ))}
                            <tr>
                              <td className="px-6 py-2 text-sm font-medium text-gray-800 h-10"></td>
                              <td className="px-6 py-2 text-sm font-medium text-gray-800 "></td>
                              <td className="px-6 py-2 text-sm font-medium text-gray-800 "></td>
                              <td className="px-6 py-2 text-sm font-medium text-gray-800 "></td>
                              <td className="px-6 py-2 text-sm font-medium text-gray-800 "></td>
                            </tr>

                            {pkg.tests.map((test, index) => (
                              <TestValue
                                focus={pkg.profiles.length === 0 && index === 0}
                                key={test.id}
                                test={test}
                                patient={patient as Patient}
                                input={input}
                                handleChange={handleChange}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                    {order?.packages && order?.packages.length > 0 && (
                      <Divider />
                    )}
                    {order?.profiles.map((pfl) => (
                      <div className="w-full">
                        <p className="mb-3 font-semibold text-center text-md">
                          {pfl.name}
                        </p>
                        <table className="min-w-full divide-y divide-gray-200">
                          {<TableHeader />}
                          <tbody className="divide-y divide-gray-200">
                            {pfl.tests.map((test, index) => (
                              <TestValue
                                focus={
                                  order?.packages.length === 0 && index === 0
                                }
                                key={test.id}
                                test={test}
                                patient={patient as Patient}
                                input={input}
                                handleChange={handleChange}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                    {order?.profiles && order?.profiles.length > 0 && (
                      <Divider />
                    )}
                    {order?.tests.map((test, index) => (
                      <div className="w-full">
                        <p className="mb-3 font-semibold text-center text-md">
                          {test.name}
                        </p>
                        <table className="min-w-full divide-y divide-gray-200">
                          {<TableHeader />}
                          <tbody className="divide-y divide-gray-200">
                            {
                              <TestValue
                                focus={
                                  order?.profiles.length === 0 &&
                                  order?.packages.length === 0 &&
                                  index === 0
                                }
                                test={test}
                                patient={patient as Patient}
                                input={input}
                                handleChange={handleChange}
                              />
                            }
                          </tbody>
                        </table>
                        <Divider />
                      </div>
                    ))}
                  </div>
                  {input && (
                    <div className="flex justify-end mt-auto fixed bottom-5 right-5">
                      <button
                        onClick={() => handleSave()}
                        type="button"
                        className={`${
                          loading
                            ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                            : "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300"
                        } focus:outline-none   font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2`}
                      >
                        {loading && (
                          <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-1"
                            role="status"
                          ></div>
                        )}
                        Save
                      </button>

                      <button
                        onClick={() => {
                          closeModal();
                          setDiscard(true);
                          setInput(false);
                          setChanges([]);
                        }}
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const TableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr className="border-y border-y-gray-300 h-[2rem] mt-3">
        <th
          scope="col"
          className="px-3  text-xs font-bold text-left text-gray-700 uppercase "
        >
          Investigation
        </th>

        <th
          scope="col"
          className={`px-3  text-xs font-bold text-left text-gray-700 uppercase`}
        >
          Observed Value
        </th>
        <th
          scope="col"
          className={`px-3  text-xs font-bold text-left text-gray-700 uppercase`}
        >
          Highlight
        </th>
        <th
          scope="col"
          className={`px-3  text-xs font-bold text-left text-gray-700 uppercase`}
        >
          Referenced Value
        </th>
        <th
          scope="col"
          className={`px-3  text-xs font-bold text-left text-gray-700 uppercase`}
        >
          Unit
        </th>
      </tr>
    </thead>
  );
};
