import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FieldArray, Formik } from "formik";
import FormInput from "../FormikComponents/FormInput";
import { api, getDepartments, getProfile, getTest, getTests } from "../../Api";
import NoteModal from "../NoteModal";
import Autocomplete from "./autocomplete";
import Test from "./TestandReferences";
import ReferenceModal from "./ReferencesModal";
import FormInput1 from "../FormikComponents/FormInputWithSelect";
import HeadingInput from "../../util/FormInput";
import { Combobox, Transition } from "@headlessui/react";
import { Button } from "../../util/Buttons";
import { string } from "mathjs";
import Divider from "../../util/Divider";
import { XMarkIcon } from "@heroicons/react/20/solid";
import AddTest from "./AddTest";

const FormSchema = z.object({
  name: z.string(),
  sampletype: z.string(),
  container: z.string(),
  samplesize: z.string(),
  sampleunit: z.string(),
  reportwithin: z.string(),
  reportwithinType: z.string(),
  regularprice: z.number(),
});

function AddProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [tests, setTests] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [test, setTest] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [testIds, setTestIds] = useState<any[]>([]);
  const [headings, setHeadings] = useState<
    { heading: string; tests: Test[] }[]
  >([]);
  const [text, setText] = useState(profile?.note || "");
  const [open, setOpen] = useState(false);
  const [openreference, setOpenreference] = useState(false);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [formulas, setFormulas] = useState<any[]>([]);
  const type = searchParams.get("type");

  const handleChange = (value: string, id: number, field: string) => {
    const f = formulas.find((f) => f.testId === id);
    if (f) {
      f[field] = value;
      setFormulas([...formulas.filter((f) => f.testId !== id), f]);
    } else {
      setFormulas([...formulas, { testId: id, [field]: value }]);
    }
  };

  console.log(headings, "headings");

  const handleHeadings = (
    oldheading: string,
    newHeading?: string,
    test?: Test,
    oldtest?: Test
  ) => {
    console.log(oldheading, newHeading, test, oldtest, "outside");

    setHeadings((prevHeadings) => {
      const i = prevHeadings.findIndex((h) => h.heading === oldheading);

      if (i === -1) {
        if (newHeading) {
          return [...prevHeadings, { heading: newHeading, tests: [] }];
        }
        return prevHeadings; // No change if newHeading is not provided.
      } else {
        if (newHeading === "") {
          console.log(
            "Here",
            prevHeadings.filter((h) => h.heading !== oldheading),
            "sldfkjslfdskj"
          );
          return prevHeadings.filter((h) => h.heading !== oldheading);
        } else {
          console.log("Here2");

          if (test) {
            return prevHeadings.map((h, index) => {
              if (index === i) {
                // h.heading = newHeading;
                h.tests.push(test);
                return { ...h }; // Create a new object to avoid mutation.
              }
              return h;
            });
          } else if (oldtest) {
            return prevHeadings.map((h, index) => {
              if (index === i) {
                // h.heading = newHeading;
                h.tests = h.tests.filter((t) => t.id !== oldtest.id);
                return { ...h }; // Create a new object to avoid mutation.
              }
              return h;
            });
          } else {
            return prevHeadings.map((h, index) => {
              if (index === i) {
                h.heading = newHeading || oldheading;
                return { ...h }; // Create a new object to avoid mutation.
              }
              return h;
            });
          }
        }
      }
    });
  };

  console.log(formulas, "formulas");

  const createTest = async (name: string, heading?: string) => {
    const res = await api.post("/test/add", {
      testdata: {
        name: name,
        testcode: name.toLowerCase().replace(/\s/g, ""),
      },
      referencedata: [],
    });

    if (heading) {
      handleHeadings(heading, undefined, res.data.data);
    } else {
      setTestIds([...testIds, res.data.data]);
      fetchTests();
    }
  };

  const fetchTests = async () => {
    const data = await getTests();
    setTests(data);
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

  const fetchProfile = async () => {
    setLoading(true);
    const data = await getProfile(id as string);
    setProfile(data.profile);
    setHeadings(data.profile.headings);
    setTestIds(data.profile?.test);
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
    if (id !== "add") {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (test) {
      fetchReferences();
    }
  }, [test]);

  useEffect(() => {
    setText(profile?.note || "");
  }, [profile]);

  const initialValues = {
    name: profile?.name || "",
    sampletype: profile?.sampletype || "",
    container: profile?.container || "",
    samplesize: profile?.samplesize || "",
    sampleunit: profile?.sampleunit || "ml",
    reportwithin: profile?.reportwithin || "",
    reportwithinType: profile?.reportwithinType || "Days",
    regularprice: profile?.regularprice || 0,
  };

  const addTests = (name: string, query: string, comparator: string) => {
    if (name) {
      if (!testIds.find((i) => i[comparator] === name)) {
        setTestIds((t) => [...t, tests.find((i) => i[comparator] === name)]);
      }
    } else {
      if (createTest) createTest(query);
      // setQuery("");
    }
  };

  const unselectedTests = tests.filter((t) => {
    const test = testIds.find((i) => i.id === t.id);
    if (test) {
      return false;
    }
    headings.forEach((h) => {
      const test = h.tests.find((i) => i.id === t.id);
      if (test) {
        return false;
      }
    });
    return true;
  });

  return (
    <div className="p-5 w-full ">
      {loading ? (
        <div className="h-[90vh] w-full flex justify-center items-center ">
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
          <p className="text-lg m-2">Add Profile</p>

          {/* <div dangerouslySetInnerHTML={{ __html: text }}></div> */}
          <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const { ...rest } = values;

              const testcode = testIds.map((obj) => obj.testcode).join(", ");

              const testnames = testIds.map((obj) => obj.name).join(", ");

              const profiledata = {
                ...rest,
                testcode,
                testnames,
                note: text,
              };

              if (profile) {
                const res = await axios
                  .put(`http://localhost:5000/profile/update/${profile.id}`, {
                    profiledata,
                    tests: testIds,
                    headings: headings.map((h, index) => ({
                      ...h,
                      order: index,
                    })),
                    formulas: formulas.map((f) => ({
                      ...f,
                      profileId: profile.id,
                    })),
                  })
                  .then((res) => {
                    // if (res.status === 200) {
                    //   navigate("/profile");
                    // }
                  })
                  .catch((err) => console.log(err));
                return;
              }

              const res = await axios
                .post("http://localhost:5000/profile/add", {
                  profiledata,
                  tests: testIds.map((obj) => obj.id),
                  headings: headings.map((h, index) => ({
                    ...h,
                    order: index,
                  })),
                  formulas,
                })
                .then((res) => {
                  if (res.status === 200) {
                    navigate("/profile");
                  }
                })
                .catch((err) => console.log(err));
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, values, errors }) => {
              console.log(errors, "errorss", values, "values");

              return (
                <form onSubmit={handleSubmit} className="px-2">
                  <div className="grid    md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 lg:grid-cols-4 gap-x-9 gap-y-0 w-full">
                    <FormInput
                      name="name"
                      label="Profile Name"
                      placeholder="Enter Profile Name"
                      className="min-w-[230px]"
                      classname="min-w-[230px]"
                    />
                    {/* <FormInput name="profilecode" label="Role" placeholder="Role" /> */}

                    <FormInput
                      name="sampletype"
                      label="Sample Type"
                      placeholder="Enter the Sample Type"
                      className="min-w-[230px]"
                      classname="min-w-[230px]"
                    />
                    <FormInput
                      name="container"
                      label="Container"
                      placeholder="Enter the Container"
                      className="min-w-[230px]"
                      classname="min-w-[230px]"
                    />
                    {/* <FormInput
                      name="samplesize"
                      label="Sample Size"
                      placeholder="Enter the Sample Size"
                      className="min-w-[230px]"
                      classname="min-w-[230px]"
                    /> */}
                    <FormInput1
                      name="samplesize"
                      label="Sample Size"
                      placeholder="Enter the Sample Size"
                      name1="sampleunit"
                      options1={["ml", "mg"]}
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
                      className="min-w-[230px]"
                      classname="min-w-[230px]"
                      type="number"
                    />
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded h-10 my-auto mr-auto ml-4"
                      onClick={() => setOpen(true)}
                    >
                      Note
                    </button>
                  </div>
                  <div className=" border-[1px] border-t border-gray-400 w-full my-3"></div>
                  {type === "formulas" ? (
                    <div className="flex flex-col gap-6 ">
                      <h4>Formulas</h4>
                      {profile?.test?.map((test) => {
                        const formula = profile.formulas.find(
                          (f) => f.testId === test.id
                        );
                        const tests = profile.test.filter(
                          (t) => t.id !== test.id
                        );
                        return (
                          <div className="flex gap-5 justify-between items-end">
                            <h4 className="min-w-[200px]">{test.name}</h4>
                            <FormulaAutocomplete
                              value={formula?.firsttest || ""}
                              handleChange={handleChange}
                              className="w-full"
                              tests={tests}
                              field="firsttest"
                              testId={test.id as number}
                            />
                            <OperatorSelect
                              value={formula?.firstoperator || ""}
                              handleChange={handleChange}
                              className="w-full"
                              tests={tests}
                              field="firstoperator"
                              testId={test.id as number}
                            />
                            <FormulaAutocomplete
                              value={formula?.secondtest || ""}
                              handleChange={handleChange}
                              className="w-full"
                              tests={tests}
                              field="secondtest"
                              testId={test.id as number}
                            />
                            <OperatorSelect
                              value={formula?.secondoperator || ""}
                              handleChange={handleChange}
                              className="w-full"
                              tests={tests}
                              field="secondoperator"
                              testId={test.id as number}
                            />
                            <FormulaAutocomplete
                              value={formula?.thirdtest || ""}
                              handleChange={handleChange}
                              className="w-full"
                              tests={tests}
                              field="thirdtest"
                              testId={test.id as number}
                            />
                            <Button
                              label="References"
                              type="button"
                              onClick={() => handleClick(test)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="">
                      <AddTest
                        tests={unselectedTests}
                        setTestIds={setTestIds}
                        createTest={createTest}
                        testIds={testIds}
                        heading=""
                        handleheadings={handleHeadings}
                        addTests={addTests}
                        handleClick={handleClick}
                        selected={testIds}
                      />

                      {headings.map((heading) => (
                        <AddTest
                          selected={heading.tests}
                          tests={unselectedTests}
                          setTestIds={setTestIds}
                          createTest={createTest}
                          testIds={testIds}
                          heading={heading.heading}
                          handleheadings={handleHeadings}
                          addTests={(name, query, comparator) => {
                            handleHeadings(
                              heading.heading,
                              undefined,
                              tests.find((i) => i[comparator] === name)
                            );
                          }}
                          handleClick={handleClick}
                          addHeading={true}
                        />
                      ))}

                      <AddTest
                        // tests={tests}
                        setTestIds={setTestIds}
                        createTest={createTest}
                        testIds={testIds}
                        heading=""
                        handleheadings={handleHeadings}
                        addTests={addTests}
                        handleClick={handleClick}
                        selected={testIds}
                        addHeading={true}
                      />

                      {/* <div>
                        {testIds?.map((test) => <Test handleOpen={handleClick} test={test} setTestIds={setTestIds} />)}
                      </div> */}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={` ${
                      isSubmitting
                        ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                        : "bg-blue-500  hover:bg-blue-700  text-white"
                    } font-bold py-2 px-3 text-sm rounded my-3 float-right`}
                  >
                    Submit
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

interface FormulaAutocompleteProps {
  value: string;
  handleChange: (value: string, id: number, field: string) => void;
  className?: string;
  tests: Test[];
  field: string;
  testId: number;
  formulas?: any[];
}

const FormulaAutocomplete = ({
  value,
  handleChange,
  className,
  tests,
  field,
  testId,
  formulas,
}: FormulaAutocompleteProps) => {
  const [query, setQuery] = useState(value || "");
  const filteredTests =
    query === ""
      ? tests.map((p) => {
          return { id: p.id, name: p.name };
        })
      : tests
          .filter((test) =>
            test.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          )
          .map((p) => {
            return { id: p.id, name: p.name };
          });

  console.log(query, "query", field);

  return (
    <div className={`flex  items-center     ${className}`}>
      <div className="w-full">
        <Combobox
          // value={selected}
          value={query}
          onChange={(name) => {
            handleChange(name || "", testId, field);
            setQuery(name || "");
            console.log(name, "name");
          }}
        >
          <div className="relative mt-0 w-full">
            <div
              className={`relative w-full cursor-default border-b-2 border-b-gray-400 focus-within:border-b-blue-600 overflow-hidden text-left shadow-md  sm:text-sm  ${className}`}
            >
              <Combobox.Input
                className={`  border-none focus:border-none focus-visible:border-none focus-visible:outline-none py-3 pl-2 pr-2 text-md leading-5 h-11 text-gray-900 w-full  ${className}`}
                // displayValue={(person: any) => person.name}
                onChange={(event) => {
                  setQuery(event.target.value);
                  handleChange(event.target.value, testId, field);
                }}
                placeholder={"Test / Value"}
                autoComplete="off"
                value={query}
              />
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto  bg-white  py-1  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {filteredTests.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredTests.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-4 text-gray-900 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={person.name}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate cursor-pointer 
                         font-normal`}
                          >
                            {person.name}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
};

const OperatorSelect = ({
  value,
  handleChange,
  className,
  tests,
  field,
  testId,
}: FormulaAutocompleteProps) => {
  const [operator, setOperator] = useState<string>((value as string) || "");
  return (
    <div className={`flex flex-col mx-3 w-full`}>
      <select
        className={`text-gray-600 pr-2  border-b-2 border-b-gray-400 focus-within:border-b-blue-600 bg-white  p-2 text-sm focus-within:shadow-lg h-11  outline-none ${className}`}
        value={operator}
        onChange={(e) => {
          handleChange(e.target.value, testId, field);
          setOperator(e.target.value);
        }}
      >
        <option value=""></option>
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
    </div>
  );
};

export default AddProfile;
