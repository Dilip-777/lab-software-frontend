import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FieldArray, Formik } from "formik";
import FormInput from "../../Components/FormikComponents/FormInput";
import FormSelect from "../../Components/FormikComponents/FormSelect";
import { getDepartments, getTest } from "../../Api";
import NoteModal from "../../Components/NoteModal";
import ReferenceModal from "../../Components/Test/referencesModal";
import FormInput1 from "../../Components/FormikComponents/FormInputWithSelect";

const referenceSchema = z.object({
  gender: z.string(),
  minAge: z.number(),
  maxAge: z.number(),
  lowerValue: z.number(),
  upperValue: z.number(),
  unit: z.string(),
});

const FormSchema = z.object({
  name: z.string(),
  testcode: z.string(),
  departmentId: z.string(),
  sampletype: z.string(),
  sampleunit: z.string(),
  container: z.string(),
  samplesize: z.string(),
  reportwithin: z.string(),
  reportwithinType: z.string(),
  testmethodtype: z.string(),
  regularprice: z.number(),
  references: z.array(referenceSchema),
});

function AddTest() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [test, setTest] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(test?.note || "");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const { id } = useParams();

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data || []);
  };

  const fetchTest = async () => {
    setLoading(true);
    const data = await getTest(id as string);
    setTest(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
    fetchTest();
  }, []);

  useEffect(() => {
    setText(test?.test?.note || "");
  }, [test]);

  const initialValues = {
    name: test?.test?.name || "",
    testcode: test?.test?.testcode || "",
    departmentId: test?.test?.departmentId?.toString() || "",
    sampletype: test?.test?.sampletype || "",
    container: test?.test?.container || "",
    samplesize: test?.test?.samplesize || "",
    sampleunit: test?.test?.sampleunit || "ml",
    reportwithin: test?.test?.reportwithin || "",
    reportwithinType: test?.test?.reportwithinType || "Days",
    testmethodtype: test?.test?.testmethodtype || "",
    regularprice: test?.test?.regularprice || 0,
    references: test?.references
      ? test.references?.map((r: any) => ({
          gender: r.gender,
          minAge: r.minAge,
          maxAge: r.maxAge,
          lowerValue: r.lowerValue,
          upperValue: r.upperValue,
          unit: r.unit,
        }))
      : [
          {
            gender: "",
            minAge: 0,
            maxAge: 0,
            lowerValue: 0,
            upperValue: 0,
            unit: "",
          },
        ],
  };

  console.log(text, "text");

  return (
    <div className="p-5 w-full ">
      {loading ? (
        <div className="h-[90vh] w-full flex justify-center items-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin  fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div className=" pt-5 px-8 rounded-md h-full pb-[5rem] w-full bg-white shadow-md">
          <p className="text-lg m-2">Add User</p>

          {/* <div dangerouslySetInnerHTML={{ __html: text }}></div> */}
          <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const { references, ...rest } = values;

              const department = departments.find(
                (d: any) => d.id?.toString() === rest.departmentId.toString()
              );

              const testdata = {
                ...rest,
                departmentId: department?.id,
                departmentName: department?.name,
                note: text,
              };

              if (test) {
                console.log(text, "slkjfslkfjslkfjslkfjlkj");

                const res = await axios
                  .put(`http://localhost:5000/test/update/${test.test.id}`, {
                    testdata,
                    referencedata: references,
                    note: text,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      navigate("/tests");
                    }
                  })
                  .catch((err) => console.log(err));
                return;
              }

              const res = await axios
                .post("http://localhost:5000/test/add", {
                  testdata: {
                    ...rest,
                    departmentId: department?.id,
                    departmentName: department?.name,
                    note: text,
                  },
                  referencedata: references,
                })
                .then((res) => {
                  if (res.status === 200) {
                    navigate("/tests");
                  }
                })
                .catch((err) => console.log(err));
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, values, errors }) => {
              console.log(errors, "errors");

              return (
                <form onSubmit={handleSubmit} className="px-2">
                  <div className="flex flex-row flex-wrap w-full justify-between">
                    <FormInput
                      name="name"
                      label="Test Name"
                      placeholder="Enter Test Name"
                    />
                    {/* <FormInput name="testcode" label="Role" placeholder="Role" /> */}
                    <FormInput
                      name="testcode"
                      label="Test Code"
                      placeholder="Enter the Test Code"
                    />
                    <FormSelect
                      label="Department"
                      placeholder="Select the Department"
                      options={departments.map((d) => ({
                        value: d.id.toString(),
                        label: d.name,
                      }))}
                      name="departmentId"
                    />
                    <FormInput
                      name="sampletype"
                      label="Sample Type"
                      placeholder="Enter the Sample Type"
                    />
                    <FormInput
                      name="container"
                      label="Container"
                      placeholder="Enter the Container"
                    />
                    {/* <FormInput
                      name="samplesize"
                      label="Sample Size"
                      placeholder="Enter the Sample Size"
                    /> */}
                    <FormInput1
                      name="samplesize"
                      label="Sample Size"
                      placeholder="Enter the Sample Size"
                      name1="sampleunit"
                      options1={["ml", "mg"]}
                    />
                    {/* <FormInput
                      name="reportwithin"
                      label="Report Within"
                      placeholder="Enter the Report Within"
                    /> */}
                    <FormInput1
                      name="reportwithin"
                      label="Report Within"
                      placeholder="Enter the Report Within"
                      name1="reportwithinType"
                      options1={["Days", "Hours"]}
                    />
                    <FormInput
                      name="testmethodtype"
                      label="Test Method Type"
                      placeholder="Enter the Test Method Type"
                    />
                    <FormInput
                      name="regularprice"
                      label="Regular Price"
                      placeholder="Enter the Regular Price"
                      type="number"
                    />
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded h-10 my-auto"
                      onClick={() => setOpen(true)}
                    >
                      Note
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded h-10 my-auto"
                      onClick={() => setOpen1(true)}
                    >
                      References
                    </button>
                  </div>
                  {/* <div className=" border-[1px] border-t border-gray-400 w-full my-3"></div> */}

                  <div></div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={` ${
                      isSubmitting
                        ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                        : "bg-blue-500  hover:bg-blue-700  text-white"
                    } font-bold py-2 px-3 float-right text-sm rounded my-3`}
                  >
                    Submit{" "}
                    {isSubmitting && (
                      <div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      ></div>
                    )}
                  </button>
                  <ReferenceModal
                    open={open1}
                    handleClose={() => {
                      setOpen1(false);
                    }}
                    loading={false}
                    references={values.references}
                    test={values}
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      )}
      <NoteModal
        text={text}
        setText={setText}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
}

export default AddTest;
