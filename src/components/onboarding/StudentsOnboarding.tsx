import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, Search, Users } from "lucide-react";
import {
  useStudents,
  useDeleteStudent,
  useClasses,
  useParents,
} from "@/hooks/useOnboarding";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import StudentFormModal from "./StudentFormModal";
import PaginationControls from "./PaginationControls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StudentsOnboardingProps {
  schoolId: string;
}

export default function StudentsOnboarding({
  schoolId,
}: StudentsOnboardingProps) {
  const { data: students, isLoading } = useStudents(schoolId);
  const { data: classes } = useClasses(schoolId);
  const { data: parents } = useParents(schoolId);
  const deleteStudent = useDeleteStudent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const studentsList = (students || []) as any[];
  const classesList = (classes || []) as any[];
  const parentsList = (parents || []) as any[];

  // Create a map of class_id to class name for quick lookup
  const classMap = classesList.reduce((acc: any, classItem: any) => {
    acc[classItem.class_id] = `${classItem.name}${
      classItem.section ? ` (${classItem.section})` : ""
    }`;
    return acc;
  }, {});

  // Create a map of parent_id to parent info for quick lookup
  const parentMap = parentsList.reduce((acc: any, parent: any) => {
    acc[parent.user_id] = parent;
    return acc;
  }, {});

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student: any) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent.mutate(studentToDelete.student_id);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return studentsList;

    const query = searchQuery.toLowerCase();
    return studentsList.filter(
      (student: any) =>
        `${student.first_name} ${student.last_name}`
          .toLowerCase()
          .includes(query) ||
        student.grade?.toLowerCase().includes(query) ||
        student.parent_email?.toLowerCase().includes(query) ||
        student.parent_phone?.includes(query)
    );
  }, [studentsList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Reset to page 1 when items per page changes or search query changes
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Students</CardTitle>
          <Button
            onClick={() => {
              setSelectedStudent(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, grade, or parent contact..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No students found matching your search."
                : "No students found. Add your first student to get started."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Connected Parents</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student: any) => (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>
                      {student.class_id ? (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          {classMap[student.class_id] || "Unknown Class"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{student.grade || "-"}</TableCell>
                    <TableCell>
                      {student.parents_id &&
                      Array.isArray(student.parents_id) &&
                      student.parents_id.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.parents_id.map((parentId: string) => {
                            const parent = parentMap[parentId];
                            return parent ? (
                              <Badge
                                key={parentId}
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 text-xs flex items-center gap-1"
                              >
                                <Users className="w-3 h-3" />
                                {parent.display_name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No parents linked
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.parent_email || student.parent_phone || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {filteredStudents.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredStudents.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemLabel="students"
            />
          )}
        </CardContent>
      </Card>

      <StudentFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        schoolId={schoolId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete?.first_name}{" "}
              {studentToDelete?.last_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
