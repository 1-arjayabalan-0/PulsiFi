import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../components/ThemeProvider';

const AnimatedProgressBar = ({ label, value, maxValue, color }) => {
  const theme = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: value / maxValue,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value, maxValue]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const barColor = color || theme.colors.charts.barColor;
  const percentage = Math.round((value / maxValue) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.colors.text.secondary }]}>
          {percentage}%
        </Text>
      </View>
      <View style={[styles.progressBackground, { backgroundColor: theme.colors.background }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width,
              backgroundColor: barColor,
              borderRadius: theme.borderRadius.xs,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default AnimatedProgressBar;