import { flexRender, Table } from "@tanstack/react-table";
import { ReactNode } from "react";

export function TableData({ table, children }: { table: Table<any>, children: ReactNode }) {
    return (
        <table className="table w-full border-collapse flex items-center justify-center">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <>
                        {children}
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="text-xl pt-2 border-b border-gray-300 cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                            ))}
                        </tr>
                    </>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                className="pt-2 border-b-[1px] border-gray-200 whitespace-nowrap"
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
