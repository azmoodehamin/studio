import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";

const metrics = [
    {
        name: "Provision Runs Total",
        metric: `provision_runs_total{status="ready"} 1024\nprovision_runs_total{status="failed"} 22`,
    },
    {
        name: "Server Ready Time",
        metric: `# HELP server_ready_time_seconds Time taken for a server to become ready.\n# TYPE server_ready_time_seconds histogram\nserver_ready_time_seconds_bucket{le="300"} 850\nserver_ready_time_seconds_bucket{le="600"} 980\nserver_ready_time_seconds_bucket{le="+Inf"} 1024`,
    },
    {
        name: "Step Failures Total",
        metric: `step_failures_total{step="hardening"} 12\nstep_failures_total{step="network"} 8`,
    }
]

export default function MetricsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observability Metrics</h1>
          <p className="text-muted-foreground">Preview of exposed Prometheus metrics.</p>
        </div>
        <div className="flex items-center gap-2">
            <CardDescription>/metrics</CardDescription>
            <Button variant="outline" size="sm"><Copy className="mr-2 h-4 w-4"/>Copy Endpoint</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.name} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative rounded-md bg-muted/50 p-4 font-mono text-xs">
                    <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7">
                        <Copy className="h-4 w-4"/>
                        <span className="sr-only">Copy metric</span>
                    </Button>
                    <pre className="overflow-auto">{metric.metric}</pre>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
