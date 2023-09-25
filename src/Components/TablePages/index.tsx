import React from "react";
import Table from "./Table";

interface headcell {
  id: string;
  label: string;
  align?: "right" | "left" | "center";
  minWidth?: number;
}

interface Props {
  headcells: headcell[];
  rows: any[];
  path: string;
  title: string;
  buttonlabel: string;
}

export default function TablePage({
  headcells,
  rows,
  path,
  title,
  buttonlabel,
}: Props) {
  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">{title}</p>
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
              //   id="search"
              placeholder="Search something.."
            />
          </div>
          {/* </div> */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded">
            <a href={`${path}/add`}>{buttonlabel}</a>
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <Table headcells={headcells} rows={rows} path={path} />
          </div>
        </div>
      </div>
    </div>
  );
}
