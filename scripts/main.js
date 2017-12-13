$(function () {
  var $window = $(window);
  var $body = $(document.body);
  var $entries = $('#entries');
  var $gallery = $('#gallery');
  var $closeButton = $('#close-button');

  var _totalLoaded = 0;

  var snaps = [];
  var _currentSnap = null;

  var keysDown = {};
  var scrollTop;
  var scrollDisabled = false;

  var GEN_II_START = 152;
  var GEN_III_START = 252;
  var UNOBTAINABLE = [
    151, 250, 251, // Legendary & mythical
    172, 173, 174, 175, 236, 238, 239, 240, // Babies
    182, 186, 192, 199, 208, 212, 230, 233, // Evolution items
    196, 197, // Eeveelotuions
    225, 235, // Unreleased Johto
    // Most of Hoenn
    377, 378, 379, 380, 381, 382, 383, 384,
    385, 386 
  ];

  $.get('snaps/snaps.json')
    .done(function (data) {
      for (var i = 0; i < data.length; i++) {
        snaps.push(data[i].substring(0, 3));
      }
      loadSnaps();
    })
    .fail(function () {
      alert('Failed to load Photódex information!');
    });

  function loadSnaps() {
    if (snaps.length === 0) {
      onLoaded();
      return;
    }

    var highestSnap = snaps[snaps.length - 1];
    for (var i = 1; i <= highestSnap; i++) {
      var number = i.toString();
      while (number.length < 3) {
        number = '0' + number;
      }
      var generationClass = i < GEN_II_START ? 'gen-i' : i < GEN_III_START ? 'gen-ii' : 'gen-iii';
      var entry = buildEntry(number).addClass(generationClass);
      if (UNOBTAINABLE.indexOf(i) !== -1) {
        entry.addClass('unobtainable');
      }
      $entries.append(entry);
    }

    // Hacky way to ensure that last row of flex aligns to grid.
    // http://stackoverflow.com/a/22018710
    for (var i = 0; i < highestSnap; i++) {
      $('<div/>', { "class": 'entry placeholder' }).appendTo($entries);
    }
  }

  $gallery.click(function (e) {
    if (e.target !== this) return;
    hideGallery();
  });

  $closeButton.click(hideGallery);

  $window.swiperight(slideToPreviousSnap)
    .swipeleft(slideToNextSnap)
    .keydown(function (e) {
      if (keysDown[e.keyCode]) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      keysDown[e.keyCode] = true;
      switch (e.keyCode) {
        case 37: // left arrow
          return slideToPreviousSnap();
        case 39: // right arrow
          return slideToNextSnap();
        case 27: // escape
          return hideGallery();
      }
    }).keyup(function (e) {
      keysDown[e.keyCode] = false;
    }).hashchange(function () {
      var snap = getSnapFromHash();
      if (_currentSnap === snap) return;
      if (snaps.indexOf(snap) !== -1) {
        showGalleryImage(snap);
      } else {
        hideGallery();
      }
    });

  function buildEntry(number) {
    var $entry = $('<div/>', {
      id: 'entry-' + number,
      "class": 'entry',
      text: number
    });
    if (snaps.indexOf(number) !== -1) {
      addSnap($entry, number);
    }
    return $entry;
  }

  function addSnap($entry, number) {
    var $img = $('<img/>');
    $img.load(function () {
      $img.appendTo($entry);
      incrementTotalLoaded();
    }).error(function () {
      incrementTotalLoaded();
    }).click(function () {
      showGalleryImage(number);
    });
    $img.attr('src', 'snaps/thumbs/' + number + '.jpg');
  }

  function incrementTotalLoaded() {
    _totalLoaded++;
    if (_totalLoaded === snaps.length) {
      onLoaded();
    }
  }

  function onLoaded() {
    $('#snapped-count').text(snaps.length);
    $body.removeClass('loading');
    $window.hashchange();
  }

  function showGalleryImage(number) {
    setCurrentSnap(number);
    setGalleryImage('current', _currentSnap);
    setGalleryImage('previous', getPreviousSnap());
    setGalleryImage('next', getNextSnap());
    disableScroll();
    $gallery.addClass('active');
  }

  function hideGallery() {
    setCurrentSnap(null);
    $('.gallery-image').attr('src', '');
    enableScroll();
    $gallery.removeClass('active');
  }

  function slideToPreviousSnap() {
    if (!galleryActive()) return;
    setCurrentSnap(getPreviousSnap());
    $('.next').remove();
    $('.current').removeClass('current').addClass('next');
    $('.previous').removeClass('previous').addClass('current');
    $('<img/>', { "class": 'gallery-image previous' }).prependTo($gallery);
    setGalleryImage('previous', getPreviousSnap());
  }

  function slideToNextSnap() {
    if (!galleryActive()) return;
    setCurrentSnap(getNextSnap());
    $('.previous').remove();
    $('.current').removeClass('current').addClass('previous');
    $('.next').removeClass('next').addClass('current');
    $('<img/>', { "class": 'gallery-image next' }).prependTo($gallery);
    setGalleryImage('next', getNextSnap());
  }

  function galleryActive() {
    return $gallery.hasClass('active');
  }

  function getPreviousSnap() {
    var previousIndex = (snaps.indexOf(_currentSnap) - 1 + snaps.length) % snaps.length;
    return snaps[previousIndex];
  }

  function getNextSnap() {
    var nextIndex = (snaps.indexOf(_currentSnap) + 1) % snaps.length;
    return snaps[nextIndex];
  }

  function setCurrentSnap(snap) {
    _currentSnap = snap;
    if (snap) {
      history.replaceState(null, null, '#' + snap);
    } else {
      clearHash();
    }
  }

  function setGalleryImage(position, number) {
    $('.' + position + '.gallery-image').attr('src', 'snaps/gallery/' + number + '.jpg');
  }

  function disableScroll() {
    if (scrollDisabled) return;
    scrollTop = $window.scrollTop();
    $body.addClass('no-scroll').css({ top: -scrollTop });
    scrollDisabled = true;
  }

  function enableScroll() {
    if (!scrollDisabled) return;
    $body.removeClass('no-scroll');
    $window.scrollTop(scrollTop);
    scrollDisabled = false;
  }

  function getSnapFromHash() {
    return location.hash.replace(/^#/, '') || null;
  }

  function clearHash(number) {
    if (!getSnapFromHash()) return;
    history.replaceState(null, null, location.pathname);
    $window.hashchange();
  }
});
