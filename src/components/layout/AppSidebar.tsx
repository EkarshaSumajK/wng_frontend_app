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
  Video,
  Home
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
import { useEffect } from "react";

const navigationItems = {
  counsellor: [
    { title: "Home", url: "/counsellor", icon: Home },
    { title: "Dashboard", url: "/counsellor/dashboard", icon: BarChart3 },
    { title: "Cases", url: "/counsellor/cases", icon: FileText },
    { title: "Assessments", url: "/counsellor/assessments", icon: ClipboardList },
    { title: "Activities", url: "/counsellor/activities", icon: Users },
    { title: "Calendar", url: "/counsellor/calendar", icon: Calendar },
    { title: "Resources", url: "/counsellor/resources", icon: BookOpen },
    { title: "Webinars", url: "/counsellor/webinars", icon: Video },
  ],
  teacher: [
    { title: "Home", url: "/teacher", icon: Home },
    { title: "Dashboard", url: "/teacher/dashboard", icon: BarChart3 },
    { title: "Cases", url: "/teacher/cases", icon: FileText },
    { title: "Student Monitoring", url: "/teacher/students", icon: Users },
    { title: "Assessments", url: "/teacher/assessments", icon: ClipboardList },
    { title: "Activities", url: "/teacher/activities", icon: UserPlus },
    { title: "Resources", url: "/teacher/resources", icon: BookOpen },
    { title: "Calendar", url: "/teacher/calendar", icon: Calendar },
    { title: "Webinars", url: "/teacher/webinars", icon: Video },
  ],
  leadership: [
    { title: "Home", url: "/leadership", icon: Home },
    { title: "Dashboard", url: "/leadership/dashboard", icon: BarChart3 },
    { title: "Onboarding", url: "/leadership/onboarding", icon: UserPlus },
    { title: "At-Risk Students", url: "/leadership/at-risk-students", icon: AlertTriangle },
    { title: "Grade Analysis", url: "/leadership/grade-analysis", icon: Users },
    { title: "Marketplace", url: "/leadership/marketplace", icon: ShoppingBag },
    { title: "Resources", url: "/leadership/resources", icon: BookOpen },
    { title: "Webinars", url: "/leadership/webinars", icon: Video },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const { open } = useSidebar();
  const location = useLocation();

  if (!user) return null;

  const roleMapping: Record<string, 'counsellor' | 'teacher' | 'leadership'> = {
    'counsellor': 'counsellor',
    'teacher': 'teacher',
    'leadership': 'leadership',
    'principal': 'leadership',
  };
  
  const userRole = roleMapping[user.role?.toLowerCase()] || 'teacher';
  const items = navigationItems[userRole] || [];
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === `/${userRole}`) {
      return currentPath === path || currentPath === `/${userRole}/`;
    }
    return currentPath.startsWith(path) && currentPath !== `/${userRole}`;
  };

  useEffect(() => {
    if (user.school_name) {
      document.title = `WellNest Group X ${user.school_name}`;
    }
  }, [user.school_name]);

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl shadow-2xl transition-all duration-300">
      <SidebarHeader className="p-4 md:p-6 border-b border-sidebar-border/50 bg-gradient-to-br from-sidebar-background to-sidebar-accent/50">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div className="flex-1 min-w-0 animate-slide-up-fade">
              <div className="mb-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  WellNest Group
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-sidebar-foreground leading-tight mb-1 truncate">
                {user.school_name || 'School Portal'}
              </h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize font-medium">
                {user.role} Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 md:px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 md:px-3 text-xs font-bold text-sidebar-foreground/50 uppercase tracking-widest mb-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title} className={`animate-slide-up-fade`} style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        isActive(item.url)
                          ? 'bg-gradient-primary text-white font-bold shadow-lg scale-[1.02]'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white hover:pl-5'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive(item.url) ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="text-sm truncate font-medium">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
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