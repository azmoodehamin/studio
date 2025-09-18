import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";

const metrics: any[] = []

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
      )}
    </div>
  )
}
