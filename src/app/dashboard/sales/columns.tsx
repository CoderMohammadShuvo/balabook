"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Check,
  MoreHorizontal,
  Pencil,
  Printer,
  Trash,
  Undo2,
  X,
} from "lucide-react";
import { useState } from "react";
import { SalePrintLog } from "@/components/ui/sell-print-pop";
import { TaxInvoicePrint } from "@/components/ui/govt-format-invoice-sale";

import { UpdateSaleStatus } from "./_action";
import StatusUpdatePop from "@/components/StatusUpdatePop";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
  id: string;
  customerID: string;
  status: "Complete" | "Pending" | "Ordered" | "Delete";
  userID: string;
  offerID: string;
  Offer: string;
  Customer: string;
  Phone: string;
  amount: number;
  date: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "no",
    header: "#",
    cell: ({ row }: { row: any }) => {
      const sl = row.index + 1; // row.index gives the zero-based index, add 1 to make it 1-based

      return `${sl}.`;
    },
  },
  {
    accessorKey: "invoiceId",
    header: "Invoice ID",
  },

  {
    accessorKey: "user.name",
    header: "Biller",
  },
  {
    accessorKey: `"customer.name"`,
    header: "Customer",
    cell: ({ row }) => {
      const customer = row?.original?.customer;
      return customer.company !== null ? customer.company : customer?.name;
    },
  },
  {
    accessorKey: "customer.phone",
    header: "Phone",
  },
  {
    accessorKey: "grossTotalRound",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: () => <div className="">Action</div>,
    id: "actions",
    cell: ({ row }) => {
      const sales = row.original;
      const [activate, setActive] = useState(false);
      const [taxInvActive, setTaxInvActive] = useState(false);
      const [alertOpen, setAlertOpen] = useState(false);
      const [status, setStatus] = useState("");

      // Button Function
      const handleUpdate = (operation: string) => {
        setStatus(operation);
        setAlertOpen(true);
      };

      // Alert Function
      const updateStatus = async () => {
        setAlertOpen(false);
        const updateStatus = await UpdateSaleStatus(sales.id, status);
        //@ts-ignore
        if (updateStatus) {
          // tosst successfully updated
          console.log("success");
        } else {
          // toast successfully failed
          console.log("failed");
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {sales.status !== "Complete" && (
                <>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleUpdate("Complete")}
                  >
                    <Check size={16} className="mr-2" />
                    Complete
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <Undo2 size={16} className="mr-2" />
                    Return
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActive(true)}
              >
                <Printer size={16} className="mr-2" /> Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTaxInvActive(true)}
              >
                <Printer size={16} className="mr-2" />
                Tax Invoice
              </DropdownMenuItem>
              {sales.status !== "Complete" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleUpdate("Delete")}
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <StatusUpdatePop
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            updateStatus={updateStatus}
            model="Sales"
            operation={status}
          />
          <SalePrintLog open={activate} setOpen={setActive} entry={sales} />
          <TaxInvoicePrint
            open={taxInvActive}
            setOpen={setTaxInvActive}
            entry={sales}
          />
        </>
      );
    },
  },
];
