"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { modelRowWithSamples } from "@/types/utils";

type ModelsTableProps = {
  models: modelRowWithSamples[];
};

export default function ModelsTable({ models }: ModelsTableProps) {
  return (
    <div className="rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map((model) => (
            <TableRow key={model.id} className="cursor-pointer h-16">
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {model.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>{model.provider}</TableCell>
              <TableCell>{model.model_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
