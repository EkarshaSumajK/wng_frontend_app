import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  appName?: string;
  version?: string;
}

export function Footer({ 
  className, 
  appName = "Wellnest Connect", 
  version = "1.0.0",
  ...props 
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={cn(
        "border-t border-border/40 mt-auto bg-gradient-to-b from-background to-muted/20",
        className
      )}
      {...props}
    >
      <div className="max-w-[2000px] mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section - Branding */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold">W</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{appName}</p>
              <p className="text-xs text-muted-foreground">School Mental Wellness Platform</p>
            </div>
          </div>

          {/* Center Section - Links */}
          <nav className="flex items-center gap-6 text-sm" aria-label="Footer Navigation">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Support</a>
          </nav>

          {/* Right Section - Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-end gap-1">
              © {currentYear} {appName}. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </p>
            <p className="text-xs text-muted-foreground/70">
              Version {version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
