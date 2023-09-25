import axios from "axios";
import React, { useEffect } from "react";

export default function Role() {
  const [roles, setRoles] = React.useState([]);

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:5000/role/getRoles");
    setRoles(res.data.data || []);
  };

  useEffect(() => {
    fetchRoles();
  });
  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Role Creation
      </p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <div className="flex justify-between mb-3">
          {/* <div className="max-w-md mx-auto"> */}

          <div className="relative max-w-sm flex items-center w-full h-12 rounded-lg focus-within:shadow-lg border-2 border-gray-400 focus-within:border-gray-500 bg-white overflow-hidden ml-[10px]">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 border-gray-700"
              type="text"
              id="search"
              placeholder="Search something.."
            />
          </div>
          {/* </div> */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded">
            <a href="/role/add">Add Role</a>
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="bg-[#e0e0e0] py-3 h-[4rem]">
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      S No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Role Id
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-left text-gray-700 uppercase "
                    >
                      Role Name
                    </th>
                    <th
                      scope="col"
                      colSpan={2}
                      align="center"
                      className="px-6 py-3 text-xs font-bold text-center text-gray-700 uppercase "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {roles.map((role: any, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {role.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {role.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                        <a
                          className="text-green-500 hover:text-green-700"
                          href={`/role/${role.id}`}
                        >
                          Edit
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                        <a className="text-red-500 hover:text-red-700" href="#">
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
