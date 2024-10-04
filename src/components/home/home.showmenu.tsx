import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { useEffect } from "react";

export const ShowMenu = ({ darkMode, limit, setLimit, totalTasks, params, setParams }: any) => {
  useEffect(() => {
    
  }, [limit]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${
            darkMode
              ? "bg-blue-950 hover:bg-blue-900 text-white"
              : "bg-white hover:bg-gray-100"
          } px-3 py-1 ml-2 rounded-md transition-colors duration-200 ease-in-out`}
        >
          Show
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${
          darkMode ? "bg-blue-950 text-white" : "bg-white"
        } p-2 rounded-md shadow-md`}
      >
        <DropdownMenuLabel className="font-bold text-sm mb-1">
          Number of Tasks
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuRadioGroup
          value={limit.toString()}
          onValueChange={(value) => {
            setLimit(value);
            const updatedParams = new URLSearchParams(params)
            updatedParams.set("limit", limit)
            setParams(updatedParams)
          }}
        >
          {["9", "15", "24", `${totalTasks}`].map((value) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className={`flex items-center justify-between ${
                darkMode ? "hover:bg-blue-900 text-white" : "hover:bg-gray-100"
              } transition-colors duration-200 ease-in-out w-28 rounded-md p-1 my-1`}
            >
              <span>{value}</span>
              {limit.toString() === value && (
                <span className="text-blue-500">✓</span>
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
