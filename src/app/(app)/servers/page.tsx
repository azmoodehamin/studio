
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MoreHorizontal, FileText, RotateCw, ArrowUpCircle, PlusCircle } from "lucide-react";
import type { Server } from "@/types";
import { cn } from "@/lib/utils";

const servers: Server[] = [
    { id: "srv-1", hostname: "edge-us-east-1", region: "US East", role: "edge", status: "Ready", engines: ["wireguard", "netdata"], public_ip: "192.0.2.1", os: "Ubuntu 22.04", arch: "amd64" },
    { id: "srv-2", hostname: "relay-eu-central-1", region: "EU Central", role: "relay", status: "Provisioning", engines: ["wireguard"], public_ip: "198.51.100.2", os: "Debian 12", arch: "amd64" },
    { id: "srv-3", hostname: "gw-ap-south-1", region: "AP South", role: "gateway", status: "Ready", engines: ["wireguard", "auditd"], public_ip: "203.0.113.3", os: "Rocky 9", arch: "arm64" },
    { id: "srv-4", hostname: "edge-us-west-1", region: "US West", role: "edge", status: "Failed", engines: ["wireguard", "netdata"], public_ip: "192.0.2.4", os: "Ubuntu 22.04", arch: "amd64" },
    { id: "srv-5", hostname: "relay-eu-west-1", region: "EU West", role: "relay", status: "Ready", engines: ["wireguard"], public_ip: "198.51.100.5", os: "Debian 12", arch: "amd64" },
];


const StatusBadge = ({ status }: { status: Server['status'] }) => {
    const statusClasses = {
        Ready: "bg-green-500/20 text-green-400 border-green-500/30",
        Provisioning: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse",
        Failed: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return <Badge className={cn("capitalize", statusClasses[status])}>{status}</Badge>
}

export default function ServersPage() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div>
                <CardTitle>Servers</CardTitle>
                <CardDescription>Manage your VPN servers across all regions.</CardDescription>
            </div>
            <Link href="/enroll">
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Enroll New Server
              </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by hostname, IP..." className="pl-10" />
            </div>
            {/* Future filters can go here */}
        </div>
        <div className="overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostname</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engines</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No servers found. Enroll a server to get started.
                    </TableCell>
                </TableRow>
              ) : (
                servers.map((server) => (
                    <TableRow key={server.id}>
                    <TableCell className="font-medium">{server.hostname}</TableCell>
                    <TableCell>{server.region}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{server.role}</Badge></TableCell>
                    <TableCell><StatusBadge status={server.status} /></TableCell>
                    <TableCell>{server.engines.join(", ")}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Server Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Details</DropdownMenuItem>
                            <DropdownMenuItem><RotateCw className="mr-2 h-4 w-4" />Rotate</DropdownMenuItem>
                            <DropdownMenuItem><ArrowUpCircle className="mr-2 h-4 w-4" />Upgrade</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
