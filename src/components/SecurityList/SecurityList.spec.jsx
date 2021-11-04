/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SecurityList from './SecurityList';

describe('SecurityList component', () => {
  const defaultProps = {
    securityConditions: [
      { hint: 'first hint succeeded', succeeded: true },
      { hint: 'second hint failed', succeeded: false },
    ],
  };
  const renderComponent = (props = {}) =>
    render(<SecurityList {...defaultProps} {...props} />);

  it('renders the component correctly', () => {
    renderComponent();
    expect(
      screen.getByTestId('wizard-security-list-container')
    ).toBeInTheDocument();
  });

  it('displays the condition strings provided', () => {
    renderComponent();
    const { securityConditions } = defaultProps;

    expect(screen.getByText(securityConditions[0].hint)).toBeInTheDocument();
    expect(screen.getByText(securityConditions[1].hint)).toBeInTheDocument();
  });

  it('provides visual feedback taking into account the status of the conditions', () => {
    renderComponent();

    const conditions = screen.getAllByTestId('wizard-security-list-hint');

    expect(conditions[0]).toHaveClass('hintSucceeded');
    expect(conditions[1]).toHaveClass('hintFailed');
  });
});
