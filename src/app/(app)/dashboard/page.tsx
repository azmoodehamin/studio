import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Server, Clock, AlertTriangle } from "lucide-react"
import { ProvisionRunsChart, StepFailuresChart } from "./charts"
import type { ProvisionRun } from "@/types"
import { cn } from "@/lib/utils"

const kpis = [
  { title: "Ready Servers", value: "0", icon: Server },
  { title: "Time-to-Ready (p95)", value: "0s", icon: Clock },
  { title: "Fail Rate", value: "0%", icon: AlertTriangle, color: "text-destructive" },
]

const recentRuns: ProvisionRun[] = []

const StatusBadge = ({ status }: { status: ProvisionRun['status'] }) => {
    const statusClasses = {
        Ready: "bg-green-500/20 text-green-400 border-green-500/30",
        Provisioning: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse",
        Failed: "bg-red-500/20 text-red-400 border-red-500/30",
        Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    }
    return <Badge className={cn("capitalize", statusClasses[status])}>{status}</Badge>
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={cn("h-4 w-4 text-muted-foreground", kpi.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProvisionRunsChart />
        <StepFailuresChart />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Server</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentRuns.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No recent runs.
                            </TableCell>
                        </TableRow>
                    ) : (
                        recentRuns.map((run) => (
                            <TableRow key={run.id}>
                                <TableCell className="font-medium">{run.serverHostname}</TableCell>
                                <TableCell>{run.plan}</TableCell>
                                <TableCell><StatusBadge status={run.status} /></TableCell>
                                <TableCell>{run.startedAt}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
