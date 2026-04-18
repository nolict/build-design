"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDesign, updateDesign, getDesignById } from "@/lib/actions/design-actions";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface DesignFormProps {
  designId?: string;
  initialData?: {
    name: string;
    slug: string;
    url: string;
    category: string;
    content: string;
    is_published: boolean;
  };
}

const CATEGORIES = [
  "saas",
  "portfolio",
  "ecommerce",
  "blog",
  "documentation",
  "dashboard",
  "landing",
  "other",
];

export function DesignForm({ designId, initialData }: DesignFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!designId);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    url: initialData?.url || "",
    category: initialData?.category || "saas",
    content: initialData?.content || "",
    is_published: initialData?.is_published ?? true,
  });

  useEffect(() => {
    if (designId && !initialData) {
      getDesignById(designId)
        .then((data) => {
          setFormData({
            name: data.name,
            slug: data.slug,
            url: data.url,
            category: data.category,
            content: data.content,
            is_published: data.is_published,
          });
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [designId, initialData]);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, name, slug: prev.slug || slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (designId) {
        await updateDesign(designId, formData);
      } else {
        await createDesign(formData);
      }
      router.push("/admin/designs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#E9F284]" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/70">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0A0B14] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#E9F284] focus:outline-none"
            placeholder="e.g., Linear Clone"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-white/70">
            Slug <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0A0B14] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#E9F284] focus:outline-none"
            placeholder="e.g., linear-clone"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-white/70">
            Website URL <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            required
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0A0B14] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#E9F284] focus:outline-none"
            placeholder="https://linear.app"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-white/70">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0A0B14] px-4 py-2.5 text-sm text-white focus:border-[#E9F284] focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content (DESIGN.md) */}
      <div>
        <label className="block text-sm font-medium text-white/70">
          DESIGN.md Content <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={20}
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0A0B14] px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:border-[#E9F284] focus:outline-none"
          placeholder={`# Design DNA

## Atmosphere
...

## Colors
...

## Typography
...

## Components
...

## Layout
...

## Elevation
...

## AI Prompts
...`}
        />
        <p className="mt-1.5 text-xs text-white/50">
          Paste the full DESIGN.md content here. This will be used by the CLI.
        </p>
      </div>

      {/* Preview URL */}
      {formData.url && (
        <div className="rounded-lg border border-white/10 bg-[#0A0B14] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Preview URL</span>
            <a
              href={formData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#E9F284] hover:underline"
            >
              <ExternalLink size={14} />
              Open
            </a>
          </div>
        </div>
      )}

      {/* Publish Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, is_published: !prev.is_published }))}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            formData.is_published ? "bg-[#E9F284]" : "bg-white/20"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-[#090A11] transition-transform ${
              formData.is_published ? "left-6" : "left-1"
            }`}
          />
        </button>
        <span className="text-sm text-white/70">
          {formData.is_published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/designs"
          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-[#E9F284] px-6 py-2.5 text-sm font-medium text-[#090A11] hover:bg-[#d4e87a] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              {designId ? "Update Design" : "Create Design"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}