import React from "react";

interface Props {
  headcells: headcell[];
  rows: any[];
  path?: string;
  handleDelete: (name: string) => void;
  pricelist: string;
}

function Table({ headcells, rows, path, handleDelete, pricelist }: Props) {
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
            {headcells.map((headcell) => (
              <th
                key={headcell.id}
                scope="col"
                className={`px-6 py-0 text-xs font-bold text-${
                  headcell.align || "left"
                } text-gray-700 uppercase`}
              >
                {headcell.label}
              </th>
            ))}

            <th
              scope="col"
              colSpan={2}
              align="center"
              className="px-6 py-2 text-xs font-bold text-center text-gray-700 uppercase "
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                {index + 1}
              </td>
              {/* {headcells.map((headcell) => (
                <td
                  key={headcell.id}
                  className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                >
                  {gettablecell({ row: row, headcell: headcell })}
                </td>
              ))} */}
              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                {pricelist
                  ? row.pricelist.find((p: any) => p.label === pricelist)
                      ?.price || 0
                  : row.regularprice}
              </td>

              <td
                onClick={() => {
                  handleDelete(row.name);
                }}
                className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap"
              >
                <a className="text-red-500 cursor-pointer hover:text-red-700">
                  Delete
                </a>
              </td>

              {/* <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                <a
                  className="text-green-500 hover:text-green-700"
                  href={`/${path}/${row.id}`}
                >
                  Edit
                </a>
              </td>
              <td
                onClick={() => handleDelete && handleDelete(row.id)}
                className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap"
              >
                <a className="text-red-500 cursor-pointer hover:text-red-700">
                  Delete
                </a>
              </td> */}
            </tr>
          ))}

          {rows.length === 0 && (
            <td
              colSpan={3}
              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
            >
              No Data Found
            </td>
          )}
        </tbody>
      </table>
      {/* <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </div>
  );
}

const gettablecell: any = ({
  row,
  headcell,
}: {
  row: any;
  headcell: headcell;
}) => {
  // console.log(row, headcell);

  if (headcell.id === "testnames")
    return (
      row["test"]?.map((test: any) => test.name)?.join(", ") +
        (row["profile"]
          ? ", " +
            row["profile"]?.map((profile: any) => profile.name)?.join(", ")
          : "") || "-"
    );
  else if (headcell.nested && headcell.nested.length > 0) {
    return (
      row[headcell.nested]?.find((item: any) => item.label === headcell.label)
        ?.price || 0
    );
  } else return row[headcell.id];
};

export default Table;
