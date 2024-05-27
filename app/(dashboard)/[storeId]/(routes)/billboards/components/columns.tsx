"use client"

// import statements
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data to display info on billboards.
export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}

// function to display the columns
export const columns: ColumnDef<BillboardColumn>[] = [
  // label of billboard
  {
    accessorKey: "label",
    header: "Label",
  },
  // date the billboard was created on
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // Actions able to do per billboard, all possible actions defined at cell action
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
