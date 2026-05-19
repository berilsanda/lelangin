import { View, Text, StyleSheet } from 'react-native';

export default function MyAuctionsScreen() {
  return (
    <View style={styles.container}>
      <Text>My Auctions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
