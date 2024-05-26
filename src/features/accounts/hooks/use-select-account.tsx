import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import CustomSelect from "@/components/custom-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateAccount } from "../data/use-create-account";
import { useGetAccounts } from "../data/use-get-accounts";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<string | undefined>
] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const accountOptions = (accountQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an account</DialogTitle>
          <DialogDescription>
            Please, select an account or create a new one
          </DialogDescription>
        </DialogHeader>

        <CustomSelect
          options={accountOptions}
          placeholder="Select an account"
          onChange={(value) => {
            selectValue.current = value;
          }}
          onCreate={onCreateAccount}
          disabled={accountMutation.isPending || accountQuery.isLoading}
        />

        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
