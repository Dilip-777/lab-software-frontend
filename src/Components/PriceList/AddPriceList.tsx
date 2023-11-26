import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import FormSelect from "../../ui/FormSelect";
import Divider from "../../ui/Divider";
import FormInput from "../../ui/FormInput";
import { Button } from "../../ui/Buttons";
import { api } from "../../Api";

export default function AddPriceList({
  tests,
  type,
  fetch,
}: {
  tests: any[];
  type: string;
  fetch: () => void;
}) {
  let [isOpen, setIsOpen] = useState(false);
  const [test, setTest] = useState("");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function handleSubmit() {
    setLoading(true);
    await api.post("/pricelist/add", {
      testId: test,
      label,
      price: Number(price),
      type,
    });
    fetch();
    setLoading(false);
    setLabel("");
    setPrice(0);
    setTest("");
    closeModal();
  }

  return (
    <>
      <div className=" flex items-center justify-center">
        <Button label="Add Price List" className="h-10" onClick={openModal} />
      </div>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-50"
          onClose={closeModal}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="relative w-screen max-w-sm">
                  <div className="h-full flex flex-col py-6 bg-white shadow-xl ">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Add Price List
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            className="bg-white rounded-md text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-indigo-500"
                            onClick={closeModal}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <Divider />
                      <div className=" mt-4 max-w-full ">
                        <p className="font-semibold text-sm my-2">
                          Select a {type}
                        </p>
                        <FormSelect
                          value={test}
                          setValue={setTest}
                          label={`Select a ${type}`}
                          placeholder={`Select a ${type}`}
                          options={tests.map((test) => ({
                            value: test.id,
                            label: test.name,
                          }))}
                          divClassName="mx-0"
                          inputClassName="w-full"
                        />
                        <FormInput
                          value={label}
                          handleChange={(v) => setLabel(v as string)}
                          placeholder="Enter Label"
                          label="Label"
                          divClassName=" mx-0"
                          inputClassName="border-gray-800 focus-within:border-gray-900"
                        />
                        <FormInput
                          value={price}
                          handleChange={(v) => setPrice(v as number)}
                          placeholder="Enter Price"
                          label="Price"
                          type="number"
                          divClassName="mx-0"
                          inputClassName="border-gray-800 focus-within:border-gray-900"
                        />
                        <Button
                          label="Add"
                          className="mt-4 w-full"
                          loading={loading}
                          onClick={() => handleSubmit()}
                          type="button"
                        />
                      </div>
                    </div>

                    {/* Drawer content goes here */}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
