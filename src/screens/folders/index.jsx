import {
  StatusBar,
  View,
  Text,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  GestureHandlerRootView,
  TouchableHighlight,
} from "react-native-gesture-handler";

const FoldersScreen = ({ navigation }) => (
  <View className="flex flex-1 text-white bg-[#0e1c26]">
    <StatusBar style="light" backgroundColor="#0e1c26" />
    <View className="flex flex-row items-center px-8 fixed h-max mb-8">
      <Text className="font-sans text-4xl text-white">nkrypt</Text>
    </View>
    <GestureHandlerRootView>
      <SafeAreaView>
        <FlatList
          horizontal={true}
          scrollEnabled={true}
          data={[
            { title: "Title Text", key: "item1" },
            { title: "Title Text", key: "item2" },
            { title: "Title Text", key: "item3" },
            { title: "Title Text", key: "item4" },
          ]}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              key={item.key}
              onPress={() => this._onPress(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View className="mx-8">
                <Text className="text-white">{item.title}</Text>
              </View>
            </TouchableHighlight>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  </View>
);

export default FoldersScreen;
