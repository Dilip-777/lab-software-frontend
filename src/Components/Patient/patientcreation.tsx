import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Formik } from "formik";
import FormInput from "../FormikComponents/FormInput";
import FormSelect from "../FormikComponents/FormSelect";
import { api, getPriceLists, getRefDoctors, getRefLabs } from "../../Api";
import Autocomplete from "../Profile/autocomplete";
import Autocomplete1 from "../../ui/Autocomplete";
import Table from "./testTable";
import FormInput1 from "../FormikComponents/FormInputWithSelect";
import TextArea from "../FormikComponents/TextArea";
import PatientAutocomplete from "../../ui/Patientnameautocomplete";
import { generatepdf } from "../../utils/generatepdf";

const HeadCells: headcell[] = [
  { id: "name", label: "Name" },
  { id: "regularprice", label: "Price" },
];

const FormSchema = z.object({
  name: z.string(),
  nameprefix: z.string(),
  identityType: z.string(),
  identityNumber: z.string().optional(),
  gender: z.string(),
  phonenumber: z.string(),
  emailId: z.string().email().optional(),
  age: z.number(),
  agesuffix: z.string(),
  address: z.string().optional(),
  pricelist: z.string().optional(),
  totalamount: z.number(),
  discount: z.number(),
  discountType: z.string(),
  netamount: z.number(),
  paymentmethod: z.string(),
  paidamount: z.number(),
  balanceamount: z.number(),
  remarks: z.string().optional(),
});

function PatientCreation() {
  const navigate = useNavigate();
  const [refdoctor, setrefdoctor] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [priceList, setPriceList] = useState<any[]>([]);
  const [reflab, setreflab] = useState<RefLab | undefined>(undefined);
  const [tests, setTests] = useState<any[]>([]);
  const [tests1, setTests1] = useState<any[]>([]);
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [reflabs, setRefLabs] = useState<any[]>([]);
  const [refdoctors, setrefdoctors] = useState<any[]>([]);
  const { id } = useParams();
  const [printBill, setPrintBill] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [patient, setPatient] = useState<any>();
  const [order, setOrder] = useState<Order | undefined>(undefined);

  const fetchPriceList = async () => {
    const data = await api.get("/pricelist/labels");
    setPriceList(data.data.data);
  };

  const fetchRefLabs = async () => {
    setLoading(true);
    const data = await getRefLabs();
    setRefLabs(data);
  };

  const fetchTests = async () => {
    const res = await api.get("/test/getpackagespricelist");
    const data = await getPriceLists("Test");

    setTests1(data?.tests || []);
    setTests(res.data?.data || []);
  };

  const fetchRefDoctors = async () => {
    const data = await getRefDoctors();
    setrefdoctors(data);
  };

  const fetchPatients = async () => {
    const res = await api.get("/patient/getPatients");
    setPatients(res.data?.data || []);
  };

  const fetchOrder = async () => {
    const res = await api.get("/order/getOrder/" + id);
    setOrder(res.data?.data);
    setPatient(res.data?.data?.patient);
    setreflab(res.data?.data?.lab);
    setrefdoctor(res.data?.data?.doctor);

    const testnames = res.data?.data?.tests.map((t: any) => t.name);
    const packagenames = res.data?.data?.packages.map((t: any) => t.name);
    const profilenames = res.data?.data?.profiles.map((t: any) => t.name);

    setSelectedTests(
      tests.filter((t) =>
        [...testnames, ...profilenames, ...packagenames].includes(t.name)
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchRefLabs();
    fetchRefDoctors();
    fetchTests();
    fetchPatients();
    fetchPriceList();
  }, []);

  useEffect(() => {
    if (id !== "add") {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [tests, reflabs, refdoctors]);

  const initialValues = {
    name: order?.patient.name || "",
    nameprefix: order?.patient.nameprefix || "Mr.",
    identityType: order?.patient.identityType || "Aadhar",
    identityNumber: order?.patient.identityNumber || "",
    gender: "",
    phonenumber: order?.patient.phonenumber || "",
    emailId: order?.patient.emailId || "",
    age: order?.patient.age || "",
    agesuffix: order?.patient.agesuffix || "Years",
    address: order?.patient.address || "",
    pricelist: "",
    totalamount: order?.totalamount || 0,
    discount: order?.discount || 0,
    discountType: order?.discountType || "Percentage",
    netamount: order?.netamount || 0,
    paymentmethod: order?.paymentmethod || "",
    paidamount: order?.paidamount || 0,
    balanceamount: order?.balanceamount || 0,
    remarks: order?.remarks || "",
  };

  const getTotalAmount = (pricelist: string) => {
    let totalamount = 0;
    selectedTests.forEach((test) => {
      totalamount += pricelist
        ? test.pricelist.find((p: any) => p.label === pricelist)?.price || 0
        : test.regularprice;
    });
    return totalamount;
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
        <div className=" pt-5 pb-[5rem] px-8 rounded-md h-full w-full bg-white shadow-md">
          <p className="text-lg m-2">{order ? "Edit Order" : "Add Patient"}</p>
          <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(FormSchema)}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              const tests = selectedTests.map((test) => ({
                ...test,
                price:
                  test.pricelist.find((p: any) => p.label === values.pricelist)
                    ?.price || 0,
              }));

              console.log(selectedTests, "selectedTests");

              const discount =
                values.discountType === "Percentage" ? " %" : " ₹";

              const bloburl = await generatepdf({
                tests,
                patient: values,
                reflab: reflab?.diagonsticname,
                refdoctor: refdoctor?.doctorname,
                totalamount: values.totalamount,
                paidamount: values.paidamount,
                discount: values.discount,
                discountType: discount,
                paymentmethod: values.paymentmethod,
              });

              const packages = selectedTests.filter((s) => s.profile);
              const profiles = selectedTests.filter(
                (s) => !s.profile && s.test
              );
              const test = selectedTests.filter((s) => !s.profile && !s.test);
              const body = {
                ...values,
                orderId: order?.id || null,
                doctorId: refdoctor?.id || null,
                labId: reflab?.id || null,
                orderDate: new Date().toISOString(),
                patient: patient,
                packages,
                profiles: profiles.map((p) => ({ ...p, profileId: p.id })),
                tests: test,
                // bill,
              };

              try {
                const patient = await api.post("/patient/add", body);
                // await api.post('/order/testing', body);
                if (!printBill) {
                  const a = document.createElement("a");
                  a.href = bloburl || "";
                  a.target = "_blank";
                  a.click();
                }
                window.location.reload();
              } catch (error) {
                console.log(error);
              }

              console.log(values, "values");

              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              isSubmitting,
              errors,
              values,
              setFieldValue,
            }) => {
              console.log(errors, "errors");

              if (
                (values.nameprefix === "Ms." || values.nameprefix === "Mrs.") &&
                values.gender !== "Female"
              ) {
                setFieldValue("gender", "Female");
              }
              if (values.nameprefix === "Mr." && values.gender !== "Male") {
                setFieldValue("gender", "Male");
              }

              if (values.pricelist) {
                HeadCells[1].id = values.pricelist;
              }
              if (
                reflab &&
                reflab?.emailId !== values.emailId &&
                reflab?.address !== values.address &&
                reflab.phonenumber !== values.phonenumber
              ) {
                setFieldValue("emailId", reflab?.emailId);
                setFieldValue("address", reflab?.address);
                setFieldValue("phonenumber", reflab?.phonenumber);
              }

              if (
                !refdoctor &&
                reflab &&
                reflab?.autoselectpricelist !== values.pricelist
              ) {
                setFieldValue("pricelist", reflab?.autoselectpricelist);
              }

              if (
                refdoctor &&
                refdoctor?.autoselectpricelist !== values.pricelist
              ) {
                setFieldValue("pricelist", refdoctor?.autoselectpricelist);
              }

              if (values.totalamount !== getTotalAmount(values.pricelist)) {
                setFieldValue("totalamount", getTotalAmount(values.pricelist));
              }

              if (values.discountType === "Percentage") {
                if (
                  values.netamount !==
                  values.totalamount -
                    (values.totalamount * values.discount) / 100
                ) {
                  setFieldValue(
                    "netamount",
                    values.totalamount -
                      (values.totalamount * values.discount) / 100
                  );
                }
              }

              if (values.discountType === "Amount") {
                if (values.netamount !== values.totalamount - values.discount) {
                  setFieldValue(
                    "netamount",
                    values.totalamount - values.discount
                  );
                }
              }

              if (
                values.balanceamount !==
                values.netamount - values.paidamount
              ) {
                setFieldValue(
                  "balanceamount",
                  values.netamount - values.paidamount
                );
              }

              console.log(values, "values", values.name, "name");

              if (patient) {
                if (patient.nameprefix !== values.nameprefix)
                  setFieldValue("nameprefix", patient.nameprefix);
                if (patient.name !== values.name)
                  setFieldValue("name", patient.name);
                if (patient.age !== values.age)
                  setFieldValue("age", patient.age);
                if (patient.agesuffix !== values.agesuffix)
                  setFieldValue("agesuffix", patient.agesuffix);
                if (patient.gender !== values.gender)
                  setFieldValue("gender", patient.gender);
                if (!reflab) {
                  if (patient.phonenumber !== values.phonenumber)
                    setFieldValue("phonenumber", patient.phonenumber);
                }
                if (patient.identityNumber !== values.identityNumber)
                  setFieldValue("identityNumber", patient.identityNumber);
                if (patient.identityType !== values.identityType)
                  setFieldValue("identityType", patient.identityType);
                // if(patient.emailId !== values.emailId) setFieldValue("emailId", patient.emailId)
                // if(patient.address !== values.address) setFieldValue("address", patient.address)
              }

              return (
                <form onSubmit={handleSubmit} className="px-2">
                  <div className="grid lg:grid-cols-6 gap-x-10 md:grid-cols-4 xs: grid-cols-2 ">
                    {/* <FormInput
                      name="name"
                      label="Patient Name"
                      placeholder="Enter Patient Name"
                      classname="col-span-2"
                    /> */}
                    {/* <FormInput1
                      name="name"
                      label="Patient Name"
                      placeholder="Enter Patient Name"
                      classname=" col-span-2"
                      className="!w-full "
                      name1="nameprefix"
                      options={["Mr.", "Mrs.", "Ms."]}
                    /> */}
                    <PatientAutocomplete
                      handleChange={(v) => setPatient(v)}
                      item={patient}
                      items={patients}
                      label="Patient Name"
                      placeholder="Enter Patient Name"
                      className=" col-span-2"
                      setFieldValue={setFieldValue}
                      value={values.name}
                      name1="nameprefix"
                      options1={["Mr.", "Mrs.", "Ms."]}
                      name="name"
                    />

                    <div className="col-span-2 grid grid-cols-2 gap-x-2">
                      <FormInput1
                        name="age"
                        label="Age"
                        placeholder="Enter Age"
                        type="number"
                        className="!w-[100%] !min-w-0"
                        classname="col-span-1"
                        options1={["Years", "Months", "Days"]}
                        name1="agesuffix"
                      />
                      <FormSelect
                        name="gender"
                        label="Gender"
                        placeholder="Select Gender"
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Other", label: "Other" },
                        ]}
                        className="!w-[100%] !min-w-[0px]"
                        classname="col-span-1"
                      />
                      {/* <FormInput name="phonenumber" label="Role" placeholder="Role" /> */}
                    </div>
                    <FormInput1
                      name="identityNumber"
                      label="Identity Number"
                      placeholder="Enter Identiy Number"
                      classname="col-span-2"
                      className="!w-full "
                      name1="identityType"
                      options={["Aadhar", "Pan", "Other"]}
                    />
                    <div className="grid grid-cols-2 gap-x-10 col-span-4">
                      {/* <FormInput
                        name="phonenumber"
                        label="Mobile Number"
                        placeholder="Mobile Number"
                        classname="col-span-1"
                        className="!w-full "
                      /> */}
                      <PatientAutocomplete
                        handleChange={(v) => setPatient(v)}
                        item={patient}
                        items={patients}
                        label="Phone Number"
                        placeholder="Enter Phone Number"
                        className=" col-span-1"
                        setFieldValue={setFieldValue}
                        value={values.phonenumber}
                        type="number"
                        name="phonenumber"
                      />
                      <FormInput
                        name="emailId"
                        label="Email Id"
                        placeholder="Enter Email Id"
                        classname="col-span-1"
                      />
                      <Autocomplete1
                        item={reflab}
                        handleChange={(v) => {
                          setreflab(v);
                        }}
                        label="Ref Lab"
                        placeholder="Select Ref Lab"
                        items={reflabs}
                        comparator="diagonsticname"
                      />
                      <Autocomplete1
                        item={refdoctor}
                        handleChange={(v) => {
                          setrefdoctor(v);
                        }}
                        label="Ref Doctor"
                        placeholder="Select Ref Doctor"
                        items={refdoctors}
                        comparator="doctorname"
                      />
                    </div>
                    <TextArea
                      name="address"
                      label="Address"
                      placeholder="Enter Address"
                      className="h-full w-full"
                      classname="col-span-2"
                    />
                    <FormSelect
                      name="pricelist"
                      label="Select Price List"
                      placeholder="Select Price List"
                      options={priceList.map((item) => ({
                        value: item.label,
                        label: item.label,
                      }))}
                      className="!w-[100%] !min-w-[0px]"
                      classname="col-span-1"
                    />
                    <Autocomplete
                      tests={tests}
                      setTestIds={setSelectedTests}
                      label="Select Test/Profile/Package"
                      placeholder="Select Test/Profile/Package"
                      testIds={selectedTests}
                      className="col-span-3"

                      // className="!w-full"
                    />
                    {/* <div></div> */}
                    <Autocomplete
                      tests={tests1}
                      setTestIds={setSelectedTests}
                      label="Select Test/Profile/Package"
                      placeholder="Select Test/Profile/Package"
                      testIds={selectedTests}
                      className="col-span-2"
                      comparator="testcode"
                    />
                  </div>

                  {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-x-4">
                    
                    <Autocomplete1
                      item={reflab}
                      handleChange={(v) => {
                        setrefdoctor(undefined);
                        setreflab(v);
                      }}
                      label="Ref Lab"
                      placeholder="Select Ref Lab"
                      items={reflabs}
                      comparator="diagonsticname"
                    />
                    <Autocomplete1
                      item={refdoctor}
                      handleChange={(v) => {
                        setrefdoctor(v);
                        setreflab(undefined);
                      }}
                      label="Ref Doctor"
                      placeholder="Select Ref Doctor"
                      items={refdoctors}
                      comparator="doctorname"
                    />
                  </div> */}

                  {selectedTests.length > 0 && (
                    <div className="w-[70%] mx-auto">
                      <Table
                        headcells={HeadCells}
                        rows={selectedTests}
                        handleDelete={(name) => {
                          setSelectedTests((prev) =>
                            prev.filter((item) => item.name !== name)
                          );
                        }}
                        pricelist={values.pricelist}
                      />
                    </div>
                  )}
                  <div className="flex flex-row  w-full justify-between flex-wrap mt-6">
                    <FormInput
                      name="totalamount"
                      label="Total Amount"
                      placeholder="Enter Total Amount"
                      type="number"
                      className="!min-w-0 !w-[9rem]"
                    />
                    <div className="flex">
                      <FormInput
                        name="discount"
                        label="Discount"
                        placeholder="Enter Discount"
                        type="number"
                        className="!min-w-0 !w-[9rem] !mx-0"
                      />
                      <FormSelect
                        name="discountType"
                        label="Discount Type"
                        placeholder="Select Discount Type"
                        options={[
                          { value: "Percentage", label: "Percentage" },
                          { value: "Amount", label: "Amount" },
                        ]}
                        className="!min-w-0 !w-[9rem] !ml-0"
                      />
                    </div>
                    <FormInput
                      name="netamount"
                      label="Net Amount"
                      placeholder="Enter Net Amount"
                      type="number"
                      className="!min-w-0 !w-[9rem]"
                    />
                    <FormSelect
                      name="paymentmethod"
                      label="Payment Mode"
                      placeholder="Select Payment Mode"
                      options={[
                        { value: "Cash", label: "Cash" },
                        { value: "Card", label: "Card" },
                        { value: "Cheque", label: "Cheque" },
                      ]}
                      className="!min-w-0 !w-[9rem]"
                    />
                    <FormInput
                      name="paidamount"
                      label="Paid Amount"
                      placeholder="Enter Paid Amount"
                      type="number"
                      className="!min-w-0 !w-[9rem]"
                    />
                    <FormInput
                      name="balanceamount"
                      label="Balance Amount"
                      placeholder="Enter Balance Amount"
                      type="number"
                      className="!min-w-0 !w-[9rem]"
                    />
                    <FormInput
                      name="remarks"
                      label="Remarks"
                      placeholder="Enter Remarks"
                      className="!min-w-0 !w-[9rem]"
                    />
                  </div>
                  <div className="flex flex-row  w-full items-center">
                    <input
                      type="radio"
                      onClick={(e) => {
                        setPrintBill(!printBill);
                      }}
                      checked={printBill}
                      className="h-6 w-6"
                    />
                    <label htmlFor="print" className="ml-2">
                      Continue without opening Generated Bill ( Please Uncheck
                      if you want to open the Generated Bill)
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={` ${
                      isSubmitting
                        ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                        : "bg-green-600  hover:bg-green-700  text-white"
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
                </form>
              );
            }}
          </Formik>
        </div>
      )}
    </div>
  );
}

export default PatientCreation;
