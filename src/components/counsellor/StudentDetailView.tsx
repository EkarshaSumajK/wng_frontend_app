import { useState } from 'react';
import { Plus, FileText, Calendar, Phone, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student } from '@/types';
import { getRiskLevelColor, formatRiskLevel } from '@/lib/utils';
import { StudentAnalyticsDashboard } from '@/components/shared/StudentAnalyticsDashboard';

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
}

export function StudentDetailView({ student, onBack }: StudentDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-2"
          >
            ← Back to Students
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">
            {student.name}
          </h1>
          <p className="text-muted-foreground">
            Grade {student.grade} • {student.class}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getRiskLevelColor(student.riskLevel)}>
            {formatRiskLevel(student.riskLevel)} risk
          </Badge>
          <Badge className={getConsentColor(student.consentStatus)} variant="secondary">
            {student.consentStatus}
          </Badge>
        </div>
      </div>

      {/* Tabs for Overview and Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                      <p className="text-muted-foreground">{student.id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date of Birth:</span>
                      <p className="text-muted-foreground">
                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Parent Contact:</span>
                      <p className="text-muted-foreground">{student.parentContact || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Wellbeing Score:</span>
                      <p className={`font-medium ${
                        student.wellbeingScore && student.wellbeingScore >= 80 ? 'text-success' :
                        student.wellbeingScore && student.wellbeingScore >= 60 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {student.wellbeingScore || 0}%
                      </p>
                    </div>
                  </div>
                  
                  {student.notes && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="text-muted-foreground mt-1">{student.notes}</p>
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
        </TabsContent>

        <TabsContent value="analytics">
          <StudentAnalyticsDashboard studentId={student.id} studentName={student.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
