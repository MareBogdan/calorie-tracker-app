import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;

export default function ProteinsScreen() {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 0.3, // 30% of daily intake
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  const circumference = 2 * Math.PI * 50; // radius of 50
  const strokeDashoffset = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <LinearGradient
      colors={Colors.gradientGreenBlue}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>🍗 Protein: The Building Block of Life!</Text>
      <Text style={styles.subtitle}>
        Did you know? Proteins are involved in nearly every process in your body, from building muscles to transporting oxygen!
      </Text>
      <View style={styles.chartContainer}>
        <View style={styles.circleBackground} />
        <Animated.View
          style={[
            styles.circleProgress,
            {
              strokeDashoffset,
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
        <Text style={styles.percentageText}>30%</Text>
      </View>
      <Text style={styles.infoText}>
        💡 Tip: Aim for protein to make up 10–35% of your daily calories. 30% is ideal for weight management.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#b2dfdb',
  },
  circleProgress: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#00796b',
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoText: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 10,
  },
});
