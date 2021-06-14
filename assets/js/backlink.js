// TODO: find a better way to populate the link
//       preview than query after each hover
//       It breaks after too many hovers and should
//       probably only be made visible by hovering.

// I'm thinking that we should turn all internal links into a content array
// available for a number of methods in state. The content divs could be placed
// anywhere on the page since they're absolute, and I may consider using
// a similar approach to fill backlink preview context instead of manually
// including the context in the metadata.

// THOUGHT: might be worth wiring up the babel transpiler so I can use ES2016

class BacklinkGenerator {

  constructor(links) {
    this.links = {};
    this.parser = new DOMParser();
    this.getLinkContent(links);
  }

  getLinkContent(links) {
    links.forEach((link) => {

      fetch(link.href)
        .then((resp) => {
        if (resp.status === 200) {
          return resp.text();
        } else {
          return null;
        }})
        .then((text) => {
          if (text === null) { return null; }
          const contentElement = this.parsePageContent(text);
          this.links[link.href] = contentElement;
          console.log(this.links);
      });
    });
  }

  parsePageContent(text) {
    var bodyDOM = this.parser.parseFromString(text, 'text/html');
    const contentElement = bodyDOM.querySelector('div.e-content');

    if (contentElement) {
      return contentElement.firstElementChild;
    } else {
      const missing = document.createElement('p');
      missing.text = 'no content found';
      return missing;
    }
  }
}

function createPopup(offsetTop, offsetLeft, contentElement) {

  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.classList.add('backlink-popup');
  popup.style.top = `${offsetTop + 20}px`;
  popup.style.left = `${offsetLeft}px`;
  popup.appendChild(contentElement);

  return popup;
}

function parsePageContent(text) {

  var bodyDOM = new DOMParser().parseFromString(text, 'text/html');
  const contentElement = bodyDOM.querySelector('div.e-content');

  if (contentElement) {
    return contentElement.firstElementChild;
  } else {
    const missing = document.createElement('p');
    missing.text = 'no content found';
    return missing;
  }
}

function showBacklink(event) {

  const link = event.target;

  fetch(link.href).then(function(resp) {

    if (resp.status === 200) {
      return resp.text();
    } else {
      return null;
    }
  }).then(function(text) {
    if (text === null) { console.log('no content found'); }
    const contentElement = parsePageContent(text);
    const popup = createPopup(link.offsetTop, link.offsetLeft, contentElement);
    document.body.appendChild(popup);
  });
}

function hideBacklink(event) {
  const popup = document.getElementById('popup');
  document.body.removeChild(popup);
}

function newShowBacklink(event) {
  const content = document.generator.links[event.target.href];
  console.log(content.innerHTML);
}

// adds backlink events to all links marked internal
const internalLinks = document.querySelectorAll('a.internal');

internalLinks.forEach(function(link) {
  link.addEventListener('mouseover', newShowBacklink);
  link.addEventListener('mouseout', hideBacklink);
});

document.generator = new BacklinkGenerator(internalLinks);
