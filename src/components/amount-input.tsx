import { cn } from "@/lib/utils";
import { Info, MinusCircle, PlusCircle } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

import { TooltipContent } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const AmountInput = ({
  value,
  onChange,
  disabled,
  placeholder,
}: Props) => {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const newValue = parseFloat(value) * -1;
    onChange(newValue.toString());
  };
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                isIncome ? "bg-emerald-500 hover:bg-emerald-600" : "",
                isExpense ? "bg-rose-500 hover:bg-rose-600" : ""
              )}
            >
              {!parsedValue ? <Info className="size-3 text-white" /> : null}
              {isIncome ? <PlusCircle className="size-3 text-white" /> : null}
              {isExpense ? <MinusCircle className="size-3 text-white" /> : null}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Use [+] to add income and [-] to add expenses</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CurrencyInput
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValueChange={onChange}
        decimalsLimit={2}
        decimalScale={2}
        prefix="$"
        className={cn(
          "px-10 flex h-10 w-full rounded-md border border-input bg-background  py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm focus:border-none file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          disabled ? "text-muted-foreground" : ""
        )}
      />
      <p className="text-xs text-muted-foreground mt-2">
        {isIncome ? "This will count as income" : null}
        {isExpense ? "This will count as an expense" : null}
      </p>
    </div>
  );
};
