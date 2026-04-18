"use client";

import { useState } from "react";
import { deleteDesign } from "@/lib/actions/design-actions";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteDesignButtonProps {
  id: string;
  className?: string;
}

export function DeleteDesignButton({ id, className }: DeleteDesignButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this design?")) return;

    setIsDeleting(true);
    try {
      await deleteDesign(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete design");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`rounded-lg p-2 text-white/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 transition-colors ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
        <span className="lg:hidden text-xs">Delete</span>
      </div>
    </button>
  );
}