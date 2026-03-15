import * as React from "react"
import {
  type Column,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { restrictToHorizontalAxis, restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type UniqueIdentifier } from "@dnd-kit/core"
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowDownZA,
  ArrowDown01,
  ArrowDown10,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EyeOff,
  GripVertical,
  Settings2,
  X,
} from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui/components/select"

// ── Select checkbox column ────────────────────────────────────────────

function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
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

// ── Row drag handle column ────────────────────────────────────────────

function createDragHandleColumn<TData>(): ColumnDef<TData> {
  return {
    id: "drag-handle",
    header: () => null,
    cell: ({ row }) => <RowDragHandle rowId={row.id} />,
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  }
}

function RowDragHandle({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({ id: rowId })
  return (
    <button
      type="button"
      className="flex size-8 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  )
}

// ── Column header with sort + hide dropdown ───────────────────────────

function getSortIcons(sortType?: "text" | "number") {
  if (sortType === "text") {
    return { asc: ArrowDownAZ, desc: ArrowDownZA }
  }
  if (sortType === "number") {
    return { asc: ArrowDown01, desc: ArrowDown10 }
  }
  return { asc: ArrowUp, desc: ArrowDown }
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  sortType?: "text" | "number"
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  sortType,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sorted = column.getIsSorted()
  const icons = getSortIcons(sortType)
  const AscIcon = icons.asc
  const DescIcon = icons.desc
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "-ml-3 h-9 data-[popup-open]:bg-accent",
                sorted && "text-foreground"
              )}
            />
          }
        >
          <span>{title}</span>
          {sorted === "desc" ? (
            <DescIcon className="size-4" />
          ) : sorted === "asc" ? (
            <AscIcon className="size-4" />
          ) : (
            <ArrowDownUp className="size-4 text-muted-foreground/50" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
            <AscIcon className="size-4 text-muted-foreground" />
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
            <DescIcon className="size-4 text-muted-foreground" />
            Descending
          </DropdownMenuItem>
          {sorted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => column.clearSorting()}>
                <X className="size-4 text-muted-foreground" />
                Clear sort
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => column.toggleVisibility(false)}>
            <EyeOff className="size-4 text-muted-foreground" />
            Hide column
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
      className={cn(isDragging && "opacity-50")}
      style={{
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      <div className="flex items-center">
        <button
          type="button"
          className="flex size-6 cursor-grab items-center justify-center text-muted-foreground/50 hover:text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
        {children}
      </div>
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

// ── Sortable row (for row reorder) ────────────────────────────────────

function SortableRow({
  rowId,
  children,
  className,
  ...props
}: {
  rowId: string
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLTableRowElement>) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: rowId,
  })

  return (
    <TableRow
      ref={setNodeRef}
      className={cn(isDragging && "opacity-50", className)}
      style={{
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      {...props}
    >
      {children}
    </TableRow>
  )
}

// ── Pagination footer ─────────────────────────────────────────────────

function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50, 100],
}: {
  table: ReturnType<typeof useReactTable<TData>>
  pageSizeOptions?: number[]
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
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
        render={<Button variant="outline" size="sm" className="ml-auto h-9" />}
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
  reorderRows?: boolean
  onRowOrderChange?: (data: TData[]) => void
  pageSizeOptions?: number[]
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel" | "getRowId">>
  noResultsMessage?: string
}

function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  getRowId,
  reorderColumns = false,
  reorderRows = false,
  onRowOrderChange,
  pageSizeOptions,
  tableOptions,
  noResultsMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(
    () => [
      createSelectColumn<TData>() as ColumnDef<TData, TValue>,
      ...(reorderRows
        ? [createDragHandleColumn<TData>() as ColumnDef<TData, TValue>]
        : []),
      ...userColumns,
    ],
    [userColumns, reorderRows],
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
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
      ...(reorderColumns ? { columnOrder } : {}),
      ...tableOptions?.state,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnOrderChange: reorderColumns ? setColumnOrder : undefined,
    ...tableOptions,
  })

  const isFixedColumn = (id: string) => id === "select" || id === "drag-handle"

  const columnIds = React.useMemo<UniqueIdentifier[]>(
    () => table.getVisibleLeafColumns().filter((col) => !isFixedColumn(col.id)).map((col) => col.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, columnOrder, columnVisibility],
  )

  const rowIds = React.useMemo<UniqueIdentifier[]>(
    () => table.getRowModel().rows.map((row) => row.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getRowModel().rows],
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  function handleColumnDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function handleRowDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = data.findIndex((row) => getRowId(row) === active.id)
      const newIndex = data.findIndex((row) => getRowId(row) === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        onRowOrderChange?.(arrayMove([...data], oldIndex, newIndex))
      }
    }
  }

  const renderHeaderCells = (headerGroup: ReturnType<typeof table.getHeaderGroups>[number]) => {
    if (reorderColumns) {
      return (
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          {headerGroup.headers.map((header) =>
            isFixedColumn(header.column.id) ? (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={cn(header.column.id === "select" && "sticky left-0 z-10 bg-background")}
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
      )
    }

    return headerGroup.headers.map((header) => (
      <TableHead
        key={header.id}
        colSpan={header.colSpan}
        className={cn(header.column.id === "select" && "sticky left-0 z-10 bg-background")}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </TableHead>
    ))
  }

  const renderBodyCells = (row: ReturnType<typeof table.getRowModel>["rows"][number]) => {
    if (reorderColumns) {
      return (
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          {row.getVisibleCells().map((cell) =>
            isFixedColumn(cell.column.id) ? (
              <TableCell
                key={cell.id}
                className={cn(cell.column.id === "select" && "sticky left-0 z-10 bg-background")}
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
      )
    }

    return row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className={cn(cell.column.id === "select" && "sticky left-0 z-10 bg-background")}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))
  }

  const renderRow = (row: ReturnType<typeof table.getRowModel>["rows"][number]) => {
    if (reorderRows) {
      return (
        <SortableRow key={row.id} rowId={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
          {renderBodyCells(row)}
        </SortableRow>
      )
    }

    return (
      <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
        {renderBodyCells(row)}
      </TableRow>
    )
  }

  const renderRows = () => {
    if (!table.getRowModel().rows.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            {noResultsMessage}
          </TableCell>
        </TableRow>
      )
    }

    if (reorderRows) {
      return (
        <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
          {table.getRowModel().rows.map(renderRow)}
        </SortableContext>
      )
    }

    return table.getRowModel().rows.map(renderRow)
  }

  const tableContent = (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {renderHeaderCells(headerGroup)}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {renderRows()}
        </TableBody>
      </Table>
    </div>
  )

  const needsDndContext = reorderColumns || reorderRows
  const dndModifiers = reorderColumns ? [restrictToHorizontalAxis] : reorderRows ? [restrictToVerticalAxis] : []
  const handleDragEnd = reorderColumns ? handleColumnDragEnd : handleRowDragEnd

  const wrappedTable = needsDndContext ? (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={dndModifiers}
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
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  )
}

export { DataTable, DataTableColumnHeader, DataTablePagination, type DataTableProps }
