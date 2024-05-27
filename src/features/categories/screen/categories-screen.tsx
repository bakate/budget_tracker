"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "../data/use-bulk-delete-categories";
import { useGetCategories } from "../data/use-get-categories";

import { Plus } from "lucide-react";
import { categoriesColumns } from "../components/categories-columns";
import { useNewCategory } from "../hooks/use-new-category";

const CategoriesScreen = () => {
  const newCategory = useNewCategory();
  const deleteCategoriesMutation = useBulkDeleteCategories();
  const categoriesQuery = useGetCategories();
  const isDisabled =
    categoriesQuery.isLoading || deleteCategoriesMutation.isPending;

  const categories = categoriesQuery.data || [];

  if (categoriesQuery.isLoading) {
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
  if (categoriesQuery.isError) return <div>Error</div>;
  if (!categoriesQuery.data) return <div>No data</div>;
  return (
    <div className="max-w-4xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Categories page
          </CardTitle>
          <Button size={"sm"} onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={categoriesColumns}
            data={categories}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategoriesMutation.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesScreen;
