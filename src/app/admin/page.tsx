import { getAllDesigns } from "@/lib/actions/design-actions";
import { FileText, Eye, Clock } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getStats() {
  await cookies(); // Trigger dynamic rendering
  const designs = await getAllDesigns();
  const publishedCount = designs.filter((d) => d.is_published).length;

  return {
    totalDesigns: designs.length,
    publishedDesigns: publishedCount,
    draftDesigns: designs.length - publishedCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Designs",
      value: stats.totalDesigns,
      icon: FileText,
      color: "text-[#E9F284]",
    },
    {
      title: "Published",
      value: stats.publishedDesigns,
      icon: Eye,
      color: "text-green-400",
    },
    {
      title: "Drafts",
      value: stats.draftDesigns,
      icon: Clock,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-white/50">Manage your design library</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-white/10 bg-[#0A0B14] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              </div>
              <card.icon className={card.color} size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0A0B14] p-6">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 flex gap-4">
          <Link
            href="/admin/designs/new"
            className="rounded-lg bg-[#E9F284] px-4 py-2 text-sm font-medium text-[#090A11] hover:bg-[#d4e87a]"
          >
            + New Design
          </Link>
          <Link
            href="/browse"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
          >
            Preview Site
          </Link>
        </div>
      </div>
    </div>
  );
}
