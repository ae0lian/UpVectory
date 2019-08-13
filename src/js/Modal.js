// Modal
console.log('modal');
 function Modal() {
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
        console.log('close');
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
  
        window.location.reload(true);
  
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
    
    var myModal = new Modal({
      content: "<img class=\'modal__dude\' src=\'assets/images/contacts/dude.png\' alt=\'Illustration Image\'><div class=\'modal__title\'>Thank you for contacting us. We will reply asap.</div>",
      maxWIdth: 600
    });
    
   document.body.addEventListener('submit', function(){
     console.log('click')
    if(document.querySelector('.contact-form') != null) {
    console.log('contact-form');
        event.preventDefault();
        event.stopPropagation();
      
      
        sendData();
        myModal.open();
      
    }
   })
 
    
    
    function sendData() {
    
      const form = document.getElementById('contact-form');
      var XHR = new XMLHttpRequest();
      var FD = new FormData(form);
    
    
      XHR.open('POST', '/php/mail.php');
      XHR.send(FD);
    }