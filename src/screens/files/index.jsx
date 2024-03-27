import { StatusBar, View, Text } from "react-native";

const FilesScreen = ({ navigation }) => (
  <View className="flex flex-1 text-white bg-midnight">
    <StatusBar style="light" backgroundColor="black" />
    <View className="flex flex-row items-center px-8 fixed h-max mb-8">
      <Text className="text-4xl text-white">Files</Text>
    </View>
  </View>
);

export default FilesScreen;
