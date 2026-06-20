import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MenuScreen from './Screens/MenuScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <MenuScreen></MenuScreen>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f35858',

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});