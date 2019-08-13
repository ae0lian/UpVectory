document.addEventListener("DOMContentLoaded", function() {
// LazyLoad
var lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
  // ... more custom settings?
});

// Wow
new WOW().init();

// Menu
const btn = document.querySelector('.mobile-nav__controls');
btn.addEventListener('click', function (event) {
  console.log('click-menu');
  event.preventDefault();
  event.stopPropagation();

  overlay_menu();

  event.target.closest('.mobile-nav').querySelector('.mobile-nav__content').classList.toggle('active');
  event.currentTarget.classList.toggle('mobile-nav__controls--active');
});

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


// Modal
(function () {
  this.Modal = function () {
    // Determine proper prefix
    this.transitionEnd = transitionSelect();

    // Global elements;
    this.closeButton = null;
    this.modal = null;
    this.overlay = null;

    // Defaults option
    var defaults = {
      className: "fade-and-drop",
      overlay: true,
      maxWidth: 80,
      minWidth: 60,
      content: "",
      closeButton: true,
    }

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = Object.assign(defaults, arguments[0]);
    }

    Modal.prototype.open = function () {
      buildOut.call(this);
      initializeEvents.call(this);
      window.getComputedStyle(this.modal).height;

      this.modal.className = this.modal.className +
        (this.modal.offsetHeight > window.innerHeight ?
          " modal-open. modal-anchored" : " modal-open");
      this.overlay.className = this.overlay.className + " modal-open";
    }

    Modal.prototype.close = function () {
      var _ = this;

      // Remove the open class name
      this.modal.classList.remove("modal-open");
      this.overlay.classList.remove("modal-open");

      // Listen for css transitioner event and remove nodes
      this.modal.addEventListener(this.transitionEnd, function () {
        _.modal.parentNode.removeChild(_.modal);
      })
      this.overlay.addEventListener(this.transitionEnd, function () {
        _.overlay.parentNode.removeChild(_.overlay);
      })



    }

    // Render and append modal
    function buildOut() {
      var content, contentHolder, docFrag;

      if (typeof this.options.content === "string") {
        content = this.options.content;
      } else {
        content = this.options.content.innerHTML;
      }

      docFrag = document.createDocumentFragment();

      // Create modal element
      this.modal = document.createElement('div');
      this.modal.className = 'modal' + ' ' + this.options.className;
      this.modal.style.minWidth = this.options.minWidth + '%';
      this.modal.style.maxWidth = this.options.maxWidth + '%';

      // Content area
      contentHolder = document.createElement('div');
      contentHolder.className = "modal__content";
      contentHolder.innerHTML = content;
      this.modal.appendChild(contentHolder);

      // Create button
      if (this.options.closeButton === true) {
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'modal__action';
        this.closeButton.textContent = "Good";
        this.modal.querySelector('.modal__content').append(this.closeButton);
      }

      // Overlay
      if (this.options.overlay === true) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay' + ' ' + this.options.className;
        docFrag.appendChild(this.overlay);
      }


      // Append modal
      docFrag.appendChild(this.modal);

      document.body.appendChild(docFrag);
    }

    // Initial events on button and overlay
    function initializeEvents() {
      if (this.closeButton) {
        this.closeButton.addEventListener('click', this.close.bind(this));
      }
      if (this.overlay) {
        this.overlay.addEventListener('click', this.close.bind(this));
      }
    }

    function transitionSelect() {
      var el = document.createElement("div");
      if (el.style.WebkitTransition) return "webkitTransitionEnd";
      if (el.style.OTransition) return "oTransitionEnd";
      return 'transitionend';
    }
  }
}());

var myModal = new Modal({
  content: "<img class=\'modal__dude\' src=\'assets/images/contacts/dude.png\' alt=\'Illustration Image\'><div class=\'modal__title\'>Thank you for contacting us. We will reply asap.</div>",
  maxWIdth: 600
});

var triggerButton = document.querySelector('.contact-form');
if(triggerButton != null) {

  triggerButton.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
  
  
    sendData();
    myModal.open();
  
  });
}


function sendData() {

  const form = document.getElementById('contact-form');
  var XHR = new XMLHttpRequest();
  var FD = new FormData(form);


  XHR.open('POST', '/php/mail.php');
  XHR.send(FD);
}


const backToTopButton = document.querySelector('#scroll-btn');

window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
  if(window.pageYOffset > 800) {
    if(!backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnExit");
      backToTopButton.classList.add("btnEntrance");
      backToTopButton.style.display = "block";
    }
  } else {
    if(backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnEntrance");
      backToTopButton.classList.add("btnExit");
      setTimeout(function() {
        backToTopButton.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton.addEventListener("click", smoothScrollBackToTop);

function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  var start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};





















function Circles() {
  // Circles
  const circleCanvas = document.createElement("canvas");
  circleCanvas.style = "position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1;";
  circleCanvas.id = "circleCanvas";
  circleCanvas.width = window.innerWidth-17;
  circleCanvas.height = window.innerHeight;
  document.body.append(circleCanvas);
  const c = circleCanvas.getContext('2d');

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  var qCircles;

  if(innerWidth < 550) {
      qCircles = 3
  } else {
      qCircles = 6
  }



  function getRandom(min, max) {
      return Math.random() * (max - min) + min;
  }

  const mouse = {
      x: undefined,
      y: undefined
  }

  const maxRadius = 200;
  const minRadius = 50

  window.addEventListener('mousemove', function (event) {
      mouse.x = event.x;
      mouse.y = event.y;
  })

  function Circle(x, y, dx, dy, radius, rgb) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.dr = 0.5;
      this.initRadius = radius;
      this.fillStyle = rgb;
      this.angle = 0
      this.radius

      if (innerWidth < 550) {
          this.minRadius = getRandom(10, 30)
      } else {
          this.minRadius = getRandom(30, 55)
      }

      this.draw = function () {
          c.beginPath();
          c.fillStyle = this.fillStyle;
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          c.fill();
          this.angle += Math.PI / 720;

      }

      this.update = function () {
          if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
              this.dx = -this.dx;
          }
          this.x += this.dx;

          if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
              this.dy = -this.dy;
          }
          this.y += this.dy;


          this.radius = this.initRadius + 75 * Math.abs(Math.cos(this.angle));


          // Interactivity
          this.draw();
      }

  }


  const arrCircles = [];

  for (var i = 0; i < qCircles; i++) {
      var radius;
      if (innerWidth < 550) {
           radius = getRandom(20, 50);
      } else {
           radius = getRandom(50, 120);
      }
      const x = Math.random() * (innerWidth - radius * 2) + radius;
      const y = Math.random() * (innerHeight - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      // var r = Math.random() * 255;
      // var g = Math.random() * 255;
      // var b = Math.random() * 255;
      // var rgb = "rgb("+r+", "+g+", "+b+")";
      var rgb = "rgb(255, 255, 255, 0.2)";

      arrCircles.push(new Circle(x, y, dx, dy, radius, rgb));
  }


  function animate() {
      requestAnimationFrame(animate);

      c.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = 0; i < arrCircles.length; i++) {
          arrCircles[i].update();
      }
  }

  animate();

}

if(document.documentElement.classList != 'project_page') {
  Circles();
}
});

