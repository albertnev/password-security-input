import getSecurityKeysStatus from '../getSecurityKeysStatus';

describe('getSecurityKeysStatus helper', () => {
  it('returns succeeded and failed hints correctly', () => {
    const securityKeys = [
      { hint: 'one special character', condition: /[^A-Za-z0-9]+/ },
      { hint: 'one number', condition: /.*[0-9].*/ },
      { hint: 'at least 5 characters', condition: (val) => val.length >= 5 },
      { hint: 'contains H', condition: (val) => val.includes('H') },
    ];

    const result = getSecurityKeysStatus('te2sting', securityKeys);
    expect(result.filter((sec) => sec.succeeded)).toHaveLength(2);
    expect(result.filter((sec) => !sec.succeeded)).toHaveLength(2);
  });

  it('returns the expected result either if conditions are RegExp or bool methods ', () => {
    const securityKeys = [
      { hint: 'has five characters long regexp', condition: /.{5,}/ },
      {
        hint: 'has five characters long method',
        condition: (val) => val.length >= 5,
      },
    ];

    const falseResult = getSecurityKeysStatus('test', securityKeys);
    const positiveResult = getSecurityKeysStatus('testing', securityKeys);

    expect(falseResult.filter((sec) => !sec.succeeded)).toHaveLength(2);
    expect(positiveResult.filter((sec) => sec.succeeded)).toHaveLength(2);
  });
});
