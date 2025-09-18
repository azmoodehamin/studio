import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentEnrollments: any[] = [];

const bootstrapScript = `curl -sfL https://get.vpncommander.dev/enroll.sh | sudo sh -s -- \\
--token YOUR_TOKEN_HERE \\
--fingerprint ABC:123 \\
--name edge-us-east-1`;

export default function EnrollPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Enroll New Server</CardTitle>
                <CardDescription>Generate a one-time token to securely enroll a new server.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input id="serverName" placeholder="e.g., edge-us-east-1" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="region">Region/Role</Label>
                    <Select>
                        <SelectTrigger id="region">
                            <SelectValue placeholder="Select a region and role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="us-east-edge">🇺🇸 US East (Edge)</SelectItem>
                            <SelectItem value="us-west-edge">🇺🇸 US West (Edge)</SelectItem>
                            <SelectItem value="eu-central-relay">🇩🇪 EU Central (Relay)</SelectItem>
                            <SelectItem value="eu-west-relay">🇬🇧 EU West (Relay)</SelectItem>
                            <SelectItem value="ap-south-gateway">🇮🇳 AP South (Gateway)</SelectItem>
                            <SelectItem value="ap-southeast-gateway">🇦🇺 AP Southeast (Gateway)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="os">Operating System</Label>
                    <Select>
                        <SelectTrigger id="os">
                            <SelectValue placeholder="Select an OS" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ubuntu22">Ubuntu 22.04 LTS</SelectItem>
                            <SelectItem value="debian12">Debian 12</SelectItem>
                            <SelectItem value="rocky9">Rocky Linux 9</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full">Generate one-time token</Button>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Bootstrap Script</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span>Includes fingerprint binding for security.</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative rounded-md bg-muted/50 p-4 font-mono text-sm">
                    <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7">
                        <Copy className="h-4 w-4"/>
                        <span className="sr-only">Copy script</span>
                    </Button>
                    <pre className="overflow-auto whitespace-pre-wrap">{bootstrapScript}</pre>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5">
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Token</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Enrolled Server</TableHead>
                            <TableHead>Expires In</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentEnrollments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No recent enrollments.
                                </TableCell>
                            </TableRow>
                        ) : (
                            recentEnrollments.map((e, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono">{e.token}</TableCell>
                                    <TableCell><Badge variant={e.status === 'Pending' ? 'default' : 'secondary'}>{e.status}</Badge></TableCell>
                                    <TableCell>{e.server}</TableCell>
                                    <TableCell>{e.expires}</TableCell>
                                    <TableCell>
                                        {e.status === 'Pending' && <Button variant="destructive" size="sm">Revoke</Button>}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
