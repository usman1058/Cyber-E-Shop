'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, RefreshCw, History, Shield, Cloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminBackupPage() {
    const backupHistory = [
        { id: 1, date: '2025-01-20 14:30', size: '2.4 MB', type: 'Full', status: 'Success' },
        { id: 2, date: '2025-01-19 14:30', size: '2.3 MB', type: 'Full', status: 'Success' },
        { id: 3, date: '2025-01-18 14:30', size: '2.3 MB', type: 'Full', status: 'Success' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Backup</h1>
                    <p className="text-sm text-muted-foreground">Manage system backups and data restoration</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <History className="h-4 w-4 mr-2" />
                        History
                    </Button>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Create Backup
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Database className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Database Backup</CardTitle>
                                <CardDescription>Full backup of system data and configurations</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Last successful backup</span>
                                <Badge className="bg-green-500">Scheduled</Badge>
                            </div>
                            <p className="text-2xl font-bold">2025-01-20 14:30</p>
                            <p className="text-xs text-muted-foreground mt-1">Automatic backups are running daily</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full">
                                <Cloud className="mr-2 h-4 w-4" />
                                Cloud Backup
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <RefreshCw className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Restore System</CardTitle>
                                <CardDescription>Restore data from a previous backup file</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Click to upload backup file</p>
                            <p className="text-xs text-muted-foreground">Support .sql, .backup, .zip formats</p>
                        </div>
                        <Button variant="outline" className="w-full">
                            <Shield className="mr-2 h-4 w-4" />
                            Verify & Restore
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Backups</CardTitle>
                        <CardDescription>History of the last system backups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {backupHistory.map((backup) => (
                                <div key={backup.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <History className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{backup.date}</p>
                                            <p className="text-xs text-muted-foreground">{backup.size} • {backup.type} Backup</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{backup.status}</Badge>
                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
