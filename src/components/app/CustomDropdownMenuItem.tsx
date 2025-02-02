import React from "react";
import { ICustomDropDownMenuProps } from "types/AppTypes";

const CustomDropdownMenuItem: React.FC<ICustomDropDownMenuProps> = ({
  id,
  checked,
  onChange,
  label,
  icon,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-4 grid-cols-1">
          <input
            id={id}
            type="checkbox"
            aria-describedby={label}
            checked={checked}
            onChange={onChange}
            className="dark:checked-border-darkmode-yellow col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-lightmode-panel text-lightmode-background ring-offset-2 ring-offset-lightmode-background transition duration-300 checked:border-lightmode-red checked:bg-lightmode-red focus:outline-none focus:ring-2 focus:ring-lightmode-red focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightmode-red focus-visible:ring-2 focus-visible:ring-lightmode-red disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:bg-darkmode-dark1 dark:ring-offset-darkmode-background dark:checked:border-darkmode-yellow dark:checked:text-darkmode-background dark:focus:ring-darkmode-yellow dark:focus-visible:outline-darkmode-yellow dark:focus-visible:ring-darkmode-yellow"
          />
          <svg
            fill="none"
            viewBox="0 0 14 14"
            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-[:checked]:opacity-100"
            />
          </svg>
        </div>
      </div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 font-medium text-lightmode-text dark:text-darkmode-text"
      >
        {icon}
        <span>{label}</span>
      </label>
    </div>
  );
};

export default CustomDropdownMenuItem;
