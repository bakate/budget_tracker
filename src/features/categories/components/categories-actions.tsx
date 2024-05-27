"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { MoreHorizontal, Pen, Trash2 } from "lucide-react";

import { useDeleteCategory } from "../data/use-delete-category";
import { useOpenCategory } from "../hooks/use-open-category";

type Props = {
  id: string;
};

const CategoryActions = ({ id }: Props) => {
  const { onOpen } = useOpenCategory();
  const deleteCategoryMutation = useDeleteCategory(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this category. This action cannot be undone."
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteCategoryMutation.mutate(undefined);
    }
  };
  return (
    <>
      <ConfirmDialog />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Category actions"
            className="size-8 p-0"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpen(id)}>
            <Pen className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CategoryActions;
