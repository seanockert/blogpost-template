window.onload = function() {
  initLazyLoad()
  initImageZoom()
  initSwipe()
}

function initSwipe() {
  // For Swipe touch slider
  // Attach the plugin to the element with id='swipe'
  var swipeElem = document.getElementById('swipe'),
      prevBtn =   document.getElementById('prev'),
      nextBtn =   document.getElementById('next'),
      swipeNav =  document.getElementById('swipe-nav').getElementsByTagName('button'),
      len = swipeNav.length;

  var slider = new Swipe(swipeElem, {
    startSlide: 0,
    auto: 12000,
    draggable: true,
    continuous: true,
    callback: function(index, swipeElem) {
      for (var i = 0; i < len; i++) {
        var thisSlide = swipeNav[i];
        if (thisSlide.getAttribute("data-slide") != index) {
          swipeNav[i].className = "";
        } else {
          swipeNav[i].className = "active";
        }
      }
    }
  });

  // Add click events to each slide control buttons
  for (var i = 0; i < len; i++) {
    swipeNav[i].onclick = function() {
      var index = this.getAttribute("data-slide");
      if (this.getAttribute("class") != "active") {
        slider.slide(index);
      }
      return false;
    };
  }
}

function initLazyLoad() {
  // Lazy load plugin
  echo.init({
    offset: 100,
    throttle: 250,
    unload: false,
    callback: function (element, op) {
      element.onerror = function() {
        var ele = element;
        var notFoundClass = 'image-404';
        if (ele.className.indexOf(notFoundClass) == -1) {
          ele.src = 'data:image/png;base64,';
          ele.className = ele.className + ' ' + notFoundClass;
        }
      }
    }
  });
}

function initImageZoom() {
  // Init Medium Zoom
  mediumZoom(document.querySelectorAll('[data-action="zoom"]')); 
}