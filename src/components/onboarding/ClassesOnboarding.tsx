import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { useClasses, useDeleteClass } from '@/hooks/useOnboarding';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ClassFormModal from './ClassFormModal';
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

interface ClassesOnboardingProps {
  schoolId: string;
}

export default function ClassesOnboarding({ schoolId }: ClassesOnboardingProps) {
  const { data: classes, isLoading, error } = useClasses(schoolId);
  const deleteClass = useDeleteClass();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Debug logging
  console.log('ClassesOnboarding - schoolId:', schoolId);
  console.log('ClassesOnboarding - classes:', classes);
  console.log('ClassesOnboarding - isLoading:', isLoading);
  console.log('ClassesOnboarding - error:', error);

  const handleEdit = (classItem: any) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleDelete = (classItem: any) => {
    setClassToDelete(classItem);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      deleteClass.mutate(classToDelete.class_id);
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const classesList = (classes as any[]) || [];

  // Filter classes based on search query
  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classesList;
    
    const query = searchQuery.toLowerCase();
    return classesList.filter((classItem: any) => 
      classItem.name?.toLowerCase().includes(query) ||
      classItem.grade?.toLowerCase().includes(query) ||
      classItem.section?.toLowerCase().includes(query) ||
      classItem.academic_year?.includes(query)
    );
  }, [classesList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage, itemsPerPage]);

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
          <CardTitle>Classes</CardTitle>
          <Button onClick={() => { setSelectedClass(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, grade, section, or year..."
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
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No classes found matching your search.' : 'No classes found. Add your first class to get started.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClasses.map((classItem: any) => (
                  <TableRow key={classItem.class_id}>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell>{classItem.grade}</TableCell>
                    <TableCell>{classItem.section || '-'}</TableCell>
                    <TableCell>{classItem.capacity || '-'}</TableCell>
                    <TableCell>{classItem.academic_year || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-success/10 text-success">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(classItem)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(classItem)}
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
          {filteredClasses.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredClasses.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemLabel="classes"
            />
          )}
        </CardContent>
      </Card>

      <ClassFormModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedClass(null); }}
        classData={selectedClass}
        schoolId={schoolId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {classToDelete?.name}? This action cannot be undone.
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
