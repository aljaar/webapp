export const when = (statements, then, otherwise = () => {}) => Promise.resolve(
  ((statements) ? then() : otherwise()),
);

export const delay = (time) => new Promise((resolve) => { setTimeout(resolve, time); });

export const hash = (str) => window.btoa(
  // eslint-disable-next-line no-bitwise
  Array.from(str).reduce((temp, char) => 0 | (31 * temp + char.charCodeAt(0)), 0),
);
