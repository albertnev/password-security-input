/* eslint-disable testing-library/no-node-access */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SecurityIcon from './SecurityIcon';

describe('SecurityIcon component', () => {
  const defaultProps = {
    iconName: 'FaCheck',
  };

  const renderComponent = (props = {}) =>
    render(<SecurityIcon {...defaultProps} {...props} />);

  const getComponent = () =>
    screen.getByTestId(`wizard-icon-${defaultProps.iconName}`);

  it('renders correctly the component', () => {
    renderComponent();
    expect(getComponent()).toBeInTheDocument();
  });

  it('renders the component with the size provided', () => {
    const { container } = renderComponent({ ...defaultProps, size: 50 });
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('svg')).toHaveAttribute('width', '50');
  });

  it('adds the provided extra props to the component', () => {
    renderComponent({ ...defaultProps, 'data-other': 'test' });
    expect(getComponent()).toHaveAttribute('data-other', 'test');
  });
});
