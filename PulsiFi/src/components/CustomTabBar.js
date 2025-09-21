import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width: screenWidth} = Dimensions.get('window');

const CustomTabBar = ({state, descriptors, navigation}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const tabWidth = screenWidth / state.routes.length;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index * tabWidth,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [state.index, tabWidth]);

  const getIconName = routeName => {
    switch (routeName) {
      case 'Home':
        return 'home-variant';
      case 'Transactions':
        return 'receipt';
      case 'Add':
        return 'plus-circle';
      case 'Insights':
        return 'chart-line';
      case 'Profile':
        return 'account-circle';
      default:
        return 'circle';
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-width active indicator */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            transform: [{translateX: animatedValue}],
            width: tabWidth,
          },
        ]}>
        <LinearGradient
          colors={['#00d09e', '#097a77']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientIndicator}
        />
      </Animated.View>

      {/* Tab bar background */}
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.tabBarBackground}>
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            // Special handling for Add button
            if (route.name === 'Add') {
              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.addButtonContainer}>
                  <View style={styles.addButton}>
                    <LinearGradient
                      colors={['#00d09e', '#097a77']}
                      style={styles.addButtonGradient}>
                      <Icon
                        name={getIconName(route.name)}
                        size={28}
                        color="#ffffff"
                      />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}>
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [
                        {
                          scale: isFocused ? 1.1 : 1,
                        },
                      ],
                    },
                  ]}>
                  <Icon
                    name={getIconName(route.name)}
                    size={24}
                    color={isFocused ? '#00d09e' : '#8e8e93'}
                  />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 4,
    zIndex: 2,
  },
  gradientIndicator: {
    flex: 1,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tabBarBackground: {
    paddingTop: 4,
    paddingBottom: 20,
    paddingHorizontal: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  addButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: -20,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
});

export default CustomTabBar;