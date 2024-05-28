"use client"

// import statements
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data to display info on Colors.
export type ColorColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

// function to display the columns
export const columns: ColumnDef<ColorColumn>[] = [
  // name of color
  {
    accessorKey: "name",
    header: "Name",
  },
  // value of color
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.value }}/>
      </div>
    )
  },
  // date the color was created on
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // Actions able to do per color, all possible actions defined at cell action
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
