import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, Text } from 'react-native';

export default function SexPicker({ sex, setSex }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Bărbat', value: 'male' },
    { label: 'Femeie', value: 'female' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sex</Text>
      <DropDownPicker
        open={open}
        value={sex}
        items={items}
        setOpen={setOpen}
        setValue={setSex}
        setItems={setItems}
        placeholder="Selectează sexul"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginBottom: 15,
    zIndex: 10, // foarte important ca să nu se suprapună dropdown-urile!
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '600',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
});
