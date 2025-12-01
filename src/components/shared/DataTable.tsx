import React from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  emptyMessage = "No data available",
  actions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card className="card-professional">
      {(title || searchable) && (
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-4">
          {title && <CardTitle className="text-lg md:text-xl">{title}</CardTitle>}
          {searchable && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {sortedData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={column.width || ''}
                    >
                      {column.sortable !== false ? (
                        <Button
                          variant="ghost"
                          className="h-auto p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort(column.key as string)}
                        >
                          <span className="flex items-center gap-2">
                            {column.label}
                            {getSortIcon(column.key as string)}
                          </span>
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                  {actions && (
                    <TableHead className="w-24">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {column.render
                          ? column.render(item)
                          : item[column.key as keyof T]?.toString() || '-'
                        }
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell onClick={e => e.stopPropagation()}>
                        {actions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}