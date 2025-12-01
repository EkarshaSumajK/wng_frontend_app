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
    { title: "Dashboard", url: "/teacher/students", icon: BarChart3 },
    { title: "Cases", url: "/teacher/cases", icon: FileText },
    { title: "Activities", url: "/teacher/activities", icon: UserPlus },
    { title: "Activity Monitoring", url: "/teacher/activity-monitoring", icon: ClipboardList },
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
    { title: "Webinars", url: "/leadership/webinars", icon: Video },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();
  const { open } = useSidebar();
  const location = useLocation();

  // Move useEffect before early return to comply with React hooks rules
  useEffect(() => {
    if (user?.school_name) {
      document.title = `WellNest Group X ${user.school_name}`;
    }
  }, [user?.school_name]);

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

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border/40 bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          {open && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="mb-0.5">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  WellNest Group
                </span>
              </div>
              <h2 className="text-sm font-bold text-sidebar-foreground leading-tight mb-0.5 truncate">
                {user.school_name || 'School Portal'}
              </h2>
              <p className="text-xs text-muted-foreground capitalize font-medium">
                {user.role} Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative ${
                        isActive(item.url)
                          ? 'bg-primary/10 text-primary font-semibold shadow-sm border border-primary/20'
                          : 'text-sidebar-foreground/70 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 hover:shadow-md border border-transparent hover:scale-[1.02]'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${isActive(item.url) ? 'text-primary' : 'text-muted-foreground group-hover:text-blue-600 group-hover:scale-110'}`} />
                      <span className="text-sm truncate transition-all duration-300">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
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