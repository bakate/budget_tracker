"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import { FileSearch, Loader2, PieChart, Radar, Target } from "lucide-react";
import { useState } from "react";
import PieVariant from "./pie-variant";
import RadarVariant from "./radar-variant";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import RadialVariant from "./radial-variant";

type Props = {
  data?: {
    value: number;
    name: string;
  }[];
};

type ChartType = "pie" | "radar" | "radial";
const SpendingPie = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState<ChartType>("pie");

  const onTypeChange = (type: ChartType) => {
    // TODO: add a paywall
    setChartType(type);
  };
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Categories</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Pie chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radar chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radial chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data available for this period.
            </p>
          </div>
        ) : (
          <>
            {chartType === "pie" && <PieVariant data={data} />}
            {chartType === "radar" && <RadarVariant data={data} />}
            {chartType === "radial" && <RadialVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingPie;

export const SpendingPieLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Categories</CardTitle>
        <Skeleton className="h-8 w-48 " />
        <Skeleton className="h-8 w-full lg:w-[120px] " />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[350px] w-full">
          <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};
