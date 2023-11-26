import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../ui/Searchbar";
import Table from "../../Components/TablePages/Table";
import FormSelect from "../../ui/FormSelect";
import { getDepartments, getProfiles } from "../../Api";
import { Button } from "../../ui/Buttons";

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
  createHeadCell("id", "Profile Id", "left"),
  createHeadCell("name", "Profile Name", "left"),
  createHeadCell("testnames", "Test Names"),
  createHeadCell("regularprice", "Price"),
];

export default function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/profile/delete/${id}`);
    fetchProfiles();
  };

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const fetchProfiles = async () => {
    const data = await getProfiles();
    setProfiles(data);
  };

  useEffect(() => {
    fetchProfiles();
    fetchDepartments();
  }, []);

  const options = [
    {
      label: "Edit",
      onClick: (id?: number) => navigate(`/profile/${id}`),
    },
    {
      label: "Delete",
      onClick: (id?: number) => handleDelete(id as number),
    },
    {
      label: "Add Formula",
      onClick: (id?: number) => navigate(`/profile/${id}?type=formulas`),
    },
  ];

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Profile Creation
      </p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <div className="flex justify-between mb-3">
          <div className="flex">
            <SearchBar
              value={filter}
              setValue={setFilter}
              placeholder="Search Test Name"
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
          <Button
            label="Add Profile"
            onClick={() => navigate("/profile/add")}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <Table
              headcells={headcells}
              rows={profiles.filter(
                (profile) =>
                  (department === "" ||
                    profile.departmentId?.toString() === department) &&
                  profile.name.toLowerCase().includes(filter.toLowerCase())
              )}
              // path="profile"
              options={options}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
