// 🎨 USAGE EXAMPLES - Enhanced UI Components
// Copy these examples into your components for stunning visual effects

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/ui/animated-background";

// ============================================
// 1. PREMIUM HERO SECTION
// ============================================
export function PremiumHeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 text-center space-y-8 px-4">
        <h1 className="text-6xl font-bold neon-glow">
          Welcome to WellNest
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional B2B wellness platform for schools
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button variant="gradient" size="lg" className="btn-magnetic ripple-effect">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="glow-hover">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 2. GLASSMORPHISM CARD
// ============================================
export function GlassmorphismCard() {
  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Glassmorphism Effect</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Beautiful frosted glass effect with backdrop blur</p>
      </CardContent>
    </Card>
  );
}

// ============================================
// 3. ANIMATED GRADIENT CARD
// ============================================
export function AnimatedGradientCard() {
  return (
    <Card className="card-animated-gradient text-white">
      <CardHeader>
        <CardTitle>Animated Gradient</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Watch the colors shift smoothly over 8 seconds!</p>
      </CardContent>
    </Card>
  );
}

// ============================================
// 4. PROFESSIONAL STATS CARDS
// ============================================
export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
      <Card className="card-professional glow-hover">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase">Total Students</CardTitle>
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg float-animation">
            <span className="text-2xl">👥</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">1,234</div>
          <Badge className="badge-pulse mt-2">+12% this month</Badge>
        </CardContent>
      </Card>

      <Card className="card-professional glow-hover">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase">Active Cases</CardTitle>
          <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-lg float-animation" style={{ animationDelay: '0.5s' }}>
            <span className="text-2xl">📋</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">89</div>
          <Badge variant="success" className="mt-2">On track</Badge>
        </CardContent>
      </Card>

      <Card className="card-professional glow-hover">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase">Wellbeing Score</CardTitle>
          <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg float-animation" style={{ animationDelay: '1s' }}>
            <span className="text-2xl">💚</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">87%</div>
          <Badge variant="info" className="mt-2">Excellent</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// 5. INTERACTIVE FEATURE CARDS
// ============================================
export function FeatureCards() {
  const features = [
    { title: "AI-Powered Insights", icon: "🤖", description: "Smart analytics for better decisions" },
    { title: "Real-time Monitoring", icon: "📊", description: "Track student wellbeing instantly" },
    { title: "Secure & Compliant", icon: "🔒", description: "HIPAA compliant data protection" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <Card 
          key={index}
          className="interactive-card spotlight-hover tilt-hover"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader>
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl mb-4 rotate-scale">
              {feature.icon}
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// 6. NOTIFICATION BADGES
// ============================================
export function NotificationBadges() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Badge className="badge-pulse">3 New Messages</Badge>
      <Badge variant="success" className="badge-premium">Verified</Badge>
      <Badge variant="warning">Pending Review</Badge>
      <Badge variant="destructive" className="badge-pulse">Urgent</Badge>
      <Badge variant="gradient">Premium Feature</Badge>
    </div>
  );
}

// ============================================
// 7. BUTTON SHOWCASE
// ============================================
export function ButtonShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Button variant="gradient" className="btn-magnetic ripple-effect">
          Gradient Button
        </Button>
        <Button variant="default" className="glow-hover">
          Primary Button
        </Button>
        <Button variant="success">
          Success Button
        </Button>
        <Button variant="outline" className="spotlight-hover">
          Outline Button
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button size="lg" variant="gradient">
          Large Button
        </Button>
        <Button size="default" variant="secondary">
          Default Size
        </Button>
        <Button size="sm" variant="outline">
          Small Button
        </Button>
      </div>
    </div>
  );
}

// ============================================
// 8. GRADIENT BORDER CARD
// ============================================
export function GradientBorderCard() {
  return (
    <div className="gradient-border p-6">
      <h3 className="text-xl font-bold mb-2">Animated Gradient Border</h3>
      <p className="text-muted-foreground">
        Watch the border colors rotate through the spectrum!
      </p>
    </div>
  );
}

// ============================================
// 9. STAGGERED LIST ANIMATION
// ============================================
export function StaggeredList() {
  const items = [
    "First item appears",
    "Second item follows",
    "Third item continues",
    "Fourth item flows",
    "Fifth item completes",
  ];

  return (
    <div className="stagger-children space-y-3">
      {items.map((item, index) => (
        <Card key={index} className="card-professional">
          <CardContent className="p-4">
            <p className="font-medium">{item}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// 10. PREMIUM DASHBOARD LAYOUT
// ============================================
export function PremiumDashboard() {
  return (
    <div className="space-y-8 relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Features */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <FeatureCards />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <StaggeredList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 11. FLOATING ACTION BUTTON
// ============================================
export function FloatingActionButton() {
  return (
    <Button
      variant="gradient"
      size="icon"
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl float-animation glow-hover ripple-effect"
    >
      <span className="text-2xl">+</span>
    </Button>
  );
}

// ============================================
// 12. LOADING SKELETON WITH SHIMMER
// ============================================
export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-muted rounded-xl shimmer" />
      <div className="h-32 bg-muted rounded-xl shimmer" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-muted rounded-xl shimmer" />
        <div className="h-24 bg-muted rounded-xl shimmer" />
        <div className="h-24 bg-muted rounded-xl shimmer" />
      </div>
    </div>
  );
}

// ============================================
// USAGE IN YOUR COMPONENTS:
// ============================================

/*
// Example 1: Add to any page
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function MyPage() {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Your content *\/}
      </div>
    </div>
  );
}

// Example 2: Enhance existing cards
<Card className="card-professional glow-hover">
  {/* Your card content *\/}
</Card>

// Example 3: Make buttons more engaging
<Button variant="gradient" className="btn-magnetic ripple-effect">
  Click Me
</Button>

// Example 4: Add staggered animations to lists
<div className="stagger-children">
  {items.map(item => (
    <Card key={item.id}>{/* content *\/}</Card>
  ))}
</div>

// Example 5: Create glassmorphism overlays
<Card className="card-glass">
  {/* Overlay content *\/}
</Card>
*/

export default {
  PremiumHeroSection,
  GlassmorphismCard,
  AnimatedGradientCard,
  StatsCards,
  FeatureCards,
  NotificationBadges,
  ButtonShowcase,
  GradientBorderCard,
  StaggeredList,
  PremiumDashboard,
  FloatingActionButton,
  LoadingSkeleton,
};
