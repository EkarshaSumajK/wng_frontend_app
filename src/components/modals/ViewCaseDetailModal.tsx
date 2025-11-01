import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, Clock, FileText, Target, User, Users, Phone, Mail, UserCircle } from "lucide-react";
import { useSessionNotes } from "@/hooks/useSessionNotes";
import { useGoals } from "@/hooks/useGoals";
import { format } from "date-fns";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

interface ViewCaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
}

export function ViewCaseDetailModal({ isOpen, onClose, caseData }: ViewCaseDetailModalProps) {
  const { data: sessionNotes = [] } = useSessionNotes(caseData?.case_id);
  const { data: goals = [] } = useGoals(caseData?.case_id);

  if (!caseData) return null;

  const getRiskColor = (risk: string) => {
    return getRiskLevelColor(risk);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'intake':
        return 'bg-primary text-primary-foreground';
      case 'assessment':
        return 'bg-accent text-accent-foreground';
      case 'intervention':
        return 'bg-warning text-warning-foreground';
      case 'monitoring':
        return 'bg-secondary text-secondary-foreground';
      case 'closed':
        return 'bg-success text-success-foreground';
      case 'monitoring':
        return 'bg-yellow-500 text-white';
      case 'closed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in_progress':
        return 'bg-primary text-primary-foreground';
      case 'not_started':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            Case Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Case Overview</span>
                <div className="flex gap-2">
                  <Badge className={getRiskColor(caseData.risk_level)}>
                    {formatRiskLevel(caseData.risk_level)}
                  </Badge>
                  <Badge className={getStatusColor(caseData.status)}>
                    {caseData.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="w-4 h-4" />
                    <span>Student</span>
                  </div>
                  <p className="font-medium">{caseData.student?.name || 'Unknown'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span>Assigned Counsellor</span>
                  </div>
                  <p className="font-medium">{caseData.assigned_counsellor || 'Unassigned'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created Date</span>
                  </div>
                  <p className="font-medium">
                    {caseData.created_at ? format(new Date(caseData.created_at), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Days Open</span>
                  </div>
                  <p className="font-medium">{caseData.days_open || 0} days</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Tags Section */}
                {caseData.tags && caseData.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {caseData.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parent Contact - Show prominently for High/Critical Risk */}
                {caseData.parents && caseData.parents.length > 0 && 
                 (caseData.risk_level?.toLowerCase() === 'high' || caseData.risk_level?.toLowerCase() === 'critical') && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <UserCircle className="w-4 h-4" />
                      Emergency Contact
                    </p>
                    <div className="space-y-2">
                      {caseData.parents
                        .sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
                        .slice(0, 1)
                        .map((parent: any, index: number) => (
                          <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{parent.name || 'Parent/Guardian'}</span>
                              {parent.relationship && (
                                <Badge variant="outline" className="text-xs">{parent.relationship}</Badge>
                              )}
                            </div>
                            
                            {parent.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                <a href={`tel:${parent.phone}`} className="text-primary hover:underline font-medium">
                                  {parent.phone}
                                </a>
                              </div>
                            )}
                            
                            {parent.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                <a href={`mailto:${parent.email}`} className="text-primary hover:underline text-xs">
                                  {parent.email}
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Full Parent/Guardian Information - Always show below for all cases */}
          {caseData.parents && caseData.parents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  All Parent/Guardian Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {caseData.parents.map((parent: any, index: number) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{parent.name || 'Parent/Guardian'}</h4>
                        {parent.relationship && (
                          <Badge variant="outline">{parent.relationship}</Badge>
                        )}
                      </div>
                      
                      {parent.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${parent.phone}`} className="text-primary hover:underline">
                            {parent.phone}
                          </a>
                        </div>
                      )}
                      
                      {parent.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${parent.email}`} className="text-primary hover:underline">
                            {parent.email}
                          </a>
                        </div>
                      )}
                      
                      {parent.is_primary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary Contact
                        </Badge>
                      )}
                      
                      {parent.consent_given !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          Consent: {parent.consent_given ? '✓ Given' : '✗ Not Given'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs for Details */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">
                <FileText className="w-4 h-4 mr-2" />
                Session Notes ({sessionNotes.length})
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Target className="w-4 h-4 mr-2" />
                Goals ({goals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-3">
              {sessionNotes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No session notes recorded</p>
                  </CardContent>
                </Card>
              ) : (
                sessionNotes.map((note: any) => (
                  <Card key={note.session_note_id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {note.type ? note.type.replace('_', ' ').toUpperCase() : 'Session'}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {note.date ? format(new Date(note.date), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                      </div>
                      {note.duration && (
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {note.duration} minutes
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {note.summary && (
                        <div>
                          <p className="text-sm font-medium mb-1">Summary</p>
                          <p className="text-sm text-muted-foreground">{note.summary}</p>
                        </div>
                      )}
                      {note.interventions && (
                        <div>
                          <p className="text-sm font-medium mb-1">Interventions</p>
                          <p className="text-sm text-muted-foreground">{note.interventions}</p>
                        </div>
                      )}
                      {note.next_steps && (
                        <div>
                          <p className="text-sm font-medium mb-1">Next Steps</p>
                          <p className="text-sm text-muted-foreground">{note.next_steps}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="goals" className="space-y-3">
              {goals.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No goals set</p>
                  </CardContent>
                </Card>
              ) : (
                goals.map((goal: any) => (
                  <Card key={goal.goal_id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        <Badge className={getGoalStatusColor(goal.status)}>
                          {goal.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      {goal.target_date && (
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Target: {format(new Date(goal.target_date), 'MMM dd, yyyy')}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                      {goal.progress !== undefined && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
