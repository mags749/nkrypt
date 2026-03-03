import { Category } from "@features/categories/store/categoryStore";
import { Spacing } from "@shared/constants/design";
import React, { useState, useRef, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import CategoryItem from "./views/CategoryItem";
import { View } from "tamagui";

export const useCategoryList = ({ selectCategory }) => {
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

  return {
    listRef,
    handlePress,
  };
};
