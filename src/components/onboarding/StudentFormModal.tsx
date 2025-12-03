import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useCreateStudent, useUpdateStudent, useClasses } from '@/hooks/useOnboarding';

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  student: any;
  schoolId: string;
}

export default function StudentFormModal({ open, onClose, student, schoolId }: StudentFormModalProps) {
  const isEdit = !!student;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      class_id: '',
      parent_name: '',
      parent_email: '',
      parent_phone: '',
    }
  });
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const { data: classes } = useClasses(schoolId);

  const gender = watch('gender');
  const classId = watch('class_id');

  useEffect(() => {
    if (student) {
      // Handle date format - API returns 'dob' field
      const dobField = student.dob || student.date_of_birth;
      let dobValue = '';
      if (dobField) {
        // If it contains 'T', split it (ISO datetime format)
        // Otherwise use as-is (already in YYYY-MM-DD format)
        dobValue = dobField.includes('T') 
          ? dobField.split('T')[0] 
          : dobField;
      }
      
      const formData = {
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        date_of_birth: dobValue,
        gender: student.gender?.toLowerCase() || '',
        class_id: student.class_id || '',
        parent_name: student.parent_name || '',
        parent_email: student.parent_email || '',
        parent_phone: student.parent_phone || '',
      };
      reset(formData);
      // Explicitly set gender and class for the Select components
      if (student.gender) {
        setValue('gender', student.gender.toLowerCase());
      }
      if (student.class_id) {
        setValue('class_id', student.class_id);
      }
    } else {
      reset({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        class_id: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
      });
    }
  }, [student, reset, setValue, open]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      school_id: schoolId,
      // Convert gender to uppercase for backend
      gender: data.gender ? data.gender.toUpperCase() : null,
      // Convert empty string to null for class_id
      class_id: data.class_id && data.class_id !== '' ? data.class_id : null,
      // Convert empty strings to null for optional parent fields
      parent_name: data.parent_name || null,
      parent_email: data.parent_email || null,
      parent_phone: data.parent_phone || null,
    };

    try {
      if (isEdit) {
        await updateStudent.mutateAsync({
          id: student.student_id,
          data: payload,
        });
      } else {
        await createStudent.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const isLoading = createStudent.isPending || updateStudent.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register('first_name', { required: 'First name is required' })}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register('last_name', { required: 'Last name is required' })}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth', { required: 'Date of birth is required' })}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-destructive">{errors.date_of_birth.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={gender || ''}
                onValueChange={(value) => {
                  setValue('gender', value, { shouldValidate: true });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('gender', { required: 'Gender is required' })} />
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_id">Assign to Class (Optional)</Label>
            <Select
              value={classId || 'none'}
              onValueChange={(value) => {
                setValue('class_id', value === 'none' ? '' : value, { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No class assigned</SelectItem>
                {((classes || []) as any[]).map((classItem: any) => (
                  <SelectItem key={classItem.class_id} value={classItem.class_id}>
                    {classItem.name} - Grade {classItem.grade} {classItem.section ? `(${classItem.section})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('class_id')} />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Parent/Guardian Information</h3>
            <p className="text-xs text-muted-foreground mb-3">
              If the parent account doesn't exist yet, enter their details below and a parent account will be automatically created and linked.
            </p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="parent_name">Parent/Guardian Name</Label>
                <Input
                  id="parent_name"
                  {...register('parent_name')}
                  placeholder="Mary Smith"
                />
                <p className="text-xs text-muted-foreground">Full name of the parent/guardian</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_email">Parent/Guardian Email</Label>
                <Input
                  id="parent_email"
                  type="email"
                  {...register('parent_email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="mary.smith@example.com"
                />
                {errors.parent_email && (
                  <p className="text-sm text-destructive">{errors.parent_email.message as string}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  If this email exists, student will be linked to that parent. Otherwise, a new parent account will be created.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_phone">Parent/Guardian Phone</Label>
                <Input
                  id="parent_phone"
                  type="tel"
                  {...register('parent_phone')}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
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
