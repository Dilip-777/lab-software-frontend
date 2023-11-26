import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import "react-quill/dist/quill.snow.css";
import FormInput from "../FormikComponents/FormInput";
import FormSelect from "../FormikComponents/FormSelect";
import { FieldArray, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import * as z from "zod";
import axios from "axios";
import Loader from "../../ui/Loader";
import { Button } from "../../ui/Buttons";
import TextArea from "../FormikComponents/TextArea";

const referenceSchema = z.object({
  gender: z.string(),
  minAge: z.number(),
  maxAge: z.number(),
  lowerValue: z.number(),
  upperValue: z.number(),
  unit: z.string(),
  note: z.string().optional(),
});

const FormSchema = z.object({
  references: z.array(referenceSchema),
});

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
  const initialValues = {
    references:
      references.length > 0
        ? references?.map((r: any) => ({
            gender: r.gender,
            minAge: r.minAge,
            maxAge: r.maxAge,
            lowerValue: r.lowerValue,
            upperValue: r.upperValue,
            unit: r.unit,
            note: r.note,
          }))
        : [
            {
              gender: "",
              minAge: 0,
              maxAge: 0,
              lowerValue: 0,
              upperValue: 0,
              unit: "",
              note: "",
            },
          ],
  };
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
                <div
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={handleClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 mb-3"
                >
                  {test?.name}
                </Dialog.Title>
                <div className="">
                  {loading ? (
                    <Loader />
                  ) : (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={toFormikValidationSchema(FormSchema)}
                      onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        const { references } = values;

                        if (test) {
                          await axios
                            .put(
                              `http://localhost:5000/test/update/${test.id}`,
                              {
                                testdata: { id: test.id },
                                referencedata: references,
                              }
                            )
                            .then((res) => {
                              if (res.status === 200) {
                                handleClose();
                              }
                            })
                            .catch((err) => console.log(err));
                          return;
                        }

                        setSubmitting(false);
                      }}
                    >
                      {({ handleSubmit, isSubmitting, values, errors }) => {
                        return (
                          <form className="px-2 ">
                            <div className="">
                              <FieldArray
                                name="references"
                                render={(arrayHelpers) => (
                                  <div className="">
                                    <div className="flex justify-between">
                                      <p className="mb-3 text-md font-semibold ">
                                        Reference Values:
                                      </p>
                                      <button
                                        onClick={() =>
                                          arrayHelpers.push({
                                            gender: "",
                                            minAge: 0,
                                            maxAge: 0,
                                            lowerValue: 0,
                                            upperValue: 0,
                                            unit: "",
                                          })
                                        }
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
                                      >
                                        Add
                                      </button>
                                    </div>
                                    <div className="overflow-auto h-[30rem]">
                                      {values.references.map(
                                        (refrence: any, index: number) => (
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
                                                    value: "Male",
                                                    label: "Male",
                                                  },
                                                  {
                                                    value: "Female",
                                                    label: "Female",
                                                  },
                                                  {
                                                    value: "Both",
                                                    label: "Both",
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
                                              />{" "}
                                              <TextArea
                                                label="Reference Note"
                                                placeholder="Reference Note"
                                                name={`references.${index}.note`}
                                                type="text"
                                                className="h-10 min-w-[12rem]"
                                                classname="my-1 min-w-[10m]"
                                              />{" "}
                                              <button
                                                type="button"
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 my-auto float-right  ml-auto w-fit  text-sm rounded-full"
                                                onClick={() =>
                                                  arrayHelpers.remove(index)
                                                }
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
                                                    d="M6 18L18 6M6 6l12 12"
                                                  />
                                                </svg>
                                              </button>
                                            </div>
                                            <div className=" border-[1px] border-t border-gray-300 w-full"></div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    {/* <button type="button">+</button> */}
                                  </div>
                                )}
                              />
                            </div>
                            <div className="flex float-right gap-5">
                              <Button
                                type="button"
                                onClick={() => handleSubmit()}
                                loading={isSubmitting}
                                label="Save"
                              />
                              <Button
                                type="button"
                                onClick={handleClose}
                                label="Cancel"
                                variant="outlined"
                              />
                              {/* <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSubmit();
                                }}
                                disabled={isSubmitting}
                                className={` ${
                                  isSubmitting
                                    ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                                    : "bg-blue-500  hover:bg-blue-700  text-white"
                                } font-bold py-2 px-3 text-sm rounded my-3 justify-self-end w-[5rem]`}
                              >
                                Save {"  "}
                                {isSubmitting && (
                                  <div
                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                  ></div>
                                )}
                              </button>
                              
                              <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="bg-transparent hover:bg-blue-500 my-3 text-blue-700 font-semibold hover:text-white py-0 px-4 border border-blue-500 hover:border-transparent rounded items-center mx-3 h-[2.4rem]"
                              >
                                Cancel
                              </button> */}
                            </div>
                          </form>
                        );
                      }}
                    </Formik>
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
