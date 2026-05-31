export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const isObject = function (o: any) {
  return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
};

export const keysToCamel = function (o: any): any {
  if (isObject(o)) {
    const n = {};
    Object.keys(o).forEach((k) => {
      (n as any)[toCamel(k)] = keysToCamel(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }
  return o;
};

export const toSnake = (s: string) => {
  return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const keysToSnake = function (o: any): any {
  if (isObject(o)) {
    const n = {};
    Object.keys(o).forEach((k) => {
      (n as any)[toSnake(k)] = keysToSnake(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return keysToSnake(i);
    });
  }
  return o;
};
