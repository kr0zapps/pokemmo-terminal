export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), value);
    } else if (key === 'className' || key === 'class') {
      el.className = value;
    } else if (key === 'dataset') {
      for (const [dKey, dVal] of Object.entries(value)) {
        el.dataset[dKey] = dVal;
      }
    } else {
      el.setAttribute(key, value);
    }
  }

  const childArray = Array.isArray(children) ? children : [children];
  for (const child of childArray) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }

  return el;
}

export function text(str) {
  return document.createTextNode(String(str));
}

// Simple template literal tag for safe HTML escaping of values
export function safeHTML(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    let val = values[i] || '';
    if (typeof val === 'string') {
      val = val.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
    }
    return acc + str + val;
  }, '');
}
