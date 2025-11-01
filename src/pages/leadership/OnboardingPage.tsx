import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users, GraduationCap, Shield, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TeachersOnboarding from '@/components/onboarding/TeachersOnboarding';
import CounsellorsOnboarding from '@/components/onboarding/CounsellorsOnboarding';
import SchoolAdminsOnboarding from '@/components/onboarding/SchoolAdminsOnboarding';
import ParentsOnboarding from '@/components/onboarding/ParentsOnboarding';
import StudentsOnboarding from '@/components/onboarding/StudentsOnboarding';
import ClassesOnboarding from '@/components/onboarding/ClassesOnboarding';

export default function OnboardingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teachers');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">User Onboarding</h1>
          <p className="text-muted-foreground">Manage teachers, counsellors, admins, parents, and students</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="counsellors" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Counsellors
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Admins
          </TabsTrigger>
          <TabsTrigger value="parents" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Parents
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Classes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <TeachersOnboarding schoolId={user?.school_id || ''} />
        </TabsContent>

        <TabsContent value="counsellors">
          <CounsellorsOnboarding schoolId={user?.school_id || ''} />
        </TabsContent>

        <TabsContent value="admins">
          <SchoolAdminsOnboarding schoolId={user?.school_id || ''} />
        </TabsContent>

        <TabsContent value="parents">
          <ParentsOnboarding schoolId={user?.school_id || ''} />
        </TabsContent>

        <TabsContent value="students">
          <StudentsOnboarding schoolId={user?.school_id || ''} />
        </TabsContent>

        <TabsContent value="classes">
          <ClassesOnboarding schoolId={user?.school_id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
