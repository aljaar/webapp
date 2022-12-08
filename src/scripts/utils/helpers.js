export const when = (statements, then, otherwise = () => {}) => Promise.resolve(
  ((statements) ? then() : otherwise()),
);

export const delay = (time) => new Promise((resolve) => { setTimeout(resolve, time); });

export const hash = (str) => window.btoa(
  // eslint-disable-next-line no-bitwise
  Array.from(str).reduce((temp, char) => 0 | (31 * temp + char.charCodeAt(0)), 0),
);

// the compareArrays function takes two arrays of objects as arguments
export const compareArrays = (originalArray, updatedArray) => {
  // convert arrays to strings
  const originalArrayString = JSON.stringify(originalArray);
  const updatedArrayString = JSON.stringify(updatedArray);

  // result array
  const result = {
    added: [],
    deleted: [],
    isChanged: (originalArrayString !== updatedArrayString),
  };

  // compare the strings to see what has been updated or deleted
  if (originalArrayString !== updatedArrayString) {
    // map the updated array to an array of objects with the added/updated items
    updatedArray
      .forEach((item) => {
        // find the corresponding item in the original array
        const originalItem = originalArray.find((i) => i.id === item.id);
        // check if the item exists in the original array
        if (!originalItem) {
          // return the added item
          result.added.push(item);
        }
      });

    // filter the original array to an array of objects with the deleted items
    const deleted = originalArray.filter(
      (item) => !updatedArray.some((i) => i.id === item.id),
    );

    // map the deleted array to an array of objects with the id and action
    deleted.forEach((item) => {
      result.deleted.push(item);
    });
  }

  // return the result array
  return result;
};

export const compareObjects = (originalObject, updatedObject) => {
  // convert objects to strings
  const originalObjectString = JSON.stringify(originalObject)
    .split('')
    .sort()
    .join('');
  const updatedObjectString = JSON.stringify(updatedObject)
    .split('')
    .sort()
    .join('');

  // result array
  const result = {
    updated: {},
    deleted: {},
    isChanged: (originalObjectString !== updatedObjectString),
  };
  // compare the strings to see what has been updated or deleted
  if (originalObjectString !== updatedObjectString) {
    // map the updated object to an array of objects with the added/updated properties
    Object.entries(updatedObject)
      .forEach(([property, value]) => {
        // check if the property has been updated
        if (
          JSON.stringify(originalObject[property])
            !== JSON.stringify(updatedObject[property])
        ) {
          // return the updated property
          result.updated = {
            ...result.updated,
            [property]: value,
          };
        }
      });

    // filter the original object to an array of objects with the deleted properties
    const deleted = Object.entries(originalObject).filter(
      ([property]) => !updatedObject.hasOwnProperty(property),
    );

    // map the deleted array to an array of objects with the property and action
    deleted.forEach(([property, value]) => {
      result.deleted = {
        ...result.deleted,
        [property]: value,
      };
    });
  }

  // return the result array
  return result;
};

export const redirect = (path = '/#/') => {
  if (window.location.hash === path || window.location.hash === path.slice(1)) {
    window.refreshRender();
  } else {
    window.location.hash = (path.startsWith('/')) ? path.slice(1) : path;
  }
};
