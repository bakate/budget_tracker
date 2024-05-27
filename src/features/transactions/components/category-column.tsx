import { useOpenCategory } from "@/features/categories/hooks/use-open-category";

type Props = {
  category: string;
  categoryId: string;
};

const CategoryColumn = ({ category, categoryId }: Props) => {
  const { onOpen } = useOpenCategory();
  const onclick = () => {
    onOpen(categoryId);
  };
  return (
    <div
      className="flex items-center cursor-pointer hover:underline"
      onClick={onclick}
    >
      {category}
    </div>
  );
};

export default CategoryColumn;
