import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const metrics = [
    {
        name: "vpn_server_cpu_usage_seconds_total",
        metric: `# HELP vpn_server_cpu_usage_seconds_total Total CPU time spent in seconds.
# TYPE vpn_server_cpu_usage_seconds_total counter
vpn_server_cpu_usage_seconds_total{mode="system"} 3456.78
vpn_server_cpu_usage_seconds_total{mode="user"} 5678.90
vpn_server_cpu_usage_seconds_total{mode="idle"} 123456.78`
    },
    {
        name: "vpn_server_memory_usage_bytes",
        metric: `# HELP vpn_server_memory_usage_bytes Memory usage in bytes.
# TYPE vpn_server_memory_usage_bytes gauge
vpn_server_memory_usage_bytes{type="total"} 17179869184
vpn_server_memory_usage_bytes{type="used"} 4823449600
vpn_server_memory_usage_bytes{type="free"} 12356419584`
    },
    {
        name: "vpn_wireguard_latest_handshake_seconds",
        metric: `# HELP vpn_wireguard_latest_handshake_seconds Latest handshake time for a peer.
# TYPE vpn_wireguard_latest_handshake_seconds gauge
vpn_wireguard_latest_handshake_seconds{peer="peer-1"} 1678886400
vpn_wireguard_latest_handshake_seconds{peer="peer-2"} 1678886405`
    },
     {
        name: "vpn_wireguard_transfer_bytes_total",
        metric: `# HELP vpn_wireguard_transfer_bytes_total Total bytes transferred for a peer.
# TYPE vpn_wireguard_transfer_bytes_total counter
vpn_wireguard_transfer_bytes_total{peer="peer-1",direction="rx"} 1024567
vpn_wireguard_transfer_bytes_total{peer="peer-1",direction="tx"} 2048912
vpn_wireguard_transfer_bytes_total{peer="peer-2",direction="rx"} 512345
vpn_wireguard_transfer_bytes_total{peer="peer-2",direction="tx"} 1024680`
    },
    {
        name: "vpn_provision_runs_total",
        metric: `# HELP vpn_provision_runs_total Total number of provision runs.
# TYPE vpn_provision_runs_total counter
vpn_provision_runs_total{status="success"} 142
vpn_provision_runs_total{status="failed"} 8`
    },
    {
        name: "vpn_provision_run_duration_seconds",
        metric: `# HELP vpn_provision_run_duration_seconds Duration of provision runs.
# TYPE vpn_provision_run_duration_seconds histogram
vpn_provision_run_duration_seconds_bucket{le="30"} 5
vpn_provision_run_duration_seconds_bucket{le="60"} 78
vpn_provision_run_duration_seconds_bucket{le="120"} 135
vpn_provision_run_duration_seconds_bucket{le="+Inf"} 142`
    }
]

export default function MetricsPage() {
  const { toast } = useToast();
  
  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('/metrics');
    toast({
        title: "Endpoint Copied",
        description: "The metrics endpoint has been copied to your clipboard.",
    })
  }

  const handleCopyMetric = (metric: string) => {
    navigator.clipboard.writeText(metric);
    toast({
        title: "Metric Copied",
        description: "The metric definition has been copied to your clipboard.",
    })
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observability Metrics</h1>
          <p className="text-muted-foreground">Preview of exposed Prometheus metrics.</p>
        </div>
        <div className="flex items-center gap-2">
            <CardDescription>/metrics</CardDescription>
            <Button variant="outline" size="sm" onClick={handleCopyEndpoint}><Copy className="mr-2 h-4 w-4"/>Copy Endpoint</Button>
        </div>
      </div>
      {metrics.length === 0 ? (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                    <h3 className="text-lg font-semibold">No Metrics Available</h3>
                    <p className="text-muted-foreground">Metrics will be exposed here once the application is running.</p>
                </CardContent>
            </Card>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.name} className="bg-card/50 backdrop-blur-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="relative rounded-md bg-muted/50 p-4 font-mono text-xs h-full">
                    <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={() => handleCopyMetric(metric.metric)}>
                        <Copy className="h-4 w-4"/>
                        <span className="sr-only">Copy metric</span>
                    </Button>
                    <pre className="overflow-auto whitespace-pre-wrap">{metric.metric}</pre>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}
