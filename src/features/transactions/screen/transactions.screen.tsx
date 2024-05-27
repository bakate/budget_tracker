"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ImportCard from "../components/import-card";
import { transactionsColumns } from "../components/transaction-columns";
import UploadButton from "../components/upload-button";
import { useBulkCreateTransactions } from "../data/use-bulk-create-transactions";
import { useBulkDeleteTransactions } from "../data/use-bulk-delete-transactions";
import { useCreateTransaction } from "../data/use-create-transaction";
import { useGetTransactions } from "../data/use-get-transactions";
import { useNewTransaction } from "../hooks/use-new-transaction";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}
const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};
const TransactionsScreen = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<
    typeof INITIAL_IMPORT_RESULTS
  >(INITIAL_IMPORT_RESULTS);
  const { onOpen } = useNewTransaction();
  const transactionsQuery = useGetTransactions();
  const transactionMutation = useCreateTransaction();
  const transactionsBulkCreateMutation = useBulkCreateTransactions();
  const deleteTransactionsMutation = useBulkDeleteTransactions();
  const [SelectAccountDialog, confirm] = useSelectAccount();

  const isDisabled =
    transactionsQuery.isLoading || transactionMutation.isPending;

  const transactions = transactionsQuery.data || [];

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  };

  const onCancelImport = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(INITIAL_IMPORT_RESULTS);
  };

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error("Please select an account");
    }
    const data = values.map((value) => ({
      ...value,
      accountId,
    }));

    transactionsBulkCreateMutation.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <SelectAccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  if (transactionsQuery.isLoading) {
    return (
      <>
        <div className="max-w-4xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="w-52 h-10" />
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-between flex-col">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-16" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions page
          </CardTitle>
          <div className="flex items-center gap-2 flex-col lg:flex-row">
            <Button size={"sm"} onClick={onOpen} className="w-full lg:w-auto">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={transactionsColumns}
            data={transactions}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactionsMutation.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsScreen;
