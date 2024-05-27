import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { useDeleteCategory } from "../data/use-delete-category";
import { useEditCategory } from "../data/use-edit-category";
import { useGetCategoryById } from "../data/use-get-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { CategoryFormValues } from "../types";
import CategoryForm from "./category-form";

const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const { data, isLoading } = useGetCategoryById(id);
  const editCategoryMutation = useEditCategory(id);
  const deleteCategoryMutation = useDeleteCategory(id);

  const handleEdition = (values: CategoryFormValues) => {
    editCategoryMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this category. This action cannot be undone."
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteCategoryMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = data
    ? {
        name: data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit category</SheetTitle>
            <SheetDescription>Edit the category details</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={handleEdition}
              defaultValues={defaultValues}
              disabled={
                editCategoryMutation.isPending ||
                deleteCategoryMutation.isPending
              }
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditCategorySheet;
