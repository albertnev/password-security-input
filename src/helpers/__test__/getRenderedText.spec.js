import getRenderedText from '../getRenderedText';

describe('getRenderedText helper', () => {
  it('returns the text correctly if it is sent as a string', () => {
    expect(getRenderedText('test')).toEqual('test');
  });

  it('returns the rendered result of the method provided if it is sent as a method', () => {
    expect(getRenderedText(() => 'method test')).toEqual('method test');
  });
});
