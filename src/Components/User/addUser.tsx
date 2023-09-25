import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Formik } from "formik";
import FormInput from "../FormikComponents/FormInput";
import FormSelect from "../FormikComponents/FormSelect";

const FormSchema = z
  .object({
    name: z.string().min(3, "Name must contain atleast 3 characters").max(50),
    role: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
    phonenumber: z
      .number()
      .min(1000000000, "Phone Number must be 10 digits")
      .max(9999999999, "Phone Number must be 10 digits"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

function AddUser() {
  const [roles, setRoles] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
    role: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  };

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:5000/role/getRoles");
    setRoles(res.data.data || []);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-5 w-full ">
      <div className=" py-5 px-8 rounded-md h-full w-full bg-white shadow-md">
        <p className="text-lg m-2">Add User</p>
        <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(FormSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const res = await axios
              .post("http://localhost:5000/user/add", {
                username: values.name,
                phonenumber: values.phonenumber.toString(),
                password: values.password,
                roleId: parseInt(values.role),
                rolename: roles.find(
                  (role) => role.id === parseInt(values.role)
                ).name,
              })
              .then((res) => {
                if (res.status === 200) {
                  navigate("/users");
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
                  <FormInput name="name" label="Name" placeholder="Name" />
                  <FormSelect
                    name="role"
                    label="Role"
                    options={roles.map((role) => {
                      return { value: role.id, label: role.name };
                    })}
                    placeholder="Select a Role"
                  />
                  <FormInput
                    name="phonenumber"
                    label="Phone Number"
                    placeholder="Please enter the phone number"
                    type="number"
                  />
                  <FormInput
                    name="password"
                    label="Password"
                    placeholder="Password"
                    classname="max-w-[230px]"
                  />
                  <FormInput
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={` ${
                    loading
                      ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                      : "bg-blue-500  hover:bg-blue-700  text-white"
                  } font-bold py-2 px-3 text-sm rounded my-3`}
                >
                  Add User{" "}
                  {loading && (
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
    </div>
  );
}

export default AddUser;
