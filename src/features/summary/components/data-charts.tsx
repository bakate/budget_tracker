"use client";

import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useGetSummary } from "../data/use-get-summary";
import Chart, { ChartLoading } from "./chart";
import SpendingPie, { SpendingPieLoading } from "./spending-pie";

const DataCharts = () => {
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
      <div className="grid lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    );
  }
  return (
    <div className="grid lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};

export default DataCharts;
