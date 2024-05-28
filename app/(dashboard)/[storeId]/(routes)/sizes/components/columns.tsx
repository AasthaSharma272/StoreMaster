"use client"

// import statements
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data to display info on Sizes.
export type SizeColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

// function to display the columns
export const columns: ColumnDef<SizeColumn>[] = [
  // name of Size
  {
    accessorKey: "name",
    header: "Name",
  },
  // value of Size
  {
    accessorKey: "value",
    header: "Value",
  },
  // date the size was created on
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // Actions able to do per size, all possible actions defined at cell action
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
