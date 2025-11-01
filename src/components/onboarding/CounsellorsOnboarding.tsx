import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { useCounsellors, useDeleteCounsellor } from '@/hooks/useOnboarding';
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

interface CounsellorsOnboardingProps {
  schoolId: string;
}

export default function CounsellorsOnboarding({ schoolId }: CounsellorsOnboardingProps) {
  const { data: counsellors, isLoading } = useCounsellors(schoolId);
  const deleteCounsellor = useDeleteCounsellor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [counsellorToDelete, setCounsellorToDelete] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (counsellor: any) => {
    setSelectedCounsellor(counsellor);
    setIsModalOpen(true);
  };

  const handleDelete = (counsellor: any) => {
    setCounsellorToDelete(counsellor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (counsellorToDelete) {
      deleteCounsellor.mutate(counsellorToDelete.user_id);
      setDeleteDialogOpen(false);
      setCounsellorToDelete(null);
    }
  };

  const counsellorsList = counsellors || [];

  // Filter counsellors based on search query
  const filteredCounsellors = useMemo(() => {
    if (!searchQuery.trim()) return counsellorsList;
    
    const query = searchQuery.toLowerCase();
    return counsellorsList.filter((counsellor: any) => 
      counsellor.display_name?.toLowerCase().includes(query) ||
      counsellor.email?.toLowerCase().includes(query) ||
      counsellor.phone?.includes(query)
    );
  }, [counsellorsList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCounsellors.length / itemsPerPage);
  const paginatedCounsellors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCounsellors.slice(startIndex, endIndex);
  }, [filteredCounsellors, currentPage, itemsPerPage]);

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
          <CardTitle>Counsellors</CardTitle>
          <Button onClick={() => { setSelectedCounsellor(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Counsellor
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
          ) : filteredCounsellors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No counsellors found matching your search.' : 'No counsellors found. Add your first counsellor to get started.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCounsellors.map((counsellor: any) => (
                  <TableRow key={counsellor.user_id}>
                    <TableCell className="font-medium">{counsellor.display_name}</TableCell>
                    <TableCell>{counsellor.email}</TableCell>
                    <TableCell>{counsellor.phone || '-'}</TableCell>
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
                          onClick={() => handleEdit(counsellor)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(counsellor)}
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
          {filteredCounsellors.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCounsellors.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemLabel="counsellors"
            />
          )}
        </CardContent>
      </Card>

      <UserFormModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedCounsellor(null); }}
        user={selectedCounsellor}
        role="counsellor"
        schoolId={schoolId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Counsellor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {counsellorToDelete?.display_name}? This action cannot be undone.
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
