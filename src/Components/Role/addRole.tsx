import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddRole() {
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.post("http://localhost:5000/role/add", {
      name: roleName,
    });
    setLoading(false);
    navigate("/roles");
  };
  return (
    <div className="p-5 w-full ">
      <div className=" py-5 px-8 rounded-md h-full w-full bg-white shadow-md">
        <p className="text-lg m-2">Add Role</p>
        <div className=" border-[1px] border-t border-gray-500 w-full my-3"></div>
        <form onSubmit={handleSubmit} className="px-2">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700">Role Name</label>
            <input
              className="border-[1px] border-gray-400 focus:border-blue-600 focus:border-[2px] outline-none rounded-md h-10 px-3 my-2 w-[30%]"
              type="text"
              placeholder="Role Name"
              value={roleName}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={` ${
              loading
                ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
                : "bg-blue-500  hover:bg-blue-700  text-white"
            } font-bold py-2 px-3 text-sm rounded my-3`}
          >
            Add Role{" "}
            {loading && (
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRole;
