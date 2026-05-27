import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { AppButton } from '../AppButton';

jest.mock('react-native-reanimated', () => ({
  useSharedValue: (init: number) => ({ value: init }),
  useAnimatedStyle: (fn: () => Record<string, unknown>) => fn(),
  withTiming: (val: number) => val,
  default: {
    View,
    createAnimatedComponent: (c: unknown) => c,
  },
  View,
  createAnimatedComponent: (c: unknown) => c,
}));

describe('AppButton', () => {
  it('renders ActivityIndicator and suppresses onPress when isLoading', () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType, queryByText } = render(
      <AppButton variant="primary" size="md" isLoading onPress={onPress}>
        Submit
      </AppButton>,
    );

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(queryByText('Submit')).toBeNull();

    // The TouchableOpacity is disabled — pressing it should not invoke onPress
    fireEvent.press(UNSAFE_getByType(ActivityIndicator));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton variant="primary" size="md" disabled onPress={onPress}>
        Submit
      </AppButton>,
    );

    fireEvent.press(getByText('Submit'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders without error with variant="primary"', () => {
    const { getByText } = render(
      <AppButton variant="primary" size="md" onPress={jest.fn()}>
        Primary
      </AppButton>,
    );
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders without error with variant="outline"', () => {
    const { getByText } = render(
      <AppButton variant="outline" size="md" onPress={jest.fn()}>
        Outline
      </AppButton>,
    );
    expect(getByText('Outline')).toBeTruthy();
  });
});
