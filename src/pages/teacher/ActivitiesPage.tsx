import { useState, useMemo } from 'react';
import { Plus, Eye, Clock, Target, BookOpen, Filter, Sparkles, Users, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FilterSection } from '@/components/shared/FilterSection';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/hooks/useActivities';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const activityTypeLabels: Record<string, string> = {
  MINDFULNESS: 'Mindfulness',
  SOCIAL_SKILLS: 'Social Skills',
  EMOTIONAL_REGULATION: 'Emotional Regulation',
  ACADEMIC_SUPPORT: 'Academic Support',
  TEAM_BUILDING: 'Team Building',
};

const activityTypeColors: Record<string, string> = {
  MINDFULNESS: 'bg-purple-100 text-purple-800 border-purple-200',
  SOCIAL_SKILLS: 'bg-blue-100 text-blue-800 border-blue-200',
  EMOTIONAL_REGULATION: 'bg-green-100 text-green-800 border-green-200',
  ACADEMIC_SUPPORT: 'bg-orange-100 text-orange-800 border-orange-200',
  TEAM_BUILDING: 'bg-pink-100 text-pink-800 border-pink-200',
};

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const { data: activities = [], isLoading } = useActivities({
    school_id: user?.school_id,
  });

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const matchesSearch = activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(activity.type);
      return matchesSearch && matchesType;
    });
  }, [activities, searchQuery, selectedTypes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header with modern design */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Wellbeing Activities
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Browse and use activities for your students</p>
          </div>
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Activities</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Mindfulness</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">
              {activities.filter((a: any) => a.type === 'MINDFULNESS').length}
            </div>
            <p className="text-xs text-muted-foreground">Activities</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Social Skills</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">
              {activities.filter((a: any) => a.type === 'SOCIAL_SKILLS').length}
            </div>
            <p className="text-xs text-muted-foreground">Activities</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Emotional Regulation</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">
              {activities.filter((a: any) => a.type === 'EMOTIONAL_REGULATION').length}
            </div>
            <p className="text-xs text-muted-foreground">Activities</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            </div>
            
            <FilterSection 
              title="Activity Type" 
              options={Object.keys(activityTypeLabels)} 
              selected={selectedTypes} 
              setSelected={setSelectedTypes} 
            />

            <Button 
              variant="outline" 
              className="w-full mt-6 text-gray-500 hover:text-primary border-dashed"
              onClick={() => {
                setSelectedTypes([]);
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white border-gray-200 focus:border-primary rounded-xl"
            />
          </div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity: any, index: number) => (
            <Card
              key={activity.activity_id}
              className="card-professional cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
              onClick={() => setSelectedActivity(activity)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-lg font-bold line-clamp-2">{activity.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${activityTypeColors[activity.type] || 'bg-gray-100 text-gray-800'} font-semibold`}>
                    {activityTypeLabels[activity.type] || activity.type}
                  </Badge>
                  {activity.duration && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.duration} min
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Separator />
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {activity.description || 'No description available'}
                </p>
                
                {activity.target_grades && activity.target_grades.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Target Grades:</p>
                    <div className="flex flex-wrap gap-1">
                      {activity.target_grades.slice(0, 3).map((grade: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          Grade {grade}
                        </Badge>
                      ))}
                      {activity.target_grades.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.target_grades.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary transition-colors">
                  <Eye className="w-3 h-3 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
            ) : (
              <div className="col-span-full">
                <Card className="card-professional shadow-lg">
                  <CardContent className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-base text-muted-foreground font-semibold mb-2">
                      {searchQuery || selectedTypes.length > 0
                        ? 'No activities found'
                        : 'No activities available yet'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || selectedTypes.length > 0
                        ? 'Try adjusting your filters'
                        : 'Activities will appear here once they are added'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{selectedActivity.title}</DialogTitle>
                  <DialogDescription className="mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${activityTypeColors[selectedActivity.type]} font-semibold`}>
                        {activityTypeLabels[selectedActivity.type]}
                      </Badge>
                      {selectedActivity.duration && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedActivity.duration} minutes
                        </Badge>
                      )}
                    </div>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4 animate-in fade-in duration-500">
              {/* Description */}
              {selectedActivity.description && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedActivity.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Objectives */}
              {selectedActivity.objectives && selectedActivity.objectives.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {selectedActivity.objectives.map((obj: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                          </span>
                          <span className="text-sm text-muted-foreground flex-1">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Target Grades */}
              {selectedActivity.target_grades && selectedActivity.target_grades.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Target Grades</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.target_grades.map((grade: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                          Grade {grade}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Materials */}
              {selectedActivity.materials && selectedActivity.materials.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Materials Needed</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {selectedActivity.materials.map((material: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground flex-1">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              {selectedActivity.instructions && selectedActivity.instructions.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ol className="space-y-3">
                      {selectedActivity.instructions.map((instruction: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-sm font-bold text-white">{idx + 1}</span>
                          </span>
                          <span className="text-sm text-muted-foreground flex-1 pt-1">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
