import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../util/Searchbar";
import Table from "../TablePages/Table";
import FormSelect from "../../util/FormSelect";
import { getDepartments, getRefDoctors, getRefLabs, getTests } from "../../Api";

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
  createHeadCell("id", "Id", "left"),
  createHeadCell("doctorname", "Doctor Name", "left"),
  createHeadCell("phonenumber", "Phone Number", "left"),
  createHeadCell("emailId", "Email"),
  createHeadCell("autoselectpricelist", "Price List"),
];

export default function RefDoctors() {
  const [refdoctors, setRefDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchTests = async () => {
    const data = await getRefDoctors();
    setRefDoctors(data);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Referal Doctor Creation
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
            onClick={() => navigate("/refdoctor/add")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
          >
            Add Ref Doctor
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <Table
              headcells={headcells}
              rows={refdoctors.filter((reflab) =>
                reflab.doctorname?.toLowerCase().includes(filter.toLowerCase())
              )}
              path="refdoctor"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
