import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Therapist } from "@/services/marketplace";
import { MapPin, Star, Users, Award, Clock, Languages, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface TherapistDetailModalProps {
  therapist: Therapist | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (therapist: Therapist) => void;
  getDoctorImage: (id: string | number) => string;
  children?: React.ReactNode;
}

export function TherapistDetailModal({ 
  therapist, 
  open, 
  onOpenChange, 
  onBook,
  getDoctorImage,
  children
}: TherapistDetailModalProps) {
  if (!therapist) return null;
  const GoldVerifiedBadge = ({ id }: { id: string | number }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/90 px-3 py-1 text-xs font-semibold text-amber-800 shadow-[0_6px_18px_rgba(251,191,36,0.35)]">
      <svg viewBox="0 0 22 22" aria-label="Verified therapist" role="img" className="w-5 h-5">
        <defs>
          <linearGradient id={`verified-a-${id}`} x1="4.411" x2="18.083" y1="2.495" y2="21.508" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f4e72a" />
            <stop offset=".539" stopColor="#cd8105" />
            <stop offset=".68" stopColor="#cb7b00" />
            <stop offset="1" stopColor="#f4ec26" />
          </linearGradient>
          <linearGradient id={`verified-b-${id}`} x1="5.355" x2="16.361" y1="3.395" y2="19.133" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f9e87f" />
            <stop offset=".406" stopColor="#e2b719" />
            <stop offset=".989" stopColor="#e2b719" />
          </linearGradient>
        </defs>
        <g clipRule="evenodd" fillRule="evenodd">
          <path
            d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
            fill={`url(#verified-a-${id})`}
          />
          <path
            d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
            fill={`url(#verified-b-${id})`}
          />
          <path
            d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z"
            fill="#d18800"
          />
        </g>
      </svg>
      <span>Verified</span>
    </span>
  );


  const socialIcons = [
    { Icon: Facebook, name: "facebook" },
    { Icon: Twitter, name: "twitter" },
    { Icon: Instagram, name: "instagram" },
    { Icon: Linkedin, name: "linkedin" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl min-h-[80vh] p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2 h-auto max-h-[90vh] gap-0 rounded-3xl bg-transparent">
        
        {/* Left Side - Profile summary */}
        <div className="bg-[#101322] text-white p-6 md:p-8 flex flex-col justify-between gap-6 min-h-[520px]">
          <div className="flex items-center justify-between">
            {therapist.isRecommended && (
              <Badge className="bg-white/15 text-white border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.25em]">
                Recommended
              </Badge>
            )}
            <span className="text-xs text-white/50 tracking-[0.4em] uppercase">Profile</span>
          </div>

          <div className="space-y-6">
            <div className="w-44 h-44 rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <img 
                src={getDoctorImage(therapist.id)}
                alt={therapist.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Therapist</p>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-semibold leading-tight text-white">{therapist.name}</h2>
                <GoldVerifiedBadge id={`${therapist.id}-summary`} />
              </div>
              <p className="text-sm text-white/75">{therapist.specialty}</p>
            </div>

            <p className="text-sm text-white/75 leading-relaxed">
              {therapist.about || "Experienced mental health professional dedicated to providing compassionate care."}
            </p>

            <Button 
              onClick={() => onBook(therapist)}
              variant="secondary"
              className="w-fit bg-white text-gray-900 hover:bg-white/90 font-semibold px-6 py-3 rounded-full"
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {socialIcons.map(({ Icon, name }) => (
              <Button
                key={name}
                variant="ghost"
                size="icon"
                aria-label={name}
                className="w-10 h-10 hidden rounded-full border border-white/25 text-white/80 md:flex hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col bg-background">
          <ScrollArea className="flex-1 max-h-[calc(90vh-80px)]">
            <div className="p-8 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {therapist.name}
                    </h2>
                    <GoldVerifiedBadge id={therapist.id} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{therapist.specialty}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-foreground">{therapist.rating}</span>
                  <span>({therapist.reviews})</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-border bg-card text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Award className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">{therapist.experience}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Experience</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Users className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Patients</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="font-semibold text-foreground text-sm">{therapist.location.split(',')[0]}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-foreground text-xl mb-2">About</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {therapist.about || "No description available."}
                </p>
              </div>

              {/* Expertise */}
              <div className="bg-white rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-foreground text-xl mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.expertise?.map((item: string) => (
                    <Badge 
                      key={item} 
                      variant="outline"
                      className="px-4 py-1.5 text-sm font-medium border-border bg-card text-foreground"
                    >
                      {item}
                    </Badge>
                  )) || <span className="text-muted-foreground">General Practice</span>}
                </div>
              </div>

              {/* Languages & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs uppercase tracking-wide">
                    <Languages className="h-4 w-4" />
                    <span className="font-medium">Languages</span>
                  </div>
                  <p className="font-medium text-sm text-foreground">
                    {therapist.languages.join(", ")}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs uppercase tracking-wide">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Availability</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className="px-3 py-1 text-sm font-medium border-border text-foreground"
                  >
                    {therapist.availability}
                  </Badge>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-background">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Consultation Fee</p>
                <p className="text-2xl font-semibold text-foreground">
                  {therapist.fee}
                  <span className="text-sm text-muted-foreground font-normal ml-2">/ session</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-[160px]">
                <Button 
                  className="w-full h-12 font-semibold"
                  onClick={() => onBook(therapist)}
                >
                  Book Appointment
                </Button>
                {children}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
