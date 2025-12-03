import { useState } from 'react';
import { Plus, Eye, AlertTriangle, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { StatCard } from '@/components/shared/StatCard';
import { Student } from '@/types';
import { getRiskLevelColor, formatRiskLevel } from '@/lib/utils';
import { useStudents } from '@/hooks/useStudents';
import { StudentDetailView } from '@/components/counsellor/StudentDetailView';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { data: students, isLoading, error } = useStudents();

  const getConsentColor = (status: string) => {
    switch (status) {
      case 'GRANTED':
        return 'bg-success text-success-foreground';
      case 'PENDING':
        return 'bg-warning text-warning-foreground';
      case 'DENIED':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const studentColumns = [
    {
      key: 'name',
      label: 'Student',
      render: (student: Student) => (
        <div>
          <p className="font-medium text-foreground">{student.name}</p>
          <p className="text-sm text-muted-foreground">Grade {student.grade} • {student.class}</p>
        </div>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      render: (student: Student) => (
        <Badge className={getRiskLevelColor(student.riskLevel)}>
          {formatRiskLevel(student.riskLevel)}
        </Badge>
      )
    },
    {
      key: 'wellbeingScore',
      label: 'Wellbeing Score',
      render: (student: Student) => (
        <div className="text-center">
          <span className={`font-medium ${
            student.wellbeingScore && student.wellbeingScore >= 80 ? 'text-success' :
            student.wellbeingScore && student.wellbeingScore >= 60 ? 'text-warning' :
            'text-destructive'
          }`}>
            {student.wellbeingScore || 0}
          </span>
          {student.wellbeingScore && <span className="text-muted-foreground">%</span>}
        </div>
      )
    },
    {
      key: 'consentStatus',
      label: 'Consent',
      render: (student: Student) => (
        <Badge className={getConsentColor(student.consentStatus)} variant="secondary">
          {student.consentStatus}
        </Badge>
      )
    },
    {
      key: 'lastAssessment',
      label: 'Last Assessment',
      render: (student: Student) => (
        <span className="text-sm text-muted-foreground">
          {student.lastAssessment ? new Date(student.lastAssessment).toLocaleDateString() : 'None'}
        </span>
      )
    }
  ];

  const studentActions = (student: Student) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedStudent(student)}
      >
        <Eye className="w-3 h-3 mr-1" />
        View
      </Button>
    </div>
  );

  if (selectedStudent) {
    return (
      <StudentDetailView 
        student={selectedStudent} 
        onBack={() => setSelectedStudent(null)} 
      />
    );
  }

  if (isLoading) {
    return <div className="space-y-6">
      <div className="flex justify-between">
        <SkeletonLoader className="h-10 w-48" />
        <SkeletonLoader className="h-10 w-32" />
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-32" />)}
      </div>
      <SkeletonLoader className="h-96" />
    </div>;
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">
      Error loading students. Please try again later.
    </div>;
  }

  const studentList = students || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Student Overview</h1>
          <p className="text-muted-foreground">Monitor and manage student wellbeing profiles</p>
        </div>
        
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={studentList.length}
          icon={User}
          subtitle="In your care"
        />
        
        <StatCard
          title="High Risk"
          value={studentList.filter(s => s.riskLevel === 'HIGH').length}
          icon={AlertTriangle}
          variant="destructive"
          subtitle="Require attention"
        />
        
        <StatCard
          title="Pending Consent"
          value={studentList.filter(s => s.consentStatus === 'PENDING').length}
          icon={FileText}
          variant="warning"
          subtitle="Awaiting approval"
        />
        
        <StatCard
          title="Avg Wellbeing"
          value={`${Math.round(
            studentList
              .filter(s => s.wellbeingScore)
              .reduce((acc, s) => acc + (s.wellbeingScore || 0), 0) /
            (studentList.filter(s => s.wellbeingScore).length || 1)
          )}%`}
          icon={User}
          variant="success"
          subtitle="This month"
        />
      </div>

      {/* Students Table */}
      <DataTable
        data={studentList}
        columns={studentColumns}
        title="All Students"
        searchPlaceholder="Search students..."
        onRowClick={setSelectedStudent}
        actions={studentActions}
      />
    </div>
  );
}