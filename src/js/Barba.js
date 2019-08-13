

var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */
  
      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },
  
    fadeOut: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */

        // document.getElementById('circleCanvas').remove();

       if(document.getElementById('circleCanvas')) document.getElementById('circleCanvas').remove();
       window.scrollTo(0, 0);
      return $(this.oldContainer).animate({ opacity: 0 }).promise();
    },
  
    fadeIn: function() {
      /**
       * this.newContainer is the HTMLElement of the new Container
       * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
       * Please note, newContainer is available just after newContainerLoading is resolved!
       */
  
      var _this = this;
      var $el = $(this.newContainer);
      var title = $el.find('title');

  
      $(this.oldContainer).hide();
  
      $el.css({
        visibility : 'visible',
        opacity : 0
      });
  
      $el.animate({ opacity: 1 }, 400, function() {
        /**
         * Do not forget to call .done() as soon your transition is finished!
         * .done() will automatically remove from the DOM the old Container
         */
        if (lazyLoadInstance) {
            lazyLoadInstance.update();
        }
        _this.done();
        if(document.querySelector('.contact-form')) {
          window.contactForm = document.querySelector('.contact-form');
        }
        if(document.documentElement.scrollHeight<3000){
          Circles.init();
        }
        if(document.querySelector('.overlay')) {
          document.querySelector('.mobile-nav__content').classList.remove('active');
          document.querySelector('.overlay').remove();
          document.querySelector('.mobile-nav__controls').classList.remove('mobile-nav__controls--active');
        }
      });
    }
  });

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    var response = newPageRawHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', newPageRawHTML)
    var bodyClasses = $(response).filter('notbody').attr('class')
    $('body').attr('class', bodyClasses)
  })
  
  /**
   * Next step, you have to tell Barba to use the new Transition
   */
  
  Barba.Pjax.getTransition = function() {
    /**
     * Here you can use your own logic!
     * For example you can use different Transition based on the current page or link...
     */
  
    return FadeTransition;
  };

  
          
          Barba.Pjax.start();