Transformer.js
==============
Transformer.js is a value transformer for JavaScript.

Getting Started
---------------
To clone this repository, you can type the following in Git Bash.

```bash
git clone https://github.com/macroing/Transformer.js.git
```

To install this library using NPM, you can type the following in a command-line tool.

```bash
npm install @macroing/transformer.js
```

To use the library, consider the following example.

```js
import { transform } from "@macroing/transformer.js";

const oldValue = {name: "John Doe"};
const newValue = transform(oldValue, ({value}) => value === "John Doe" ? "Jane Doe" : value);

console.log(newValue.name === "Jane Doe");
```