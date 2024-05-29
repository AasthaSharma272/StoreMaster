"use client"

// import statements
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data to display info on orders.
export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

// function to display the columns
export const columns: ColumnDef<OrderColumn>[] = [
  // information to be displayed on order table
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  }
]
