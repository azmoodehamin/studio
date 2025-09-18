import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Configure integrations and application defaults.</p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="vault-path">Vault Path</Label>
                    <div className="flex items-center gap-2">
                        <Input id="vault-path" defaultValue="cubbyhole/vpn-commander" />
                        <Button variant="outline">Test Vault</Button>
                    </div>
                    <CardDescription>Path convention for storing secrets in HashiCorp Vault.</CardDescription>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="acme-provider">ACME Provider</Label>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="http-01">
                            <SelectTrigger id="acme-provider">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="http-01">HTTP-01</SelectItem>
                                <SelectItem value="dns-01">DNS-01 (Cloudflare)</SelectItem>
                                <SelectItem value="dns-02">DNS-01 (Route53)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">Test ACME</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>AI Provider</CardTitle>
                <CardDescription>Configure a custom OpenAI-compatible endpoint.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="openai-url">OpenAI Compatible URL</Label>
                    <Input id="openai-url" placeholder="https://api.example.com/v1" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="api-token">API Token</Label>
                    <Input id="api-token" type="password" placeholder="sk-..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="model-id">Model ID</Label>
                    <Input id="model-id" placeholder="gpt-4-turbo" />
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Database</CardTitle>
                 <CardDescription>Configure the PostgreSQL connection URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="postgresql-url">PostgreSQL URL</Label>
                    <Input id="postgresql-url" type="password" placeholder="postgresql://user:password@host:port/db" />
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="concurrency">Concurrency Cap</Label>
                    <Input id="concurrency" type="number" defaultValue="20" className="w-48" />
                    <CardDescription>Maximum number of concurrent provisioning runs.</CardDescription>
                </div>
                <div className="grid gap-2">
                    <Label>Default Hardening Level</Label>
                    <RadioGroup defaultValue="moderate" className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="moderate" id="r-moderate" />
                            <Label htmlFor="r-moderate" className="font-normal">Moderate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="strict" id="r-strict" />
                            <Label htmlFor="r-strict" className="font-normal">Strict</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="default-region">Default Region</Label>
                     <Select defaultValue="us-east-edge">
                        <SelectTrigger id="default-region" className="w-72">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="us-east-edge">🇺🇸 US East (Edge)</SelectItem>
                            <SelectItem value="eu-central-relay">🇩🇪 EU Central (Relay)</SelectItem>
                            <SelectItem value="ap-south-gateway">🇮🇳 AP South (Gateway)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button>Save Settings</Button>
        </div>
    </div>
  )
}
