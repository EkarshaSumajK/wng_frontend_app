import { useState, useMemo } from 'react';
import { 
  Eye, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Brain, 
  Target, 
  ArrowLeft,
  GraduationCap,
  Star,
  Timer,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Tag,
  X,
  Users
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

import grade1Img from '../../assets/images/grades/grade-1.png';
import grade2Img from '../../assets/images/grades/grade-2.png';
import grade3Img from '../../assets/images/grades/grade-3.png';
import grade4Img from '../../assets/images/grades/grade-4.png';
import grade5Img from '../../assets/images/grades/grade-5.png';
import grade6Img from '../../assets/images/grades/grade-6.png';
import grade7Img from '../../assets/images/grades/grade-7.png';

import grade8Img from '../../assets/images/grades/grade-8.png';
import grade9Img from '../../assets/images/grades/grade-9.png';
import grade10Img from '../../assets/images/grades/grade-10.png';
import grade11Img from '../../assets/images/grades/grade-11.png';
import grade12Img from '../../assets/images/grades/grade-12.png';

const gradeImages: Record<string, string> = {
  '1': grade1Img,
  '2': grade2Img,
  '3': grade3Img,
  '4': grade4Img,
  '5': grade5Img,
  '6': grade6Img,
  '7': grade7Img,
  '8': grade8Img,
  '9': grade9Img,
  '10': grade10Img,
  '11': grade11Img,
  '12': grade12Img,
};

const diagnosisImages: Record<string, string> = {
  VISUAL_IMPAIRMENT: 'https://picsum.photos/seed/visual-impairment/800/600',
  HEARING_IMPAIRMENT: 'https://picsum.photos/seed/hearing-impairment/800/600',
  INTELLECTUAL_DISABILITIES: 'https://picsum.photos/seed/intellectual-disabilities/800/600',
  LEARNING_DISABILITIES: 'https://picsum.photos/seed/learning-disabilities/800/600',
  ANXIETY_DISORDERS: 'https://picsum.photos/seed/anxiety-disorders/800/600',
  DEPRESSION: 'https://picsum.photos/seed/depression/800/600',
  ADHD: 'https://picsum.photos/seed/adhd/800/600',
  TRAUMA_PTSD: 'https://picsum.photos/seed/trauma-ptsd/800/600',
  AUTISM_SPECTRUM_DISORDER: 'https://picsum.photos/seed/autism-spectrum/800/600',
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [viewAllType, setViewAllType] = useState<'featured' | 'quick_relief' | 'quick_sessions' | 'grades' | 'diagnosis' | 'teamwork' | null>(null);

  const { data: activities = [], isLoading } = useActivities({
    school_id: user?.school_id,
  });

  // Filter activities based on all selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const matchesSearch = !searchQuery || 
        activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(activity.type);
      const matchesGrade = !selectedGrade || activity.target_grades?.includes(selectedGrade);
      const matchesDiagnosis = !selectedDiagnosis || activity.diagnosis?.includes(selectedDiagnosis);
      const matchesLocation = !selectedLocation || activity.location === selectedLocation;
      const matchesRisk = !selectedRiskLevel || activity.risk_level === selectedRiskLevel;
      const matchesSkill = !selectedSkillLevel || activity.skill_level === selectedSkillLevel;
      const matchesTheme = !selectedTheme || activity.theme?.includes(selectedTheme);
      
      let matchesViewAll = true;
      if (viewAllType === 'quick_relief') {
        matchesViewAll = (activity.duration && parseInt(activity.duration) <= 15) || !activity.duration;
      } else if (viewAllType === 'quick_sessions') {
        const dur = activity.duration ? parseInt(activity.duration) : 0;
        matchesViewAll = dur >= 5 && dur <= 10;
      } else if (viewAllType === 'teamwork') {
        matchesViewAll = activity.type === 'SOCIAL_EMOTIONAL_DEVELOPMENT' || 
                         activity.title?.toLowerCase().includes('team') || 
                         activity.description?.toLowerCase().includes('team') ||
                         activity.title?.toLowerCase().includes('group') ||
                         activity.description?.toLowerCase().includes('group');
      }
      // For 'featured', we might want to use the same random logic or a specific flag if available. 
      // Since 'recommendedActivities' is random, we can't easily filter the main list to match it exactly without a stable seed or flag.
      // For now, let's assume 'featured' just shows all for browsing, or we can filter by a 'featured' property if it existed.
      // Let's just show all activities for 'featured' view all, effectively acting as a "Browse All".
      
      
      return matchesSearch && matchesType && matchesGrade && matchesDiagnosis && 
             matchesLocation && matchesRisk && matchesSkill && matchesTheme && matchesViewAll;
    });
  }, [activities, searchQuery, selectedTypes, selectedGrade, selectedDiagnosis, selectedLocation, selectedRiskLevel, selectedSkillLevel, selectedTheme, viewAllType]);

  // Recommended activities (random selection for now, could be smarter)
  const recommendedActivities = useMemo(() => {
    return [...activities].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [activities]);

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
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-secondary to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Wellbeing Activities
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Browse and use activities for your students</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedGrade && !selectedDiagnosis && !searchQuery && !viewAllType && selectedTypes.length === 0 ? (
        <div className="space-y-10">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10 h-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
          </div>

          {/* Featured Section */}
          <section className="space-y-4">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="starGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F59E0B" />
                            <stop offset="1" stopColor="#D97706" />
                          </linearGradient>
                          <filter id="starShadow" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="1"/>
                            <feGaussianBlur stdDeviation="1"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.96 0 0 0 0 0.62 0 0 0 0 0.04 0 0 0 0.4 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                          </filter>
                        </defs>
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#starGradient)" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#starShadow)"/>
                      </svg>
                      Featured
                    </h3>
                    <div className="flex items-center gap-2">
                      <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                      <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                    </div>
                 </div>
                 <Button variant="ghost" className="text-primary" onClick={() => setViewAllType('featured')}>View All</Button>
              </div>
              <CarouselContent className="-ml-4">
                {recommendedActivities.slice(1, 6).map((activity: any, index: number) => (
                  <CarouselItem key={activity.activity_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <div 
                      className="group cursor-pointer space-y-3"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      {/* Thumbnail / App Icon Style */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                        {activity.thumbnail_url ? (
                          <img 
                            src={activity.thumbnail_url} 
                            alt={activity.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                            <span className="text-4xl">✨</span>
                          </div>
                        )}
                        {/* Duration Badge Overlay */}
                        <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {activity.duration ? `${activity.duration} min` : 'Flexible'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary line-clamp-1">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="uppercase tracking-wider text-[10px] font-medium text-primary">
                            {activityTypeLabels[activity.type] || activity.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          {/* Quick Sessions (5-10 min) */}
          <section className="space-y-4">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="2" fill="#DCFCE7"/>
                        <path d="M12 7V12L15 15" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="1" fill="#16A34A"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Quick Sessions (5-10 min)</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                     <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                  </div>
                </div>
                <Button variant="ghost" className="text-primary" onClick={() => setViewAllType('quick_sessions')}>View All</Button>
              </div>
              
              <CarouselContent className="-ml-4">
                {activities
                  .filter((a: any) => {
                    const dur = a.duration ? parseInt(a.duration) : 0;
                    return dur >= 5 && dur <= 10;
                  })
                  .map((activity: any) => (
                  <CarouselItem key={activity.activity_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                     <div 
                       className="group cursor-pointer space-y-3"
                       onClick={() => setSelectedActivity(activity)}
                     >
                       {/* Thumbnail / App Icon Style */}
                       <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                         {activity.thumbnail_url ? (
                           <img 
                             src={activity.thumbnail_url} 
                             alt={activity.title}
                             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                           />
                         ) : (
                           <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                             <span className="text-4xl">🧘</span>
                           </div>
                         )}
                         {/* Duration Badge Overlay */}
                         <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                           {activity.duration} min
                         </div>
                       </div>

                       {/* Content */}
                       <div className="space-y-1">
                         <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">
                           {activity.title}
                         </h3>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <span className="uppercase tracking-wider text-[10px] font-medium text-primary">
                             {activity.type?.replace(/_/g, ' ') || 'ACTIVITY'}
                           </span>
                           <span>•</span>
                           <span>{activity.duration} min</span>
                         </div>
                       </div>
                     </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>



          {/* Grade Wise Activities Section */}
          <section className="space-y-4">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 10V16C22 16 18 19 12 19C6 19 2 16 2 16V10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 10L12 5L2 10L12 15L22 10Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 12V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Browse by Grade</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                     <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                  </div>
                </div>
                <Button variant="ghost" className="text-primary" onClick={() => setViewAllType('grades')}>View All</Button>
              </div>
              
              <CarouselContent className="-ml-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <CarouselItem key={grade} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/5">
                    <div 
                      className="group cursor-pointer space-y-3"
                      onClick={() => setSelectedGrade(grade.toString())}
                    >
                      {/* Thumbnail / App Icon Style */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                        <img 
                          src={gradeImages[grade.toString()]} 
                          alt={`Grade ${grade}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay for text readability if needed, but clean look is preferred. 
                            Maybe just a subtle gradient at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-3xl font-bold block leading-none">{grade}</span>
                          <span className="text-[10px] font-medium uppercase tracking-wider opacity-90">Grade</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">
                          Grade {grade}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          View Activities
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          {/* Teamwork Activities Section */}
          <section className="space-y-4">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Teamwork Activities</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                     <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                  </div>
                </div>
                <Button variant="ghost" className="text-primary" onClick={() => setViewAllType('teamwork')}>View All</Button>
              </div>
              
              <CarouselContent className="-ml-4">
                {activities
                  .filter((a: any) => 
                    a.type === 'SOCIAL_EMOTIONAL_DEVELOPMENT' || 
                    a.title?.toLowerCase().includes('team') || 
                    a.description?.toLowerCase().includes('team') ||
                    a.title?.toLowerCase().includes('group') ||
                    a.description?.toLowerCase().includes('group')
                  )
                  .map((activity: any) => (
                  <CarouselItem key={activity.activity_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                     <div 
                       className="group cursor-pointer space-y-3"
                       onClick={() => setSelectedActivity(activity)}
                     >
                       {/* Thumbnail / App Icon Style */}
                       <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                         {activity.thumbnail_url ? (
                           <img 
                             src={activity.thumbnail_url} 
                             alt={activity.title}
                             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                           />
                         ) : (
                           <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                             <span className="text-4xl">🤝</span>
                           </div>
                         )}
                         {/* Duration Badge Overlay */}
                         <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                           {activity.duration ? `${activity.duration} min` : 'Flexible'}
                         </div>
                       </div>

                       {/* Content */}
                       <div className="space-y-1">
                         <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">
                           {activity.title}
                         </h3>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <span className="uppercase tracking-wider text-[10px] font-medium text-primary">
                             {activity.type?.replace(/_/g, ' ') || 'ACTIVITY'}
                           </span>
                           <span>•</span>
                           <span>{activity.duration} min</span>
                         </div>
                       </div>
                     </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          {/* Special Diagnosis Cases Section */}
          <section className="space-y-4">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 2C9.5 2 9.5 4.5 7.5 5.5C5.5 6.5 4 6 4 6C4 6 2 8 2 11C2 14 4 16 4 16C4 16 5 20 9 21C13 22 15 20 15 20C15 20 18 21 20 19C22 17 22 14 22 14C22 14 20 11 20 9C20 7 21 4 18 3C15 2 14 4 14 4C14 4 12.5 1 9.5 2Z" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 12C12 12 13 14 15 14" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 10C9 10 10 11 11 10" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 8C15 8 16 9 17 8" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Special Diagnosis</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                     <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-white shadow-sm hover:bg-gray-50 border-gray-200" />
                  </div>
                </div>
                <Button variant="ghost" className="text-primary" onClick={() => setViewAllType('diagnosis')}>View All</Button>
              </div>
              
              <CarouselContent className="-ml-4">
                {Object.entries(diagnosisLabels).map(([key, label]) => (
                  <CarouselItem key={key} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <div 
                      className="group cursor-pointer space-y-3"
                      onClick={() => setSelectedDiagnosis(key)}
                    >
                      {/* Thumbnail / App Icon Style */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                        <img 
                          src={diagnosisImages[key]} 
                          alt={label}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Badge Overlay */}
                        <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {label}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">
                          {label}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          View Cases
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
                setViewAllType(null);
                setSelectedTypes([]);
              }}
              className="group hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Browse
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {selectedGrade ? `Grade ${selectedGrade} Activities` : 
               selectedDiagnosis ? `${diagnosisLabels[selectedDiagnosis]} Activities` : 
               viewAllType === 'featured' ? 'Featured Activities' :
               viewAllType === 'quick_relief' ? 'Quick Relief Activities' :
               viewAllType === 'quick_sessions' ? 'Quick Sessions' :
               viewAllType === 'teamwork' ? 'Teamwork Activities' :
               viewAllType === 'grades' ? 'All Grades' :
               viewAllType === 'diagnosis' ? 'All Diagnosis Categories' :
               'Search Results'}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {viewAllType === 'grades' ? '12 Grades' : 
               viewAllType === 'diagnosis' ? `${Object.keys(diagnosisLabels).length} Categories` :
               `${filteredActivities.length} Activities`}
            </Badge>
          </div>

          {/* Content based on View All Type */}
          {viewAllType === 'grades' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                <div 
                  key={grade}
                  className="group cursor-pointer space-y-3"
                  onClick={() => {
                    setViewAllType(null);
                    setSelectedGrade(grade.toString());
                  }}
                >
                  {/* Thumbnail / App Icon Style */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                    <img 
                      src={gradeImages[grade.toString()]} 
                      alt={`Grade ${grade}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-3xl font-bold block leading-none">{grade}</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider opacity-90">Grade</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">
                      Grade {grade}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      View Activities
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewAllType === 'diagnosis' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(diagnosisLabels).map(([key, label]) => (
                <div 
                  key={key}
                  className="group cursor-pointer space-y-3"
                  onClick={() => {
                    setViewAllType(null);
                    setSelectedDiagnosis(key);
                  }}
                >
                  {/* Thumbnail / App Icon Style */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                    <img 
                      src={diagnosisImages[key]} 
                      alt={label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badge Overlay */}
                    <div className="absolute bottom-2 right-2 rounded-lg bg-purple-500/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Specialized
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary line-clamp-1">
                      {label}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Tailored Support</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Filter Bar */}
              <div className="space-y-4 mb-8">
                {/* Search */}
                <div className="relative max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                {/* All Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
                  {/* Location Filter */}
                  <div>
                    <Select value={selectedLocation || "all"} onValueChange={(value) => setSelectedLocation(value === "all" ? null : value)}>
                      <SelectTrigger className="h-10 w-full">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <SelectValue placeholder="Location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="IN_CLASS">In Class</SelectItem>
                        <SelectItem value="AT_HOME">At Home</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Risk Level Filter */}
                  <div>
                    <Select value={selectedRiskLevel || "all"} onValueChange={(value) => setSelectedRiskLevel(value === "all" ? null : value)}>
                      <SelectTrigger className="h-10 w-full">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <SelectValue placeholder="Risk" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        <SelectItem value="LOW">Low Risk</SelectItem>
                        <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                        <SelectItem value="HIGH">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skill Level Filter */}
                  <div>
                    <Select value={selectedSkillLevel || "all"} onValueChange={(value) => setSelectedSkillLevel(value === "all" ? null : value)}>
                      <SelectTrigger className="h-10 w-full">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <SelectValue placeholder="Skill" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Skill Levels</SelectItem>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme Filter */}
                  <div>
                    <Select value={selectedTheme || "all"} onValueChange={(value) => setSelectedTheme(value === "all" ? null : value)}>
                      <SelectTrigger className="h-10 w-full">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <SelectValue placeholder="Theme" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Themes</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="physical-activity">Physical Activity</SelectItem>
                        <SelectItem value="social-skills">Social Skills</SelectItem>
                        <SelectItem value="creativity">Creativity</SelectItem>
                        <SelectItem value="focus">Focus</SelectItem>
                        <SelectItem value="emotional-awareness">Emotional Awareness</SelectItem>
                        <SelectItem value="stress-relief">Stress Relief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Activity Type Filter */}
                  <div>
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
                      <SelectTrigger className="h-10 w-full">
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
                </div>

                {/* Active Filter Badges */}
                {(selectedLocation || selectedRiskLevel || selectedSkillLevel || selectedTheme || selectedTypes.length > 0) && (
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {selectedLocation && <Badge variant="secondary" className="gap-1"><X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocation(null)} />{selectedLocation.replace('_', ' ')}</Badge>}
                    {selectedRiskLevel && <Badge variant="secondary" className="gap-1"><X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRiskLevel(null)} />{selectedRiskLevel} Risk</Badge>}
                    {selectedSkillLevel && <Badge variant="secondary" className="gap-1"><X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSkillLevel(null)} />{selectedSkillLevel}</Badge>}
                    {selectedTheme && <Badge variant="secondary" className="gap-1"><X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTheme(null)} />{selectedTheme}</Badge>}
                    {selectedTypes.length > 0 && <Badge variant="secondary" className="gap-1"><X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTypes([])} />{activityTypeLabels[selectedTypes[0]]}</Badge>}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSelectedLocation(null);
                        setSelectedRiskLevel(null);
                        setSelectedSkillLevel(null);
                        setSelectedTheme(null);
                        setSelectedTypes([]);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity: any, index: number) => (
                    <div
                      key={activity.activity_id}
                      className="group cursor-pointer space-y-3"
                      onClick={() => setSelectedActivity(activity)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Thumbnail / App Icon Style */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                        {activity.thumbnail_url ? (
                          <img 
                            src={activity.thumbnail_url} 
                            alt={activity.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                        {/* Duration Badge Overlay */}
                        <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {activity.duration ? `${activity.duration} min` : 'Flexible'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary line-clamp-1">
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="uppercase tracking-wider text-[10px] font-medium text-primary">
                            {activityTypeLabels[activity.type] || activity.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No activities found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTypes([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
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
                    <CardHeader className="bg-gradient-to-r from-background to-gray-50">
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
                    <CardHeader className="bg-gradient-to-r from-background to-gray-50">
                      <CardTitle className="text-base">Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {selectedActivity.objectives.map((obj: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                    <CardHeader className="bg-gradient-to-r from-background to-gray-50">
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
                    <CardHeader className="bg-gradient-to-r from-background to-gray-50">
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
                    <CardHeader className="bg-gradient-to-r from-background to-gray-50">
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
                                  <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/50">
                                    <CardContent className="flex flex-col items-center justify-center p-8 min-h-[280px] text-center">
                                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg mb-6">
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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
