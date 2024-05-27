import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { useDeleteTransaction } from "../data/use-delete-transaction";
import { useEditTransaction } from "../data/use-edit-transaction";
import { useGetTransactionById } from "../data/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";

import { useCreateAccount } from "@/features/accounts/data/use-create-account";
import { useGetAccounts } from "@/features/accounts/data/use-get-accounts";
import { useCreateCategory } from "@/features/categories/data/use-create-category";
import { useGetCategories } from "@/features/categories/data/use-get-categories";
import { TransactionApiValues } from "../types";
import TransactionForm from "./transaction-form";

const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const { data, isLoading } = useGetTransactionById(id);
  const transactionQuery = useGetTransactionById(id);
  const editTransactionMutation = useEditTransaction(id);
  const deleteTransactionMutation = useDeleteTransaction(id);
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const categoryOptions = (categoryQuery.data || []).map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
  };
  const accountQuery = useGetAccounts();
  const accountOptions = (accountQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const isPending =
    categoryMutation.isPending ||
    accountMutation.isPending ||
    editTransactionMutation.isPending ||
    deleteTransactionMutation.isPending;

  const handleEdition = (values: TransactionApiValues) => {
    editTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this transaction. This action cannot be undone."
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTransactionMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = transactionQuery?.data
    ? {
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
      }
    : {
        date: new Date(),
        amount: "0",
        payee: "",
        notes: "",
        accountId: "",
        categoryId: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit transaction</SheetTitle>
            <SheetDescription>Edit the transaction details</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={handleEdition}
              defaultValues={defaultValues}
              disabled={isPending}
              onDelete={handleDelete}
              categoryOptions={categoryOptions}
              accountOptions={accountOptions}
              onCreateCategory={onCreateCategory}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;
