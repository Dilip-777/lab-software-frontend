import axios from "axios";
import React, { useEffect } from "react";
import FormSelect from "../ui/FormSelect";

export default function AssignPrivileges() {
  const [roles, setRoles] = React.useState<any[]>([]);
  const [privileges, setPrivileges] = React.useState<any[]>([]);
  const [roleid, setRoleid] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const fetchPrivileges = async () => {
    if (roleid) {
      const res = await axios.get(
        `http://localhost:5000/role/getprivileges?roleid=${roleid}`
      );
      // setPrivileges(res.data.data || []);
      const privileges = res.data.data || [];
      const privilegesArray = privileges.map((privilege: any) => {
        return privilege.name;
      });
      setPrivileges(privilegesArray);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.post(
      `http://localhost:5000/role/assignprivileges`,
      {
        roleid,
        privileges,
      }
    );
    setLoading(false);
  };

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:5000/role/getRoles");
    setRoles(res.data.data || []);
  };

  const options = [
    {
      label: "Administration",
      privileges: [
        "Department Creation",
        "Doctor",
        "Test Creation",
        "Profile Creation",
        "Package Creation",
        "Price List Creation",
        "Ref Lab",
        "Ref Doctor",
      ],
    },
    {
      label: "Patient Management",
      privileges: [
        "Patient Creation",
        "Patient Details Edit",
        "Patient Status",
        "Cancel Order",
      ],
    },
    {
      label: "Reports",
      privileges: [
        "Daily Summary",
        "Ref Doctors Summary",
        "Credit Report",
        "Cancelled Test Report",
      ],
    },
    {
      label: "User Management",
      privileges: ["Role Creation", "Assign Privilege", "User Creation"],
    },
    {
      label: "Other",
      privileges: ["WhatsApp Instance Id", "WhatsApp Template"],
    },
  ];

  useEffect(() => {
    fetchRoles();
    fetchPrivileges();
  }, [roleid]);
  return (
    <div className="flex flex-col">
      <p className="text-right mx-5 my-5 font-medium text-sm">
        Administration {">"} Assign Privileges
      </p>
      <div className="bg-white mx-3 p-6 rounded-md ">
        <p className="text-sm font-bold text-gray-700 ml-10 mb-2">
          Select Role
        </p>
        <div className="overflow-x-auto">
          <FormSelect
            value={roleid}
            setValue={setRoleid}
            placeholder="Select the Role"
            options={roles.map((role) => ({
              value: role.id.toString(),
              label: role.name,
            }))}
          />
          <div className="p-1.5  inline-block align-middle m-10">
            <p className="text-sm font-bold text-gray-900 mb-3">
              Assign Privileges:{" "}
            </p>
            <div className=""></div>
            <div className="flex flex-col">
              {/* <Privilegecheckbox privilege="Create User" /> */}
              {options.map((option) => (
                <DropdownCheckbox
                  option={option}
                  privileges={privileges}
                  setPrivileges={setPrivileges}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => handleSubmit()}
          disabled={loading}
          className={` ${
            loading
              ? "bg-gray-200 hover:bg-gray-100 text-gray-500"
              : "bg-blue-500  hover:bg-blue-700  text-white"
          } font-bold py-2 px-3 text-sm rounded my-3`}
        >
          Submit{" "}
          {loading && (
            <div
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            ></div>
          )}
        </button>
      </div>
    </div>
  );
}

const DropdownCheckbox = ({
  option,
  privileges,
  setPrivileges,
}: {
  option: any;
  privileges: any[];
  setPrivileges: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [open, setOpen] = React.useState(false);

  const check = !!privileges.find(
    (privilege) => option.privileges?.includes(privilege)
  );

  return (
    <div>
      {/* <p className=""></p> */}
      <div className="flex flex-row my-2">
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer"
          checked={check}
          onChange={(e) => {
            if (check) {
              setPrivileges(
                privileges.filter(
                  (privilege) => !option.privileges?.includes(privilege)
                )
              );
            } else {
              setPrivileges([...privileges, ...option.privileges]);
            }
          }}
        />
        <p className="mx-2 text-sm font-semibold">{option.label}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className={`w-6 h-6 ${
            open ? "transform rotate-180" : ""
          } transition-transform duration-500 ease-in-out cursor-pointer`}
          onClick={() => setOpen(!open)}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            className="mb-2"
          />
        </svg>
      </div>

      <div
        className={`ml-3 z-1 ${
          !open ? "max-h-0 " : "max-h-screen"
        } overflow-hidden transition-all duration-1000 ease-in-out`}
      >
        {option.privileges.map((privilege: any, index: number) => (
          <div className="flex flex-row my-2">
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer "
              checked={!!privileges.find((p) => p === privilege)}
              onChange={() => {
                if (!!privileges.find((p) => p === privilege)) {
                  setPrivileges(privileges.filter((p) => p !== privilege));
                } else {
                  setPrivileges([...privileges, privilege]);
                }
              }}
            />
            <p className="mx-2 text-sm">{privilege}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Privilegecheckbox = ({ privilege }: { privilege: string }) => {
  return (
    <div className="flex flex-row">
      <input type="checkbox" className="w-5 h-5 cursor-pointer" />
      <p className="mx-2">{privilege}</p>
    </div>
  );
};
