import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import * as icons from 'react-icons/fa';

import styles from './SecurityIcon.module.scss';

const SecurityIcon = ({ iconName, className, size, ...props }) => {
  const IconToRender = icons[iconName];
  return (
    /* eslint-disable react/jsx-props-no-spreading */
    <span
      data-testid={`wizard-icon-${iconName}`}
      className={cx(styles.iconContainer, className)}
      {...props}
    >
      <IconToRender size={size} />
    </span>
    /* eslint-enable react/jsx-props-no-spreading */
  );
};

SecurityIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.number,
};

SecurityIcon.defaultProps = {
  className: undefined,
  size: undefined,
};

export default SecurityIcon;
