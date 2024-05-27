import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

type Props = {
  account: string;
  accountId: string;
};

const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: OnOpenAccount } = useOpenAccount();
  const onclick = () => {
    OnOpenAccount(accountId);
  };
  return (
    <div
      className="flex items-center cursor-pointer hover:underline"
      onClick={onclick}
    >
      {account}
    </div>
  );
};

export default AccountColumn;
