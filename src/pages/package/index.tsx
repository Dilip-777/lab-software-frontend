import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../ui/Searchbar";
import Table from "../../Components/TablePages/Table";
import FormSelect from "../../ui/FormSelect";
import {
  api,
  getDepartments,
  getPackages,
  getProfiles,
  getTests,
} from "../../Api";
import DeleteModal from "../../ui/DeleteModal";

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
  createHeadCell("id", "Package Id", "left"),
  createHeadCell("name", "Package Name", "left"),
  createHeadCell("testnames", "Test / Panel Names"),
  createHeadCell("regularprice", "Price"),
];

export default function Packages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const handleDelete = async () => {
    const res = await api.delete(`package/delete/${id}`);
    fetchPackages();
  };

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const fetchPackages = async () => {
    const data = await getPackages();
    setPackages(data);
  };

  useEffect(() => {
    fetchPackages();
    fetchDepartments();
  }, []);

  const options = [
    {
      label: "Edit",
      onClick: (id?: number) => navigate(`/package/${id}`),
    },
    {
      label: "Delete",
      onClick: (id?: number) => {
        setOpen(true);
        setId(id as number);
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Package Creation
      </p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <div className="flex justify-between mb-3">
          <div className="flex">
            <SearchBar
              value={filter}
              setValue={setFilter}
              placeholder="Search Package Name"
            />
            <FormSelect
              value={department}
              setValue={setDepartment}
              placeholder="Select Department"
              options={departments.map((department) => ({
                value: department.id.toString(),
                label: department.name,
              }))}
            />
          </div>
          <button
            onClick={() => navigate("/package/add")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
          >
            Add Package
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <Table
              headcells={headcells}
              rows={packages.filter(
                (profile) =>
                  (department === "" ||
                    profile.departmentId?.toString() === department) &&
                  profile.name.toLowerCase().includes(filter.toLowerCase())
              )}
              options={options}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <DeleteModal open={open} setOpen={setOpen} handleDelete={handleDelete} />
    </div>
  );
}
