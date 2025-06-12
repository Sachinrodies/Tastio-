// import { X } from 'lucide-react'
// import React from 'react'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { Label } from './label'
import { useRestaurantStore } from '@/store/useRestaurantStore'

export type FilterOptionState = {
  id: string,
  label: string,
}

const filterOptions: FilterOptionState[] = [
  {
    id: "burger",
    label: "Burger",
  },
  {
    id: "pizza",
    label: "Pizza",
  },
  {
    id: "Thali",
    label: "Thali",
  },
  {
    id: "Dessert",
    label: "Dessert",
  },
]

const FilterPage = () => {
  const { setAppliedFilters, resetFilters } = useRestaurantStore();

  const applyFilter = (value: string) => {
    setAppliedFilters(value);
  }

  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Filters by cuisines</h1>
        <Button variant={"link"} onClick={resetFilters}>Reset</Button>
      </div>
      {
        filterOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 my-5">
            <Checkbox 
              id={option.id} 
              onCheckedChange={() => applyFilter(option.label)}
            />
            <Label 
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </Label>
          </div>
        ))
      }
    </div>
  )
}

export default FilterPage