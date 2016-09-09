
// Init Fastclick
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}


// For Swipe touch slider
// Attach the plugin to the element with id='swipe'
var elem =      document.getElementById('swipe'),
    prevBtn =   document.getElementById('prev'),
    nextBtn =   document.getElementById('next'),
    swipeNav =  document.getElementById('swipe-nav').getElementsByTagName('button');

window.slider = Swipe(elem, {
  startSlide: 0,
  auto: 2000,
  draggable: true,
  continuous: true,
  callback: function(index, elem) {
    for (var i = 0, len = swipeNav.length; i < len; i++) {
      var thisSlide = swipeNav[i];
      if (thisSlide.getAttribute('data-slide') != index) {
        swipeNav[i].className = '';
      } else {
        swipeNav[i].className = 'active';
      }
    }
  }
});

// Attach previous and next buttons
prevBtn.onclick = slider.prev;
nextBtn.onclick = slider.next;

// Add click events to each slide control buttons
for (var i = 0, len = swipeNav.length; i < len; i++) {
  swipeNav[i].onclick = function() {
    slider.slide(this.getAttribute('data-slide'));
  };
}


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


// Add Flowtype to the 'flowtype' element
/*var flowtypeElem = document.getElementById('flowtype');
window.flowtype( flowtypeElem, {
  minFont : 16,
  maxFont : 48,
  fontRatio : 36
});*/
