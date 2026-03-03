import { useColors } from "@context/providers/themeStore";
import { Category } from "@features/categories/store/categoryStore";
import { Spacing } from "@shared/constants/design";
import { Text, XStack } from "tamagui";

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
    <XStack
      onPress={() => handlePress(item.id, index)}
      alignItems="center"
      justifyContent="flex-start"
      paddingVertical={Spacing.md}
      pressStyle={{ opacity: 0.7 }}
      minWidth={100}
    >
      <Text
        color={isActive ? colors.textPrimary : colors.textTertiary}
        fontSize={isActive ? 18 : 16}
        fontWeight={isActive ? "700" : "400"}
        textAlign="left"
      >
        {item.name}
      </Text>
    </XStack>
  );
};

export default CategoryItem;
