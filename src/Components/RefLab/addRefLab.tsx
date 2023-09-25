import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Formik } from "formik";
import FormInput from "../FormikComponents/FormInput";
import FormSelect from "../FormikComponents/FormSelect";
import { api, getDepartment, getRefLab } from "../../Api";
import CustomRadioGroup from "../FormikComponents/RadioGroup";
import FormUpload from "../FormikComponents/FormUpload";

const FormSchema = z.object({
  diagonsticname: z.string(),
  phonenumber: z.string(),
  emailId: z.string(),
  address: z.string(),
  autoselectpricelist: z.string(),
  autoreportsendmode: z.string(),
  autoreporttype: z.boolean().optional(),
  reporttype: z.string().optional(),
  customisedletterhead: z.boolean().optional(),
  letterhead: z.string().optional(),
});

function AddRefLab() {
  const navigate = useNavigate();
  const [reflab, setReflab] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [priceList, setPriceList] = useState<any[]>([]);
  const { id } = useParams();

  const fetchPriceList = async () => {
    const data = await api.get("/pricelist/labels");
    setPriceList(data.data.data);
  };

  const fetchRefLab = async () => {
    if (id !== "add") {
      setLoading(true);
      const data = await getRefLab(id as string);
      setReflab(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefLab();
    fetchPriceList();
  }, []);

  const initialValues = {
    diagonsticname: reflab?.diagonsticname || "",
    phonenumber: reflab?.phonenumber || "",
    emailId: reflab?.emailId || "",
    address: reflab?.address || "",
    autoselectpricelist: reflab?.autoselectpricelist || "",
    autoreportsendmode: reflab?.autoreportsendmode || "",
    autoreporttype: reflab?.autoreporttype || false,
    reporttype: reflab?.reporttype || "",
    customisedletterhead: reflab?.customisedletterhead || false,
    letterhead: reflab?.letterhead || "",
  };

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
        <div className=" py-5 px-8 rounded-md h-full w-full bg-white shadow-md">
          <p className="text-lg m-2">Add Ref Lab</p>
          <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              if (reflab) {
                const res = await axios
                  .put(`http://localhost:5000/reflab/update/${id}`, values)
                  .then((res) => {
                    if (res.status === 200) {
                      navigate("/reflab");
                    }
                  })
                  .catch((err) => console.log(err));
                setSubmitting(false);
                return;
              }

              const res = await axios
                .post("http://localhost:5000/reflab/add", values)
                .then((res) => {
                  if (res.status === 200) {
                    navigate("/reflab");
                  }
                })
                .catch((err) => console.log(err));
              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              isSubmitting,
              values,
              errors,
              setFieldValue,
            }) => {
              console.log(errors);

              return (
                <form onSubmit={handleSubmit} className="px-2">
                  <div className="flex flex-row flex-wrap w-full justify-between">
                    <FormInput
                      name="diagonsticname"
                      label="Diagnostic Name"
                      placeholder="Enter Diagnostic Name"
                    />
                    {/* <FormInput name="phonenumber" label="Role" placeholder="Role" /> */}
                    <FormInput
                      name="phonenumber"
                      label="Phone Number"
                      placeholder="Phone Number"
                    />
                    <FormInput
                      name="emailId"
                      label="Email Id"
                      placeholder="Enter Email Id"
                    />
                    <FormInput
                      name="address"
                      label="Address"
                      placeholder="Enter Address"
                    />
                    <FormSelect
                      name="autoselectpricelist"
                      label="Auto Select Price List"
                      placeholder="Select Auto Select Price List"
                      options={priceList.map((item) => ({
                        value: item.label,
                        label: item.label,
                      }))}
                    />
                    <FormSelect
                      name="autoreportsendmode"
                      label="Auto Report Send Mode"
                      placeholder="Select Auto Report Send Mode"
                      options={[
                        { value: "Email", label: "Email" },
                        { value: "SMS", label: "SMS" },
                      ]}
                    />
                    {/* <CustomRadioGroup /> */}
                    <div className="flex">
                      <div className="flex flex-col items-start ml-4 my-3">
                        <div
                          className="flex items-center"
                          onClick={() => {
                            setFieldValue("autoreporttype", true);
                            setFieldValue("customisedletterhead", false);
                          }}
                        >
                          <input
                            type="radio"
                            className="h-4 w-4 text-blue-600 border border-gray-300 rounded ml-4"
                            checked={values.autoreporttype}
                          />
                          <label className="ml-2">Auto Report Type</label>
                        </div>
                        <FormSelect
                          name="reporttype"
                          // label="Report Type"
                          placeholder="Select Report Type"
                          options={[
                            { value: "With Header", label: "With Header" },
                          ]}
                          classname=" !my-0"
                        />
                      </div>
                      <p className="my-auto mx-3.5">Or</p>
                      <div className="flex flex-col items-start ml-4 my-3">
                        <div
                          className="flex items-center"
                          onClick={() => {
                            setFieldValue("autoreporttype", false);
                            setFieldValue("customisedletterhead", true);
                          }}
                        >
                          <input
                            type="radio"
                            className="h-4 w-4 text-blue-600 border border-gray-300 rounded ml-4"
                            checked={values.customisedletterhead}
                          />
                          <label className="ml-2">Customised Letter Head</label>
                        </div>
                        <FormUpload
                          name="letterhead"
                          // label="Report Type"
                          placeholder="Select Report Type"
                          classname=" !my-0"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={` ${
                      isSubmitting
                        ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                        : "bg-blue-500  hover:bg-blue-700  text-white"
                    } font-bold py-2 px-3 text-sm rounded my-3`}
                  >
                    Add Ref Lab{" "}
                    {isSubmitting && (
                      <div
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      ></div>
                    )}
                  </button>
                </form>
              );
            }}
          </Formik>
        </div>
      )}
    </div>
  );
}

export default AddRefLab;
