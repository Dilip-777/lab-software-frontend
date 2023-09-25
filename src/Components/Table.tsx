import React from "react";

function Table() {
  return (
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
              Department Id
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-left text-gray-700 uppercase "
            >
              Department Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-left text-gray-700 uppercase "
            >
              Department Doctor
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-left text-gray-700 uppercase "
            >
              Doctor Signature
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
          <tr>
            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
              1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              111
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Department1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Doctor1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Signature
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-green-500 hover:text-green-700" href="#">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-red-500 hover:text-red-700" href="#">
                Delete
              </a>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
              1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              111
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Department1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Doctor1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Signature
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-green-500 hover:text-green-700" href="#">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-red-500 hover:text-red-700" href="#">
                Delete
              </a>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
              1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              111
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Department1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Doctor1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Signature
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-green-500 hover:text-green-700" href="#">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-red-500 hover:text-red-700" href="#">
                Delete
              </a>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
              1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              111
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Department1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Doctor1
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
              Signature
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-green-500 hover:text-green-700" href="#">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
              <a className="text-red-500 hover:text-red-700" href="#">
                Delete
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
