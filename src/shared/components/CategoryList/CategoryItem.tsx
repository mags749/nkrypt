import { useColors } from "@context/providers/themeStore";
import { Category } from "@features/categories/store/categoryStore";
import { Typography } from "@shared/constants/design";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CategoryItemsProps {
  item: Category;
  index: number;
  handlePress: (id: String, index: number) => void;
  activeId: String;
}

const CategoryItem = ({
  item,
  index,
  handlePress,
  activeId,
}: CategoryItemsProps) => {
  const colors = useColors();
  const isActive = activeId === item.id;
  return (
    <TouchableOpacity
      style={[styles.item]}
      onPress={() => handlePress(item.id, index)}
    >
      <Text
        style={[
          isActive ? styles.activeText : styles.text,
          { color: isActive ? colors.textPrimary : colors.textTertiary },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    padding: 12,
  },
  text: {
    ...Typography.bodyMD,
  },
  activeText: {
    ...Typography.bodyLG,
    fontWeight: "700" as const,
  },
});

export default CategoryItem;
