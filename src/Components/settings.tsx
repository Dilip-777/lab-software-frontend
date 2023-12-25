import { useState } from "react";
import FormUpload from "./FormikComponents/FormUpload";
import { api } from "../Api";
import * as z from "zod";
import FormInput from "./FormikComponents/FormInput";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../ui/Buttons";

interface Props {
  handleClose: () => void;
  id: number;
  sign?: Signs;
}

const FormSchema = z.object({
  doctorname: z.string(),
  signature: z.string(),
  specialisation: z.string(),
});

export default function SignsUpload({ handleClose, id, sign }: Props) {
  const [doctor, setDoctor] = useState("");
  const [specialisation, setSpecialisation] = useState("");

  const initialValues = {
    doctorname: sign?.doctorname || "",
    signature: sign?.signature || "",
    specialisation: sign?.specialisation || "",
  };

  const handleChange = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await api.post("/upload", formData, config);
    const data = res.data?.data;
    // if (data) setSign(data[0]?.filename);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(FormSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          await api
            .post("/setting/signs/add", {
              ...values,
              id: sign?.id || 0,
              settingsId: id,
            })
            .then((res) => {
              if (res.status === 200) {
                handleClose();
              }
            })
            .catch((err) => console.log(err));

          setSubmitting(false);
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => {
          console.log(values.signature);

          return (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="doctorname"
                    label="Doctor"
                    placeholder="Enter Doctor Name"
                    className="!min-w-0 rounded-md my-0"
                    classname="my-0"
                    // classmame="!max-w-full"
                    // cl="!min-w-0"
                  />
                  <FormInput
                    label="Specialisation"
                    name="specialisation"
                    // handleChange={(e) => setSpecialisation(e as string)}
                    placeholder="Enter Specialisation"
                    className="!min-w-0 rounded-md my-0"
                    classname="my-0"
                    // inputClassName="!min-w-0"
                  />
                  <FormUpload
                    name="signature"
                    label="Signature"
                    placeholder="Upload Sign"
                    className="!min-w-0  my-0 w-full"
                    classname="my-0"
                  />
                  {values.signature && (
                    <img
                      src={`http://localhost:5000/uploadedFiles/${values.signature}`}
                      alt=""
                      className="w-20 h-20"
                    />
                  )}
                </div>
                <Button
                  label="Submit"
                  loading={isSubmitting}
                  className="max-w-fit mx-4"
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
