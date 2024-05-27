import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateAccount } from "@/features/accounts/data/use-create-account";
import { useGetAccounts } from "@/features/accounts/data/use-get-accounts";
import { useCreateCategory } from "@/features/categories/data/use-create-category";
import { useGetCategories } from "@/features/categories/data/use-get-categories";
import { Loader2 } from "lucide-react";
import { useCreateTransaction } from "../data/use-create-transaction";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { TransactionApiValues } from "../types";
import TransactionForm from "./transaction-form";

const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const transactionMutation = useCreateTransaction();
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

  const handleSubmit = (values: TransactionApiValues) => {
    transactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isPending =
    categoryMutation.isPending ||
    accountMutation.isPending ||
    transactionMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Create a new transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track your expenses
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin size-4 text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={handleSubmit}
            categoryOptions={categoryOptions}
            accountOptions={accountOptions}
            onCreateCategory={onCreateCategory}
            onCreateAccount={onCreateAccount}
            defaultValues={{
              accountId: "",
              amount: "0",
              categoryId: "",
              date: new Date(),
              payee: "",
            }}
            disabled={isPending}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;
