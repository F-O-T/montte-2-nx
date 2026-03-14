import * as React from "react"
import {
  type Column,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type UniqueIdentifier } from "@dnd-kit/core"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, Settings2 } from "lucide-react"

import { cn } from "@packages/ui/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packages/ui/components/table"
import { Checkbox } from "@packages/ui/components/checkbox"
import { Button } from "@packages/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@packages/ui/components/dropdown-menu"

// ── Select checkbox column ────────────────────────────────────────────

function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  }
}

// ── Column header with sort + hide dropdown ───────────────────────────

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[popup-open]:bg-accent"
            />
          }
        >
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <ArrowDown />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp />
          ) : (
            <ChevronsUpDown />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ── Sortable header cell (for column reorder) ─────────────────────────

function SortableHeaderCell({
  headerId,
  colSpan,
  children,
}: {
  headerId: string
  colSpan: number
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: headerId,
  })

  return (
    <TableHead
      ref={setNodeRef}
      colSpan={colSpan}
      className={cn("cursor-grab", isDragging && "opacity-50")}
      style={{
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </TableHead>
  )
}

// ── Sortable body cell (for column reorder) ───────────────────────────

function SortableCell({
  columnId,
  children,
}: {
  columnId: string
  children: React.ReactNode
}) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: columnId,
  })

  return (
    <TableCell
      ref={setNodeRef}
      className={cn(isDragging && "opacity-50")}
      style={{
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      {children}
    </TableCell>
  )
}

// ── Column visibility toggle ──────────────────────────────────────────

function ColumnVisibilityToggle<TData>({
  table,
}: {
  table: ReturnType<typeof useReactTable<TData>>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="ml-auto h-8" />}
      >
        <Settings2 className="mr-2 size-4" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── DataTable component ────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  getRowId: (row: TData) => string
  reorderColumns?: boolean
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel" | "getRowId">>
  noResultsMessage?: string
}

function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  getRowId,
  reorderColumns = false,
  tableOptions,
  noResultsMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(
    () => [createSelectColumn<TData>() as ColumnDef<TData, TValue>, ...userColumns],
    [userColumns],
  )

  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => (c as { accessorKey?: string }).accessorKey ?? c.id ?? ""),
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      ...(reorderColumns ? { columnOrder } : {}),
      ...tableOptions?.state,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: reorderColumns ? setColumnOrder : undefined,
    ...tableOptions,
  })

  const columnIds = React.useMemo<UniqueIdentifier[]>(
    () => table.getVisibleLeafColumns().filter((col) => col.id !== "select").map((col) => col.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, columnOrder, columnVisibility],
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const tableContent = (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {reorderColumns ? (
                <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                  {headerGroup.headers.map((header) =>
                    header.column.id === "select" ? (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="sticky left-0 z-10 bg-background"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ) : (
                      <SortableHeaderCell
                        key={header.id}
                        headerId={header.column.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </SortableHeaderCell>
                    )
                  )}
                </SortableContext>
              ) : (
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.id === "select" &&
                        "sticky left-0 z-10 bg-background"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {reorderColumns ? (
                  <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                    {row.getVisibleCells().map((cell) =>
                      cell.column.id === "select" ? (
                        <TableCell
                          key={cell.id}
                          className="sticky left-0 z-10 bg-background"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ) : (
                        <SortableCell key={cell.id} columnId={cell.column.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </SortableCell>
                      )
                    )}
                  </SortableContext>
                ) : (
                  row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.id === "select" &&
                          "sticky left-0 z-10 bg-background"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noResultsMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  const wrappedTable = reorderColumns ? (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      {tableContent}
    </DndContext>
  ) : (
    tableContent
  )

  return (
    <div>
      <div className="flex items-center py-4">
        <ColumnVisibilityToggle table={table} />
      </div>
      {wrappedTable}
      <div className="flex items-center justify-end py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  )
}

export { DataTable, DataTableColumnHeader, type DataTableProps }
