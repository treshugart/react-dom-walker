# react-dom-walker

> Find render roots, reverse engineer and walk the React node tree.

## Install

```
npm i react-dom-walker
```

## Usage

```js
import { walk, findRoots, getDisplayName } from 'react-dom-walker';

const displayNames = [];

for (const root of findRoots(document.body)) {
  walk(root, node => {
    displayNames.push(getDisplayName(node));
  });
}

// ['ComponentA', 'ComponentB']
console.log(displayNames);
```
