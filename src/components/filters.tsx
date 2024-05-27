import AccountFilter from "./account-filter";
import DateFilter from "../features/summary/components/date-filter";

const Filters = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
      <AccountFilter />
      <DateFilter />
    </div>
  );
};

export default Filters;
