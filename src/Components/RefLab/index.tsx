import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../ui/Searchbar";
import Table from "../TablePages/Table";
import FormSelect from "../../ui/FormSelect";
import { getDepartments, getRefLabs, getTests } from "../../Api";

const createHeadCell = (
  id: string,
  label: string,
  align?: "right" | "left" | "center",
  minWidth?: number
): headcell => {
  return {
    id,
    label,
    align,
    minWidth,
  };
};

const headcells: headcell[] = [
  createHeadCell("id", "Test Id", "left"),
  createHeadCell("diagonsticname", "Diagnostic Name", "left"),
  createHeadCell("phonenumber", "Phone Number", "left"),
  createHeadCell("emailId", "Email"),
  createHeadCell("address", "Address"),
  createHeadCell("autoselectpricelist", "Price List"),
];

export default function RefLabs() {
  const [reflabs, setReflabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchTests = async () => {
    const data = await getRefLabs();
    setReflabs(data);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Referal Lab Creation
      </p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <div className="flex justify-between mb-3">
          <div className="flex">
            <SearchBar
              value={filter}
              setValue={setFilter}
              placeholder="Search Doctor Name"
            />
          </div>
          <button
            onClick={() => navigate("/reflab/add")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
          >
            Add Ref Lab
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <Table
              headcells={headcells}
              rows={reflabs.filter(
                (reflab) =>
                  reflab.diagonsticname
                    ?.toLowerCase()
                    .includes(filter.toLowerCase())
              )}
              path="reflab"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
