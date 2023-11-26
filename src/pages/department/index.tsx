import React, { useEffect, useState } from "react";
import SearchBar from "../../ui/Searchbar";
import axios from "axios";
import Table from "../../Components/TablePages/Table";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../../Api";
import { Button } from "../../ui/Buttons";

const headcells: headcell[] = [
  { id: "id", label: "Department Id", align: "left" },
  { id: "name", label: "Department Name", align: "left" },
  { id: "doctor", label: "Department Doctor", align: "left" },
  { id: "doctorSignature", label: "Doctor Signature", align: "left" },
];

export default function Departments() {
  const [filter, setFilter] = React.useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/department/delete`, {
      data: {
        id,
      },
    });
    await fetchDepartments();
  };

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Department Creation
      </p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <div className="flex justify-between mb-3">
          <SearchBar
            value={filter}
            setValue={setFilter}
            placeholder="Search Department"
          />
          {/* <button
            onClick={() => navigate("/department/add")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
          >
            Add Department
          </button> */}
          <Button
            onClick={() => navigate("/department/add")}
            label="Add Department"
          />
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            {/* <Table /> */}
            <Table
              headcells={headcells}
              rows={departments}
              path="department"
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
