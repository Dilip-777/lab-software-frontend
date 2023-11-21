import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../util/Searchbar';
import Table from '../../Components/TablePages/Table';
import FormSelect from '../../util/FormSelect';
import { api, getDepartments, getTests } from '../../Api';
import DeleteModal from '../../util/DeleteModal';

const createHeadCell = (
  id: string,
  label: string,
  align?: 'right' | 'left' | 'center',
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
  createHeadCell('id', 'Test Id', 'left'),
  createHeadCell('name', 'Test Name', 'left'),
  createHeadCell('departmentName', 'Department Name', 'left'),
  createHeadCell('regularprice', 'Price'),
];

export default function Tests() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const res = await api.delete(`test/delete/${id}`);
    fetchTests();
  };

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const fetchTests = async () => {
    const data = await getTests();
    setTests(data);
  };

  const options = [
    {
      label: 'Edit',
      onClick: (id?: number) => navigate(`/test/${id}`),
    },
    {
      label: 'Delete',
      onClick: (id?: number) => {
        setOpen(true);
        setId(id as number);
      },
    },
  ];

  useEffect(() => {
    fetchTests();
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">Administration {'>'} Test Creation</p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <div className="flex justify-between mb-3">
          <div className="flex">
            <SearchBar value={filter} setValue={setFilter} placeholder="Search Test Name" />
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
            onClick={() => navigate('/test/add')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
          >
            Add Test
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <Table
              headcells={headcells}
              rows={tests.filter(
                (test) =>
                  (department === '' || test.departmentId?.toString() === department) &&
                  test.name.toLowerCase().includes(filter.toLowerCase())
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
