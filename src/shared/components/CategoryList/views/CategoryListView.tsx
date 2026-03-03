import { Category } from "@features/categories/store/categoryStore";
import { Spacing } from "@shared/constants/design";
import React, { forwardRef, Ref } from "react";
import { FlatList, Dimensions } from "react-native";
import CategoryItem from "./CategoryItem";
import { View } from "tamagui";

const ITEM_WIDTH = 100; // Fixed width helps with precise scrolling calculations
const SCREEN_WIDTH = Dimensions.get("window").width;

interface CategoryListProps {
  data: Array<Category>;
  selectedCategory: String;
  handlePress: (id: String, index: number) => void;
}

export const CategoryListView = forwardRef(
  (
    { data, selectedCategory, handlePress }: CategoryListProps,
    listRef: Ref<FlatList<Category>>,
  ) => {
    const renderItem = ({ item, index }: { item: Category; index: number }) => (
      <CategoryItem
        item={item}
        index={index}
        handlePress={handlePress}
        activeId={selectedCategory}
      />
    );

    return (
      <View marginHorizontal={Spacing["3xl"]} marginBottom={Spacing["2xl"]}>
        <FlatList
          ref={listRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          // This padding allows the last item to actually reach the left side
          contentContainerStyle={{ paddingRight: SCREEN_WIDTH - ITEM_WIDTH }}
          // 3. Performance Optimization: getItemLayout
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          // Essential for handling scrolls to items not yet rendered
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
        />
      </View>
    );
  },
);
