import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Search, GraduationCap } from 'lucide-react';
import { useParents, useDeleteParent, useStudents } from '@/hooks/useOnboarding';
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

interface ParentsOnboardingProps {
  schoolId: string;
}

export default function ParentsOnboarding({ schoolId }: ParentsOnboardingProps) {
  const { data: parents, isLoading } = useParents(schoolId);
  const { data: students } = useStudents(schoolId);
  const deleteParent = useDeleteParent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const studentsList = (students || []) as any[];

  const handleEdit = (parent: any) => {
    setSelectedParent(parent);
    setIsModalOpen(true);
  };

  const handleDelete = (parent: any) => {
    setParentToDelete(parent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (parentToDelete) {
      deleteParent.mutate(parentToDelete.user_id);
      setDeleteDialogOpen(false);
      setParentToDelete(null);
    }
  };

  const parentsList = parents || [];

  // Filter parents based on search query
  const filteredParents = useMemo(() => {
    if (!searchQuery.trim()) return parentsList;
    
    const query = searchQuery.toLowerCase();
    return parentsList.filter((parent: any) => 
      parent.display_name?.toLowerCase().includes(query) ||
      parent.email?.toLowerCase().includes(query) ||
      parent.phone?.includes(query)
    );
  }, [parentsList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const paginatedParents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParents.slice(startIndex, endIndex);
  }, [filteredParents, currentPage, itemsPerPage]);

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
          <CardTitle>Parents & Guardians</CardTitle>
          <Button onClick={() => { setSelectedParent(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Parent
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
          ) : filteredParents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No parents found matching your search.' : 'No parents found. Add your first parent to get started.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Connected Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedParents.map((parent: any) => {
                  // Find students connected to this parent
                  const connectedStudents = studentsList.filter((student: any) => 
                    student.parents_id && Array.isArray(student.parents_id) && 
                    student.parents_id.includes(parent.user_id)
                  );

                  return (
                  <TableRow key={parent.user_id}>
                    <TableCell className="font-medium">{parent.display_name}</TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>{parent.phone || '-'}</TableCell>
                    <TableCell>
                      {connectedStudents.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {connectedStudents.map((student: any) => (
                            <Badge 
                              key={student.student_id} 
                              variant="outline" 
                              className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1"
                            >
                              <GraduationCap className="w-3 h-3" />
                              {student.first_name} {student.last_name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No students linked</span>
                      )}
                    </TableCell>
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
                          onClick={() => handleEdit(parent)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(parent)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination Controls */}
          {filteredParents.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredParents.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemLabel="parents"
            />
          )}
        </CardContent>
      </Card>

      <UserFormModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedParent(null); }}
        user={selectedParent}
        role="parent"
        schoolId={schoolId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Parent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {parentToDelete?.display_name}? This action cannot be undone.
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
