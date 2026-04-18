import { DesignForm } from "../form";

export default function NewDesignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">New Design</h1>
        <p className="mt-1 text-white/50">Add a new design to your library</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0A0B14] p-6">
        <DesignForm />
      </div>
    </div>
  );
}