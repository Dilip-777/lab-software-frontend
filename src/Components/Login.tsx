import { EyeIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "./FormikComponents/FormInput";

const FormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function Login({
  setToken,
}: {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const login = async () => {};

  return (
    <section className="w-full h-[100vh] bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-lg p-7 w-[30%]  ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              setSubmitting(true);
              const res = await axios
                .post("http://localhost:5000/auth/login", {
                  username: values.username,
                  password: values.password,
                })
                .then((res) => {
                  if (res.status === 200) {
                    const token = res.data.token;
                    localStorage.setItem("token", token);
                    const user = res.data.user;
                    localStorage.setItem("user", JSON.stringify(user));
                    setToken(token);
                    navigate("/");
                  }
                })
                .catch((err) => {
                  if (err.response.data.message.includes("Password")) {
                    setFieldError("password", err.response.data.message);
                  } else if (err.response.data.message.includes("Username")) {
                    setFieldError("username", err.response.data.message);
                  }
                });
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, values, errors }) => {
              return (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <FormInput
                    name="username"
                    label="Username"
                    type="text"
                    placeholder="Enter Your Username"
                  />

                  <FormInput
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter Your Password"
                  />

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={` ${
                        isSubmitting
                          ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                          : "bg-indigo-600  hover:bg-indigo-500  text-white"
                      } font-semibold py-2 px-3 text-sm rounded-md my-3 w-[93%] ml-4`}
                    >
                      Sign In{" "}
                      {isSubmitting && (
                        <div
                          className="inline-block h-4 w-4 ml-1 my-auto  animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        ></div>
                      )}
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </section>
  );
}

export default Login;
