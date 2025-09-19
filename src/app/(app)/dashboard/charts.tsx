
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { day: "Monday", runs: 5 },
  { day: "Tuesday", runs: 8 },
  { day: "Wednesday", runs: 12 },
  { day: "Thursday", runs: 7 },
  { day: "Friday", runs: 15 },
  { day: "Saturday", runs: 10 },
  { day: "Sunday", runs: 11 },
]

const chartConfig = {
  runs: {
    label: "Provision Runs",
    color: "hsl(var(--primary))",
  },
}

export function ProvisionRunsChart() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Provision Runs</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="runs" fill="var(--color-runs)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const stepFailuresData = [
  { step: 'Install WireGuard', failures: 12 },
  { step: 'Configure Firewall', failures: 8 },
  { step: 'Generate Keys', failures: 5 },
  { step: 'Setup Netdata', failures: 3 },
  { step: 'ACME Challenge', failures: 2 },
]

const stepFailuresConfig = {
    failures: {
        label: "Failures",
        color: "hsl(var(--destructive))",
    }
}

export function StepFailuresChart() {
    return (
        <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Step Failures</CardTitle>
          <CardDescription>Most common failure points</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={stepFailuresConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={stepFailuresData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="step"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis type="number" dataKey="failures" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="failures" fill="var(--color-failures)" radius={5} layout="vertical" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
}
