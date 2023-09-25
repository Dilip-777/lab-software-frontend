import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Formik } from "formik";
import FormInput from "../FormikComponents/FormInput";
import FormSelect from "../FormikComponents/FormSelect";
import { getDepartment } from "../../Api";
import FormUpload from "../FormikComponents/FormUpload";

const FormSchema = z.object({
  name: z.string().min(3, "Name must contain atleast 3 characters").max(50),
  doctor: z.string(),
  doctorSignature: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

function AddDepartment() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchDepartment = async () => {
    setLoading(true);
    const data = await getDepartment(id as string);
    setDepartment(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const initialValues = {
    name: department?.name || "",
    doctor: department?.doctor || "",
    doctorSignature: department?.doctorSignature || "",
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
          <p className="text-lg m-2">Add Department</p>
          <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              if (department) {
                const res = await axios
                  .put(`http://localhost:5000/department/update/${id}`, {
                    name: values.name,
                    doctor: values.doctor,
                    doctorSignature: values.doctorSignature,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      navigate("/department");
                    }
                  })
                  .catch((err) => console.log(err));
                setSubmitting(false);
                return;
              }

              const res = await axios
                .post("http://localhost:5000/department/add", {
                  name: values.name,
                  doctor: values.doctor,
                  doctorSignature: values.doctorSignature,
                })
                .then((res) => {
                  if (res.status === 200) {
                    navigate("/department");
                  }
                })
                .catch((err) => console.log(err));
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, values, errors }) => {
              return (
                <form onSubmit={handleSubmit} className="px-2">
                  <div className="flex flex-row flex-wrap w-full justify-between">
                    <FormInput
                      name="name"
                      label="Department Name"
                      placeholder="Enter Department Name"
                    />
                    {/* <FormInput name="doctor" label="Role" placeholder="Role" /> */}
                    <FormInput
                      name="doctor"
                      label="Department Doctor"
                      placeholder="Department Doctor"
                    />
                    <FormUpload
                      name="doctorSignature"
                      label="Doctor Signature"
                      placeholder="Doctor Signature"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={` ${
                      isSubmitting
                        ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                        : "bg-blue-500  hover:bg-blue-700  text-white"
                    } font-bold py-2 px-3 text-sm rounded m-3`}
                  >
                    Add Department{" "}
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

export default AddDepartment;
