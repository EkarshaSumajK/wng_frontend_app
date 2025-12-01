import { useState } from "react";
import { Shield, Users, FileText, Settings, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { mockConsentRecords } from "@/data/mockData";

export default function GovernancePage() {
  const [consentFilter, setConsentFilter] = useState<string>("all");

  const filteredConsents = mockConsentRecords.filter(record => 
    consentFilter === "all" || record.status === consentFilter
  );

  const grantedCount = mockConsentRecords.filter(r => r.status === 'granted').length;
  const pendingCount = mockConsentRecords.filter(r => r.status === 'pending').length;
  const deniedCount = mockConsentRecords.filter(r => r.status === 'denied').length;
  const expiringCount = mockConsentRecords.filter(r => {
    const expiry = new Date(r.expiresAt || '');
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  }).length;

  const stats = [
    { title: "Active Consents", value: grantedCount.toString(), icon: CheckCircle },
    { title: "Pending Approvals", value: pendingCount.toString(), icon: Clock },
    { title: "Expiring Soon", value: expiringCount.toString(), icon: AlertCircle },
    { title: "Compliance Rate", value: "94%", icon: Shield }
  ];

  const columns = [
    {
      key: "studentName",
      label: "Student",
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.studentName}</div>
          <div className="text-sm text-muted-foreground">Parent: {record.parentName}</div>
        </div>
      ),
    },
    {
      key: "consentType",
      label: "Consent Type",
      render: (record: any) => (
        <Badge variant="outline" className="capitalize">
          {record.consentType.replace('-', ' ')}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (record: any) => (
        <Badge variant={
          record.status === 'granted' ? 'default' :
          record.status === 'pending' ? 'secondary' :
          record.status === 'denied' ? 'destructive' : 'outline'
        }>
          {record.status}
        </Badge>
      ),
    },
    {
      key: "grantedAt",
      label: "Date Granted",
      render: (record: any) => (
        <span className="text-sm">
          {record.grantedAt ? new Date(record.grantedAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: "expiresAt",
      label: "Expires",
      render: (record: any) => (
        <span className="text-sm">
          {record.expiresAt ? new Date(record.expiresAt).toLocaleDateString() : 'No expiry'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Governance & Compliance</h1>
          <p className="text-muted-foreground">Manage consent, policies, and data governance</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Compliance Report
        </Button>
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
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>
                Track parental consent for student wellbeing programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={filteredConsents}
                columns={columns}
                actions={(record) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {record.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Follow Up
                      </Button>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Risk Alerts</p>
                  <p className="text-sm text-muted-foreground">Send alerts for high-risk students</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Retention (2 years)</p>
                  <p className="text-sm text-muted-foreground">Automatically archive old records</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Consent Expiry Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify 30 days before expiry</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Anonymous Analytics</p>
                  <p className="text-sm text-muted-foreground">Enable aggregated reporting</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Users</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Counsellor Access</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Teacher Access</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Admin Access</span>
                <span className="font-medium">7</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Encryption Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup Frequency</span>
              <span className="font-medium">Daily</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Access Logs</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Audit</span>
              <span className="font-medium">15 days ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">FERPA Compliance</span>
              <Badge variant="default">100%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">State Requirements</span>
              <Badge variant="default">Met</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Minimization</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Audit Trail</span>
              <Badge variant="default">Complete</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Policy updated: Data retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>New user added: J. Smith</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Consent granted: Student #234</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span>Expiry alert: 5 consents</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regulatory Framework</CardTitle>
          <CardDescription>Key compliance requirements and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                FERPA Compliance
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Educational privacy and records protection
              </p>
              <Badge variant="default">Compliant</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                State Mandates
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Student mental health reporting requirements
              </p>
              <Badge variant="default">Up to Date</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Parental Rights
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Consent and notification procedures
              </p>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Data Governance
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Data quality and lifecycle management
              </p>
              <Badge variant="default">Implemented</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}