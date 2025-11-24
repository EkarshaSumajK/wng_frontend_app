import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full transition-all duration-500">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden animate-slide-up-fade">
            <div className="max-w-[2000px] mx-auto w-full">
              <Outlet />
            </div>
          </main>
          
          {/* Footer */}
          <footer className="border-t border-border/40 bg-card/30 backdrop-blur-md py-6 px-4 md:px-6 mt-auto">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Powered by <span className="text-gradient font-bold tracking-wide">WellNest Group</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}