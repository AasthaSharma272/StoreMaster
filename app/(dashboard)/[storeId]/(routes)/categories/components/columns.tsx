"use client"

// import statements
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data to display info on categories.
export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
}

// function to display the columns
export const columns: ColumnDef<CategoryColumn>[] = [
  // name of category
  {
    accessorKey: "name",
    header: "Name",
  },
  // billboard to match categories
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  // date the category was created at
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // Actions able to do per category, all possible actions defined at cell action
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
