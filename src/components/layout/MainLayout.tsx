import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full transition-all duration-500 bg-background text-foreground">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          
          <main 
            className="flex-1 p-2 md:p-4 overflow-x-hidden animate-in fade-in duration-500 min-h-[calc(100vh-4rem)]"
            id="main-content"
            role="main"
            aria-label="Main Content"
          >
            <div className="max-w-[2000px] mx-auto w-full h-full">
              <Outlet />
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}