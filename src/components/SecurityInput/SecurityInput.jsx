import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getRenderedText, getSecurityKeysStatus } from '../../helpers';
import { SecurityIcon } from '../SecurityIcon';
import { SecurityList } from '../SecurityList';
import styles from './SecurityInput.module.scss';

const SecurityInput = ({
  onChange,
  defaultValue,
  label,
  placeholder,
  maskContent,
  visibilityToggle,
  getVisibilityIcon,
  maxLength,
  showRemainingCharacters,
  errorMessage,
  isValid,
  setIsValid,
  showSecurityHints,
  securityKeys,
  classNames,
  'data-testid': dataTestId,
}) => {
  const [inputState, setInputState] = useState({
    charactersCount: 0,
    maskedContent: maskContent,
    strengthPercentage: 0,
    securtiyConditions: [],
  });

  const {
    charactersCount,
    maskedContent,
    strengthPercentage,
    securityConditions,
  } = inputState;

  const checkSecurity = (value) => {
    const conditions = getSecurityKeysStatus(value, securityKeys);
    const securityPercentage = Math.round(
      (conditions.filter((cond) => cond.succeeded).length * 100) /
        conditions.length
    );

    setIsValid?.(securityPercentage === 100);
    setInputState((current) => ({
      ...current,
      strengthPercentage: securityPercentage,
      securityConditions: conditions,
    }));
  };

  const updateFeedback = (value) => {
    if (securityKeys) checkSecurity(value);
    setInputState((current) => ({
      ...current,
      charactersCount: value.length,
    }));
  };

  const handleOnChange = (ev) => {
    const { value } = ev.target;

    updateFeedback(value);
    onChange(value);
  };

  const getVisibilityToggleIcon = () =>
    getVisibilityIcon?.(maskedContent) || (
      <SecurityIcon
        data-testid={`${dataTestId}-mask-toggle`}
        iconName={maskedContent ? 'FaEye' : 'FaEyeSlash'}
        className={styles.visibilityIcon}
        onClick={() =>
          setInputState((current) => ({
            ...current,
            maskedContent: !current.maskedContent,
          }))
        }
      />
    );

  useEffect(() => {
    if (defaultValue) updateFeedback(defaultValue);
  }, []);

  return (
    <div data-testid={dataTestId} className={styles.inputWrapper}>
      {label && (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label data-testid={`${dataTestId}-label-container`}>
          <span
            data-testid={`${dataTestId}-label-text`}
            className={cx(styles.inputLabel, classNames.label)}
          >
            {getRenderedText(label)}
          </span>
          <div
            data-testid={`${dataTestId}-input-container`}
            className={cx({
              [styles.inputContainer]: true,
              [styles.success]: isValid,
              [styles.error]: isValid === false,
              [classNames.input]: classNames.input,
            })}
          >
            <input
              data-testid={`${dataTestId}-input-control`}
              type={maskedContent ? 'password' : 'text'}
              placeholder={placeholder}
              defaultValue={defaultValue}
              onChange={handleOnChange}
              maxLength={maxLength}
            />
            {visibilityToggle && getVisibilityToggleIcon()}
          </div>
          {securityKeys && (
            <div
              data-testid={`${dataTestId}-security-meter`}
              className={cx({
                [styles.securityMeter]: true,
                [styles.none]: strengthPercentage === 0,
                [styles.low]:
                  strengthPercentage > 0 && strengthPercentage <= 50,
                [styles.middle]:
                  strengthPercentage > 50 && strengthPercentage < 100,
                [styles.high]: strengthPercentage === 100,
                [classNames.securityMeter]: classNames.securityMeter,
              })}
            />
          )}
          {showRemainingCharacters && maxLength && (
            <span
              data-testid={`${dataTestId}-characters-left`}
              className={cx(
                styles.charactersLeft,
                classNames.remainingCharacters
              )}
            >
              {charactersCount}/{maxLength}
            </span>
          )}
          {securityConditions?.length > 0 && showSecurityHints && (
            <SecurityList
              className={cx(classNames.conditionsList)}
              securityConditions={securityConditions}
            />
          )}
          {errorMessage && (
            <div
              data-testid={`${dataTestId}-error-message`}
              className={cx(styles.errorMessage, classNames.errorMessage)}
            >
              {getRenderedText(errorMessage)}
            </div>
          )}
        </label>
      )}
    </div>
  );
};

SecurityInput.propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  placeholder: PropTypes.string,
  maskContent: PropTypes.bool,
  visibilityToggle: PropTypes.bool,
  maxLength: PropTypes.number,
  getVisibilityIcon: PropTypes.func,
  showRemainingCharacters: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isValid: PropTypes.bool,
  setIsValid: PropTypes.func,
  showSecurityHints: PropTypes.bool,
  'data-testid': PropTypes.string,
  classNames: PropTypes.shape({
    label: PropTypes.string,
    input: PropTypes.string,
    securityMeter: PropTypes.string,
    remainingCharacters: PropTypes.string,
    conditionsList: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
  securityKeys: PropTypes.arrayOf(
    PropTypes.shape({
      hint: PropTypes.string,
      condition: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.func,
      ]),
    })
  ),
};

SecurityInput.defaultProps = {
  onChange: () => null,
  label: '',
  defaultValue: '',
  placeholder: '',
  maskContent: false,
  visibilityToggle: false,
  getVisibilityIcon: undefined,
  maxLength: undefined,
  showRemainingCharacters: false,
  errorMessage: '',
  isValid: undefined,
  setIsValid: undefined,
  showSecurityHints: true,
  securityKeys: undefined,
  classNames: {},
  'data-testid': 'wizard-input',
};

export default SecurityInput;
