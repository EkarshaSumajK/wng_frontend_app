import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useCreateClass, useUpdateClass, useTeachers } from '@/hooks/useOnboarding';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClassFormModalProps {
  open: boolean;
  onClose: () => void;
  classData: any;
  schoolId: string;
}

export default function ClassFormModal({ open, onClose, classData, schoolId }: ClassFormModalProps) {
  const isEdit = !!classData;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      grade: '',
      section: '',
      capacity: '',
      academic_year: '',
      teacher_id: '',
    }
  });
  
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const { data: teachers } = useTeachers(schoolId);
  
  const teacherId = watch('teacher_id');

  useEffect(() => {
    if (classData) {
      reset({
        name: classData.name || '',
        grade: classData.grade || '',
        section: classData.section || '',
        capacity: classData.capacity?.toString() || '',
        academic_year: classData.academic_year || '',
        teacher_id: classData.teacher_id || '',
      });
      if (classData.teacher_id) {
        setValue('teacher_id', classData.teacher_id);
      }
    } else {
      reset({
        name: '',
        grade: '',
        section: '',
        capacity: '',
        academic_year: new Date().getFullYear().toString(),
        teacher_id: '',
      });
    }
  }, [classData, reset, setValue, open]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      school_id: schoolId,
      capacity: data.capacity ? parseInt(data.capacity) : null,
      teacher_id: data.teacher_id || null,
    };

    try {
      if (isEdit) {
        await updateClass.mutateAsync({
          id: classData.class_id,
          data: payload,
        });
      } else {
        await createClass.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const isLoading = createClass.isPending || updateClass.isPending;
  const teachersList = teachers || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Class' : 'Add New Class'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Class name is required' })}
              placeholder="e.g., Mathematics 5A"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Input
                id="grade"
                {...register('grade', { required: 'Grade is required' })}
                placeholder="e.g., 5, 10, 12"
              />
              {errors.grade && (
                <p className="text-sm text-destructive">{errors.grade.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                {...register('section')}
                placeholder="e.g., A, B, C"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity')}
                placeholder="e.g., 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year</Label>
              <Input
                id="academic_year"
                {...register('academic_year')}
                placeholder="e.g., 2024-2025"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher_id">Assigned Teacher (Optional)</Label>
            <Select
              value={teacherId || 'none'}
              onValueChange={(value) => {
                setValue('teacher_id', value === 'none' ? '' : value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No teacher assigned</SelectItem>
                {teachersList.map((teacher: any) => (
                  <SelectItem key={teacher.user_id} value={teacher.user_id}>
                    {teacher.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('teacher_id')} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner size="sm" className="mr-2" />}
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
