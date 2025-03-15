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

### The `equals` function

The `equals` function compares two values for equality. It takes two or three parameters. The first two must be present and may be of any type.

The third parameter is an optional configuration object. This object contains the properties `isOrderIgnoredForMap` and `isOrderIgnoredForObject`. Both properties are set to `true` by default.

Special equality comparisons have been added for `Date` and `Map`. More of these may be added in the future. The `Set` data type has not been added for example.

```js
const isEqual = equals({name: "John Doe"}, {name: "John Doe"});
```

### The `transformArray` function

The `transformArray` function takes three parameters. They are `array`, `arrayFilter` and `arrayTransformer`. It returns `array` or a transformed version of it.

If `arrayFilter` is provided and it is a function, it is called for each element in a copy of `array`. It takes two parameters. They are the element in the array and its index. It returns a boolean that indicates whether the element should be kept or not.

If `arrayTransformer` is provided and it is a function, it is called. It takes two parameters, both of which are arrays. The first contains a copy of `array`. It is the same copy that `arrayFilter` was provided. The second contains the elements that were discarded from the filtering process, if any.

The `transformArray` function returns the original `array` if nothing was changed. It uses the `equals` function to compare the two arrays.

### The `transformObject` function

The `transformObject` function takes three parameters. They are `object`, `objectFilter` and `objectTransformer`. It returns `object` or a transformed version of it.

If `objectFilter` is provided and it is a function, it is called for each property in a copy of `object`. It takes two parameters. They are the property value in the object and its key. It returns a boolean that indicates whether the property value should be kept or not.

If `objectTransformer` is provided and it is a function, it is called. It takes two parameters, both of which are objects. The first contains a copy of `object`. It is the same copy that `objectFilter` was provided. The second contains the property values that were discarded from the filtering process, if any.

The `transformObject` function returns the original `object` if nothing was changed. It uses the `equals` function to compare the two objects.