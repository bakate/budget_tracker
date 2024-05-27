"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { CategoryFormValues, categoryFormSchema } from "../types";

type Props = {
  id?: string;
  defaultValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const CategoryForm = ({
  onSubmit,
  defaultValues,
  disabled,
  id,
  onDelete,
}: Props) => {
  const form = useForm({
    mode: "onBlur",
    defaultValues,
    resolver: zodResolver(categoryFormSchema),
  });

  const handleSubmit = (data: CategoryFormValues) => {
    onSubmit(data);
  };

  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  {...field}
                  placeholder="e.g. Cash, Bank, Credit Card"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {id ? "Update" : "Create"} Category
        </Button>
        {id ? (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant={"outline"}
          >
            <Trash className="size-4 mr-2" />
            Delete Category
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CategoryForm;
