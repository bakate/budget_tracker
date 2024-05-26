import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm from "@/features/accounts/components/account-form";
import { useCreateAccount } from "@/features/accounts/data/use-create-account";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountFormValues } from "../types";

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const { mutate, isPending } = useCreateAccount();

  const handleSubmit = (values: AccountFormValues) => {
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
          <SheetTitle>Create a new account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions
          </SheetDescription>
        </SheetHeader>
        <AccountForm
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

export default NewAccountSheet;
