import { useColors } from "@context/providers/themeStore";
import { Category } from "@features/categories/store/categoryStore";
import { Spacing, Typography } from "@shared/constants/design";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import CategoryItem from "./CategoryItem";

const ITEM_WIDTH = 120; // Fixed width helps with precise scrolling calculations
const SCREEN_WIDTH = Dimensions.get("window").width;

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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const colors = useColors();

  // 2. Type the Ref for FlatList
  const listRef = useRef<FlatList<Category>>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToLeft = (index: number) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0, // 0 aligns the item to the left of the list
    });
  };

  const handlePress = (id: String, index: number) => {
    selectCategory(id);
    setActiveIndex(index);
    scrollToLeft(index);
    startInactivityTimer(index);
  };

  const startInactivityTimer = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      scrollToLeft(index);
    }, 5000); // 5 seconds
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const renderItem = ({ item, index }: { item: Category; index: number }) => (
    <CategoryItem
      item={item}
      index={index}
      handlePress={handlePress}
      activeId={selectedCategory}
    />
  );

  return (
    <View style={styles.container}>
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
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
});

export default CategoryList;
