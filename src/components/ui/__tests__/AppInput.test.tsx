import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { AppInput } from '../AppInput';

describe('AppInput', () => {
  it('renders error message when error prop is provided', () => {
    const { getByText } = render(<AppInput error="Some error" />);
    expect(getByText('Some error')).toBeTruthy();
  });

  it('does not render error message when error prop is absent', () => {
    const { queryByText } = render(<AppInput />);
    expect(queryByText('Some error')).toBeNull();
  });

  it('calls onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <AppInput onChangeText={onChangeText} defaultValue="" testID="input" />,
    );
    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });
});
