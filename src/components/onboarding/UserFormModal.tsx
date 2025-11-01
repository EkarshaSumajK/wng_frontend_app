import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  useCreateTeacher,
  useUpdateTeacher,
  useCreateCounsellor,
  useUpdateCounsellor,
  useCreateSchoolAdmin,
  useUpdateSchoolAdmin,
  useCreateParent,
  useUpdateParent,
} from '@/hooks/useOnboarding';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  role: 'teacher' | 'counsellor' | 'school_admin' | 'parent';
  schoolId: string;
}

export default function UserFormModal({ open, onClose, user, role, schoolId }: UserFormModalProps) {
  const isEdit = !!user;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const createCounsellor = useCreateCounsellor();
  const updateCounsellor = useUpdateCounsellor();
  const createAdmin = useCreateSchoolAdmin();
  const updateAdmin = useUpdateSchoolAdmin();
  const createParent = useCreateParent();
  const updateParent = useUpdateParent();

  useEffect(() => {
    if (user) {
      reset({
        display_name: user.display_name,
        email: user.email,
        phone: user.phone || '',
      });
    } else {
      reset({
        display_name: '',
        email: '',
        phone: '',
        password: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      school_id: schoolId,
      role,
    };

    try {
      if (isEdit) {
        const userId = user.user_id;
        const updateData = {
          display_name: data.display_name,
          phone: data.phone,
        };

        switch (role) {
          case 'teacher':
            await updateTeacher.mutateAsync({ id: userId, data: updateData });
            break;
          case 'counsellor':
            await updateCounsellor.mutateAsync({ id: userId, data: updateData });
            break;
          case 'school_admin':
            await updateAdmin.mutateAsync({ id: userId, data: updateData });
            break;
          case 'parent':
            await updateParent.mutateAsync({ id: userId, data: updateData });
            break;
        }
      } else {
        switch (role) {
          case 'teacher':
            await createTeacher.mutateAsync(payload);
            break;
          case 'counsellor':
            await createCounsellor.mutateAsync(payload);
            break;
          case 'school_admin':
            await createAdmin.mutateAsync(payload);
            break;
          case 'parent':
            await createParent.mutateAsync(payload);
            break;
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const isLoading =
    createTeacher.isPending ||
    updateTeacher.isPending ||
    createCounsellor.isPending ||
    updateCounsellor.isPending ||
    createAdmin.isPending ||
    updateAdmin.isPending ||
    createParent.isPending ||
    updateParent.isPending;

  const roleLabels = {
    teacher: 'Teacher',
    counsellor: 'Counsellor',
    school_admin: 'School Admin',
    parent: 'Parent',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${roleLabels[role]}` : `Add New ${roleLabels[role]}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Full Name *</Label>
            <Input
              id="display_name"
              {...register('display_name', { required: 'Name is required' })}
              placeholder="Enter full name"
            />
            {errors.display_name && (
              <p className="text-sm text-destructive">{errors.display_name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: !isEdit ? 'Email is required' : false,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="email@example.com"
              disabled={isEdit}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message as string}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
