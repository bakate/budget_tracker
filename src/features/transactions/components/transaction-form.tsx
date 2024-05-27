"use client";
import { AmountInput } from "@/components/amount-input";
import CustomSelect from "@/components/custom-select";
import { DatePicker } from "@/components/date-picker";
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
import { Textarea } from "@/components/ui/textarea";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  TransactionApiValues,
  TransactionFormValues,
  transactionFormSchema,
} from "../types";

type Props = {
  id?: string;
  defaultValues?: TransactionFormValues;
  onSubmit: (values: TransactionApiValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions: { label: string; value: string }[];
  accountOptions: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
  onCreateAccount: (name: string) => void;
};

const TransactionForm = ({
  onSubmit,
  defaultValues,
  disabled,
  id,
  onDelete,
  categoryOptions,
  accountOptions,
  onCreateCategory,
  onCreateAccount,
}: Props) => {
  const form = useForm({
    mode: "onBlur",
    defaultValues,
    resolver: zodResolver(transactionFormSchema),
  });

  const handleSubmit = (data: TransactionFormValues) => {
    const amount = parseFloat(data.amount);
    const amountInMiliUnits = convertAmountToMiliUnits(amount);
    const values = {
      ...data,
      amount: amountInMiliUnits,
    };
    onSubmit(values);
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
        *{" "}
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  onChange={field.onChange}
                  value={field.value}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <CustomSelect
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  disabled={disabled}
                  onChange={field.onChange}
                  placeholder="Select an account"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CustomSelect
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  disabled={disabled}
                  onChange={field.onChange}
                  placeholder="Select a category"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  {...field}
                  value={field.value || ""}
                  placeholder="Add optional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {id ? "Update" : "Create"} transaction
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
            Delete Transaction
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TransactionForm;
