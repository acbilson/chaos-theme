function accordionHide(id) {

  let button = document.getElementById(id+'-button');
  let quote = document.getElementById(id+'-quote');

  if (quote.className.indexOf('post-accordion-hide') == -1) {
    quote.className += " post-accordion-hide";
    button.className = button.className.replace('post-accordion-hide', '');
  }
  else {
    quote.className = quote.className.replace('post-accordion-hide', '');
    button.className += " post-accordion-hide";
  }
}
