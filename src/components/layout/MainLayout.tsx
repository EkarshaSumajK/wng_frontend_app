import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full transition-all duration-500 bg-background text-foreground">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden animate-in fade-in duration-500 min-h-[calc(100vh-4rem)]">
            <div className="max-w-[2000px] mx-auto w-full">
              <Outlet />
            </div>
          </main>
          
          {/* Footer */}
          <footer className="border-t border-border/40 mt-auto bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-[2000px] mx-auto px-4 md:px-6 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left Section - Branding */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold">W</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">WellNest Group</p>
                    <p className="text-xs text-muted-foreground">School Mental Wellness Platform</p>
                  </div>
                </div>

                {/* Center Section - Links */}
                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Support</a>
                </div>

                {/* Right Section - Copyright */}
                <div className="text-center md:text-right">
                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} WellNest Group. All rights reserved.
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Version 1.0.0
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}