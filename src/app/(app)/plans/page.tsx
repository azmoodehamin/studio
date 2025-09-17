import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Copy, Edit, Archive } from "lucide-react";
import type { ProvisionPlan } from "@/types";

const plans: ProvisionPlan[] = [
  {
    id: 'plan-1',
    name: "Standard WireGuard Edge",
    steps: ["Enrollment", "Hardening", "WireGuard", "Network", "Observability"],
    osFamily: "Ubuntu/Debian",
    versionPins: [{ name: "WireGuard", version: "1.0.20210914" }],
    hardeningLevel: "moderate",
  },
  {
    id: 'plan-2',
    name: "High-Security Relay",
    steps: ["Enrollment", "Hardening", "WireGuard", "Network", "TLS/ACME", "Obfuscation", "Observability"],
    osFamily: "Rocky/RHEL",
    versionPins: [{ name: "WireGuard", version: "1.0.20210914" }],
    hardeningLevel: "strict",
  },
  {
    id: 'plan-3',
    name: "Gateway with OpenVPN",
    steps: ["Enrollment", "Hardening", "OpenVPN", "Network", "Observability"],
    osFamily: "Any",
    versionPins: [{ name: "OpenVPN", version: "2.6.9" }],
    hardeningLevel: "moderate",
  }
];

export default function PlansPage() {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Provision Plans</h1>
                <p className="text-muted-foreground">Define and manage reusable server configurations.</p>
            </div>
            <Button>Create New Plan</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                        {plan.osFamily} &bull; {plan.hardeningLevel} hardening
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Provisioning Steps</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {plan.steps.map(step => (
                                <li key={step} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-400" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Version Pins</h4>
                        {plan.versionPins.map(pin => (
                            <Badge key={pin.name} variant="secondary">{pin.name} {pin.version}</Badge>
                        ))}
                    </div>
                </CardContent>
                <div className="flex items-center justify-end gap-2 p-4 border-t border-border/50">
                    <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /><span className="sr-only">Duplicate</span></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                    <Button variant="ghost" size="icon"><Archive className="h-4 w-4" /><span className="sr-only">Archive</span></Button>
                </div>
            </Card>
        ))}
        </div>
    </div>
  )
}
