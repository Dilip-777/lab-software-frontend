import { useState } from "react";
import { Tab } from "@headlessui/react";
import PricelistTable from "./Pricelist";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PriceList() {
  return (
    <div className="flex flex-col">
      <div className="bg-white mx-3 px-6 py-1 rounded-md ">
        <div className="w-full  px-2 py-2 sm:px-0">
          <p className="text-right mx-5 mt-2 font-medium text-sm">
            Administration {">"} Price List Creation
          </p>
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl py-1 px-1 bg-[#2977dc] mx-auto max-w-md focus:!shadow-none focus:!ring-offset-white">
              {["Tests", "Profiles", "Packages"].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                      " focus:outline-none focus:ring-2 focus:!shadow-none ",
                      selected
                        ? "bg-white shadow"
                        : "text-white hover:bg-[#448ae0] hover:text-white"
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {["Test", "Profile", "Package"].map((type, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    "rounded-xl bg-white p-3",
                    "ring-white ring-opacity-60 ring-offset-2  focus:outline-none focus:ring-2"
                  )}
                >
                  <PricelistTable type={type} />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
