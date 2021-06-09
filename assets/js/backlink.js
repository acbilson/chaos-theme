// TODO: find a better way to populate the link
//       preview than query after each hover
//       It breaks after too many hovers and should
//       probably only be made visible by hovering.

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
    link.appendChild(popup);
  });
}

function hideBacklink(event) {

  const link = event.target;
  const popup = document.getElementById('popup');
  link.removeChild(popup);
}

// adds backlink events to all links marked internal
const internalLinks = document.querySelectorAll('a.internal');

internalLinks.forEach(function(link) {
  link.addEventListener('mouseover', showBacklink);
  link.addEventListener('mouseout', hideBacklink);
});
