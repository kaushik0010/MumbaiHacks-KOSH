"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// Simplified Saving Type for the Frontend
export type ActiveSaving = {
  _id: string;
  campaignName: string;
  frequency: string;
  amountPerContribution: number;
  amountSaved: number;
  totalAmount: number;
  nextDueDate: string;
  endDate: string;
};

export const activePlanColumns: ColumnDef<ActiveSaving>[] = [
  {
    accessorKey: "campaignName",
    header: "Campaign",
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
    cell: ({ row }) => <div className="capitalize">{row.getValue("frequency")}</div>,
  },
  {
    accessorKey: "amountPerContribution",
    header: "Amount ($)",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amountPerContribution"));
        return <div>${amount.toFixed(2)}</div>;
    }
  },
  {
    accessorKey: "amountSaved",
    header: "Saved",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amountSaved"));
        return <div className="font-medium text-green-600">${amount.toFixed(2)}</div>;
    }
  },
  {
    accessorKey: "nextDueDate",
    header: "Next Due",
    cell: ({ row }) => <div>{format(new Date(row.getValue("nextDueDate")), "dd MMM yyyy")}</div>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => <div>{format(new Date(row.getValue("endDate")), "dd MMM yyyy")}</div>,
  },
];