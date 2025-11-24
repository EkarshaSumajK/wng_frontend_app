import { Search, HelpCircle, LogOut, Moon, Sun, Home, User, Building2, Bell } from "lucide-react";
import { useTheme } from "next-themes";
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

export function TopBar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
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
    <header className="h-20 border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-6 max-w-[2000px] mx-auto gap-4">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors duration-300" />
          
          {user.school_name && (
            <div className="hidden lg:flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight leading-none">
                {user.school_name}
              </span>
            </div>
          )}
          
          <div className="relative max-w-md flex-1 hidden md:block group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            <Input
              placeholder="Search students, cases, or resources..."
              className="pl-10 h-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {!isOnHomePage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(homeRoute)}
              className="hidden md:flex items-center gap-2 hover:bg-primary/10 hover:text-primary rounded-full px-4"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-primary/10 hover:text-primary"
          >
            <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 rounded-full hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all duration-300">
                <Avatar className="w-9 h-9 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50">
                  <AvatarFallback className="bg-gradient-primary text-white text-xs font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-bold leading-none">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{user.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
              <div className="px-4 py-3 bg-muted/30 rounded-lg mb-2">
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuItem onClick={() => navigate(`${homeRoute}/profile`)} className="rounded-lg cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`${homeRoute}/help`)} className="rounded-lg cursor-pointer">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive rounded-lg cursor-pointer hover:bg-destructive/10">
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