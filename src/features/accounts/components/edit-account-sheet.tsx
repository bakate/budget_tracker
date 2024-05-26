import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm from "@/features/accounts/components/account-form";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { useDeleteAccount } from "../data/use-delete-account";
import { useEditAccount } from "../data/use-edit-account";
import { useGetAccountById } from "../data/use-get-account";
import { useOpenAccount } from "../hooks/use-open-account";
import { AccountFormValues } from "../types";

const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const { data, isLoading } = useGetAccountById(id);
  const editAccountMutation = useEditAccount(id);
  const deleteAccountMutation = useDeleteAccount(id);

  const handleEdition = (values: AccountFormValues) => {
    editAccountMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this account. This action cannot be undone."
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteAccountMutation.mutate(undefined, {
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
            <SheetTitle>Edit account</SheetTitle>
            <SheetDescription>Edit the account details</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={handleEdition}
              defaultValues={defaultValues}
              disabled={
                editAccountMutation.isPending || deleteAccountMutation.isPending
              }
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;
