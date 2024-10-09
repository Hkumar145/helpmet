import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import axios from "../../api/axios";

export function Combobox({ onSelectRecipient }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [employees, setEmployees] = React.useState([]);
  
    React.useEffect(() => {
      axios.get('/employees')
        .then(response => {
          const sortedEmployees = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
          setEmployees(sortedEmployees);
        })
        .catch(error => {
          console.error("Error fetching employees:", error);
        });
    }, []);
  
    const handleSelect = (employee) => {
      setValue(employee.email);
      onSelectRecipient(employee);
      setOpen(false);
    };
  
    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-black"
          >
            {value ? `${employees.find(e => e.email === value)?.firstName} - ${value}` : "Choose Recipient"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search Recipient" />
            <CommandList>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup>
                {employees.map((employee) => (
                  <CommandItem
                    key={employee.email}
                    value={employee.email}
                    onSelect={() => handleSelect(employee)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === employee.email ? "opacity-100" : "opacity-0")} />
                    {`${employee.firstName} - ${employee.email}`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
