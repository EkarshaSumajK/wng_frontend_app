import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  BookOpen,
  Brain,
  UserPlus,
  ClipboardList,
  AlertTriangle,
  ShoppingBag,
  Video
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";

const navigationItems = {
  counsellor: [
    {
      title: "Dashboard",
      url: "/counsellor",
      icon: BarChart3,
    },
    {
      title: "Cases",
      url: "/counsellor/cases",
      icon: FileText,
    },
    {
      title: "Assessments",
      url: "/counsellor/assessments",
      icon: ClipboardList,
    },
    {
      title: "Activities",
      url: "/counsellor/activities",
      icon: Users,
    },
    {
      title: "Calendar",
      url: "/counsellor/calendar",
      icon: Calendar,
    },
    {
      title: "Resources",
      url: "/counsellor/resources",
      icon: BookOpen,
    },
    {
      title: "Webinars",
      url: "/counsellor/webinars",
      icon: Video,
    },
  ],
  teacher: [
    {
      title: "Dashboard",
      url: "/teacher",
      icon: BarChart3,
    },
    {
      title: "Student Monitoring",
      url: "/teacher/students",
      icon: Users,
    },
    {
      title: "Assessments",
      url: "/teacher/assessments",
      icon: ClipboardList,
    },
    {
      title: "Activities",
      url: "/teacher/activities",
      icon: UserPlus,
    },
    {
      title: "Resources",
      url: "/teacher/resources",
      icon: BookOpen,
    },
    {
      title: "Calendar",
      url: "/teacher/calendar",
      icon: Calendar,
    },
    {
      title: "Webinars",
      url: "/teacher/webinars",
      icon: Video,
    },
  ],
  leadership: [
    {
      title: "Dashboard",
      url: "/leadership",
      icon: BarChart3,
    },
    {
      title: "Onboarding",
      url: "/leadership/onboarding",
      icon: UserPlus,
    },
    {
      title: "At-Risk Students",
      url: "/leadership/at-risk-students",
      icon: AlertTriangle,
    },
    {
      title: "Grade Analysis",
      url: "/leadership/grade-analysis",
      icon: Users,
    },
    {
      title: "Marketplace",
      url: "/leadership/marketplace",
      icon: ShoppingBag,
    },
    {
      title: "Resources",
      url: "/leadership/resources",
      icon: BookOpen,
    },
    {
      title: "Webinars",
      url: "/leadership/webinars",
      icon: Video,
    },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const { open } = useSidebar();
  const location = useLocation();

  if (!user) return null;

  // Normalize role to lowercase for lookup
  // Map PRINCIPAL to leadership for navigation
  const roleMapping: Record<string, 'counsellor' | 'teacher' | 'leadership'> = {
    'counsellor': 'counsellor',
    'teacher': 'teacher',
    'leadership': 'leadership',
    'principal': 'leadership', // Map PRINCIPAL to leadership
  };
  
  const userRole = roleMapping[user.role?.toLowerCase()] || 'teacher';
  const items = navigationItems[userRole] || [];
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    // For dashboard route, check exact match
    if (path === `/${userRole}`) {
      return currentPath === path || currentPath === `/${userRole}/`;
    }
    // For other routes, check if current path starts with the route
    return currentPath.startsWith(path) && currentPath !== `/${userRole}`;
  };

  // Update document title with school name
  useEffect(() => {
    if (user.school_name) {
      document.title = `WellNest Group X ${user.school_name}`;
    }
  }, [user.school_name]);

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar shadow-lg">
      <SidebarHeader className="p-4 md:p-6 border-b border-sidebar-border bg-gradient-to-br from-sidebar-background to-sidebar-accent/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <span className="text-xs font-bold text-sidebar-primary uppercase tracking-wider">
                  WellNest Group
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-sidebar-foreground leading-tight mb-1 truncate">
                {user.school_name || 'School Portal'}
              </h2>
              <p className="text-xs text-sidebar-foreground/80 capitalize font-semibold">
                {user.role} Portal
              </p>
            </div>
          )}
        </div>
        
        {/* {open && (
          <div className="mt-4 p-3 bg-sidebar-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-accent-foreground/70 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )} */}
      </SidebarHeader>

      <SidebarContent className="px-2 md:px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 md:px-3 text-xs font-bold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(item.url)
                          ? 'bg-gradient-primary text-white font-bold shadow-lg scale-[1.02]'
                          : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground font-semibold hover:scale-[1.01] hover:shadow-md'
                      }`}
                    >
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      <span className="text-sm truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}