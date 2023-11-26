import React, { useState, useEffect, Fragment } from "react";
import { api } from "../../Api";
import FormSelect from "../../ui/FormSelect";
import Divider from "../../ui/Divider";
import Loader from "../../ui/Loader";
import { useNavigate } from "react-router-dom";
import ResultModal from "./resultModal";
import { Menu, Transition } from "@headlessui/react";
import { generateReport } from "../../ui/generateReport";
import PreviewModal from "./previewModal";
import { log } from "console";
import moment from "moment";
import CollectionModal from "./collectionModal";
import DeleteModal from "../../ui/DeleteModal";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  handleChange: (e: any) => void;
  divClassname?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const FormInput = ({
  label,
  divClassname,
  value,
  handleChange,
  ...rest
}: Props) => {
  return (
    <div className={divClassname}>
      <label className="text-sm font-[600] text-gray-700 mx-2">{label}</label>
      <div className="relative max-w-sm flex items-center w-full  rounded-sm focus-within:shadow-lg border-2 border-gray-500 focus-within:border-gray-500 bg-white overflow-hidden ml-[10px] px-2 h-9">
        <input
          {...rest}
          onChange={(e) => handleChange(e.target.value)}
          value={value}
          className=" w-full outline-none text-sm text-gray-700 pr-2 border-gray-700"
        />
      </div>
    </div>
  );
};

const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();

const formattedDay = day.toString().padStart(2, "0");
const formattedMonth = month.toString().padStart(2, "0");

const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

export default function PatientStatus() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedDate);
  const [patientname, setPatientname] = useState("");
  const [testcode, setTestcode] = useState("");
  const [testname, setTestname] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [refdoctor, setRefdoctor] = useState("");
  const [reflab, setReflab] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [mailType, setMailType] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [orderid, setOrderId] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  console.log(Date.now().toLocaleString("en-GB"), "date");

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  function closeModal() {
    setIsOpen(false);
    setSelectedOrder(undefined);
  }

  function openModal(order?: Order) {
    setSelectedOrder(order);
    console.log(order, "order");

    setIsOpen(true);
  }

  function openModal1(order?: Order) {
    setSelectedOrder(order);

    setOpen(true);
  }

  function closeModal1() {
    setOpen(false);
    setSelectedOrder(undefined);
  }

  console.log(selectedOrder, "selectedOrder");

  const navigate = useNavigate();

  const fetchOrders = async (s?: string) => {
    setLoading(true);
    const res = await api.get(
      "/order/getOrders?fromDate=" +
        fromDate +
        "&toDate=" +
        toDate +
        "&patientname=" +
        patientname +
        "&testcode=" +
        testcode +
        "&testname=" +
        testname +
        "&mobilenumber=" +
        mobilenumber +
        "&refdoctor=" +
        refdoctor +
        "&reflab=" +
        reflab +
        "&status=" +
        (s || status)
    );
    setOrders(res.data.data || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (order: Order) => {
    console.log(order, "order");

    if (order.orderstatus === "Authorise") {
      openModal(order);
      // await api.put('/order/updateStatus', {
      //   id: order.id,
      //   orderstatus: 'Test Completed',
      //   reporttime: new Date(),
      // });
      // setOrderId(0);

      // fetchOrders();
      return;
    }

    if (order.orderstatus === "Processing") {
      // navigate(`/patient/profile/${pid}`);
      openModal(order);
    } else if (order.orderstatus === "Test Completed") {
      return;
    } else {
      let newStatus =
        order.orderstatus === "Registered" ? "Sample Collected" : "Processing";
      setOrderId(order.id);
      const res = await api.put("/order/updateStatus", {
        id: order.id,
        orderstatus: newStatus,
        collectiontime:
          newStatus === "Sample Collected" ? new Date() : order.collectiontime,
        processtime:
          newStatus === "Processing" ? new Date() : order.processtime,
      });

      setOrderId(0);

      fetchOrders();
    }
  };

  const getTestNames = (order: Order) => {
    let arr: string[] = [];
    arr.push(...order.tests.map((t) => t.name));
    arr.push(...order.profiles.map((p) => p.name));
    arr.push(...order.packages.map((p) => p.name));
    return arr.length ? arr.join(", ") : "N/A";
  };

  const colors = [
    { status: "Registered", color: "#ff9999" },
    { status: "Sample Collected", color: "#00cbce" },
    { status: "Processing", color: "#dd00ff" },
    { status: "Test Completed", color: "#13e900" },
  ];

  const options = [
    {
      value: "History",
      onClick: (order: Order) =>
        navigate(`/patient/profile/${order.patient.id}`),
    },

    {
      value: "Edit Order",
      onClick: (order: Order) => navigate(`/patient/${order.id}`),
    },
    {
      value: "Delete Order",
      onClick: (order: Order) => {
        setSelectedOrder(order);
        setOpen1(true);
      },
    },
    {
      value: "Collection Timings",
      onClick: (order: Order) => openModal1(order),
    },
    { value: "Send to Whatsapp", onClick: () => {} },
  ];

  const handleDelete = async () => {
    const res = await api.delete(`/order/delete/${selectedOrder?.id}`);
    fetchOrders();
    closeModal1();
  };

  console.log(
    new Date("2023-10-08T00:00:00Z"),
    new Date(toDate),
    moment(fromDate).format(),
    "date"
  );

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-3 font-medium text-xs">
        Patient {" > "} Patient Status
      </p>
      <div className="bg-white mx-6 p-6 rounded-md ">
        <div className="grid lg:grid-cols-12 gap-x-10 md:grid-cols-8 sm:grid-cols-4 xs:grid-cols-2 gap-y-6">
          {/* <div className="relative max-w-sm flex items-center w-full  rounded-lg focus-within:shadow-lg border-2 border-gray-400 focus-within:border-gray-500 bg-white overflow-hidden ml-[10px] h-9">
            <input
              className="peer  w-full outline-none text-sm text-gray-700 pr-2 border-gray-700"
              type="text"
              id="search"
              placeholder="Search something.."
            />
          </div> */}
          <FormInput
            label="From Date"
            type="date"
            value={fromDate}
            handleChange={(e) => setFromDate(e)}
            placeholder="From Date"
            divClassname="col-span-2"
          />
          <FormInput
            label="To Date"
            type="date"
            value={toDate}
            handleChange={(e) => setToDate(e)}
            placeholder="To Date"
            divClassname="col-span-2"
          />
          <FormInput
            label="Patient Name"
            type="text"
            value={patientname}
            handleChange={(e) => setPatientname(e)}
            placeholder="Patient Name"
            divClassname="col-span-2"
          />
          <FormInput
            label="Test Code"
            type="text"
            value={testcode}
            handleChange={(e) => setTestcode(e)}
            placeholder="Test Code"
            divClassname="col-span-2"
          />
          <FormInput
            label="Test Name"
            type="text"
            value={testname}
            handleChange={(e) => setTestname(e)}
            placeholder="Test Name"
            divClassname="col-span-2"
          />
          <FormInput
            label="Mobile Number"
            type="text"
            value={mobilenumber}
            handleChange={(e) => setMobilenumber(e)}
            placeholder="Mobile Number"
            divClassname="col-span-2"
          />
          <FormInput
            label="Ref Doctor"
            type="text"
            value={refdoctor}
            handleChange={(e) => setRefdoctor(e)}
            placeholder="Ref Doctor"
            divClassname="col-span-2"
          />
          <FormInput
            label="Ref Lab"
            type="text"
            value={reflab}
            handleChange={(e) => setReflab(e)}
            placeholder="Ref Lab"
            divClassname="col-span-2"
          />
          <FormInput
            label="Status"
            type="text"
            value={status}
            handleChange={(e) => setStatus(e)}
            placeholder="Status"
            divClassname="col-span-2"
          />

          <button
            onClick={() => fetchOrders()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 text-sm rounded h-10 self-end"
          >
            Search
          </button>
        </div>
        <Divider />
        <div className="flex flex-col my-5">
          <div className="flex flex-row justify-between w-full">
            <div
              onClick={() => fetchOrders("Registered")}
              className=" px-3 py-2  bg-[#ff9999] text-white max-w-[12rem] cursor-pointer"
            >
              <p className="font-semibold text-[14px]">
                REGISTERED{" "}
                {`(${
                  orders.filter((o) => o.orderstatus === "Registered").length
                })`}
              </p>
            </div>
            <div
              onClick={() => fetchOrders("Sample Collected")}
              className="flex justify-center items-center px-3 py-2  bg-[#00cbce] text-white max-w-[12rem] cursor-pointer w-[100%]"
            >
              <p className="font-semibold text-[14px]">
                SAMPLE COLLECTED{" "}
                {`(${
                  orders.filter((o) => o.orderstatus === "Sample Collected")
                    .length
                })`}
              </p>
            </div>
            <div
              onClick={() => fetchOrders("Processing")}
              className="flex justify-center items-center px-3 py-2  bg-[#dd00ff] text-white max-w-[12rem] cursor-pointer"
            >
              <p className="font-semibold text-[14px]">
                PROCESSING{" "}
                {`(${
                  orders.filter((o) => o.orderstatus === "Processing").length
                })`}
              </p>
            </div>
            <div
              onClick={() => fetchOrders("Test Completed")}
              className="flex justify-center items-center px-3 py-2  bg-[#13e900] text-white max-w-[12rem] cursor-pointer"
            >
              <p className="font-semibold text-[14px] whitespace-nowrap">
                TEST COMPLETED{" "}
                {`(${
                  orders.filter((o) => o.orderstatus === "Test Completed")
                    .length
                })`}
              </p>
            </div>
            {/* <div className="flex"> */}
            <FormSelect
              options={[
                { value: "G-Mail", label: "G-Mail" },
                { value: "Yahoo", label: "Yahoo" },
                { value: "Outlook", label: "Outlook" },
              ]}
              placeholder="Select Mail Type"
              value={mailType}
              setValue={setMailType}
              inputClassName="h-9"
              divClassName="!mx-0"
            />
            <FormSelect
              options={[
                { value: "G-Mail", label: "G-Mail" },
                { value: "Yahoo", label: "Yahoo" },
                { value: "Outlook", label: "Outlook" },
              ]}
              placeholder="Select Whatsapp"
              value={whatsapp}
              setValue={setWhatsapp}
              inputClassName="h-9"
              divClassName="!mx-0"
            />
            {/* </div> */}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[5rem]">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="bg-[#e0e0e0] p-3 h-[4rem]">
                      <th
                        scope="col"
                        align="center"
                        className="px-2 pl-5 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        S No
                      </th>

                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        PId
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Test Id
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Patient Name
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Age / Gender
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Ref Doctor
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Ref Lab
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold text-gray-700 uppercase "
                      >
                        Test Name
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Registered Date
                      </th>
                      <th
                        scope="col"
                        align="center"
                        className="px-2 py-3 text-xs font-bold  text-gray-700 uppercase "
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        colSpan={2}
                        align="center"
                        className="px-2 py-3 text-xs font-extrabold text-center text-gray-700 uppercase "
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {orders.length > 0 ? (
                    <tbody className="divide-y divide-gray-200 min-h-[20rem] z-[-1]">
                      {orders.map((order, index) => {
                        const color = colors.find(
                          (c) => c.status === order.orderstatus
                        )?.color;
                        return (
                          <tr key={index} className={`bg-[${color}]`}>
                            {/* // <tr key={index} className={`bg-[#91f9cc]`}> */}
                            <td
                              align="center"
                              className="px-2 pl-6 py-4 text-xs font-semibold  text-gray-800 whitespace-nowrap"
                            >
                              {index + 1} <br />
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 whitespace-nowrap"
                            >
                              {order.patient?.id}
                              {order.patient.orders.length === 1 && (
                                <p
                                  className={`text-[${color}] bg-white px-1 rounded-sm`}
                                >
                                  New
                                </p>
                              )}
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 whitespace-nowrap"
                            >
                              {order.id}
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 max-w-[10rem] leading-5"
                            >
                              {order.patient.nameprefix +
                                " " +
                                order.patient.name}
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 whitespace-nowrap"
                            >
                              {order.patient.age +
                                " " +
                                order.patient.agesuffix +
                                " / " +
                                order.patient.gender}
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 max-w-[10rem] leading-5"
                            >
                              {order.doctor?.doctorname || "N/A"}
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 max-w-[10rem] leading-5"
                            >
                              {order.lab?.diagonsticname || "N/A"}
                            </td>
                            <td
                              className="px-2 py-4 text-xs font-semibold text-gray-800 max-w-[10rem] leading-5"
                              align="center"
                            >
                              {getTestNames(order)} {getTestNames(order)}{" "}
                              {getTestNames(order)}
                            </td>
                            <td className="px-0 py-4 text-xs font-semibold text-gray-800 ">
                              {moment(order.orderDate).format("lll")}
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold text-gray-800 whitespace-nowrap"
                            >
                              <div
                                className={`p-2 text-center bg-white cursor-pointer`}
                                onClick={() => updateStatus(order)}
                              >
                                {orderid === order.id ? (
                                  <Loader classname="!h-[1rem]" />
                                ) : (
                                  <p
                                    className={`text-[${color}]`}
                                    style={{ color: color }}
                                  >
                                    {order.orderstatus?.toUpperCase() || "N/A"}
                                  </p>
                                )}
                              </div>
                            </td>

                            <td
                              onClick={async () => {
                                if (order.orderstatus === "Test Completed") {
                                  setIsOpen2(true);
                                  setSelectedOrder(order);
                                }
                              }}
                              align="center"
                              className="px-2 py-4 text-xs font-semibold  text-center whitespace-nowrap"
                            >
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-10 h-10 rounded-full bg-white flex justify-center items-center cursor-${
                                    order.orderstatus === "Test Completed"
                                      ? "pointer"
                                      : "cursor-not-allowed"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={
                                      order.orderstatus === "Test Completed"
                                        ? "#6b7280"
                                        : "#9ca3af"
                                    }
                                    className="w-6 h-6"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 003 3h.27l-.155 1.705A1.875 1.875 0 007.232 22.5h9.536a1.875 1.875 0 001.867-2.045l-.155-1.705h.27a3 3 0 003-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0018 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM16.5 6.205v-2.83A.375.375 0 0016.125 3h-8.25a.375.375 0 00-.375.375v2.83a49.353 49.353 0 019 0zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 01-.374.409H7.232a.375.375 0 01-.374-.409l.526-5.784a.373.373 0 01.333-.337 41.741 41.741 0 018.566 0zm.967-3.97a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75V10.5zM15 9.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H15z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </td>
                            <td
                              align="center"
                              className="px-2 py-4 text-xs font-semibold  text-center whitespace-nowrap"
                            >
                              <Menu as="div" className="relative ">
                                <div>
                                  <Menu.Button
                                    className="p-2 rounded-full hover:bg-gray-200 mx-2  cursor-pointer "
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill={
                                        hoveredIndex === index
                                          ? color
                                          : "#FFFFFF"
                                      }
                                      className="w-6 h-6"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </Menu.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {options.map((option) => (
                                      <Menu.Item key={option.value}>
                                        {({ active }) => (
                                          <p
                                            onClick={() =>
                                              option.onClick(order)
                                            }
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              "block px-4 py-2 text-sm text-gray-600 text-left cursor-pointer"
                                            )}
                                          >
                                            {option.value}
                                          </p>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="h-[10rem]"></tr>
                    </tbody>
                  ) : (
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td
                          align="center"
                          className="px-2 py-4 text-sm font-semibold  text-gray-800 whitespace-nowrap"
                        >
                          No Orders to show
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <ResultModal
        closeModal={closeModal}
        isOpen={isOpen}
        order={selectedOrder}
        patient={selectedOrder?.patient}
        fetchOrders={fetchOrders}
      />
      <PreviewModal
        isOpen={isOpen2}
        closeModal={() => {
          setSelectedOrder(undefined);
          setIsOpen2(false);
        }}
        order={selectedOrder as Order}
        patient={selectedOrder?.patient}
      />
      <CollectionModal
        closeModal={closeModal1}
        isOpen={open}
        order={selectedOrder}
        patient={selectedOrder?.patient}
        fetchPatient={fetchOrders}
      />
      <DeleteModal
        open={open1}
        setOpen={setOpen1}
        handleDelete={handleDelete}
      />
    </div>
  );
}
