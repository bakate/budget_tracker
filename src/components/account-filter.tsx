"use client";

import { useGetAccounts } from "@/features/accounts/data/use-get-accounts";
import { useGetSummary } from "@/features/summary/data/use-get-summary";
import { SelectValue } from "@radix-ui/react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

const AccountFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();
  const { isLoading: isSummaryLoading } = useGetSummary();
  const params = useSearchParams();
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };
    if (newValue === "all") {
      query.accountId = "";
    }
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <div>
      <Select
        value={accountId}
        onValueChange={onChange}
        disabled={isLoadingAccounts || isSummaryLoading}
      >
        <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All accounts</SelectItem>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AccountFilter;
