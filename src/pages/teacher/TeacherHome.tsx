import { Users, BookOpen, ClipboardList, Calendar, Video, ArrowRight, BarChart3, UserPlus, GraduationCap, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function TeacherHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick access navigation cards with modern color scheme
  const quickAccessCards = [
    {
      title: "Dashboard",
      icon: BarChart3,
      url: "/teacher/students",
      description: "Monitor student wellbeing",
      gradient: "from-indigo-500 to-purple-500",
      badge: "Monitor"
    },
    {
      title: "Cases",
      icon: FileText,
      url: "/teacher/cases",
      description: "View student cases",
      gradient: "from-blue-500 to-indigo-500",
      badge: "View"
    },
    {
      title: "Activities",
      icon: UserPlus,
      url: "/teacher/activities",
      description: "Plan classroom activities",
      gradient: "from-green-500 to-emerald-500",
      badge: "Plan"
    },
    {
      title: "Activity Monitoring",
      icon: ClipboardList,
      url: "/teacher/activity-monitoring",
      description: "Track activity submissions",
      gradient: "from-purple-500 to-pink-500",
      badge: "Track"
    },
    {
      title: "Resources",
      icon: BookOpen,
      url: "/teacher/resources",
      description: "Teaching materials",
      gradient: "from-pink-500 to-rose-500",
      badge: "Library"
    },
    { 
      title: "Calendar", 
      icon: Calendar, 
      url: "/teacher/calendar", 
      description: "View class schedule", 
      gradient: "from-orange-500 to-red-500",
      badge: "Schedule"
    },
    { 
      title: "Webinars", 
      icon: Video, 
      url: "/teacher/webinars", 
      description: "Professional development", 
      gradient: "from-indigo-500 to-purple-500",
      badge: "Learn"
    },
  ];

  return (
    <div className="space-y-8 pb-8 relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
              Teacher Portal
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome back, {user?.name || 'Teacher'}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl">
            Creating a supportive classroom environment where every student can thrive
          </p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Quick Access</h2>
          <Badge variant="secondary" className="text-xs">
            {quickAccessCards.length} Tools
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {quickAccessCards.map((card, index) => (
            <Card
              key={card.title}
              className="group relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1"
              onClick={() => navigate(card.url)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {card.badge}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {card.description}
                </p>
                <div className="flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                  <span>Open</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


    </div>
  );
}
