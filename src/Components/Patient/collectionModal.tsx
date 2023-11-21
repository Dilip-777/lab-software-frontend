import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Divider from "../../util/Divider";
import { api } from "../../Api";
import TestValue from "./testValue";
import _ from "lodash";
import moment from "moment";

interface props {
  isOpen: boolean;
  closeModal: () => void;
  order: Order | undefined;
  patient: Patient | undefined;
  fetchOrders?: () => void;
  fetchPatient?: () => void;
}

export default function CollectionModal({
  closeModal,
  isOpen,
  order,
  patient,
  fetchOrders,
  fetchPatient
}: props) {
  const [changes, setChanges] = useState<any[]>([]);
  const [discard, setDiscard] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(false);
 
 const [timechanges, setTimeChanges] = useState<any>({id: order?.id});




  const handleChange = (value: any, field: string) => {
    // Create a new object by spreading the current timechanges and updating the specific field
    const updatedTimeChanges = { ...timechanges, [field]: new Date(value) };
    setTimeChanges(updatedTimeChanges);
  };


  console.log({
        id: order?.id,
        orderDate: new Date(timechanges.orderDate as string),
        collectiontime: new Date(timechanges.collectiontime as string),
        processtime: new Date(timechanges.processtime as string),
        reporttime: new Date(timechanges.reporttime as string),
      }, "outside function timechanges");

      console.log(timechanges, " outside timechanges");
      
    

  

  const handleSave = async () => {
    setLoading(true)
    await api.put("/order/editorder", {
      data: {
        id: order?.id,
        orderDate: timechanges.orderDate as string,
        collectiontime: timechanges.collectiontime as string,
        processtime: timechanges.processtime as string,
        reporttime: timechanges.reporttime as string,
      }
    });
      
      
    
    
    // setLoading(true);
    // await api.put("/order/updateOrder", {
    //   tests: changes,
    //   orderId: order?.id,
    // });
    // setChanges([]);
    closeModal();
    setInput(false);
    setLoading(false);
    fetchOrders && fetchOrders();
    fetchPatient && fetchPatient();
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
                <Dialog.Panel className="w-full max-w-[35rem] transform overflow-auto rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all h-[70vh]">
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
                    Collection Time
                  </Dialog.Title>
                  <Divider />
                  <div
                    className="flex flex-col overflow-y-auto"
                    
                  >
                    
                    <InputField order={order} input={input} label="Appointment/Registered Date Time" id="orderDate" handleChange={handleChange} />
                    <InputField order={order} input={input} label="Sample Collection Date Time" id="collectiontime" handleChange={handleChange} />
                    <InputField order={order} input={input} label="Sample Process Date Time" id="processtime" handleChange={handleChange} />
                    <InputField order={order} input={input} label="Report on/Appointment Done Date Time" id="reporttime" handleChange={handleChange} />
                   
                   
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

interface inputprops {
    order?: Order;
    input: boolean
    label: string;
    handleChange: (value: any,  field: string) => void
    id: string;
}

const InputField = ({order, input, label, handleChange, id}: inputprops) => {
    const [value, setValue] = useState(_.get(order,id) ? moment(_.get(order, id)).format().slice(0,16): "");    
    return (
        <div className="flex flex-col my-5">
            <label className="text-sm font-medium mb-1 text-gray-600">{label} :</label>
            {!input ? (
            <p className="text-sm text-gray-500">
              {value}
            </p>
          ) : (
            <div className=" border-b-[1px] focus-within:border-b-2 focus-within:border-teal-500 border-gray-500 pb-0 px-1 max-w-[50%] text-sm ">
              <input
                // ref={firstInputElementRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  handleChange(e.target.value, id)
                }}
                type="datetime-local"
                className=" border-none focus:outline-none bg-transparent "
                
              />
            </div>
          )}
        </div>
    )
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
