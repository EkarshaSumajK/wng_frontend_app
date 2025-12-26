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
}

export function AnalyticsLeaderboard({
  students,
  title = "Student Leaderboard",
  description = "Rankings based on overall performance and engagement",
  isLoading = false,
}: AnalyticsLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: "rank" | "name" | "streak" | "score";
    direction: "asc" | "desc";
  }>({  key: "score", direction: "desc" });

  // Get unique classes for filter
  const uniqueClasses = useMemo(() => {
    const classes = new Set(students.map((s) => s.className));
    return Array.from(classes).sort();
  }, [students]);

  // Filter and Sort Logic
  const processedData = useMemo(() => {
    let filtered = [...students];

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
      const aValue = a[sortConfig.key === "rank" ? "score" : sortConfig.key] ?? 0; // Rank is inverse of score usually
      const bValue = b[sortConfig.key === "rank" ? "score" : sortConfig.key] ?? 0;

      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      // For Rank: High score = Low rank number (1st, 2nd...)
      // But if we sort by 'rank' directly (if provided), we assume 1 is better. 
      // If we sort by 'score', higher is better (desc default).
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    
    // Assign Ranks dynamically after sort (if sorting by score)
    // Only if currently sorting by score descending
    if (sortConfig.key === "score" && sortConfig.direction === "desc") {
        return filtered.map((item, index) => ({
            ...item,
            calculatedRank: index + 1
        }));
    }
    
    return filtered.map((item) => ({ ...item, calculatedRank: item.rank || 0}));
  }, [students, searchQuery, classFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
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
                <TableHead className="w-[80px] text-center cursor-pointer" onClick={() => handleSort("score")}>
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
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, processedData.length)} of {processedData.length} students
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
