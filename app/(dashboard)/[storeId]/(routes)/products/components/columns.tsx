"use client"

// import statements
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data to display info on products.
export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

// function to display the columns
export const columns: ColumnDef<ProductColumn>[] = [
  // name of products
  {
    accessorKey: "name",
    header: "Name",
  },
  // weather product is archived
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  // weather product is featured
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  // Price of products
  {
    accessorKey: "price",
    header: "Price",
  },
  // category of products
  {
    accessorKey: "category",
    header: "Category",
  },
  // size of products
  {
    accessorKey: "size",
    header: "Size",
  },
  // color of products
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div 
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: row.original.color }}
        />
      </div>
    )
  },
  // date the product was created on
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // Actions able to do per product, all possible actions defined at cell action
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
