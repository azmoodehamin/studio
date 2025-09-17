import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, RefreshCw, Undo2, CheckCircle2, XCircle, Loader, CircleDashed } from "lucide-react";
import type { ProvisionRun } from "@/types";

const runs: ProvisionRun[] = [
  {
    id: "run-xyz-123",
    serverId: "srv-abc-456",
    serverHostname: "edge-us-east-1a",
    plan: "Standard WireGuard Edge",
    status: "Provisioning",
    startedAt: "5 minutes ago",
    correlationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    steps: [
      { name: "Enrollment", status: "Completed", log: "Server enrolled successfully." },
      { name: "Hardening", status: "Completed", log: "SSH key-only, UFW configured." },
      { name: "WireGuard", status: "InProgress", log: "Installing WireGuard packages..." },
      { name: "Network", status: "Pending", log: "" },
      { name: "Observability", status: "Pending", log: "" },
    ],
  },
  {
    id: "run-abc-789",
    serverId: "srv-def-123",
    serverHostname: "relay-eu-west-1b",
    plan: "High-Security Relay",
    status: "Failed",
    startedAt: "2 hours ago",
    correlationId: "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    steps: [
      { name: "Enrollment", status: "Completed", log: "Server enrolled successfully." },
      { name: "Hardening", status: "Failed", log: "Failed to apply sysctl settings. Permission denied." },
      { name: "WireGuard", status: "Pending", log: "" },
      { name: "Network", status: "Pending", log: "" },
    ],
  },
];

const StatusIcon = ({ status }: { status: ProvisionRun['steps'][0]['status'] }) => {
  switch (status) {
    case 'Completed': return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    case 'InProgress': return <Loader className="h-5 w-5 text-blue-400 animate-spin" />;
    case 'Failed': return <XCircle className="h-5 w-5 text-destructive" />;
    case 'Pending': return <CircleDashed className="h-5 w-5 text-muted-foreground" />;
    default: return null;
  }
};

export default function RunsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provision Runs</h1>
        <p className="text-muted-foreground">Monitor and control ongoing and past provisioning processes.</p>
      </div>

      <div className="space-y-8">
        {runs.map((run) => (
          <Card key={run.id} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{run.serverHostname}</CardTitle>
                  <CardDescription>Plan: {run.plan} &bull; Started: {run.startedAt}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4"/>Retry Step</Button>
                    <Button variant="outline" size="sm"><Undo2 className="mr-2 h-4 w-4"/>Rollback Step</Button>
                    <Button variant="outline" size="sm"><ArrowDownToLine className="mr-2 h-4 w-4"/>Download Logs</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {run.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <StatusIcon status={step.status} />
                        {index < run.steps.length - 1 && <div className="w-px h-10 bg-border mt-2"></div>}
                    </div>
                    <div className="flex-1 -mt-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{step.name}</p>
                        <Badge variant={step.status === 'InProgress' ? 'default' : 'secondary'} className="capitalize">{step.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono mt-1 bg-muted/30 p-2 rounded-md">{step.log || '...'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
