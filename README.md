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

The `transform` function has two parameters. They are `value` and `valueTransformer`. Both of them are required. It returns `value` or a transformed version of it.

Anything can be passed as `value`, but a function has to be passed as `valueTransformer`.

The function `valueTransformer` has one parameter. It is an object called `context`.

```js
const newValue = transform("Hello, World!", (context) => context.value);
```

The `context` parameter of `valueTransformer` contains a few useful properties. They are listed below.

| Name              | Type                  | Description                                               |
| ----------------- | --------------------- | --------------------------------------------------------- |
| `equals`          | function              | A function thas is always present.                        |
| `parent`          | array, null or object | The parent array or object. It may be null.               |
| `parentIndex`     | null or number        | The index for the parent array or object. It may be null. |
| `parentKey`       | null or value         | The key for the parent array or object. It may be null.   |
| `parents`         | array                 | An array that contains all parents.                       |
| `transformArray`  | function or null      | A function that can transform an array. It may be null.   |
| `transformObject` | function or null      | A function that can transform an object. It may be null.  |
| `value`           | value                 | The current value.                                        |
| `valueIndex`      | null or number        | The index for the current value. It may be null.          |
| `valueKey`        | null or value         | The key for the current value. It may be null.            |
| `valueOld`        | value                 | The old version of the current value.                     |