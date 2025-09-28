import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../components/ThemeProvider';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width * 0.1;
const BAR_HEIGHT = 150;
const SPACING = 16;

const AnimatedBarChart = ({ data, title }) => {
  const theme = useTheme();
  const [barHeights] = useState(data.map(() => new Animated.Value(0)));
  
  useEffect(() => {
    // Animate bars sequentially with staggered effect
    const animations = barHeights.map((barHeight, index) => {
      return Animated.timing(barHeight, {
        toValue: data[index].value,
        duration: 800,
        delay: index * 100,
        useNativeDriver: false,
      });
    });
    
    Animated.parallel(animations).start();
  }, [data]);

  const getBarColor = (index) => {
    const colors = [
      theme.colors.barColor,
      theme.colors.lineColor,
      theme.colors.primary[500],
      theme.colors.secondary[500],
      theme.colors.primary[700],
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>}
      
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: barHeights[index].interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, BAR_HEIGHT],
                    }),
                    backgroundColor: getBarColor(index),
                    borderRadius: theme.borderRadius.sm,
                  },
                ]}
              />
            </View>
            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
              {item.label}
            </Text>
            <Text style={[styles.value, { color: theme.colors.text.primary }]}>
              {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: BAR_HEIGHT,
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH,
  },
  barWrapper: {
    height: BAR_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: BAR_WIDTH - SPACING,
  },
  label: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default AnimatedBarChart;