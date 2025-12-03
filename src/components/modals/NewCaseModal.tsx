import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useCounsellors } from '@/hooks/useCounsellors';
import { useAuth } from '@/contexts/AuthContext';

interface NewCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (caseData: any) => void;
  initialStudentId?: string;
  isLoading?: boolean;
}

export function NewCaseModal({ open, onOpenChange, onSubmit, initialStudentId, isLoading }: NewCaseModalProps) {
  const { user } = useAuth();
  const { data: studentsData = [], isLoading: loadingStudents } = useStudents({
    school_id: user?.school_id
  });
  const { data: counsellorsData = [], isLoading: loadingCounsellors } = useCounsellors({
    school_id: user?.school_id
  });

  const [formData, setFormData] = useState({
    studentId: initialStudentId || '',
    assignedCounsellor: user?.id || '',
    priority: '',
    summary: '',
    initialNotes: ''
  });

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    grade: '',
    section: ''
  });

  // Get unique grades and sections from students
  const { grades, sections } = useMemo(() => {
    const gradesSet = new Set<string>();
    const sectionsSet = new Set<string>();
    
    studentsData.forEach((student: any) => {
      if (student.grade) gradesSet.add(student.grade);
      if (student.section) sectionsSet.add(student.section);
    });
    
    return {
      grades: Array.from(gradesSet).sort(),
      sections: Array.from(sectionsSet).sort()
    };
  }, [studentsData]);

  // Filter students based on search criteria
  const filteredStudents = useMemo(() => {
    return studentsData.filter((student: any) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const matchesName = !filters.name || fullName.includes(filters.name.toLowerCase());
      const matchesGrade = !filters.grade || filters.grade === 'all' || student.grade === filters.grade;
      const matchesSection = !filters.section || filters.section === 'all' || student.section === filters.section;
      
      return matchesName && matchesGrade && matchesSection;
    });
  }, [studentsData, filters]);

  const clearFilters = () => {
    setFilters({
      name: '',
      grade: '',
      section: ''
    });
  };

  // Update studentId when initialStudentId changes
  useEffect(() => {
    if (initialStudentId && open) {
      setFormData(prev => ({
        ...prev,
        studentId: initialStudentId
      }));
    }
  }, [initialStudentId, open]);

  // Check if student is locked (pre-selected from calendar)
  const isStudentLocked = !!initialStudentId;

  // Get the selected student details for display
  const selectedStudent = useMemo(() => {
    if (!formData.studentId) return null;
    return studentsData.find((s: any) => s.student_id === formData.studentId);
  }, [formData.studentId, studentsData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Do not close modal here, let parent handle it on success
    setFormData({
      studentId: '',
      assignedCounsellor: user?.id || '',
      priority: '',
      summary: '',
      initialNotes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Create New Case
          </DialogTitle>
          <DialogDescription className="text-base">
            Create a new student support case. Use filters to quickly find the student.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Student Filters - Enhanced - Only show if student is not locked */}
          {!isStudentLocked && (
          <div className="space-y-3 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <Label className="text-sm font-semibold text-foreground">
                  Find Student
                </Label>
              </div>
              {(filters.name || filters.grade || filters.section) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="filterName" className="text-xs font-medium text-muted-foreground">
                  Student Name
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="filterName"
                    placeholder="Type to search..."
                    value={filters.name}
                    onChange={(e) => setFilters({...filters, name: e.target.value})}
                    className="h-10 pl-9 bg-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filterGrade" className="text-xs font-medium text-muted-foreground">
                  Grade Level
                </Label>
                <Select 
                  value={filters.grade || 'all'} 
                  onValueChange={(value) => setFilters({...filters, grade: value === 'all' ? '' : value})}
                >
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="All grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All grades</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filterSection" className="text-xs font-medium text-muted-foreground">
                  Section
                </Label>
                <Select 
                  value={filters.section || 'all'} 
                  onValueChange={(value) => setFilters({...filters, section: value === 'all' ? '' : value})}
                >
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-primary/10">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  {filteredStudents.length}
                </span>
                {filteredStudents.length === 1 ? 'student' : 'students'} found
                {studentsData.length > filteredStudents.length && (
                  <span className="text-muted-foreground/60">
                    (filtered from {studentsData.length} total)
                  </span>
                )}
              </p>
            </div>
          </div>
          )}

          {/* Student Selection - Enhanced */}
          <div className="space-y-2">
            <Label htmlFor="student" className="text-sm font-semibold flex items-center gap-1">
              {isStudentLocked ? 'Student' : 'Select Student'}
              <span className="text-destructive">*</span>
            </Label>
            {isStudentLocked && selectedStudent ? (
              <div className="h-11 px-4 py-2 bg-muted/50 border-2 border-muted rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                  {(selectedStudent as any).first_name[0]}{(selectedStudent as any).last_name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {(selectedStudent as any).first_name} {(selectedStudent as any).last_name}
                  </div>
                  {(selectedStudent as any).class_name && (
                    <div className="text-xs text-muted-foreground">
                      {(selectedStudent as any).class_name}
                    </div>
                  )}
                  {!(selectedStudent as any).class_name && ((selectedStudent as any).grade || (selectedStudent as any).section) && (
                    <div className="text-xs text-muted-foreground">
                      {(selectedStudent as any).grade && `Grade ${(selectedStudent as any).grade}`}
                      {(selectedStudent as any).section && ` • Section ${(selectedStudent as any).section}`}
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">Pre-selected</Badge>
              </div>
            ) : (
            <Select 
              value={formData.studentId} 
              onValueChange={(value) => setFormData({...formData, studentId: value})}
              required
              disabled={isStudentLocked}
            >
              <SelectTrigger className="h-11 bg-background border-2 hover:border-primary/50 transition-colors">
                <SelectValue placeholder={loadingStudents ? "Loading students..." : "Choose a student from the list"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student: any) => (
                    <SelectItem 
                      key={student.student_id} 
                      value={student.student_id}
                      className="py-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium">
                            {student.first_name} {student.last_name}
                          </div>
                          {student.class_name && (
                            <div className="text-xs text-muted-foreground">
                              {student.class_name}
                            </div>
                          )}
                          {!student.class_name && (student.grade || student.section) && (
                            <div className="text-xs text-muted-foreground">
                              {student.grade && `Grade ${student.grade}`}
                              {student.section && ` • Section ${student.section}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No students found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </SelectContent>
            </Select>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Case Details</span>
            </div>
          </div>
          
          {/* Counsellor and Priority - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedCounsellor" className="text-sm font-semibold">
                Assigned Counsellor
              </Label>
              <Select 
                value={formData.assignedCounsellor} 
                onValueChange={(value) => setFormData({...formData, assignedCounsellor: value})}
              >
                <SelectTrigger className="h-11 bg-background">
                  <SelectValue placeholder={loadingCounsellors ? "Loading..." : "Select counsellor"} />
                </SelectTrigger>
                <SelectContent>
                  {counsellorsData.map((counsellor: any) => (
                    <SelectItem key={counsellor.user_id} value={counsellor.user_id}>
                      {counsellor.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold">
                Priority Level
              </Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger className="h-11 bg-background">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Critical Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-semibold flex items-center gap-1">
              Case Summary
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="summary"
              placeholder="Provide a brief description of the situation, concerns, or reason for creating this case..."
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              required
              rows={4}
              className="resize-none bg-background"
            />
            <p className="text-xs text-muted-foreground">
              {formData.summary.length} characters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialNotes" className="text-sm font-semibold">
              Initial Notes
              <span className="text-xs text-muted-foreground font-normal ml-2">(Optional)</span>
            </Label>
            <Textarea
              id="initialNotes"
              placeholder="Add any additional observations, context, or preliminary notes..."
              value={formData.initialNotes}
              onChange={(e) => setFormData({...formData, initialNotes: e.target.value})}
              rows={3}
              className="resize-none bg-background"
            />
          </div>
          
          </div>
          <DialogFooter className="p-6 pt-2 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:bg-primary-hover flex-1 sm:flex-none"
              disabled={!formData.studentId || !formData.summary || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Case
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}