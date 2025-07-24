// components/ui/Table.tsx
import React from 'react';
import classNames from 'classnames';

function TableBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <table className={classNames('w-full text-left', className)}>
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100">{children}</thead>;
}
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b">{children}</tr>;
}
export function TableHeadCell({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2">{children}</th>;
}
export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}

// Define the combined type for our final Table export:
type TableComponentType = typeof TableBase & {
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  HeadCell: typeof TableHeadCell;
  Cell: typeof TableCell;
};

// Cast and attach statics, then export _only_ this:
export const Table = TableBase as TableComponentType;
Table.Head     = TableHead;
Table.Body     = TableBody;
Table.Row      = TableRow;
Table.HeadCell = TableHeadCell;
Table.Cell     = TableCell;
