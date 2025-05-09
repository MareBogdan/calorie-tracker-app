import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, Text } from 'react-native';

export default function ActivityPicker({ activityLevel, setActivityLevel }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Sedentar (1.2)', value: '1.2' },
    { label: 'Ușor activ (1.375)', value: '1.375' },
    { label: 'Moderat activ (1.55)', value: '1.55' },
    { label: 'Foarte activ (1.725)', value: '1.725' },
    { label: 'Extrem de activ (1.9)', value: '1.9' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nivel de activitate</Text>
      <DropDownPicker
        open={open}
        value={activityLevel}
        items={items}
        setOpen={setOpen}
        setValue={setActivityLevel}
        setItems={setItems}
        placeholder="Selectează nivelul de activitate"
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
    zIndex: 5,
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
