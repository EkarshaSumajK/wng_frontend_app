import { useState } from 'react';
import { Plus, Eye, Clock, Target, BookOpen, Filter, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities, useDeleteActivity } from '@/hooks/useActivities';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateActivityModal } from '@/components/modals/CreateActivityModal';

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
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const { data: activities = [], isLoading } = useActivities({
    school_id: user?.school_id,
  });
  const deleteActivity = useDeleteActivity();

  // Filter activities
  const filteredActivities = activities.filter((activity: any) => {
    const matchesSearch = activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this activity?')) {
      deleteActivity.mutate(activityId);
    }
  };

  const handleEdit = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingActivity(activity);
    setShowCreateModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Wellbeing Activities</h1>
          <p className="text-muted-foreground">Create and manage activities for students</p>
        </div>
        <Button onClick={() => {
          setEditingActivity(null);
          setShowCreateModal(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Activity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>

        {Object.entries(activityTypeLabels).slice(0, 3).map(([type, label]) => {
          const count = activities.filter((a: any) => a.type === type).length;
          return (
            <Card key={type} className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">Activities</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="card-professional">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(activityTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity: any) => (
            <Card
              key={activity.activity_id}
              className="card-professional cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedActivity(activity)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg line-clamp-2 flex-1">{activity.title}</CardTitle>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEdit(activity, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(activity.activity_id, e)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={activityTypeColors[activity.type] || 'bg-gray-100 text-gray-800'}>
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
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {activity.description || 'No description available'}
                </p>
                
                {activity.target_grades && activity.target_grades.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Target Grades:</p>
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

                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-3 h-3 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="card-professional">
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterType !== 'all'
                    ? 'No activities found matching your filters'
                    : 'No activities created yet'}
                </p>
                {!searchQuery && filterType === 'all' && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Activity
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={activityTypeColors[selectedActivity.type]}>
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
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Description */}
              {selectedActivity.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                </div>
              )}

              {/* Objectives */}
              {selectedActivity.objectives && selectedActivity.objectives.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedActivity.objectives.map((obj: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Grades */}
              {selectedActivity.target_grades && selectedActivity.target_grades.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Target Grades</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.target_grades.map((grade: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        Grade {grade}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {selectedActivity.materials && selectedActivity.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Materials Needed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedActivity.materials.map((material: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">{material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {selectedActivity.instructions && selectedActivity.instructions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedActivity.instructions.map((instruction: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedActivity(null);
                    setEditingActivity(selectedActivity);
                    setShowCreateModal(true);
                  }}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Activity
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this activity?')) {
                      deleteActivity.mutate(selectedActivity.activity_id);
                      setSelectedActivity(null);
                    }
                  }}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Activity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Activity Modal */}
      <CreateActivityModal
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) setEditingActivity(null);
        }}
        activity={editingActivity}
      />
    </div>
  );
}
