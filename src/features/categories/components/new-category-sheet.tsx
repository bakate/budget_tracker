import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateCategory } from "../data/use-create-category";
import { useNewCategory } from "../hooks/use-new-category";
import { CategoryFormValues } from "../types";
import CategoryForm from "./category-form";

const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const { mutate, isPending } = useCreateCategory();

  const handleSubmit = (values: CategoryFormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Create a new category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your accounts.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: "",
          }}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
