# bulmaselect

[![License](https://img.shields.io/npm/l/bulmaselect)][license]
[![Downloads](https://img.shields.io/npm/dw/bulmaselect)][package]
[![Bundle Size](https://img.shields.io/bundlephobia/min/bulmaselect)][package]
[![Version](https://img.shields.io/npm/v/bulmaselect?color=orange)][package]

## About

Bulmaselect is a multiselect library written in TypeScript styled to fit [Bulma][bulma]. It relies on Bulma for styling, and is meant to be lightweight and fast on its own.

## Example

```HTML
<!DOCTYPE html>

<html>

<body>
  <div id="ms"></div>
</body>

<script src="https://cdn.jsdelivr.net/npm/bulmaselect@latest/dist/index.js"></script>

<script>

// Options to pass to the multiselect

const config = {
  options: [
    { label: "testLabel1" },
    { label: "testLabel2" },
    { label: "testLabel3" },
    {
      label: "groupTest",
      type: "group",
      children: [
        {
          label: "childLabel1",
        },
        {
          label: "childLabel2",
        },
      ],
    },
  ],
};

// Creates a multiselect with your options.
let ms = new Bulmaselect("ms", config)

</script>

</html>
```

## License

[MIT][license]

[bulma]: https://bulma.io "Bulma"
[package]: https://www.npmjs.com/package/bulmaselect "Bulmaselect Package"
[license]: LICENSE "MIT License"
