/**
 * @file Bulmaselect typings
 * @description Core typings for the Bulmaselect library
 * @typedef index
 */

/**
 * Options added when creating a new Bulmaselect instance.
 */

interface BulmaselectOptions {
  // Locale options.
  locale?: BulmaselectLocale;

  // Data to pass to the main selector.
  options?: BulmaselectValues[];

  /**
   * Whether or not the selection should automatically open
   * @default false
   */

  isOpen?: boolean;

  /**
   * Whether or not to always keep the selection open, even on clickOff.
   * @default false
   */

  keepOpen?: boolean;

  /**
   * Whether or not to keep the selection open on clickOff.
   * @default false
   */

  keepOpenClickoff?: boolean;

  /**
   * Whether or not to enable the search box.
   * @default true
   */

  searchEnable?: boolean;

  /**
   * Whether or not to automatically focus the search box input.
   * @default true
   */

  searchAutoFocus?: boolean;

  /**
   * The maximum amount of labels.
   * @default 3
   */

  btnMaxLabels?: number;

  /**
   * The delimiter between items.
   * @default ", "
   */

  btnDelimiter?: string;

  /**
   * Class names for the elements
   * @since v2.0.0
   */

  classNames?: BulmaselectClassNames;
}

/**
 * String locale options.
 */

interface BulmaselectLocale {
  /**
   * The string that shows when nothing is selected
   * @default "Nothing selected".
   */

  btnNoSelection?: string;

  /**
   * The string that shows when nothing is typed in the search box.
   * @default "Search"
   */

  searchPlaceholder?: string;
}

interface BulmaselectValues {
  state?: any;
  label?: string;
  type?: "group";

  /**
   * Specific ID
   * @since v2.0.0
   */

  id?: string;
  checkbox?: HTMLInputElement;
  el?: HTMLLabelElement;

  children?: BulmaselectValues[];
}

/**
 * Class names for multiselect elements
 * @since v2.0.0
 */

interface BulmaselectClassNames {
  button?: string;
  dropdown?: string;
  multiSelect?: string;
  itemUL?: string;
  itemSpan?: string;
  itemCheckbox?: string;
  itemGroup?: string;
  groupLabel?: string;
  itemLabel?: string;
  textBox?: string;
  bulmaButton?: string;
  bulmaBold?: string;
  bulmaInput?: string;
  bulmaSmall?: string;
  bulmaHidden?: string;
  bulmaMarginLeft?: string;
  bulmaBlock?: string;
  bulmaCheckbox?: string;
  bulmaJustify?: string;
  bulmaTextLeft?: string;
  select?: string;
}
