import Link from "next/link";
import { getAllDesigns } from "@/lib/actions/design-actions";
import { Plus, Search, Edit, Eye, Globe } from "lucide-react";
import { DeleteDesignButton } from "./delete-button";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DesignsPage() {
  await cookies(); // Trigger dynamic rendering
  const designs = await getAllDesigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Designs</h1>
          <p className="mt-1 text-sm text-white/50">Manage your design library</p>
        </div>
        <Link
          href="/admin/designs/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#E9F284] px-4 py-2.5 text-sm font-medium text-[#090A11] transition-colors hover:bg-[#d4e87a]"
        >
          <Plus size={18} />
          New Design
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white/30" size={18} />
        <input
          type="text"
          placeholder="Search designs..."
          className="w-full rounded-lg border border-white/10 bg-[#0A0B14] py-2.5 pr-4 pl-10 text-sm text-white transition-colors placeholder:text-white/30 focus:border-[#E9F284] focus:outline-none"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-[#0A0B14] lg:block">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/50 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/50 uppercase">Slug</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/50 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/50 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-white/50 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {designs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                  No designs yet. Create your first design!
                </td>
              </tr>
            ) : (
              designs.map((design) => (
                <tr key={design.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E9F284]/10 text-[#E9F284]">
                        <Globe size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-white">{design.name}</div>
                        <div className="max-w-[200px] truncate text-xs text-white/50">{design.url}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="rounded bg-white/5 px-2 py-1 text-xs text-[#E9F284]">
                      {design.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
                      {design.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {design.is_published ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-yellow-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/designs/${design.id}`}
                        className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteDesignButton id={design.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {designs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#0A0B14] p-12 text-center text-white/50">
            No designs yet.
          </div>
        ) : (
          designs.map((design) => (
            <div key={design.id} className="space-y-4 rounded-xl border border-white/10 bg-[#0A0B14] p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E9F284]/10 text-[#E9F284]">
                    <Globe size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{design.name}</div>
                    <div className="text-xs text-white/50">{design.url}</div>
                  </div>
                </div>
                {design.is_published ? (
                  <span className="rounded-full bg-green-400/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                    Draft
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <code className="rounded bg-white/5 px-2 py-1 text-[10px] text-[#E9F284]">
                  {design.slug}
                </code>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/70">
                  {design.category}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-2">
                <Link
                  href={`/admin/designs/${design.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Edit size={14} />
                  Edit
                </Link>
                <DeleteDesignButton id={design.id} className="flex-1" />
              </div>
            </div>
          ))
        )}
      </div>

      {designs.length > 0 && (
        <div className="text-sm text-white/50">
          Showing {designs.length} design{designs.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
