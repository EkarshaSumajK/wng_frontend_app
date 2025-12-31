import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Medal,
  ArrowUpDown,
  Filter,
  Flame,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface LeaderboardEntry {
  id: string;
  name: string;
  className: string;
  score: number; // Primary metric for ranking (e.g., Overall Rate, Wellbeing)
  scoreLabel: string; // Label for the score (e.g., "Wellbeing", "Engagement")
  secondaryScore?: number;
  secondaryLabel?: string;
  streak?: number;
  riskLevel?: "low" | "medium" | "high"; // For coloring/highlighting
  avatar?: string;
  rank?: number; // Pre-calculated rank or undefined
}

interface AnalyticsLeaderboardProps {
  students: LeaderboardEntry[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalStudents?: number;
}

export function AnalyticsLeaderboard({
  students,
  title = "Student Leaderboard",
  description = "Rankings based on overall performance and engagement",
  isLoading = false,
  currentPage,
  totalPages: externalTotalPages,
  onPageChange,
  totalStudents,
}: AnalyticsLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: "rank" | "name" | "streak" | "score";
    direction: "asc" | "desc";
  }>({  key: "rank", direction: "asc" }); // Default to Rank ASC (1, 2, 3...)

  // Get unique classes for filter
  const uniqueClasses = useMemo(() => {
    const classes = new Set(students.map((s) => s.className));
    return Array.from(classes).sort();
  }, [students]);

  const isServerSide = currentPage !== undefined && onPageChange !== undefined;

  // Pre-calculate ranks based on the incoming sorted order (which is by score from backend)
  // This ensures that when we sort by name/etc on client, the original "Performance Rank" persists.
  const rankedStudents = useMemo(() => {
    return students.map((s, i) => ({
      ...s,
      // Fixed rank based on position in the global list
      calculatedRank: (isServerSide ? ((currentPage || 1) - 1) * itemsPerPage : 0) + i + 1
    }));
  }, [students, isServerSide, currentPage, itemsPerPage]);

  // Filter and Sort Logic
  const processedData = useMemo(() => {
    let filtered = [...rankedStudents];

    // 1. Search
    if (searchQuery) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Class Filter
    if (classFilter !== "all") {
      filtered = filtered.filter((s) => s.className === classFilter);
    }

    // 3. Sort
    filtered.sort((a, b) => {
      // Use calculatedRank for 'rank' or 'score' sorting as they are correlated
      const aValue = sortConfig.key === "rank" ? a.calculatedRank : (a[sortConfig.key === "streak" ? "score" : sortConfig.key] ?? 0);
      const bValue = sortConfig.key === "rank" ? b.calculatedRank : (b[sortConfig.key === "streak" ? "score" : sortConfig.key] ?? 0);

      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
           // If sorting by Rank directly: Asc = 1, 2, 3 (Best first). Desc = 10, 9...
           // If sorting by Score: Desc = 100, 99 (Best first). Asc = 0, 1...
           if (sortConfig.key === "rank") {
               return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
           }
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    
    return filtered;
  }, [rankedStudents, searchQuery, classFilter, sortConfig]);

  // Pagination Logic
  // If external pagination is provided, use it. Otherwise, use internal state.
  
  const totalPages = isServerSide ? (externalTotalPages || 1) : Math.ceil(processedData.length / itemsPerPage);
  
  // If server-side, we just show 'processedData' (which should be the current page)
  // If client-side, we slice 'processedData'
  const paginatedData = isServerSide ? processedData : processedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (key: "rank" | "name" | "streak" | "score") => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" fill="currentColor" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" fill="currentColor" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" fill="currentColor" />;
    return <span className="text-muted-foreground font-bold w-5 text-center">{rank}</span>;
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
      case "medium": return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";
      default: return "";
    }
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-10"
              />
            </div>

            {/* Class Filter */}
             <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={classFilter}
                onValueChange={(v) => {
                  setClassFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-card/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px] text-center cursor-pointer" onClick={() => handleSort("rank")}>
                   <div className="flex items-center justify-center gap-1">
                     Rank <ArrowUpDown className="w-3 h-3" />
                   </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                   <div className="flex items-center gap-1">
                    Student Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Class</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("score")}>
                   <div className="flex items-center justify-end gap-1">
                    Score <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                          Loading...
                      </TableCell>
                  </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-center">
                        <div className="flex justify-center items-center">
                            {getRankBadge(student.calculatedRank || student.rank || 0)}
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {student.avatar ? (
                             <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            student.name.substring(0, 2)
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          {student.riskLevel === 'high' && (
                             <Badge variant="outline" className="mt-1 h-5 text-[10px] px-1 gap-1 border-red-200 text-red-600 bg-red-50">
                                <AlertTriangle className="w-3 h-3" /> Needs Attention
                             </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {student.className}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">{student.score.toFixed(0)}%</span>
                        <span className="text-xs text-muted-foreground">{student.scoreLabel}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

         {/* Pagination Controls */}
         {totalPages > 1 && (
            <div className="mt-4">
               <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => {
                            const newPage = isServerSide ? Math.max(1, (currentPage || 1) - 1) : Math.max(1, page - 1);
                            if (isServerSide && onPageChange) onPageChange(newPage);
                            else setPage(newPage);
                        }}
                        className={(isServerSide ? currentPage : page) === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                       const activePage = isServerSide ? currentPage : page;
                       // Simple logic for small number of pages, can be enhanced for large datasets
                       if (
                           totalPages > 7 && 
                           (pageNum < (activePage || 1) - 1 || pageNum > (activePage || 1) + 1) && 
                           pageNum !== 1 && 
                           pageNum !== totalPages
                       ) {
                           if (pageNum === (activePage || 1) - 2 || pageNum === (activePage || 1) + 2) {
                               return (
                                   <PaginationItem key={pageNum}>
                                       <PaginationEllipsis />
                                   </PaginationItem>
                               )
                           }
                           return null;
                       }

                       return (
                        <PaginationItem key={pageNum}>
                            <PaginationLink 
                                isActive={pageNum === activePage}
                                onClick={() => {
                                    if (isServerSide && onPageChange) onPageChange(pageNum);
                                    else setPage(pageNum);
                                }}
                                className="cursor-pointer"
                            >
                            {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                       )
                    })}

                    <PaginationItem>
                    <PaginationNext 
                        onClick={() => {
                            const newPage = isServerSide ? Math.min(totalPages, (currentPage || 1) + 1) : Math.min(totalPages, page + 1);
                             if (isServerSide && onPageChange) onPageChange(newPage);
                             else setPage(newPage);
                        }}
                        className={(isServerSide ? currentPage : page) === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    </PaginationItem>
                </PaginationContent>
               </Pagination>
               <div className="text-center text-xs text-muted-foreground mt-2">
                    Showing {isServerSide ? 
                        ((currentPage || 1) - 1) * itemsPerPage + 1 : 
                        (page - 1) * itemsPerPage + 1
                    } to {isServerSide ? 
                        Math.min((currentPage || 1) * itemsPerPage, totalStudents || 0) : 
                        Math.min(page * itemsPerPage, processedData.length)
                    } of {isServerSide ? (totalStudents || 0) : processedData.length} students
               </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
