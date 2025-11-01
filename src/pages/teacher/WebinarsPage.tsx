import { useState } from "react";
import { Search, Calendar, Video, Users, Filter, Clock, Award, X, Play, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function WebinarsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);

  // Mock webinars data
  const webinars = [
    {
      id: 1,
      title: "Building Resilience in Students",
      speaker: "Dr. Sarah Johnson",
      speakerTitle: "Clinical Psychologist",
      date: "Nov 15, 2025",
      time: "4:00 PM IST",
      duration: "90 mins",
      attendees: 245,
      category: "Student Wellbeing",
      status: "Upcoming",
      price: "Free",
      description: "Learn evidence-based strategies to help students develop resilience and cope with challenges effectively.",
      topics: ["Stress Management", "Coping Skills", "Growth Mindset", "Emotional Regulation"],
      level: "Beginner",
    },
    {
      id: 2,
      title: "Trauma-Informed Counseling Practices",
      speaker: "Prof. Michael Chen",
      speakerTitle: "Professor of Psychology",
      date: "Nov 22, 2025",
      time: "3:00 PM IST",
      duration: "120 mins",
      attendees: 189,
      category: "Professional Development",
      status: "Upcoming",
      price: "₹299",
      description: "Comprehensive training on trauma-informed approaches in school counseling settings.",
      topics: ["Trauma Recognition", "Safe Spaces", "Therapeutic Techniques", "Self-Care"],
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Managing Anxiety in the Classroom",
      speaker: "Dr. Priya Sharma",
      speakerTitle: "Child Psychologist",
      date: "Nov 8, 2025",
      time: "5:00 PM IST",
      duration: "60 mins",
      attendees: 312,
      category: "Mental Health",
      status: "Recorded",
      price: "₹199",
      description: "Practical strategies for identifying and supporting students experiencing anxiety.",
      topics: ["Anxiety Symptoms", "Intervention Strategies", "Classroom Accommodations", "Parent Communication"],
      level: "Beginner",
    },
    {
      id: 4,
      title: "Suicide Prevention & Intervention",
      speaker: "Dr. Rajesh Kumar",
      speakerTitle: "Crisis Intervention Specialist",
      date: "Nov 18, 2025",
      time: "2:00 PM IST",
      duration: "120 mins",
      attendees: 423,
      category: "Crisis Management",
      status: "Upcoming",
      price: "Free",
      description: "Critical training on recognizing warning signs and implementing effective intervention protocols.",
      topics: ["Warning Signs", "Risk Assessment", "Safety Planning", "Follow-up Care"],
      level: "Advanced",
    },
    {
      id: 5,
      title: "Social-Emotional Learning Implementation",
      speaker: "Dr. Anita Desai",
      speakerTitle: "Educational Psychologist",
      date: "Nov 25, 2025",
      time: "4:30 PM IST",
      duration: "90 mins",
      attendees: 267,
      category: "Curriculum",
      status: "Upcoming",
      price: "₹399",
      description: "Step-by-step guide to implementing SEL programs in your school counseling practice.",
      topics: ["SEL Framework", "Program Design", "Assessment Tools", "Outcome Measurement"],
      level: "Intermediate",
    },
    {
      id: 6,
      title: "Understanding ADHD in Schools",
      speaker: "Dr. Vikram Mehta",
      speakerTitle: "Learning Disabilities Expert",
      date: "Nov 12, 2025",
      time: "3:30 PM IST",
      duration: "75 mins",
      attendees: 198,
      category: "Learning Disabilities",
      status: "Recorded",
      price: "₹249",
      description: "Comprehensive overview of ADHD identification, support strategies, and accommodations.",
      topics: ["ADHD Types", "Behavioral Strategies", "Academic Support", "Medication Management"],
      level: "Beginner",
    },
    {
      id: 7,
      title: "Creating Safe Spaces for LGBTQ+ Students",
      speaker: "Dr. Sneha Patel",
      speakerTitle: "Diversity & Inclusion Counselor",
      date: "Dec 2, 2025",
      time: "5:00 PM IST",
      duration: "90 mins",
      attendees: 156,
      category: "Inclusion",
      status: "Upcoming",
      price: "₹299",
      description: "Learn how to create inclusive, supportive environments for LGBTQ+ students.",
      topics: ["Identity Development", "Coming Out Support", "Anti-Bullying", "Ally Training"],
      level: "Intermediate",
    },
    {
      id: 8,
      title: "Effective Parent-Counselor Communication",
      speaker: "Dr. Meera Iyer",
      speakerTitle: "Family Therapist",
      date: "Nov 20, 2025",
      time: "6:00 PM IST",
      duration: "60 mins",
      attendees: 334,
      category: "Communication",
      status: "Upcoming",
      price: "Free",
      description: "Master the art of communicating sensitive mental health information to parents.",
      topics: ["Difficult Conversations", "Cultural Sensitivity", "Collaboration Strategies", "Boundary Setting"],
      level: "Beginner",
    },
    {
      id: 9,
      title: "Mindfulness & Self-Care for Counselors",
      speaker: "Dr. Kabir Singh",
      speakerTitle: "Wellness Coach",
      date: "Nov 5, 2025",
      time: "4:00 PM IST",
      duration: "90 mins",
      attendees: 289,
      category: "Self-Care",
      status: "Recorded",
      price: "₹199",
      description: "Essential self-care practices to prevent burnout and maintain professional effectiveness.",
      topics: ["Burnout Prevention", "Mindfulness Techniques", "Work-Life Balance", "Compassion Fatigue"],
      level: "All Levels",
    },
    {
      id: 10,
      title: "Addressing Cyberbullying",
      speaker: "Dr. Nisha Gupta",
      speakerTitle: "Digital Safety Expert",
      date: "Nov 28, 2025",
      time: "3:00 PM IST",
      duration: "75 mins",
      attendees: 412,
      category: "Safety",
      status: "Upcoming",
      price: "₹349",
      description: "Strategies for preventing, identifying, and responding to cyberbullying incidents.",
      topics: ["Digital Citizenship", "Incident Response", "Legal Considerations", "Prevention Programs"],
      level: "Intermediate",
    },
    {
      id: 11,
      title: "Depression Recognition & Support",
      speaker: "Dr. Sameer Joshi",
      speakerTitle: "Adolescent Psychiatrist",
      date: "Dec 5, 2025",
      time: "4:30 PM IST",
      duration: "90 mins",
      attendees: 223,
      category: "Mental Health",
      status: "Upcoming",
      price: "₹299",
      description: "Learn to identify depression symptoms and provide appropriate support and referrals.",
      topics: ["Depression Types", "Screening Tools", "Treatment Options", "Referral Process"],
      level: "Intermediate",
    },
    {
      id: 12,
      title: "Group Counseling Techniques",
      speaker: "Dr. Arjun Reddy",
      speakerTitle: "Group Therapy Specialist",
      date: "Nov 10, 2025",
      time: "2:30 PM IST",
      duration: "120 mins",
      attendees: 367,
      category: "Counseling Skills",
      status: "Recorded",
      price: "₹399",
      description: "Master effective group counseling techniques for school settings.",
      topics: ["Group Dynamics", "Facilitation Skills", "Activity Planning", "Conflict Resolution"],
      level: "Advanced",
    },
  ];

  const filteredWebinars = webinars.filter((webinar) => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         webinar.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || webinar.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || webinar.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const upcomingCount = webinars.filter(w => w.status === "Upcoming").length;
  const recordedCount = webinars.filter(w => w.status === "Recorded").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Professional Development Webinars</h1>
        <p className="text-muted-foreground">
          Enhance your counseling skills with expert-led training sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Webinars</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webinars.length}</div>
            <p className="text-xs text-muted-foreground">Available for registration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground">Live sessions scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recorded</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordedCount}</div>
            <p className="text-xs text-muted-foreground">Watch anytime</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search webinars by title or speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Student Wellbeing">Student Wellbeing</SelectItem>
                <SelectItem value="Mental Health">Mental Health</SelectItem>
                <SelectItem value="Crisis Management">Crisis Management</SelectItem>
                <SelectItem value="Professional Development">Professional Development</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Self-Care">Self-Care</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Recorded">Recorded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredWebinars.length} of {webinars.length} webinars
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webinars List */}
      <div className="space-y-4">
        {filteredWebinars.map((webinar) => (
          <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Webinar Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-40 h-40 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    <Video className="w-16 h-16 text-white z-10" />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                </div>
                
                {/* Webinar Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{webinar.title}</h3>
                        <p className="text-muted-foreground">
                          by {webinar.speaker} • {webinar.speakerTitle}
                        </p>
                      </div>
                      <Badge 
                        variant={webinar.status === "Upcoming" ? "default" : "secondary"}
                        className="ml-4"
                      >
                        {webinar.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{webinar.date} at {webinar.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{webinar.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{webinar.attendees} registered</span>
                      </div>
                      <Badge variant="outline">{webinar.category}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {webinar.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {webinar.level}
                      </Badge>
                      <span className="text-lg font-semibold text-primary">
                        {webinar.price}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedWebinar(webinar)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm">
                        {webinar.status === "Upcoming" ? (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            Register
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Watch
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredWebinars.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No webinars found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Webinar Detail Modal */}
      <Dialog open={!!selectedWebinar} onOpenChange={() => setSelectedWebinar(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedWebinar && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{selectedWebinar.title}</DialogTitle>
                    <DialogDescription className="text-base">
                      by {selectedWebinar.speaker} • {selectedWebinar.speakerTitle}
                    </DialogDescription>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant={selectedWebinar.status === "Upcoming" ? "default" : "secondary"}>
                        {selectedWebinar.status}
                      </Badge>
                      <Badge variant="outline">{selectedWebinar.category}</Badge>
                      <Badge variant="secondary">{selectedWebinar.level}</Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              <div className="space-y-6">
                {/* Schedule Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Date & Time</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedWebinar.date}</p>
                    <p className="text-sm text-muted-foreground">{selectedWebinar.time}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedWebinar.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Registered</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedWebinar.attendees} attendees</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-lg font-semibold text-primary">{selectedWebinar.price}</p>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About This Webinar</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedWebinar.description}
                  </p>
                </div>

                {/* Topics Covered */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWebinar.topics.map((topic: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* What You'll Learn */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Evidence-based strategies and techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Practical tools you can implement immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Real-world case studies and examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Q&A session with the expert speaker</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Downloadable resources and materials</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    {selectedWebinar.status === "Upcoming" ? (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Register Now
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Watch Recording
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Share with Colleagues
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
