"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { MoreHorizontal, Pen, Trash2 } from "lucide-react";
import { useDeleteAccount } from "../data/use-delete-account";
import { useOpenAccount } from "../hooks/use-open-account";

type Props = {
  id: string;
};

const AccountActions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();
  const deleteAccountMutation = useDeleteAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this account. This action cannot be undone."
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteAccountMutation.mutate(undefined);
    }
  };
  return (
    <>
      <ConfirmDialog />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Account actions"
            className="size-8 p-0"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onOpen(id)}>
            <Pen className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteAccountMutation.isPending}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AccountActions;
