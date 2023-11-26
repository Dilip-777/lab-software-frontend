import React, { useEffect, useState } from "react";
import SearchBar from "../../ui/Searchbar";
import Table from "../TablePages/Table";
import FormSelect from "../../ui/FormSelect";
import {
  api,
  getDepartments,
  getPackages,
  getPriceLists,
  getProfiles,
  getTests,
} from "../../Api";
import AddPriceList from "./AddPriceList";
import { Button } from "../../ui/Buttons";
import Loader from "../../ui/Loader";

const createHeadCell = (
  id: string,
  label: string,
  align?: "right" | "left" | "center",
  minWidth?: number,
  nested?: string,
  editor?: boolean
): headcell => {
  return {
    id,
    label,
    align,
    minWidth,
    nested,
    editor,
  };
};

const headcells: headcell[] = [];

export default function PricelistTable({ type }: { type: string }) {
  const [priceList, setPriceLists] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [pricelist, setPricelist] = useState<any>();
  const [changes, setChanges] = useState<any[]>([]);
  const [discard, setDiscard] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const fetchPriceList = async () => {
    setLoading(true);
    while (headcells.length > 0) headcells.pop();
    if (
      !headcells.find(
        (headcell) => headcell.id === "id" || headcell.id === "name"
      )
    ) {
      headcells.push(createHeadCell("id", `${type} Id`, "left"));
      headcells.push(createHeadCell("name", `${type} Name`, "left"));
    }
    const data = await getPriceLists(type);

    setPriceLists(data[type.toLowerCase() + "s"]);
    let priceId = "pricelist";
    // if (type === "Package") priceId = "packageprice";
    // if (type === "Profile") priceId = "profileprice";
    data.headers.forEach((header: any) => {
      if (headcells.find((headcell) => headcell.label === header.label)) return;
      headcells.push(
        createHeadCell(header.label, header.label, "left", 150, priceId, true)
      );
    });
    setLoading(false);
  };

  const handleChange = (value: number, testId: number, field: string) => {
    const index = changes.findIndex((c) => c.testId === testId);
    if (index === -1) {
      setChanges([
        ...changes,
        {
          testId: testId,
          [field]: value,
        },
      ]);
    } else {
      const newEditedChanges = [...changes];
      newEditedChanges[index][field] = value;
      setChanges(newEditedChanges);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const testData = changes.map((item) => {
      const { testId, ...labelsAndPrices } = item;
      const test = priceList.find((test) => test.id === testId);
      return { test, labelsAndPrices, type };
    });

    try {
      await api.put("/pricelist/update", testData);
      setChanges([]);
      setDiscard(true);
      fetchPriceList();
    } catch (error) {
      console.log(error);
    }

    fetchPriceList();

    setLoading(false);
  };

  const fetchTests = async () => {
    if (type === "Test") {
      const data = await getTests();
      setTests(data);
    } else if (type === "Package") {
      const data = await getPackages();
      setTests(data);
    } else if (type === "Profile") {
      const data = await getProfiles();
      setTests(data);
    }
  };

  useEffect(() => {
    fetchPriceList();
    fetchTests();
    fetchDepartments();
  }, []);

  return (
    <div className="bg-white mx-3 p-6 rounded-md ">
      <div className="flex justify-between mb-3">
        <div className="flex">
          <SearchBar
            value={filter}
            setValue={setFilter}
            placeholder={`Search ${type} Name`}
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
        {/* <button
            onClick={() => navigate("/test/add")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
          >
            Add Price List
          </button> */}
        {changes.length > 0 ? (
          <div className="flex">
            <Button label="Save" className="m-2" onClick={() => handleSave()} />
            <Button
              label="Discard"
              className="m-2"
              onClick={() => setDiscard(true)}
              variant="outlined"
            />
          </div>
        ) : (
          <AddPriceList tests={tests} type={type} fetch={fetchPriceList} />
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="p-1.5 w-full inline-block align-middle">
          {loading ? (
            <Loader classname="!h-[4rem]" />
          ) : (
            <Table
              headcells={headcells}
              rows={priceList}
              discard={discard}
              handleChange={handleChange}
              setDiscard={setDiscard}
            />
          )}
        </div>
      </div>
    </div>
  );
}
