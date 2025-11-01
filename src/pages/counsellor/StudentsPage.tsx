import { useState } from 'react';
import { Plus, Eye, AlertTriangle, User, FileText, Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { StatCard } from '@/components/shared/StatCard';
import { mockStudents } from '@/data/mockData';
import { Student } from '@/types';
import { getRiskLevelColor, formatRiskLevel } from '@/lib/utils';

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);


  const getConsentColor = (status: string) => {
    switch (status) {
      case 'granted':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'denied':
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
            {student.wellbeingScore || 'N/A'}
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedStudent(null)}
              className="mb-2"
            >
              ← Back to Students
            </Button>
            <h1 className="text-3xl font-semibold text-foreground">
              {selectedStudent.name}
            </h1>
            <p className="text-muted-foreground">
              Grade {selectedStudent.grade} • {selectedStudent.class}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className={getRiskLevelColor(selectedStudent.riskLevel)}>
              {formatRiskLevel(selectedStudent.riskLevel)} risk
            </Badge>
            <Badge className={getConsentColor(selectedStudent.consentStatus)} variant="secondary">
              {selectedStudent.consentStatus}
            </Badge>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Student ID:</span>
                    <p className="text-muted-foreground">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p className="text-muted-foreground">
                      {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Parent Contact:</span>
                    <p className="text-muted-foreground">{selectedStudent.parentContact || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Wellbeing Score:</span>
                    <p className={`font-medium ${
                      selectedStudent.wellbeingScore && selectedStudent.wellbeingScore >= 80 ? 'text-success' :
                      selectedStudent.wellbeingScore && selectedStudent.wellbeingScore >= 60 ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {selectedStudent.wellbeingScore || 'Not assessed'}%
                    </p>
                  </div>
                </div>
                
                {selectedStudent.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground mt-1">{selectedStudent.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>Recent assessments and wellbeing checks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Assessment history will be displayed here.</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Case History</CardTitle>
                <CardDescription>Related cases and interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Case history will be displayed here.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Case
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Assign Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Parent
                </Button>
                {/* <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button> */}
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Social Anxiety</Badge>
                  <Badge variant="outline" className="mr-2">Academic Stress</Badge>
                  <Badge variant="outline" className="mr-2">Peer Issues</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
          value={mockStudents.length}
          icon={User}
          subtitle="In your care"
        />
        
        <StatCard
          title="High Risk"
          value={mockStudents.filter(s => s.riskLevel === 'high').length}
          icon={AlertTriangle}
          variant="destructive"
          subtitle="Require attention"
        />
        
        <StatCard
          title="Pending Consent"
          value={mockStudents.filter(s => s.consentStatus === 'pending').length}
          icon={FileText}
          variant="warning"
          subtitle="Awaiting approval"
        />
        
        <StatCard
          title="Avg Wellbeing"
          value={`${Math.round(
            mockStudents
              .filter(s => s.wellbeingScore)
              .reduce((acc, s) => acc + (s.wellbeingScore || 0), 0) /
            mockStudents.filter(s => s.wellbeingScore).length
          )}%`}
          icon={User}
          variant="success"
          subtitle="This month"
        />
      </div>

      {/* Students Table */}
      <DataTable
        data={mockStudents}
        columns={studentColumns}
        title="All Students"
        searchPlaceholder="Search students..."
        onRowClick={setSelectedStudent}
        actions={studentActions}
      />
    </div>
  );
}