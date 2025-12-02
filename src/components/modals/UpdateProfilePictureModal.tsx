import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { userApi } from "@/services/user";

interface UpdateProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPictureUrl?: string;
  onSuccess: (newPictureUrl: string) => void;
}

export function UpdateProfilePictureModal({ isOpen, onClose, currentPictureUrl, onSuccess }: UpdateProfilePictureModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPictureUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await userApi.uploadProfilePicture(file);
      
      // Handle relative URL from backend
      let newPictureUrl = response.profile_picture_url;
      if (newPictureUrl.startsWith('/')) {
        newPictureUrl = `${import.meta.env.VITE_API_BASE_URL}${newPictureUrl}`;
      }
      
      onSuccess(newPictureUrl);
      toast.success("Profile picture updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(currentPictureUrl || null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. Recommended size: 400x400px.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <div 
            className="relative w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-muted-foreground/50" />
            )}
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Select Image
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-xs text-muted-foreground mt-2">
                {file.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
