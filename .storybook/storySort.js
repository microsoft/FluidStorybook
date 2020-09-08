/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const storySort = options => (a, b) => {
    // Debug.
    // console.log({a, b});
  
    // If the two stories have the same story kind, then use the default
    // ordering, which is the order they are defined in the story file.
    if (a[1].kind === b[1].kind) {
      return 0;
    }
  
    const storyKindA = a[1].kind.split('/');
    const storyKindB = b[1].kind.split('/');
    let depth = 0;
    let nameA, nameB, indexA, indexB, index;
    let ordering = options.order || [];
  
    while (true) {
      nameA = storyKindA[depth] ? storyKindA[depth] : '';
      nameB = storyKindB[depth] ? storyKindB[depth] : '';
  
      if (nameA === nameB) {
        // If a nested array is provided for a name, use it for ordering.
        index = ordering.indexOf(nameA);
        if (index !== -1 && Array.isArray(ordering[index + 1])) {
          ordering = ordering[index + 1];
        }
  
        // We'll need to look at the next part of the name.
        depth++;
        continue;
      }
      else {
        // Look for the names in the given `ordering` array.
        indexA = ordering.indexOf(nameA);
        indexB = ordering.indexOf(nameB);
  
        // If at least one of the names is found, sort by the `ordering` array.
        if (indexA !== -1 || indexB !== -1) {
          // If one of the names is not found in `ordering`, list it last.
          if (indexA === -1) {
            indexA = ordering.length;
          }
          if (indexB === -1) {
            indexB = ordering.length;
          }
  
          return indexA - indexB;
        }
      }
  
      // Otherwise, use alphabetical order.
      return nameA.localeCompare(nameB);
    }
  };