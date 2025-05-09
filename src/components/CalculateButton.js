import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CalculateButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Calculează</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,  // <-- padding mai mare sus și jos
    paddingHorizontal: 40, // <-- padding stânga dreapta
    borderRadius: 10,
    alignSelf: 'center',   // <-- centrăm butonul singur
    width: '100%',         // <-- lățime maximă în container
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,          // <-- font puțin mai mare
  },
});
