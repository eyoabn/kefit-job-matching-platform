const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};
const isObject = function (o) {
  return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
};
const keysToCamel = function (o) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }
  return o;
};

const resp = { access_token: "123", refresh_token: "456" };
console.log(keysToCamel(resp));
