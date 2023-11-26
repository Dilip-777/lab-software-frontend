import React from "react";

function Divider({ className }: { className?: string }) {
  return (
    <div
      className={`border-[1px] border-t border-gray-500 w-full my-3 ${className}`}
    />
  );
}

export default Divider;
