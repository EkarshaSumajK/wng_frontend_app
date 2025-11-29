import { useState, useMemo } from 'react';
import { Eye, Clock, Target, BookOpen, Filter, Sparkles, Users, TrendingUp, Search, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useAssignActivity } from '@/hooks/useActivityAssignments';
import { useClasses } from '@/hooks/useClasses';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useActivities } from '@/hooks/useActivities';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const activityTypeLabels: Record<string, string> = {
  PHYSICAL_DEVELOPMENT: 'Physical Development',
  COGNITIVE_DEVELOPMENT: 'Cognitive Development',
  SOCIAL_EMOTIONAL_DEVELOPMENT: 'Social & Emotional',
  LANGUAGE_COMMUNICATION_DEVELOPMENT: 'Language & Communication',
};

const activityTypeColors: Record<string, string> = {
  PHYSICAL_DEVELOPMENT: 'bg-blue-100 text-blue-800 border-blue-200',
  COGNITIVE_DEVELOPMENT: 'bg-purple-100 text-purple-800 border-purple-200',
  SOCIAL_EMOTIONAL_DEVELOPMENT: 'bg-green-100 text-green-800 border-green-200',
  LANGUAGE_COMMUNICATION_DEVELOPMENT: 'bg-orange-100 text-orange-800 border-orange-200',
};

const diagnosisLabels: Record<string, string> = {
  VISUAL_IMPAIRMENT: 'Visual Impairment',
  HEARING_IMPAIRMENT: 'Hearing Impairment',
  INTELLECTUAL_DISABILITIES: 'Intellectual Disabilities',
  LEARNING_DISABILITIES: 'Learning Disabilities',
  ANXIETY_DISORDERS: 'Anxiety Disorders',
  DEPRESSION: 'Depression',
  ADHD: 'ADHD',
  TRAUMA_PTSD: 'Trauma & PTSD',
  AUTISM_SPECTRUM_DISORDER: 'Autism Spectrum',
};

const diagnosisColors: Record<string, string> = {
  VISUAL_IMPAIRMENT: 'bg-blue-100 text-blue-800 border-blue-200',
  HEARING_IMPAIRMENT: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  INTELLECTUAL_DISABILITIES: 'bg-purple-100 text-purple-800 border-purple-200',
  LEARNING_DISABILITIES: 'bg-pink-100 text-pink-800 border-pink-200',
  ANXIETY_DISORDERS: 'bg-orange-100 text-orange-800 border-orange-200',
  DEPRESSION: 'bg-gray-100 text-gray-800 border-gray-200',
  ADHD: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  TRAUMA_PTSD: 'bg-red-100 text-red-800 border-red-200',
  AUTISM_SPECTRUM_DISORDER: 'bg-teal-100 text-teal-800 border-teal-200',
};

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Assignment Dialog State
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const { data: classes = [] } = useClasses({ 
    school_id: user?.school_id,
    teacher_id: user?.id 
  });
  const assignActivityMutation = useAssignActivity();

  const handleAssign = async () => {
    if (!selectedActivity || !selectedClassId) {
      toast.error('Please select a class');
      return;
    }
    
    try {
      await assignActivityMutation.mutateAsync({
        activityId: selectedActivity.activity_id,
        classId: selectedClassId,
        dueDate: dueDate?.toISOString()
      });
      toast.success('Activity assigned successfully');
      setIsAssignDialogOpen(false);
      setSelectedActivity(null); // Close main dialog too
      // Optional: Navigate to monitoring
      // window.location.href = '/teacher/activity-monitoring';
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign activity');
    }
  };

  const { data: activities = [], isLoading } = useActivities({
    school_id: user?.school_id,
  });

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const matchesSearch = activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(activity.type);
      const matchesGrade = !selectedGrade || (activity.target_grades && activity.target_grades.includes(selectedGrade));
      const matchesDiagnosis = !selectedDiagnosis || (activity.diagnosis && activity.diagnosis.includes(selectedDiagnosis));
      return matchesSearch && matchesType && matchesGrade && matchesDiagnosis;
    });
  }, [activities, searchQuery, selectedTypes, selectedGrade, selectedDiagnosis]);

  const uniqueTypes = useMemo(() => Object.keys(activityTypeLabels), []);

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

      {/* Main Content Area */}
      {!selectedGrade && !selectedDiagnosis ? (
        <div className="space-y-12">
          {/* Grade Wise Activities Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-3xl -z-10" />
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-primary/10 shadow-xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Grade Wise Activities</h2>
                    <p className="text-sm text-muted-foreground mt-1">Select a grade to explore activities</p>
                  </div>
                </div>
              </div>
              
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <CarouselItem key={grade} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                      <Card 
                        className="cursor-pointer transition-colors duration-300 hover:border-primary border-2 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                        onClick={() => setSelectedGrade(grade.toString())}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6 aspect-square relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-5xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-2 transition-transform relative z-10">{grade}</span>
                          <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors relative z-10">Grade</span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-primary/20 bg-white/95 w-12 h-12" />
                <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-primary/20 bg-white/95 w-12 h-12" />
              </Carousel>
            </div>
          </section>

          {/* Special Diagnosis Cases Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/3 to-transparent rounded-3xl -z-10" />
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200/50 shadow-xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-900 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">Special Diagnosis Cases</h2>
                    <p className="text-sm text-muted-foreground mt-1">Tailored activities for specific needs</p>
                  </div>
                </div>
              </div>
              
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {Object.entries(diagnosisLabels).map(([key, label]) => (
                    <CarouselItem key={key} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card 
                        className="cursor-pointer transition-colors duration-300 hover:border-purple-500 border-2 group bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20"
                        onClick={() => setSelectedDiagnosis(key)}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6 aspect-square text-center relative">
                          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${diagnosisColors[key]?.split(' ')[0] || 'bg-gray-50'}`} />
                          <Badge className={`mb-4 text-sm px-4 py-1.5 ${diagnosisColors[key] || 'bg-gray-100 text-gray-800'} pointer-events-none relative z-10 transition-transform shadow-md`}>
                            {label}
                          </Badge>
                          <p className="text-sm font-medium text-muted-foreground relative z-10 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View activities
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-purple-300/50 bg-white/95 w-12 h-12" />
                <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-purple-300/50 bg-white/95 w-12 h-12" />
              </Carousel>
            </div>
          </section>
        </div>
      ) : (
        /* Detailed View */
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedGrade(null);
                setSelectedDiagnosis(null);
                setSearchQuery("");
              }}
              className="group hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Categories
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedGrade ? `Grade ${selectedGrade} Activities` : 
               selectedDiagnosis ? `${diagnosisLabels[selectedDiagnosis]} Activities` : ''}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {filteredActivities.length} Activities
            </Badge>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-white border-gray-200 focus:border-primary rounded-xl"
                />
              </div>

              {/* Activity Type Filter */}
              <div className="w-full md:w-56">
                <Select
                  value={selectedTypes.length > 0 ? selectedTypes[0] : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedTypes([]);
                    } else {
                      setSelectedTypes([value]);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(activityTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedTypes.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTypes([]);
                  }}
                  className="h-10 px-4 rounded-xl"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

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
                      No activities found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Activity</DialogTitle>
            <DialogDescription>
              Assign "{selectedActivity?.title}" to a class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls: any) => (
                    <SelectItem key={cls.class_id} value={cls.class_id}>
                      {cls.name || `Grade ${cls.grade}-${cls.section}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={assignActivityMutation.isPending}>
              {assignActivityMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
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
              </div>

              {/* Right Column - Instructions Flashcards */}
              <div className="space-y-6">
                {selectedActivity.instructions && selectedActivity.instructions.length > 0 && (
                  <Card className="border-2">
                    <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                      <CardTitle className="text-base">Step-by-Step Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full"
                      >
                        <CarouselContent>
                          {selectedActivity.instructions.map((instruction: string, idx: number) => (
                            <CarouselItem key={idx}>
                              <div className="p-1">
                                <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-gray-800 dark:to-primary/10">
                                  <CardContent className="flex flex-col items-center justify-center p-8 min-h-[280px] text-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg mb-6">
                                      <span className="text-2xl font-bold text-white">
                                        {idx + 1}
                                      </span>
                                    </div>
                                    <p className="text-base text-foreground leading-relaxed">
                                      {instruction}
                                    </p>
                                    <div className="mt-6 text-xs text-muted-foreground">
                                      Step {idx + 1} of {selectedActivity.instructions.length}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0 -translate-x-12" />
                        <CarouselNext className="right-0 translate-x-12" />
                      </Carousel>
                    </CardContent>
                  </Card>
                )}
                {/* Assign to Class Button */}
                <div className="mt-6 pt-6 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsAssignDialogOpen(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Assign to Class
                  </Button>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
