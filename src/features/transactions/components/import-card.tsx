import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useState } from "react";
import ImportTable from "./import-table";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "payee", "date"];
type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

type SelectedColumnsState = {
  [key: string]: string | null;
};

type TransactionData = {
  amount: string;
  payee: string;
  date: string;
  [key: string]: string;
};

const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const headers = data[0];
  const body = data.slice(1);
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );
  const handleHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((cell) => cell === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce(
        (acc, cell, index) => {
          const header = mappedData.headers[index];
          if (header !== null) {
            acc[header] = cell!;
          }
          return acc;
        },
        { amount: "", payee: "", date: "" } as TransactionData
      );
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliUnits(parseFloat(item.amount || "0")),
      date: format(
        parse(item.date || "", dateFormat, new Date()),
        outputFormat
      ),
    }));

    onSubmit(formattedData);
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import transactions
          </CardTitle>
          <div className="flex items-center gap-2 flex-col lg:flex-row">
            <Button size={"sm"} onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size={"sm"}
              onClick={handleContinue}
              className="w-full lg:w-auto"
              disabled={progress < requiredOptions.length}
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={handleHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportCard;
