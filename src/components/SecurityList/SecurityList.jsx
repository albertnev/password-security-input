import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { SecurityIcon } from '../SecurityIcon';
import styles from './SecurityList.module.scss';

const SecurityList = ({ securityConditions, className }) => (
  <ul
    data-testid="wizard-security-list-container"
    className={cx(styles.hintList, className)}
  >
    {securityConditions.map(({ succeeded, hint }) => (
      <li
        data-testid="wizard-security-list-hint"
        key={`hint-${hint.replace(' ', '')}`}
        className={cx({
          [styles.hint]: true,
          [styles.hintSucceeded]: succeeded,
          [styles.hintFailed]: !succeeded,
        })}
      >
        <SecurityIcon iconName={succeeded ? 'FaCheck' : 'FaTimes'} size={10} />{' '}
        <span className={styles.hintText}>{hint}</span>
      </li>
    ))}
  </ul>
);

SecurityList.propTypes = {
  securityConditions: PropTypes.arrayOf(
    PropTypes.shape({
      succeeded: PropTypes.bool,
      hint: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
};

SecurityList.defaultProps = {
  className: '',
};

export default SecurityList;
