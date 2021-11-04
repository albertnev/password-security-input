export default (txt) => (typeof txt === 'function' ? txt() : txt);
