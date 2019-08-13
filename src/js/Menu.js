// Menu
const btn = document.querySelector('.mobile-nav__controls');
btn.addEventListener('click', function (event) {
  event.preventDefault();
  event.stopPropagation();

  overlay_menu();

  event.target.closest('.mobile-nav').querySelector('.mobile-nav__content').classList.toggle('active');
  event.currentTarget.classList.toggle('mobile-nav__controls--active');
});


// document.querySelector('.mobile-nav__link').addEventListener('click', function(event) {
//   overlay_menu();

//   event.target.closest('.mobile-nav').querySelector('.mobile-nav__content').classList.toggle('active');
//   event.currentTarget.classList.toggle('mobile-nav__controls--active');
// })

function overlay_menu() {
  var overlay_element;
  if (overlay_element = document.querySelector('.overlay')) {
    overlay_element.remove();
  } else {
    const overlay_element = document.createElement('div');
    overlay_element.className = "overlay";
    overlay_element.setAttribute('style', "position: fixed; left: 0; right: 0; top: 0; bottom: 0; background: rgba(0, 0, 0, 0.1);");
    document.querySelector('.mobile-nav').prepend(overlay_element);
  }
}