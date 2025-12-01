import { useState } from "react";
import { FileText, Download, Calendar, Filter, Send, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/shared/StatCard";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("monthly");
  const [timeRange, setTimeRange] = useState("current");

  const stats = [
    { title: "Reports Generated", value: "47", icon: FileText },
    { title: "Scheduled Reports", value: "12", icon: Calendar },
    { title: "Downloads This Month", value: "189", icon: Download },
    { title: "Recipients", value: "23", icon: Send }
  ];

  const recentReports = [
    { name: "Monthly Wellbeing Summary", date: "2024-01-15", type: "Automated", status: "Completed", recipients: 8 },
    { name: "Risk Assessment Overview", date: "2024-01-14", type: "Manual", status: "Completed", recipients: 3 },
    { name: "Class Performance Analysis", date: "2024-01-13", type: "Scheduled", status: "Completed", recipients: 12 },
    { name: "Consent Status Report", date: "2024-01-12", type: "Manual", status: "Completed", recipients: 2 },
    { name: "Quarterly Trends Analysis", date: "2024-01-10", type: "Automated", status: "Completed", recipients: 15 },
  ];

  const scheduledReports = [
    { name: "Weekly Wellbeing Dashboard", frequency: "Weekly", nextRun: "2024-01-22", recipients: ["Leadership Team"] },
    { name: "Monthly Comprehensive Report", frequency: "Monthly", nextRun: "2024-02-01", recipients: ["School Board", "Principal"] },
    { name: "Quarterly Analytics", frequency: "Quarterly", nextRun: "2024-03-31", recipients: ["District Office"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and manage comprehensive wellbeing reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Report Generation</CardTitle>
              <CardDescription>Generate standard reports with customizable parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Summary</SelectItem>
                      <SelectItem value="wellbeing">Wellbeing Analysis</SelectItem>
                      <SelectItem value="risk">Risk Assessment</SelectItem>
                      <SelectItem value="consent">Consent Status</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Month</SelectItem>
                      <SelectItem value="previous">Previous Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium">Executive Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    High-level overview for leadership team
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Generate
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium">Detailed Analytics</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive data analysis and trends
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Generate
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-medium">Compliance Report</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Regulatory compliance and audit trail
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Generate
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduledReports.map((report, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm">{report.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {report.frequency} • Next: {report.nextRun}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    To: {report.recipients.join(', ')}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Send className="mr-2 h-4 w-4" />
                Email Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Recently generated reports and their delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Generated: {report.date} • {report.recipients} recipients
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={report.type === 'Automated' ? 'default' : 'outline'}>
                    {report.type}
                  </Badge>
                  <Badge variant="default">{report.status}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      Resend
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Build custom reports with specific metrics and filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium mb-1">Wellbeing Metrics</h4>
              <p className="text-xs text-muted-foreground">Student wellbeing scores and trends</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <h4 className="font-medium mb-1">Risk Analysis</h4>
              <p className="text-xs text-muted-foreground">Risk assessment and intervention data</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <h4 className="font-medium mb-1">Activity Reports</h4>
              <p className="text-xs text-muted-foreground">Program participation and outcomes</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Filter className="h-8 w-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <h4 className="font-medium mb-1">Custom Filters</h4>
              <p className="text-xs text-muted-foreground">Grade, class, and demographic filters</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}