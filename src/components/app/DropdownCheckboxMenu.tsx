import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command.tsx";
import CustomDropdownMenuItem from "../app/CustomDropdownMenuItem";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { IDropdownCheckboxMenuProps } from "../../../types/AppTypes";

const DropdownCheckboxMenu = <T extends string>({
  keyword,
  filterArray,
  handleFilterClick,
  filterDetails,
  disabled,
  dataTestid,
}: IDropdownCheckboxMenuProps<T>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          data-testid={dataTestid}
        >
          {filterArray && filterArray.length > 0
            ? `${filterArray.length} ${keyword}${filterArray.length === 1 ? "" : "s"} selected`
            : `Select your ${keyword}s`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", open && "shadow-lg")}
        style={{ width: "var(--radix-popper-anchor-width)" }}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {Object.values(filterDetails || {}).map((filter) => {
                const typedFilter = filter as {
                  label: string;
                  value: string;
                  icon: React.ReactElement;
                };
                return (
                  <CommandItem
                    key={typedFilter.value}
                    onSelect={() => handleFilterClick(typedFilter.value)}
                    data-testid={`${dataTestid}-item-${typedFilter.value}`}
                  >
                    <CustomDropdownMenuItem
                      id={typedFilter.label}
                      label={typedFilter.label}
                      icon={typedFilter.icon}
                      checked={
                        Array.isArray(filterArray)
                          ? filterArray.every(
                              (item) => typeof item === "string"
                            )
                            ? filterArray.includes(typedFilter.value) // Case 1: string[]
                            : filterArray.some(
                                (item) => item.value === typedFilter.value
                              ) // Case 2: { value: string }[]
                          : false
                      }
                      onChange={() => handleFilterClick(typedFilter.value)}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownCheckboxMenu;
