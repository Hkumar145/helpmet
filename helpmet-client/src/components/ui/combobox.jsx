import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import axios from "../../api/axios";
import { useSelector } from 'react-redux';

export function Combobox({ onSelectRecipient }) {
    const [open, setOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState(null);
    const [employees, setEmployees] = React.useState([]);
    const companyID = useSelector((state) => state.user.currentUser?.companyID);
  
    React.useEffect(() => {
      if (companyID) {
        axios.get(`/companies/${companyID}/employees`)
          .then(response => {
            const sortedEmployees = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
            setEmployees(sortedEmployees.map(employee => ({
              ...employee,
              role: employee.role,
            })));
          })
          .catch(error => {
            console.error("Error fetching employees:", error);
          });
      }
    }, [companyID]);
  
    const handleSelect = (employee) => {
      setSelectedEmployee(employee);
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
            {selectedEmployee ? `${selectedEmployee.firstName} • ${selectedEmployee.role}` : "Choose Recipient"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
          <Command>
            <CommandInput placeholder="Search Recipient" />
            <CommandList>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup>
                {employees.map((employee) => (
                  <CommandItem
                    key={employee.email}
                    value={employee.firstName}
                    onSelect={() => handleSelect(employee)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedEmployee?.email === employee.email ? "opacity-100" : "opacity-0")} />
                    {`${employee.firstName} • ${employee.role}`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
