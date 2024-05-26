"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { columns } from "../components/account-columns";
import { useBulkDeleteAccounts } from "../data/use-bulk-delete-accounts";
import { useGetAccounts } from "../data/use-get-accounts";
import { useNewAccount } from "../hooks/use-new-account";

const AccountsScreen = () => {
  const newAccount = useNewAccount();
  const deleteAccounts = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  const accounts = accountsQuery.data || [];

  if (accountsQuery.isLoading) {
    return (
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
    );
  }
  if (accountsQuery.isError) return <div>Error</div>;
  if (!accountsQuery.data) return <div>No data</div>;
  return (
    <div className="max-w-4xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts page</CardTitle>
          <Button size={"sm"} onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsScreen;
