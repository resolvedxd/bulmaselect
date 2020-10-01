"use strict";

const englishLocale = {
  btnNoSelection: "Nothing selected",
  searchPlaceholder: "Search",
};

const defaultStyle =
  ".ms-textbox{width:270px;align-items:middle;justify-content:center;justify-self:center;text-align:center;display:block;margin-top:5px;margin-left:5px;margin-right:5px}.ms-ul{list-style-type:none;margin-left:5px!important;margin-top:3px!important;margin-bottom:3px}.ms-button{color:#fff;height:2.5em;line-height:1.5;width:300px;height:40px;text-align:left;font-size:1em;background-color:#fff;border-color:#dbdbdb;border-radius:4px;color:#363636;z-index:55}.ms-drop{background-color:#fff;position:absolute;color:#363636;width:300px;height:300px;max-width:300px;max-height:300px;overflow:auto!important;z-index:55}.select:after{z-index:0!important}.ms-group{font-weight:700}.ms-span{margin-left:5px}.ms-label{text-overflow:ellipsis!important;display:block}";

// TODO: Implement themes and an auto theme with prefers-media-scheme or whatever it's called.
/* const defaultLightStyle = "";
const defaultDarkStyle = ""; */

// The default configuration
const defaultConfig = {
  // TODO: Add theme: light, dark, or auto. Default to auto, which reads prefers-media-scheme. I'll do that later... CSS sucks.
  isOpen: false, // Whether to open the dropdown by default
  keepOpen: false, // Whether to keep the dropdown open on clickoff
  injectStyle: true, // Whether to inject the default CSS
  btnMaxLabels: 3, // The max labels to show on the button before elipsing text
  btnDelimiter: ",", // The delimiter (i.e ,) between labels on the button
  searchEnable: false, // Whether to show the searchbar or not
  locale: englishLocale, // The locale option object. btnNoSelection: what to show when nothing's selected. searchPlaceholder: the placeholder text in the search bar.
  options: ["a", "b", "c"], // The actual data to send to the select
};

class Bulmaselect {
  constructor(parent, config = defaultConfig) {
    // Tries to find the parent by ID
    if (typeof parent === "string") parent = document.getElementById(parent);
    if (!parent) throw new Error("No parent element");

    if (parent.nodeName === "SELECT") {
      config.options = [];
      Array.from(parent.children).forEach(c => {
        if (c.innerText) config.options.push(c.innerText);
      });

      const div = document.createElement("div");
      parent.parentNode.replaceChild(div, parent);
      parent = div;
    }

    config = { ...defaultConfig, ...config };

    config.options = config.options.map(opt => {
      if (typeof opt === "string") return { label: opt };
      else if (opt.type === "group") {
        opt.children = opt.children.map(child => typeof child === "string" ? { label: child } : child);
        return opt;
      } else {
        return opt;
      }
    });

    // Injects styles
    // TODO: Other themes
    if (config.injectStyle) {
      const style = document.createElement("style");
      style.textContent = defaultStyle;
      document.head.append(style);
    }

    // Creates the button
    const button = document.createElement("button");
    button.classList = "ms-button";
    button.innerText = config.label;
    parent.appendChild(button);
    // Creates the ul divs
    const uldiv = document.createElement("div");
    uldiv.classList = "ms-drop";
    // Hides the div if isOpen & keepOpen aren't set
    uldiv.hidden = !config.isOpen && !config.keepOpen;
    const ul = document.createElement("ul");
    ul.classList = "ms-ul";
    parent.appendChild(uldiv);

    // Creates the search bar
    if (config.searchEnable) {
      const search = document.createElement("input");
      search.classList = "ms-textbox";
      search.placeholder = config.locale.searchPlaceholder;
      uldiv.appendChild(search);

      // Listens for input on the input field
      search.addEventListener("input", () => this.updateFilter());
      this.search = search;
    }

    // Waits for the button to be clicked to update it
    uldiv.appendChild(ul);
    ul.addEventListener("click", s => this.updateButton());

    // Opens the button on click
    button.addEventListener("click", () => config.keepOpen ? null : uldiv.hidden = !uldiv.hidden);
    config.options.forEach((opt, i) => {
      // Creates the item labels and spans
      const label = document.createElement("label");
      label.classList = "ms-label";
      const span = document.createElement("span");
      span.classList = "ms-span";
      span.innerText = opt.label;
      ul.appendChild(label);

      // Creates checkboxes
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList = "ms-checkbox";
      label.appendChild(checkbox);

      // Handles groups and their selection
      if (opt.type === "group") {
        opt.children.forEach((child, i_) => {
          // Creates the group labels and spans
          const groupLabel = document.createElement("label");
          groupLabel.classList = "ms-label";
          const groupSpan = document.createElement("span");
          groupSpan.classList = "ms-span";
          groupSpan.innerText = child.label;
          ul.appendChild(groupLabel);

          // Creates group checkboxes
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList = "ms-checkbox";

          // Gets child's state
          Object.defineProperty(config.options[i].children[i_], "state", {
            get: () => checkbox.checked,
            set: s => {
              if (typeof s !== "boolean") throw new Error("You can't set this property to a non-boolean");
              checkbox.checked = s;
              this.updateButton();
            },
          });

          // Sets the options and appends items
          config.options[i].children[i_].el = groupLabel;
          config.options[i].children[i_].checkbox = checkbox;
          groupLabel.appendChild(checkbox);
          groupLabel.appendChild(groupSpan);
        });

        // Gets option's state
        Object.defineProperty(config.options[i], "state", {
          get: () => !config.options[i].children.map(c => c.state).includes(false),
          set: s => {
            if (typeof s !== "boolean") throw new Error("You can't set this property to a non-boolean");
            config.options[i].children.forEach(c => c.state = s);
            checkbox.checked = s;
            this.updateButton();
          },
        });

        // List of classes used
        span.classList = "ms-span ms-group";
        label.classList = checkbox.classList + " ms-group-label";
        checkbox.addEventListener("click", d => {
          config.options[i].state = !config.options[i].state;
        });
      } else {
        // Handles individual items and their selections
        Object.defineProperty(config.options[i], "state", {
          get: () => checkbox.checked,
          set: s => {
            if (typeof s !== "boolean") throw new Error("You can't set this property to a non-boolean");
            checkbox.checked = s;
            this.updateButton();
          },
        });
      }

      label.appendChild(span);
      config.options[i].checkbox = checkbox;
      config.options[i].el = label;
    });

    this.parent = parent;
    this.config = config;
    this.options = config.options;
    this.button = button;
    this.dropdown = uldiv;
    this.ul = ul;
    this.updateButton();
  }

  // Gets selected items
  getSelected() {
    // Updates selections
    this.updateSelections();
    const selected = [];

    // Maps the options and pushes them
    this.options.map(c => Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c))).forEach(opt => {
      if (opt.type === "group") {
        const selectedChildren = [];
        opt.children.forEach(child => child.state && selectedChildren.push(child));
        if (selectedChildren.length) {
          opt.children = selectedChildren;
          selected.push(opt);
        }
      } else if (opt.state) selected.push(opt);
    });

    return selected;
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
    if (!selected.length) this.button.innerText = this.config.locale.btnNoSelection;
    else this.button.innerText =
      `${selected.slice(0, this.config.btnMaxLabels).map(s => s.label).join(this.config.btnDelimiter)}${selected.length > this.config.btnMaxLabels ? "..." : ""}`;
  }

  // Updates selections
  updateSelections() {
    // NOTE: For now, this just updates group checkboxes
    this.options.forEach(o => {
      if (o.type === "group") o.checkbox.checked = o.state;
    });
  }

  // Updates filter
  updateFilter() {
    if (!this.search && !this.search.value.length) return;
    const val = this.search.value.toLowerCase();

    // Searches thru each option
    this.options.forEach(o => {
      if (o.type === "group") {
        o.children.forEach(c => {
          const hide = !c.label.toLowerCase().startsWith(val);
          Array.from(c.el.children).forEach(c => c.hidden = hide);
          c.hidden = hide;
        });
        const hide = o.children.map(c => c.hidden).includes(false);
        Array.from(o.el.children).forEach(c => c.hidden = !hide);
      } else {
        const hide = !o.label.toLowerCase().startsWith(val);
        Array.from(o.el.children).forEach(c => c.hidden = hide);
      }
    });
  }

  update() {
    this.updateSelections();
    this.updateButton();
    this.updateFilter();
  }
}
