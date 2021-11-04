/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SecurityInput from './SecurityInput';

describe('SecurityInput component', () => {
  const defaultProps = {
    onChange: jest.fn(),
    label: 'inputLabel',
  };

  const securityKeys = [
    { hint: 'includes a number', condition: /.*[0-9].*/ },
    { hint: 'includes uppercase', condition: /[A-Z]+/ },
  ];

  const renderComponent = (props = {}) =>
    render(<SecurityInput {...defaultProps} {...props} />);

  const getComponent = (testid = 'wizard-input-input-control') =>
    screen.queryByTestId(testid);

  it('renders correctly the component', () => {
    renderComponent();
    expect(getComponent()).toBeInTheDocument();
  });

  it('renders correctly the default input value first time it is instantiated', () => {
    renderComponent({ defaultValue: 'defaultValue' });
    expect(getComponent()).toHaveDisplayValue('defaultValue');
  });

  it('displays the label correctly when it is provided as text', () => {
    renderComponent({ label: 'myCustomLabel' });
    expect(screen.getByText('myCustomLabel')).toBeInTheDocument();
  });

  it('displays the label correctly when it is provided as a method', () => {
    renderComponent({ label: () => 'myCustomMethodLabel' });
    expect(screen.getByText('myCustomMethodLabel')).toBeInTheDocument();
  });

  it('focuses the input when label is clicked', () => {
    renderComponent();
    expect(getComponent()).not.toHaveFocus();
    userEvent.click(screen.getByText(defaultProps.label));
    expect(getComponent()).toHaveFocus();
  });

  it('changes the displayed value in the input when typing', () => {
    renderComponent();
    userEvent.type(getComponent(), 'my new text');
    expect(getComponent()).toHaveDisplayValue('my new text');
  });

  it('calls the provided onChange method when its value changes', () => {
    renderComponent();
    userEvent.type(getComponent(), 'my new text');
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('toggles the text mask when clicking on the mask icon', () => {
    renderComponent({ visibilityToggle: true });

    userEvent.type(getComponent(), 'mypass');
    expect(getComponent()).toHaveDisplayValue('mypass');
    expect(getComponent()).toHaveAttribute('type', 'text');

    userEvent.click(getComponent('wizard-input-mask-toggle'));
    expect(getComponent()).toHaveDisplayValue('mypass');
    expect(getComponent()).toHaveAttribute('type', 'password');
  });

  it('does not display the mask icon when visibilityToggle is not provided', () => {
    renderComponent();
    expect(getComponent('wizard-input-mask-toggle')).not.toBeInTheDocument();
  });

  it('does not let to write more content once the maxLength has been reached', () => {
    const maxLength = 5;
    const str = 'mycharacters';

    renderComponent({ maxLength });
    userEvent.type(getComponent(), str);

    expect(getComponent()).toHaveDisplayValue(str.substr(0, maxLength));
  });

  it('displays the remaining characters when provided to do so', () => {
    renderComponent({ showRemainingCharacters: true, maxLength: 50 });
    const remainingChars = getComponent('wizard-input-characters-left');
    expect(remainingChars).toBeInTheDocument();
    expect(remainingChars).toHaveTextContent('0/50');
  });

  it('the remaining characters are updated when writing in the input', () => {
    renderComponent({ showRemainingCharacters: true, maxLength: 50 });
    const remainingChars = getComponent('wizard-input-characters-left');
    expect(remainingChars).toHaveTextContent('0/50');

    userEvent.type(getComponent(), 'test');
    expect(remainingChars).toHaveTextContent('4/50');
  });

  it('displays an error message when it is provided', () => {
    renderComponent({ errorMessage: 'error' });
    expect(getComponent('wizard-input-error-message')).toBeInTheDocument();
  });

  it('provides visual feedback to the user when the input has succeeded the validation', () => {
    renderComponent({ isValid: true });
    expect(getComponent('wizard-input-input-container')).toHaveClass('success');
  });

  it('provides visual feedback to the user when the input has not succeeded the validation', () => {
    renderComponent({ isValid: false });
    expect(getComponent('wizard-input-input-container')).toHaveClass('error');
  });

  it('does not provide visual feedback to the user when the isValid prop is not provided', () => {
    renderComponent();
    expect(getComponent('wizard-input-input-container')).not.toHaveClass(
      'error'
    );
  });

  it('calls the setIsValid callback when provided along with securityKeys prop when user types', () => {
    const props = {
      setIsValid: jest.fn(),
      securityKeys: [securityKeys[0]], // Just want to test one of the conditions
    };
    renderComponent(props);

    userEvent.type(getComponent(), 'mytext');
    expect(props.setIsValid).toHaveBeenCalledWith(false); // It doesn't include any number

    userEvent.type(getComponent(), 'mytext9');
    expect(props.setIsValid).toHaveBeenCalledWith(true); // It does include a number
  });

  it('displays the security hints when showSecurityHints prop is not provided', () => {
    renderComponent({ securityKeys });
    userEvent.type(getComponent(), 'mytext');

    expect(getComponent('wizard-security-list-container')).toBeInTheDocument();
  });

  it('does not display the security hints when showSecurityHints prop is provided as false', () => {
    renderComponent({
      showSecurityHints: false,
      securityKeys,
    });
    userEvent.type(getComponent(), 'mytext');

    expect(
      getComponent('wizard-security-list-container')
    ).not.toBeInTheDocument();
  });

  it('displays visual feedback about the strength of the password based on securityKeys provided', () => {
    renderComponent({ securityKeys });

    const securityMeter = getComponent('wizard-input-security-meter');
    expect(securityMeter).toBeInTheDocument();

    userEvent.type(getComponent(), 'mytext');
    expect(securityMeter).toHaveClass('none');

    userEvent.type(getComponent(), '5');
    expect(securityMeter).toHaveClass('low');

    userEvent.type(getComponent(), 'G');
    expect(securityMeter).toHaveClass('high');
  });

  it('updates visual feedback when defaultValue is provided and user has not typed anything yet', () => {
    renderComponent({ defaultValue: 'test9', securityKeys });
    const securityMeter = getComponent('wizard-input-security-meter');

    expect(securityMeter).toBeInTheDocument();
    expect(getComponent('wizard-security-list-container')).toBeInTheDocument();

    expect(screen.getByText(securityKeys[0].hint)).toBeInTheDocument();
    expect(screen.getByText(securityKeys[1].hint)).toBeInTheDocument();

    expect(securityMeter).toHaveClass('low');
    expect(screen.queryAllByTestId('wizard-security-list-hint')[0]).toHaveClass(
      'hintSucceeded'
    );
    expect(screen.queryAllByTestId('wizard-security-list-hint')[1]).toHaveClass(
      'hintFailed'
    );
  });
});
