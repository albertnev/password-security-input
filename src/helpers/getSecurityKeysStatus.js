export default (value, securityKeys) => {
  const conditions = [];

  securityKeys.forEach(({ hint, condition }) => {
    conditions.push({
      hint,
      succeeded:
        condition instanceof RegExp ? condition.test(value) : condition(value),
    });
  });

  return conditions;
};
