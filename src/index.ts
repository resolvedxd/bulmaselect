/**
 * @file Bulmaselect
 * @author resolved <resolvedxd@gmail.com>
 * @author Espi <espi@riseup.net>
 * @license MIT
 */

// Default locale
const englishLocale: BulmaselectLocale = {
  btnNoSelection: "Nothing selected",
  searchPlaceholder: "Search",
};

// Default config
const defaultConfig: BulmaselectOptions = {
  isOpen: false,
  keepOpen: false,
  keepOpenClickoff: false,
  btnMaxLabels: 3,
  btnDelimiter: ", ",
  searchEnable: true,
  searchAutoFocus: true,
  locale: englishLocale,
  options: [],
  classNames: {
    select: "select",
    button: "bs-button",
    dropdown: "bs-drop",
    itemUL: "bs-ul",
    itemSpan: "bs-span",
    itemCheckbox: "bs-checkbox",
    itemGroup: "bs-group",
    groupLabel: "bs-group-label",
    itemLabel: "bs-label",
    textBox: "bs-textbox",
    bulmaTextLeft: "has-text-left",
    bulmaButton: "button",
    bulmaBold: "has-text-weight-bold",
    bulmaInput: "input",
    bulmaSmall: "is-small",
    bulmaHidden: "is-hidden",
    bulmaMarginLeft: "ml-1",
    bulmaBlock: "is-block",
    bulmaCheckbox: "checkbox",
    bulmaJustify: "is-justify-content-left",
  },
};

/**
 * Creates a new Bulmaselect instance
 */

export default class Bulmaselect {
  search: HTMLInputElement;
  parent: HTMLElement;
  config: BulmaselectOptions = {};
  options: BulmaselectValues[];
  button: HTMLButtonElement;
  ul: HTMLUListElement;
  dropdown: HTMLDivElement;

  constructor(parentElement: HTMLElement | string, config: typeof defaultConfig) {
    let parent: HTMLElement;

    // Gets the parent element
    if (typeof parentElement === "string") parent = document.getElementById(parentElement);
    else if (parentElement instanceof Element) parent = parentElement;
    if (!parent) throw new Error("No parent element was provided.");

    // Select element
    if (parent.nodeName === "SELECT") {
      config.options = [];
      Array.from(parent.children).forEach((c: any) => {
        if (c.innerText && c.id) config.options.push({ label: c.innerText, id: c.id });
        else if (c.innerText) config.options.push(c.innerText);
      });

      const div = document.createElement("div");
      parent.parentNode.replaceChild(div, parent);
      parent = div;
    }

    // Gets the config options
    this.config = { ...defaultConfig, ...config };

    this.config.options = this.config.options.map((option) => {
      if (typeof option === "string") {
        return { label: option, id: option };
      }

      // Switches the option type and returns the proper values
      switch (option.type) {
        case "group": {
          option.children = option.children.map((child) => (typeof child === "string" ? { label: child, id: child } : child));
          return option;
        }

        default: {
          return option;
        }
      }
    });

    // Creates the parent wrapper div
    const wrapperDiv = document.createElement("div");

    // Creates the parent button
    const button = document.createElement("button");
    button.classList.value = `${this.config.classNames.select} ${this.config.classNames.bulmaTextLeft} ${this.config.classNames.button} ${this.config.classNames.bulmaButton} ${this.config.classNames.bulmaJustify}`;
    wrapperDiv.appendChild(button);

    // Creates the individual list divs
    const ulDiv = document.createElement("div");
    ulDiv.classList.value = `${this.config.classNames.dropdown}`;

    // Hides the element if isOpen & keepOpen are both false
    ulDiv.hidden = !this.config.isOpen && !this.config.keepOpen;

    // Creates individual ul elements
    const ul = document.createElement("ul");
    ul.classList.value = `${this.config.classNames.itemUL}`;
    wrapperDiv.appendChild(ulDiv);
    parent.appendChild(wrapperDiv);

    // Handles clickOff events
    if (!this.config.keepOpenClickoff && !this.config.keepOpen) {
      window.addEventListener("click", (event) => {
        if (
          event.target !== ulDiv &&
          (event.target as Node).parentNode !== ulDiv &&
          (event.target as Node).parentNode?.parentNode !== ulDiv &&
          (event.target as Node).parentNode?.parentNode?.parentNode !== ulDiv
        )
          ulDiv.hidden = true;
      });
    }

    // Creates the search bar
    if (this.config.searchEnable) {
      const searchElement = document.createElement("input");
      searchElement.classList.value = `${this.config.classNames.bulmaInput} ${this.config.classNames.bulmaSmall} ${this.config.classNames.textBox} `;
      searchElement.placeholder = this.config.locale.searchPlaceholder || englishLocale.searchPlaceholder;
      ulDiv.appendChild(searchElement);

      // Handles search input
      searchElement.addEventListener("input", () => this.updateFilter());
      this.search = searchElement;
    }

    ulDiv.appendChild(ul);
    ul.addEventListener("click", () => {
      this.updateButton();
      if (this.config.searchEnable) this.search.focus();
    });

    // Opens the button onClick
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!this.config.keepOpen) {
        ulDiv.hidden = !ulDiv.hidden;
        if (this.config.searchEnable && !ulDiv.hidden) this.search.focus();
      }
    });

    // Creates a element for each option
    this.config.options.forEach((option, i) => {
      // Creates the label
      const label = document.createElement("label");
      label.classList.value = `${this.config.classNames.itemLabel} ${this.config.classNames.bulmaBlock}`;

      // Creates the span element
      const span = document.createElement("span");
      span.classList.value = `${this.config.classNames.itemSpan} ${this.config.classNames.bulmaMarginLeft}`;
      span.innerText = option.label;
      ul.appendChild(label);

      // Creates checkboxes
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.value = `${this.config.classNames.itemCheckbox} ${this.config.classNames.bulmaCheckbox}`;
      label.appendChild(checkbox);

      // Handles item selection/deselections
      switch (option.type) {
        // Handles groups and their selection
        case "group": {
          option.children.forEach((child, _i) => {
            // Creates the group labels and spans
            const groupLabel = document.createElement("label");
            groupLabel.classList.value = `${this.config.classNames.itemLabel} ${this.config.classNames.bulmaBlock}`;

            // Creates the groups's span
            const groupSpan = document.createElement("span");
            groupSpan.classList.value = `${this.config.classNames.itemSpan} ${this.config.classNames.bulmaMarginLeft}`;
            groupSpan.innerText = child.label;
            ul.appendChild(groupLabel);

            // Creates group checkboxes
            const groupCheckbox = document.createElement("input");
            groupCheckbox.type = "checkbox";
            groupCheckbox.classList.value = `${this.config.classNames.itemCheckbox} ${this.config.classNames.bulmaCheckbox}`;

            // Gets child state
            Object.defineProperty(this.config.options[i].children[_i], "state", {
              get: () => groupCheckbox.checked,
              set: (selection) => {
                if (typeof selection !== "boolean") throw new Error("This property cannot be set to a non-boolean.");
                groupCheckbox.checked = selection;
                this.updateButton();
              },
            });

            this.config.options[i].children[_i].el = groupLabel;
            this.config.options[i].children[_i].checkbox = groupCheckbox;
            groupLabel.appendChild(groupCheckbox);
            groupLabel.appendChild(groupSpan);
          });

          // Gets option states
          Object.defineProperty(this.config.options[i], "state", {
            get: () => !this.config.options[i].children.map((child) => child.state).includes(false),
            set: (s) => {
              if (typeof s !== "boolean") throw new Error("This property cannot be set to a non-boolean.");
              this.config.options[i].children.forEach((child) => (child.state = s));
              checkbox.checked = s;
              this.updateButton();
            },
          });

          // List of classes used
          span.classList.value = `${this.config.classNames.itemSpan} ${this.config.classNames.itemGroup} ${this.config.classNames.bulmaBold} ${this.config.classNames.bulmaMarginLeft}`;
          label.classList.value = ` ${this.config.classNames.groupLabel} ${this.config.classNames.bulmaBlock}`;

          // Listens for input on the checkbox
          checkbox.addEventListener("click", () => {
            this.config.options[i].state = !this.config.options[i].state;
          });

          break;
        }

        // Individual items
        default: {
          Object.defineProperty(this.config.options[i], "state", {
            get: () => checkbox.checked,
            set: (selection) => {
              if (typeof selection !== "boolean") throw new Error("This property cannot be set to a non-boolean.");
              checkbox.checked = selection;
              this.updateButton();
            },
          });

          break;
        }
      }

      label.appendChild(span);
      this.config.options[i].checkbox = checkbox;
      this.config.options[i].el = label;
    });

    this.parent = parent;
    this.button = button;
    this.dropdown = ulDiv;
    this.ul = ul;
    this.updateButton();
  }

  // Gets selected items
  getSelected() {
    this.updateSelections();
    const selected: BulmaselectValues[] = [];

    this.config.options
      .map((c) => Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c)))
      .forEach((option) => {
        switch (option.type) {
          case "group": {
            const selectedChildren: BulmaselectValues[] = [];
            option.children.forEach((child: BulmaselectValues) => {
              if (child.state) selectedChildren.push(child);
            });

            if (selectedChildren.length) {
              option.children = selectedChildren;
              selected.push(option);
            }

            return;
          }
        }

        // If the option's state is true
        if (option.state) selected.push(option);
      });

    return selected;
  }

  // Updates selections
  updateSelections() {
    this.config.options.forEach((option) => {
      if (option.type === "group") {
        option.checkbox.checked = option.state;
      }
    });
  }

  // Updates the button
  updateButton() {
    let selected = this.getSelected();
    selected.forEach((s, i) => {
      if (s.type === "group") {
        selected.splice(i, 1);
        if (s.state) return selected.push(s);
        selected = selected.concat(s.children);
      }
    });

    // Updates the innerText
    if (!selected.length) {
      this.button.innerText = this.config.locale.btnNoSelection;
    } else {
      this.button.innerText = `${selected
        .slice(0, this.config.btnMaxLabels)
        .map((s) => s.label)
        .join(this.config.btnDelimiter)}${selected.length > this.config.btnMaxLabels ? "..." : ""}`;
    }
  }

  // Updates a search filter
  updateFilter(filter?: string) {
    if (!filter && !this.search && !this.search.value.length) return;
    const val = filter || this.search.value.toLowerCase();

    // Searches thru each option
    this.config.options.forEach((option) => {
      const hiddenClass = this.config.classNames.bulmaHidden;

      if (option.type === "group") {
        option.children.forEach((child) => {
          // Finds out whether or not we should hide the element
          const hide = !child.label.toLowerCase().includes(val);

          // Sets "hidden" = true
          Array.from(child.el.children).forEach((c) => ((c as HTMLElement).hidden = hide));
          child.el.hidden = hide;
          // Adds the bulma hidden class to hide the checkbox
          hide ? child.checkbox.classList.add(hiddenClass) : child.checkbox.classList.remove(hiddenClass);
        });

        const hide = option.children.map((c) => c.el.hidden).includes(false);
        hide ? option.checkbox.classList.remove(hiddenClass) : option.checkbox.classList.add(hiddenClass);
        Array.from(option.el.children).forEach((c) => ((c as HTMLElement).hidden = !hide));
      } else {
        // Hides individual elements
        const hide = !option.label.toLowerCase().includes(val);
        Array.from(option.el.children).forEach((c) => ((c as HTMLElement).hidden = hide));
        hide ? option.checkbox.classList.add(hiddenClass) : option.checkbox.classList.remove(hiddenClass);
      }
    });
  }

  update() {
    this.updateSelections();
    this.updateButton();
    this.updateFilter();
  }
}
