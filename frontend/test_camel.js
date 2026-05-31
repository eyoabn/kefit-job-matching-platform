const { toCamel, keysToCamel, isObject } = require('./test_camel_imports.js');
console.log(keysToCamel({ access_token: "test" }));
