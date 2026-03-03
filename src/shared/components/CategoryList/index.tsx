import { Category } from "@features/categories/store/categoryStore";
import React from "react";
import { useCategoryList } from "./hooks/useCategoryList";
import { CategoryListView } from "./views/CategoryListView";

interface CategoryListProps {
  data: Array<Category>;
  selectedCategory: String;
  selectCategory: (categoryId: String) => void;
}

const CategoryList = ({
  data,
  selectedCategory,
  selectCategory,
}: CategoryListProps) => {
  const hook = useCategoryList({ selectCategory });
  return (
    <CategoryListView
      data={data}
      selectedCategory={selectedCategory}
      ref={hook.listRef}
      handlePress={hook.handlePress}
    />
  );
};

export default CategoryList;
