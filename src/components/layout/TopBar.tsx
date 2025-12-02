import { Search, HelpCircle, LogOut, Home, User, Building2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const roleMapping: Record<string, string> = {
    'COUNSELLOR': '/counsellor',
    'TEACHER': '/teacher',
    'LEADERSHIP': '/leadership',
    'PRINCIPAL': '/leadership',
  };
  
  const homeRoute = roleMapping[user.role] || '/counsellor';
  const isOnHomePage = location.pathname === homeRoute || location.pathname === `${homeRoute}/`;

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-50 shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between h-full px-4 md:px-6 max-w-[2000px] mx-auto gap-4">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200" />
          
          {user.school_name && (
            <div className="hidden lg:flex items-center gap-3 px-2 border-l border-border/50 ml-2 pl-4">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-foreground tracking-tight">
                {user.school_name}
              </span>
            </div>
          )}
          
          <div className="relative max-w-md flex-1 hidden md:block group ml-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            <Input
              placeholder="Search students, cases, or resources..."
              className="pl-9 h-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all duration-200 rounded-md hover:bg-muted/80"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOnHomePage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(homeRoute)}
              className="hidden md:flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md px-3 h-9 text-muted-foreground hover:text-foreground"
              aria-label="Go to Home"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium text-sm">Home</span>
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground relative text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 ml-1">
                <Avatar className="w-7 h-7 border border-border transition-transform hover:scale-105">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-xs font-semibold leading-none text-foreground">{user.name}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 rounded-lg border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95">
              <div className="px-2 py-1.5 mb-1">
                <p className="font-semibold text-sm text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={() => navigate(`${homeRoute}/profile`)} className="rounded-md cursor-pointer text-sm focus:bg-accent focus:text-accent-foreground">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`${homeRoute}/help`)} className="rounded-md cursor-pointer text-sm focus:bg-accent focus:text-accent-foreground">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive rounded-md cursor-pointer text-sm focus:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}