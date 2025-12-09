import React from 'react';
import { Therapist } from '@/services/marketplace';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileCardProps {
  therapist: Therapist;
  onClick?: () => void;
  getDoctorImage: (id: string | number, name?: string) => string;
}

export const ProfileCard = ({ therapist, onClick, getDoctorImage }: ProfileCardProps) => {
  return (
    <>
      <style>
        {`
          .tinder-card {
            transition: transform 0.3s ease-out, box-shadow 0.3s ease;
          }
          
          .tinder-card:hover {
            transform: scale(1.02) translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .image-scale {
            transition: transform 0.5s ease-out;
          }
          
          .tinder-card:hover .image-scale {
            transform: scale(1.05);
          }
        `}
      </style>
      
      <div className="w-full h-full" onClick={onClick}>
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer tinder-card group shadow-md">
          {/* Full Background Image */}
          <img 
            src={getDoctorImage(therapist.id, therapist.name)}
            alt={therapist.name} 
            className="absolute inset-0 w-full h-full  object-cover image-scale"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-end items-start gap-2">
               <Badge className="bg-primary hover:bg-primary/90 text-white border-none shadow-sm flex items-center gap-1">
                 {therapist.rating.toFixed(1)}<Star className="w-3 h-3 fill-amber-500 text-amber-500" />
               </Badge>
            
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-20">
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
              {therapist.availability === "Limited" && (
                  <Badge className="bg-amber-500/90 text-white border-none shadow-md text-[8px] tracking-[0.4em] uppercase font-bold hover:bg-amber-500/90 -translate-x-8">
                    <div className="flex items-center gap-1 px-4"><Clock className="w-3 h-3" /> Limited Slots</div>
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  
                  <h2 className="text-2xl font-bold leading-none drop-shadow-lg text-white tracking-tight">{therapist.name}</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help transition-transform duration-300 hover:scale-110 bg-black rounded-full">
                           <svg viewBox="0 0 22 22" aria-label="Verified account" role="img" className="w-5 h-5">
                             <g>
                               <linearGradient gradientUnits="userSpaceOnUse" id={`12-a-${therapist.id}`} x1="4.411" x2="18.083" y1="2.495" y2="21.508">
                                 <stop offset="0" stopColor="#f4e72a"></stop>
                                 <stop offset=".539" stopColor="#cd8105"></stop>
                                 <stop offset=".68" stopColor="#cb7b00"></stop>
                                 <stop offset="1" stopColor="#f4ec26"></stop>
                                 <stop offset="1" stopColor="#f4e72a"></stop>
                               </linearGradient>
                               <linearGradient gradientUnits="userSpaceOnUse" id={`12-b-${therapist.id}`} x1="5.355" x2="16.361" y1="3.395" y2="19.133">
                                 <stop offset="0" stopColor="#f9e87f"></stop>
                                 <stop offset=".406" stopColor="#e2b719"></stop>
                                 <stop offset=".989" stopColor="#e2b719"></stop>
                               </linearGradient>
                               <g clipRule="evenodd" fillRule="evenodd">
                                 <path d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill={`url(#12-a-${therapist.id})`}></path>
                                 <path d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill={`url(#12-b-${therapist.id})`}></path>
                                 <path d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z" fill="#d18800"></path>
                               </g>
                             </g>
                           </svg>
                         </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg shadow-xl  border-white/10 border-0 z-[100]">
                        <p>Wellnest Verified Therapist</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
              </div>
              <p className="text-white/50 text-base">{therapist.specialty}</p>
              <p className="text-white text-sm">{therapist.languages.join(', ')}</p>
             
            </div>
            


            <div className="pt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
              <button className="w-full py-1.5 text-sm bg-card text-card-foreground border border-border font-bold rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors shadow-lg active:scale-[0.98] transform duration-200">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
