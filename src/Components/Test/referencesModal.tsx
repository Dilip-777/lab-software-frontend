import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import FormInput from '../FormikComponents/FormInput';
import FormSelect from '../FormikComponents/FormSelect';
import { FieldArray, Formik } from 'formik';
import Loader from '../../util/Loader';
import TextArea from '../FormikComponents/TextArea';

export default function ReferenceModal({
  open,
  handleClose,
  references,
  test,
  loading,
}: {
  open: boolean;
  handleClose: () => void;
  references: any[];
  test: any;
  loading: boolean;
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[90%] sm:w-[80%] md:w-[80%] lg:w-[80%] transform  overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-[40rem]">
                <div className="absolute top-3 right-3 cursor-pointer" onClick={handleClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-3">
                  {test?.name}
                </Dialog.Title>
                <div className="">
                  {loading ? (
                    <Loader />
                  ) : (
                    <FieldArray
                      name="references"
                      render={(arrayHelpers) => (
                        <div className="">
                          <div className="flex justify-between">
                            <p className="mb-3 text-md font-semibold ">Reference Values:</p>
                          </div>
                          <div className="overflow-auto h-[30rem]">
                            {references.map((refrence: any, index: number) => (
                              <div key={index}>
                                <div
                                  key={index}
                                  className="grid   gap-y-0 md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-3 lg:grid-cols-8 w-full  px-3"
                                >
                                  {/** both these conventions do the same */}
                                  <FormSelect
                                    label="Gender"
                                    placeholder="Select the Gender"
                                    options={[
                                      {
                                        value: 'Male',
                                        label: 'Male',
                                      },
                                      {
                                        value: 'Female',
                                        label: 'Female',
                                      },
                                      {
                                        value: 'Both',
                                        label: 'Both',
                                      },
                                    ]}
                                    name={`references[${index}].gender`}
                                    classname="my-1 min-w-[2rem]"
                                    className="min-w-[2rem]"
                                  />
                                  <FormInput
                                    label="Min Age"
                                    placeholder="Enter the Min Age"
                                    name={`references.${index}.minAge`}
                                    type="number"
                                    classname="my-1 min-w-[2rem]"
                                    className="min-w-[2rem]"
                                  />
                                  <FormInput
                                    label="Max Age"
                                    placeholder="Enter the Max Age"
                                    name={`references.${index}.maxAge`}
                                    type="number"
                                    classname="my-1 min-w-[2rem]"
                                    className="min-w-[2rem]"
                                  />
                                  <FormInput
                                    label="Lower Value"
                                    placeholder="Enter the Lower Value"
                                    name={`references.${index}.lowerValue`}
                                    type="number"
                                    classname="my-1 min-w-[2rem]"
                                    className="min-w-[2rem]"
                                  />
                                  <FormInput
                                    label="Upper Value"
                                    placeholder="Enter the Upper Value"
                                    name={`references.${index}.upperValue`}
                                    type="number"
                                    classname="my-1 min-w-[2rem]"
                                    className="min-w-[2rem]"
                                  />
                                  <FormInput
                                    label="Unit"
                                    placeholder="Enter the Unit"
                                    name={`references.${index}.unit`}
                                    type="text"
                                    classname="my-1 min-w-[2rem]"
                                    className="min-w-[2rem]"
                                  />{' '}
                                  <TextArea
                                    label="Reference Note"
                                    placeholder="Reference Note"
                                    name={`references.${index}.note`}
                                    type="text"
                                    className="h-10 min-w-[12rem]"
                                    classname="my-1 min-w-[10m]"
                                  />{' '}
                                  <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold  p-1 rounded-full my-auto float-right  ml-auto w-fit self-end text-sm "
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-5 h-5"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <div className=" border-[1px] border-t border-gray-300 w-full"></div>
                              </div>
                            ))}
                            <button
                              onClick={() =>
                                arrayHelpers.push({
                                  gender: '',
                                  minAge: 0,
                                  maxAge: 0,
                                  lowerValue: 0,
                                  upperValue: 0,
                                  unit: '',
                                })
                              }
                              type="button"
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded mt-3 float-right"
                            >
                              Add
                            </button>
                          </div>
                          {/* <button type="button">+</button> */}
                        </div>
                      )}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
