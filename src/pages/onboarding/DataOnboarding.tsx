import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Users, GraduationCap, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/services/api";

interface UploadStatus {
  staff: 'pending' | 'uploading' | 'success' | 'error';
  students: 'pending' | 'uploading' | 'success' | 'error';
  classes: 'pending' | 'uploading' | 'success' | 'error';
}

interface UploadResult {
  staff?: { count: number; message: string };
  students?: { count: number; message: string };
  classes?: { count: number; message: string };
}

export default function DataOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    staff: 'pending',
    students: 'pending',
    classes: 'pending'
  });
  const [uploadResults, setUploadResults] = useState<UploadResult>({});
  const [errors, setErrors] = useState<Partial<Record<keyof UploadStatus, string>>>({});
  const [selectedFiles, setSelectedFiles] = useState<{
    staff?: File;
    students?: File;
    classes?: File;
  }>({});

  const [school, setSchool] = useState<any>({});

  // Read school data on mount and whenever we navigate to this page
  useEffect(() => {
    console.log('DataOnboarding: useEffect triggered, location:', location.pathname);
    const stored = localStorage.getItem('selected_school');
    if (stored) {
      const schoolData = JSON.parse(stored);
      setSchool(schoolData);
      console.log('DataOnboarding: Loaded school:', schoolData.name, schoolData.school_id);
    } else {
      console.warn('DataOnboarding: No school found in localStorage');
      navigate('/school-selection');
    }
  }, [navigate, location]);

  const handleFileSelect = (type: keyof UploadStatus, file: File | null) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
      setErrors(prev => ({ ...prev, [type]: undefined }));
    }
  };

  const handleRemoveUpload = (type: keyof UploadStatus) => {
    // Reset the upload for this type
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
    setUploadStatus(prev => ({ ...prev, [type]: 'pending' }));
    setUploadResults(prev => {
      const newResults = { ...prev };
      delete newResults[type];
      return newResults;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
    
    // Reset the file input
    const fileInput = document.getElementById(`${type}-upload`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpload = async (type: keyof UploadStatus) => {
    const file = selectedFiles[type];
    if (!file) {
      setErrors(prev => ({ ...prev, [type]: 'Please select a file first' }));
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrors(prev => ({ ...prev, [type]: 'Please upload an Excel file (.xlsx or .xls)' }));
      return;
    }

    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
    setErrors(prev => ({ ...prev, [type]: undefined }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('school_id', school.school_id);
      formData.append('type', type);

      const response = await apiClient.uploadFile(`/schools/${school.school_id}/upload-${type}`, formData);

      setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
      setUploadResults(prev => ({ ...prev, [type]: response }));
    } catch (err) {
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
      setErrors(prev => ({ 
        ...prev, 
        [type]: err instanceof Error ? err.message : 'Upload failed. Please try again.' 
      }));
    }
  };

  const allUploadsComplete = () => {
    return uploadStatus.staff === 'success' && 
           uploadStatus.students === 'success' && 
           uploadStatus.classes === 'success';
  };

  const getProgress = () => {
    const completed = Object.values(uploadStatus).filter(s => s === 'success').length;
    return (completed / 3) * 100;
  };

  const handleContinue = async () => {
    // Mark data onboarding as complete
    try {
      await apiClient.patch(`/schools/${school.school_id}/complete-onboarding`, {});
      
      // Update local storage
      const updatedSchool = { ...school, needs_data_onboarding: false };
      localStorage.setItem('selected_school', JSON.stringify(updatedSchool));
      
      // Clear school selection and go to login
      localStorage.removeItem('selected_school');
      navigate('/login');
    } catch (err) {
      console.error('Failed to mark onboarding complete:', err);
      // Still navigate even if update fails
      localStorage.removeItem('selected_school');
      navigate('/login');
    }
  };

  const handleSkip = () => {
    // Clear school selection and go to principal portal
    localStorage.removeItem('selected_school');
    navigate('/principal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-secondary/30 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl">Data Onboarding</CardTitle>
                  <CardDescription className="text-base">
                    {school.name || 'Upload your school data'}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => {
                  // Clear selected school when going back
                  localStorage.removeItem('selected_school');
                  navigate('/school-selection');
                }}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Progress */}
        <Card className="card-professional">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Upload Progress</span>
                <span className="text-muted-foreground">{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-secondary/50 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Upload Excel files containing your school data. Each file should follow the provided template format.
              You can download templates below each upload section.
            </p>
          </CardContent>
        </Card>

        {/* Upload Sections */}
        <div className="space-y-6">
          {/* Staff Upload */}
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Staff Data</CardTitle>
                  <CardDescription>
                    Upload teachers and counsellors information
                  </CardDescription>
                </div>
                {uploadStatus.staff === 'success' && (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUpload('staff')}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileSelect('staff', e.target.files?.[0] || null)}
                    className="hidden"
                    id="staff-upload"
                    disabled={uploadStatus.staff === 'success'}
                  />
                  <label
                    htmlFor="staff-upload"
                    className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploadStatus.staff === 'success' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-border hover:border-primary hover:bg-secondary/50'
                    }`}
                  >
                    <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedFiles.staff?.name || 'Choose Excel file'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Teachers, Counsellors (Excel format)
                      </p>
                    </div>
                  </label>
                </div>
                <Button
                  onClick={() => handleUpload('staff')}
                  disabled={!selectedFiles.staff || uploadStatus.staff === 'uploading' || uploadStatus.staff === 'success'}
                  className="gap-2"
                >
                  {uploadStatus.staff === 'uploading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : uploadStatus.staff === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>

              {errors.staff && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-destructive rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.staff}</p>
                </div>
              )}

              {uploadResults.staff && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ {uploadResults.staff.message} ({uploadResults.staff.count} records)
                  </p>
                </div>
              )}

              <Button 
                variant="link" 
                size="sm" 
                className="text-primary"
                onClick={() => window.open('http://localhost:8000/api/v1/templates/staff-template', '_blank')}
              >
                Download Staff Template
              </Button>
            </CardContent>
          </Card>

          {/* Students & Parents Upload */}
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Students & Parents Data</CardTitle>
                  <CardDescription>
                    Upload students and their parent information
                  </CardDescription>
                </div>
                {uploadStatus.students === 'success' && (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUpload('students')}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileSelect('students', e.target.files?.[0] || null)}
                    className="hidden"
                    id="students-upload"
                    disabled={uploadStatus.students === 'success'}
                  />
                  <label
                    htmlFor="students-upload"
                    className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploadStatus.students === 'success' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-border hover:border-primary hover:bg-secondary/50'
                    }`}
                  >
                    <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedFiles.students?.name || 'Choose Excel file'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Students, Parents (Excel format)
                      </p>
                    </div>
                  </label>
                </div>
                <Button
                  onClick={() => handleUpload('students')}
                  disabled={!selectedFiles.students || uploadStatus.students === 'uploading' || uploadStatus.students === 'success'}
                  className="gap-2"
                >
                  {uploadStatus.students === 'uploading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : uploadStatus.students === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>

              {errors.students && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-destructive rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.students}</p>
                </div>
              )}

              {uploadResults.students && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ {uploadResults.students.message} ({uploadResults.students.count} records)
                  </p>
                </div>
              )}

              <Button 
                variant="link" 
                size="sm" 
                className="text-primary"
                onClick={() => window.open('http://localhost:8000/api/v1/templates/students-template', '_blank')}
              >
                Download Students & Parents Template
              </Button>
            </CardContent>
          </Card>

          {/* Classes Upload */}
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Classes Data</CardTitle>
                  <CardDescription>
                    Upload class sections and assignments
                  </CardDescription>
                </div>
                {uploadStatus.classes === 'success' && (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUpload('classes')}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileSelect('classes', e.target.files?.[0] || null)}
                    className="hidden"
                    id="classes-upload"
                    disabled={uploadStatus.classes === 'success'}
                  />
                  <label
                    htmlFor="classes-upload"
                    className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploadStatus.classes === 'success' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-border hover:border-primary hover:bg-secondary/50'
                    }`}
                  >
                    <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedFiles.classes?.name || 'Choose Excel file'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Classes, Sections (Excel format)
                      </p>
                    </div>
                  </label>
                </div>
                <Button
                  onClick={() => handleUpload('classes')}
                  disabled={!selectedFiles.classes || uploadStatus.classes === 'uploading' || uploadStatus.classes === 'success'}
                  className="gap-2"
                >
                  {uploadStatus.classes === 'uploading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : uploadStatus.classes === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>

              {errors.classes && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-destructive rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.classes}</p>
                </div>
              )}

              {uploadResults.classes && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ {uploadResults.classes.message} ({uploadResults.classes.count} records)
                  </p>
                </div>
              )}

              <Button 
                variant="link" 
                size="sm" 
                className="text-primary"
                onClick={() => window.open('http://localhost:8000/api/v1/templates/classes-template', '_blank')}
              >
                Download Classes Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleSkip}>
            Skip for Now
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!allUploadsComplete()}
            size="lg"
            className="gap-2"
          >
            Complete & Go to Login
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Need help? Contact support@wellnestgroup.com
        </p>
      </div>
    </div>
  );
}
