import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { schoolAdminApi } from "@/services/schoolAdmin";

interface UpdateLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  currentLogoUrl?: string;
  onSuccess: (newLogoUrl: string) => void;
}

export function UpdateLogoModal({ isOpen, onClose, schoolId, currentLogoUrl, onSuccess }: UpdateLogoModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
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
      const response = await schoolAdminApi.uploadLogo(schoolId, file);
      
      // Handle relative URL from backend
      let newLogoUrl = response.logo_url;
      if (newLogoUrl.startsWith('/')) {
        newLogoUrl = `${import.meta.env.VITE_API_BASE_URL}${newLogoUrl}`;
      }
      
      onSuccess(newLogoUrl);
      toast.success("School logo updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to upload logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(currentLogoUrl || null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update School Logo</DialogTitle>
          <DialogDescription>
            Upload a new logo for your school. Recommended size: 200x200px.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <div 
            className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
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
