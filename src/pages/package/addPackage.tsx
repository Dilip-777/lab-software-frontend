import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Formik } from "formik";
import FormInput from "../../Components/FormikComponents/FormInput";
import {
  api,
  getDepartments,
  getPackage,
  getProfiles,
  getTest,
  getTests,
} from "../../Api";
import NoteModal from "../../Components/NoteModal";
import Autocomplete from "../../Components/Profile/autocomplete";
import Test from "../../Components/Profile/TestandReferences";
import ReferenceModal from "../../Components/Profile/ReferencesModal";
import Divider from "../../ui/Divider";
import FormInput1 from "../../Components/FormikComponents/FormInputWithSelect";
import { Button } from "../../ui/Buttons";
import FormSelect from "../../Components/FormikComponents/FormSelect";

const FormSchema = z.object({
  name: z.string().min(3, "Name must contain atleast 3 characters").max(50),
  sampletype: z.string(),
  container: z.string(),
  departmentId: z.string(),
  samplesize: z.string(),
  sampleunit: z.string(),
  reportwithin: z.string(),
  reportwithinType: z.string(),
  regularprice: z.number(),
});

function AddPackage() {
  const navigate = useNavigate();
  const [packs, setPackages] = useState<any>();
  const [tests, setTests] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [test, setTest] = useState<any>();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testIds, setTestIds] = useState<Test[]>([]);
  const [profileIds, setProfileIds] = useState<Profile[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [text, setText] = useState(packs?.note || "");
  const [open, setOpen] = useState(false);
  const [openreference, setOpenreference] = useState(false);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const { id } = useParams();

  const createTest = async (name: string) => {
    const res = await api.post("/test/add", {
      testdata: {
        name: name,
        testcode: name.toLowerCase().replace(/\s/g, ""),
      },
      referencedata: [],
    });
    setTestIds([...testIds, res.data.data]);
    fetchTests();
  };

  const createProfile = async (name: string) => {
    const res = await api.post("/profile/add", {
      profiledata: {
        name: name,
      },
      tests: [],
    });
    setProfileIds([...profileIds, res.data.data]);
    fetchProfiles();
  };

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data || []);
  };

  const fetchTests = async () => {
    const data = await getTests();
    setTests(data);
  };

  const fetchProfiles = async () => {
    const data = await getProfiles();
    setProfiles(data);
  };

  const fetchReferences = async () => {
    setReferenceLoading(true);
    const res = await getTest(test?.id);
    setReferences(res?.references || []);
    setReferenceLoading(false);
  };

  const handleClick = (id: any) => {
    setOpenreference(true);
    setTest(id);
  };

  const handleClose = () => {
    setOpenreference(false);
    setTest(undefined);
    setReferences([]);
  };

  const fetchPackage = async () => {
    setLoading(true);
    const data = await getPackage(id as string);
    setPackages(data.pack);
    setTestIds(data.pack?.test);
    setProfileIds(data.pack?.profile);
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
    fetchProfiles();
    fetchDepartments();
    if (id !== "add") {
      fetchPackage();
    }
  }, []);

  useEffect(() => {
    if (test) {
      fetchReferences();
    }
  }, [test]);

  useEffect(() => {
    setText(packs?.note || "");
  }, [packs]);

  const initialValues = {
    name: packs?.name || "",
    sampletype: packs?.sampletype || "",
    departmentId: packs?.departmentId?.toString() || "",
    container: packs?.container || "",
    samplesize: packs?.samplesize || "",
    sampleunit: packs?.sampleunit || "ml",
    reportwithin: packs?.reportwithin || "",
    reportwithinType: packs?.reportwithinType || "Days",
    regularprice: packs?.regularprice || 0,
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
        <div className=" py-5 px-8 rounded-md h-full w-full bg-white shadow-md pb-20">
          <p className="text-lg m-2">Add Package</p>

          {/* <div dangerouslySetInnerHTML={{ __html: text }}></div> */}
          <Divider />
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const { ...rest } = values;

              const packagedata = {
                ...rest,
                note: text,
                departmentId: parseInt(values.departmentId),
              };

              if (packs) {
                await api
                  .put(`/package/update/${packs.id}`, {
                    packagedata,
                    tests: testIds.map((t) => t.id),
                    profiles: profileIds.map((p) => p.id),
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      navigate("/package");
                    }
                  })
                  .catch((err) => console.log(err));
                return;
              }

              await api
                .post("/package/add", {
                  packagedata,
                  tests: testIds,
                  profiles: profileIds,
                })
                .then((res) => {
                  if (res.status === 200) {
                    navigate("/package");
                  }
                })
                .catch((err) => console.log(err));
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, values, errors }) => {
              return (
                <form onSubmit={handleSubmit} className="px-2">
                  <div className="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 lg:grid-cols-4 gap-x-9 gap-y-0 w-full">
                    <FormInput
                      name="name"
                      label="Package Name"
                      placeholder="Enter Package Name"
                    />
                    {/* <FormInput name="profilecode" label="Role" placeholder="Role" /> */}

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
                    <FormInput1
                      name="samplesize"
                      label="Sample Size"
                      placeholder="Enter the Sample Size"
                      name1="sampleunit"
                      options1={["ml", "mg"]}
                    />
                    <FormInput
                      name="samplesize"
                      label="Sample Size"
                      placeholder="Enter the Sample Size"
                    />
                    <FormInput1
                      name="reportwithin"
                      label="Report Within"
                      placeholder="Enter the Report Within"
                      name1="reportwithinType"
                      options1={["Days", "Hours"]}
                    />
                    <FormInput
                      name="regularprice"
                      label="Regular Price"
                      placeholder="Enter the Regular Price"
                      type="number"
                    />
                    <Button
                      label="Note"
                      type="button"
                      className="h-10 my-auto w-[4rem] ml-4"
                      onClick={() => setOpen(true)}
                    />
                  </div>
                  <Divider />

                  <div className="flex ">
                    <Autocomplete
                      tests={tests}
                      setTestIds={setTestIds}
                      createTest={createTest}
                      testIds={testIds}
                      label="Select Tests"
                      placeholder="Select Tests"
                    />

                    <Autocomplete
                      tests={profiles}
                      setTestIds={setProfileIds}
                      createTest={createProfile}
                      testIds={profileIds}
                      label="Select Profiles"
                      placeholder="Select Profiles"
                    />
                  </div>

                  <div className="flex flex-col">
                    {testIds.length > 0 && (
                      <>
                        <Divider />
                        <div className="my-1">
                          <p className="font-semibold text-md text-gray-600">
                            Tests:
                          </p>
                          {testIds.map((test) => (
                            <Test
                              handleOpen={handleClick}
                              test={test}
                              setTestIds={setTestIds}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {profileIds.length > 0 && (
                      <>
                        <Divider />
                        <div className="my-1">
                          <p className="font-semibold text-md text-gray-600">
                            Profiles:
                          </p>
                          {profileIds.map((profile) => (
                            <Test
                              // handleOpen={handleClick}
                              test={profile}
                              setTestIds={setProfileIds}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    label="Add Package"
                    type="submit"
                    className="float-right h-10"
                    loading={isSubmitting}
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      )}

      <ReferenceModal
        open={openreference}
        handleClose={handleClose}
        references={references}
        test={test}
        loading={referenceLoading}
      />

      <NoteModal
        text={text}
        setText={setText}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
}

export default AddPackage;
