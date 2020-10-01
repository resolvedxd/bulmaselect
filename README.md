# bulmaselect
[![License](https://img.shields.io/npm/l/bulmaselect)][LICENSE]
[![Downloads](https://img.shields.io/npm/dw/bulmaselect)][PACKAGE]
[![Bundle Size](https://img.shields.io/bundlephobia/min/bulmaselect)][PACKAGE]
[![Version](https://img.shields.io/npm/v/bulmaselect?color=orange)][PACKAGE]

## About
Bulmaselect is a fast multiselect library for the web written in vanilla JavaScript. While styled like [Bulma][BULMA], it can work anywhere and has a variety of options to choose from.

## Example

```HTML
<!DOCTYPE html>

<html>

<body>
  <div id="ms"></div>
</body>

<script src="https://cdn.jsdelivr.net/npm/bulmaselect@latest/dist/bulmaselect.min.js"></script>

<script>

// Locale options used for strings
const englishLocale = {
  btnNoSelection: "Nothing selected", // When no items are selected
  searchPlaceholder: "Search", // The placeholder text in the search bar
}

// List of options. These are the current defaults. Only specify what you want to differ from the default.
const config = {
  isOpen: false, // Whether to open the dropdown by default. Defaults to false.
  keepOpen: false, // Whether to keep the dropdown open on clickoff. Defaults to false.
  injectStyle: true, // Whether to inject the default CSS. Defaults to true.
  btnMaxLabels: 3, // The max labels to show on the button before elipsing text. Defaults to 3.
  btnDelimiter: ",", // The delimiter (i.e ,) between labels on the button. Defaults to `, `.
  searchEnable: false, // Whether to show the searchbar or not. Defaults to false.
  locale: englishLocale, // The locale option object, configured above. Defaults to English.
  options: ["a", "b", "c"], // The actual data to send to the select. Put your array of objects here. Needed.
};

// Creates a multiselect with your options.
let ms = new Bulmaselect("ms", config)

</script>

</html>
```

## License
[MIT][LICENSE]

[BULMA]: https://bulma.io "Bulma"
[CHANGELOG]: CHANGELOG.md "Changelog File"
[PACKAGE]: https://www.npmjs.com/package/bulmaselect "Bulmaselect Package"
[LICENSE]: LICENSE "MIT License"
