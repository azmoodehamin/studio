import { HardeningPlanForm } from './plan-form';

export const metadata = {
    title: 'Hardening Plan Generator',
    description: 'Generate a security hardening checklist for your servers.',
};

export default function HardeningPlanPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <HardeningPlanForm />
    </div>
  );
}
