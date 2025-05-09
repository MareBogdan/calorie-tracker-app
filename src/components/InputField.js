import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

export default function InputField({ label, value, onChangeText, keyboardType = 'default' }) {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
});
