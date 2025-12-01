import { useState } from "react";
import { HelpCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function HelpSupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Support request submitted",
      description: "Our team will get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      subject: "",
      category: "",
      priority: "",
      description: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Help & Support
            </h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground ml-13">
            Submit a support request and our team will assist you
          </p>
        </div>
      </div>

      {/* Support Form */}
      <Card className="border-2 shadow-lg max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Support Request</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info (Pre-filled) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 border">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Role</Label>
                <p className="font-semibold capitalize">{user?.role.toLowerCase()}</p>
              </div>
              {user?.school_name && (
                <div>
                  <Label className="text-xs text-muted-foreground">School</Label>
                  <p className="font-semibold">{user.school_name}</p>
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="h-11"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account & Access</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="data">Data & Reports</SelectItem>
                  <SelectItem value="training">Training & Documentation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General question</SelectItem>
                  <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                  <SelectItem value="high">High - Urgent issue</SelectItem>
                  <SelectItem value="critical">Critical - System down</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your issue or question..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Include any error messages, steps to reproduce, or relevant details
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="border-2 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Other Ways to Reach Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Email Support</p>
              <p className="text-muted-foreground">support@wellnest.com</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Response time: Within 24 hours (Mon-Fri, 9AM-5PM EST)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
