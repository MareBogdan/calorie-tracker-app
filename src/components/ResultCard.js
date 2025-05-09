import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultCard({ calories }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rezultate:</Text>

      <Text style={styles.calories}>
        Calorii necesare zilnic: {calories.total.toFixed(0)} kcal
      </Text>

      <View style={styles.macros}>
        <Text style={styles.macroText}>Proteine: {calories.proteins.toFixed(0)} g</Text>
        <Text style={styles.macroText}>Carbohidrați: {calories.carbs.toFixed(0)} g</Text>
        <Text style={styles.macroText}>Grăsimi: {calories.fats.toFixed(0)} g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  calories: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 20,
  },
  macros: {
    width: '100%',
  },
  macroText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
});
