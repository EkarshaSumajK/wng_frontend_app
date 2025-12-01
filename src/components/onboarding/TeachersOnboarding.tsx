import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { useTeachers, useDeleteTeacher, useClasses } from '@/hooks/useOnboarding';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import UserFormModal from './UserFormModal';
import PaginationControls from './PaginationControls';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TeachersOnboardingProps {
  schoolId: string;
}

export default function TeachersOnboarding({ schoolId }: TeachersOnboardingProps) {
  const { data: teachers, isLoading } = useTeachers(schoolId);
  const { data: classes } = useClasses(schoolId);
  const deleteTeacher = useDeleteTeacher();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const teachersList = (teachers || []) as any[];
  const classesList = (classes || []) as any[];

  // Group classes by teacher_id
  const teacherClassesMap = classesList.reduce((acc: any, classItem: any) => {
    if (classItem.teacher_id) {
      if (!acc[classItem.teacher_id]) {
        acc[classItem.teacher_id] = [];
      }
      acc[classItem.teacher_id].push(classItem);
    }
    return acc;
  }, {});

  const handleEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = (teacher: any) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacher.mutate(teacherToDelete.user_id);
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  // Filter teachers based on search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachersList;
    
    const query = searchQuery.toLowerCase();
    return teachersList.filter((teacher: any) => 
      teacher.display_name?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.phone?.includes(query)
    );
  }, [teachersList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, currentPage, itemsPerPage]);

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
          <CardTitle>Teachers</CardTitle>
          <Button onClick={() => { setSelectedTeacher(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
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
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No teachers found matching your search.' : 'No teachers found. Add your first teacher to get started.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeachers.map((teacher: any) => (
                  <TableRow key={teacher.user_id}>
                    <TableCell className="font-medium">{teacher.display_name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone || '-'}</TableCell>
                    <TableCell>
                      {teacherClassesMap[teacher.user_id] ? (
                        <div className="flex flex-wrap gap-1">
                          {teacherClassesMap[teacher.user_id].map((classItem: any) => (
                            <Badge 
                              key={classItem.class_id} 
                              variant="outline" 
                              className="bg-blue-50 text-primary text-xs"
                            >
                              {classItem.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No classes</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(teacher)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(teacher)}
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
          {filteredTeachers.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTeachers.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemLabel="teachers"
            />
          )}
        </CardContent>
      </Card>

      <UserFormModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTeacher(null); }}
        user={selectedTeacher}
        role="teacher"
        schoolId={schoolId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {teacherToDelete?.display_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
