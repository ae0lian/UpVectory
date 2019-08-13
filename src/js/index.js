// import contactForm from './ContactForm.js';

import Canvas from './Circles.js';
import scrollButton from './ScrollButton.js';
import menu from './Menu.js';
import barba from './Barba.js'
import modal from './Modal.js'

document.addEventListener("DOMContentLoaded", function() {
    // LazyLoad
    window.lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy"
    });
        
    // Wow
    const wow = new WOW({
      boxClass:     'wow',      
      animateClass: 'animated', 
      offset:       0,          
      mobile:       false,       
      live:         true        
    });
    wow.init();
    
    window.Circles = new Canvas(); 
    if(document.documentElement.scrollHeight<3000){
      Circles.init();
    }


});
