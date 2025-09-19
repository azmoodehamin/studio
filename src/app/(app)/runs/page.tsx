
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, RefreshCw, Undo2, CheckCircle2, XCircle, Loader, CircleDashed } from "lucide-react";
import type { ProvisionRun } from "@/types";

const runs: ProvisionRun[] = [
    {
        id: "run-123",
        serverId: "srv-abc",
        serverHostname: "edge-us-east-1",
        plan: "Standard Edge",
        status: "Provisioning",
        startedAt: "2m ago",
        correlationId: "corr-xyz-1",
        steps: [
            { name: "Validate Metadata", status: "Completed", log: "Metadata valid." },
            { name: "Install WireGuard", status: "Completed", log: "wireguard-tools v1.0.20210914 installed." },
            { name: "Generate Keys", status: "InProgress", log: "Generating private key..." },
            { name: "Configure Firewall", status: "Pending", log: "" },
            { name: "Setup Netdata", status: "Pending", log: "" },
        ],
    },
    {
        id: "run-456",
        serverId: "srv-def",
        serverHostname: "relay-eu-central-1",
        plan: "Standard Relay",
        status: "Failed",
        startedAt: "28m ago",
        correlationId: "corr-xyz-2",
        steps: [
            { name: "Validate Metadata", status: "Completed", log: "Metadata valid." },
            { name: "Install WireGuard", status: "Completed", log: "wireguard-tools v1.0.20210914 installed." },
            { name: "Generate Keys", status: "Completed", log: "Keys generated and stored." },
            { name: "Configure Firewall", status: "Failed", log: "Error: Could not acquire lock on /var/run/xtables.lock" },
            { name: "Setup Netdata", status: "Pending", log: "" },
        ],
    },
    {
        id: "run-789",
        serverId: "srv-ghi",
        serverHostname: "gw-ap-south-1",
        plan: "Gateway Hardened",
        status: "Ready",
        startedAt: "2h ago",
        correlationId: "corr-xyz-3",
        steps: [
            { name: "Validate Metadata", status: "Completed", log: "Metadata valid." },
            { name: "Apply Hardening", status: "Completed", log: "Strict hardening policy applied." },
            { name: "Install WireGuard", status: "Completed", log: "wireguard-tools v1.0.20210914 installed." },
            { name: "Generate Keys", status: "Completed", log: "Keys generated and stored." },
            { name: "Basic NAT Setup", status: "Completed", log: "NAT configured for eth0." },
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
        {runs.length === 0 ? (
             <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                    <h3 className="text-lg font-semibold">No Runs Found</h3>
                    <p className="text-muted-foreground">Provision a server to see its run history here.</p>
                </CardContent>
            </Card>
        ) : (
            runs.map((run) => (
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
            ))
        )}
      </div>
    </div>
  )
}
