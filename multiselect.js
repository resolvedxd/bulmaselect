const englishLocale = {
  btnNoSelection: "Nothing selected",
  searchPlaceholder: "Filter"
}
const defaultStyle = ".ms-ul{padding:0;margin:0;list-style-type:none}.ms-li{padding:none}#ms > div > ul > label{width:100%;display:block;cursor:pointer}.ms-button{background-color:#363636;color:#fff;border-color:transparent;cursor:pointer;border-width:1px;border-radius:4px;border-radius:4px;border-style:solid;height:2.5em;line-height:1.5;width:185px}.ms-drop{background-color:#363636;position:absolute;margin-top:-1px;border:1px solid #aaa;width:183px;max-height:249px;font-weight:400;border-style:solid;border-color:transparent;border-top-color:#000;border-radius:4px;color:#fff;max-height:250px;overflow:auto}.ms-group{font-weight:700}";
const defaultConfig = {
  isOpen: false, // Open the dropdown by default
  keepOpen: false, // Keep the dropdown open
  injectStyle: true, // Inject the default css
  btnMaxLabels: 3, // Max labels to show on button
  btnDelimiter: ",", // The delimiter for labels on the button
  searchEnable: false,
  locale: englishLocale,
  options: ["a", "b", "c"],
};

class Multiselect {
  constructor(parent, config = defaultConfig) {
    if (typeof parent == "string") parent = document.getElementById(parent); // try to find the parent by id
    if (!parent) throw Error("No parent element");

    if (parent.nodeName == "SELECT") {
      config.options = [];
      Array.from(parent.children).forEach(c => {
        if(c.innerText) config.options.push(c.innerText);
      });
      let div = document.createElement("div");
      parent.parentNode.replaceChild(div, parent);
      parent = div;
    }

    config = {...defaultConfig, ...config};
  
    config.options = config.options.map(opt => {
      if(typeof opt == "string") return {label: opt} 
      else if(opt.type == "group") {
        opt.children = opt.children.map(child => typeof child == "string" ? {label: child} : child) 
        return opt;
      }
      else return opt;
    });

    if(config.injectStyle) {
      let style = document.createElement("style");
      style.textContent = defaultStyle;
      document.head.append(style);
    }

    let button = document.createElement("button");
    button.classList = "ms-button";
    button.innerText = config.label;
    parent.appendChild(button);
    let uldiv = document.createElement("div");
    uldiv.classList = "ms-drop";
    uldiv.hidden = !config.isOpen && !config.keepOpen;
    let ul = document.createElement("ul");
    ul.classList = "ms-ul";
    parent.appendChild(uldiv);
    if (config.searchEnable) {
      let search = document.createElement("input");
      search.classList = "ms-textbox";
      search.placeholder = config.locale.searchPlaceholder;
      uldiv.appendChild(search);
      search.addEventListener("input", () => this.updateFilter());
      this.search = search;
    }
    uldiv.appendChild(ul);

    ul.addEventListener("click", (s) => this.updateButton());
    button.addEventListener("click", () => config.keepOpen ? null : uldiv.hidden = !uldiv.hidden);
    config.options.forEach((opt, i) => {
      let label = document.createElement("label");
      label.classList = "ms-label";
      let span = document.createElement("span");
      span.classList = "ms-span";
      span.innerText = opt.label;
      ul.appendChild(label);
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList = "ms-checkbox";
      label.appendChild(checkbox);

      if(opt.type == "group") {
        opt.children.forEach((child, i_) => {
          let label_ = document.createElement("label");
          label_.classList = "ms-label";
          let span_ = document.createElement("span");
          span_.classList = "ms-span";
          span_.innerText = child.label;
          ul.appendChild(label_);
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList = "ms-checkbox";
          Object.defineProperty(config.options[i].children[i_], 'state', {
            get: () => checkbox.checked,
            set: (s) => {
              if(typeof s != "boolean") throw Error("You can't set this property to a non-boolean");
              checkbox.checked = s;
              this.updateButton();
            }
          });
          config.options[i].children[i_].el = label_;
          config.options[i].children[i_].checkbox = checkbox;
          label_.appendChild(checkbox);
          label_.appendChild(span_);
        });
        Object.defineProperty(config.options[i], 'state', {
          get: () => !config.options[i].children.map(c => c.state).includes(false),
          set: (s) => {
            if(typeof s != "boolean") throw Error("You can't set this property to a non-boolean");
            config.options[i].children.forEach(c => c.state = s);
            checkbox.checked = s;
            this.updateButton();
          }
        });
        span.classList = "ms-span ms-group";
        label.classList = checkbox.classList + " ms-group-label"
        checkbox.addEventListener("click", (d) => {
          config.options[i].state = !config.options[i].state;
        });
      } else {
        Object.defineProperty(config.options[i], 'state', {
          get: () => checkbox.checked,
          set: (s) => {
            if(typeof s != "boolean") throw Error("You can't set this property to a non-boolean");
            checkbox.checked = s;
            this.updateButton();
          }
        });
      }

      label.appendChild(span);
      config.options[i].checkbox = checkbox;
      config.options[i].el = label;
    });

    this.parent = parent;
    this.config = config;
    this.options = config.options; // small shortcut cause typing .config was annoying me
    this.button = button;
    this.dropdown = uldiv;
    this.ul = ul;
    this.updateButton();
  };

  getSelected() {
    this.updateSelections();
    let selected = [];
    this.options.map(c => Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c))).forEach(opt => {
      if(opt.type == "group") {
        let selchildren = [];
        opt.children.forEach(child => child.state && selchildren.push(child));
        if(selchildren.length) {
          opt.children = selchildren;
          selected.push(opt);
        }
      } else if(opt.state) selected.push(opt);
    });
    return selected;
  }

  updateButton() {
    let selected = this.getSelected();
    selected.forEach((s, i) => {
      if(s.type == "group") {
        selected.splice(i, 1);
        if(s.state) return selected.push(s);
        selected = selected.concat(s.children);
      }
    });
    if (!selected.length) this.button.innerText = this.config.locale.btnNoSelection;
    else this.button.innerText = `${selected.slice(0, this.config.btnMaxLabels).map(s => s.label).join(this.config.btnDelimiter)}${selected.length > this.config.btnMaxLabels ? "..." : ""}`;
  }
  updateSelections() {
  // for now this just updates group checkboxes
    this.options.forEach(o => {
      if(o.type == "group") o.checkbox.checked = o.state;
    })
  }
  updateFilter() {
    if(!this.search && !this.search.value.length) return;
    let val = this.search.value.toLowerCase();
    this.options.forEach(o => {
      if(o.type == "group") {
        o.children.forEach(c => {
          let hide = !c.label.toLowerCase().startsWith(val);
          Array.from(c.el.children).forEach(c => c.hidden = hide);
          c.hidden = hide;
        });
        let hide = o.children.map(c => c.hidden).includes(false);
        Array.from(o.el.children).forEach(c => c.hidden = !hide);
      } else {
        let hide = !o.label.toLowerCase().startsWith(val);
        Array.from(o.el.children).forEach(c => c.hidden = hide);
      }
    })
  }
  update() {
    this.updateSelections();
    this.updateButton();
    this.updateFilter();
  }
}

/*
<div id="ms"> -- parent element
  <button>(shows active selections)</button>
  <div> -- dropdown
  TODO: optional searchbar
    <ul>
      <label>
        <input type=checkbox></input> -- checkbox
        <span>(option label)</span>
      </label>
    </ul>
  </div>
</div>
*/
