'use client';

import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const reports = [
  { id: '1', name: 'Daily Sales Report', type: 'Sales', lastGenerated: '2025-01-20', status: 'Ready' },
  { id: '2', name: 'Monthly Revenue Analytics', type: 'Revenue', lastGenerated: '2025-01-15', status: 'Ready' },
  { id: '3', name: 'Inventory Health Report', type: 'Inventory', lastGenerated: '2025-01-14', status: 'Generating' },
  { id: '4', name: 'Customer Retention Analysis', type: 'Customer', lastGenerated: '2025-01-13', status: 'Ready' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Generate, view, and export business intelligence reports</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Active</div>
            <p className="text-xs text-muted-foreground mt-1">Next: Daily Sales (Tomorrow 08:00)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Export Format</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PDF, CSV, XLSX</div>
            <p className="text-xs text-muted-foreground mt-1">High fidelity exports supported</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Freshness</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Real-time</div>
            <p className="text-xs text-muted-foreground mt-1">Syncing with live store data</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Access your generated reports and analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4">
                          {report.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Generated: {report.lastGenerated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                    <Button variant="ghost" size="icon" disabled={report.status !== 'Ready'}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Analysis</CardTitle>
            <CardDescription>Generate instant visual insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Sales Distribution
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="h-4 w-4 mr-2" />
              Category Performance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growth Projections
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
