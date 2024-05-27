"use client";

import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useGetSummary } from "../data/use-get-summary";
import DataCard, { DataCardLoading } from "./data-card";
const DataGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const dateRangeLabel = formatDateRange({
    from,
    to,
  });

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <DataCardLoading key={index} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid lg:grid-cols-3 gap-8 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};

export default DataGrid;
