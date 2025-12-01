import { useState } from 'react';
import { Eye, AlertTriangle, FileText, Users, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ViewCaseDetailModal } from '@/components/modals/ViewCaseDetailModal';
import { FilterSection } from '@/components/shared/FilterSection';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useCases } from '@/hooks/useCases';
import { useAuth } from '@/contexts/AuthContext';
import { getRiskLevelColor, formatRiskLevel } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function TeacherCasesPage() {
  const { user } = useAuth();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Fetch all cases
  const { data: casesResponse = [], isLoading } = useCases({});

  // Debug logging
  console.log('Teacher User ID:', user?.id);
  console.log('Cases Response:', casesResponse);
  console.log('Is Array:', Array.isArray(casesResponse));
  
  // Transform and filter cases to only show teacher's students
  // Filter by matching the teacher's user_id with the teacher info in the case
  const allCases = Array.isArray(casesResponse) ? casesResponse
    .map((item: any) => {
      const mapped = {
        ...item.case,
        student: item.student,
        counsellor: item.counsellor,
        teacher: item.teacher,
      };
      console.log('Mapped case:', mapped);
      console.log('Teacher in case:', mapped.teacher);
      return mapped;
    })
    .filter((caseItem: any) => {
      // Check if this case belongs to a student in the teacher's class
      // The teacher info is embedded in the case data
      const matches = caseItem.teacher?.user_id === user?.id;
      console.log(`Case ${caseItem.case_id} - Teacher ID: ${caseItem.teacher?.user_id}, User ID: ${user?.id}, Matches: ${matches}`);
      return matches;
    })
    : [];
  
  console.log('All Cases after filter:', allCases);

  // Apply filters
  const filteredCases = allCases.filter((caseItem: any) => {
    const matchesSearch = searchQuery === '' || 
      caseItem.student?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.student?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.student?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = selectedRiskLevels.length === 0 || selectedRiskLevels.includes(caseItem.risk_level);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(caseItem.status?.toUpperCase());
    
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const handleViewCase = (caseData: any) => {
    setSelectedCase(caseData);
    setIsCaseModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'intake':
        return 'bg-primary text-primary-foreground';
      case 'assessment':
        return 'bg-accent text-accent-foreground';
      case 'intervention':
        return 'bg-warning text-warning-foreground';
      case 'monitoring':
        return 'bg-yellow-500 text-white dark:bg-yellow-600';
      case 'closed':
        return 'bg-gray-500 text-white dark:bg-gray-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Student Cases
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-1">
              View mental health cases for your students
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
            </div>
            
            <FilterSection 
              title="Risk Level" 
              options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']} 
              selected={selectedRiskLevels} 
              setSelected={setSelectedRiskLevels} 
            />

            <div className="mt-6">
              <FilterSection 
                title="Status" 
                options={['INTAKE', 'ASSESSMENT', 'INTERVENTION', 'MONITORING', 'CLOSED']} 
                selected={selectedStatuses} 
                setSelected={setSelectedStatuses} 
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-6 text-gray-500 hover:text-primary border-dashed"
              onClick={() => {
                setSelectedRiskLevels([]);
                setSelectedStatuses([]);
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white dark:bg-card border-gray-200 dark:border-border focus:border-primary rounded-xl"
            />
          </div>

          {/* Cases List */}
          <Card className="card-professional shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Active Cases</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Cases for students in your classes
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredCases.length} Cases
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-base text-muted-foreground font-semibold mb-1">
                No cases found
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedRiskLevels.length > 0 || selectedStatuses.length > 0
                  ? 'Try adjusting your filters'
                  : 'No active cases for your students'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem: any, index) => (
                <div
                  key={caseItem.case_id}
                  className="group relative p-5 border-2 border-border rounded-xl hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleViewCase(caseItem)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-foreground text-lg">
                          {caseItem.student?.first_name && caseItem.student?.last_name
                            ? `${caseItem.student.first_name} ${caseItem.student.last_name}`
                            : caseItem.student?.name || 'Unknown Student'}
                        </p>
                        <Badge className={`${getRiskLevelColor(caseItem.risk_level)} font-semibold`}>
                          {formatRiskLevel(caseItem.risk_level)}
                        </Badge>
                        <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                          {caseItem.status}
                        </Badge>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {caseItem.ai_summary || caseItem.description || 'No summary available'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>Counsellor: {caseItem.counsellor?.name || 'Unassigned'}</span>
                          </div>
                          {caseItem.created_at && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Created: {new Date(caseItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
          </Card>
        </div>
      </div>

      {/* Case Detail Modal */}
      <ViewCaseDetailModal
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCase(null);
        }}
        caseData={selectedCase}
      />
    </div>
  );
}
