import { Fragment, useEffect, useState } from "react";
import Divider from "../../util/Divider";
import { api } from "../../Api";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Loader from "../../util/Loader";
import ResultModal from "./resultModal";
import { Button } from "../../util/Buttons";
import { Menu, Transition } from "@headlessui/react";
import { generateReport } from "../../util/generateReport";
import { Document, Page } from "react-pdf";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PatientProfile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<any>(undefined);
  const [patient, setPatient] = useState<Patient | undefined>();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<Blob | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined
  );

  function closeModal() {
    setIsOpen(false);
    setSelected(undefined);
    setSelectedOrder(undefined);
  }

  function openModal(order?: Order) {
    setSelectedOrder(order);
    setIsOpen(true);
  }

  const { id } = useParams();

  const fetchPatient = async () => {
    setLoading(true);
    const res = await api.get("/patient/getPatient/" + id);
    setPatient(res.data?.data);
    setOrders(res.data?.data?.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  console.log(pdfUrl);

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-2 font-medium text-xs">
        Patient {">"} Patient Profile
      </p>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white mx-3 p-6 rounded-md ">
          <div className="flex w-full justify-around">
            <div className="flex ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#6b7280"
                className="w-14 h-14"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="">
                <p className="text-lg font-medium">
                  {patient?.nameprefix + " " + patient?.name}
                </p>
                <ul className="flex">
                  <li className="mr-5 text-sm">{patient?.gender}</li>
                  <li className="mr-5 text-sm">
                    {patient?.age + " " + patient?.agesuffix}
                  </li>
                  <li className="mr-5 text-sm">PID: {patient?.id}</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="flex items-center my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#6b7280"
                  className="w-5 h-5"
                >
                  <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                  <path
                    fillRule="evenodd"
                    d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z"
                    clipRule="evenodd"
                  />
                </svg>

                <p className="text-sm font-medium mx-2">
                  {patient?.phonenumber}
                </p>
              </div>
              <div className="flex my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#6b7280"
                  className="w-5 h-5"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>

                <p className="text-sm font-medium mx-2">{patient?.emailId}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#6b7280"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>

                <p className="text-sm font-medium mx-2">{patient?.address}</p>
              </div>
              <div className="flex my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#6b7280"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 7.5A.75.75 0 009 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 009 12h3.622a2.251 2.251 0 01-2.122 1.5H9a.75.75 0 00-.53 1.28l3 3a.75.75 0 101.06-1.06L10.8 14.988A3.752 3.752 0 0014.175 12H15a.75.75 0 000-1.5h-.825A3.733 3.733 0 0013.5 9H15a.75.75 0 000-1.5H9z"
                    clipRule="evenodd"
                  />
                </svg>

                <p className="text-sm font-medium mx-2">0</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="px-12 py-3">
        {orders.map((order) => (
          <div className="flex relative">
            <div className="w-20 h-20 rounded-full bg-white z-10 text-sm flex justify-center items-center">
              <p className="text-center">
                {" "}
                {`${new Date(order.orderDate).getDate()} ${new Date(
                  order.orderDate
                ).toLocaleString("default", { month: "short" })} ${new Date(
                  order.orderDate
                ).getFullYear()}`}
              </p>
            </div>
            <div className="h-full w-[2px] left-[2.3rem] bg-[#d1d5db] absolute"></div>
            <div className="w-[3rem] h-[2px] bg-[#d1d5db] mt-10"></div>
            <section className="bg-white w-full  p-4 mb-7 pb-8">
              <div className="flex">
                {/* <div> */}
                <p>7:00 AM 5min</p>
                {/* </div> */}

                <div className="flex justify-between w-full items-center">
                  <div className="flex">
                    <p>
                      Dr. P.Tulasi Kumari.M.B.B.S.,M.D. <br />2 Tests
                    </p>
                  </div>
                  <div className="flex">
                    <div
                      className="p-2 rounded-full hover:bg-gray-200 mx-2 cursor-pointer"
                      onClick={async () => {
                        const url = await generateReport({
                          packages: order.packages,
                          tests: order.tests,
                          order,
                          patient: patient as Patient,
                          profiles: order.profiles,
                        });
                        setPdfUrl(url as Blob);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#4b5563"
                        className="w-6 h-6 "
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 003 3h.27l-.155 1.705A1.875 1.875 0 007.232 22.5h9.536a1.875 1.875 0 001.867-2.045l-.155-1.705h.27a3 3 0 003-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0018 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM16.5 6.205v-2.83A.375.375 0 0016.125 3h-8.25a.375.375 0 00-.375.375v2.83a49.353 49.353 0 019 0zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 01-.374.409H7.232a.375.375 0 01-.374-.409l.526-5.784a.373.373 0 01.333-.337 41.741 41.741 0 018.566 0zm.967-3.97a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75V10.5zM15 9.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H15z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-200 mx-2 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#4b5563"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Menu as="div" className="relative ">
                      <div>
                        <Menu.Button className="p-2 rounded-full hover:bg-gray-200 mx-2 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#4b5563"
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
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Collection Time
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Follow Up
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => openModal(order)}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                View Result
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                // href="#"

                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                              >
                                Bookmark
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
              <Divider />
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="bg-[#eceff0] py-1 h-[2.5rem]">
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Test
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Sample
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Label
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Collection
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Process
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Pay
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.packages.map((packages) => (
                    <tr key={packages.id} className="py-1 h-[2.5rem]">
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {packages.name}
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {packages.sampletype +
                          "   " +
                          packages.samplesize +
                          "  " +
                          packages.sampleunit}
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {packages.price}
                      </td>
                      <td
                        onClick={() => {
                          openModal(undefined);
                          const order = {
                            packages: [packages],
                            profiles: [],
                            tests: [],
                          };

                          setSelected(order);
                        }}
                        className="px-6 py-0 text-sm font-medium text-left text-gray-700 uppercase "
                      >
                        <Button
                          label="VIEW RESULT"
                          className="!py-1 !px-2 !my-1"
                        />
                      </td>
                    </tr>
                  ))}
                  {order.profiles.map((packages) => (
                    <tr key={packages.id} className="py-1 h-[2.5rem]">
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {packages.name}
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {packages.sampletype +
                          "   " +
                          packages.samplesize +
                          "  " +
                          packages.sampleunit}
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {packages.price}
                      </td>
                      <td
                        onClick={() => {
                          openModal(undefined);
                          const order = {
                            profiles: [packages],
                            packages: [],
                            tests: [],
                          };
                          setSelected(order);
                        }}
                        className="px-6 py-0 text-sm font-medium text-left text-gray-700 uppercase "
                      >
                        <Button
                          label="VIEW RESULT"
                          className="!py-1 !px-2 !my-1"
                        />
                      </td>
                    </tr>
                  ))}
                  {order.tests.map((test) => (
                    <tr key={test.id} className="py-1 h-[2.5rem]">
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {test.name}
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        <p>
                          {test.sampletype}{" "}
                          <span className="ml-2">
                            {test.samplesize + " " + test.sampleunit}
                          </span>{" "}
                        </p>
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        -
                      </td>
                      <td className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase ">
                        {test.price}
                      </td>
                      <td
                        onClick={() => {
                          openModal(undefined);
                          const order = {
                            tests: [test],
                            profiles: [],
                            packages: [],
                          };
                          setSelected(order);
                        }}
                        className="px-6 py-1 text-sm font-medium text-left text-gray-700 uppercase "
                      >
                        <Button
                          label="VIEW RESULT"
                          onClick={() => openModal(order)}
                          className="!py-1 !px-2 !my-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        ))}
        {/* <Document file="file:///C:/Users/pr875/Downloads/generated_table%20(11).pdf">
          <Page pageNumber={1} />
        </Document> */}
      </div>
      <ResultModal
        closeModal={closeModal}
        isOpen={isOpen}
        order={selectedOrder || selected}
        patient={patient}
      />
    </div>
  );
}
