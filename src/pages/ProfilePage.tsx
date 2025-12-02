import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Building2, Shield, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { UpdateLogoModal } from "@/components/modals/UpdateLogoModal";
import { UpdateProfilePictureModal } from "@/components/modals/UpdateProfilePictureModal";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
  });

  if (!user) return null;

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'COUNSELLOR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'TEACHER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'LEADERSHIP':
      case 'PRINCIPAL':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">
              Manage your account information and preferences
            </p>
          </div>
          
          {!isEditing ? (
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 w-fit"
              onClick={() => setIsEditing(true)}
              size="lg"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                onClick={handleSave}
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancel}
                size="lg"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4 relative group">
              <div 
                className="relative cursor-pointer"
                onClick={() => setIsProfilePicModalOpen(true)}
              >
                <Avatar className="w-32 h-32 ring-4 ring-blue-100 dark:ring-blue-900">
                  {user.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-6 h-6 text-white" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-1/3 translate-x-4 bg-white dark:bg-gray-800 shadow-md rounded-full h-8 w-8 border hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfilePicModalOpen(true)}
              >
                <Edit className="w-4 h-4 text-primary" />
              </Button>
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="text-base">{user.email}</CardDescription>
            <div className="flex justify-center mt-3">
              <Badge className={`${getRoleBadgeColor(user.role)} text-sm font-semibold px-4 py-1`}>
                {user.role.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            
            {user.school_name && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden relative">
                  {user.school_logo_url ? (
                    <img src={user.school_logo_url} alt="School Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 text-primary" />
                  )}
                </div>
                
                {['PRINCIPAL', 'LEADERSHIP'].includes(user.role) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full -ml-1 text-muted-foreground hover:text-primary"
                    onClick={() => setIsLogoModalOpen(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}

                <div className="flex-1 min-w-0 ml-1">
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="font-semibold truncate">{user.school_name}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="font-mono text-sm truncate">{user.id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-semibold">January 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 border-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    placeholder="City, State"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <p className="font-semibold capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
                </div>
                
                {user.school_name && (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm text-muted-foreground mb-1">School</p>
                    <p className="font-semibold">{user.school_name}</p>
                  </div>
                )}
                
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Last Login</p>
                  <p className="font-semibold">Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl">Security Settings</CardTitle>
          <CardDescription>Manage your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div>
              <p className="font-semibold">Password</p>
              <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div>
              <p className="font-semibold">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>


      <UpdateLogoModal 
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        schoolId={user?.school_id || ''}
        currentLogoUrl={user?.school_logo_url}
        onSuccess={(newLogoUrl) => updateUser({ school_logo_url: newLogoUrl })}
      />

      <UpdateProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        currentPictureUrl={user?.profile_picture_url}
        onSuccess={(newPictureUrl) => updateUser({ profile_picture_url: newPictureUrl })}
      />
    </div>
  );
}
