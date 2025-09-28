/**
 * Animation utilities for PulseFi app
 * Provides reusable animation functions for consistent micro-interactions
 */

import { Animated, Easing } from 'react-native';

/**
 * Creates a fade-in animation
 * @param {Animated.Value} value - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const fadeIn = (value, duration = 300, callback = null) => {
  Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Creates a fade-out animation
 * @param {Animated.Value} value - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const fadeOut = (value, duration = 300, callback = null) => {
  Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Creates a scale animation
 * @param {Animated.Value} value - The animated value to animate
 * @param {number} toValue - Target scale value
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const scale = (value, toValue = 1, duration = 300, callback = null) => {
  Animated.timing(value, {
    toValue,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Creates a slide-in animation from bottom
 * @param {Animated.Value} value - The animated value to animate
 * @param {number} fromValue - Starting position value
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const slideInFromBottom = (value, fromValue = 100, duration = 300, callback = null) => {
  value.setValue(fromValue);
  Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Creates a progress animation for charts
 * @param {Animated.Value} value - The animated value to animate
 * @param {number} toValue - Target value (typically 1 for 100%)
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
export const animateProgress = (value, toValue = 1, duration = 300, callback = null) => {
  value.setValue(0);
  Animated.timing(value, {
    toValue,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: false, // Must be false for layout animations
  }).start(callback);
};

/**
 * Creates a sequence of animations
 * @param {Array} animations - Array of animation configurations
 * @param {function} callback - Optional callback after all animations complete
 */
export const sequence = (animations, callback = null) => {
  Animated.sequence(animations).start(callback);
};

/**
 * Creates a staggered animation for lists
 * @param {Array} animations - Array of animation configurations
 * @param {number} staggerDelay - Delay between each animation
 * @param {function} callback - Optional callback after all animations complete
 */
export const stagger = (animations, staggerDelay = 50, callback = null) => {
  Animated.stagger(staggerDelay, animations).start(callback);
};

export default {
  fadeIn,
  fadeOut,
  scale,
  slideInFromBottom,
  animateProgress,
  sequence,
  stagger,
};