export type Server = {
  id: string;
  hostname: string;
  region: string;
  role: 'edge' | 'relay' | 'gateway';
  status: 'Ready' | 'Provisioning' | 'Failed';
  engines: string[];
  public_ip: string;
  os: string;
  arch: string;
};

export type ProvisionRun = {
  id: string;
  serverId: string;
  serverHostname: string;
  plan: string;
  status: 'Ready' | 'Provisioning' | 'Failed' | 'Pending';
  startedAt: string;
  correlationId: string;
  steps: { name: string; status: 'Completed' | 'InProgress' | 'Failed' | 'Pending'; log: string }[];
};

export type ProvisionPlan = {
  id: string;
  name: string;
  steps: string[];
  osFamily: string;
  versionPins: { name: string; version: string }[];
  hardeningLevel: 'strict' | 'moderate';
};
