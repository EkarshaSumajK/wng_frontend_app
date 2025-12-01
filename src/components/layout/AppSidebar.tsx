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
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          {open && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="mb-0.5">
                <span className="text-[10px] font-bold text-sidebar-primary uppercase tracking-widest">
                  WellNest Group
                </span>
              </div>
              <h2 className="text-sm font-bold text-sidebar-foreground leading-tight mb-0.5 truncate">
                {user.school_name || 'School Portal'}
              </h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize font-medium">
                {user.role} Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-bold text-sidebar-foreground/40 uppercase tracking-widest mb-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${
                        isActive(item.url)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive(item.url) ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground'}`} />
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