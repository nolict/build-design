import { getDesignById } from "@/lib/actions/design-actions";
import { DesignForm } from "../form";
import { notFound } from "next/navigation";

interface EditDesignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDesignPage({ params }: EditDesignPageProps) {
  const { id } = await params;
  
  let design;
  try {
    design = await getDesignById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Design</h1>
        <p className="mt-1 text-white/50">Update design details</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0A0B14] p-6">
        <DesignForm 
          designId={id}
          initialData={{
            name: design.name,
            slug: design.slug,
            url: design.url,
            category: design.category,
            content: design.content,
            is_published: design.is_published,
          }}
        />
      </div>
    </div>
  );
}