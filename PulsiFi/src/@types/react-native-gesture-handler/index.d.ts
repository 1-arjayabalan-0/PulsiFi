declare module 'react-native-gesture-handler' {
  import React from 'react';
  import { ViewProps, View } from 'react-native';

  export interface GestureHandlerRootViewProps extends ViewProps {}

  export class GestureHandlerRootView extends React.Component<GestureHandlerRootViewProps> {}

  // Basic gesture handlers
  export class NativeViewGestureHandler extends React.Component<any> {}
  export class TapGestureHandler extends React.Component<any> {}
  export class LongPressGestureHandler extends React.Component<any> {}
  export class PanGestureHandler extends React.Component<any> {}
  export class PinchGestureHandler extends React.Component<any> {}
  export class RotationGestureHandler extends React.Component<any> {}
  export class FlingGestureHandler extends React.Component<any> {}
  export class ForceTouchGestureHandler extends React.Component<any> {}

  // Gesture state
  export enum State {
    UNDETERMINED = 0,
    FAILED,
    BEGAN,
    CANCELLED,
    ACTIVE,
    END,
  }

  // Gesture events
  export interface GestureEvent {
    nativeEvent: {
      state: State;
      [key: string]: any;
    };
  }

  // Gesture handlers
  export const createNativeWrapper: (component: React.ComponentType<any>, config?: any) => React.ComponentType<any>;
  
  // Buttons
  export const RectButton: React.ComponentType<any>;
  export const BaseButton: React.ComponentType<any>;
  export const BorderlessButton: React.ComponentType<any>;

  // Swipeable
  export interface SwipeableProps {
    friction?: number;
    leftThreshold?: number;
    rightThreshold?: number;
    overshootLeft?: boolean;
    overshootRight?: boolean;
    overshootFriction?: number;
    renderLeftActions?: (progressAnimatedValue: any, dragAnimatedValue: any) => React.ReactNode;
    renderRightActions?: (progressAnimatedValue: any, dragAnimatedValue: any) => React.ReactNode;
    onSwipeableLeftOpen?: () => void;
    onSwipeableRightOpen?: () => void;
    onSwipeableOpen?: () => void;
    onSwipeableClose?: () => void;
    onSwipeableLeftWillOpen?: () => void;
    onSwipeableRightWillOpen?: () => void;
    onSwipeableWillOpen?: () => void;
    onSwipeableWillClose?: () => void;
    direction?: 'left' | 'right';
    useNativeAnimations?: boolean;
  }

  export class Swipeable extends React.Component<SwipeableProps> {
    close: () => void;
    openLeft: () => void;
    openRight: () => void;
  }

  // DrawerLayout
  export interface DrawerLayoutProps {
    renderNavigationView: () => React.ReactNode;
    drawerPosition?: 'left' | 'right';
    drawerWidth?: number;
    drawerBackgroundColor?: string;
    keyboardDismissMode?: 'none' | 'on-drag';
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
    useNativeAnimations?: boolean;
    onDrawerOpen?: () => void;
    onDrawerClose?: () => void;
    onDrawerSlide?: (position: number) => void;
    onDrawerStateChanged?: (newState: 'Idle' | 'Dragging' | 'Settling') => void;
    statusBarBackgroundColor?: string;
  }

  export class DrawerLayout extends React.Component<DrawerLayoutProps> {
    openDrawer: () => void;
    closeDrawer: () => void;
  }

  // Gesture Handler
  export const gestureHandlerRootHOC: (Component: React.ComponentType<any>, containerStyles?: any) => React.ComponentType<any>;
}