(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 1.1.2 - 2016-02-01
 * License: MIT
 */angular.module("ui.bootstrap", ["ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.isClass","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.debounce","ui.bootstrap.dropdown","ui.bootstrap.stackedMap","ui.bootstrap.modal","ui.bootstrap.paging","ui.bootstrap.pager","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module('ui.bootstrap.collapse', [])

  .directive('uibCollapse', ['$animate', '$q', '$parse', '$injector', function($animate, $q, $parse, $injector) {
    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
    return {
      link: function(scope, element, attrs) {
        var expandingExpr = $parse(attrs.expanding),
            expandedExpr = $parse(attrs.expanded),
            collapsingExpr = $parse(attrs.collapsing),
            collapsedExpr = $parse(attrs.collapsed);

        if (!scope.$eval(attrs.uibCollapse)) {
          element.addClass('in')
            .addClass('collapse')
            .attr('aria-expanded', true)
            .attr('aria-hidden', false)
            .css({height: 'auto'});
        }

        function expand() {
          if (element.hasClass('collapse') && element.hasClass('in')) {
            return;
          }

          $q.resolve(expandingExpr(scope))
            .then(function() {
              element.removeClass('collapse')
                .addClass('collapsing')
                .attr('aria-expanded', true)
                .attr('aria-hidden', false);

              if ($animateCss) {
                $animateCss(element, {
                  addClass: 'in',
                  easing: 'ease',
                  to: { height: element[0].scrollHeight + 'px' }
                }).start()['finally'](expandDone);
              } else {
                $animate.addClass(element, 'in', {
                  to: { height: element[0].scrollHeight + 'px' }
                }).then(expandDone);
              }
            });
        }

        function expandDone() {
          element.removeClass('collapsing')
            .addClass('collapse')
            .css({height: 'auto'});
          expandedExpr(scope);
        }

        function collapse() {
          if (!element.hasClass('collapse') && !element.hasClass('in')) {
            return collapseDone();
          }

          $q.resolve(collapsingExpr(scope))
            .then(function() {
              element
                // IMPORTANT: The height must be set before adding "collapsing" class.
                // Otherwise, the browser attempts to animate from height 0 (in
                // collapsing class) to the given height here.
                .css({height: element[0].scrollHeight + 'px'})
                // initially all panel collapse have the collapse class, this removal
                // prevents the animation from jumping to collapsed state
                .removeClass('collapse')
                .addClass('collapsing')
                .attr('aria-expanded', false)
                .attr('aria-hidden', true);

              if ($animateCss) {
                $animateCss(element, {
                  removeClass: 'in',
                  to: {height: '0'}
                }).start()['finally'](collapseDone);
              } else {
                $animate.removeClass(element, 'in', {
                  to: {height: '0'}
                }).then(collapseDone);
              }
            });
        }

        function collapseDone() {
          element.css({height: '0'}); // Required so that collapse works when animation is disabled
          element.removeClass('collapsing')
            .addClass('collapse');
          collapsedExpr(scope);
        }

        scope.$watch(attrs.uibCollapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('uibAccordionConfig', {
  closeOthers: true
})

.controller('UibAccordionController', ['$scope', '$attrs', 'uibAccordionConfig', function($scope, $attrs, accordionConfig) {
  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ?
      $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if (closeOthers) {
      angular.forEach(this.groups, function(group) {
        if (group !== openGroup) {
          group.isOpen = false;
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function(event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  };
}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('uibAccordion', function() {
  return {
    controller: 'UibAccordionController',
    controllerAs: 'accordion',
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/accordion/accordion.html';
    }
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('uibAccordionGroup', function() {
  return {
    require: '^uibAccordion',         // We need this directive to be inside an accordion
    transclude: true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/accordion/accordion-group.html';
    },
    scope: {
      heading: '@',               // Interpolate the heading attribute onto this scope
      isOpen: '=?',
      isDisabled: '=?'
    },
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, accordionCtrl) {
      accordionCtrl.addGroup(scope);

      scope.openClass = attrs.openClass || 'panel-open';
      scope.panelClass = attrs.panelClass || 'panel-default';
      scope.$watch('isOpen', function(value) {
        element.toggleClass(scope.openClass, !!value);
        if (value) {
          accordionCtrl.closeOthers(scope);
        }
      });

      scope.toggleOpen = function($event) {
        if (!scope.isDisabled) {
          if (!$event || $event.which === 32) {
            scope.isOpen = !scope.isOpen;
          }
        }
      };

      var id = 'accordiongroup-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
      scope.headingId = id + '-tab';
      scope.panelId = id + '-panel';
    }
  };
})

// Use accordion-heading below an accordion-group to provide a heading containing HTML
.directive('uibAccordionHeading', function() {
  return {
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^uibAccordionGroup',
    link: function(scope, element, attrs, accordionGroupCtrl, transclude) {
      // Pass the heading to the accordion-group controller
      // so that it can be transcluded into the right place in the template
      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
      accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
.directive('uibAccordionTransclude', function() {
  return {
    require: '^uibAccordionGroup',
    link: function(scope, element, attrs, controller) {
      scope.$watch(function() { return controller[attrs.uibAccordionTransclude]; }, function(heading) {
        if (heading) {
          element.find('span').html('');
          element.find('span').append(heading);
        }
      });
    }
  };
});

angular.module('ui.bootstrap.alert', [])

.controller('UibAlertController', ['$scope', '$attrs', '$interpolate', '$timeout', function($scope, $attrs, $interpolate, $timeout) {
  $scope.closeable = !!$attrs.close;

  var dismissOnTimeout = angular.isDefined($attrs.dismissOnTimeout) ?
    $interpolate($attrs.dismissOnTimeout)($scope.$parent) : null;

  if (dismissOnTimeout) {
    $timeout(function() {
      $scope.close();
    }, parseInt(dismissOnTimeout, 10));
  }
}])

.directive('uibAlert', function() {
  return {
    controller: 'UibAlertController',
    controllerAs: 'alert',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/alert/alert.html';
    },
    transclude: true,
    replace: true,
    scope: {
      type: '@',
      close: '&'
    }
  };
});

angular.module('ui.bootstrap.buttons', [])

.constant('uibButtonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})

.controller('UibButtonsController', ['uibButtonConfig', function(buttonConfig) {
  this.activeClass = buttonConfig.activeClass || 'active';
  this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])

.directive('uibBtnRadio', ['$parse', function($parse) {
  return {
    require: ['uibBtnRadio', 'ngModel'],
    controller: 'UibButtonsController',
    controllerAs: 'buttons',
    link: function(scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      var uncheckableExpr = $parse(attrs.uibUncheckable);

      element.find('input').css({display: 'none'});

      //model -> UI
      ngModelCtrl.$render = function() {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.uibBtnRadio)));
      };

      //ui->model
      element.on(buttonsCtrl.toggleEvent, function() {
        if (attrs.disabled) {
          return;
        }

        var isActive = element.hasClass(buttonsCtrl.activeClass);

        if (!isActive || angular.isDefined(attrs.uncheckable)) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.uibBtnRadio));
            ngModelCtrl.$render();
          });
        }
      });

      if (attrs.uibUncheckable) {
        scope.$watch(uncheckableExpr, function(uncheckable) {
          attrs.$set('uncheckable', uncheckable ? '' : null);
        });
      }
    }
  };
}])

.directive('uibBtnCheckbox', function() {
  return {
    require: ['uibBtnCheckbox', 'ngModel'],
    controller: 'UibButtonsController',
    controllerAs: 'button',
    link: function(scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      element.find('input').css({display: 'none'});

      function getTrueValue() {
        return getCheckboxValue(attrs.btnCheckboxTrue, true);
      }

      function getFalseValue() {
        return getCheckboxValue(attrs.btnCheckboxFalse, false);
      }

      function getCheckboxValue(attribute, defaultValue) {
        return angular.isDefined(attribute) ? scope.$eval(attribute) : defaultValue;
      }

      //model -> UI
      ngModelCtrl.$render = function() {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
      };

      //ui->model
      element.on(buttonsCtrl.toggleEvent, function() {
        if (attrs.disabled) {
          return;
        }

        scope.$apply(function() {
          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });
    }
  };
});

angular.module('ui.bootstrap.carousel', [])

.controller('UibCarouselController', ['$scope', '$element', '$interval', '$timeout', '$animate', function($scope, $element, $interval, $timeout, $animate) {
  var self = this,
    slides = self.slides = $scope.slides = [],
    SLIDE_DIRECTION = 'uib-slideDirection',
    currentIndex = -1,
    currentInterval, isPlaying, bufferedTransitions = [];
  self.currentSlide = null;

  var destroyed = false;

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if (slides.length === 1 || slide.active) {
      if ($scope.$currentTransition) {
        $scope.$currentTransition = null;
      }

      self.select(slides[slides.length - 1]);
      if (slides.length === 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.getCurrentIndex = function() {
    if (self.currentSlide && angular.isDefined(self.currentSlide.index)) {
      return +self.currentSlide.index;
    }
    return currentIndex;
  };

  self.next = $scope.next = function() {
    var newIndex = (self.getCurrentIndex() + 1) % slides.length;

    if (newIndex === 0 && $scope.noWrap()) {
      $scope.pause();
      return;
    }

    return self.select(getSlideByIndex(newIndex), 'next');
  };

  self.prev = $scope.prev = function() {
    var newIndex = self.getCurrentIndex() - 1 < 0 ? slides.length - 1 : self.getCurrentIndex() - 1;

    if ($scope.noWrap() && newIndex === slides.length - 1) {
      $scope.pause();
      return;
    }

    return self.select(getSlideByIndex(newIndex), 'prev');
  };

  self.removeSlide = function(slide) {
    if (angular.isDefined(slide.index)) {
      slides.sort(function(a, b) {
        return +a.index > +b.index;
      });
    }

    var bufferedIndex = bufferedTransitions.indexOf(slide);
    if (bufferedIndex !== -1) {
      bufferedTransitions.splice(bufferedIndex, 1);
    }
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    $timeout(function() {
      if (slides.length > 0 && slide.active) {
        if (index >= slides.length) {
          self.select(slides[index - 1]);
        } else {
          self.select(slides[index]);
        }
      } else if (currentIndex > index) {
        currentIndex--;
      }
    });

    //clean the currentSlide when no more slide
    if (slides.length === 0) {
      self.currentSlide = null;
      clearBufferedTransitions();
    }
  };

  /* direction: "prev" or "next" */
  self.select = $scope.select = function(nextSlide, direction) {
    var nextIndex = $scope.indexOfSlide(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
    }
    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (nextSlide && nextSlide !== self.currentSlide && !$scope.$currentTransition) {
      goNext(nextSlide, nextIndex, direction);
    } else if (nextSlide && nextSlide !== self.currentSlide && $scope.$currentTransition) {
      bufferedTransitions.push(nextSlide);
      nextSlide.active = false;
    }
  };

  /* Allow outside people to call indexOf on slides array */
  $scope.indexOfSlide = function(slide) {
    return angular.isDefined(slide.index) ? +slide.index : slides.indexOf(slide);
  };

  $scope.isActive = function(slide) {
    return self.currentSlide === slide;
  };

  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      resetTimer();
    }
  };

  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };

  $scope.$on('$destroy', function() {
    destroyed = true;
    resetTimer();
  });

  $scope.$watch('noTransition', function(noTransition) {
    $animate.enabled($element, !noTransition);
  });

  $scope.$watch('interval', restartTimer);

  $scope.$watchCollection('slides', resetTransition);

  function clearBufferedTransitions() {
    while (bufferedTransitions.length) {
      bufferedTransitions.shift();
    }
  }

  function getSlideByIndex(index) {
    if (angular.isUndefined(slides[index].index)) {
      return slides[index];
    }
    for (var i = 0, l = slides.length; i < l; ++i) {
      if (slides[i].index === index) {
        return slides[i];
      }
    }
  }

  function goNext(slide, index, direction) {
    if (destroyed) { return; }

    angular.extend(slide, {direction: direction, active: true});
    angular.extend(self.currentSlide || {}, {direction: direction, active: false});
    if ($animate.enabled($element) && !$scope.$currentTransition &&
      slide.$element && self.slides.length > 1) {
      slide.$element.data(SLIDE_DIRECTION, slide.direction);
      if (self.currentSlide && self.currentSlide.$element) {
        self.currentSlide.$element.data(SLIDE_DIRECTION, slide.direction);
      }

      $scope.$currentTransition = true;
      $animate.on('addClass', slide.$element, function(element, phase) {
        if (phase === 'close') {
          $scope.$currentTransition = null;
          $animate.off('addClass', element);
          if (bufferedTransitions.length) {
            var nextSlide = bufferedTransitions.pop();
            var nextIndex = $scope.indexOfSlide(nextSlide);
            var nextDirection = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
            clearBufferedTransitions();

            goNext(nextSlide, nextIndex, nextDirection);
          }
        }
      });
    }

    self.currentSlide = slide;
    currentIndex = index;

    //every time you change slides, reset the timer
    restartTimer();
  }

  function resetTimer() {
    if (currentInterval) {
      $interval.cancel(currentInterval);
      currentInterval = null;
    }
  }

  function resetTransition(slides) {
    if (!slides.length) {
      $scope.$currentTransition = null;
      clearBufferedTransitions();
    }
  }

  function restartTimer() {
    resetTimer();
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval > 0) {
      currentInterval = $interval(timerFn, interval);
    }
  }

  function timerFn() {
    var interval = +$scope.interval;
    if (isPlaying && !isNaN(interval) && interval > 0 && slides.length) {
      $scope.next();
    } else {
      $scope.pause();
    }
  }
}])

.directive('uibCarousel', function() {
  return {
    transclude: true,
    replace: true,
    controller: 'UibCarouselController',
    controllerAs: 'carousel',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/carousel/carousel.html';
    },
    scope: {
      interval: '=',
      noTransition: '=',
      noPause: '=',
      noWrap: '&'
    }
  };
})

.directive('uibSlide', function() {
  return {
    require: '^uibCarousel',
    transclude: true,
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/carousel/slide.html';
    },
    scope: {
      active: '=?',
      actual: '=?',
      index: '=?'
    },
    link: function (scope, element, attrs, carouselCtrl) {
      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        if (active) {
          carouselCtrl.select(scope);
        }
      });
    }
  };
})

.animation('.item', ['$animateCss',
function($animateCss) {
  var SLIDE_DIRECTION = 'uib-slideDirection';

  function removeClass(element, className, callback) {
    element.removeClass(className);
    if (callback) {
      callback();
    }
  }

  return {
    beforeAddClass: function(element, className, done) {
      if (className === 'active') {
        var stopped = false;
        var direction = element.data(SLIDE_DIRECTION);
        var directionClass = direction === 'next' ? 'left' : 'right';
        var removeClassFn = removeClass.bind(this, element,
          directionClass + ' ' + direction, done);
        element.addClass(direction);

        $animateCss(element, {addClass: directionClass})
          .start()
          .done(removeClassFn);

        return function() {
          stopped = true;
        };
      }
      done();
    },
    beforeRemoveClass: function (element, className, done) {
      if (className === 'active') {
        var stopped = false;
        var direction = element.data(SLIDE_DIRECTION);
        var directionClass = direction === 'next' ? 'left' : 'right';
        var removeClassFn = removeClass.bind(this, element, directionClass, done);

        $animateCss(element, {addClass: directionClass})
          .start()
          .done(removeClassFn);

        return function() {
          stopped = true;
        };
      }
      done();
    }
  };
}]);

angular.module('ui.bootstrap.dateparser', [])

.service('uibDateParser', ['$log', '$locale', 'dateFilter', 'orderByFilter', function($log, $locale, dateFilter, orderByFilter) {
  // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
  var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  var localeId;
  var formatCodeToRegex;

  this.init = function() {
    localeId = $locale.id;

    this.parsers = {};
    this.formatters = {};

    formatCodeToRegex = [
      {
        key: 'yyyy',
        regex: '\\d{4}',
        apply: function(value) { this.year = +value; },
        formatter: function(date) {
          var _date = new Date();
          _date.setFullYear(Math.abs(date.getFullYear()));
          return dateFilter(_date, 'yyyy');
        }
      },
      {
        key: 'yy',
        regex: '\\d{2}',
        apply: function(value) { this.year = +value + 2000; },
        formatter: function(date) {
          var _date = new Date();
          _date.setFullYear(Math.abs(date.getFullYear()));
          return dateFilter(_date, 'yy');
        }
      },
      {
        key: 'y',
        regex: '\\d{1,4}',
        apply: function(value) { this.year = +value; },
        formatter: function(date) {
          var _date = new Date();
          _date.setFullYear(Math.abs(date.getFullYear()));
          return dateFilter(_date, 'y');
        }
      },
      {
        key: 'M!',
        regex: '0?[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; },
        formatter: function(date) {
          var value = date.getMonth();
          if (/^[0-9]$/.test(value)) {
            return dateFilter(date, 'MM');
          }

          return dateFilter(date, 'M');
        }
      },
      {
        key: 'MMMM',
        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); },
        formatter: function(date) { return dateFilter(date, 'MMMM'); }
      },
      {
        key: 'MMM',
        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); },
        formatter: function(date) { return dateFilter(date, 'MMM'); }
      },
      {
        key: 'MM',
        regex: '0[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; },
        formatter: function(date) { return dateFilter(date, 'MM'); }
      },
      {
        key: 'M',
        regex: '[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; },
        formatter: function(date) { return dateFilter(date, 'M'); }
      },
      {
        key: 'd!',
        regex: '[0-2]?[0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; },
        formatter: function(date) {
          var value = date.getDate();
          if (/^[1-9]$/.test(value)) {
            return dateFilter(date, 'dd');
          }

          return dateFilter(date, 'd');
        }
      },
      {
        key: 'dd',
        regex: '[0-2][0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; },
        formatter: function(date) { return dateFilter(date, 'dd'); }
      },
      {
        key: 'd',
        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; },
        formatter: function(date) { return dateFilter(date, 'd'); }
      },
      {
        key: 'EEEE',
        regex: $locale.DATETIME_FORMATS.DAY.join('|'),
        formatter: function(date) { return dateFilter(date, 'EEEE'); }
      },
      {
        key: 'EEE',
        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
        formatter: function(date) { return dateFilter(date, 'EEE'); }
      },
      {
        key: 'HH',
        regex: '(?:0|1)[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'HH'); }
      },
      {
        key: 'hh',
        regex: '0[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'hh'); }
      },
      {
        key: 'H',
        regex: '1?[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'H'); }
      },
      {
        key: 'h',
        regex: '[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'h'); }
      },
      {
        key: 'mm',
        regex: '[0-5][0-9]',
        apply: function(value) { this.minutes = +value; },
        formatter: function(date) { return dateFilter(date, 'mm'); }
      },
      {
        key: 'm',
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.minutes = +value; },
        formatter: function(date) { return dateFilter(date, 'm'); }
      },
      {
        key: 'sss',
        regex: '[0-9][0-9][0-9]',
        apply: function(value) { this.milliseconds = +value; },
        formatter: function(date) { return dateFilter(date, 'sss'); }
      },
      {
        key: 'ss',
        regex: '[0-5][0-9]',
        apply: function(value) { this.seconds = +value; },
        formatter: function(date) { return dateFilter(date, 'ss'); }
      },
      {
        key: 's',
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.seconds = +value; },
        formatter: function(date) { return dateFilter(date, 's'); }
      },
      {
        key: 'a',
        regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
        apply: function(value) {
          if (this.hours === 12) {
            this.hours = 0;
          }

          if (value === 'PM') {
            this.hours += 12;
          }
        },
        formatter: function(date) { return dateFilter(date, 'a'); }
      },
      {
        key: 'Z',
        regex: '[+-]\\d{4}',
        apply: function(value) {
          var matches = value.match(/([+-])(\d{2})(\d{2})/),
            sign = matches[1],
            hours = matches[2],
            minutes = matches[3];
          this.hours += toInt(sign + hours);
          this.minutes += toInt(sign + minutes);
        },
        formatter: function(date) {
          return dateFilter(date, 'Z');
        }
      },
      {
        key: 'ww',
        regex: '[0-4][0-9]|5[0-3]',
        formatter: function(date) { return dateFilter(date, 'ww'); }
      },
      {
        key: 'w',
        regex: '[0-9]|[1-4][0-9]|5[0-3]',
        formatter: function(date) { return dateFilter(date, 'w'); }
      },
      {
        key: 'GGGG',
        regex: $locale.DATETIME_FORMATS.ERANAMES.join('|').replace(/\s/g, '\\s'),
        formatter: function(date) { return dateFilter(date, 'GGGG'); }
      },
      {
        key: 'GGG',
        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
        formatter: function(date) { return dateFilter(date, 'GGG'); }
      },
      {
        key: 'GG',
        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
        formatter: function(date) { return dateFilter(date, 'GG'); }
      },
      {
        key: 'G',
        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
        formatter: function(date) { return dateFilter(date, 'G'); }
      }
    ];
  };

  this.init();

  function createParser(format, func) {
    var map = [], regex = format.split('');

    // check for literal values
    var quoteIndex = format.indexOf('\'');
    if (quoteIndex > -1) {
      var inLiteral = false;
      format = format.split('');
      for (var i = quoteIndex; i < format.length; i++) {
        if (inLiteral) {
          if (format[i] === '\'') {
            if (i + 1 < format.length && format[i+1] === '\'') { // escaped single quote
              format[i+1] = '$';
              regex[i+1] = '';
            } else { // end of literal
              regex[i] = '';
              inLiteral = false;
            }
          }
          format[i] = '$';
        } else {
          if (format[i] === '\'') { // start of literal
            format[i] = '$';
            regex[i] = '';
            inLiteral = true;
          }
        }
      }

      format = format.join('');
    }

    angular.forEach(formatCodeToRegex, function(data) {
      var index = format.indexOf(data.key);

      if (index > -1) {
        format = format.split('');

        regex[index] = '(' + data.regex + ')';
        format[index] = '$'; // Custom symbol to define consumed part of format
        for (var i = index + 1, n = index + data.key.length; i < n; i++) {
          regex[i] = '';
          format[i] = '$';
        }
        format = format.join('');

        map.push({
          index: index,
          key: data.key,
          apply: data[func],
          matcher: data.regex
        });
      }
    });

    return {
      regex: new RegExp('^' + regex.join('') + '$'),
      map: orderByFilter(map, 'index')
    };
  }

  this.filter = function(date, format) {
    if (!angular.isDate(date) || isNaN(date) || !format) {
      return '';
    }

    format = $locale.DATETIME_FORMATS[format] || format;

    if ($locale.id !== localeId) {
      this.init();
    }

    if (!this.formatters[format]) {
      this.formatters[format] = createParser(format, 'formatter');
    }

    var parser = this.formatters[format],
      map = parser.map;

    var _format = format;

    return map.reduce(function(str, mapper, i) {
      var match = _format.match(new RegExp('(.*)' + mapper.key));
      if (match && angular.isString(match[1])) {
        str += match[1];
        _format = _format.replace(match[1] + mapper.key, '');
      }

      if (mapper.apply) {
        return str + mapper.apply.call(null, date);
      }

      return str;
    }, '');
  };

  this.parse = function(input, format, baseDate) {
    if (!angular.isString(input) || !format) {
      return input;
    }

    format = $locale.DATETIME_FORMATS[format] || format;
    format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

    if ($locale.id !== localeId) {
      this.init();
    }

    if (!this.parsers[format]) {
      this.parsers[format] = createParser(format, 'apply');
    }

    var parser = this.parsers[format],
        regex = parser.regex,
        map = parser.map,
        results = input.match(regex),
        tzOffset = false;
    if (results && results.length) {
      var fields, dt;
      if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
        fields = {
          year: baseDate.getFullYear(),
          month: baseDate.getMonth(),
          date: baseDate.getDate(),
          hours: baseDate.getHours(),
          minutes: baseDate.getMinutes(),
          seconds: baseDate.getSeconds(),
          milliseconds: baseDate.getMilliseconds()
        };
      } else {
        if (baseDate) {
          $log.warn('dateparser:', 'baseDate is not a valid date');
        }
        fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
      }

      for (var i = 1, n = results.length; i < n; i++) {
        var mapper = map[i - 1];
        if (mapper.matcher === 'Z') {
          tzOffset = true;
        }

        if (mapper.apply) {
          mapper.apply.call(fields, results[i]);
        }
      }

      var datesetter = tzOffset ? Date.prototype.setUTCFullYear :
        Date.prototype.setFullYear;
      var timesetter = tzOffset ? Date.prototype.setUTCHours :
        Date.prototype.setHours;

      if (isValid(fields.year, fields.month, fields.date)) {
        if (angular.isDate(baseDate) && !isNaN(baseDate.getTime()) && !tzOffset) {
          dt = new Date(baseDate);
          datesetter.call(dt, fields.year, fields.month, fields.date);
          timesetter.call(dt, fields.hours, fields.minutes,
            fields.seconds, fields.milliseconds);
        } else {
          dt = new Date(0);
          datesetter.call(dt, fields.year, fields.month, fields.date);
          timesetter.call(dt, fields.hours || 0, fields.minutes || 0,
            fields.seconds || 0, fields.milliseconds || 0);
        }
      }

      return dt;
    }
  };

  // Check if date is valid for specific month (and year for February).
  // Month: 0 = Jan, 1 = Feb, etc
  function isValid(year, month, date) {
    if (date < 1) {
      return false;
    }

    if (month === 1 && date > 28) {
      return date === 29 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
    }

    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return date < 31;
    }

    return true;
  }

  function toInt(str) {
    return parseInt(str, 10);
  }

  this.toTimezone = toTimezone;
  this.fromTimezone = fromTimezone;
  this.timezoneToOffset = timezoneToOffset;
  this.addDateMinutes = addDateMinutes;
  this.convertTimezoneToLocal = convertTimezoneToLocal;

  function toTimezone(date, timezone) {
    return date && timezone ? convertTimezoneToLocal(date, timezone) : date;
  }

  function fromTimezone(date, timezone) {
    return date && timezone ? convertTimezoneToLocal(date, timezone, true) : date;
  }

  //https://github.com/angular/angular.js/blob/4daafd3dbe6a80d578f5a31df1bb99c77559543e/src/Angular.js#L1207
  function timezoneToOffset(timezone, fallback) {
    var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
    return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  }

  function addDateMinutes(date, minutes) {
    date = new Date(date.getTime());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  function convertTimezoneToLocal(date, timezone, reverse) {
    reverse = reverse ? -1 : 1;
    var timezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
    return addDateMinutes(date, reverse * (timezoneOffset - date.getTimezoneOffset()));
  }
}]);

// Avoiding use of ng-class as it creates a lot of watchers when a class is to be applied to
// at most one element.
angular.module('ui.bootstrap.isClass', [])
.directive('uibIsClass', [
         '$animate',
function ($animate) {
  //                    11111111          22222222
  var ON_REGEXP = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/;
  //                    11111111           22222222
  var IS_REGEXP = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;

  var dataPerTracked = {};

  return {
    restrict: 'A',
    compile: function (tElement, tAttrs) {
      var linkedScopes = [];
      var instances = [];
      var expToData = {};
      var lastActivated = null;
      var onExpMatches = tAttrs.uibIsClass.match(ON_REGEXP);
      var onExp = onExpMatches[2];
      var expsStr = onExpMatches[1];
      var exps = expsStr.split(',');

      return linkFn;

      function linkFn(scope, element, attrs) {
        linkedScopes.push(scope);
        instances.push({
          scope: scope,
          element: element
        });

        exps.forEach(function (exp, k) {
          addForExp(exp, scope);
        });

        scope.$on('$destroy', removeScope);
      }

      function addForExp(exp, scope) {
        var matches = exp.match(IS_REGEXP);
        var clazz = scope.$eval(matches[1]);
        var compareWithExp = matches[2];
        var data = expToData[exp];
        if (!data) {
          var watchFn = function (compareWithVal) {
            var newActivated = null;
            instances.some(function (instance) {
              var thisVal = instance.scope.$eval(onExp);
              if (thisVal === compareWithVal) {
                newActivated = instance;
                return true;
              }
            });
            if (data.lastActivated !== newActivated) {
              if (data.lastActivated) {
                $animate.removeClass(data.lastActivated.element, clazz);
              }
              if (newActivated) {
                $animate.addClass(newActivated.element, clazz);
              }
              data.lastActivated = newActivated;
            }
          };
          expToData[exp] = data = {
            lastActivated: null,
            scope: scope,
            watchFn: watchFn,
            compareWithExp: compareWithExp,
            watcher: scope.$watch(compareWithExp, watchFn)
          };
        }
        data.watchFn(scope.$eval(compareWithExp));
      }

      function removeScope(e) {
        var removedScope = e.targetScope;
        var index = linkedScopes.indexOf(removedScope);
        linkedScopes.splice(index, 1);
        instances.splice(index, 1);
        if (linkedScopes.length) {
          var newWatchScope = linkedScopes[0];
          angular.forEach(expToData, function (data) {
            if (data.scope === removedScope) {
              data.watcher = newWatchScope.$watch(data.compareWithExp, data.watchFn);
              data.scope = newWatchScope;
            }
          });
        }
        else {
          expToData = {};
        }
      }
    }
  };
}]);
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods for working with the DOM.
 * It is meant to be used where we need to absolute-position elements in
 * relation to another element (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$uibPosition', ['$document', '$window', function($document, $window) {
    /**
     * Used by scrollbarWidth() function to cache scrollbar's width.
     * Do not access this variable directly, use scrollbarWidth() instead.
     */
    var SCROLLBAR_WIDTH;
    var OVERFLOW_REGEX = {
      normal: /(auto|scroll)/,
      hidden: /(auto|scroll|hidden)/
    };
    var PLACEMENT_REGEX = {
      auto: /\s?auto?\s?/i,
      primary: /^(top|bottom|left|right)$/,
      secondary: /^(top|bottom|left|right|center)$/,
      vertical: /^(top|bottom)$/
    };

    return {

      /**
       * Provides a raw DOM element from a jQuery/jQLite element.
       *
       * @param {element} elem - The element to convert.
       *
       * @returns {element} A HTML element.
       */
      getRawNode: function(elem) {
        return elem[0] || elem;
      },

      /**
       * Provides a parsed number for a style property.  Strips
       * units and casts invalid numbers to 0.
       *
       * @param {string} value - The style value to parse.
       *
       * @returns {number} A valid number.
       */
      parseStyle: function(value) {
        value = parseFloat(value);
        return isFinite(value) ? value : 0;
      },

      /**
       * Provides the closest positioned ancestor.
       *
       * @param {element} element - The element to get the offest parent for.
       *
       * @returns {element} The closest positioned ancestor.
       */
      offsetParent: function(elem) {
        elem = this.getRawNode(elem);

        var offsetParent = elem.offsetParent || $document[0].documentElement;

        function isStaticPositioned(el) {
          return ($window.getComputedStyle(el).position || 'static') === 'static';
        }

        while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || $document[0].documentElement;
      },

      /**
       * Provides the scrollbar width, concept from TWBS measureScrollbar()
       * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
       *
       * @returns {number} The width of the browser scollbar.
       */
      scrollbarWidth: function() {
        if (angular.isUndefined(SCROLLBAR_WIDTH)) {
          var scrollElem = angular.element('<div style="position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll;"></div>');
          $document.find('body').append(scrollElem);
          SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
          SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
          scrollElem.remove();
        }

        return SCROLLBAR_WIDTH;
      },

      /**
       * Provides the closest scrollable ancestor.
       * A port of the jQuery UI scrollParent method:
       * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
       *
       * @param {element} elem - The element to find the scroll parent of.
       * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
       *   default is false.
       *
       * @returns {element} A HTML element.
       */
      scrollParent: function(elem, includeHidden) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var documentEl = $document[0].documentElement;
        var elemStyle = $window.getComputedStyle(elem);
        var excludeStatic = elemStyle.position === 'absolute';
        var scrollParent = elem.parentElement || documentEl;

        if (scrollParent === documentEl || elemStyle.position === 'fixed') {
          return documentEl;
        }

        while (scrollParent.parentElement && scrollParent !== documentEl) {
          var spStyle = $window.getComputedStyle(scrollParent);
          if (excludeStatic && spStyle.position !== 'static') {
            excludeStatic = false;
          }

          if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
            break;
          }
          scrollParent = scrollParent.parentElement;
        }

        return scrollParent;
      },

      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/ - distance to closest positioned
       * ancestor.  Does not account for margins by default like jQuery position.
       *
       * @param {element} elem - The element to caclulate the position on.
       * @param {boolean=} [includeMargins=false] - Should margins be accounted
       * for, default is false.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**width**: the width of the element</li>
       *     <li>**height**: the height of the element</li>
       *     <li>**top**: distance to top edge of offset parent</li>
       *     <li>**left**: distance to left edge of offset parent</li>
       *   </ul>
       */
      position: function(elem, includeMagins) {
        elem = this.getRawNode(elem);

        var elemOffset = this.offset(elem);
        if (includeMagins) {
          var elemStyle = $window.getComputedStyle(elem);
          elemOffset.top -= this.parseStyle(elemStyle.marginTop);
          elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
        }
        var parent = this.offsetParent(elem);
        var parentOffset = {top: 0, left: 0};

        if (parent !== $document[0].documentElement) {
          parentOffset = this.offset(parent);
          parentOffset.top += parent.clientTop - parent.scrollTop;
          parentOffset.left += parent.clientLeft - parent.scrollLeft;
        }

        return {
          width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
          height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
          top: Math.round(elemOffset.top - parentOffset.top),
          left: Math.round(elemOffset.left - parentOffset.left)
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/ - distance to viewport.  Does
       * not account for borders, margins, or padding on the body
       * element.
       *
       * @param {element} elem - The element to calculate the offset on.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**width**: the width of the element</li>
       *     <li>**height**: the height of the element</li>
       *     <li>**top**: distance to top edge of viewport</li>
       *     <li>**right**: distance to bottom edge of viewport</li>
       *   </ul>
       */
      offset: function(elem) {
        elem = this.getRawNode(elem);

        var elemBCR = elem.getBoundingClientRect();
        return {
          width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
          height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
          top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
          left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
        };
      },

      /**
       * Provides offset distance to the closest scrollable ancestor
       * or viewport.  Accounts for border and scrollbar width.
       *
       * Right and bottom dimensions represent the distance to the
       * respective edge of the viewport element.  If the element
       * edge extends beyond the viewport, a negative value will be
       * reported.
       *
       * @param {element} elem - The element to get the viewport offset for.
       * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
       * of the first scrollable element, default is false.
       * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
       * be accounted for, default is true.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**top**: distance to the top content edge of viewport element</li>
       *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
       *     <li>**left**: distance to the left content edge of viewport element</li>
       *     <li>**right**: distance to the right content edge of viewport element</li>
       *   </ul>
       */
      viewportOffset: function(elem, useDocument, includePadding) {
        elem = this.getRawNode(elem);
        includePadding = includePadding !== false ? true : false;

        var elemBCR = elem.getBoundingClientRect();
        var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

        var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
        var offsetParentBCR = offsetParent.getBoundingClientRect();

        offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
        offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
        if (offsetParent === $document[0].documentElement) {
          offsetBCR.top += $window.pageYOffset;
          offsetBCR.left += $window.pageXOffset;
        }
        offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
        offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

        if (includePadding) {
          var offsetParentStyle = $window.getComputedStyle(offsetParent);
          offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
          offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
          offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
          offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
        }

        return {
          top: Math.round(elemBCR.top - offsetBCR.top),
          bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
          left: Math.round(elemBCR.left - offsetBCR.left),
          right: Math.round(offsetBCR.right - elemBCR.right)
        };
      },

      /**
       * Provides an array of placement values parsed from a placement string.
       * Along with the 'auto' indicator, supported placement strings are:
       *   <ul>
       *     <li>top: element on top, horizontally centered on host element.</li>
       *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
       *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
       *     <li>bottom: element on bottom, horizontally centered on host element.</li>
       *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
       *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
       *     <li>left: element on left, vertically centered on host element.</li>
       *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
       *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
       *     <li>right: element on right, vertically centered on host element.</li>
       *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
       *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
       *   </ul>
       * A placement string with an 'auto' indicator is expected to be
       * space separated from the placement, i.e: 'auto bottom-left'  If
       * the primary and secondary placement values do not match 'top,
       * bottom, left, right' then 'top' will be the primary placement and
       * 'center' will be the secondary placement.  If 'auto' is passed, true
       * will be returned as the 3rd value of the array.
       *
       * @param {string} placement - The placement string to parse.
       *
       * @returns {array} An array with the following values
       * <ul>
       *   <li>**[0]**: The primary placement.</li>
       *   <li>**[1]**: The secondary placement.</li>
       *   <li>**[2]**: If auto is passed: true, else undefined.</li>
       * </ul>
       */
      parsePlacement: function(placement) {
        var autoPlace = PLACEMENT_REGEX.auto.test(placement);
        if (autoPlace) {
          placement = placement.replace(PLACEMENT_REGEX.auto, '');
        }

        placement = placement.split('-');

        placement[0] = placement[0] || 'top';
        if (!PLACEMENT_REGEX.primary.test(placement[0])) {
          placement[0] = 'top';
        }

        placement[1] = placement[1] || 'center';
        if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
          placement[1] = 'center';
        }

        if (autoPlace) {
          placement[2] = true;
        } else {
          placement[2] = false;
        }

        return placement;
      },

      /**
       * Provides coordinates for an element to be positioned relative to
       * another element.  Passing 'auto' as part of the placement parameter
       * will enable smart placement - where the element fits. i.e:
       * 'auto left-top' will check to see if there is enough space to the left
       * of the hostElem to fit the targetElem, if not place right (same for secondary
       * top placement).  Available space is calculated using the viewportOffset
       * function.
       *
       * @param {element} hostElem - The element to position against.
       * @param {element} targetElem - The element to position.
       * @param {string=} [placement=top] - The placement for the targetElem,
       *   default is 'top'. 'center' is assumed as secondary placement for
       *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
       *   <ul>
       *     <li>top</li>
       *     <li>top-right</li>
       *     <li>top-left</li>
       *     <li>bottom</li>
       *     <li>bottom-left</li>
       *     <li>bottom-right</li>
       *     <li>left</li>
       *     <li>left-top</li>
       *     <li>left-bottom</li>
       *     <li>right</li>
       *     <li>right-top</li>
       *     <li>right-bottom</li>
       *   </ul>
       * @param {boolean=} [appendToBody=false] - Should the top and left values returned
       *   be calculated from the body element, default is false.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**top**: Value for targetElem top.</li>
       *     <li>**left**: Value for targetElem left.</li>
       *     <li>**placement**: The resolved placement.</li>
       *   </ul>
       */
      positionElements: function(hostElem, targetElem, placement, appendToBody) {
        hostElem = this.getRawNode(hostElem);
        targetElem = this.getRawNode(targetElem);

        // need to read from prop to support tests.
        var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
        var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

        placement = this.parsePlacement(placement);

        var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
        var targetElemPos = {top: 0, left: 0, placement: ''};

        if (placement[2]) {
          var viewportOffset = this.viewportOffset(hostElem);

          var targetElemStyle = $window.getComputedStyle(targetElem);
          var adjustedSize = {
            width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
            height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
          };

          placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                         placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                         placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                         placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                         placement[0];

          placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                         placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                         placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                         placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                         placement[1];

          if (placement[1] === 'center') {
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
              if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                placement[1] = 'left';
              } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                placement[1] = 'right';
              }
            } else {
              var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
              if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                placement[1] = 'top';
              } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                placement[1] = 'bottom';
              }
            }
          }
        }

        switch (placement[0]) {
          case 'top':
            targetElemPos.top = hostElemPos.top - targetHeight;
            break;
          case 'bottom':
            targetElemPos.top = hostElemPos.top + hostElemPos.height;
            break;
          case 'left':
            targetElemPos.left = hostElemPos.left - targetWidth;
            break;
          case 'right':
            targetElemPos.left = hostElemPos.left + hostElemPos.width;
            break;
        }

        switch (placement[1]) {
          case 'top':
            targetElemPos.top = hostElemPos.top;
            break;
          case 'bottom':
            targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
            break;
          case 'left':
            targetElemPos.left = hostElemPos.left;
            break;
          case 'right':
            targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
            break;
          case 'center':
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
            } else {
              targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
            }
            break;
        }

        targetElemPos.top = Math.round(targetElemPos.top);
        targetElemPos.left = Math.round(targetElemPos.left);
        targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

        return targetElemPos;
      },

      /**
      * Provides a way for positioning tooltip & dropdown
      * arrows when using placement options beyond the standard
      * left, right, top, or bottom.
      *
      * @param {element} elem - The tooltip/dropdown element.
      * @param {string} placement - The placement for the elem.
      */
      positionArrow: function(elem, placement) {
        elem = this.getRawNode(elem);

        var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
        if (!innerElem) {
          return;
        }

        var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');

        var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
        if (!arrowElem) {
          return;
        }

        placement = this.parsePlacement(placement);
        if (placement[1] === 'center') {
          // no adjustment necessary - just reset styles
          angular.element(arrowElem).css({top: '', bottom: '', right: '', left: '', margin: ''});
          return;
        }

        var borderProp = 'border-' + placement[0] + '-width';
        var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];

        var borderRadiusProp = 'border-';
        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
          borderRadiusProp += placement[0] + '-' + placement[1];
        } else {
          borderRadiusProp += placement[1] + '-' + placement[0];
        }
        borderRadiusProp += '-radius';
        var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

        var arrowCss = {
          top: 'auto',
          bottom: 'auto',
          left: 'auto',
          right: 'auto',
          margin: 0
        };

        switch (placement[0]) {
          case 'top':
            arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'bottom':
            arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'left':
            arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'right':
            arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
            break;
        }

        arrowCss[placement[1]] = borderRadius;

        angular.element(arrowElem).css(arrowCss);
      }
    };
  }]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.isClass', 'ui.bootstrap.position'])

.value('$datepickerSuppressError', false)

.constant('uibDatepickerConfig', {
  datepickerMode: 'day',
  formatDay: 'dd',
  formatMonth: 'MMMM',
  formatYear: 'yyyy',
  formatDayHeader: 'EEE',
  formatDayTitle: 'MMMM yyyy',
  formatMonthTitle: 'yyyy',
  maxDate: null,
  maxMode: 'year',
  minDate: null,
  minMode: 'day',
  ngModelOptions: {},
  shortcutPropagation: false,
  showWeeks: true,
  yearColumns: 5,
  yearRows: 4
})

.controller('UibDatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$locale', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerSuppressError', 'uibDateParser',
  function($scope, $attrs, $parse, $interpolate, $locale, $log, dateFilter, datepickerConfig, $datepickerSuppressError, dateParser) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl;
      ngModelOptions = {},
      watchListeners = [];

  // Modes chain
  this.modes = ['day', 'month', 'year'];

  if ($attrs.datepickerOptions) {
    angular.forEach([
      'formatDay',
      'formatDayHeader',
      'formatDayTitle',
      'formatMonth',
      'formatMonthTitle',
      'formatYear',
      'initDate',
      'maxDate',
      'maxMode',
      'minDate',
      'minMode',
      'showWeeks',
      'shortcutPropagation',
      'startingDay',
      'yearColumns',
      'yearRows'
    ], function(key) {
      switch (key) {
        case 'formatDay':
        case 'formatDayHeader':
        case 'formatDayTitle':
        case 'formatMonth':
        case 'formatMonthTitle':
        case 'formatYear':
          self[key] = angular.isDefined($scope.datepickerOptions[key]) ? $interpolate($scope.datepickerOptions[key])($scope.$parent) : datepickerConfig[key];
          break;
        case 'showWeeks':
        case 'shortcutPropagation':
        case 'yearColumns':
        case 'yearRows':
          self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
            $scope.datepickerOptions[key] : datepickerConfig[key];
          break;
        case 'startingDay':
          if (angular.isDefined($scope.datepickerOptions.startingDay)) {
            self.startingDay = $scope.datepickerOptions.startingDay;
          } else if (angular.isNumber(datepickerConfig.startingDay)) {
            self.startingDay = datepickerConfig.startingDay;
          } else {
            self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
          }

          break;
        case 'maxDate':
        case 'minDate':
          if ($scope.datepickerOptions[key]) {
            $scope.$watch(function() { return $scope.datepickerOptions[key]; }, function(value) {
              if (value) {
                if (angular.isDate(value)) {
                  self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
                } else {
                  self[key] = new Date(dateFilter(value, 'medium'));
                }
              } else {
                self[key] = null;
              }

              self.refreshView();
            });
          } else {
            self[key] = datepickerConfig[key] ? dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.timezone) : null;
          }

          break;
        case 'maxMode':
        case 'minMode':
          if ($scope.datepickerOptions[key]) {
            $scope.$watch(function() { return $scope.datepickerOptions[key]; }, function(value) {
              self[key] = $scope[key] = angular.isDefined(value) ? value : datepickerOptions[key];
              if (key === 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key]) ||
                key === 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key])) {
                $scope.datepickerMode = self[key];
              }
            });
          } else {
            self[key] = $scope[key] = datepickerConfig[key] || null;
          }

          break;
        case 'initDate':
          if ($scope.datepickerOptions.initDate) {
            this.activeDate = dateParser.fromTimezone($scope.datepickerOptions.initDate, ngModelOptions.timezone) || new Date();
            $scope.$watch(function() { return $scope.datepickerOptions.initDate; }, function(initDate) {
              if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
                self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.timezone);
                self.refreshView();
              }
            });
          } else {
            this.activeDate = new Date();
          }
      }
    });
  } else {
    // Interpolated configuration attributes
    angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle'], function(key) {
      self[key] = angular.isDefined($attrs[key]) ? $interpolate($attrs[key])($scope.$parent) : datepickerConfig[key];
    });

    // Evaled configuration attributes
    angular.forEach(['showWeeks', 'yearRows', 'yearColumns', 'shortcutPropagation'], function(key) {
      self[key] = angular.isDefined($attrs[key]) ?
        $scope.$parent.$eval($attrs[key]) : datepickerConfig[key];
    });

    if (angular.isDefined($attrs.startingDay)) {
      self.startingDay = $scope.$parent.$eval($attrs.startingDay);
    } else if (angular.isNumber(datepickerConfig.startingDay)) {
      self.startingDay = datepickerConfig.startingDay;
    } else {
      self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
    }

    // Watchable date attributes
    angular.forEach(['minDate', 'maxDate'], function(key) {
      if ($attrs[key]) {
        watchListeners.push($scope.$parent.$watch($attrs[key], function(value) {
          if (value) {
            if (angular.isDate(value)) {
              self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
            } else {
              self[key] = new Date(dateFilter(value, 'medium'));
            }
          } else {
            self[key] = null;
          }

          self.refreshView();
        }));
      } else {
        self[key] = datepickerConfig[key] ? dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.timezone) : null;
      }
    });

    angular.forEach(['minMode', 'maxMode'], function(key) {
      if ($attrs[key]) {
        watchListeners.push($scope.$parent.$watch($attrs[key], function(value) {
          self[key] = $scope[key] = angular.isDefined(value) ? value : $attrs[key];
          if (key === 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key]) ||
            key === 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key])) {
            $scope.datepickerMode = self[key];
          }
        }));
      } else {
        self[key] = $scope[key] = datepickerConfig[key] || null;
      }
    });

    if (angular.isDefined($attrs.initDate)) {
      this.activeDate = dateParser.fromTimezone($scope.$parent.$eval($attrs.initDate), ngModelOptions.timezone) || new Date();
      watchListeners.push($scope.$parent.$watch($attrs.initDate, function(initDate) {
        if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
          self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.timezone);
          self.refreshView();
        }
      }));
    } else {
      this.activeDate = new Date();
    }
  }

  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

  $scope.disabled = angular.isDefined($attrs.disabled) || false;
  if (angular.isDefined($attrs.ngDisabled)) {
    watchListeners.push($scope.$parent.$watch($attrs.ngDisabled, function(disabled) {
      $scope.disabled = disabled;
      self.refreshView();
    }));
  }

  $scope.isActive = function(dateObject) {
    if (self.compare(dateObject.date, self.activeDate) === 0) {
      $scope.activeDateId = dateObject.uid;
      return true;
    }
    return false;
  };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelOptions = ngModelCtrl_.$options || datepickerConfig.ngModelOptions;

    if (ngModelCtrl.$modelValue) {
      this.activeDate = ngModelCtrl.$modelValue;
    }

    ngModelCtrl.$render = function() {
      self.render();
    };
  };

  this.render = function() {
    if (ngModelCtrl.$viewValue) {
      var date = new Date(ngModelCtrl.$viewValue),
          isValid = !isNaN(date);

      if (isValid) {
        this.activeDate = dateParser.fromTimezone(date, ngModelOptions.timezone);
      } else if (!$datepickerSuppressError) {
        $log.error('Datepicker directive: "ng-model" value must be a Date object');
      }
    }
    this.refreshView();
  };

  this.refreshView = function() {
    if (this.element) {
      $scope.selectedDt = null;
      this._refreshView();
      if ($scope.activeDt) {
        $scope.activeDateId = $scope.activeDt.uid;
      }

      var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
      date = dateParser.fromTimezone(date, ngModelOptions.timezone);
      ngModelCtrl.$setValidity('dateDisabled', !date ||
        this.element && !this.isDisabled(date));
    }
  };

  this.createDateObject = function(date, format) {
    var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
    model = dateParser.fromTimezone(model, ngModelOptions.timezone);
    var dt = {
      date: date,
      label: dateParser.filter(date, format),
      selected: model && this.compare(date, model) === 0,
      disabled: this.isDisabled(date),
      current: this.compare(date, new Date()) === 0,
      customClass: this.customClass(date) || null
    };

    if (model && this.compare(date, model) === 0) {
      $scope.selectedDt = dt;
    }

    if (self.activeDate && this.compare(dt.date, self.activeDate) === 0) {
      $scope.activeDt = dt;
    }

    return dt;
  };

  this.isDisabled = function(date) {
    return $scope.disabled ||
      this.minDate && this.compare(date, this.minDate) < 0 ||
      this.maxDate && this.compare(date, this.maxDate) > 0 ||
      $attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode});
  };

  this.customClass = function(date) {
    return $scope.customClass({date: date, mode: $scope.datepickerMode});
  };

  // Split array into smaller arrays
  this.split = function(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  };

  $scope.select = function(date) {
    if ($scope.datepickerMode === self.minMode) {
      var dt = ngModelCtrl.$viewValue ? dateParser.fromTimezone(new Date(ngModelCtrl.$viewValue), ngModelOptions.timezone) : new Date(0, 0, 0, 0, 0, 0, 0);
      dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      dt = dateParser.toTimezone(dt, ngModelOptions.timezone);
      ngModelCtrl.$setViewValue(dt);
      ngModelCtrl.$render();
    } else {
      self.activeDate = date;
      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
    }
  };

  $scope.move = function(direction) {
    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
    self.activeDate.setFullYear(year, month, 1);
    self.refreshView();
  };

  $scope.toggleMode = function(direction) {
    direction = direction || 1;

    if ($scope.datepickerMode === self.maxMode && direction === 1 ||
      $scope.datepickerMode === self.minMode && direction === -1) {
      return;
    }

    $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
  };

  // Key event mapper
  $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

  var focusElement = function() {
    self.element[0].focus();
  };

  // Listen for focus requests from popup directive
  $scope.$on('uib:datepicker.focus', focusElement);

  $scope.keydown = function(evt) {
    var key = $scope.keys[evt.which];

    if (!key || evt.shiftKey || evt.altKey || $scope.disabled) {
      return;
    }

    evt.preventDefault();
    if (!self.shortcutPropagation) {
      evt.stopPropagation();
    }

    if (key === 'enter' || key === 'space') {
      if (self.isDisabled(self.activeDate)) {
        return; // do nothing
      }
      $scope.select(self.activeDate);
    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
      $scope.toggleMode(key === 'up' ? 1 : -1);
    } else {
      self.handleKeyDown(key, evt);
      self.refreshView();
    }
  };

  $scope.$on("$destroy", function() {
    //Clear all watch listeners on destroy
    while (watchListeners.length) {
      watchListeners.shift()();
    }
  });
}])

.controller('UibDaypickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  this.step = { months: 1 };
  this.element = $element;
  function getDaysInMonth(year, month) {
    return month === 1 && year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
  }

  this.init = function(ctrl) {
    angular.extend(ctrl, this);
    scope.showWeeks = ctrl.showWeeks;
    ctrl.refreshView();
  };

  this.getDates = function(startDate, n) {
    var dates = new Array(n), current = new Date(startDate), i = 0, date;
    while (i < n) {
      date = new Date(current);
      dates[i++] = date;
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  this._refreshView = function() {
    var year = this.activeDate.getFullYear(),
      month = this.activeDate.getMonth(),
      firstDayOfMonth = new Date(this.activeDate);

    firstDayOfMonth.setFullYear(year, month, 1);

    var difference = this.startingDay - firstDayOfMonth.getDay(),
      numDisplayedFromPreviousMonth = difference > 0 ?
        7 - difference : - difference,
      firstDate = new Date(firstDayOfMonth);

    if (numDisplayedFromPreviousMonth > 0) {
      firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
    }

    // 42 is the number of days on a six-week calendar
    var days = this.getDates(firstDate, 42);
    for (var i = 0; i < 42; i ++) {
      days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
        secondary: days[i].getMonth() !== month,
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.labels = new Array(7);
    for (var j = 0; j < 7; j++) {
      scope.labels[j] = {
        abbr: dateFilter(days[j].date, this.formatDayHeader),
        full: dateFilter(days[j].date, 'EEEE')
      };
    }

    scope.title = dateFilter(this.activeDate, this.formatDayTitle);
    scope.rows = this.split(days, 7);

    if (scope.showWeeks) {
      scope.weekNumbers = [];
      var thursdayIndex = (4 + 7 - this.startingDay) % 7,
          numWeeks = scope.rows.length;
      for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
        scope.weekNumbers.push(
          getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
      }
    }
  };

  this.compare = function(date1, date2) {
    var _date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var _date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    _date1.setFullYear(date1.getFullYear());
    _date2.setFullYear(date2.getFullYear());
    return _date1 - _date2;
  };

  function getISO8601WeekNumber(date) {
    var checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
    var time = checkDate.getTime();
    checkDate.setMonth(0); // Compare with Jan 1
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
  }

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getDate();

    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - 7;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + 7;
    } else if (key === 'pageup' || key === 'pagedown') {
      var month = this.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
      this.activeDate.setMonth(month, 1);
      date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
    } else if (key === 'home') {
      date = 1;
    } else if (key === 'end') {
      date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
    }
    this.activeDate.setDate(date);
  };
}])

.controller('UibMonthpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  this.step = { years: 1 };
  this.element = $element;

  this.init = function(ctrl) {
    angular.extend(ctrl, this);
    ctrl.refreshView();
  };

  this._refreshView = function() {
    var months = new Array(12),
        year = this.activeDate.getFullYear(),
        date;

    for (var i = 0; i < 12; i++) {
      date = new Date(this.activeDate);
      date.setFullYear(year, i, 1);
      months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
    scope.rows = this.split(months, 3);
  };

  this.compare = function(date1, date2) {
    var _date1 = new Date(date1.getFullYear(), date1.getMonth());
    var _date2 = new Date(date2.getFullYear(), date2.getMonth());
    _date1.setFullYear(date1.getFullYear());
    _date2.setFullYear(date2.getFullYear());
    return _date1 - _date2;
  };

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getMonth();

    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - 3;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + 3;
    } else if (key === 'pageup' || key === 'pagedown') {
      var year = this.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
      this.activeDate.setFullYear(year);
    } else if (key === 'home') {
      date = 0;
    } else if (key === 'end') {
      date = 11;
    }
    this.activeDate.setMonth(date);
  };
}])

.controller('UibYearpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  var columns, range;
  this.element = $element;

  function getStartingYear(year) {
    return parseInt((year - 1) / range, 10) * range + 1;
  }

  this.yearpickerInit = function() {
    columns = this.yearColumns;
    range = this.yearRows * columns;
    this.step = { years: range };
  };

  this._refreshView = function() {
    var years = new Array(range), date;

    for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()); i < range; i++) {
      date = new Date(this.activeDate);
      date.setFullYear(start + i, 0, 1);
      years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.title = [years[0].label, years[range - 1].label].join(' - ');
    scope.rows = this.split(years, columns);
    scope.columns = columns;
  };

  this.compare = function(date1, date2) {
    return date1.getFullYear() - date2.getFullYear();
  };

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getFullYear();

    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - columns;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + columns;
    } else if (key === 'pageup' || key === 'pagedown') {
      date += (key === 'pageup' ? - 1 : 1) * range;
    } else if (key === 'home') {
      date = getStartingYear(this.activeDate.getFullYear());
    } else if (key === 'end') {
      date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
    }
    this.activeDate.setFullYear(date);
  };
}])

.directive('uibDatepicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/datepicker.html';
    },
    scope: {
      datepickerMode: '=?',
      datepickerOptions: '=?',
      dateDisabled: '&',
      customClass: '&',
      shortcutPropagation: '&?'
    },
    require: ['uibDatepicker', '^ngModel'],
    controller: 'UibDatepickerController',
    controllerAs: 'datepicker',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      datepickerCtrl.init(ngModelCtrl);
    }
  };
})

.directive('uibDaypicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/day.html';
    },
    require: ['^uibDatepicker', 'uibDaypicker'],
    controller: 'UibDaypickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0],
        daypickerCtrl = ctrls[1];

      daypickerCtrl.init(datepickerCtrl);
    }
  };
})

.directive('uibMonthpicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/month.html';
    },
    require: ['^uibDatepicker', 'uibMonthpicker'],
    controller: 'UibMonthpickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0],
        monthpickerCtrl = ctrls[1];

      monthpickerCtrl.init(datepickerCtrl);
    }
  };
})

.directive('uibYearpicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/year.html';
    },
    require: ['^uibDatepicker', 'uibYearpicker'],
    controller: 'UibYearpickerController',
    link: function(scope, element, attrs, ctrls) {
      var ctrl = ctrls[0];
      angular.extend(ctrl, ctrls[1]);
      ctrl.yearpickerInit();

      ctrl.refreshView();
    }
  };
})

.constant('uibDatepickerPopupConfig', {
  altInputFormats: [],
  appendToBody: false,
  clearText: 'Clear',
  closeOnDateSelection: true,
  closeText: 'Done',
  currentText: 'Today',
  datepickerPopup: 'yyyy-MM-dd',
  datepickerPopupTemplateUrl: 'uib/template/datepicker/popup.html',
  datepickerTemplateUrl: 'uib/template/datepicker/datepicker.html',
  html5Types: {
    date: 'yyyy-MM-dd',
    'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
    'month': 'yyyy-MM'
  },
  onOpenFocus: true,
  showButtonBar: true
})

.controller('UibDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig', '$timeout', 'uibDatepickerConfig',
function(scope, element, attrs, $compile, $parse, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout, datepickerConfig) {
  var cache = {},
    isHtml5DateInput = false;
  var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
    datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl,
    ngModel, ngModelOptions, $popup, altInputFormats, watchListeners = [];

  scope.watchData = {};

  this.init = function(_ngModel_) {
    ngModel = _ngModel_;
    ngModelOptions = _ngModel_.$options || datepickerConfig.ngModelOptions;
    closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection;
    appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;
    onOpenFocus = angular.isDefined(attrs.onOpenFocus) ? scope.$parent.$eval(attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
    datepickerPopupTemplateUrl = angular.isDefined(attrs.datepickerPopupTemplateUrl) ? attrs.datepickerPopupTemplateUrl : datepickerPopupConfig.datepickerPopupTemplateUrl;
    datepickerTemplateUrl = angular.isDefined(attrs.datepickerTemplateUrl) ? attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;
    altInputFormats = angular.isDefined(attrs.altInputFormats) ? scope.$parent.$eval(attrs.altInputFormats) : datepickerPopupConfig.altInputFormats;

    scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

    if (datepickerPopupConfig.html5Types[attrs.type]) {
      dateFormat = datepickerPopupConfig.html5Types[attrs.type];
      isHtml5DateInput = true;
    } else {
      dateFormat = attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
      attrs.$observe('uibDatepickerPopup', function(value, oldValue) {
        var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
        // Invalidate the $modelValue to ensure that formatters re-run
        // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
        if (newDateFormat !== dateFormat) {
          dateFormat = newDateFormat;
          ngModel.$modelValue = null;

          if (!dateFormat) {
            throw new Error('uibDatepickerPopup must have a date format specified.');
          }
        }
      });
    }

    if (!dateFormat) {
      throw new Error('uibDatepickerPopup must have a date format specified.');
    }

    if (isHtml5DateInput && attrs.uibDatepickerPopup) {
      throw new Error('HTML5 date input types do not support custom formats.');
    }

    // popup element used to display calendar
    popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');
    scope.ngModelOptions = angular.copy(ngModelOptions);
    scope.ngModelOptions.timezone = null;
    popupEl.attr({
      'ng-model': 'date',
      'ng-model-options': 'ngModelOptions',
      'ng-change': 'dateSelection(date)',
      'template-url': datepickerPopupTemplateUrl
    });

    // datepicker element
    datepickerEl = angular.element(popupEl.children()[0]);
    datepickerEl.attr('template-url', datepickerTemplateUrl);

    if (isHtml5DateInput) {
      if (attrs.type === 'month') {
        datepickerEl.attr('datepicker-mode', '"month"');
        datepickerEl.attr('min-mode', 'month');
      }
    }

    if (scope.datepickerOptions) {
      angular.forEach(scope.datepickerOptions, function(value, option) {
        // Ignore this options, will be managed later
        if (['minDate', 'maxDate', 'minMode', 'maxMode', 'initDate', 'datepickerMode'].indexOf(option) === -1) {
          datepickerEl.attr(cameltoDash(option), value);
        } else {
          datepickerEl.attr(cameltoDash(option), 'datepickerOptions.' + option);
        }
      });
    }

    angular.forEach(['minMode', 'maxMode', 'datepickerMode', 'shortcutPropagation'], function(key) {
      if (attrs[key]) {
        var getAttribute = $parse(attrs[key]);
        var propConfig = {
          get: function() {
            return getAttribute(scope.$parent);
          }
        };

        datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

        // Propagate changes from datepicker to outside
        if (key === 'datepickerMode') {
          var setAttribute = getAttribute.assign;
          propConfig.set = function(v) {
            setAttribute(scope.$parent, v);
          };
        }

        Object.defineProperty(scope.watchData, key, propConfig);
      }
    });

    angular.forEach(['minDate', 'maxDate', 'initDate'], function(key) {
      if (attrs[key]) {
        var getAttribute = $parse(attrs[key]);

        watchListeners.push(scope.$parent.$watch(getAttribute, function(value) {
          if (key === 'minDate' || key === 'maxDate') {
            if (value === null) {
              cache[key] = null;
            } else if (angular.isDate(value)) {
              cache[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
            } else {
              cache[key] = new Date(dateFilter(value, 'medium'));
            }

            scope.watchData[key] = value === null ? null : cache[key];
          } else {
            scope.watchData[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
          }
        }));

        datepickerEl.attr(cameltoDash(key), 'watchData.' + key);
      }
    });

    if (attrs.dateDisabled) {
      datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
    }

    angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle', 'showWeeks', 'startingDay', 'yearRows', 'yearColumns'], function(key) {
      if (angular.isDefined(attrs[key])) {
        datepickerEl.attr(cameltoDash(key), attrs[key]);
      }
    });

    if (attrs.customClass) {
      datepickerEl.attr('custom-class', 'customClass({ date: date, mode: mode })');
    }

    if (!isHtml5DateInput) {
      // Internal API to maintain the correct ng-invalid-[key] class
      ngModel.$$parserName = 'date';
      ngModel.$validators.date = validator;
      ngModel.$parsers.unshift(parseDate);
      ngModel.$formatters.push(function(value) {
        if (ngModel.$isEmpty(value)) {
          scope.date = value;
          return value;
        }

        scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);

        if (angular.isNumber(scope.date)) {
          scope.date = new Date(scope.date);
        }

        return dateParser.filter(scope.date, dateFormat);
      });
    } else {
      ngModel.$formatters.push(function(value) {
        scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);
        return value;
      });
    }

    // Detect changes in the view from the text box
    ngModel.$viewChangeListeners.push(function() {
      scope.date = parseDateString(ngModel.$viewValue);
    });

    element.on('keydown', inputKeydownBind);

    $popup = $compile(popupEl)(scope);
    // Prevent jQuery cache memory leak (template is now redundant after linking)
    popupEl.remove();

    if (appendToBody) {
      $document.find('body').append($popup);
    } else {
      element.after($popup);
    }

    scope.$on('$destroy', function() {
      if (scope.isOpen === true) {
        if (!$rootScope.$$phase) {
          scope.$apply(function() {
            scope.isOpen = false;
          });
        }
      }

      $popup.remove();
      element.off('keydown', inputKeydownBind);
      $document.off('click', documentClickBind);

      //Clear all watch listeners on destroy
      while (watchListeners.length) {
        watchListeners.shift()();
      }
    });
  };

  scope.getText = function(key) {
    return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
  };

  scope.isDisabled = function(date) {
    if (date === 'today') {
      date = new Date();
    }

    return scope.watchData.minDate && scope.compare(date, cache.minDate) < 0 ||
        scope.watchData.maxDate && scope.compare(date, cache.maxDate) > 0;
  };

  scope.compare = function(date1, date2) {
    return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  };

  // Inner change
  scope.dateSelection = function(dt) {
    if (angular.isDefined(dt)) {
      scope.date = dt;
    }
    var date = scope.date ? dateParser.filter(scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
    element.val(date);
    ngModel.$setViewValue(date);

    if (closeOnDateSelection) {
      scope.isOpen = false;
      element[0].focus();
    }
  };

  scope.keydown = function(evt) {
    if (evt.which === 27) {
      evt.stopPropagation();
      scope.isOpen = false;
      element[0].focus();
    }
  };

  scope.select = function(date) {
    if (date === 'today') {
      var today = new Date();
      if (angular.isDate(scope.date)) {
        date = new Date(scope.date);
        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      } else {
        date = new Date(today.setHours(0, 0, 0, 0));
      }
    }
    scope.dateSelection(date);
  };

  scope.close = function() {
    scope.isOpen = false;
    element[0].focus();
  };

  scope.disabled = angular.isDefined(attrs.disabled) || false;
  if (attrs.ngDisabled) {
    watchListeners.push(scope.$parent.$watch($parse(attrs.ngDisabled), function(disabled) {
      scope.disabled = disabled;
    }));
  }

  scope.$watch('isOpen', function(value) {
    if (value) {
      if (!scope.disabled) {
        scope.position = appendToBody ? $position.offset(element) : $position.position(element);
        scope.position.top = scope.position.top + element.prop('offsetHeight');

        $timeout(function() {
          if (onOpenFocus) {
            scope.$broadcast('uib:datepicker.focus');
          }
          $document.on('click', documentClickBind);
        }, 0, false);
      } else {
        scope.isOpen = false;
      }
    } else {
      $document.off('click', documentClickBind);
    }
  });

  function cameltoDash(string) {
    return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
  }

  function parseDateString(viewValue) {
    var date = dateParser.parse(viewValue, dateFormat, scope.date);
    if (isNaN(date)) {
      for (var i = 0; i < altInputFormats.length; i++) {
        date = dateParser.parse(viewValue, altInputFormats[i], scope.date);
        if (!isNaN(date)) {
          return date;
        }
      }
    }
    return date;
  }

  function parseDate(viewValue) {
    if (angular.isNumber(viewValue)) {
      // presumably timestamp to date object
      viewValue = new Date(viewValue);
    }

    if (!viewValue) {
      return null;
    }

    if (angular.isDate(viewValue) && !isNaN(viewValue)) {
      return viewValue;
    }

    if (angular.isString(viewValue)) {
      var date = parseDateString(viewValue);
      if (!isNaN(date)) {
        return dateParser.toTimezone(date, ngModelOptions.timezone);
      }
    }

    return ngModel.$options && ngModel.$options.allowInvalid ? viewValue : undefined;
  }

  function validator(modelValue, viewValue) {
    var value = modelValue || viewValue;

    if (!attrs.ngRequired && !value) {
      return true;
    }

    if (angular.isNumber(value)) {
      value = new Date(value);
    }

    if (!value) {
      return true;
    }

    if (angular.isDate(value) && !isNaN(value)) {
      return true;
    }

    if (angular.isString(value)) {
      return !isNaN(parseDateString(viewValue));
    }

    return false;
  }

  function documentClickBind(event) {
    if (!scope.isOpen && scope.disabled) {
      return;
    }

    var popup = $popup[0];
    var dpContainsTarget = element[0].contains(event.target);
    // The popup node may not be an element node
    // In some browsers (IE) only element nodes have the 'contains' function
    var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
    if (scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
      scope.$apply(function() {
        scope.isOpen = false;
      });
    }
  }

  function inputKeydownBind(evt) {
    if (evt.which === 27 && scope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      scope.$apply(function() {
        scope.isOpen = false;
      });
      element[0].focus();
    } else if (evt.which === 40 && !scope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      scope.$apply(function() {
        scope.isOpen = true;
      });
    }
  }
}])

.directive('uibDatepickerPopup', function() {
  return {
    require: ['ngModel', 'uibDatepickerPopup'],
    controller: 'UibDatepickerPopupController',
    scope: {
      datepickerOptions: '=?',
      isOpen: '=?',
      currentText: '@',
      clearText: '@',
      closeText: '@',
      dateDisabled: '&',
      customClass: '&'
    },
    link: function(scope, element, attrs, ctrls) {
      var ngModel = ctrls[0],
        ctrl = ctrls[1];

      ctrl.init(ngModel);
    }
  };
})

.directive('uibDatepickerPopupWrap', function() {
  return {
    replace: true,
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/popup.html';
    }
  };
});

angular.module('ui.bootstrap.debounce', [])
/**
 * A helper, internal service that debounces a function
 */
  .factory('$$debounce', ['$timeout', function($timeout) {
    return function(callback, debounceTime) {
      var timeoutPromise;

      return function() {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }

        timeoutPromise = $timeout(function() {
          callback.apply(self, args);
        }, debounceTime);
      };
    };
  }]);

angular.module('ui.bootstrap.dropdown', ['ui.bootstrap.position'])

.constant('uibDropdownConfig', {
  appendToOpenClass: 'uib-dropdown-open',
  openClass: 'open'
})

.service('uibDropdownService', ['$document', '$rootScope', function($document, $rootScope) {
  var openScope = null;

  this.open = function(dropdownScope) {
    if (!openScope) {
      $document.on('click', closeDropdown);
      $document.on('keydown', keybindFilter);
    }

    if (openScope && openScope !== dropdownScope) {
      openScope.isOpen = false;
    }

    openScope = dropdownScope;
  };

  this.close = function(dropdownScope) {
    if (openScope === dropdownScope) {
      openScope = null;
      $document.off('click', closeDropdown);
      $document.off('keydown', keybindFilter);
    }
  };

  var closeDropdown = function(evt) {
    // This method may still be called during the same mouse event that
    // unbound this event handler. So check openScope before proceeding.
    if (!openScope) { return; }

    if (evt && openScope.getAutoClose() === 'disabled') { return; }

    if (evt && evt.which === 3) { return; }

    var toggleElement = openScope.getToggleElement();
    if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
      return;
    }

    var dropdownElement = openScope.getDropdownElement();
    if (evt && openScope.getAutoClose() === 'outsideClick' &&
      dropdownElement && dropdownElement[0].contains(evt.target)) {
      return;
    }

    openScope.isOpen = false;

    if (!$rootScope.$$phase) {
      openScope.$apply();
    }
  };

  var keybindFilter = function(evt) {
    if (evt.which === 27) {
      openScope.focusToggleElement();
      closeDropdown();
    } else if (openScope.isKeynavEnabled() && [38, 40].indexOf(evt.which) !== -1 && openScope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      openScope.focusDropdownEntry(evt.which);
    }
  };
}])

.controller('UibDropdownController', ['$scope', '$element', '$attrs', '$parse', 'uibDropdownConfig', 'uibDropdownService', '$animate', '$uibPosition', '$document', '$compile', '$templateRequest', function($scope, $element, $attrs, $parse, dropdownConfig, uibDropdownService, $animate, $position, $document, $compile, $templateRequest) {
  var self = this,
    scope = $scope.$new(), // create a child scope so we are not polluting original one
    templateScope,
    appendToOpenClass = dropdownConfig.appendToOpenClass,
    openClass = dropdownConfig.openClass,
    getIsOpen,
    setIsOpen = angular.noop,
    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
    appendToBody = false,
    appendTo = null,
    keynavEnabled = false,
    selectedOption = null,
    body = $document.find('body');

  $element.addClass('dropdown');

  this.init = function() {
    if ($attrs.isOpen) {
      getIsOpen = $parse($attrs.isOpen);
      setIsOpen = getIsOpen.assign;

      $scope.$watch(getIsOpen, function(value) {
        scope.isOpen = !!value;
      });
    }

    if (angular.isDefined($attrs.dropdownAppendTo)) {
      var appendToEl = $parse($attrs.dropdownAppendTo)(scope);
      if (appendToEl) {
        appendTo = angular.element(appendToEl);
      }
    }

    appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
    keynavEnabled = angular.isDefined($attrs.keyboardNav);

    if (appendToBody && !appendTo) {
      appendTo = body;
    }

    if (appendTo && self.dropdownMenu) {
      appendTo.append(self.dropdownMenu);
      $element.on('$destroy', function handleDestroyEvent() {
        self.dropdownMenu.remove();
      });
    }
  };

  this.toggle = function(open) {
    return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return scope.isOpen;
  };

  scope.getToggleElement = function() {
    return self.toggleElement;
  };

  scope.getAutoClose = function() {
    return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
  };

  scope.getElement = function() {
    return $element;
  };

  scope.isKeynavEnabled = function() {
    return keynavEnabled;
  };

  scope.focusDropdownEntry = function(keyCode) {
    var elems = self.dropdownMenu ? //If append to body is used.
      angular.element(self.dropdownMenu).find('a') :
      $element.find('ul').eq(0).find('a');

    switch (keyCode) {
      case 40: {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = 0;
        } else {
          self.selectedOption = self.selectedOption === elems.length - 1 ?
            self.selectedOption :
            self.selectedOption + 1;
        }
        break;
      }
      case 38: {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = elems.length - 1;
        } else {
          self.selectedOption = self.selectedOption === 0 ?
            0 : self.selectedOption - 1;
        }
        break;
      }
    }
    elems[self.selectedOption].focus();
  };

  scope.getDropdownElement = function() {
    return self.dropdownMenu;
  };

  scope.focusToggleElement = function() {
    if (self.toggleElement) {
      self.toggleElement[0].focus();
    }
  };

  scope.$watch('isOpen', function(isOpen, wasOpen) {
    if (appendTo && self.dropdownMenu) {
      var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true),
        css,
        rightalign;

      css = {
        top: pos.top + 'px',
        display: isOpen ? 'block' : 'none'
      };

      rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
      if (!rightalign) {
        css.left = pos.left + 'px';
        css.right = 'auto';
      } else {
        css.left = 'auto';
        css.right = window.innerWidth -
          (pos.left + $element.prop('offsetWidth')) + 'px';
      }

      // Need to adjust our positioning to be relative to the appendTo container
      // if it's not the body element
      if (!appendToBody) {
        var appendOffset = $position.offset(appendTo);

        css.top = pos.top - appendOffset.top + 'px';

        if (!rightalign) {
          css.left = pos.left - appendOffset.left + 'px';
        } else {
          css.right = window.innerWidth -
            (pos.left - appendOffset.left + $element.prop('offsetWidth')) + 'px';
        }
      }

      self.dropdownMenu.css(css);
    }

    var openContainer = appendTo ? appendTo : $element;

    $animate[isOpen ? 'addClass' : 'removeClass'](openContainer, appendTo ? appendToOpenClass : openClass).then(function() {
      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
        toggleInvoker($scope, { open: !!isOpen });
      }
    });

    if (isOpen) {
      if (self.dropdownMenuTemplateUrl) {
        $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
          templateScope = scope.$new();
          $compile(tplContent.trim())(templateScope, function(dropdownElement) {
            var newEl = dropdownElement;
            self.dropdownMenu.replaceWith(newEl);
            self.dropdownMenu = newEl;
          });
        });
      }

      scope.focusToggleElement();
      uibDropdownService.open(scope);
    } else {
      if (self.dropdownMenuTemplateUrl) {
        if (templateScope) {
          templateScope.$destroy();
        }
        var newEl = angular.element('<ul class="dropdown-menu"></ul>');
        self.dropdownMenu.replaceWith(newEl);
        self.dropdownMenu = newEl;
      }

      uibDropdownService.close(scope);
      self.selectedOption = null;
    }

    if (angular.isFunction(setIsOpen)) {
      setIsOpen($scope, isOpen);
    }
  });

  $scope.$on('$locationChangeSuccess', function() {
    if (scope.getAutoClose() !== 'disabled') {
      scope.isOpen = false;
    }
  });
}])

.directive('uibDropdown', function() {
  return {
    controller: 'UibDropdownController',
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init();
    }
  };
})

.directive('uibDropdownMenu', function() {
  return {
    restrict: 'A',
    require: '?^uibDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl || angular.isDefined(attrs.dropdownNested)) {
        return;
      }

      element.addClass('dropdown-menu');

      var tplUrl = attrs.templateUrl;
      if (tplUrl) {
        dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
      }

      if (!dropdownCtrl.dropdownMenu) {
        dropdownCtrl.dropdownMenu = element;
      }
    }
  };
})

.directive('uibDropdownToggle', function() {
  return {
    require: '?^uibDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl) {
        return;
      }

      element.addClass('dropdown-toggle');

      dropdownCtrl.toggleElement = element;

      var toggleDropdown = function(event) {
        event.preventDefault();

        if (!element.hasClass('disabled') && !attrs.disabled) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      };

      element.bind('click', toggleDropdown);

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
        element.attr('aria-expanded', !!isOpen);
      });

      scope.$on('$destroy', function() {
        element.unbind('click', toggleDropdown);
      });
    }
  };
});

angular.module('ui.bootstrap.stackedMap', [])
/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function() {
    return {
      createNew: function() {
        var stack = [];

        return {
          add: function(key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function(key) {
            for (var i = 0; i < stack.length; i++) {
              if (key === stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function() {
            return stack[stack.length - 1];
          },
          remove: function(key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key === stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function() {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function() {
            return stack.length;
          }
        };
      }
    };
  });
angular.module('ui.bootstrap.modal', ['ui.bootstrap.stackedMap'])
/**
 * A helper, internal data structure that stores all references attached to key
 */
  .factory('$$multiMap', function() {
    return {
      createNew: function() {
        var map = {};

        return {
          entries: function() {
            return Object.keys(map).map(function(key) {
              return {
                key: key,
                value: map[key]
              };
            });
          },
          get: function(key) {
            return map[key];
          },
          hasKey: function(key) {
            return !!map[key];
          },
          keys: function() {
            return Object.keys(map);
          },
          put: function(key, value) {
            if (!map[key]) {
              map[key] = [];
            }

            map[key].push(value);
          },
          remove: function(key, value) {
            var values = map[key];

            if (!values) {
              return;
            }

            var idx = values.indexOf(value);

            if (idx !== -1) {
              values.splice(idx, 1);
            }

            if (!values.length) {
              delete map[key];
            }
          }
        };
      }
    };
  })

/**
 * Pluggable resolve mechanism for the modal resolve resolution
 * Supports UI Router's $resolve service
 */
  .provider('$uibResolve', function() {
    var resolve = this;
    this.resolver = null;

    this.setResolver = function(resolver) {
      this.resolver = resolver;
    };

    this.$get = ['$injector', '$q', function($injector, $q) {
      var resolver = resolve.resolver ? $injector.get(resolve.resolver) : null;
      return {
        resolve: function(invocables, locals, parent, self) {
          if (resolver) {
            return resolver.resolve(invocables, locals, parent, self);
          }

          var promises = [];

          angular.forEach(invocables, function(value) {
            if (angular.isFunction(value) || angular.isArray(value)) {
              promises.push($q.resolve($injector.invoke(value)));
            } else if (angular.isString(value)) {
              promises.push($q.resolve($injector.get(value)));
            } else {
              promises.push($q.resolve(value));
            }
          });

          return $q.all(promises).then(function(resolves) {
            var resolveObj = {};
            var resolveIter = 0;
            angular.forEach(invocables, function(value, key) {
              resolveObj[key] = resolves[resolveIter++];
            });

            return resolveObj;
          });
        }
      };
    }];
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('uibModalBackdrop', ['$animateCss', '$injector', '$uibModalStack',
  function($animateCss, $injector, $modalStack) {
    return {
      replace: true,
      templateUrl: 'uib/template/modal/backdrop.html',
      compile: function(tElement, tAttrs) {
        tElement.addClass(tAttrs.backdropClass);
        return linkFn;
      }
    };

    function linkFn(scope, element, attrs) {
      if (attrs.modalInClass) {
        $animateCss(element, {
          addClass: attrs.modalInClass
        }).start();

        scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
          var done = setIsAsync();
          if (scope.modalOptions.animation) {
            $animateCss(element, {
              removeClass: attrs.modalInClass
            }).start().then(done);
          } else {
            done();
          }
        });
      }
    }
  }])

  .directive('uibModalWindow', ['$uibModalStack', '$q', '$animate', '$animateCss', '$document',
  function($modalStack, $q, $animate, $animateCss, $document) {
    return {
      scope: {
        index: '@'
      },
      replace: true,
      transclude: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || 'uib/template/modal/window.html';
      },
      link: function(scope, element, attrs) {
        element.addClass(attrs.windowClass || '');
        element.addClass(attrs.windowTopClass || '');
        scope.size = attrs.size;

        scope.close = function(evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop &&
            modal.value.backdrop !== 'static' &&
            evt.target === evt.currentTarget) {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };

        // moved from template to fix issue #2280
        element.on('click', scope.close);

        // This property is only added to the scope for the purpose of detecting when this directive is rendered.
        // We can detect that by using this property in the template associated with this directive and then use
        // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
        scope.$isRendered = true;

        // Deferred object that will be resolved when this modal is render.
        var modalRenderDeferObj = $q.defer();
        // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
        // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
        attrs.$observe('modalRender', function(value) {
          if (value === 'true') {
            modalRenderDeferObj.resolve();
          }
        });

        modalRenderDeferObj.promise.then(function() {
          var animationPromise = null;

          if (attrs.modalInClass) {
            animationPromise = $animateCss(element, {
              addClass: attrs.modalInClass
            }).start();

            scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
              var done = setIsAsync();
              if ($animateCss) {
                $animateCss(element, {
                  removeClass: attrs.modalInClass
                }).start().then(done);
              } else {
                $animate.removeClass(element, attrs.modalInClass).then(done);
              }
            });
          }


          $q.when(animationPromise).then(function() {
            /**
             * If something within the freshly-opened modal already has focus (perhaps via a
             * directive that causes focus). then no need to try and focus anything.
             */
            if (!($document[0].activeElement && element[0].contains($document[0].activeElement))) {
              var inputWithAutofocus = element[0].querySelector('[autofocus]');
              /**
               * Auto-focusing of a freshly-opened modal element causes any child elements
               * with the autofocus attribute to lose focus. This is an issue on touch
               * based devices which will show and then hide the onscreen keyboard.
               * Attempts to refocus the autofocus element via JavaScript will not reopen
               * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
               * the modal element if the modal does not contain an autofocus element.
               */
              if (inputWithAutofocus) {
                inputWithAutofocus.focus();
              } else {
                element[0].focus();
              }
            }
          });

          // Notify {@link $modalStack} that modal is rendered.
          var modal = $modalStack.getTop();
          if (modal) {
            $modalStack.modalRendered(modal.key);
          }
        });
      }
    };
  }])

  .directive('uibModalAnimationClass', function() {
    return {
      compile: function(tElement, tAttrs) {
        if (tAttrs.modalAnimation) {
          tElement.addClass(tAttrs.uibModalAnimationClass);
        }
      }
    };
  })

  .directive('uibModalTransclude', function() {
    return {
      link: function(scope, element, attrs, controller, transclude) {
        transclude(scope.$parent, function(clone) {
          element.empty();
          element.append(clone);
        });
      }
    };
  })

  .factory('$uibModalStack', ['$animate', '$animateCss', '$document',
    '$compile', '$rootScope', '$q', '$$multiMap', '$$stackedMap',
    function($animate, $animateCss, $document, $compile, $rootScope, $q, $$multiMap, $$stackedMap) {
      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var openedClasses = $$multiMap.createNew();
      var $modalStack = {
        NOW_CLOSING_EVENT: 'modal.stack.now-closing'
      };

      //Modal focus behavior
      var focusableElementList;
      var focusIndex = 0;
      var tababbleSelector = 'a[href], area[href], input:not([disabled]), ' +
        'button:not([disabled]),select:not([disabled]), textarea:not([disabled]), ' +
        'iframe, object, embed, *[tabindex], *[contenteditable=true]';

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance, elementToReceiveFocus) {
        var modalWindow = openedWindows.get(modalInstance).value;
        var appendToElement = modalWindow.appendTo;

        //clean up the stack
        openedWindows.remove(modalInstance);

        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
          var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
          openedClasses.remove(modalBodyClass, modalInstance);
          appendToElement.toggleClass(modalBodyClass, openedClasses.hasKey(modalBodyClass));
          toggleTopWindowClass(true);
        }, modalWindow.closedDeferred);
        checkRemoveBackdrop();

        //move focus to specified element if available, or else to body
        if (elementToReceiveFocus && elementToReceiveFocus.focus) {
          elementToReceiveFocus.focus();
        } else if (appendToElement.focus) {
          appendToElement.focus();
        }
      }

      // Add or remove "windowTopClass" from the top window in the stack
      function toggleTopWindowClass(toggleSwitch) {
        var modalWindow;

        if (openedWindows.length() > 0) {
          modalWindow = openedWindows.top().value;
          modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
        }
      }

      function checkRemoveBackdrop() {
        //remove backdrop if no longer needed
        if (backdropDomEl && backdropIndex() === -1) {
          var backdropScopeRef = backdropScope;
          removeAfterAnimate(backdropDomEl, backdropScope, function() {
            backdropScopeRef = null;
          });
          backdropDomEl = undefined;
          backdropScope = undefined;
        }
      }

      function removeAfterAnimate(domEl, scope, done, closedDeferred) {
        var asyncDeferred;
        var asyncPromise = null;
        var setIsAsync = function() {
          if (!asyncDeferred) {
            asyncDeferred = $q.defer();
            asyncPromise = asyncDeferred.promise;
          }

          return function asyncDone() {
            asyncDeferred.resolve();
          };
        };
        scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

        // Note that it's intentional that asyncPromise might be null.
        // That's when setIsAsync has not been called during the
        // NOW_CLOSING_EVENT broadcast.
        return $q.when(asyncPromise).then(afterAnimating);

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          $animateCss(domEl, {
            event: 'leave'
          }).start().then(function() {
            domEl.remove();
            if (closedDeferred) {
              closedDeferred.resolve();
            }
          });

          scope.$destroy();
          if (done) {
            done();
          }
        }
      }

      $document.on('keydown', keydownListener);

      $rootScope.$on('$destroy', function() {
        $document.off('keydown', keydownListener);
      });

      function keydownListener(evt) {
        if (evt.isDefaultPrevented()) {
          return evt;
        }

        var modal = openedWindows.top();
        if (modal) {
          switch (evt.which) {
            case 27: {
              if (modal.value.keyboard) {
                evt.preventDefault();
                $rootScope.$apply(function() {
                  $modalStack.dismiss(modal.key, 'escape key press');
                });
              }
              break;
            }
            case 9: {
              $modalStack.loadFocusElementList(modal);
              var focusChanged = false;
              if (evt.shiftKey) {
                if ($modalStack.isFocusInFirstItem(evt) || $modalStack.isModalFocused(evt, modal)) {
                  focusChanged = $modalStack.focusLastFocusableElement();
                }
              } else {
                if ($modalStack.isFocusInLastItem(evt)) {
                  focusChanged = $modalStack.focusFirstFocusableElement();
                }
              }

              if (focusChanged) {
                evt.preventDefault();
                evt.stopPropagation();
              }
              break;
            }
          }
        }
      }

      $modalStack.open = function(modalInstance, modal) {
        var modalOpener = $document[0].activeElement,
          modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

        toggleTopWindowClass(false);

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          renderDeferred: modal.renderDeferred,
          closedDeferred: modal.closedDeferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard,
          openedClass: modal.openedClass,
          windowTopClass: modal.windowTopClass,
          animation: modal.animation,
          appendTo: modal.appendTo
        });

        openedClasses.put(modalBodyClass, modalInstance);

        var appendToElement = modal.appendTo,
            currBackdropIndex = backdropIndex();

        if (!appendToElement.length) {
          throw new Error('appendTo element not found. Make sure that the element passed is in DOM.');
        }

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.modalOptions = modal;
          backdropScope.index = currBackdropIndex;
          backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
          backdropDomEl.attr('backdrop-class', modal.backdropClass);
          if (modal.animation) {
            backdropDomEl.attr('modal-animation', 'true');
          }
          $compile(backdropDomEl)(backdropScope);
          $animate.enter(backdropDomEl, appendToElement);
        }

        var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
        angularDomEl.attr({
          'template-url': modal.windowTemplateUrl,
          'window-class': modal.windowClass,
          'window-top-class': modal.windowTopClass,
          'size': modal.size,
          'index': openedWindows.length() - 1,
          'animate': 'animate'
        }).html(modal.content);
        if (modal.animation) {
          angularDomEl.attr('modal-animation', 'true');
        }

        $animate.enter($compile(angularDomEl)(modal.scope), appendToElement)
          .then(function() {
            $animate.addClass(appendToElement, modalBodyClass);
          });

        openedWindows.top().value.modalDomEl = angularDomEl;
        openedWindows.top().value.modalOpener = modalOpener;

        $modalStack.clearFocusListCache();
      };

      function broadcastClosing(modalWindow, resultOrReason, closing) {
        return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
      }

      $modalStack.close = function(modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, result, true)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismiss = function(modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismissAll = function(reason) {
        var topModal = this.getTop();
        while (topModal && this.dismiss(topModal.key, reason)) {
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function() {
        return openedWindows.top();
      };

      $modalStack.modalRendered = function(modalInstance) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.renderDeferred.resolve();
        }
      };

      $modalStack.focusFirstFocusableElement = function() {
        if (focusableElementList.length > 0) {
          focusableElementList[0].focus();
          return true;
        }
        return false;
      };
      $modalStack.focusLastFocusableElement = function() {
        if (focusableElementList.length > 0) {
          focusableElementList[focusableElementList.length - 1].focus();
          return true;
        }
        return false;
      };

      $modalStack.isModalFocused = function(evt, modalWindow) {
        if (evt && modalWindow) {
          var modalDomEl = modalWindow.value.modalDomEl;
          if (modalDomEl && modalDomEl.length) {
            return (evt.target || evt.srcElement) === modalDomEl[0];
          }
        }
        return false;
      };

      $modalStack.isFocusInFirstItem = function(evt) {
        if (focusableElementList.length > 0) {
          return (evt.target || evt.srcElement) === focusableElementList[0];
        }
        return false;
      };

      $modalStack.isFocusInLastItem = function(evt) {
        if (focusableElementList.length > 0) {
          return (evt.target || evt.srcElement) === focusableElementList[focusableElementList.length - 1];
        }
        return false;
      };

      $modalStack.clearFocusListCache = function() {
        focusableElementList = [];
        focusIndex = 0;
      };

      $modalStack.loadFocusElementList = function(modalWindow) {
        if (focusableElementList === undefined || !focusableElementList.length) {
          if (modalWindow) {
            var modalDomE1 = modalWindow.value.modalDomEl;
            if (modalDomE1 && modalDomE1.length) {
              focusableElementList = modalDomE1[0].querySelectorAll(tababbleSelector);
            }
          }
        }
      };

      return $modalStack;
    }])

  .provider('$uibModal', function() {
    var $modalProvider = {
      options: {
        animation: true,
        backdrop: true, //can also be false or 'static'
        keyboard: true
      },
      $get: ['$rootScope', '$q', '$document', '$templateRequest', '$controller', '$uibResolve', '$uibModalStack',
        function ($rootScope, $q, $document, $templateRequest, $controller, $uibResolve, $modalStack) {
          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $templateRequest(angular.isFunction(options.templateUrl) ?
                options.templateUrl() : options.templateUrl);
          }

          var promiseChain = null;
          $modal.getPromiseChain = function() {
            return promiseChain;
          };

          $modal.open = function(modalOptions) {
            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();
            var modalClosedDeferred = $q.defer();
            var modalRenderDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              closed: modalClosedDeferred.promise,
              rendered: modalRenderDeferred.promise,
              close: function (result) {
                return $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                return $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};
            modalOptions.appendTo = modalOptions.appendTo || $document.find('body').eq(0);

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions), $uibResolve.resolve(modalOptions.resolve, {}, null, null)]);

            function resolveWithTemplate() {
              return templateAndResolvePromise;
            }

            // Wait for the resolution of the existing promise chain.
            // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
            // Then add to $modalStack and resolve opened.
            // Finally clean up the chain variable if no subsequent modal has overwritten it.
            var samePromise;
            samePromise = promiseChain = $q.all([promiseChain])
              .then(resolveWithTemplate, resolveWithTemplate)
              .then(function resolveSuccess(tplAndVars) {
                var providedScope = modalOptions.scope || $rootScope;

                var modalScope = providedScope.$new();
                modalScope.$close = modalInstance.close;
                modalScope.$dismiss = modalInstance.dismiss;

                modalScope.$on('$destroy', function() {
                  if (!modalScope.$$uibDestructionScheduled) {
                    modalScope.$dismiss('$uibUnscheduledDestruction');
                  }
                });

                var ctrlInstance, ctrlLocals = {};

                //controllers
                if (modalOptions.controller) {
                  ctrlLocals.$scope = modalScope;
                  ctrlLocals.$uibModalInstance = modalInstance;
                  angular.forEach(tplAndVars[1], function(value, key) {
                    ctrlLocals[key] = value;
                  });

                  ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                  if (modalOptions.controllerAs) {
                    if (modalOptions.bindToController) {
                      ctrlInstance.$close = modalScope.$close;
                      ctrlInstance.$dismiss = modalScope.$dismiss;
                      angular.extend(ctrlInstance, providedScope);
                    }

                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                  }
                }

                $modalStack.open(modalInstance, {
                  scope: modalScope,
                  deferred: modalResultDeferred,
                  renderDeferred: modalRenderDeferred,
                  closedDeferred: modalClosedDeferred,
                  content: tplAndVars[0],
                  animation: modalOptions.animation,
                  backdrop: modalOptions.backdrop,
                  keyboard: modalOptions.keyboard,
                  backdropClass: modalOptions.backdropClass,
                  windowTopClass: modalOptions.windowTopClass,
                  windowClass: modalOptions.windowClass,
                  windowTemplateUrl: modalOptions.windowTemplateUrl,
                  size: modalOptions.size,
                  openedClass: modalOptions.openedClass,
                  appendTo: modalOptions.appendTo
                });
                modalOpenedDeferred.resolve(true);

            }, function resolveError(reason) {
              modalOpenedDeferred.reject(reason);
              modalResultDeferred.reject(reason);
            })['finally'](function() {
              if (promiseChain === samePromise) {
                promiseChain = null;
              }
            });

            return modalInstance;
          };

          return $modal;
        }
      ]
    };

    return $modalProvider;
  });

angular.module('ui.bootstrap.paging', [])
/**
 * Helper internal service for generating common controller code between the
 * pager and pagination components
 */
.factory('uibPaging', ['$parse', function($parse) {
  return {
    create: function(ctrl, $scope, $attrs) {
      ctrl.setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
      ctrl.ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl
      ctrl._watchers = [];

      ctrl.init = function(ngModelCtrl, config) {
        ctrl.ngModelCtrl = ngModelCtrl;
        ctrl.config = config;

        ngModelCtrl.$render = function() {
          ctrl.render();
        };

        if ($attrs.itemsPerPage) {
          ctrl._watchers.push($scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
            ctrl.itemsPerPage = parseInt(value, 10);
            $scope.totalPages = ctrl.calculateTotalPages();
            ctrl.updatePage();
          }));
        } else {
          ctrl.itemsPerPage = config.itemsPerPage;
        }

        $scope.$watch('totalItems', function(newTotal, oldTotal) {
          if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
            $scope.totalPages = ctrl.calculateTotalPages();
            ctrl.updatePage();
          }
        });
      };

      ctrl.calculateTotalPages = function() {
        var totalPages = ctrl.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / ctrl.itemsPerPage);
        return Math.max(totalPages || 0, 1);
      };

      ctrl.render = function() {
        $scope.page = parseInt(ctrl.ngModelCtrl.$viewValue, 10) || 1;
      };

      $scope.selectPage = function(page, evt) {
        if (evt) {
          evt.preventDefault();
        }

        var clickAllowed = !$scope.ngDisabled || !evt;
        if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
          if (evt && evt.target) {
            evt.target.blur();
          }
          ctrl.ngModelCtrl.$setViewValue(page);
          ctrl.ngModelCtrl.$render();
        }
      };

      $scope.getText = function(key) {
        return $scope[key + 'Text'] || ctrl.config[key + 'Text'];
      };

      $scope.noPrevious = function() {
        return $scope.page === 1;
      };

      $scope.noNext = function() {
        return $scope.page === $scope.totalPages;
      };

      ctrl.updatePage = function() {
        ctrl.setNumPages($scope.$parent, $scope.totalPages); // Readonly variable

        if ($scope.page > $scope.totalPages) {
          $scope.selectPage($scope.totalPages);
        } else {
          ctrl.ngModelCtrl.$render();
        }
      };

      $scope.$on('$destroy', function() {
        while (ctrl._watchers.length) {
          ctrl._watchers.shift()();
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.pager', ['ui.bootstrap.paging'])

.controller('UibPagerController', ['$scope', '$attrs', 'uibPaging', 'uibPagerConfig', function($scope, $attrs, uibPaging, uibPagerConfig) {
  $scope.align = angular.isDefined($attrs.align) ? $scope.$parent.$eval($attrs.align) : uibPagerConfig.align;

  uibPaging.create(this, $scope, $attrs);
}])

.constant('uibPagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('uibPager', ['uibPagerConfig', function(uibPagerConfig) {
  return {
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@',
      ngDisabled: '='
    },
    require: ['uibPager', '?ngModel'],
    controller: 'UibPagerController',
    controllerAs: 'pager',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/pager/pager.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
        return; // do nothing if no ng-model
      }

      paginationCtrl.init(ngModelCtrl, uibPagerConfig);
    }
  };
}]);

angular.module('ui.bootstrap.pagination', ['ui.bootstrap.paging'])
.controller('UibPaginationController', ['$scope', '$attrs', '$parse', 'uibPaging', 'uibPaginationConfig', function($scope, $attrs, $parse, uibPaging, uibPaginationConfig) {
  var ctrl = this;
  // Setup configuration parameters
  var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : uibPaginationConfig.maxSize,
    rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : uibPaginationConfig.rotate,
    forceEllipses = angular.isDefined($attrs.forceEllipses) ? $scope.$parent.$eval($attrs.forceEllipses) : uibPaginationConfig.forceEllipses,
    boundaryLinkNumbers = angular.isDefined($attrs.boundaryLinkNumbers) ? $scope.$parent.$eval($attrs.boundaryLinkNumbers) : uibPaginationConfig.boundaryLinkNumbers;
  $scope.boundaryLinks = angular.isDefined($attrs.boundaryLinks) ? $scope.$parent.$eval($attrs.boundaryLinks) : uibPaginationConfig.boundaryLinks;
  $scope.directionLinks = angular.isDefined($attrs.directionLinks) ? $scope.$parent.$eval($attrs.directionLinks) : uibPaginationConfig.directionLinks;

  uibPaging.create(this, $scope, $attrs);

  if ($attrs.maxSize) {
    ctrl._watchers.push($scope.$parent.$watch($parse($attrs.maxSize), function(value) {
      maxSize = parseInt(value, 10);
      ctrl.render();
    }));
  }

  // Create page object used in template
  function makePage(number, text, isActive) {
    return {
      number: number,
      text: text,
      active: isActive
    };
  }

  function getPages(currentPage, totalPages) {
    var pages = [];

    // Default page limits
    var startPage = 1, endPage = totalPages;
    var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
        endPage = startPage + maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + maxSize - 1, totalPages);
      }
    }

    // Add page number links
    for (var number = startPage; number <= endPage; number++) {
      var page = makePage(number, number, number === currentPage);
      pages.push(page);
    }

    // Add links to move between page sets
    if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
      if (startPage > 1) {
        if (!boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
        var previousPageSet = makePage(startPage - 1, '...', false);
        pages.unshift(previousPageSet);
      }
        if (boundaryLinkNumbers) {
          if (startPage === 3) { //need to replace ellipsis when the buttons would be sequential
            var secondPageLink = makePage(2, '2', false);
            pages.unshift(secondPageLink);
          }
          //add the first page
          var firstPageLink = makePage(1, '1', false);
          pages.unshift(firstPageLink);
        }
      }

      if (endPage < totalPages) {
        if (!boundaryLinkNumbers || endPage < totalPages - 2) { //need ellipsis for all options unless range is too close to end
        var nextPageSet = makePage(endPage + 1, '...', false);
        pages.push(nextPageSet);
      }
        if (boundaryLinkNumbers) {
          if (endPage === totalPages - 2) { //need to replace ellipsis when the buttons would be sequential
            var secondToLastPageLink = makePage(totalPages - 1, totalPages - 1, false);
            pages.push(secondToLastPageLink);
          }
          //add the last page
          var lastPageLink = makePage(totalPages, totalPages, false);
          pages.push(lastPageLink);
        }
      }
    }
    return pages;
  }

  var originalRender = this.render;
  this.render = function() {
    originalRender();
    if ($scope.page > 0 && $scope.page <= $scope.totalPages) {
      $scope.pages = getPages($scope.page, $scope.totalPages);
    }
  };
}])

.constant('uibPaginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  boundaryLinkNumbers: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true,
  forceEllipses: false
})

.directive('uibPagination', ['$parse', 'uibPaginationConfig', function($parse, uibPaginationConfig) {
  return {
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      ngDisabled:'='
    },
    require: ['uibPagination', '?ngModel'],
    controller: 'UibPaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/pagination/pagination.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      paginationCtrl.init(ngModelCtrl, uibPaginationConfig);
    }
  };
}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position', 'ui.bootstrap.stackedMap'])

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider('$uibTooltip', function() {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    placementClassPrefix: '',
    animation: true,
    popupDelay: 0,
    popupCloseDelay: 0,
    useContentExp: false
  };

  // Default hide triggers for each show trigger
  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'outsideClick': 'outsideClick',
    'focus': 'blur',
    'none': ''
  };

  // The options specified to the provider globally.
  var globalOptions = {};

  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
	this.options = function(value) {
		angular.extend(globalOptions, value);
	};

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
   */
  this.setTriggers = function setTriggers(triggers) {
    angular.extend(triggerMap, triggers);
  };

  /**
   * This is a helper function for translating camel-case to snake_case.
   */
  function snake_case(name) {
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = ['$window', '$compile', '$timeout', '$document', '$uibPosition', '$interpolate', '$rootScope', '$parse', '$$stackedMap', function($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $$stackedMap) {
    var openedTooltips = $$stackedMap.createNew();
    $document.on('keypress', keypressListener);

    $rootScope.$on('$destroy', function() {
      $document.off('keypress', keypressListener);
    });

    function keypressListener(e) {
      if (e.which === 27) {
        var last = openedTooltips.top();
        if (last) {
          last.value.close();
          openedTooltips.removeTop();
          last = null;
        }
      }
    }

    return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
      options = angular.extend({}, defaultOptions, globalOptions, options);

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers(trigger) {
        var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
        var hide = show.map(function(trigger) {
          return triggerMap[trigger] || trigger;
        });
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snake_case(ttType);

      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template =
        '<div '+ directiveName + '-popup '+
          'title="' + startSym + 'title' + endSym + '" '+
          (options.useContentExp ?
            'content-exp="contentExp()" ' :
            'content="' + startSym + 'content' + endSym + '" ') +
          'placement="' + startSym + 'placement' + endSym + '" '+
          'popup-class="' + startSym + 'popupClass' + endSym + '" '+
          'animation="animation" ' +
          'is-open="isOpen"' +
          'origin-scope="origScope" ' +
          'style="visibility: hidden; display: block; top: -9999px; left: -9999px;"' +
          '>' +
        '</div>';

      return {
        compile: function(tElem, tAttrs) {
          var tooltipLinker = $compile(template);

          return function link(scope, element, attrs, tooltipCtrl) {
            var tooltip;
            var tooltipLinkedScope;
            var transitionTimeout;
            var showTimeout;
            var hideTimeout;
            var positionTimeout;
            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
            var triggers = getTriggers(undefined);
            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
            var ttScope = scope.$new(true);
            var repositionScheduled = false;
            var isOpenParse = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
            var contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
            var observers = [];

            var positionTooltip = function() {
              // check if tooltip exists and is not empty
              if (!tooltip || !tooltip.html()) { return; }

              if (!positionTimeout) {
                positionTimeout = $timeout(function() {
                  // Reset the positioning.
                  tooltip.css({ top: 0, left: 0 });

                  // Now set the calculated positioning.
                  var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                  tooltip.css({ top: ttPosition.top + 'px', left: ttPosition.left + 'px', visibility: 'visible' });

                  // If the placement class is prefixed, still need
                  // to remove the TWBS standard class.
                  if (options.placementClassPrefix) {
                    tooltip.removeClass('top bottom left right');
                  }

                  tooltip.removeClass(
                    options.placementClassPrefix + 'top ' +
                    options.placementClassPrefix + 'top-left ' +
                    options.placementClassPrefix + 'top-right ' +
                    options.placementClassPrefix + 'bottom ' +
                    options.placementClassPrefix + 'bottom-left ' +
                    options.placementClassPrefix + 'bottom-right ' +
                    options.placementClassPrefix + 'left ' +
                    options.placementClassPrefix + 'left-top ' +
                    options.placementClassPrefix + 'left-bottom ' +
                    options.placementClassPrefix + 'right ' +
                    options.placementClassPrefix + 'right-top ' +
                    options.placementClassPrefix + 'right-bottom');

                  var placement = ttPosition.placement.split('-');
                  tooltip.addClass(placement[0] + ' ' + options.placementClassPrefix + ttPosition.placement);
                  $position.positionArrow(tooltip, ttPosition.placement);

                  positionTimeout = null;
                }, 0, false);
              }
            };

            // Set up the correct scope to allow transclusion later
            ttScope.origScope = scope;

            // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened
            ttScope.isOpen = false;
            openedTooltips.add(ttScope, {
              close: hide
            });

            function toggleTooltipBind() {
              if (!ttScope.isOpen) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind() {
              if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                return;
              }

              cancelHide();
              prepareTooltip();

              if (ttScope.popupDelay) {
                // Do nothing if the tooltip was already scheduled to pop-up.
                // This happens if show is triggered multiple times before any hide is triggered.
                if (!showTimeout) {
                  showTimeout = $timeout(show, ttScope.popupDelay, false);
                }
              } else {
                show();
              }
            }

            function hideTooltipBind() {
              cancelShow();

              if (ttScope.popupCloseDelay) {
                if (!hideTimeout) {
                  hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
                }
              } else {
                hide();
              }
            }

            // Show the tooltip popup element.
            function show() {
              cancelShow();
              cancelHide();

              // Don't show empty tooltips.
              if (!ttScope.content) {
                return angular.noop;
              }

              createTooltip();

              // And show the tooltip.
              ttScope.$evalAsync(function() {
                ttScope.isOpen = true;
                assignIsOpen(true);
                positionTooltip();
              });
            }

            function cancelShow() {
              if (showTimeout) {
                $timeout.cancel(showTimeout);
                showTimeout = null;
              }

              if (positionTimeout) {
                $timeout.cancel(positionTimeout);
                positionTimeout = null;
              }
            }

            // Hide the tooltip popup element.
            function hide() {
              if (!ttScope) {
                return;
              }

              // First things first: we don't show it anymore.
              ttScope.$evalAsync(function() {
                if (ttScope) {
                  ttScope.isOpen = false;
                  assignIsOpen(false);
                  // And now we remove it from the DOM. However, if we have animation, we
                  // need to wait for it to expire beforehand.
                  // FIXME: this is a placeholder for a port of the transitions library.
                  // The fade transition in TWBS is 150ms.
                  if (ttScope.animation) {
                    if (!transitionTimeout) {
                      transitionTimeout = $timeout(removeTooltip, 150, false);
                    }
                  } else {
                    removeTooltip();
                  }
                }
              });
            }

            function cancelHide() {
              if (hideTimeout) {
                $timeout.cancel(hideTimeout);
                hideTimeout = null;
              }

              if (transitionTimeout) {
                $timeout.cancel(transitionTimeout);
                transitionTimeout = null;
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                return;
              }

              tooltipLinkedScope = ttScope.$new();
              tooltip = tooltipLinker(tooltipLinkedScope, function(tooltip) {
                if (appendToBody) {
                  $document.find('body').append(tooltip);
                } else {
                  element.after(tooltip);
                }
              });

              prepObservers();
            }

            function removeTooltip() {
              cancelShow();
              cancelHide();
              unregisterObservers();

              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }
              if (tooltipLinkedScope) {
                tooltipLinkedScope.$destroy();
                tooltipLinkedScope = null;
              }
            }

            /**
             * Set the initial scope values. Once
             * the tooltip is created, the observers
             * will be added to keep things in sync.
             */
            function prepareTooltip() {
              ttScope.title = attrs[prefix + 'Title'];
              if (contentParse) {
                ttScope.content = contentParse(scope);
              } else {
                ttScope.content = attrs[ttType];
              }

              ttScope.popupClass = attrs[prefix + 'Class'];
              ttScope.placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;

              var delay = parseInt(attrs[prefix + 'PopupDelay'], 10);
              var closeDelay = parseInt(attrs[prefix + 'PopupCloseDelay'], 10);
              ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
              ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
            }

            function assignIsOpen(isOpen) {
              if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
                isOpenParse.assign(scope, isOpen);
              }
            }

            ttScope.contentExp = function() {
              return ttScope.content;
            };

            /**
             * Observe the relevant attributes.
             */
            attrs.$observe('disabled', function(val) {
              if (val) {
                cancelShow();
              }

              if (val && ttScope.isOpen) {
                hide();
              }
            });

            if (isOpenParse) {
              scope.$watch(isOpenParse, function(val) {
                if (ttScope && !val === ttScope.isOpen) {
                  toggleTooltipBind();
                }
              });
            }

            function prepObservers() {
              observers.length = 0;

              if (contentParse) {
                observers.push(
                  scope.$watch(contentParse, function(val) {
                    ttScope.content = val;
                    if (!val && ttScope.isOpen) {
                      hide();
                    }
                  })
                );

                observers.push(
                  tooltipLinkedScope.$watch(function() {
                    if (!repositionScheduled) {
                      repositionScheduled = true;
                      tooltipLinkedScope.$$postDigest(function() {
                        repositionScheduled = false;
                        if (ttScope && ttScope.isOpen) {
                          positionTooltip();
                        }
                      });
                    }
                  })
                );
              } else {
                observers.push(
                  attrs.$observe(ttType, function(val) {
                    ttScope.content = val;
                    if (!val && ttScope.isOpen) {
                      hide();
                    } else {
                      positionTooltip();
                    }
                  })
                );
              }

              observers.push(
                attrs.$observe(prefix + 'Title', function(val) {
                  ttScope.title = val;
                  if (ttScope.isOpen) {
                    positionTooltip();
                  }
                })
              );

              observers.push(
                attrs.$observe(prefix + 'Placement', function(val) {
                  ttScope.placement = val ? val : options.placement;
                  if (ttScope.isOpen) {
                    positionTooltip();
                  }
                })
              );
            }

            function unregisterObservers() {
              if (observers.length) {
                angular.forEach(observers, function(observer) {
                  observer();
                });
                observers.length = 0;
              }
            }

            // hide tooltips/popovers for outsideClick trigger
            function bodyHideTooltipBind(e) {
              if (!ttScope || !ttScope.isOpen || !tooltip) {
                return;
              }
              // make sure the tooltip/popover link or tool tooltip/popover itself were not clicked
              if (!element[0].contains(e.target) && !tooltip[0].contains(e.target)) {
                hideTooltipBind();
              }
            }

            var unregisterTriggers = function() {
              triggers.show.forEach(function(trigger) {
                if (trigger === 'outsideClick') {
                  element.off('click', toggleTooltipBind);
                } else {
                  element.off(trigger, showTooltipBind);
                  element.off(trigger, toggleTooltipBind);
                }
              });
              triggers.hide.forEach(function(trigger) {
                if (trigger === 'outsideClick') {
                  $document.off('click', bodyHideTooltipBind);
                } else {
                  element.off(trigger, hideTooltipBind);
                }
              });
            };

            function prepTriggers() {
              var val = attrs[prefix + 'Trigger'];
              unregisterTriggers();

              triggers = getTriggers(val);

              if (triggers.show !== 'none') {
                triggers.show.forEach(function(trigger, idx) {
                  if (trigger === 'outsideClick') {
                    element.on('click', toggleTooltipBind);
                    $document.on('click', bodyHideTooltipBind);
                  } else if (trigger === triggers.hide[idx]) {
                    element.on(trigger, toggleTooltipBind);
                  } else if (trigger) {
                    element.on(trigger, showTooltipBind);
                    element.on(triggers.hide[idx], hideTooltipBind);
                  }

                  element.on('keypress', function(e) {
                    if (e.which === 27) {
                      hideTooltipBind();
                    }
                  });
                });
              }
            }

            prepTriggers();

            var animation = scope.$eval(attrs[prefix + 'Animation']);
            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

            var appendToBodyVal;
            var appendKey = prefix + 'AppendToBody';
            if (appendKey in attrs && attrs[appendKey] === undefined) {
              appendToBodyVal = true;
            } else {
              appendToBodyVal = scope.$eval(attrs[appendKey]);
            }

            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;
            
            // Make sure tooltip is destroyed and removed.
            scope.$on('$destroy', function onDestroyTooltip() {
              unregisterTriggers();
              removeTooltip();
              openedTooltips.remove(ttScope);
              ttScope = null;
            });
          };
        }
      };
    };
  }];
})

// This is mostly ngInclude code but with a custom scope
.directive('uibTooltipTemplateTransclude', [
         '$animate', '$sce', '$compile', '$templateRequest',
function ($animate, $sce, $compile, $templateRequest) {
  return {
    link: function(scope, elem, attrs) {
      var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

      var changeCounter = 0,
        currentScope,
        previousElement,
        currentElement;

      var cleanupLastIncludeContent = function() {
        if (previousElement) {
          previousElement.remove();
          previousElement = null;
        }

        if (currentScope) {
          currentScope.$destroy();
          currentScope = null;
        }

        if (currentElement) {
          $animate.leave(currentElement).then(function() {
            previousElement = null;
          });
          previousElement = currentElement;
          currentElement = null;
        }
      };

      scope.$watch($sce.parseAsResourceUrl(attrs.uibTooltipTemplateTransclude), function(src) {
        var thisChangeId = ++changeCounter;

        if (src) {
          //set the 2nd param to true to ignore the template request error so that the inner
          //contents and scope can be cleaned up.
          $templateRequest(src, true).then(function(response) {
            if (thisChangeId !== changeCounter) { return; }
            var newScope = origScope.$new();
            var template = response;

            var clone = $compile(template)(newScope, function(clone) {
              cleanupLastIncludeContent();
              $animate.enter(clone, elem);
            });

            currentScope = newScope;
            currentElement = clone;

            currentScope.$emit('$includeContentLoaded', src);
          }, function() {
            if (thisChangeId === changeCounter) {
              cleanupLastIncludeContent();
              scope.$emit('$includeContentError', src);
            }
          });
          scope.$emit('$includeContentRequested', src);
        } else {
          cleanupLastIncludeContent();
        }
      });

      scope.$on('$destroy', cleanupLastIncludeContent);
    }
  };
}])

/**
 * Note that it's intentional that these classes are *not* applied through $animate.
 * They must not be animated as they're expected to be present on the tooltip on
 * initialization.
 */
.directive('uibTooltipClasses', ['$uibPosition', function($uibPosition) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // need to set the primary position so the
      // arrow has space during position measure.
      // tooltip.positionTooltip()
      if (scope.placement) {
        // // There are no top-left etc... classes
        // // in TWBS, so we need the primary position.
        var position = $uibPosition.parsePlacement(scope.placement);
        element.addClass(position[0]);
      } else {
        element.addClass('top');
      }

      if (scope.popupClass) {
        element.addClass(scope.popupClass);
      }

      if (scope.animation()) {
        element.addClass(attrs.tooltipAnimationClass);
      }
    }
  };
}])

.directive('uibTooltipPopup', function() {
  return {
    replace: true,
    scope: { content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'uib/template/tooltip/tooltip-popup.html'
  };
})

.directive('uibTooltip', [ '$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibTooltip', 'tooltip', 'mouseenter');
}])

.directive('uibTooltipTemplatePopup', function() {
  return {
    replace: true,
    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
      originScope: '&' },
    templateUrl: 'uib/template/tooltip/tooltip-template-popup.html'
  };
})

.directive('uibTooltipTemplate', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibTooltipTemplate', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}])

.directive('uibTooltipHtmlPopup', function() {
  return {
    replace: true,
    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'uib/template/tooltip/tooltip-html-popup.html'
  };
})

.directive('uibTooltipHtml', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibTooltipHtml', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, and selector delegatation.
 */
angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip'])

.directive('uibPopoverTemplatePopup', function() {
  return {
    replace: true,
    scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
      originScope: '&' },
    templateUrl: 'uib/template/popover/popover-template.html'
  };
})

.directive('uibPopoverTemplate', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibPopoverTemplate', 'popover', 'click', {
    useContentExp: true
  });
}])

.directive('uibPopoverHtmlPopup', function() {
  return {
    replace: true,
    scope: { contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'uib/template/popover/popover-html.html'
  };
})

.directive('uibPopoverHtml', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibPopoverHtml', 'popover', 'click', {
    useContentExp: true
  });
}])

.directive('uibPopoverPopup', function() {
  return {
    replace: true,
    scope: { title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'uib/template/popover/popover.html'
  };
})

.directive('uibPopover', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibPopover', 'popover', 'click');
}]);

angular.module('ui.bootstrap.progressbar', [])

.constant('uibProgressConfig', {
  animate: true,
  max: 100
})

.controller('UibProgressController', ['$scope', '$attrs', 'uibProgressConfig', function($scope, $attrs, progressConfig) {
  var self = this,
      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

  this.bars = [];
  $scope.max = angular.isDefined($scope.max) ? $scope.max : progressConfig.max;

  this.addBar = function(bar, element, attrs) {
    if (!animate) {
      element.css({'transition': 'none'});
    }

    this.bars.push(bar);

    bar.max = $scope.max;
    bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

    bar.$watch('value', function(value) {
      bar.recalculatePercentage();
    });

    bar.recalculatePercentage = function() {
      var totalPercentage = self.bars.reduce(function(total, bar) {
        bar.percent = +(100 * bar.value / bar.max).toFixed(2);
        return total + bar.percent;
      }, 0);

      if (totalPercentage > 100) {
        bar.percent -= totalPercentage - 100;
      }
    };

    bar.$on('$destroy', function() {
      element = null;
      self.removeBar(bar);
    });
  };

  this.removeBar = function(bar) {
    this.bars.splice(this.bars.indexOf(bar), 1);
    this.bars.forEach(function (bar) {
      bar.recalculatePercentage();
    });
  };

  $scope.$watch('max', function(max) {
    self.bars.forEach(function(bar) {
      bar.max = $scope.max;
      bar.recalculatePercentage();
    });
  });
}])

.directive('uibProgress', function() {
  return {
    replace: true,
    transclude: true,
    controller: 'UibProgressController',
    require: 'uibProgress',
    scope: {
      max: '=?'
    },
    templateUrl: 'uib/template/progressbar/progress.html'
  };
})

.directive('uibBar', function() {
  return {
    replace: true,
    transclude: true,
    require: '^uibProgress',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'uib/template/progressbar/bar.html',
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, element, attrs);
    }
  };
})

.directive('uibProgressbar', function() {
  return {
    replace: true,
    transclude: true,
    controller: 'UibProgressController',
    scope: {
      value: '=',
      max: '=?',
      type: '@'
    },
    templateUrl: 'uib/template/progressbar/progressbar.html',
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, angular.element(element.children()[0]), {title: attrs.title});
    }
  };
});

angular.module('ui.bootstrap.rating', [])

.constant('uibRatingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null,
  titles : ['one', 'two', 'three', 'four', 'five']
})

.controller('UibRatingController', ['$scope', '$attrs', 'uibRatingConfig', function($scope, $attrs, ratingConfig) {
  var ngModelCtrl = { $setViewValue: angular.noop };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    ngModelCtrl.$formatters.push(function(value) {
      if (angular.isNumber(value) && value << 0 !== value) {
        value = Math.round(value);
      }

      return value;
    });

    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
    var tmpTitles = angular.isDefined($attrs.titles) ? $scope.$parent.$eval($attrs.titles) : ratingConfig.titles ;
    this.titles = angular.isArray(tmpTitles) && tmpTitles.length > 0 ?
      tmpTitles : ratingConfig.titles;

    var ratingStates = angular.isDefined($attrs.ratingStates) ?
      $scope.$parent.$eval($attrs.ratingStates) :
      new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
    $scope.range = this.buildTemplateObjects(ratingStates);
  };

  this.buildTemplateObjects = function(states) {
    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff, title: this.getTitle(i) }, states[i]);
    }
    return states;
  };

  this.getTitle = function(index) {
    if (index >= this.titles.length) {
      return index + 1;
    }

    return this.titles[index];
  };

  $scope.rate = function(value) {
    if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
      ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue === value ? 0 : value);
      ngModelCtrl.$render();
    }
  };

  $scope.enter = function(value) {
    if (!$scope.readonly) {
      $scope.value = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.value = ngModelCtrl.$viewValue;
    $scope.onLeave();
  };

  $scope.onKeydown = function(evt) {
    if (/(37|38|39|40)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
    }
  };

  this.render = function() {
    $scope.value = ngModelCtrl.$viewValue;
  };
}])

.directive('uibRating', function() {
  return {
    require: ['uibRating', 'ngModel'],
    scope: {
      readonly: '=?',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'UibRatingController',
    templateUrl: 'uib/template/rating/rating.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      ratingCtrl.init(ngModelCtrl);
    }
  };
});

angular.module('ui.bootstrap.tabs', [])

.controller('UibTabsetController', ['$scope', function ($scope) {
  var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

  ctrl.select = function(selectedTab) {
    angular.forEach(tabs, function(tab) {
      if (tab.active && tab !== selectedTab) {
        tab.active = false;
        tab.onDeselect();
        selectedTab.selectCalled = false;
      }
    });
    selectedTab.active = true;
    // only call select if it has not already been called
    if (!selectedTab.selectCalled) {
      selectedTab.onSelect();
      selectedTab.selectCalled = true;
    }
  };

  ctrl.addTab = function addTab(tab) {
    tabs.push(tab);
    // we can't run the select function on the first tab
    // since that would select it twice
    if (tabs.length === 1 && tab.active !== false) {
      tab.active = true;
    } else if (tab.active) {
      ctrl.select(tab);
    } else {
      tab.active = false;
    }
  };

  ctrl.removeTab = function removeTab(tab) {
    var index = tabs.indexOf(tab);
    //Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && tabs.length > 1 && !destroyed) {
      //If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };

  var destroyed;
  $scope.$on('$destroy', function() {
    destroyed = true;
  });
}])

.directive('uibTabset', function() {
  return {
    transclude: true,
    replace: true,
    scope: {
      type: '@'
    },
    controller: 'UibTabsetController',
    templateUrl: 'uib/template/tabs/tabset.html',
    link: function(scope, element, attrs) {
      scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
      scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
    }
  };
})

.directive('uibTab', ['$parse', function($parse) {
  return {
    require: '^uibTabset',
    replace: true,
    templateUrl: 'uib/template/tabs/tab.html',
    transclude: true,
    scope: {
      active: '=?',
      heading: '@',
      onSelect: '&select', //This callback is called in contentHeadingTransclude
                          //once it inserts the tab's content into the dom
      onDeselect: '&deselect'
    },
    controller: function() {
      //Empty controller so other directives can require being 'under' a tab
    },
    controllerAs: 'tab',
    link: function(scope, elm, attrs, tabsetCtrl, transclude) {
      scope.$watch('active', function(active) {
        if (active) {
          tabsetCtrl.select(scope);
        }
      });

      scope.disabled = false;
      if (attrs.disable) {
        scope.$parent.$watch($parse(attrs.disable), function(value) {
          scope.disabled = !! value;
        });
      }

      scope.select = function() {
        if (!scope.disabled) {
          scope.active = true;
        }
      };

      tabsetCtrl.addTab(scope);
      scope.$on('$destroy', function() {
        tabsetCtrl.removeTab(scope);
      });

      //We need to transclude later, once the content container is ready.
      //when this link happens, we're inside a tab heading.
      scope.$transcludeFn = transclude;
    }
  };
}])

.directive('uibTabHeadingTransclude', function() {
  return {
    restrict: 'A',
    require: '^uibTab',
    link: function(scope, elm) {
      scope.$watch('headingElement', function updateHeadingElement(heading) {
        if (heading) {
          elm.html('');
          elm.append(heading);
        }
      });
    }
  };
})

.directive('uibTabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^uibTabset',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.uibTabContentTransclude);

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };

  function isTabHeading(node) {
    return node.tagName && (
      node.hasAttribute('uib-tab-heading') ||
      node.hasAttribute('data-uib-tab-heading') ||
      node.hasAttribute('x-uib-tab-heading') ||
      node.tagName.toLowerCase() === 'uib-tab-heading' ||
      node.tagName.toLowerCase() === 'data-uib-tab-heading' ||
      node.tagName.toLowerCase() === 'x-uib-tab-heading'
    );
  }
});

angular.module('ui.bootstrap.timepicker', [])

.constant('uibTimepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  showMeridian: true,
  showSeconds: false,
  meridians: null,
  readonlyInput: false,
  mousewheel: true,
  arrowkeys: true,
  showSpinners: true,
  templateUrl: 'uib/template/timepicker/timepicker.html'
})

.controller('UibTimepickerController', ['$scope', '$element', '$attrs', '$parse', '$log', '$locale', 'uibTimepickerConfig', function($scope, $element, $attrs, $parse, $log, $locale, timepickerConfig) {
  var selected = new Date(),
    watchers = [],
    ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
    meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

  $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
  $element.removeAttr('tabindex');

  this.init = function(ngModelCtrl_, inputs) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    ngModelCtrl.$formatters.unshift(function(modelValue) {
      return modelValue ? new Date(modelValue) : null;
    });

    var hoursInputEl = inputs.eq(0),
        minutesInputEl = inputs.eq(1),
        secondsInputEl = inputs.eq(2);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;

    if (mousewheel) {
      this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
    }

    var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepickerConfig.arrowkeys;
    if (arrowkeys) {
      this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
    this.setupInputEvents(hoursInputEl, minutesInputEl, secondsInputEl);
  };

  var hourStep = timepickerConfig.hourStep;
  if ($attrs.hourStep) {
    watchers.push($scope.$parent.$watch($parse($attrs.hourStep), function(value) {
      hourStep = +value;
    }));
  }

  var minuteStep = timepickerConfig.minuteStep;
  if ($attrs.minuteStep) {
    watchers.push($scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
      minuteStep = +value;
    }));
  }

  var min;
  watchers.push($scope.$parent.$watch($parse($attrs.min), function(value) {
    var dt = new Date(value);
    min = isNaN(dt) ? undefined : dt;
  }));

  var max;
  watchers.push($scope.$parent.$watch($parse($attrs.max), function(value) {
    var dt = new Date(value);
    max = isNaN(dt) ? undefined : dt;
  }));

  var disabled = false;
  if ($attrs.ngDisabled) {
    watchers.push($scope.$parent.$watch($parse($attrs.ngDisabled), function(value) {
      disabled = value;
    }));
  }

  $scope.noIncrementHours = function() {
    var incrementedSelected = addMinutes(selected, hourStep * 60);
    return disabled || incrementedSelected > max ||
      incrementedSelected < selected && incrementedSelected < min;
  };

  $scope.noDecrementHours = function() {
    var decrementedSelected = addMinutes(selected, -hourStep * 60);
    return disabled || decrementedSelected < min ||
      decrementedSelected > selected && decrementedSelected > max;
  };

  $scope.noIncrementMinutes = function() {
    var incrementedSelected = addMinutes(selected, minuteStep);
    return disabled || incrementedSelected > max ||
      incrementedSelected < selected && incrementedSelected < min;
  };

  $scope.noDecrementMinutes = function() {
    var decrementedSelected = addMinutes(selected, -minuteStep);
    return disabled || decrementedSelected < min ||
      decrementedSelected > selected && decrementedSelected > max;
  };

  $scope.noIncrementSeconds = function() {
    var incrementedSelected = addSeconds(selected, secondStep);
    return disabled || incrementedSelected > max ||
      incrementedSelected < selected && incrementedSelected < min;
  };

  $scope.noDecrementSeconds = function() {
    var decrementedSelected = addSeconds(selected, -secondStep);
    return disabled || decrementedSelected < min ||
      decrementedSelected > selected && decrementedSelected > max;
  };

  $scope.noToggleMeridian = function() {
    if (selected.getHours() < 12) {
      return disabled || addMinutes(selected, 12 * 60) > max;
    }

    return disabled || addMinutes(selected, -12 * 60) < min;
  };

  var secondStep = timepickerConfig.secondStep;
  if ($attrs.secondStep) {
    watchers.push($scope.$parent.$watch($parse($attrs.secondStep), function(value) {
      secondStep = +value;
    }));
  }

  $scope.showSeconds = timepickerConfig.showSeconds;
  if ($attrs.showSeconds) {
    watchers.push($scope.$parent.$watch($parse($attrs.showSeconds), function(value) {
      $scope.showSeconds = !!value;
    }));
  }

  // 12H / 24H mode
  $scope.showMeridian = timepickerConfig.showMeridian;
  if ($attrs.showMeridian) {
    watchers.push($scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
      $scope.showMeridian = !!value;

      if (ngModelCtrl.$error.time) {
        // Evaluate from template
        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
        if (angular.isDefined(hours) && angular.isDefined(minutes)) {
          selected.setHours(hours);
          refresh();
        }
      } else {
        updateTemplate();
      }
    }));
  }

  // Get $scope.hours in 24H mode if valid
  function getHoursFromTemplate() {
    var hours = +$scope.hours;
    var valid = $scope.showMeridian ? hours > 0 && hours < 13 :
      hours >= 0 && hours < 24;
    if (!valid) {
      return undefined;
    }

    if ($scope.showMeridian) {
      if (hours === 12) {
        hours = 0;
      }
      if ($scope.meridian === meridians[1]) {
        hours = hours + 12;
      }
    }
    return hours;
  }

  function getMinutesFromTemplate() {
    var minutes = +$scope.minutes;
    return minutes >= 0 && minutes < 60 ? minutes : undefined;
  }

  function getSecondsFromTemplate() {
    var seconds = +$scope.seconds;
    return seconds >= 0 && seconds < 60 ? seconds : undefined;
  }

  function pad(value) {
    if (value === null) {
      return '';
    }

    return angular.isDefined(value) && value.toString().length < 2 ?
      '0' + value : value.toString();
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
      return e.detail || delta > 0;
    };

    hoursInputEl.bind('mousewheel wheel', function(e) {
      if (!disabled) {
        $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours());
      }
      e.preventDefault();
    });

    minutesInputEl.bind('mousewheel wheel', function(e) {
      if (!disabled) {
        $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes());
      }
      e.preventDefault();
    });

     secondsInputEl.bind('mousewheel wheel', function(e) {
      if (!disabled) {
        $scope.$apply(isScrollingUp(e) ? $scope.incrementSeconds() : $scope.decrementSeconds());
      }
      e.preventDefault();
    });
  };

  // Respond on up/down arrowkeys
  this.setupArrowkeyEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
    hoursInputEl.bind('keydown', function(e) {
      if (!disabled) {
        if (e.which === 38) { // up
          e.preventDefault();
          $scope.incrementHours();
          $scope.$apply();
        } else if (e.which === 40) { // down
          e.preventDefault();
          $scope.decrementHours();
          $scope.$apply();
        }
      }
    });

    minutesInputEl.bind('keydown', function(e) {
      if (!disabled) {
        if (e.which === 38) { // up
          e.preventDefault();
          $scope.incrementMinutes();
          $scope.$apply();
        } else if (e.which === 40) { // down
          e.preventDefault();
          $scope.decrementMinutes();
          $scope.$apply();
        }
      }
    });

    secondsInputEl.bind('keydown', function(e) {
      if (!disabled) {
        if (e.which === 38) { // up
          e.preventDefault();
          $scope.incrementSeconds();
          $scope.$apply();
        } else if (e.which === 40) { // down
          e.preventDefault();
          $scope.decrementSeconds();
          $scope.$apply();
        }
      }
    });
  };

  this.setupInputEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
    if ($scope.readonlyInput) {
      $scope.updateHours = angular.noop;
      $scope.updateMinutes = angular.noop;
      $scope.updateSeconds = angular.noop;
      return;
    }

    var invalidate = function(invalidHours, invalidMinutes, invalidSeconds) {
      ngModelCtrl.$setViewValue(null);
      ngModelCtrl.$setValidity('time', false);
      if (angular.isDefined(invalidHours)) {
        $scope.invalidHours = invalidHours;
      }

      if (angular.isDefined(invalidMinutes)) {
        $scope.invalidMinutes = invalidMinutes;
      }

      if (angular.isDefined(invalidSeconds)) {
        $scope.invalidSeconds = invalidSeconds;
      }
    };

    $scope.updateHours = function() {
      var hours = getHoursFromTemplate(),
        minutes = getMinutesFromTemplate();

      ngModelCtrl.$setDirty();

      if (angular.isDefined(hours) && angular.isDefined(minutes)) {
        selected.setHours(hours);
        selected.setMinutes(minutes);
        if (selected < min || selected > max) {
          invalidate(true);
        } else {
          refresh('h');
        }
      } else {
        invalidate(true);
      }
    };

    hoursInputEl.bind('blur', function(e) {
      ngModelCtrl.$setTouched();
      if ($scope.hours === null || $scope.hours === '') {
        invalidate(true);
      } else if (!$scope.invalidHours && $scope.hours < 10) {
        $scope.$apply(function() {
          $scope.hours = pad($scope.hours);
        });
      }
    });

    $scope.updateMinutes = function() {
      var minutes = getMinutesFromTemplate(),
        hours = getHoursFromTemplate();

      ngModelCtrl.$setDirty();

      if (angular.isDefined(minutes) && angular.isDefined(hours)) {
        selected.setHours(hours);
        selected.setMinutes(minutes);
        if (selected < min || selected > max) {
          invalidate(undefined, true);
        } else {
          refresh('m');
        }
      } else {
        invalidate(undefined, true);
      }
    };

    minutesInputEl.bind('blur', function(e) {
      ngModelCtrl.$setTouched();
      if ($scope.minutes === null) {
        invalidate(undefined, true);
      } else if (!$scope.invalidMinutes && $scope.minutes < 10) {
        $scope.$apply(function() {
          $scope.minutes = pad($scope.minutes);
        });
      }
    });

    $scope.updateSeconds = function() {
      var seconds = getSecondsFromTemplate();

      ngModelCtrl.$setDirty();

      if (angular.isDefined(seconds)) {
        selected.setSeconds(seconds);
        refresh('s');
      } else {
        invalidate(undefined, undefined, true);
      }
    };

    secondsInputEl.bind('blur', function(e) {
      if (!$scope.invalidSeconds && $scope.seconds < 10) {
        $scope.$apply( function() {
          $scope.seconds = pad($scope.seconds);
        });
      }
    });

  };

  this.render = function() {
    var date = ngModelCtrl.$viewValue;

    if (isNaN(date)) {
      ngModelCtrl.$setValidity('time', false);
      $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
    } else {
      if (date) {
        selected = date;
      }

      if (selected < min || selected > max) {
        ngModelCtrl.$setValidity('time', false);
        $scope.invalidHours = true;
        $scope.invalidMinutes = true;
      } else {
        makeValid();
      }
      updateTemplate();
    }
  };

  // Call internally when we know that model is valid.
  function refresh(keyboardChange) {
    makeValid();
    ngModelCtrl.$setViewValue(new Date(selected));
    updateTemplate(keyboardChange);
  }

  function makeValid() {
    ngModelCtrl.$setValidity('time', true);
    $scope.invalidHours = false;
    $scope.invalidMinutes = false;
    $scope.invalidSeconds = false;
  }

  function updateTemplate(keyboardChange) {
    if (!ngModelCtrl.$modelValue) {
      $scope.hours = null;
      $scope.minutes = null;
      $scope.seconds = null;
      $scope.meridian = meridians[0];
    } else {
      var hours = selected.getHours(),
        minutes = selected.getMinutes(),
        seconds = selected.getSeconds();

      if ($scope.showMeridian) {
        hours = hours === 0 || hours === 12 ? 12 : hours % 12; // Convert 24 to 12 hour system
      }

      $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
      if (keyboardChange !== 'm') {
        $scope.minutes = pad(minutes);
      }
      $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];

      if (keyboardChange !== 's') {
        $scope.seconds = pad(seconds);
      }
      $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
    }
  }

  function addSecondsToSelected(seconds) {
    selected = addSeconds(selected, seconds);
    refresh();
  }

  function addMinutes(selected, minutes) {
    return addSeconds(selected, minutes*60);
  }

  function addSeconds(date, seconds) {
    var dt = new Date(date.getTime() + seconds * 1000);
    var newDate = new Date(date);
    newDate.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds());
    return newDate;
  }

  $scope.showSpinners = angular.isDefined($attrs.showSpinners) ?
    $scope.$parent.$eval($attrs.showSpinners) : timepickerConfig.showSpinners;

  $scope.incrementHours = function() {
    if (!$scope.noIncrementHours()) {
      addSecondsToSelected(hourStep * 60 * 60);
    }
  };

  $scope.decrementHours = function() {
    if (!$scope.noDecrementHours()) {
      addSecondsToSelected(-hourStep * 60 * 60);
    }
  };

  $scope.incrementMinutes = function() {
    if (!$scope.noIncrementMinutes()) {
      addSecondsToSelected(minuteStep * 60);
    }
  };

  $scope.decrementMinutes = function() {
    if (!$scope.noDecrementMinutes()) {
      addSecondsToSelected(-minuteStep * 60);
    }
  };

  $scope.incrementSeconds = function() {
    if (!$scope.noIncrementSeconds()) {
      addSecondsToSelected(secondStep);
    }
  };

  $scope.decrementSeconds = function() {
    if (!$scope.noDecrementSeconds()) {
      addSecondsToSelected(-secondStep);
    }
  };

  $scope.toggleMeridian = function() {
    var minutes = getMinutesFromTemplate(),
        hours = getHoursFromTemplate();

    if (!$scope.noToggleMeridian()) {
      if (angular.isDefined(minutes) && angular.isDefined(hours)) {
        addSecondsToSelected(12 * 60 * (selected.getHours() < 12 ? 60 : -60));
      } else {
        $scope.meridian = $scope.meridian === meridians[0] ? meridians[1] : meridians[0];
      }
    }
  };

  $scope.blur = function() {
    ngModelCtrl.$setTouched();
  };

  $scope.$on('$destroy', function() {
    while (watchers.length) {
      watchers.shift()();
    }
  });
}])

.directive('uibTimepicker', ['uibTimepickerConfig', function(uibTimepickerConfig) {
  return {
    require: ['uibTimepicker', '?^ngModel'],
    controller: 'UibTimepickerController',
    controllerAs: 'timepicker',
    replace: true,
    scope: {},
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || uibTimepickerConfig.templateUrl;
    },
    link: function(scope, element, attrs, ctrls) {
      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (ngModelCtrl) {
        timepickerCtrl.init(ngModelCtrl, element.find('input'));
      }
    }
  };
}]);

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.debounce', 'ui.bootstrap.position'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('uibTypeaheadParser', ['$parse', function($parse) {
    //                      00000111000000000000022200000000000000003333333333333330000000000044000
    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
      parse: function(input) {
        var match = input.match(TYPEAHEAD_REGEXP);
        if (!match) {
          throw new Error(
            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
              ' but got "' + input + '".');
        }

        return {
          itemName: match[3],
          source: $parse(match[4]),
          viewMapper: $parse(match[2] || match[1]),
          modelMapper: $parse(match[1])
        };
      }
    };
  }])

  .controller('UibTypeaheadController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$$debounce', '$uibPosition', 'uibTypeaheadParser',
    function(originalScope, element, attrs, $compile, $parse, $q, $timeout, $document, $window, $rootScope, $$debounce, $position, typeaheadParser) {
    var HOT_KEYS = [9, 13, 27, 38, 40];
    var eventDebounceTime = 200;
    var modelCtrl, ngModelOptions;
    //SUPPORTED ATTRIBUTES (OPTIONS)

    //minimal no of characters that needs to be entered before typeahead kicks-in
    var minLength = originalScope.$eval(attrs.typeaheadMinLength);
    if (!minLength && minLength !== 0) {
      minLength = 1;
    }

    //minimal wait time after last character typed before typeahead kicks-in
    var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

    //should it restrict model values to the ones selected from the popup only?
    var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;
    originalScope.$watch(attrs.typeaheadEditable, function (newVal) {
      isEditable = newVal !== false;
    });

    //binding to a variable that indicates if matches are being retrieved asynchronously
    var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

    //a callback executed when a match is selected
    var onSelectCallback = $parse(attrs.typeaheadOnSelect);

    //should it select highlighted popup value when losing focus?
    var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

    //binding to a variable that indicates if there were no results after the query is completed
    var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

    var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

    var appendToBody = attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

    var appendTo = attrs.typeaheadAppendTo ?
      originalScope.$eval(attrs.typeaheadAppendTo) : null;

    var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

    //If input matches an item of the list exactly, select it automatically
    var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

    //binding to a variable that indicates if dropdown is open
    var isOpenSetter = $parse(attrs.typeaheadIsOpen).assign || angular.noop;

    var showHint = originalScope.$eval(attrs.typeaheadShowHint) || false;

    //INTERNAL VARIABLES

    //model setter executed upon match selection
    var parsedModel = $parse(attrs.ngModel);
    var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
    var $setModelValue = function(scope, newValue) {
      if (angular.isFunction(parsedModel(originalScope)) &&
        ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
        return invokeModelSetter(scope, {$$$p: newValue});
      }

      return parsedModel.assign(scope, newValue);
    };

    //expressions used by typeahead
    var parserResult = typeaheadParser.parse(attrs.uibTypeahead);

    var hasFocus;

    //Used to avoid bug in iOS webview where iOS keyboard does not fire
    //mousedown & mouseup events
    //Issue #3699
    var selected;

    //create a child scope for the typeahead directive so we are not polluting original scope
    //with typeahead-specific data (matches, query etc.)
    var scope = originalScope.$new();
    var offDestroy = originalScope.$on('$destroy', function() {
      scope.$destroy();
    });
    scope.$on('$destroy', offDestroy);

    // WAI-ARIA
    var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
    element.attr({
      'aria-autocomplete': 'list',
      'aria-expanded': false,
      'aria-owns': popupId
    });

    var inputsContainer, hintInputElem;
    //add read-only input to show hint
    if (showHint) {
      inputsContainer = angular.element('<div></div>');
      inputsContainer.css('position', 'relative');
      element.after(inputsContainer);
      hintInputElem = element.clone();
      hintInputElem.attr('placeholder', '');
      hintInputElem.val('');
      hintInputElem.css({
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'border-color': 'transparent',
        'box-shadow': 'none',
        'opacity': 1,
        'background': 'none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)',
        'color': '#999'
      });
      element.css({
        'position': 'relative',
        'vertical-align': 'top',
        'background-color': 'transparent'
      });
      inputsContainer.append(hintInputElem);
      hintInputElem.after(element);
    }

    //pop-up element used to display matches
    var popUpEl = angular.element('<div uib-typeahead-popup></div>');
    popUpEl.attr({
      id: popupId,
      matches: 'matches',
      active: 'activeIdx',
      select: 'select(activeIdx, evt)',
      'move-in-progress': 'moveInProgress',
      query: 'query',
      position: 'position',
      'assign-is-open': 'assignIsOpen(isOpen)',
      debounce: 'debounceUpdate'
    });
    //custom item template
    if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
      popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
    }

    if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
      popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
    }

    var resetHint = function() {
      if (showHint) {
        hintInputElem.val('');
      }
    };

    var resetMatches = function() {
      scope.matches = [];
      scope.activeIdx = -1;
      element.attr('aria-expanded', false);
      resetHint();
    };

    var getMatchId = function(index) {
      return popupId + '-option-' + index;
    };

    // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
    // This attribute is added or removed automatically when the `activeIdx` changes.
    scope.$watch('activeIdx', function(index) {
      if (index < 0) {
        element.removeAttr('aria-activedescendant');
      } else {
        element.attr('aria-activedescendant', getMatchId(index));
      }
    });

    var inputIsExactMatch = function(inputValue, index) {
      if (scope.matches.length > index && inputValue) {
        return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
      }

      return false;
    };

    var getMatchesAsync = function(inputValue, evt) {
      var locals = {$viewValue: inputValue};
      isLoadingSetter(originalScope, true);
      isNoResultsSetter(originalScope, false);
      $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
        //it might happen that several async queries were in progress if a user were typing fast
        //but we are interested only in responses that correspond to the current view value
        var onCurrentRequest = inputValue === modelCtrl.$viewValue;
        if (onCurrentRequest && hasFocus) {
          if (matches && matches.length > 0) {
            scope.activeIdx = focusFirst ? 0 : -1;
            isNoResultsSetter(originalScope, false);
            scope.matches.length = 0;

            //transform labels
            for (var i = 0; i < matches.length; i++) {
              locals[parserResult.itemName] = matches[i];
              scope.matches.push({
                id: getMatchId(i),
                label: parserResult.viewMapper(scope, locals),
                model: matches[i]
              });
            }

            scope.query = inputValue;
            //position pop-up with matches - we need to re-calculate its position each time we are opening a window
            //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
            //due to other elements being rendered
            recalculatePosition();

            element.attr('aria-expanded', true);

            //Select the single remaining option if user input matches
            if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
              if (angular.isNumber(scope.debounceUpdate) || angular.isObject(scope.debounceUpdate)) {
                $$debounce(function() {
                  scope.select(0, evt);
                }, angular.isNumber(scope.debounceUpdate) ? scope.debounceUpdate : scope.debounceUpdate['default']);
              } else {
                scope.select(0, evt);
              }
            }

            if (showHint) {
              var firstLabel = scope.matches[0].label;
              if (angular.isString(inputValue) &&
                inputValue.length > 0 &&
                firstLabel.slice(0, inputValue.length).toUpperCase() === inputValue.toUpperCase()) {
                hintInputElem.val(inputValue + firstLabel.slice(inputValue.length));
              } else {
                hintInputElem.val('');
              }
            }
          } else {
            resetMatches();
            isNoResultsSetter(originalScope, true);
          }
        }
        if (onCurrentRequest) {
          isLoadingSetter(originalScope, false);
        }
      }, function() {
        resetMatches();
        isLoadingSetter(originalScope, false);
        isNoResultsSetter(originalScope, true);
      });
    };

    // bind events only if appendToBody params exist - performance feature
    if (appendToBody) {
      angular.element($window).on('resize', fireRecalculating);
      $document.find('body').on('scroll', fireRecalculating);
    }

    // Declare the debounced function outside recalculating for
    // proper debouncing
    var debouncedRecalculate = $$debounce(function() {
      // if popup is visible
      if (scope.matches.length) {
        recalculatePosition();
      }

      scope.moveInProgress = false;
    }, eventDebounceTime);

    // Default progress type
    scope.moveInProgress = false;

    function fireRecalculating() {
      if (!scope.moveInProgress) {
        scope.moveInProgress = true;
        scope.$digest();
      }

      debouncedRecalculate();
    }

    // recalculate actual position and set new values to scope
    // after digest loop is popup in right position
    function recalculatePosition() {
      scope.position = appendToBody ? $position.offset(element) : $position.position(element);
      scope.position.top += element.prop('offsetHeight');
    }

    //we need to propagate user's query so we can higlight matches
    scope.query = undefined;

    //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
    var timeoutPromise;

    var scheduleSearchWithTimeout = function(inputValue) {
      timeoutPromise = $timeout(function() {
        getMatchesAsync(inputValue);
      }, waitTime);
    };

    var cancelPreviousTimeout = function() {
      if (timeoutPromise) {
        $timeout.cancel(timeoutPromise);
      }
    };

    resetMatches();

    scope.assignIsOpen = function (isOpen) {
      isOpenSetter(originalScope, isOpen);
    };

    scope.select = function(activeIdx, evt) {
      //called from within the $digest() cycle
      var locals = {};
      var model, item;

      selected = true;
      locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
      model = parserResult.modelMapper(originalScope, locals);
      $setModelValue(originalScope, model);
      modelCtrl.$setValidity('editable', true);
      modelCtrl.$setValidity('parse', true);

      onSelectCallback(originalScope, {
        $item: item,
        $model: model,
        $label: parserResult.viewMapper(originalScope, locals),
        $event: evt
      });

      resetMatches();

      //return focus to the input element if a match was selected via a mouse click event
      // use timeout to avoid $rootScope:inprog error
      if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
        $timeout(function() { element[0].focus(); }, 0, false);
      }
    };

    //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
    element.on('keydown', function(evt) {
      //typeahead is open and an "interesting" key was pressed
      if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
        return;
      }

      // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
      if (scope.activeIdx === -1 && (evt.which === 9 || evt.which === 13)) {
        resetMatches();
        scope.$digest();
        return;
      }

      evt.preventDefault();
      var target;
      switch (evt.which) {
        case 9:
        case 13:
          scope.$apply(function () {
            if (angular.isNumber(scope.debounceUpdate) || angular.isObject(scope.debounceUpdate)) {
              $$debounce(function() {
                scope.select(scope.activeIdx, evt);
              }, angular.isNumber(scope.debounceUpdate) ? scope.debounceUpdate : scope.debounceUpdate['default']);
            } else {
              scope.select(scope.activeIdx, evt);
            }
          });
          break;
        case 27:
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
          break;
        case 38:
          scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();
          target = popUpEl.find('li')[scope.activeIdx];
          target.parentNode.scrollTop = target.offsetTop;
          break;
        case 40:
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();
          target = popUpEl.find('li')[scope.activeIdx];
          target.parentNode.scrollTop = target.offsetTop;
          break;
      }
    });

    element.bind('focus', function (evt) {
      hasFocus = true;
      if (minLength === 0 && !modelCtrl.$viewValue) {
        $timeout(function() {
          getMatchesAsync(modelCtrl.$viewValue, evt);
        }, 0);
      }
    });

    element.bind('blur', function(evt) {
      if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
        selected = true;
        scope.$apply(function() {
          if (angular.isObject(scope.debounceUpdate) && angular.isNumber(scope.debounceUpdate.blur)) {
            $$debounce(function() {
              scope.select(scope.activeIdx, evt);
            }, scope.debounceUpdate.blur);
          } else {
            scope.select(scope.activeIdx, evt);
          }
        });
      }
      if (!isEditable && modelCtrl.$error.editable) {
        modelCtrl.$viewValue = '';
        element.val('');
      }
      hasFocus = false;
      selected = false;
    });

    // Keep reference to click handler to unbind it.
    var dismissClickHandler = function(evt) {
      // Issue #3973
      // Firefox treats right click as a click on document
      if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
        resetMatches();
        if (!$rootScope.$$phase) {
          scope.$digest();
        }
      }
    };

    $document.on('click', dismissClickHandler);

    originalScope.$on('$destroy', function() {
      $document.off('click', dismissClickHandler);
      if (appendToBody || appendTo) {
        $popup.remove();
      }

      if (appendToBody) {
        angular.element($window).off('resize', fireRecalculating);
        $document.find('body').off('scroll', fireRecalculating);
      }
      // Prevent jQuery cache memory leak
      popUpEl.remove();

      if (showHint) {
          inputsContainer.remove();
      }
    });

    var $popup = $compile(popUpEl)(scope);

    if (appendToBody) {
      $document.find('body').append($popup);
    } else if (appendTo) {
      angular.element(appendTo).eq(0).append($popup);
    } else {
      element.after($popup);
    }

    this.init = function(_modelCtrl, _ngModelOptions) {
      modelCtrl = _modelCtrl;
      ngModelOptions = _ngModelOptions;

      scope.debounceUpdate = modelCtrl.$options && $parse(modelCtrl.$options.debounce)(originalScope);

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function(inputValue) {
        hasFocus = true;

        if (minLength === 0 || inputValue && inputValue.length >= minLength) {
          if (waitTime > 0) {
            cancelPreviousTimeout();
            scheduleSearchWithTimeout(inputValue);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          cancelPreviousTimeout();
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        }

        if (!inputValue) {
          // Reset in case user had typed something previously.
          modelCtrl.$setValidity('editable', true);
          return null;
        }

        modelCtrl.$setValidity('editable', false);
        return undefined;
      });

      modelCtrl.$formatters.push(function(modelValue) {
        var candidateViewValue, emptyViewValue;
        var locals = {};

        // The validity may be set to false via $parsers (see above) if
        // the model is restricted to selected values. If the model
        // is set manually it is considered to be valid.
        if (!isEditable) {
          modelCtrl.$setValidity('editable', true);
        }

        if (inputFormatter) {
          locals.$model = modelValue;
          return inputFormatter(originalScope, locals);
        }

        //it might happen that we don't have enough info to properly render input value
        //we need to check for this situation and simply return model value if we can't apply custom formatting
        locals[parserResult.itemName] = modelValue;
        candidateViewValue = parserResult.viewMapper(originalScope, locals);
        locals[parserResult.itemName] = undefined;
        emptyViewValue = parserResult.viewMapper(originalScope, locals);

        return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
      });
    };
  }])

  .directive('uibTypeahead', function() {
    return {
      controller: 'UibTypeaheadController',
      require: ['ngModel', '^?ngModelOptions', 'uibTypeahead'],
      link: function(originalScope, element, attrs, ctrls) {
        ctrls[2].init(ctrls[0], ctrls[1]);
      }
    };
  })

  .directive('uibTypeaheadPopup', ['$$debounce', function($$debounce) {
    return {
      scope: {
        matches: '=',
        query: '=',
        active: '=',
        position: '&',
        moveInProgress: '=',
        select: '&',
        assignIsOpen: '&',
        debounce: '&'
      },
      replace: true,
      templateUrl: function(element, attrs) {
        return attrs.popupTemplateUrl || 'uib/template/typeahead/typeahead-popup.html';
      },
      link: function(scope, element, attrs) {
        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function() {
          var isDropdownOpen = scope.matches.length > 0;
          scope.assignIsOpen({ isOpen: isDropdownOpen });
          return isDropdownOpen;
        };

        scope.isActive = function(matchIdx) {
          return scope.active === matchIdx;
        };

        scope.selectActive = function(matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function(activeIdx, evt) {
          var debounce = scope.debounce();
          if (angular.isNumber(debounce) || angular.isObject(debounce)) {
            $$debounce(function() {
              scope.select({activeIdx: activeIdx, evt: evt});
            }, angular.isNumber(debounce) ? debounce : debounce['default']);
          } else {
            scope.select({activeIdx: activeIdx, evt: evt});
          }
        };
      }
    };
  }])

  .directive('uibTypeaheadMatch', ['$templateRequest', '$compile', '$parse', function($templateRequest, $compile, $parse) {
    return {
      scope: {
        index: '=',
        match: '=',
        query: '='
      },
      link: function(scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'uib/template/typeahead/typeahead-match.html';
        $templateRequest(tplUrl).then(function(tplContent) {
          var tplEl = angular.element(tplContent.trim());
          element.replaceWith(tplEl);
          $compile(tplEl)(scope);
        });
      }
    };
  }])

  .filter('uibTypeaheadHighlight', ['$sce', '$injector', '$log', function($sce, $injector, $log) {
    var isSanitizePresent;
    isSanitizePresent = $injector.has('$sanitize');

    function escapeRegexp(queryToEscape) {
      // Regex: capture the whole query string and replace it with the string that will be used to match
      // the results, for example if the capture is "a" the result will be \a
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function containsHtml(matchItem) {
      return /<.*>/g.test(matchItem);
    }

    return function(matchItem, query) {
      if (!isSanitizePresent && containsHtml(matchItem)) {
        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
      }
      matchItem = query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
      if (!isSanitizePresent) {
        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
      }
      return matchItem;
    };
  }]);
angular.module('ui.bootstrap.carousel').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'); });
angular.module('ui.bootstrap.datepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-datepicker-popup.dropdown-menu{display:block;}.uib-button-bar{padding:10px 9px 2px;}</style>'); });
angular.module('ui.bootstrap.timepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.uib-time input{width:50px;}</style>'); });
angular.module('ui.bootstrap.typeahead').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'); });
}).call(this,require("Rh4Tpy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_a795d924.js","/")
},{"Rh4Tpy":5,"buffer":2}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("Rh4Tpy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../../gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"Rh4Tpy":5,"base64-js":3,"buffer":2,"ieee754":4}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("Rh4Tpy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../../gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"Rh4Tpy":5,"buffer":2}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("Rh4Tpy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../../gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"Rh4Tpy":5,"buffer":2}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("Rh4Tpy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../../gulp-browserify/node_modules/browserify/node_modules/process")
},{"Rh4Tpy":5,"buffer":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXdqZGljay9Eb2N1bWVudHMvQ29oYWVzdXNfUHJvamVjdHMvYmFuYW5hL2lvbmljL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbmRyZXdqZGljay9Eb2N1bWVudHMvQ29oYWVzdXNfUHJvamVjdHMvYmFuYW5hL2lvbmljL25vZGVfbW9kdWxlcy9hbmd1bGFyLXVpLWJvb3RzdHJhcC9kaXN0L2Zha2VfYTc5NWQ5MjQuanMiLCIvVXNlcnMvYW5kcmV3amRpY2svRG9jdW1lbnRzL0NvaGFlc3VzX1Byb2plY3RzL2JhbmFuYS9pb25pYy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvYW5kcmV3amRpY2svRG9jdW1lbnRzL0NvaGFlc3VzX1Byb2plY3RzL2JhbmFuYS9pb25pYy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL1VzZXJzL2FuZHJld2pkaWNrL0RvY3VtZW50cy9Db2hhZXN1c19Qcm9qZWN0cy9iYW5hbmEvaW9uaWMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL2FuZHJld2pkaWNrL0RvY3VtZW50cy9Db2hhZXN1c19Qcm9qZWN0cy9iYW5hbmEvaW9uaWMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25nTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKlxuICogYW5ndWxhci11aS1ib290c3RyYXBcbiAqIGh0dHA6Ly9hbmd1bGFyLXVpLmdpdGh1Yi5pby9ib290c3RyYXAvXG5cbiAqIFZlcnNpb246IDEuMS4yIC0gMjAxNi0wMi0wMVxuICogTGljZW5zZTogTUlUXG4gKi9hbmd1bGFyLm1vZHVsZShcInVpLmJvb3RzdHJhcFwiLCBbXCJ1aS5ib290c3RyYXAuY29sbGFwc2VcIixcInVpLmJvb3RzdHJhcC5hY2NvcmRpb25cIixcInVpLmJvb3RzdHJhcC5hbGVydFwiLFwidWkuYm9vdHN0cmFwLmJ1dHRvbnNcIixcInVpLmJvb3RzdHJhcC5jYXJvdXNlbFwiLFwidWkuYm9vdHN0cmFwLmRhdGVwYXJzZXJcIixcInVpLmJvb3RzdHJhcC5pc0NsYXNzXCIsXCJ1aS5ib290c3RyYXAucG9zaXRpb25cIixcInVpLmJvb3RzdHJhcC5kYXRlcGlja2VyXCIsXCJ1aS5ib290c3RyYXAuZGVib3VuY2VcIixcInVpLmJvb3RzdHJhcC5kcm9wZG93blwiLFwidWkuYm9vdHN0cmFwLnN0YWNrZWRNYXBcIixcInVpLmJvb3RzdHJhcC5tb2RhbFwiLFwidWkuYm9vdHN0cmFwLnBhZ2luZ1wiLFwidWkuYm9vdHN0cmFwLnBhZ2VyXCIsXCJ1aS5ib290c3RyYXAucGFnaW5hdGlvblwiLFwidWkuYm9vdHN0cmFwLnRvb2x0aXBcIixcInVpLmJvb3RzdHJhcC5wb3BvdmVyXCIsXCJ1aS5ib290c3RyYXAucHJvZ3Jlc3NiYXJcIixcInVpLmJvb3RzdHJhcC5yYXRpbmdcIixcInVpLmJvb3RzdHJhcC50YWJzXCIsXCJ1aS5ib290c3RyYXAudGltZXBpY2tlclwiLFwidWkuYm9vdHN0cmFwLnR5cGVhaGVhZFwiXSk7XG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmNvbGxhcHNlJywgW10pXG5cbiAgLmRpcmVjdGl2ZSgndWliQ29sbGFwc2UnLCBbJyRhbmltYXRlJywgJyRxJywgJyRwYXJzZScsICckaW5qZWN0b3InLCBmdW5jdGlvbigkYW5pbWF0ZSwgJHEsICRwYXJzZSwgJGluamVjdG9yKSB7XG4gICAgdmFyICRhbmltYXRlQ3NzID0gJGluamVjdG9yLmhhcygnJGFuaW1hdGVDc3MnKSA/ICRpbmplY3Rvci5nZXQoJyRhbmltYXRlQ3NzJykgOiBudWxsO1xuICAgIHJldHVybiB7XG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIGV4cGFuZGluZ0V4cHIgPSAkcGFyc2UoYXR0cnMuZXhwYW5kaW5nKSxcbiAgICAgICAgICAgIGV4cGFuZGVkRXhwciA9ICRwYXJzZShhdHRycy5leHBhbmRlZCksXG4gICAgICAgICAgICBjb2xsYXBzaW5nRXhwciA9ICRwYXJzZShhdHRycy5jb2xsYXBzaW5nKSxcbiAgICAgICAgICAgIGNvbGxhcHNlZEV4cHIgPSAkcGFyc2UoYXR0cnMuY29sbGFwc2VkKTtcblxuICAgICAgICBpZiAoIXNjb3BlLiRldmFsKGF0dHJzLnVpYkNvbGxhcHNlKSkge1xuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgZmFsc2UpXG4gICAgICAgICAgICAuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwYW5kKCkge1xuICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0NsYXNzKCdjb2xsYXBzZScpICYmIGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkcS5yZXNvbHZlKGV4cGFuZGluZ0V4cHIoc2NvcGUpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgaWYgKCRhbmltYXRlQ3NzKSB7XG4gICAgICAgICAgICAgICAgJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgYWRkQ2xhc3M6ICdpbicsXG4gICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlJyxcbiAgICAgICAgICAgICAgICAgIHRvOiB7IGhlaWdodDogZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgKyAncHgnIH1cbiAgICAgICAgICAgICAgICB9KS5zdGFydCgpWydmaW5hbGx5J10oZXhwYW5kRG9uZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ2luJywge1xuICAgICAgICAgICAgICAgICAgdG86IHsgaGVpZ2h0OiBlbGVtZW50WzBdLnNjcm9sbEhlaWdodCArICdweCcgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZXhwYW5kRG9uZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwYW5kRG9uZSgpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAgICAgLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcbiAgICAgICAgICBleHBhbmRlZEV4cHIoc2NvcGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29sbGFwc2UoKSB7XG4gICAgICAgICAgaWYgKCFlbGVtZW50Lmhhc0NsYXNzKCdjb2xsYXBzZScpICYmICFlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGFwc2VEb25lKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHEucmVzb2x2ZShjb2xsYXBzaW5nRXhwcihzY29wZSkpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgIC8vIElNUE9SVEFOVDogVGhlIGhlaWdodCBtdXN0IGJlIHNldCBiZWZvcmUgYWRkaW5nIFwiY29sbGFwc2luZ1wiIGNsYXNzLlxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdGhlIGJyb3dzZXIgYXR0ZW1wdHMgdG8gYW5pbWF0ZSBmcm9tIGhlaWdodCAwIChpblxuICAgICAgICAgICAgICAgIC8vIGNvbGxhcHNpbmcgY2xhc3MpIHRvIHRoZSBnaXZlbiBoZWlnaHQgaGVyZS5cbiAgICAgICAgICAgICAgICAuY3NzKHtoZWlnaHQ6IGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ICsgJ3B4J30pXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGx5IGFsbCBwYW5lbCBjb2xsYXBzZSBoYXZlIHRoZSBjb2xsYXBzZSBjbGFzcywgdGhpcyByZW1vdmFsXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudHMgdGhlIGFuaW1hdGlvbiBmcm9tIGp1bXBpbmcgdG8gY29sbGFwc2VkIHN0YXRlXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gICAgICAgICAgICAgIGlmICgkYW5pbWF0ZUNzcykge1xuICAgICAgICAgICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiAnaW4nLFxuICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwJ31cbiAgICAgICAgICAgICAgICB9KS5zdGFydCgpWydmaW5hbGx5J10oY29sbGFwc2VEb25lKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnaW4nLCB7XG4gICAgICAgICAgICAgICAgICB0bzoge2hlaWdodDogJzAnfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oY29sbGFwc2VEb25lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb2xsYXBzZURvbmUoKSB7XG4gICAgICAgICAgZWxlbWVudC5jc3Moe2hlaWdodDogJzAnfSk7IC8vIFJlcXVpcmVkIHNvIHRoYXQgY29sbGFwc2Ugd29ya3Mgd2hlbiBhbmltYXRpb24gaXMgZGlzYWJsZWRcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKTtcbiAgICAgICAgICBjb2xsYXBzZWRFeHByKHNjb3BlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy51aWJDb2xsYXBzZSwgZnVuY3Rpb24oc2hvdWxkQ29sbGFwc2UpIHtcbiAgICAgICAgICBpZiAoc2hvdWxkQ29sbGFwc2UpIHtcbiAgICAgICAgICAgIGNvbGxhcHNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cGFuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmFjY29yZGlvbicsIFsndWkuYm9vdHN0cmFwLmNvbGxhcHNlJ10pXG5cbi5jb25zdGFudCgndWliQWNjb3JkaW9uQ29uZmlnJywge1xuICBjbG9zZU90aGVyczogdHJ1ZVxufSlcblxuLmNvbnRyb2xsZXIoJ1VpYkFjY29yZGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAndWliQWNjb3JkaW9uQ29uZmlnJywgZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMsIGFjY29yZGlvbkNvbmZpZykge1xuICAvLyBUaGlzIGFycmF5IGtlZXBzIHRyYWNrIG9mIHRoZSBhY2NvcmRpb24gZ3JvdXBzXG4gIHRoaXMuZ3JvdXBzID0gW107XG5cbiAgLy8gRW5zdXJlIHRoYXQgYWxsIHRoZSBncm91cHMgaW4gdGhpcyBhY2NvcmRpb24gYXJlIGNsb3NlZCwgdW5sZXNzIGNsb3NlLW90aGVycyBleHBsaWNpdGx5IHNheXMgbm90IHRvXG4gIHRoaXMuY2xvc2VPdGhlcnMgPSBmdW5jdGlvbihvcGVuR3JvdXApIHtcbiAgICB2YXIgY2xvc2VPdGhlcnMgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuY2xvc2VPdGhlcnMpID9cbiAgICAgICRzY29wZS4kZXZhbCgkYXR0cnMuY2xvc2VPdGhlcnMpIDogYWNjb3JkaW9uQ29uZmlnLmNsb3NlT3RoZXJzO1xuICAgIGlmIChjbG9zZU90aGVycykge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMuZ3JvdXBzLCBmdW5jdGlvbihncm91cCkge1xuICAgICAgICBpZiAoZ3JvdXAgIT09IG9wZW5Hcm91cCkge1xuICAgICAgICAgIGdyb3VwLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhpcyBpcyBjYWxsZWQgZnJvbSB0aGUgYWNjb3JkaW9uLWdyb3VwIGRpcmVjdGl2ZSB0byBhZGQgaXRzZWxmIHRvIHRoZSBhY2NvcmRpb25cbiAgdGhpcy5hZGRHcm91cCA9IGZ1bmN0aW9uKGdyb3VwU2NvcGUpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5ncm91cHMucHVzaChncm91cFNjb3BlKTtcblxuICAgIGdyb3VwU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB0aGF0LnJlbW92ZUdyb3VwKGdyb3VwU2NvcGUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFRoaXMgaXMgY2FsbGVkIGZyb20gdGhlIGFjY29yZGlvbi1ncm91cCBkaXJlY3RpdmUgd2hlbiB0byByZW1vdmUgaXRzZWxmXG4gIHRoaXMucmVtb3ZlR3JvdXAgPSBmdW5jdGlvbihncm91cCkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuZ3JvdXBzLmluZGV4T2YoZ3JvdXApO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZ3JvdXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9O1xufV0pXG5cbi8vIFRoZSBhY2NvcmRpb24gZGlyZWN0aXZlIHNpbXBseSBzZXRzIHVwIHRoZSBkaXJlY3RpdmUgY29udHJvbGxlclxuLy8gYW5kIGFkZHMgYW4gYWNjb3JkaW9uIENTUyBjbGFzcyB0byBpdHNlbGYgZWxlbWVudC5cbi5kaXJlY3RpdmUoJ3VpYkFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIGNvbnRyb2xsZXI6ICdVaWJBY2NvcmRpb25Db250cm9sbGVyJyxcbiAgICBjb250cm9sbGVyQXM6ICdhY2NvcmRpb24nLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9hY2NvcmRpb24vYWNjb3JkaW9uLmh0bWwnO1xuICAgIH1cbiAgfTtcbn0pXG5cbi8vIFRoZSBhY2NvcmRpb24tZ3JvdXAgZGlyZWN0aXZlIGluZGljYXRlcyBhIGJsb2NrIG9mIGh0bWwgdGhhdCB3aWxsIGV4cGFuZCBhbmQgY29sbGFwc2UgaW4gYW4gYWNjb3JkaW9uXG4uZGlyZWN0aXZlKCd1aWJBY2NvcmRpb25Hcm91cCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6ICdedWliQWNjb3JkaW9uJywgICAgICAgICAvLyBXZSBuZWVkIHRoaXMgZGlyZWN0aXZlIHRvIGJlIGluc2lkZSBhbiBhY2NvcmRpb25cbiAgICB0cmFuc2NsdWRlOiB0cnVlLCAgICAgICAgICAgICAgLy8gSXQgdHJhbnNjbHVkZXMgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaXJlY3RpdmUgaW50byB0aGUgdGVtcGxhdGVcbiAgICByZXBsYWNlOiB0cnVlLCAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudCBjb250YWluaW5nIHRoZSBkaXJlY3RpdmUgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0ZW1wbGF0ZVxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvYWNjb3JkaW9uL2FjY29yZGlvbi1ncm91cC5odG1sJztcbiAgICB9LFxuICAgIHNjb3BlOiB7XG4gICAgICBoZWFkaW5nOiAnQCcsICAgICAgICAgICAgICAgLy8gSW50ZXJwb2xhdGUgdGhlIGhlYWRpbmcgYXR0cmlidXRlIG9udG8gdGhpcyBzY29wZVxuICAgICAgaXNPcGVuOiAnPT8nLFxuICAgICAgaXNEaXNhYmxlZDogJz0/J1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNldEhlYWRpbmcgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuaGVhZGluZyA9IGVsZW1lbnQ7XG4gICAgICB9O1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBhY2NvcmRpb25DdHJsKSB7XG4gICAgICBhY2NvcmRpb25DdHJsLmFkZEdyb3VwKHNjb3BlKTtcblxuICAgICAgc2NvcGUub3BlbkNsYXNzID0gYXR0cnMub3BlbkNsYXNzIHx8ICdwYW5lbC1vcGVuJztcbiAgICAgIHNjb3BlLnBhbmVsQ2xhc3MgPSBhdHRycy5wYW5lbENsYXNzIHx8ICdwYW5lbC1kZWZhdWx0JztcbiAgICAgIHNjb3BlLiR3YXRjaCgnaXNPcGVuJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgZWxlbWVudC50b2dnbGVDbGFzcyhzY29wZS5vcGVuQ2xhc3MsICEhdmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBhY2NvcmRpb25DdHJsLmNsb3NlT3RoZXJzKHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLnRvZ2dsZU9wZW4gPSBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgaWYgKCFzY29wZS5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgaWYgKCEkZXZlbnQgfHwgJGV2ZW50LndoaWNoID09PSAzMikge1xuICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gIXNjb3BlLmlzT3BlbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBpZCA9ICdhY2NvcmRpb25ncm91cC0nICsgc2NvcGUuJGlkICsgJy0nICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuICAgICAgc2NvcGUuaGVhZGluZ0lkID0gaWQgKyAnLXRhYic7XG4gICAgICBzY29wZS5wYW5lbElkID0gaWQgKyAnLXBhbmVsJztcbiAgICB9XG4gIH07XG59KVxuXG4vLyBVc2UgYWNjb3JkaW9uLWhlYWRpbmcgYmVsb3cgYW4gYWNjb3JkaW9uLWdyb3VwIHRvIHByb3ZpZGUgYSBoZWFkaW5nIGNvbnRhaW5pbmcgSFRNTFxuLmRpcmVjdGl2ZSgndWliQWNjb3JkaW9uSGVhZGluZycsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRyYW5zY2x1ZGU6IHRydWUsICAgLy8gR3JhYiB0aGUgY29udGVudHMgdG8gYmUgdXNlZCBhcyB0aGUgaGVhZGluZ1xuICAgIHRlbXBsYXRlOiAnJywgICAgICAgLy8gSW4gZWZmZWN0IHJlbW92ZSB0aGlzIGVsZW1lbnQhXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICByZXF1aXJlOiAnXnVpYkFjY29yZGlvbkdyb3VwJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGFjY29yZGlvbkdyb3VwQ3RybCwgdHJhbnNjbHVkZSkge1xuICAgICAgLy8gUGFzcyB0aGUgaGVhZGluZyB0byB0aGUgYWNjb3JkaW9uLWdyb3VwIGNvbnRyb2xsZXJcbiAgICAgIC8vIHNvIHRoYXQgaXQgY2FuIGJlIHRyYW5zY2x1ZGVkIGludG8gdGhlIHJpZ2h0IHBsYWNlIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAgLy8gW1RoZSBzZWNvbmQgcGFyYW1ldGVyIHRvIHRyYW5zY2x1ZGUgY2F1c2VzIHRoZSBlbGVtZW50cyB0byBiZSBjbG9uZWQgc28gdGhhdCB0aGV5IHdvcmsgaW4gbmctcmVwZWF0XVxuICAgICAgYWNjb3JkaW9uR3JvdXBDdHJsLnNldEhlYWRpbmcodHJhbnNjbHVkZShzY29wZSwgYW5ndWxhci5ub29wKSk7XG4gICAgfVxuICB9O1xufSlcblxuLy8gVXNlIGluIHRoZSBhY2NvcmRpb24tZ3JvdXAgdGVtcGxhdGUgdG8gaW5kaWNhdGUgd2hlcmUgeW91IHdhbnQgdGhlIGhlYWRpbmcgdG8gYmUgdHJhbnNjbHVkZWRcbi8vIFlvdSBtdXN0IHByb3ZpZGUgdGhlIHByb3BlcnR5IG9uIHRoZSBhY2NvcmRpb24tZ3JvdXAgY29udHJvbGxlciB0aGF0IHdpbGwgaG9sZCB0aGUgdHJhbnNjbHVkZWQgZWxlbWVudFxuLmRpcmVjdGl2ZSgndWliQWNjb3JkaW9uVHJhbnNjbHVkZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6ICdedWliQWNjb3JkaW9uR3JvdXAnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikge1xuICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udHJvbGxlclthdHRycy51aWJBY2NvcmRpb25UcmFuc2NsdWRlXTsgfSwgZnVuY3Rpb24oaGVhZGluZykge1xuICAgICAgICBpZiAoaGVhZGluZykge1xuICAgICAgICAgIGVsZW1lbnQuZmluZCgnc3BhbicpLmh0bWwoJycpO1xuICAgICAgICAgIGVsZW1lbnQuZmluZCgnc3BhbicpLmFwcGVuZChoZWFkaW5nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAuYWxlcnQnLCBbXSlcblxuLmNvbnRyb2xsZXIoJ1VpYkFsZXJ0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdHRycycsICckaW50ZXJwb2xhdGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbigkc2NvcGUsICRhdHRycywgJGludGVycG9sYXRlLCAkdGltZW91dCkge1xuICAkc2NvcGUuY2xvc2VhYmxlID0gISEkYXR0cnMuY2xvc2U7XG5cbiAgdmFyIGRpc21pc3NPblRpbWVvdXQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZGlzbWlzc09uVGltZW91dCkgP1xuICAgICRpbnRlcnBvbGF0ZSgkYXR0cnMuZGlzbWlzc09uVGltZW91dCkoJHNjb3BlLiRwYXJlbnQpIDogbnVsbDtcblxuICBpZiAoZGlzbWlzc09uVGltZW91dCkge1xuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmNsb3NlKCk7XG4gICAgfSwgcGFyc2VJbnQoZGlzbWlzc09uVGltZW91dCwgMTApKTtcbiAgfVxufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkFsZXJ0JywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgY29udHJvbGxlcjogJ1VpYkFsZXJ0Q29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnYWxlcnQnLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvYWxlcnQvYWxlcnQuaHRtbCc7XG4gICAgfSxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIHR5cGU6ICdAJyxcbiAgICAgIGNsb3NlOiAnJidcbiAgICB9XG4gIH07XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5idXR0b25zJywgW10pXG5cbi5jb25zdGFudCgndWliQnV0dG9uQ29uZmlnJywge1xuICBhY3RpdmVDbGFzczogJ2FjdGl2ZScsXG4gIHRvZ2dsZUV2ZW50OiAnY2xpY2snXG59KVxuXG4uY29udHJvbGxlcignVWliQnV0dG9uc0NvbnRyb2xsZXInLCBbJ3VpYkJ1dHRvbkNvbmZpZycsIGZ1bmN0aW9uKGJ1dHRvbkNvbmZpZykge1xuICB0aGlzLmFjdGl2ZUNsYXNzID0gYnV0dG9uQ29uZmlnLmFjdGl2ZUNsYXNzIHx8ICdhY3RpdmUnO1xuICB0aGlzLnRvZ2dsZUV2ZW50ID0gYnV0dG9uQ29uZmlnLnRvZ2dsZUV2ZW50IHx8ICdjbGljayc7XG59XSlcblxuLmRpcmVjdGl2ZSgndWliQnRuUmFkaW8nLCBbJyRwYXJzZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6IFsndWliQnRuUmFkaW8nLCAnbmdNb2RlbCddLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJCdXR0b25zQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnYnV0dG9ucycsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgdmFyIGJ1dHRvbnNDdHJsID0gY3RybHNbMF0sIG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG4gICAgICB2YXIgdW5jaGVja2FibGVFeHByID0gJHBhcnNlKGF0dHJzLnVpYlVuY2hlY2thYmxlKTtcblxuICAgICAgZWxlbWVudC5maW5kKCdpbnB1dCcpLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XG5cbiAgICAgIC8vbW9kZWwgLT4gVUlcbiAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudC50b2dnbGVDbGFzcyhidXR0b25zQ3RybC5hY3RpdmVDbGFzcywgYW5ndWxhci5lcXVhbHMobmdNb2RlbEN0cmwuJG1vZGVsVmFsdWUsIHNjb3BlLiRldmFsKGF0dHJzLnVpYkJ0blJhZGlvKSkpO1xuICAgICAgfTtcblxuICAgICAgLy91aS0+bW9kZWxcbiAgICAgIGVsZW1lbnQub24oYnV0dG9uc0N0cmwudG9nZ2xlRXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXR0cnMuZGlzYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSBlbGVtZW50Lmhhc0NsYXNzKGJ1dHRvbnNDdHJsLmFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBpZiAoIWlzQWN0aXZlIHx8IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLnVuY2hlY2thYmxlKSkge1xuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoaXNBY3RpdmUgPyBudWxsIDogc2NvcGUuJGV2YWwoYXR0cnMudWliQnRuUmFkaW8pKTtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhdHRycy51aWJVbmNoZWNrYWJsZSkge1xuICAgICAgICBzY29wZS4kd2F0Y2godW5jaGVja2FibGVFeHByLCBmdW5jdGlvbih1bmNoZWNrYWJsZSkge1xuICAgICAgICAgIGF0dHJzLiRzZXQoJ3VuY2hlY2thYmxlJywgdW5jaGVja2FibGUgPyAnJyA6IG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XSlcblxuLmRpcmVjdGl2ZSgndWliQnRuQ2hlY2tib3gnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiBbJ3VpYkJ0bkNoZWNrYm94JywgJ25nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnVWliQnV0dG9uc0NvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2J1dHRvbicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgdmFyIGJ1dHRvbnNDdHJsID0gY3RybHNbMF0sIG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG5cbiAgICAgIGVsZW1lbnQuZmluZCgnaW5wdXQnKS5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xuXG4gICAgICBmdW5jdGlvbiBnZXRUcnVlVmFsdWUoKSB7XG4gICAgICAgIHJldHVybiBnZXRDaGVja2JveFZhbHVlKGF0dHJzLmJ0bkNoZWNrYm94VHJ1ZSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldEZhbHNlVmFsdWUoKSB7XG4gICAgICAgIHJldHVybiBnZXRDaGVja2JveFZhbHVlKGF0dHJzLmJ0bkNoZWNrYm94RmFsc2UsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0Q2hlY2tib3hWYWx1ZShhdHRyaWJ1dGUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gYW5ndWxhci5pc0RlZmluZWQoYXR0cmlidXRlKSA/IHNjb3BlLiRldmFsKGF0dHJpYnV0ZSkgOiBkZWZhdWx0VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vbW9kZWwgLT4gVUlcbiAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudC50b2dnbGVDbGFzcyhidXR0b25zQ3RybC5hY3RpdmVDbGFzcywgYW5ndWxhci5lcXVhbHMobmdNb2RlbEN0cmwuJG1vZGVsVmFsdWUsIGdldFRydWVWYWx1ZSgpKSk7XG4gICAgICB9O1xuXG4gICAgICAvL3VpLT5tb2RlbFxuICAgICAgZWxlbWVudC5vbihidXR0b25zQ3RybC50b2dnbGVFdmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChhdHRycy5kaXNhYmxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGVsZW1lbnQuaGFzQ2xhc3MoYnV0dG9uc0N0cmwuYWN0aXZlQ2xhc3MpID8gZ2V0RmFsc2VWYWx1ZSgpIDogZ2V0VHJ1ZVZhbHVlKCkpO1xuICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5jYXJvdXNlbCcsIFtdKVxuXG4uY29udHJvbGxlcignVWliQ2Fyb3VzZWxDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGludGVydmFsJywgJyR0aW1lb3V0JywgJyRhbmltYXRlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGludGVydmFsLCAkdGltZW91dCwgJGFuaW1hdGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIHNsaWRlcyA9IHNlbGYuc2xpZGVzID0gJHNjb3BlLnNsaWRlcyA9IFtdLFxuICAgIFNMSURFX0RJUkVDVElPTiA9ICd1aWItc2xpZGVEaXJlY3Rpb24nLFxuICAgIGN1cnJlbnRJbmRleCA9IC0xLFxuICAgIGN1cnJlbnRJbnRlcnZhbCwgaXNQbGF5aW5nLCBidWZmZXJlZFRyYW5zaXRpb25zID0gW107XG4gIHNlbGYuY3VycmVudFNsaWRlID0gbnVsbDtcblxuICB2YXIgZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgc2VsZi5hZGRTbGlkZSA9IGZ1bmN0aW9uKHNsaWRlLCBlbGVtZW50KSB7XG4gICAgc2xpZGUuJGVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHNsaWRlcy5wdXNoKHNsaWRlKTtcbiAgICAvL2lmIHRoaXMgaXMgdGhlIGZpcnN0IHNsaWRlIG9yIHRoZSBzbGlkZSBpcyBzZXQgdG8gYWN0aXZlLCBzZWxlY3QgaXRcbiAgICBpZiAoc2xpZGVzLmxlbmd0aCA9PT0gMSB8fCBzbGlkZS5hY3RpdmUpIHtcbiAgICAgIGlmICgkc2NvcGUuJGN1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgICRzY29wZS4kY3VycmVudFRyYW5zaXRpb24gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnNlbGVjdChzbGlkZXNbc2xpZGVzLmxlbmd0aCAtIDFdKTtcbiAgICAgIGlmIChzbGlkZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICRzY29wZS5wbGF5KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNsaWRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLmdldEN1cnJlbnRJbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzZWxmLmN1cnJlbnRTbGlkZSAmJiBhbmd1bGFyLmlzRGVmaW5lZChzZWxmLmN1cnJlbnRTbGlkZS5pbmRleCkpIHtcbiAgICAgIHJldHVybiArc2VsZi5jdXJyZW50U2xpZGUuaW5kZXg7XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gIH07XG5cbiAgc2VsZi5uZXh0ID0gJHNjb3BlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV3SW5kZXggPSAoc2VsZi5nZXRDdXJyZW50SW5kZXgoKSArIDEpICUgc2xpZGVzLmxlbmd0aDtcblxuICAgIGlmIChuZXdJbmRleCA9PT0gMCAmJiAkc2NvcGUubm9XcmFwKCkpIHtcbiAgICAgICRzY29wZS5wYXVzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBzZWxmLnNlbGVjdChnZXRTbGlkZUJ5SW5kZXgobmV3SW5kZXgpLCAnbmV4dCcpO1xuICB9O1xuXG4gIHNlbGYucHJldiA9ICRzY29wZS5wcmV2ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5ld0luZGV4ID0gc2VsZi5nZXRDdXJyZW50SW5kZXgoKSAtIDEgPCAwID8gc2xpZGVzLmxlbmd0aCAtIDEgOiBzZWxmLmdldEN1cnJlbnRJbmRleCgpIC0gMTtcblxuICAgIGlmICgkc2NvcGUubm9XcmFwKCkgJiYgbmV3SW5kZXggPT09IHNsaWRlcy5sZW5ndGggLSAxKSB7XG4gICAgICAkc2NvcGUucGF1c2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZi5zZWxlY3QoZ2V0U2xpZGVCeUluZGV4KG5ld0luZGV4KSwgJ3ByZXYnKTtcbiAgfTtcblxuICBzZWxmLnJlbW92ZVNsaWRlID0gZnVuY3Rpb24oc2xpZGUpIHtcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoc2xpZGUuaW5kZXgpKSB7XG4gICAgICBzbGlkZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiArYS5pbmRleCA+ICtiLmluZGV4O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGJ1ZmZlcmVkSW5kZXggPSBidWZmZXJlZFRyYW5zaXRpb25zLmluZGV4T2Yoc2xpZGUpO1xuICAgIGlmIChidWZmZXJlZEluZGV4ICE9PSAtMSkge1xuICAgICAgYnVmZmVyZWRUcmFuc2l0aW9ucy5zcGxpY2UoYnVmZmVyZWRJbmRleCwgMSk7XG4gICAgfVxuICAgIC8vZ2V0IHRoZSBpbmRleCBvZiB0aGUgc2xpZGUgaW5zaWRlIHRoZSBjYXJvdXNlbFxuICAgIHZhciBpbmRleCA9IHNsaWRlcy5pbmRleE9mKHNsaWRlKTtcbiAgICBzbGlkZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzbGlkZXMubGVuZ3RoID4gMCAmJiBzbGlkZS5hY3RpdmUpIHtcbiAgICAgICAgaWYgKGluZGV4ID49IHNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLnNlbGVjdChzbGlkZXNbaW5kZXggLSAxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5zZWxlY3Qoc2xpZGVzW2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID4gaW5kZXgpIHtcbiAgICAgICAgY3VycmVudEluZGV4LS07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvL2NsZWFuIHRoZSBjdXJyZW50U2xpZGUgd2hlbiBubyBtb3JlIHNsaWRlXG4gICAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHNlbGYuY3VycmVudFNsaWRlID0gbnVsbDtcbiAgICAgIGNsZWFyQnVmZmVyZWRUcmFuc2l0aW9ucygpO1xuICAgIH1cbiAgfTtcblxuICAvKiBkaXJlY3Rpb246IFwicHJldlwiIG9yIFwibmV4dFwiICovXG4gIHNlbGYuc2VsZWN0ID0gJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKG5leHRTbGlkZSwgZGlyZWN0aW9uKSB7XG4gICAgdmFyIG5leHRJbmRleCA9ICRzY29wZS5pbmRleE9mU2xpZGUobmV4dFNsaWRlKTtcbiAgICAvL0RlY2lkZSBkaXJlY3Rpb24gaWYgaXQncyBub3QgZ2l2ZW5cbiAgICBpZiAoZGlyZWN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRpcmVjdGlvbiA9IG5leHRJbmRleCA+IHNlbGYuZ2V0Q3VycmVudEluZGV4KCkgPyAnbmV4dCcgOiAncHJldic7XG4gICAgfVxuICAgIC8vUHJldmVudCB0aGlzIHVzZXItdHJpZ2dlcmVkIHRyYW5zaXRpb24gZnJvbSBvY2N1cnJpbmcgaWYgdGhlcmUgaXMgYWxyZWFkeSBvbmUgaW4gcHJvZ3Jlc3NcbiAgICBpZiAobmV4dFNsaWRlICYmIG5leHRTbGlkZSAhPT0gc2VsZi5jdXJyZW50U2xpZGUgJiYgISRzY29wZS4kY3VycmVudFRyYW5zaXRpb24pIHtcbiAgICAgIGdvTmV4dChuZXh0U2xpZGUsIG5leHRJbmRleCwgZGlyZWN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKG5leHRTbGlkZSAmJiBuZXh0U2xpZGUgIT09IHNlbGYuY3VycmVudFNsaWRlICYmICRzY29wZS4kY3VycmVudFRyYW5zaXRpb24pIHtcbiAgICAgIGJ1ZmZlcmVkVHJhbnNpdGlvbnMucHVzaChuZXh0U2xpZGUpO1xuICAgICAgbmV4dFNsaWRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvKiBBbGxvdyBvdXRzaWRlIHBlb3BsZSB0byBjYWxsIGluZGV4T2Ygb24gc2xpZGVzIGFycmF5ICovXG4gICRzY29wZS5pbmRleE9mU2xpZGUgPSBmdW5jdGlvbihzbGlkZSkge1xuICAgIHJldHVybiBhbmd1bGFyLmlzRGVmaW5lZChzbGlkZS5pbmRleCkgPyArc2xpZGUuaW5kZXggOiBzbGlkZXMuaW5kZXhPZihzbGlkZSk7XG4gIH07XG5cbiAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24oc2xpZGUpIHtcbiAgICByZXR1cm4gc2VsZi5jdXJyZW50U2xpZGUgPT09IHNsaWRlO1xuICB9O1xuXG4gICRzY29wZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghJHNjb3BlLm5vUGF1c2UpIHtcbiAgICAgIGlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgcmVzZXRUaW1lcigpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUucGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNQbGF5aW5nKSB7XG4gICAgICBpc1BsYXlpbmcgPSB0cnVlO1xuICAgICAgcmVzdGFydFRpbWVyKCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgICByZXNldFRpbWVyKCk7XG4gIH0pO1xuXG4gICRzY29wZS4kd2F0Y2goJ25vVHJhbnNpdGlvbicsIGZ1bmN0aW9uKG5vVHJhbnNpdGlvbikge1xuICAgICRhbmltYXRlLmVuYWJsZWQoJGVsZW1lbnQsICFub1RyYW5zaXRpb24pO1xuICB9KTtcblxuICAkc2NvcGUuJHdhdGNoKCdpbnRlcnZhbCcsIHJlc3RhcnRUaW1lcik7XG5cbiAgJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oJ3NsaWRlcycsIHJlc2V0VHJhbnNpdGlvbik7XG5cbiAgZnVuY3Rpb24gY2xlYXJCdWZmZXJlZFRyYW5zaXRpb25zKCkge1xuICAgIHdoaWxlIChidWZmZXJlZFRyYW5zaXRpb25zLmxlbmd0aCkge1xuICAgICAgYnVmZmVyZWRUcmFuc2l0aW9ucy5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlQnlJbmRleChpbmRleCkge1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHNsaWRlc1tpbmRleF0uaW5kZXgpKSB7XG4gICAgICByZXR1cm4gc2xpZGVzW2luZGV4XTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzbGlkZXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoc2xpZGVzW2ldLmluZGV4ID09PSBpbmRleCkge1xuICAgICAgICByZXR1cm4gc2xpZGVzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdvTmV4dChzbGlkZSwgaW5kZXgsIGRpcmVjdGlvbikge1xuICAgIGlmIChkZXN0cm95ZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBhbmd1bGFyLmV4dGVuZChzbGlkZSwge2RpcmVjdGlvbjogZGlyZWN0aW9uLCBhY3RpdmU6IHRydWV9KTtcbiAgICBhbmd1bGFyLmV4dGVuZChzZWxmLmN1cnJlbnRTbGlkZSB8fCB7fSwge2RpcmVjdGlvbjogZGlyZWN0aW9uLCBhY3RpdmU6IGZhbHNlfSk7XG4gICAgaWYgKCRhbmltYXRlLmVuYWJsZWQoJGVsZW1lbnQpICYmICEkc2NvcGUuJGN1cnJlbnRUcmFuc2l0aW9uICYmXG4gICAgICBzbGlkZS4kZWxlbWVudCAmJiBzZWxmLnNsaWRlcy5sZW5ndGggPiAxKSB7XG4gICAgICBzbGlkZS4kZWxlbWVudC5kYXRhKFNMSURFX0RJUkVDVElPTiwgc2xpZGUuZGlyZWN0aW9uKTtcbiAgICAgIGlmIChzZWxmLmN1cnJlbnRTbGlkZSAmJiBzZWxmLmN1cnJlbnRTbGlkZS4kZWxlbWVudCkge1xuICAgICAgICBzZWxmLmN1cnJlbnRTbGlkZS4kZWxlbWVudC5kYXRhKFNMSURFX0RJUkVDVElPTiwgc2xpZGUuZGlyZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLiRjdXJyZW50VHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAkYW5pbWF0ZS5vbignYWRkQ2xhc3MnLCBzbGlkZS4kZWxlbWVudCwgZnVuY3Rpb24oZWxlbWVudCwgcGhhc2UpIHtcbiAgICAgICAgaWYgKHBoYXNlID09PSAnY2xvc2UnKSB7XG4gICAgICAgICAgJHNjb3BlLiRjdXJyZW50VHJhbnNpdGlvbiA9IG51bGw7XG4gICAgICAgICAgJGFuaW1hdGUub2ZmKCdhZGRDbGFzcycsIGVsZW1lbnQpO1xuICAgICAgICAgIGlmIChidWZmZXJlZFRyYW5zaXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIG5leHRTbGlkZSA9IGJ1ZmZlcmVkVHJhbnNpdGlvbnMucG9wKCk7XG4gICAgICAgICAgICB2YXIgbmV4dEluZGV4ID0gJHNjb3BlLmluZGV4T2ZTbGlkZShuZXh0U2xpZGUpO1xuICAgICAgICAgICAgdmFyIG5leHREaXJlY3Rpb24gPSBuZXh0SW5kZXggPiBzZWxmLmdldEN1cnJlbnRJbmRleCgpID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgICAgICAgY2xlYXJCdWZmZXJlZFRyYW5zaXRpb25zKCk7XG5cbiAgICAgICAgICAgIGdvTmV4dChuZXh0U2xpZGUsIG5leHRJbmRleCwgbmV4dERpcmVjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxmLmN1cnJlbnRTbGlkZSA9IHNsaWRlO1xuICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuXG4gICAgLy9ldmVyeSB0aW1lIHlvdSBjaGFuZ2Ugc2xpZGVzLCByZXNldCB0aGUgdGltZXJcbiAgICByZXN0YXJ0VGltZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VGltZXIoKSB7XG4gICAgaWYgKGN1cnJlbnRJbnRlcnZhbCkge1xuICAgICAgJGludGVydmFsLmNhbmNlbChjdXJyZW50SW50ZXJ2YWwpO1xuICAgICAgY3VycmVudEludGVydmFsID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyYW5zaXRpb24oc2xpZGVzKSB7XG4gICAgaWYgKCFzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAkc2NvcGUuJGN1cnJlbnRUcmFuc2l0aW9uID0gbnVsbDtcbiAgICAgIGNsZWFyQnVmZmVyZWRUcmFuc2l0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RhcnRUaW1lcigpIHtcbiAgICByZXNldFRpbWVyKCk7XG4gICAgdmFyIGludGVydmFsID0gKyRzY29wZS5pbnRlcnZhbDtcbiAgICBpZiAoIWlzTmFOKGludGVydmFsKSAmJiBpbnRlcnZhbCA+IDApIHtcbiAgICAgIGN1cnJlbnRJbnRlcnZhbCA9ICRpbnRlcnZhbCh0aW1lckZuLCBpbnRlcnZhbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJGbigpIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSArJHNjb3BlLmludGVydmFsO1xuICAgIGlmIChpc1BsYXlpbmcgJiYgIWlzTmFOKGludGVydmFsKSAmJiBpbnRlcnZhbCA+IDAgJiYgc2xpZGVzLmxlbmd0aCkge1xuICAgICAgJHNjb3BlLm5leHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnBhdXNlKCk7XG4gICAgfVxuICB9XG59XSlcblxuLmRpcmVjdGl2ZSgndWliQ2Fyb3VzZWwnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgY29udHJvbGxlcjogJ1VpYkNhcm91c2VsQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnY2Fyb3VzZWwnLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvY2Fyb3VzZWwvY2Fyb3VzZWwuaHRtbCc7XG4gICAgfSxcbiAgICBzY29wZToge1xuICAgICAgaW50ZXJ2YWw6ICc9JyxcbiAgICAgIG5vVHJhbnNpdGlvbjogJz0nLFxuICAgICAgbm9QYXVzZTogJz0nLFxuICAgICAgbm9XcmFwOiAnJidcbiAgICB9XG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJTbGlkZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6ICdedWliQ2Fyb3VzZWwnLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2Nhcm91c2VsL3NsaWRlLmh0bWwnO1xuICAgIH0sXG4gICAgc2NvcGU6IHtcbiAgICAgIGFjdGl2ZTogJz0/JyxcbiAgICAgIGFjdHVhbDogJz0/JyxcbiAgICAgIGluZGV4OiAnPT8nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjYXJvdXNlbEN0cmwpIHtcbiAgICAgIGNhcm91c2VsQ3RybC5hZGRTbGlkZShzY29wZSwgZWxlbWVudCk7XG4gICAgICAvL3doZW4gdGhlIHNjb3BlIGlzIGRlc3Ryb3llZCB0aGVuIHJlbW92ZSB0aGUgc2xpZGUgZnJvbSB0aGUgY3VycmVudCBzbGlkZXMgYXJyYXlcbiAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2Fyb3VzZWxDdHJsLnJlbW92ZVNsaWRlKHNjb3BlKTtcbiAgICAgIH0pO1xuXG4gICAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgY2Fyb3VzZWxDdHJsLnNlbGVjdChzY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5hbmltYXRpb24oJy5pdGVtJywgWyckYW5pbWF0ZUNzcycsXG5mdW5jdGlvbigkYW5pbWF0ZUNzcykge1xuICB2YXIgU0xJREVfRElSRUNUSU9OID0gJ3VpYi1zbGlkZURpcmVjdGlvbic7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lLCBjYWxsYmFjaykge1xuICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBiZWZvcmVBZGRDbGFzczogZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NOYW1lLCBkb25lKSB7XG4gICAgICBpZiAoY2xhc3NOYW1lID09PSAnYWN0aXZlJykge1xuICAgICAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gZWxlbWVudC5kYXRhKFNMSURFX0RJUkVDVElPTik7XG4gICAgICAgIHZhciBkaXJlY3Rpb25DbGFzcyA9IGRpcmVjdGlvbiA9PT0gJ25leHQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICAgICAgdmFyIHJlbW92ZUNsYXNzRm4gPSByZW1vdmVDbGFzcy5iaW5kKHRoaXMsIGVsZW1lbnQsXG4gICAgICAgICAgZGlyZWN0aW9uQ2xhc3MgKyAnICcgKyBkaXJlY3Rpb24sIGRvbmUpO1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKGRpcmVjdGlvbik7XG5cbiAgICAgICAgJGFuaW1hdGVDc3MoZWxlbWVudCwge2FkZENsYXNzOiBkaXJlY3Rpb25DbGFzc30pXG4gICAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgICAuZG9uZShyZW1vdmVDbGFzc0ZuKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBkb25lKCk7XG4gICAgfSxcbiAgICBiZWZvcmVSZW1vdmVDbGFzczogZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSwgZG9uZSkge1xuICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgICAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGVsZW1lbnQuZGF0YShTTElERV9ESVJFQ1RJT04pO1xuICAgICAgICB2YXIgZGlyZWN0aW9uQ2xhc3MgPSBkaXJlY3Rpb24gPT09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICAgIHZhciByZW1vdmVDbGFzc0ZuID0gcmVtb3ZlQ2xhc3MuYmluZCh0aGlzLCBlbGVtZW50LCBkaXJlY3Rpb25DbGFzcywgZG9uZSk7XG5cbiAgICAgICAgJGFuaW1hdGVDc3MoZWxlbWVudCwge2FkZENsYXNzOiBkaXJlY3Rpb25DbGFzc30pXG4gICAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgICAuZG9uZShyZW1vdmVDbGFzc0ZuKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9O1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmRhdGVwYXJzZXInLCBbXSlcblxuLnNlcnZpY2UoJ3VpYkRhdGVQYXJzZXInLCBbJyRsb2cnLCAnJGxvY2FsZScsICdkYXRlRmlsdGVyJywgJ29yZGVyQnlGaWx0ZXInLCBmdW5jdGlvbigkbG9nLCAkbG9jYWxlLCBkYXRlRmlsdGVyLCBvcmRlckJ5RmlsdGVyKSB7XG4gIC8vIFB1bGxlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYm9zdG9jay9kMy9ibG9iL21hc3Rlci9zcmMvZm9ybWF0L3JlcXVvdGUuanNcbiAgdmFyIFNQRUNJQUxfQ0hBUkFDVEVSU19SRUdFWFAgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbiAgdmFyIGxvY2FsZUlkO1xuICB2YXIgZm9ybWF0Q29kZVRvUmVnZXg7XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgbG9jYWxlSWQgPSAkbG9jYWxlLmlkO1xuXG4gICAgdGhpcy5wYXJzZXJzID0ge307XG4gICAgdGhpcy5mb3JtYXR0ZXJzID0ge307XG5cbiAgICBmb3JtYXRDb2RlVG9SZWdleCA9IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiAneXl5eScsXG4gICAgICAgIHJlZ2V4OiAnXFxcXGR7NH0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy55ZWFyID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICB2YXIgX2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIF9kYXRlLnNldEZ1bGxZZWFyKE1hdGguYWJzKGRhdGUuZ2V0RnVsbFllYXIoKSkpO1xuICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKF9kYXRlLCAneXl5eScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICd5eScsXG4gICAgICAgIHJlZ2V4OiAnXFxcXGR7Mn0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy55ZWFyID0gK3ZhbHVlICsgMjAwMDsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgdmFyIF9kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBfZGF0ZS5zZXRGdWxsWWVhcihNYXRoLmFicyhkYXRlLmdldEZ1bGxZZWFyKCkpKTtcbiAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihfZGF0ZSwgJ3l5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3knLFxuICAgICAgICByZWdleDogJ1xcXFxkezEsNH0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy55ZWFyID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICB2YXIgX2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIF9kYXRlLnNldEZ1bGxZZWFyKE1hdGguYWJzKGRhdGUuZ2V0RnVsbFllYXIoKSkpO1xuICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKF9kYXRlLCAneScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdNIScsXG4gICAgICAgIHJlZ2V4OiAnMD9bMS05XXwxWzAtMl0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5tb250aCA9IHZhbHVlIC0gMTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gZGF0ZS5nZXRNb250aCgpO1xuICAgICAgICAgIGlmICgvXlswLTldJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdNTScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdNJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ01NTU0nLFxuICAgICAgICByZWdleDogJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLk1PTlRILmpvaW4oJ3wnKSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMubW9udGggPSAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuTU9OVEguaW5kZXhPZih2YWx1ZSk7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnTU1NTScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdNTU0nLFxuICAgICAgICByZWdleDogJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUTU9OVEguam9pbignfCcpLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5tb250aCA9ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVE1PTlRILmluZGV4T2YodmFsdWUpOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ01NTScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdNTScsXG4gICAgICAgIHJlZ2V4OiAnMFsxLTldfDFbMC0yXScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLm1vbnRoID0gdmFsdWUgLSAxOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ01NJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ00nLFxuICAgICAgICByZWdleDogJ1sxLTldfDFbMC0yXScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLm1vbnRoID0gdmFsdWUgLSAxOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ00nKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnZCEnLFxuICAgICAgICByZWdleDogJ1swLTJdP1swLTldezF9fDNbMC0xXXsxfScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLmRhdGUgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgIGlmICgvXlsxLTldJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdkZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdkJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2RkJyxcbiAgICAgICAgcmVnZXg6ICdbMC0yXVswLTldezF9fDNbMC0xXXsxfScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLmRhdGUgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnZGQnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnZCcsXG4gICAgICAgIHJlZ2V4OiAnWzEtMl0/WzAtOV17MX18M1swLTFdezF9JyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMuZGF0ZSA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdkJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ0VFRUUnLFxuICAgICAgICByZWdleDogJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLkRBWS5qb2luKCd8JyksXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnRUVFRScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdFRUUnLFxuICAgICAgICByZWdleDogJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZLmpvaW4oJ3wnKSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdFRUUnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnSEgnLFxuICAgICAgICByZWdleDogJyg/OjB8MSlbMC05XXwyWzAtM10nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5ob3VycyA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdISCcpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdoaCcsXG4gICAgICAgIHJlZ2V4OiAnMFswLTldfDFbMC0yXScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLmhvdXJzID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ2hoJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ0gnLFxuICAgICAgICByZWdleDogJzE/WzAtOV18MlswLTNdJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMuaG91cnMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnSCcpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdoJyxcbiAgICAgICAgcmVnZXg6ICdbMC05XXwxWzAtMl0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5ob3VycyA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdoJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ21tJyxcbiAgICAgICAgcmVnZXg6ICdbMC01XVswLTldJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMubWludXRlcyA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdtbScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdtJyxcbiAgICAgICAgcmVnZXg6ICdbMC05XXxbMS01XVswLTldJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMubWludXRlcyA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdtJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3NzcycsXG4gICAgICAgIHJlZ2V4OiAnWzAtOV1bMC05XVswLTldJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMubWlsbGlzZWNvbmRzID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ3NzcycpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdzcycsXG4gICAgICAgIHJlZ2V4OiAnWzAtNV1bMC05XScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLnNlY29uZHMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnc3MnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAncycsXG4gICAgICAgIHJlZ2V4OiAnWzAtOV18WzEtNV1bMC05XScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLnNlY29uZHMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAncycpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdhJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5BTVBNUy5qb2luKCd8JyksXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLmhvdXJzID09PSAxMikge1xuICAgICAgICAgICAgdGhpcy5ob3VycyA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHZhbHVlID09PSAnUE0nKSB7XG4gICAgICAgICAgICB0aGlzLmhvdXJzICs9IDEyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdhJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ1onLFxuICAgICAgICByZWdleDogJ1srLV1cXFxcZHs0fScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHZhciBtYXRjaGVzID0gdmFsdWUubWF0Y2goLyhbKy1dKShcXGR7Mn0pKFxcZHsyfSkvKSxcbiAgICAgICAgICAgIHNpZ24gPSBtYXRjaGVzWzFdLFxuICAgICAgICAgICAgaG91cnMgPSBtYXRjaGVzWzJdLFxuICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoZXNbM107XG4gICAgICAgICAgdGhpcy5ob3VycyArPSB0b0ludChzaWduICsgaG91cnMpO1xuICAgICAgICAgIHRoaXMubWludXRlcyArPSB0b0ludChzaWduICsgbWludXRlcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdaJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3d3JyxcbiAgICAgICAgcmVnZXg6ICdbMC00XVswLTldfDVbMC0zXScsXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnd3cnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAndycsXG4gICAgICAgIHJlZ2V4OiAnWzAtOV18WzEtNF1bMC05XXw1WzAtM10nLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ3cnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnR0dHRycsXG4gICAgICAgIHJlZ2V4OiAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuRVJBTkFNRVMuam9pbignfCcpLnJlcGxhY2UoL1xccy9nLCAnXFxcXHMnKSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdHR0dHJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ0dHRycsXG4gICAgICAgIHJlZ2V4OiAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuRVJBUy5qb2luKCd8JyksXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnR0dHJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ0dHJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5FUkFTLmpvaW4oJ3wnKSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdHRycpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdHJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5FUkFTLmpvaW4oJ3wnKSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdHJyk7IH1cbiAgICAgIH1cbiAgICBdO1xuICB9O1xuXG4gIHRoaXMuaW5pdCgpO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBhcnNlcihmb3JtYXQsIGZ1bmMpIHtcbiAgICB2YXIgbWFwID0gW10sIHJlZ2V4ID0gZm9ybWF0LnNwbGl0KCcnKTtcblxuICAgIC8vIGNoZWNrIGZvciBsaXRlcmFsIHZhbHVlc1xuICAgIHZhciBxdW90ZUluZGV4ID0gZm9ybWF0LmluZGV4T2YoJ1xcJycpO1xuICAgIGlmIChxdW90ZUluZGV4ID4gLTEpIHtcbiAgICAgIHZhciBpbkxpdGVyYWwgPSBmYWxzZTtcbiAgICAgIGZvcm1hdCA9IGZvcm1hdC5zcGxpdCgnJyk7XG4gICAgICBmb3IgKHZhciBpID0gcXVvdGVJbmRleDsgaSA8IGZvcm1hdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaW5MaXRlcmFsKSB7XG4gICAgICAgICAgaWYgKGZvcm1hdFtpXSA9PT0gJ1xcJycpIHtcbiAgICAgICAgICAgIGlmIChpICsgMSA8IGZvcm1hdC5sZW5ndGggJiYgZm9ybWF0W2krMV0gPT09ICdcXCcnKSB7IC8vIGVzY2FwZWQgc2luZ2xlIHF1b3RlXG4gICAgICAgICAgICAgIGZvcm1hdFtpKzFdID0gJyQnO1xuICAgICAgICAgICAgICByZWdleFtpKzFdID0gJyc7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBlbmQgb2YgbGl0ZXJhbFxuICAgICAgICAgICAgICByZWdleFtpXSA9ICcnO1xuICAgICAgICAgICAgICBpbkxpdGVyYWwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9ybWF0W2ldID0gJyQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChmb3JtYXRbaV0gPT09ICdcXCcnKSB7IC8vIHN0YXJ0IG9mIGxpdGVyYWxcbiAgICAgICAgICAgIGZvcm1hdFtpXSA9ICckJztcbiAgICAgICAgICAgIHJlZ2V4W2ldID0gJyc7XG4gICAgICAgICAgICBpbkxpdGVyYWwgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3JtYXQgPSBmb3JtYXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgYW5ndWxhci5mb3JFYWNoKGZvcm1hdENvZGVUb1JlZ2V4LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2YXIgaW5kZXggPSBmb3JtYXQuaW5kZXhPZihkYXRhLmtleSk7XG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdC5zcGxpdCgnJyk7XG5cbiAgICAgICAgcmVnZXhbaW5kZXhdID0gJygnICsgZGF0YS5yZWdleCArICcpJztcbiAgICAgICAgZm9ybWF0W2luZGV4XSA9ICckJzsgLy8gQ3VzdG9tIHN5bWJvbCB0byBkZWZpbmUgY29uc3VtZWQgcGFydCBvZiBmb3JtYXRcbiAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4ICsgMSwgbiA9IGluZGV4ICsgZGF0YS5rZXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgcmVnZXhbaV0gPSAnJztcbiAgICAgICAgICBmb3JtYXRbaV0gPSAnJCc7XG4gICAgICAgIH1cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0LmpvaW4oJycpO1xuXG4gICAgICAgIG1hcC5wdXNoKHtcbiAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAga2V5OiBkYXRhLmtleSxcbiAgICAgICAgICBhcHBseTogZGF0YVtmdW5jXSxcbiAgICAgICAgICBtYXRjaGVyOiBkYXRhLnJlZ2V4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIHJlZ2V4LmpvaW4oJycpICsgJyQnKSxcbiAgICAgIG1hcDogb3JkZXJCeUZpbHRlcihtYXAsICdpbmRleCcpXG4gICAgfTtcbiAgfVxuXG4gIHRoaXMuZmlsdGVyID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0KSB7XG4gICAgaWYgKCFhbmd1bGFyLmlzRGF0ZShkYXRlKSB8fCBpc05hTihkYXRlKSB8fCAhZm9ybWF0KSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZm9ybWF0ID0gJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTW2Zvcm1hdF0gfHwgZm9ybWF0O1xuXG4gICAgaWYgKCRsb2NhbGUuaWQgIT09IGxvY2FsZUlkKSB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZm9ybWF0dGVyc1tmb3JtYXRdKSB7XG4gICAgICB0aGlzLmZvcm1hdHRlcnNbZm9ybWF0XSA9IGNyZWF0ZVBhcnNlcihmb3JtYXQsICdmb3JtYXR0ZXInKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyc2VyID0gdGhpcy5mb3JtYXR0ZXJzW2Zvcm1hdF0sXG4gICAgICBtYXAgPSBwYXJzZXIubWFwO1xuXG4gICAgdmFyIF9mb3JtYXQgPSBmb3JtYXQ7XG5cbiAgICByZXR1cm4gbWFwLnJlZHVjZShmdW5jdGlvbihzdHIsIG1hcHBlciwgaSkge1xuICAgICAgdmFyIG1hdGNoID0gX2Zvcm1hdC5tYXRjaChuZXcgUmVnRXhwKCcoLiopJyArIG1hcHBlci5rZXkpKTtcbiAgICAgIGlmIChtYXRjaCAmJiBhbmd1bGFyLmlzU3RyaW5nKG1hdGNoWzFdKSkge1xuICAgICAgICBzdHIgKz0gbWF0Y2hbMV07XG4gICAgICAgIF9mb3JtYXQgPSBfZm9ybWF0LnJlcGxhY2UobWF0Y2hbMV0gKyBtYXBwZXIua2V5LCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXBwZXIuYXBwbHkpIHtcbiAgICAgICAgcmV0dXJuIHN0ciArIG1hcHBlci5hcHBseS5jYWxsKG51bGwsIGRhdGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sICcnKTtcbiAgfTtcblxuICB0aGlzLnBhcnNlID0gZnVuY3Rpb24oaW5wdXQsIGZvcm1hdCwgYmFzZURhdGUpIHtcbiAgICBpZiAoIWFuZ3VsYXIuaXNTdHJpbmcoaW5wdXQpIHx8ICFmb3JtYXQpIHtcbiAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICBmb3JtYXQgPSAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFNbZm9ybWF0XSB8fCBmb3JtYXQ7XG4gICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoU1BFQ0lBTF9DSEFSQUNURVJTX1JFR0VYUCwgJ1xcXFwkJicpO1xuXG4gICAgaWYgKCRsb2NhbGUuaWQgIT09IGxvY2FsZUlkKSB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyc2Vyc1tmb3JtYXRdKSB7XG4gICAgICB0aGlzLnBhcnNlcnNbZm9ybWF0XSA9IGNyZWF0ZVBhcnNlcihmb3JtYXQsICdhcHBseScpO1xuICAgIH1cblxuICAgIHZhciBwYXJzZXIgPSB0aGlzLnBhcnNlcnNbZm9ybWF0XSxcbiAgICAgICAgcmVnZXggPSBwYXJzZXIucmVnZXgsXG4gICAgICAgIG1hcCA9IHBhcnNlci5tYXAsXG4gICAgICAgIHJlc3VsdHMgPSBpbnB1dC5tYXRjaChyZWdleCksXG4gICAgICAgIHR6T2Zmc2V0ID0gZmFsc2U7XG4gICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgIHZhciBmaWVsZHMsIGR0O1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEYXRlKGJhc2VEYXRlKSAmJiAhaXNOYU4oYmFzZURhdGUuZ2V0VGltZSgpKSkge1xuICAgICAgICBmaWVsZHMgPSB7XG4gICAgICAgICAgeWVhcjogYmFzZURhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICBtb250aDogYmFzZURhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICBkYXRlOiBiYXNlRGF0ZS5nZXREYXRlKCksXG4gICAgICAgICAgaG91cnM6IGJhc2VEYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgbWludXRlczogYmFzZURhdGUuZ2V0TWludXRlcygpLFxuICAgICAgICAgIHNlY29uZHM6IGJhc2VEYXRlLmdldFNlY29uZHMoKSxcbiAgICAgICAgICBtaWxsaXNlY29uZHM6IGJhc2VEYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYmFzZURhdGUpIHtcbiAgICAgICAgICAkbG9nLndhcm4oJ2RhdGVwYXJzZXI6JywgJ2Jhc2VEYXRlIGlzIG5vdCBhIHZhbGlkIGRhdGUnKTtcbiAgICAgICAgfVxuICAgICAgICBmaWVsZHMgPSB7IHllYXI6IDE5MDAsIG1vbnRoOiAwLCBkYXRlOiAxLCBob3VyczogMCwgbWludXRlczogMCwgc2Vjb25kczogMCwgbWlsbGlzZWNvbmRzOiAwIH07XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBuID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIG1hcHBlciA9IG1hcFtpIC0gMV07XG4gICAgICAgIGlmIChtYXBwZXIubWF0Y2hlciA9PT0gJ1onKSB7XG4gICAgICAgICAgdHpPZmZzZXQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hcHBlci5hcHBseSkge1xuICAgICAgICAgIG1hcHBlci5hcHBseS5jYWxsKGZpZWxkcywgcmVzdWx0c1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGVzZXR0ZXIgPSB0ek9mZnNldCA/IERhdGUucHJvdG90eXBlLnNldFVUQ0Z1bGxZZWFyIDpcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUuc2V0RnVsbFllYXI7XG4gICAgICB2YXIgdGltZXNldHRlciA9IHR6T2Zmc2V0ID8gRGF0ZS5wcm90b3R5cGUuc2V0VVRDSG91cnMgOlxuICAgICAgICBEYXRlLnByb3RvdHlwZS5zZXRIb3VycztcblxuICAgICAgaWYgKGlzVmFsaWQoZmllbGRzLnllYXIsIGZpZWxkcy5tb250aCwgZmllbGRzLmRhdGUpKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzRGF0ZShiYXNlRGF0ZSkgJiYgIWlzTmFOKGJhc2VEYXRlLmdldFRpbWUoKSkgJiYgIXR6T2Zmc2V0KSB7XG4gICAgICAgICAgZHQgPSBuZXcgRGF0ZShiYXNlRGF0ZSk7XG4gICAgICAgICAgZGF0ZXNldHRlci5jYWxsKGR0LCBmaWVsZHMueWVhciwgZmllbGRzLm1vbnRoLCBmaWVsZHMuZGF0ZSk7XG4gICAgICAgICAgdGltZXNldHRlci5jYWxsKGR0LCBmaWVsZHMuaG91cnMsIGZpZWxkcy5taW51dGVzLFxuICAgICAgICAgICAgZmllbGRzLnNlY29uZHMsIGZpZWxkcy5taWxsaXNlY29uZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGR0ID0gbmV3IERhdGUoMCk7XG4gICAgICAgICAgZGF0ZXNldHRlci5jYWxsKGR0LCBmaWVsZHMueWVhciwgZmllbGRzLm1vbnRoLCBmaWVsZHMuZGF0ZSk7XG4gICAgICAgICAgdGltZXNldHRlci5jYWxsKGR0LCBmaWVsZHMuaG91cnMgfHwgMCwgZmllbGRzLm1pbnV0ZXMgfHwgMCxcbiAgICAgICAgICAgIGZpZWxkcy5zZWNvbmRzIHx8IDAsIGZpZWxkcy5taWxsaXNlY29uZHMgfHwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGR0O1xuICAgIH1cbiAgfTtcblxuICAvLyBDaGVjayBpZiBkYXRlIGlzIHZhbGlkIGZvciBzcGVjaWZpYyBtb250aCAoYW5kIHllYXIgZm9yIEZlYnJ1YXJ5KS5cbiAgLy8gTW9udGg6IDAgPSBKYW4sIDEgPSBGZWIsIGV0Y1xuICBmdW5jdGlvbiBpc1ZhbGlkKHllYXIsIG1vbnRoLCBkYXRlKSB7XG4gICAgaWYgKGRhdGUgPCAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG1vbnRoID09PSAxICYmIGRhdGUgPiAyOCkge1xuICAgICAgcmV0dXJuIGRhdGUgPT09IDI5ICYmICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwIHx8IHllYXIgJSA0MDAgPT09IDApO1xuICAgIH1cblxuICAgIGlmIChtb250aCA9PT0gMyB8fCBtb250aCA9PT0gNSB8fCBtb250aCA9PT0gOCB8fCBtb250aCA9PT0gMTApIHtcbiAgICAgIHJldHVybiBkYXRlIDwgMzE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB0b0ludChzdHIpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoc3RyLCAxMCk7XG4gIH1cblxuICB0aGlzLnRvVGltZXpvbmUgPSB0b1RpbWV6b25lO1xuICB0aGlzLmZyb21UaW1lem9uZSA9IGZyb21UaW1lem9uZTtcbiAgdGhpcy50aW1lem9uZVRvT2Zmc2V0ID0gdGltZXpvbmVUb09mZnNldDtcbiAgdGhpcy5hZGREYXRlTWludXRlcyA9IGFkZERhdGVNaW51dGVzO1xuICB0aGlzLmNvbnZlcnRUaW1lem9uZVRvTG9jYWwgPSBjb252ZXJ0VGltZXpvbmVUb0xvY2FsO1xuXG4gIGZ1bmN0aW9uIHRvVGltZXpvbmUoZGF0ZSwgdGltZXpvbmUpIHtcbiAgICByZXR1cm4gZGF0ZSAmJiB0aW1lem9uZSA/IGNvbnZlcnRUaW1lem9uZVRvTG9jYWwoZGF0ZSwgdGltZXpvbmUpIDogZGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21UaW1lem9uZShkYXRlLCB0aW1lem9uZSkge1xuICAgIHJldHVybiBkYXRlICYmIHRpbWV6b25lID8gY29udmVydFRpbWV6b25lVG9Mb2NhbChkYXRlLCB0aW1lem9uZSwgdHJ1ZSkgOiBkYXRlO1xuICB9XG5cbiAgLy9odHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvNGRhYWZkM2RiZTZhODBkNTc4ZjVhMzFkZjFiYjk5Yzc3NTU5NTQzZS9zcmMvQW5ndWxhci5qcyNMMTIwN1xuICBmdW5jdGlvbiB0aW1lem9uZVRvT2Zmc2V0KHRpbWV6b25lLCBmYWxsYmFjaykge1xuICAgIHZhciByZXF1ZXN0ZWRUaW1lem9uZU9mZnNldCA9IERhdGUucGFyc2UoJ0phbiAwMSwgMTk3MCAwMDowMDowMCAnICsgdGltZXpvbmUpIC8gNjAwMDA7XG4gICAgcmV0dXJuIGlzTmFOKHJlcXVlc3RlZFRpbWV6b25lT2Zmc2V0KSA/IGZhbGxiYWNrIDogcmVxdWVzdGVkVGltZXpvbmVPZmZzZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBhZGREYXRlTWludXRlcyhkYXRlLCBtaW51dGVzKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcbiAgICBkYXRlLnNldE1pbnV0ZXMoZGF0ZS5nZXRNaW51dGVzKCkgKyBtaW51dGVzKTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRUaW1lem9uZVRvTG9jYWwoZGF0ZSwgdGltZXpvbmUsIHJldmVyc2UpIHtcbiAgICByZXZlcnNlID0gcmV2ZXJzZSA/IC0xIDogMTtcbiAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSB0aW1lem9uZVRvT2Zmc2V0KHRpbWV6b25lLCBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xuICAgIHJldHVybiBhZGREYXRlTWludXRlcyhkYXRlLCByZXZlcnNlICogKHRpbWV6b25lT2Zmc2V0IC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpKSk7XG4gIH1cbn1dKTtcblxuLy8gQXZvaWRpbmcgdXNlIG9mIG5nLWNsYXNzIGFzIGl0IGNyZWF0ZXMgYSBsb3Qgb2Ygd2F0Y2hlcnMgd2hlbiBhIGNsYXNzIGlzIHRvIGJlIGFwcGxpZWQgdG9cbi8vIGF0IG1vc3Qgb25lIGVsZW1lbnQuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmlzQ2xhc3MnLCBbXSlcbi5kaXJlY3RpdmUoJ3VpYklzQ2xhc3MnLCBbXG4gICAgICAgICAnJGFuaW1hdGUnLFxuZnVuY3Rpb24gKCRhbmltYXRlKSB7XG4gIC8vICAgICAgICAgICAgICAgICAgICAxMTExMTExMSAgICAgICAgICAyMjIyMjIyMlxuICB2YXIgT05fUkVHRVhQID0gL15cXHMqKFtcXHNcXFNdKz8pXFxzK29uXFxzKyhbXFxzXFxTXSs/KVxccyokLztcbiAgLy8gICAgICAgICAgICAgICAgICAgIDExMTExMTExICAgICAgICAgICAyMjIyMjIyMlxuICB2YXIgSVNfUkVHRVhQID0gL15cXHMqKFtcXHNcXFNdKz8pXFxzK2ZvclxccysoW1xcc1xcU10rPylcXHMqJC87XG5cbiAgdmFyIGRhdGFQZXJUcmFja2VkID0ge307XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICB2YXIgbGlua2VkU2NvcGVzID0gW107XG4gICAgICB2YXIgaW5zdGFuY2VzID0gW107XG4gICAgICB2YXIgZXhwVG9EYXRhID0ge307XG4gICAgICB2YXIgbGFzdEFjdGl2YXRlZCA9IG51bGw7XG4gICAgICB2YXIgb25FeHBNYXRjaGVzID0gdEF0dHJzLnVpYklzQ2xhc3MubWF0Y2goT05fUkVHRVhQKTtcbiAgICAgIHZhciBvbkV4cCA9IG9uRXhwTWF0Y2hlc1syXTtcbiAgICAgIHZhciBleHBzU3RyID0gb25FeHBNYXRjaGVzWzFdO1xuICAgICAgdmFyIGV4cHMgPSBleHBzU3RyLnNwbGl0KCcsJyk7XG5cbiAgICAgIHJldHVybiBsaW5rRm47XG5cbiAgICAgIGZ1bmN0aW9uIGxpbmtGbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgbGlua2VkU2NvcGVzLnB1c2goc2NvcGUpO1xuICAgICAgICBpbnN0YW5jZXMucHVzaCh7XG4gICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwcy5mb3JFYWNoKGZ1bmN0aW9uIChleHAsIGspIHtcbiAgICAgICAgICBhZGRGb3JFeHAoZXhwLCBzY29wZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCByZW1vdmVTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFkZEZvckV4cChleHAsIHNjb3BlKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gZXhwLm1hdGNoKElTX1JFR0VYUCk7XG4gICAgICAgIHZhciBjbGF6eiA9IHNjb3BlLiRldmFsKG1hdGNoZXNbMV0pO1xuICAgICAgICB2YXIgY29tcGFyZVdpdGhFeHAgPSBtYXRjaGVzWzJdO1xuICAgICAgICB2YXIgZGF0YSA9IGV4cFRvRGF0YVtleHBdO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICB2YXIgd2F0Y2hGbiA9IGZ1bmN0aW9uIChjb21wYXJlV2l0aFZhbCkge1xuICAgICAgICAgICAgdmFyIG5ld0FjdGl2YXRlZCA9IG51bGw7XG4gICAgICAgICAgICBpbnN0YW5jZXMuc29tZShmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgdmFyIHRoaXNWYWwgPSBpbnN0YW5jZS5zY29wZS4kZXZhbChvbkV4cCk7XG4gICAgICAgICAgICAgIGlmICh0aGlzVmFsID09PSBjb21wYXJlV2l0aFZhbCkge1xuICAgICAgICAgICAgICAgIG5ld0FjdGl2YXRlZCA9IGluc3RhbmNlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChkYXRhLmxhc3RBY3RpdmF0ZWQgIT09IG5ld0FjdGl2YXRlZCkge1xuICAgICAgICAgICAgICBpZiAoZGF0YS5sYXN0QWN0aXZhdGVkKSB7XG4gICAgICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZGF0YS5sYXN0QWN0aXZhdGVkLmVsZW1lbnQsIGNsYXp6KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAobmV3QWN0aXZhdGVkKSB7XG4gICAgICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MobmV3QWN0aXZhdGVkLmVsZW1lbnQsIGNsYXp6KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkYXRhLmxhc3RBY3RpdmF0ZWQgPSBuZXdBY3RpdmF0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBleHBUb0RhdGFbZXhwXSA9IGRhdGEgPSB7XG4gICAgICAgICAgICBsYXN0QWN0aXZhdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgd2F0Y2hGbjogd2F0Y2hGbixcbiAgICAgICAgICAgIGNvbXBhcmVXaXRoRXhwOiBjb21wYXJlV2l0aEV4cCxcbiAgICAgICAgICAgIHdhdGNoZXI6IHNjb3BlLiR3YXRjaChjb21wYXJlV2l0aEV4cCwgd2F0Y2hGbilcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGRhdGEud2F0Y2hGbihzY29wZS4kZXZhbChjb21wYXJlV2l0aEV4cCkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVTY29wZShlKSB7XG4gICAgICAgIHZhciByZW1vdmVkU2NvcGUgPSBlLnRhcmdldFNjb3BlO1xuICAgICAgICB2YXIgaW5kZXggPSBsaW5rZWRTY29wZXMuaW5kZXhPZihyZW1vdmVkU2NvcGUpO1xuICAgICAgICBsaW5rZWRTY29wZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGlmIChsaW5rZWRTY29wZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIG5ld1dhdGNoU2NvcGUgPSBsaW5rZWRTY29wZXNbMF07XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGV4cFRvRGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnNjb3BlID09PSByZW1vdmVkU2NvcGUpIHtcbiAgICAgICAgICAgICAgZGF0YS53YXRjaGVyID0gbmV3V2F0Y2hTY29wZS4kd2F0Y2goZGF0YS5jb21wYXJlV2l0aEV4cCwgZGF0YS53YXRjaEZuKTtcbiAgICAgICAgICAgICAgZGF0YS5zY29wZSA9IG5ld1dhdGNoU2NvcGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZXhwVG9EYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XSk7XG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnBvc2l0aW9uJywgW10pXG5cbi8qKlxuICogQSBzZXQgb2YgdXRpbGl0eSBtZXRob2RzIGZvciB3b3JraW5nIHdpdGggdGhlIERPTS5cbiAqIEl0IGlzIG1lYW50IHRvIGJlIHVzZWQgd2hlcmUgd2UgbmVlZCB0byBhYnNvbHV0ZS1wb3NpdGlvbiBlbGVtZW50cyBpblxuICogcmVsYXRpb24gdG8gYW5vdGhlciBlbGVtZW50ICh0aGlzIGlzIHRoZSBjYXNlIGZvciB0b29sdGlwcywgcG9wb3ZlcnMsXG4gKiB0eXBlYWhlYWQgc3VnZ2VzdGlvbnMgZXRjLikuXG4gKi9cbiAgLmZhY3RvcnkoJyR1aWJQb3NpdGlvbicsIFsnJGRvY3VtZW50JywgJyR3aW5kb3cnLCBmdW5jdGlvbigkZG9jdW1lbnQsICR3aW5kb3cpIHtcbiAgICAvKipcbiAgICAgKiBVc2VkIGJ5IHNjcm9sbGJhcldpZHRoKCkgZnVuY3Rpb24gdG8gY2FjaGUgc2Nyb2xsYmFyJ3Mgd2lkdGguXG4gICAgICogRG8gbm90IGFjY2VzcyB0aGlzIHZhcmlhYmxlIGRpcmVjdGx5LCB1c2Ugc2Nyb2xsYmFyV2lkdGgoKSBpbnN0ZWFkLlxuICAgICAqL1xuICAgIHZhciBTQ1JPTExCQVJfV0lEVEg7XG4gICAgdmFyIE9WRVJGTE9XX1JFR0VYID0ge1xuICAgICAgbm9ybWFsOiAvKGF1dG98c2Nyb2xsKS8sXG4gICAgICBoaWRkZW46IC8oYXV0b3xzY3JvbGx8aGlkZGVuKS9cbiAgICB9O1xuICAgIHZhciBQTEFDRU1FTlRfUkVHRVggPSB7XG4gICAgICBhdXRvOiAvXFxzP2F1dG8/XFxzPy9pLFxuICAgICAgcHJpbWFyeTogL14odG9wfGJvdHRvbXxsZWZ0fHJpZ2h0KSQvLFxuICAgICAgc2Vjb25kYXJ5OiAvXih0b3B8Ym90dG9tfGxlZnR8cmlnaHR8Y2VudGVyKSQvLFxuICAgICAgdmVydGljYWw6IC9eKHRvcHxib3R0b20pJC9cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm92aWRlcyBhIHJhdyBET00gZWxlbWVudCBmcm9tIGEgalF1ZXJ5L2pRTGl0ZSBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbSAtIFRoZSBlbGVtZW50IHRvIGNvbnZlcnQuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2VsZW1lbnR9IEEgSFRNTCBlbGVtZW50LlxuICAgICAgICovXG4gICAgICBnZXRSYXdOb2RlOiBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgIHJldHVybiBlbGVtWzBdIHx8IGVsZW07XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIGEgcGFyc2VkIG51bWJlciBmb3IgYSBzdHlsZSBwcm9wZXJ0eS4gIFN0cmlwc1xuICAgICAgICogdW5pdHMgYW5kIGNhc3RzIGludmFsaWQgbnVtYmVycyB0byAwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIFRoZSBzdHlsZSB2YWx1ZSB0byBwYXJzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBBIHZhbGlkIG51bWJlci5cbiAgICAgICAqL1xuICAgICAgcGFyc2VTdHlsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IHZhbHVlIDogMDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgdGhlIGNsb3Nlc3QgcG9zaXRpb25lZCBhbmNlc3Rvci5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCB0byBnZXQgdGhlIG9mZmVzdCBwYXJlbnQgZm9yLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtlbGVtZW50fSBUaGUgY2xvc2VzdCBwb3NpdGlvbmVkIGFuY2VzdG9yLlxuICAgICAgICovXG4gICAgICBvZmZzZXRQYXJlbnQ6IGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgZWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZShlbGVtKTtcblxuICAgICAgICB2YXIgb2Zmc2V0UGFyZW50ID0gZWxlbS5vZmZzZXRQYXJlbnQgfHwgJGRvY3VtZW50WzBdLmRvY3VtZW50RWxlbWVudDtcblxuICAgICAgICBmdW5jdGlvbiBpc1N0YXRpY1Bvc2l0aW9uZWQoZWwpIHtcbiAgICAgICAgICByZXR1cm4gKCR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gfHwgJ3N0YXRpYycpID09PSAnc3RhdGljJztcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0UGFyZW50ICE9PSAkZG9jdW1lbnRbMF0uZG9jdW1lbnRFbGVtZW50ICYmIGlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnQpKSB7XG4gICAgICAgICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvZmZzZXRQYXJlbnQgfHwgJGRvY3VtZW50WzBdLmRvY3VtZW50RWxlbWVudDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgdGhlIHNjcm9sbGJhciB3aWR0aCwgY29uY2VwdCBmcm9tIFRXQlMgbWVhc3VyZVNjcm9sbGJhcigpXG4gICAgICAgKiBmdW5jdGlvbiBpbiBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvanMvbW9kYWwuanNcbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgd2lkdGggb2YgdGhlIGJyb3dzZXIgc2NvbGxiYXIuXG4gICAgICAgKi9cbiAgICAgIHNjcm9sbGJhcldpZHRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoU0NST0xMQkFSX1dJRFRIKSkge1xuICAgICAgICAgIHZhciBzY3JvbGxFbGVtID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB0b3A6IC05OTk5cHg7IHdpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IG92ZXJmbG93OiBzY3JvbGw7XCI+PC9kaXY+Jyk7XG4gICAgICAgICAgJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRWxlbSk7XG4gICAgICAgICAgU0NST0xMQkFSX1dJRFRIID0gc2Nyb2xsRWxlbVswXS5vZmZzZXRXaWR0aCAtIHNjcm9sbEVsZW1bMF0uY2xpZW50V2lkdGg7XG4gICAgICAgICAgU0NST0xMQkFSX1dJRFRIID0gaXNGaW5pdGUoU0NST0xMQkFSX1dJRFRIKSA/IFNDUk9MTEJBUl9XSURUSCA6IDA7XG4gICAgICAgICAgc2Nyb2xsRWxlbS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBTQ1JPTExCQVJfV0lEVEg7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIHRoZSBjbG9zZXN0IHNjcm9sbGFibGUgYW5jZXN0b3IuXG4gICAgICAgKiBBIHBvcnQgb2YgdGhlIGpRdWVyeSBVSSBzY3JvbGxQYXJlbnQgbWV0aG9kOlxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnktdWkvYmxvYi9tYXN0ZXIvdWkvc2Nyb2xsLXBhcmVudC5qc1xuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbSAtIFRoZSBlbGVtZW50IHRvIGZpbmQgdGhlIHNjcm9sbCBwYXJlbnQgb2YuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBbaW5jbHVkZUhpZGRlbj1mYWxzZV0gLSBTaG91bGQgc2Nyb2xsIHN0eWxlIG9mICdoaWRkZW4nIGJlIGNvbnNpZGVyZWQsXG4gICAgICAgKiAgIGRlZmF1bHQgaXMgZmFsc2UuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2VsZW1lbnR9IEEgSFRNTCBlbGVtZW50LlxuICAgICAgICovXG4gICAgICBzY3JvbGxQYXJlbnQ6IGZ1bmN0aW9uKGVsZW0sIGluY2x1ZGVIaWRkZW4pIHtcbiAgICAgICAgZWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZShlbGVtKTtcblxuICAgICAgICB2YXIgb3ZlcmZsb3dSZWdleCA9IGluY2x1ZGVIaWRkZW4gPyBPVkVSRkxPV19SRUdFWC5oaWRkZW4gOiBPVkVSRkxPV19SRUdFWC5ub3JtYWw7XG4gICAgICAgIHZhciBkb2N1bWVudEVsID0gJGRvY3VtZW50WzBdLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdmFyIGVsZW1TdHlsZSA9ICR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICAgICAgdmFyIGV4Y2x1ZGVTdGF0aWMgPSBlbGVtU3R5bGUucG9zaXRpb24gPT09ICdhYnNvbHV0ZSc7XG4gICAgICAgIHZhciBzY3JvbGxQYXJlbnQgPSBlbGVtLnBhcmVudEVsZW1lbnQgfHwgZG9jdW1lbnRFbDtcblxuICAgICAgICBpZiAoc2Nyb2xsUGFyZW50ID09PSBkb2N1bWVudEVsIHx8IGVsZW1TdHlsZS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgIHJldHVybiBkb2N1bWVudEVsO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKHNjcm9sbFBhcmVudC5wYXJlbnRFbGVtZW50ICYmIHNjcm9sbFBhcmVudCAhPT0gZG9jdW1lbnRFbCkge1xuICAgICAgICAgIHZhciBzcFN0eWxlID0gJHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHNjcm9sbFBhcmVudCk7XG4gICAgICAgICAgaWYgKGV4Y2x1ZGVTdGF0aWMgJiYgc3BTdHlsZS5wb3NpdGlvbiAhPT0gJ3N0YXRpYycpIHtcbiAgICAgICAgICAgIGV4Y2x1ZGVTdGF0aWMgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWV4Y2x1ZGVTdGF0aWMgJiYgb3ZlcmZsb3dSZWdleC50ZXN0KHNwU3R5bGUub3ZlcmZsb3cgKyBzcFN0eWxlLm92ZXJmbG93WSArIHNwU3R5bGUub3ZlcmZsb3dYKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNjcm9sbFBhcmVudCA9IHNjcm9sbFBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbFBhcmVudDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgcmVhZC1vbmx5IGVxdWl2YWxlbnQgb2YgalF1ZXJ5J3MgcG9zaXRpb24gZnVuY3Rpb246XG4gICAgICAgKiBodHRwOi8vYXBpLmpxdWVyeS5jb20vcG9zaXRpb24vIC0gZGlzdGFuY2UgdG8gY2xvc2VzdCBwb3NpdGlvbmVkXG4gICAgICAgKiBhbmNlc3Rvci4gIERvZXMgbm90IGFjY291bnQgZm9yIG1hcmdpbnMgYnkgZGVmYXVsdCBsaWtlIGpRdWVyeSBwb3NpdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW0gLSBUaGUgZWxlbWVudCB0byBjYWNsdWxhdGUgdGhlIHBvc2l0aW9uIG9uLlxuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gW2luY2x1ZGVNYXJnaW5zPWZhbHNlXSAtIFNob3VsZCBtYXJnaW5zIGJlIGFjY291bnRlZFxuICAgICAgICogZm9yLCBkZWZhdWx0IGlzIGZhbHNlLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICAgICAqICAgPHVsPlxuICAgICAgICogICAgIDxsaT4qKndpZHRoKio6IHRoZSB3aWR0aCBvZiB0aGUgZWxlbWVudDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqaGVpZ2h0Kio6IHRoZSBoZWlnaHQgb2YgdGhlIGVsZW1lbnQ8L2xpPlxuICAgICAgICogICAgIDxsaT4qKnRvcCoqOiBkaXN0YW5jZSB0byB0b3AgZWRnZSBvZiBvZmZzZXQgcGFyZW50PC9saT5cbiAgICAgICAqICAgICA8bGk+KipsZWZ0Kio6IGRpc3RhbmNlIHRvIGxlZnQgZWRnZSBvZiBvZmZzZXQgcGFyZW50PC9saT5cbiAgICAgICAqICAgPC91bD5cbiAgICAgICAqL1xuICAgICAgcG9zaXRpb246IGZ1bmN0aW9uKGVsZW0sIGluY2x1ZGVNYWdpbnMpIHtcbiAgICAgICAgZWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZShlbGVtKTtcblxuICAgICAgICB2YXIgZWxlbU9mZnNldCA9IHRoaXMub2Zmc2V0KGVsZW0pO1xuICAgICAgICBpZiAoaW5jbHVkZU1hZ2lucykge1xuICAgICAgICAgIHZhciBlbGVtU3R5bGUgPSAkd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG4gICAgICAgICAgZWxlbU9mZnNldC50b3AgLT0gdGhpcy5wYXJzZVN0eWxlKGVsZW1TdHlsZS5tYXJnaW5Ub3ApO1xuICAgICAgICAgIGVsZW1PZmZzZXQubGVmdCAtPSB0aGlzLnBhcnNlU3R5bGUoZWxlbVN0eWxlLm1hcmdpbkxlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudChlbGVtKTtcbiAgICAgICAgdmFyIHBhcmVudE9mZnNldCA9IHt0b3A6IDAsIGxlZnQ6IDB9O1xuXG4gICAgICAgIGlmIChwYXJlbnQgIT09ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICBwYXJlbnRPZmZzZXQgPSB0aGlzLm9mZnNldChwYXJlbnQpO1xuICAgICAgICAgIHBhcmVudE9mZnNldC50b3AgKz0gcGFyZW50LmNsaWVudFRvcCAtIHBhcmVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gcGFyZW50LmNsaWVudExlZnQgLSBwYXJlbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoYW5ndWxhci5pc051bWJlcihlbGVtT2Zmc2V0LndpZHRoKSA/IGVsZW1PZmZzZXQud2lkdGggOiBlbGVtLm9mZnNldFdpZHRoKSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoYW5ndWxhci5pc051bWJlcihlbGVtT2Zmc2V0LmhlaWdodCkgPyBlbGVtT2Zmc2V0LmhlaWdodCA6IGVsZW0ub2Zmc2V0SGVpZ2h0KSxcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQoZWxlbU9mZnNldC50b3AgLSBwYXJlbnRPZmZzZXQudG9wKSxcbiAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKGVsZW1PZmZzZXQubGVmdCAtIHBhcmVudE9mZnNldC5sZWZ0KVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm92aWRlcyByZWFkLW9ubHkgZXF1aXZhbGVudCBvZiBqUXVlcnkncyBvZmZzZXQgZnVuY3Rpb246XG4gICAgICAgKiBodHRwOi8vYXBpLmpxdWVyeS5jb20vb2Zmc2V0LyAtIGRpc3RhbmNlIHRvIHZpZXdwb3J0LiAgRG9lc1xuICAgICAgICogbm90IGFjY291bnQgZm9yIGJvcmRlcnMsIG1hcmdpbnMsIG9yIHBhZGRpbmcgb24gdGhlIGJvZHlcbiAgICAgICAqIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtIC0gVGhlIGVsZW1lbnQgdG8gY2FsY3VsYXRlIHRoZSBvZmZzZXQgb24uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH0gQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICogICA8dWw+XG4gICAgICAgKiAgICAgPGxpPioqd2lkdGgqKjogdGhlIHdpZHRoIG9mIHRoZSBlbGVtZW50PC9saT5cbiAgICAgICAqICAgICA8bGk+KipoZWlnaHQqKjogdGhlIGhlaWdodCBvZiB0aGUgZWxlbWVudDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqdG9wKio6IGRpc3RhbmNlIHRvIHRvcCBlZGdlIG9mIHZpZXdwb3J0PC9saT5cbiAgICAgICAqICAgICA8bGk+KipyaWdodCoqOiBkaXN0YW5jZSB0byBib3R0b20gZWRnZSBvZiB2aWV3cG9ydDwvbGk+XG4gICAgICAgKiAgIDwvdWw+XG4gICAgICAgKi9cbiAgICAgIG9mZnNldDogZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICBlbGVtID0gdGhpcy5nZXRSYXdOb2RlKGVsZW0pO1xuXG4gICAgICAgIHZhciBlbGVtQkNSID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB3aWR0aDogTWF0aC5yb3VuZChhbmd1bGFyLmlzTnVtYmVyKGVsZW1CQ1Iud2lkdGgpID8gZWxlbUJDUi53aWR0aCA6IGVsZW0ub2Zmc2V0V2lkdGgpLFxuICAgICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChhbmd1bGFyLmlzTnVtYmVyKGVsZW1CQ1IuaGVpZ2h0KSA/IGVsZW1CQ1IuaGVpZ2h0IDogZWxlbS5vZmZzZXRIZWlnaHQpLFxuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChlbGVtQkNSLnRvcCArICgkd2luZG93LnBhZ2VZT2Zmc2V0IHx8ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wKSksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChlbGVtQkNSLmxlZnQgKyAoJHdpbmRvdy5wYWdlWE9mZnNldCB8fCAkZG9jdW1lbnRbMF0uZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQpKVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm92aWRlcyBvZmZzZXQgZGlzdGFuY2UgdG8gdGhlIGNsb3Nlc3Qgc2Nyb2xsYWJsZSBhbmNlc3RvclxuICAgICAgICogb3Igdmlld3BvcnQuICBBY2NvdW50cyBmb3IgYm9yZGVyIGFuZCBzY3JvbGxiYXIgd2lkdGguXG4gICAgICAgKlxuICAgICAgICogUmlnaHQgYW5kIGJvdHRvbSBkaW1lbnNpb25zIHJlcHJlc2VudCB0aGUgZGlzdGFuY2UgdG8gdGhlXG4gICAgICAgKiByZXNwZWN0aXZlIGVkZ2Ugb2YgdGhlIHZpZXdwb3J0IGVsZW1lbnQuICBJZiB0aGUgZWxlbWVudFxuICAgICAgICogZWRnZSBleHRlbmRzIGJleW9uZCB0aGUgdmlld3BvcnQsIGEgbmVnYXRpdmUgdmFsdWUgd2lsbCBiZVxuICAgICAgICogcmVwb3J0ZWQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtIC0gVGhlIGVsZW1lbnQgdG8gZ2V0IHRoZSB2aWV3cG9ydCBvZmZzZXQgZm9yLlxuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gW3VzZURvY3VtZW50PWZhbHNlXSAtIFNob3VsZCB0aGUgdmlld3BvcnQgYmUgdGhlIGRvY3VtZW50IGVsZW1lbnQgaW5zdGVhZFxuICAgICAgICogb2YgdGhlIGZpcnN0IHNjcm9sbGFibGUgZWxlbWVudCwgZGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IFtpbmNsdWRlUGFkZGluZz10cnVlXSAtIFNob3VsZCB0aGUgcGFkZGluZyBvbiB0aGUgb2Zmc2V0IHBhcmVudCBlbGVtZW50XG4gICAgICAgKiBiZSBhY2NvdW50ZWQgZm9yLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH0gQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICogICA8dWw+XG4gICAgICAgKiAgICAgPGxpPioqdG9wKio6IGRpc3RhbmNlIHRvIHRoZSB0b3AgY29udGVudCBlZGdlIG9mIHZpZXdwb3J0IGVsZW1lbnQ8L2xpPlxuICAgICAgICogICAgIDxsaT4qKmJvdHRvbSoqOiBkaXN0YW5jZSB0byB0aGUgYm90dG9tIGNvbnRlbnQgZWRnZSBvZiB2aWV3cG9ydCBlbGVtZW50PC9saT5cbiAgICAgICAqICAgICA8bGk+KipsZWZ0Kio6IGRpc3RhbmNlIHRvIHRoZSBsZWZ0IGNvbnRlbnQgZWRnZSBvZiB2aWV3cG9ydCBlbGVtZW50PC9saT5cbiAgICAgICAqICAgICA8bGk+KipyaWdodCoqOiBkaXN0YW5jZSB0byB0aGUgcmlnaHQgY29udGVudCBlZGdlIG9mIHZpZXdwb3J0IGVsZW1lbnQ8L2xpPlxuICAgICAgICogICA8L3VsPlxuICAgICAgICovXG4gICAgICB2aWV3cG9ydE9mZnNldDogZnVuY3Rpb24oZWxlbSwgdXNlRG9jdW1lbnQsIGluY2x1ZGVQYWRkaW5nKSB7XG4gICAgICAgIGVsZW0gPSB0aGlzLmdldFJhd05vZGUoZWxlbSk7XG4gICAgICAgIGluY2x1ZGVQYWRkaW5nID0gaW5jbHVkZVBhZGRpbmcgIT09IGZhbHNlID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgIHZhciBlbGVtQkNSID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIG9mZnNldEJDUiA9IHt0b3A6IDAsIGxlZnQ6IDAsIGJvdHRvbTogMCwgcmlnaHQ6IDB9O1xuXG4gICAgICAgIHZhciBvZmZzZXRQYXJlbnQgPSB1c2VEb2N1bWVudCA/ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQgOiB0aGlzLnNjcm9sbFBhcmVudChlbGVtKTtcbiAgICAgICAgdmFyIG9mZnNldFBhcmVudEJDUiA9IG9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICBvZmZzZXRCQ1IudG9wID0gb2Zmc2V0UGFyZW50QkNSLnRvcCArIG9mZnNldFBhcmVudC5jbGllbnRUb3A7XG4gICAgICAgIG9mZnNldEJDUi5sZWZ0ID0gb2Zmc2V0UGFyZW50QkNSLmxlZnQgKyBvZmZzZXRQYXJlbnQuY2xpZW50TGVmdDtcbiAgICAgICAgaWYgKG9mZnNldFBhcmVudCA9PT0gJGRvY3VtZW50WzBdLmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgIG9mZnNldEJDUi50b3AgKz0gJHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICBvZmZzZXRCQ1IubGVmdCArPSAkd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldEJDUi5ib3R0b20gPSBvZmZzZXRCQ1IudG9wICsgb2Zmc2V0UGFyZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgb2Zmc2V0QkNSLnJpZ2h0ID0gb2Zmc2V0QkNSLmxlZnQgKyBvZmZzZXRQYXJlbnQuY2xpZW50V2lkdGg7XG5cbiAgICAgICAgaWYgKGluY2x1ZGVQYWRkaW5nKSB7XG4gICAgICAgICAgdmFyIG9mZnNldFBhcmVudFN0eWxlID0gJHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCk7XG4gICAgICAgICAgb2Zmc2V0QkNSLnRvcCArPSB0aGlzLnBhcnNlU3R5bGUob2Zmc2V0UGFyZW50U3R5bGUucGFkZGluZ1RvcCk7XG4gICAgICAgICAgb2Zmc2V0QkNSLmJvdHRvbSAtPSB0aGlzLnBhcnNlU3R5bGUob2Zmc2V0UGFyZW50U3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgICAgICAgb2Zmc2V0QkNSLmxlZnQgKz0gdGhpcy5wYXJzZVN0eWxlKG9mZnNldFBhcmVudFN0eWxlLnBhZGRpbmdMZWZ0KTtcbiAgICAgICAgICBvZmZzZXRCQ1IucmlnaHQgLT0gdGhpcy5wYXJzZVN0eWxlKG9mZnNldFBhcmVudFN0eWxlLnBhZGRpbmdSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChlbGVtQkNSLnRvcCAtIG9mZnNldEJDUi50b3ApLFxuICAgICAgICAgIGJvdHRvbTogTWF0aC5yb3VuZChvZmZzZXRCQ1IuYm90dG9tIC0gZWxlbUJDUi5ib3R0b20pLFxuICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQoZWxlbUJDUi5sZWZ0IC0gb2Zmc2V0QkNSLmxlZnQpLFxuICAgICAgICAgIHJpZ2h0OiBNYXRoLnJvdW5kKG9mZnNldEJDUi5yaWdodCAtIGVsZW1CQ1IucmlnaHQpXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIGFuIGFycmF5IG9mIHBsYWNlbWVudCB2YWx1ZXMgcGFyc2VkIGZyb20gYSBwbGFjZW1lbnQgc3RyaW5nLlxuICAgICAgICogQWxvbmcgd2l0aCB0aGUgJ2F1dG8nIGluZGljYXRvciwgc3VwcG9ydGVkIHBsYWNlbWVudCBzdHJpbmdzIGFyZTpcbiAgICAgICAqICAgPHVsPlxuICAgICAgICogICAgIDxsaT50b3A6IGVsZW1lbnQgb24gdG9wLCBob3Jpem9udGFsbHkgY2VudGVyZWQgb24gaG9zdCBlbGVtZW50LjwvbGk+XG4gICAgICAgKiAgICAgPGxpPnRvcC1sZWZ0OiBlbGVtZW50IG9uIHRvcCwgbGVmdCBlZGdlIGFsaWduZWQgd2l0aCBob3N0IGVsZW1lbnQgbGVmdCBlZGdlLjwvbGk+XG4gICAgICAgKiAgICAgPGxpPnRvcC1yaWdodDogZWxlbWVudCBvbiB0b3AsIGxlcmlnaHRmdCBlZGdlIGFsaWduZWQgd2l0aCBob3N0IGVsZW1lbnQgcmlnaHQgZWRnZS48L2xpPlxuICAgICAgICogICAgIDxsaT5ib3R0b206IGVsZW1lbnQgb24gYm90dG9tLCBob3Jpem9udGFsbHkgY2VudGVyZWQgb24gaG9zdCBlbGVtZW50LjwvbGk+XG4gICAgICAgKiAgICAgPGxpPmJvdHRvbS1sZWZ0OiBlbGVtZW50IG9uIGJvdHRvbSwgbGVmdCBlZGdlIGFsaWduZWQgd2l0aCBob3N0IGVsZW1lbnQgbGVmdCBlZGdlLjwvbGk+XG4gICAgICAgKiAgICAgPGxpPmJvdHRvbS1yaWdodDogZWxlbWVudCBvbiBib3R0b20sIHJpZ2h0IGVkZ2UgYWxpZ25lZCB3aXRoIGhvc3QgZWxlbWVudCByaWdodCBlZGdlLjwvbGk+XG4gICAgICAgKiAgICAgPGxpPmxlZnQ6IGVsZW1lbnQgb24gbGVmdCwgdmVydGljYWxseSBjZW50ZXJlZCBvbiBob3N0IGVsZW1lbnQuPC9saT5cbiAgICAgICAqICAgICA8bGk+bGVmdC10b3A6IGVsZW1lbnQgb24gbGVmdCwgdG9wIGVkZ2UgYWxpZ25lZCB3aXRoIGhvc3QgZWxlbWVudCB0b3AgZWRnZS48L2xpPlxuICAgICAgICogICAgIDxsaT5sZWZ0LWJvdHRvbTogZWxlbWVudCBvbiBsZWZ0LCBib3R0b20gZWRnZSBhbGlnbmVkIHdpdGggaG9zdCBlbGVtZW50IGJvdHRvbSBlZGdlLjwvbGk+XG4gICAgICAgKiAgICAgPGxpPnJpZ2h0OiBlbGVtZW50IG9uIHJpZ2h0LCB2ZXJ0aWNhbGx5IGNlbnRlcmVkIG9uIGhvc3QgZWxlbWVudC48L2xpPlxuICAgICAgICogICAgIDxsaT5yaWdodC10b3A6IGVsZW1lbnQgb24gcmlnaHQsIHRvcCBlZGdlIGFsaWduZWQgd2l0aCBob3N0IGVsZW1lbnQgdG9wIGVkZ2UuPC9saT5cbiAgICAgICAqICAgICA8bGk+cmlnaHQtYm90dG9tOiBlbGVtZW50IG9uIHJpZ2h0LCBib3R0b20gZWRnZSBhbGlnbmVkIHdpdGggaG9zdCBlbGVtZW50IGJvdHRvbSBlZGdlLjwvbGk+XG4gICAgICAgKiAgIDwvdWw+XG4gICAgICAgKiBBIHBsYWNlbWVudCBzdHJpbmcgd2l0aCBhbiAnYXV0bycgaW5kaWNhdG9yIGlzIGV4cGVjdGVkIHRvIGJlXG4gICAgICAgKiBzcGFjZSBzZXBhcmF0ZWQgZnJvbSB0aGUgcGxhY2VtZW50LCBpLmU6ICdhdXRvIGJvdHRvbS1sZWZ0JyAgSWZcbiAgICAgICAqIHRoZSBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgcGxhY2VtZW50IHZhbHVlcyBkbyBub3QgbWF0Y2ggJ3RvcCxcbiAgICAgICAqIGJvdHRvbSwgbGVmdCwgcmlnaHQnIHRoZW4gJ3RvcCcgd2lsbCBiZSB0aGUgcHJpbWFyeSBwbGFjZW1lbnQgYW5kXG4gICAgICAgKiAnY2VudGVyJyB3aWxsIGJlIHRoZSBzZWNvbmRhcnkgcGxhY2VtZW50LiAgSWYgJ2F1dG8nIGlzIHBhc3NlZCwgdHJ1ZVxuICAgICAgICogd2lsbCBiZSByZXR1cm5lZCBhcyB0aGUgM3JkIHZhbHVlIG9mIHRoZSBhcnJheS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGxhY2VtZW50IC0gVGhlIHBsYWNlbWVudCBzdHJpbmcgdG8gcGFyc2UuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2FycmF5fSBBbiBhcnJheSB3aXRoIHRoZSBmb2xsb3dpbmcgdmFsdWVzXG4gICAgICAgKiA8dWw+XG4gICAgICAgKiAgIDxsaT4qKlswXSoqOiBUaGUgcHJpbWFyeSBwbGFjZW1lbnQuPC9saT5cbiAgICAgICAqICAgPGxpPioqWzFdKio6IFRoZSBzZWNvbmRhcnkgcGxhY2VtZW50LjwvbGk+XG4gICAgICAgKiAgIDxsaT4qKlsyXSoqOiBJZiBhdXRvIGlzIHBhc3NlZDogdHJ1ZSwgZWxzZSB1bmRlZmluZWQuPC9saT5cbiAgICAgICAqIDwvdWw+XG4gICAgICAgKi9cbiAgICAgIHBhcnNlUGxhY2VtZW50OiBmdW5jdGlvbihwbGFjZW1lbnQpIHtcbiAgICAgICAgdmFyIGF1dG9QbGFjZSA9IFBMQUNFTUVOVF9SRUdFWC5hdXRvLnRlc3QocGxhY2VtZW50KTtcbiAgICAgICAgaWYgKGF1dG9QbGFjZSkge1xuICAgICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKFBMQUNFTUVOVF9SRUdFWC5hdXRvLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKTtcblxuICAgICAgICBwbGFjZW1lbnRbMF0gPSBwbGFjZW1lbnRbMF0gfHwgJ3RvcCc7XG4gICAgICAgIGlmICghUExBQ0VNRU5UX1JFR0VYLnByaW1hcnkudGVzdChwbGFjZW1lbnRbMF0pKSB7XG4gICAgICAgICAgcGxhY2VtZW50WzBdID0gJ3RvcCc7XG4gICAgICAgIH1cblxuICAgICAgICBwbGFjZW1lbnRbMV0gPSBwbGFjZW1lbnRbMV0gfHwgJ2NlbnRlcic7XG4gICAgICAgIGlmICghUExBQ0VNRU5UX1JFR0VYLnNlY29uZGFyeS50ZXN0KHBsYWNlbWVudFsxXSkpIHtcbiAgICAgICAgICBwbGFjZW1lbnRbMV0gPSAnY2VudGVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgICBwbGFjZW1lbnRbMl0gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYWNlbWVudFsyXSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYWNlbWVudDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgY29vcmRpbmF0ZXMgZm9yIGFuIGVsZW1lbnQgdG8gYmUgcG9zaXRpb25lZCByZWxhdGl2ZSB0b1xuICAgICAgICogYW5vdGhlciBlbGVtZW50LiAgUGFzc2luZyAnYXV0bycgYXMgcGFydCBvZiB0aGUgcGxhY2VtZW50IHBhcmFtZXRlclxuICAgICAgICogd2lsbCBlbmFibGUgc21hcnQgcGxhY2VtZW50IC0gd2hlcmUgdGhlIGVsZW1lbnQgZml0cy4gaS5lOlxuICAgICAgICogJ2F1dG8gbGVmdC10b3AnIHdpbGwgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSB0byB0aGUgbGVmdFxuICAgICAgICogb2YgdGhlIGhvc3RFbGVtIHRvIGZpdCB0aGUgdGFyZ2V0RWxlbSwgaWYgbm90IHBsYWNlIHJpZ2h0IChzYW1lIGZvciBzZWNvbmRhcnlcbiAgICAgICAqIHRvcCBwbGFjZW1lbnQpLiAgQXZhaWxhYmxlIHNwYWNlIGlzIGNhbGN1bGF0ZWQgdXNpbmcgdGhlIHZpZXdwb3J0T2Zmc2V0XG4gICAgICAgKiBmdW5jdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGhvc3RFbGVtIC0gVGhlIGVsZW1lbnQgdG8gcG9zaXRpb24gYWdhaW5zdC5cbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gdGFyZ2V0RWxlbSAtIFRoZSBlbGVtZW50IHRvIHBvc2l0aW9uLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBbcGxhY2VtZW50PXRvcF0gLSBUaGUgcGxhY2VtZW50IGZvciB0aGUgdGFyZ2V0RWxlbSxcbiAgICAgICAqICAgZGVmYXVsdCBpcyAndG9wJy4gJ2NlbnRlcicgaXMgYXNzdW1lZCBhcyBzZWNvbmRhcnkgcGxhY2VtZW50IGZvclxuICAgICAgICogICAndG9wJywgJ2xlZnQnLCAncmlnaHQnLCBhbmQgJ2JvdHRvbScgcGxhY2VtZW50cy4gIEF2YWlsYWJsZSBwbGFjZW1lbnRzIGFyZTpcbiAgICAgICAqICAgPHVsPlxuICAgICAgICogICAgIDxsaT50b3A8L2xpPlxuICAgICAgICogICAgIDxsaT50b3AtcmlnaHQ8L2xpPlxuICAgICAgICogICAgIDxsaT50b3AtbGVmdDwvbGk+XG4gICAgICAgKiAgICAgPGxpPmJvdHRvbTwvbGk+XG4gICAgICAgKiAgICAgPGxpPmJvdHRvbS1sZWZ0PC9saT5cbiAgICAgICAqICAgICA8bGk+Ym90dG9tLXJpZ2h0PC9saT5cbiAgICAgICAqICAgICA8bGk+bGVmdDwvbGk+XG4gICAgICAgKiAgICAgPGxpPmxlZnQtdG9wPC9saT5cbiAgICAgICAqICAgICA8bGk+bGVmdC1ib3R0b208L2xpPlxuICAgICAgICogICAgIDxsaT5yaWdodDwvbGk+XG4gICAgICAgKiAgICAgPGxpPnJpZ2h0LXRvcDwvbGk+XG4gICAgICAgKiAgICAgPGxpPnJpZ2h0LWJvdHRvbTwvbGk+XG4gICAgICAgKiAgIDwvdWw+XG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBbYXBwZW5kVG9Cb2R5PWZhbHNlXSAtIFNob3VsZCB0aGUgdG9wIGFuZCBsZWZ0IHZhbHVlcyByZXR1cm5lZFxuICAgICAgICogICBiZSBjYWxjdWxhdGVkIGZyb20gdGhlIGJvZHkgZWxlbWVudCwgZGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAgICAgKiAgIDx1bD5cbiAgICAgICAqICAgICA8bGk+Kip0b3AqKjogVmFsdWUgZm9yIHRhcmdldEVsZW0gdG9wLjwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqbGVmdCoqOiBWYWx1ZSBmb3IgdGFyZ2V0RWxlbSBsZWZ0LjwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqcGxhY2VtZW50Kio6IFRoZSByZXNvbHZlZCBwbGFjZW1lbnQuPC9saT5cbiAgICAgICAqICAgPC91bD5cbiAgICAgICAqL1xuICAgICAgcG9zaXRpb25FbGVtZW50czogZnVuY3Rpb24oaG9zdEVsZW0sIHRhcmdldEVsZW0sIHBsYWNlbWVudCwgYXBwZW5kVG9Cb2R5KSB7XG4gICAgICAgIGhvc3RFbGVtID0gdGhpcy5nZXRSYXdOb2RlKGhvc3RFbGVtKTtcbiAgICAgICAgdGFyZ2V0RWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZSh0YXJnZXRFbGVtKTtcblxuICAgICAgICAvLyBuZWVkIHRvIHJlYWQgZnJvbSBwcm9wIHRvIHN1cHBvcnQgdGVzdHMuXG4gICAgICAgIHZhciB0YXJnZXRXaWR0aCA9IGFuZ3VsYXIuaXNEZWZpbmVkKHRhcmdldEVsZW0ub2Zmc2V0V2lkdGgpID8gdGFyZ2V0RWxlbS5vZmZzZXRXaWR0aCA6IHRhcmdldEVsZW0ucHJvcCgnb2Zmc2V0V2lkdGgnKTtcbiAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IGFuZ3VsYXIuaXNEZWZpbmVkKHRhcmdldEVsZW0ub2Zmc2V0SGVpZ2h0KSA/IHRhcmdldEVsZW0ub2Zmc2V0SGVpZ2h0IDogdGFyZ2V0RWxlbS5wcm9wKCdvZmZzZXRIZWlnaHQnKTtcblxuICAgICAgICBwbGFjZW1lbnQgPSB0aGlzLnBhcnNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICAgICAgdmFyIGhvc3RFbGVtUG9zID0gYXBwZW5kVG9Cb2R5ID8gdGhpcy5vZmZzZXQoaG9zdEVsZW0pIDogdGhpcy5wb3NpdGlvbihob3N0RWxlbSk7XG4gICAgICAgIHZhciB0YXJnZXRFbGVtUG9zID0ge3RvcDogMCwgbGVmdDogMCwgcGxhY2VtZW50OiAnJ307XG5cbiAgICAgICAgaWYgKHBsYWNlbWVudFsyXSkge1xuICAgICAgICAgIHZhciB2aWV3cG9ydE9mZnNldCA9IHRoaXMudmlld3BvcnRPZmZzZXQoaG9zdEVsZW0pO1xuXG4gICAgICAgICAgdmFyIHRhcmdldEVsZW1TdHlsZSA9ICR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXRFbGVtKTtcbiAgICAgICAgICB2YXIgYWRqdXN0ZWRTaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6IHRhcmdldFdpZHRoICsgTWF0aC5yb3VuZChNYXRoLmFicyh0aGlzLnBhcnNlU3R5bGUodGFyZ2V0RWxlbVN0eWxlLm1hcmdpbkxlZnQpICsgdGhpcy5wYXJzZVN0eWxlKHRhcmdldEVsZW1TdHlsZS5tYXJnaW5SaWdodCkpKSxcbiAgICAgICAgICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0ICsgTWF0aC5yb3VuZChNYXRoLmFicyh0aGlzLnBhcnNlU3R5bGUodGFyZ2V0RWxlbVN0eWxlLm1hcmdpblRvcCkgKyB0aGlzLnBhcnNlU3R5bGUodGFyZ2V0RWxlbVN0eWxlLm1hcmdpbkJvdHRvbSkpKVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBwbGFjZW1lbnRbMF0gPSBwbGFjZW1lbnRbMF0gPT09ICd0b3AnICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgPiB2aWV3cG9ydE9mZnNldC50b3AgJiYgYWRqdXN0ZWRTaXplLmhlaWdodCA8PSB2aWV3cG9ydE9mZnNldC5ib3R0b20gPyAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50WzBdID09PSAnYm90dG9tJyAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0ID4gdmlld3BvcnRPZmZzZXQuYm90dG9tICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgPD0gdmlld3BvcnRPZmZzZXQudG9wID8gJ3RvcCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFswXSA9PT0gJ2xlZnQnICYmIGFkanVzdGVkU2l6ZS53aWR0aCA+IHZpZXdwb3J0T2Zmc2V0LmxlZnQgJiYgYWRqdXN0ZWRTaXplLndpZHRoIDw9IHZpZXdwb3J0T2Zmc2V0LnJpZ2h0ID8gJ3JpZ2h0JyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50WzBdID09PSAncmlnaHQnICYmIGFkanVzdGVkU2l6ZS53aWR0aCA+IHZpZXdwb3J0T2Zmc2V0LnJpZ2h0ICYmIGFkanVzdGVkU2l6ZS53aWR0aCA8PSB2aWV3cG9ydE9mZnNldC5sZWZ0ID8gJ2xlZnQnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMF07XG5cbiAgICAgICAgICBwbGFjZW1lbnRbMV0gPSBwbGFjZW1lbnRbMV0gPT09ICd0b3AnICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgLSBob3N0RWxlbVBvcy5oZWlnaHQgPiB2aWV3cG9ydE9mZnNldC5ib3R0b20gJiYgYWRqdXN0ZWRTaXplLmhlaWdodCAtIGhvc3RFbGVtUG9zLmhlaWdodCA8PSB2aWV3cG9ydE9mZnNldC50b3AgPyAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50WzFdID09PSAnYm90dG9tJyAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0IC0gaG9zdEVsZW1Qb3MuaGVpZ2h0ID4gdmlld3BvcnRPZmZzZXQudG9wICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgLSBob3N0RWxlbVBvcy5oZWlnaHQgPD0gdmlld3BvcnRPZmZzZXQuYm90dG9tID8gJ3RvcCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFsxXSA9PT0gJ2xlZnQnICYmIGFkanVzdGVkU2l6ZS53aWR0aCAtIGhvc3RFbGVtUG9zLndpZHRoID4gdmlld3BvcnRPZmZzZXQucmlnaHQgJiYgYWRqdXN0ZWRTaXplLndpZHRoIC0gaG9zdEVsZW1Qb3Mud2lkdGggPD0gdmlld3BvcnRPZmZzZXQubGVmdCA/ICdyaWdodCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFsxXSA9PT0gJ3JpZ2h0JyAmJiBhZGp1c3RlZFNpemUud2lkdGggLSBob3N0RWxlbVBvcy53aWR0aCA+IHZpZXdwb3J0T2Zmc2V0LmxlZnQgJiYgYWRqdXN0ZWRTaXplLndpZHRoIC0gaG9zdEVsZW1Qb3Mud2lkdGggPD0gdmlld3BvcnRPZmZzZXQucmlnaHQgPyAnbGVmdCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFsxXTtcblxuICAgICAgICAgIGlmIChwbGFjZW1lbnRbMV0gPT09ICdjZW50ZXInKSB7XG4gICAgICAgICAgICBpZiAoUExBQ0VNRU5UX1JFR0VYLnZlcnRpY2FsLnRlc3QocGxhY2VtZW50WzBdKSkge1xuICAgICAgICAgICAgICB2YXIgeE92ZXJmbG93ID0gaG9zdEVsZW1Qb3Mud2lkdGggLyAyIC0gdGFyZ2V0V2lkdGggLyAyO1xuICAgICAgICAgICAgICBpZiAodmlld3BvcnRPZmZzZXQubGVmdCArIHhPdmVyZmxvdyA8IDAgJiYgYWRqdXN0ZWRTaXplLndpZHRoIC0gaG9zdEVsZW1Qb3Mud2lkdGggPD0gdmlld3BvcnRPZmZzZXQucmlnaHQpIHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV0gPSAnbGVmdCc7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodmlld3BvcnRPZmZzZXQucmlnaHQgKyB4T3ZlcmZsb3cgPCAwICYmIGFkanVzdGVkU2l6ZS53aWR0aCAtIGhvc3RFbGVtUG9zLndpZHRoIDw9IHZpZXdwb3J0T2Zmc2V0LmxlZnQpIHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV0gPSAncmlnaHQnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgeU92ZXJmbG93ID0gaG9zdEVsZW1Qb3MuaGVpZ2h0IC8gMiAtIGFkanVzdGVkU2l6ZS5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgICBpZiAodmlld3BvcnRPZmZzZXQudG9wICsgeU92ZXJmbG93IDwgMCAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0IC0gaG9zdEVsZW1Qb3MuaGVpZ2h0IDw9IHZpZXdwb3J0T2Zmc2V0LmJvdHRvbSkge1xuICAgICAgICAgICAgICAgIHBsYWNlbWVudFsxXSA9ICd0b3AnO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZpZXdwb3J0T2Zmc2V0LmJvdHRvbSArIHlPdmVyZmxvdyA8IDAgJiYgYWRqdXN0ZWRTaXplLmhlaWdodCAtIGhvc3RFbGVtUG9zLmhlaWdodCA8PSB2aWV3cG9ydE9mZnNldC50b3ApIHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV0gPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocGxhY2VtZW50WzBdKSB7XG4gICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MudG9wID0gaG9zdEVsZW1Qb3MudG9wIC0gdGFyZ2V0SGVpZ2h0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MudG9wID0gaG9zdEVsZW1Qb3MudG9wICsgaG9zdEVsZW1Qb3MuaGVpZ2h0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLmxlZnQgPSBob3N0RWxlbVBvcy5sZWZ0IC0gdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLmxlZnQgPSBob3N0RWxlbVBvcy5sZWZ0ICsgaG9zdEVsZW1Qb3Mud2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocGxhY2VtZW50WzFdKSB7XG4gICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MudG9wID0gaG9zdEVsZW1Qb3MudG9wO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MudG9wID0gaG9zdEVsZW1Qb3MudG9wICsgaG9zdEVsZW1Qb3MuaGVpZ2h0IC0gdGFyZ2V0SGVpZ2h0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLmxlZnQgPSBob3N0RWxlbVBvcy5sZWZ0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgdGFyZ2V0RWxlbVBvcy5sZWZ0ID0gaG9zdEVsZW1Qb3MubGVmdCArIGhvc3RFbGVtUG9zLndpZHRoIC0gdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICAgICAgaWYgKFBMQUNFTUVOVF9SRUdFWC52ZXJ0aWNhbC50ZXN0KHBsYWNlbWVudFswXSkpIHtcbiAgICAgICAgICAgICAgdGFyZ2V0RWxlbVBvcy5sZWZ0ID0gaG9zdEVsZW1Qb3MubGVmdCArIGhvc3RFbGVtUG9zLndpZHRoIC8gMiAtIHRhcmdldFdpZHRoIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MudG9wID0gaG9zdEVsZW1Qb3MudG9wICsgaG9zdEVsZW1Qb3MuaGVpZ2h0IC8gMiAtIHRhcmdldEhlaWdodCAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldEVsZW1Qb3MudG9wID0gTWF0aC5yb3VuZCh0YXJnZXRFbGVtUG9zLnRvcCk7XG4gICAgICAgIHRhcmdldEVsZW1Qb3MubGVmdCA9IE1hdGgucm91bmQodGFyZ2V0RWxlbVBvcy5sZWZ0KTtcbiAgICAgICAgdGFyZ2V0RWxlbVBvcy5wbGFjZW1lbnQgPSBwbGFjZW1lbnRbMV0gPT09ICdjZW50ZXInID8gcGxhY2VtZW50WzBdIDogcGxhY2VtZW50WzBdICsgJy0nICsgcGxhY2VtZW50WzFdO1xuXG4gICAgICAgIHJldHVybiB0YXJnZXRFbGVtUG9zO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAqIFByb3ZpZGVzIGEgd2F5IGZvciBwb3NpdGlvbmluZyB0b29sdGlwICYgZHJvcGRvd25cbiAgICAgICogYXJyb3dzIHdoZW4gdXNpbmcgcGxhY2VtZW50IG9wdGlvbnMgYmV5b25kIHRoZSBzdGFuZGFyZFxuICAgICAgKiBsZWZ0LCByaWdodCwgdG9wLCBvciBib3R0b20uXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbSAtIFRoZSB0b29sdGlwL2Ryb3Bkb3duIGVsZW1lbnQuXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwbGFjZW1lbnQgLSBUaGUgcGxhY2VtZW50IGZvciB0aGUgZWxlbS5cbiAgICAgICovXG4gICAgICBwb3NpdGlvbkFycm93OiBmdW5jdGlvbihlbGVtLCBwbGFjZW1lbnQpIHtcbiAgICAgICAgZWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZShlbGVtKTtcblxuICAgICAgICB2YXIgaW5uZXJFbGVtID0gZWxlbS5xdWVyeVNlbGVjdG9yKCcudG9vbHRpcC1pbm5lciwgLnBvcG92ZXItaW5uZXInKTtcbiAgICAgICAgaWYgKCFpbm5lckVsZW0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXNUb29sdGlwID0gYW5ndWxhci5lbGVtZW50KGlubmVyRWxlbSkuaGFzQ2xhc3MoJ3Rvb2x0aXAtaW5uZXInKTtcblxuICAgICAgICB2YXIgYXJyb3dFbGVtID0gaXNUb29sdGlwID8gZWxlbS5xdWVyeVNlbGVjdG9yKCcudG9vbHRpcC1hcnJvdycpIDogZWxlbS5xdWVyeVNlbGVjdG9yKCcuYXJyb3cnKTtcbiAgICAgICAgaWYgKCFhcnJvd0VsZW0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwbGFjZW1lbnQgPSB0aGlzLnBhcnNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gICAgICAgIGlmIChwbGFjZW1lbnRbMV0gPT09ICdjZW50ZXInKSB7XG4gICAgICAgICAgLy8gbm8gYWRqdXN0bWVudCBuZWNlc3NhcnkgLSBqdXN0IHJlc2V0IHN0eWxlc1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChhcnJvd0VsZW0pLmNzcyh7dG9wOiAnJywgYm90dG9tOiAnJywgcmlnaHQ6ICcnLCBsZWZ0OiAnJywgbWFyZ2luOiAnJ30pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBib3JkZXJQcm9wID0gJ2JvcmRlci0nICsgcGxhY2VtZW50WzBdICsgJy13aWR0aCc7XG4gICAgICAgIHZhciBib3JkZXJXaWR0aCA9ICR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShhcnJvd0VsZW0pW2JvcmRlclByb3BdO1xuXG4gICAgICAgIHZhciBib3JkZXJSYWRpdXNQcm9wID0gJ2JvcmRlci0nO1xuICAgICAgICBpZiAoUExBQ0VNRU5UX1JFR0VYLnZlcnRpY2FsLnRlc3QocGxhY2VtZW50WzBdKSkge1xuICAgICAgICAgIGJvcmRlclJhZGl1c1Byb3AgKz0gcGxhY2VtZW50WzBdICsgJy0nICsgcGxhY2VtZW50WzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvcmRlclJhZGl1c1Byb3AgKz0gcGxhY2VtZW50WzFdICsgJy0nICsgcGxhY2VtZW50WzBdO1xuICAgICAgICB9XG4gICAgICAgIGJvcmRlclJhZGl1c1Byb3AgKz0gJy1yYWRpdXMnO1xuICAgICAgICB2YXIgYm9yZGVyUmFkaXVzID0gJHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGlzVG9vbHRpcCA/IGlubmVyRWxlbSA6IGVsZW0pW2JvcmRlclJhZGl1c1Byb3BdO1xuXG4gICAgICAgIHZhciBhcnJvd0NzcyA9IHtcbiAgICAgICAgICB0b3A6ICdhdXRvJyxcbiAgICAgICAgICBib3R0b206ICdhdXRvJyxcbiAgICAgICAgICBsZWZ0OiAnYXV0bycsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgICBtYXJnaW46IDBcbiAgICAgICAgfTtcblxuICAgICAgICBzd2l0Y2ggKHBsYWNlbWVudFswXSkge1xuICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICBhcnJvd0Nzcy5ib3R0b20gPSBpc1Rvb2x0aXAgPyAnMCcgOiAnLScgKyBib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICBhcnJvd0Nzcy50b3AgPSBpc1Rvb2x0aXAgPyAnMCcgOiAnLScgKyBib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgYXJyb3dDc3MucmlnaHQgPSBpc1Rvb2x0aXAgPyAnMCcgOiAnLScgKyBib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIGFycm93Q3NzLmxlZnQgPSBpc1Rvb2x0aXAgPyAnMCcgOiAnLScgKyBib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJyb3dDc3NbcGxhY2VtZW50WzFdXSA9IGJvcmRlclJhZGl1cztcblxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoYXJyb3dFbGVtKS5jc3MoYXJyb3dDc3MpO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5kYXRlcGlja2VyJywgWyd1aS5ib290c3RyYXAuZGF0ZXBhcnNlcicsICd1aS5ib290c3RyYXAuaXNDbGFzcycsICd1aS5ib290c3RyYXAucG9zaXRpb24nXSlcblxuLnZhbHVlKCckZGF0ZXBpY2tlclN1cHByZXNzRXJyb3InLCBmYWxzZSlcblxuLmNvbnN0YW50KCd1aWJEYXRlcGlja2VyQ29uZmlnJywge1xuICBkYXRlcGlja2VyTW9kZTogJ2RheScsXG4gIGZvcm1hdERheTogJ2RkJyxcbiAgZm9ybWF0TW9udGg6ICdNTU1NJyxcbiAgZm9ybWF0WWVhcjogJ3l5eXknLFxuICBmb3JtYXREYXlIZWFkZXI6ICdFRUUnLFxuICBmb3JtYXREYXlUaXRsZTogJ01NTU0geXl5eScsXG4gIGZvcm1hdE1vbnRoVGl0bGU6ICd5eXl5JyxcbiAgbWF4RGF0ZTogbnVsbCxcbiAgbWF4TW9kZTogJ3llYXInLFxuICBtaW5EYXRlOiBudWxsLFxuICBtaW5Nb2RlOiAnZGF5JyxcbiAgbmdNb2RlbE9wdGlvbnM6IHt9LFxuICBzaG9ydGN1dFByb3BhZ2F0aW9uOiBmYWxzZSxcbiAgc2hvd1dlZWtzOiB0cnVlLFxuICB5ZWFyQ29sdW1uczogNSxcbiAgeWVhclJvd3M6IDRcbn0pXG5cbi5jb250cm9sbGVyKCdVaWJEYXRlcGlja2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdHRycycsICckcGFyc2UnLCAnJGludGVycG9sYXRlJywgJyRsb2NhbGUnLCAnJGxvZycsICdkYXRlRmlsdGVyJywgJ3VpYkRhdGVwaWNrZXJDb25maWcnLCAnJGRhdGVwaWNrZXJTdXBwcmVzc0Vycm9yJywgJ3VpYkRhdGVQYXJzZXInLFxuICBmdW5jdGlvbigkc2NvcGUsICRhdHRycywgJHBhcnNlLCAkaW50ZXJwb2xhdGUsICRsb2NhbGUsICRsb2csIGRhdGVGaWx0ZXIsIGRhdGVwaWNrZXJDb25maWcsICRkYXRlcGlja2VyU3VwcHJlc3NFcnJvciwgZGF0ZVBhcnNlcikge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBuZ01vZGVsQ3RybCA9IHsgJHNldFZpZXdWYWx1ZTogYW5ndWxhci5ub29wIH0sIC8vIG51bGxNb2RlbEN0cmw7XG4gICAgICBuZ01vZGVsT3B0aW9ucyA9IHt9LFxuICAgICAgd2F0Y2hMaXN0ZW5lcnMgPSBbXTtcblxuICAvLyBNb2RlcyBjaGFpblxuICB0aGlzLm1vZGVzID0gWydkYXknLCAnbW9udGgnLCAneWVhciddO1xuXG4gIGlmICgkYXR0cnMuZGF0ZXBpY2tlck9wdGlvbnMpIHtcbiAgICBhbmd1bGFyLmZvckVhY2goW1xuICAgICAgJ2Zvcm1hdERheScsXG4gICAgICAnZm9ybWF0RGF5SGVhZGVyJyxcbiAgICAgICdmb3JtYXREYXlUaXRsZScsXG4gICAgICAnZm9ybWF0TW9udGgnLFxuICAgICAgJ2Zvcm1hdE1vbnRoVGl0bGUnLFxuICAgICAgJ2Zvcm1hdFllYXInLFxuICAgICAgJ2luaXREYXRlJyxcbiAgICAgICdtYXhEYXRlJyxcbiAgICAgICdtYXhNb2RlJyxcbiAgICAgICdtaW5EYXRlJyxcbiAgICAgICdtaW5Nb2RlJyxcbiAgICAgICdzaG93V2Vla3MnLFxuICAgICAgJ3Nob3J0Y3V0UHJvcGFnYXRpb24nLFxuICAgICAgJ3N0YXJ0aW5nRGF5JyxcbiAgICAgICd5ZWFyQ29sdW1ucycsXG4gICAgICAneWVhclJvd3MnXG4gICAgXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICdmb3JtYXREYXknOlxuICAgICAgICBjYXNlICdmb3JtYXREYXlIZWFkZXInOlxuICAgICAgICBjYXNlICdmb3JtYXREYXlUaXRsZSc6XG4gICAgICAgIGNhc2UgJ2Zvcm1hdE1vbnRoJzpcbiAgICAgICAgY2FzZSAnZm9ybWF0TW9udGhUaXRsZSc6XG4gICAgICAgIGNhc2UgJ2Zvcm1hdFllYXInOlxuICAgICAgICAgIHNlbGZba2V5XSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5kYXRlcGlja2VyT3B0aW9uc1trZXldKSA/ICRpbnRlcnBvbGF0ZSgkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnNba2V5XSkoJHNjb3BlLiRwYXJlbnQpIDogZGF0ZXBpY2tlckNvbmZpZ1trZXldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzaG93V2Vla3MnOlxuICAgICAgICBjYXNlICdzaG9ydGN1dFByb3BhZ2F0aW9uJzpcbiAgICAgICAgY2FzZSAneWVhckNvbHVtbnMnOlxuICAgICAgICBjYXNlICd5ZWFyUm93cyc6XG4gICAgICAgICAgc2VsZltrZXldID0gYW5ndWxhci5pc0RlZmluZWQoJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zW2tleV0pID9cbiAgICAgICAgICAgICRzY29wZS5kYXRlcGlja2VyT3B0aW9uc1trZXldIDogZGF0ZXBpY2tlckNvbmZpZ1trZXldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdGFydGluZ0RheSc6XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5kYXRlcGlja2VyT3B0aW9ucy5zdGFydGluZ0RheSkpIHtcbiAgICAgICAgICAgIHNlbGYuc3RhcnRpbmdEYXkgPSAkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnMuc3RhcnRpbmdEYXk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzTnVtYmVyKGRhdGVwaWNrZXJDb25maWcuc3RhcnRpbmdEYXkpKSB7XG4gICAgICAgICAgICBzZWxmLnN0YXJ0aW5nRGF5ID0gZGF0ZXBpY2tlckNvbmZpZy5zdGFydGluZ0RheTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5zdGFydGluZ0RheSA9ICgkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuRklSU1REQVlPRldFRUsgKyA4KSAlIDc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21heERhdGUnOlxuICAgICAgICBjYXNlICdtaW5EYXRlJzpcbiAgICAgICAgICBpZiAoJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zW2tleV0pIHtcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7IHJldHVybiAkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnNba2V5XTsgfSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgc2VsZltrZXldID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUobmV3IERhdGUodmFsdWUpLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNlbGZba2V5XSA9IG5ldyBEYXRlKGRhdGVGaWx0ZXIodmFsdWUsICdtZWRpdW0nKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGZba2V5XSA9IG51bGw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hWaWV3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZltrZXldID0gZGF0ZXBpY2tlckNvbmZpZ1trZXldID8gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUobmV3IERhdGUoZGF0ZXBpY2tlckNvbmZpZ1trZXldKSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpIDogbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWF4TW9kZSc6XG4gICAgICAgIGNhc2UgJ21pbk1vZGUnOlxuICAgICAgICAgIGlmICgkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnNba2V5XSkge1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHsgcmV0dXJuICRzY29wZS5kYXRlcGlja2VyT3B0aW9uc1trZXldOyB9LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICBzZWxmW2tleV0gPSAkc2NvcGVba2V5XSA9IGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSA/IHZhbHVlIDogZGF0ZXBpY2tlck9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ21pbk1vZGUnICYmIHNlbGYubW9kZXMuaW5kZXhPZigkc2NvcGUuZGF0ZXBpY2tlck1vZGUpIDwgc2VsZi5tb2Rlcy5pbmRleE9mKHNlbGZba2V5XSkgfHxcbiAgICAgICAgICAgICAgICBrZXkgPT09ICdtYXhNb2RlJyAmJiBzZWxmLm1vZGVzLmluZGV4T2YoJHNjb3BlLmRhdGVwaWNrZXJNb2RlKSA+IHNlbGYubW9kZXMuaW5kZXhPZihzZWxmW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRhdGVwaWNrZXJNb2RlID0gc2VsZltrZXldO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZltrZXldID0gJHNjb3BlW2tleV0gPSBkYXRlcGlja2VyQ29uZmlnW2tleV0gfHwgbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaW5pdERhdGUnOlxuICAgICAgICAgIGlmICgkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnMuaW5pdERhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKCRzY29wZS5kYXRlcGlja2VyT3B0aW9ucy5pbml0RGF0ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpIHx8IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkgeyByZXR1cm4gJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zLmluaXREYXRlOyB9LCBmdW5jdGlvbihpbml0RGF0ZSkge1xuICAgICAgICAgICAgICBpZiAoaW5pdERhdGUgJiYgKG5nTW9kZWxDdHJsLiRpc0VtcHR5KG5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlKSB8fCBuZ01vZGVsQ3RybC4kaW52YWxpZCkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjdGl2ZURhdGUgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShpbml0RGF0ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEludGVycG9sYXRlZCBjb25maWd1cmF0aW9uIGF0dHJpYnV0ZXNcbiAgICBhbmd1bGFyLmZvckVhY2goWydmb3JtYXREYXknLCAnZm9ybWF0TW9udGgnLCAnZm9ybWF0WWVhcicsICdmb3JtYXREYXlIZWFkZXInLCAnZm9ybWF0RGF5VGl0bGUnLCAnZm9ybWF0TW9udGhUaXRsZSddLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHNlbGZba2V5XSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRyc1trZXldKSA/ICRpbnRlcnBvbGF0ZSgkYXR0cnNba2V5XSkoJHNjb3BlLiRwYXJlbnQpIDogZGF0ZXBpY2tlckNvbmZpZ1trZXldO1xuICAgIH0pO1xuXG4gICAgLy8gRXZhbGVkIGNvbmZpZ3VyYXRpb24gYXR0cmlidXRlc1xuICAgIGFuZ3VsYXIuZm9yRWFjaChbJ3Nob3dXZWVrcycsICd5ZWFyUm93cycsICd5ZWFyQ29sdW1ucycsICdzaG9ydGN1dFByb3BhZ2F0aW9uJ10sIGZ1bmN0aW9uKGtleSkge1xuICAgICAgc2VsZltrZXldID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzW2tleV0pID9cbiAgICAgICAgJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzW2tleV0pIDogZGF0ZXBpY2tlckNvbmZpZ1trZXldO1xuICAgIH0pO1xuXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5zdGFydGluZ0RheSkpIHtcbiAgICAgIHNlbGYuc3RhcnRpbmdEYXkgPSAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuc3RhcnRpbmdEYXkpO1xuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc051bWJlcihkYXRlcGlja2VyQ29uZmlnLnN0YXJ0aW5nRGF5KSkge1xuICAgICAgc2VsZi5zdGFydGluZ0RheSA9IGRhdGVwaWNrZXJDb25maWcuc3RhcnRpbmdEYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuc3RhcnRpbmdEYXkgPSAoJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLkZJUlNUREFZT0ZXRUVLICsgOCkgJSA3O1xuICAgIH1cblxuICAgIC8vIFdhdGNoYWJsZSBkYXRlIGF0dHJpYnV0ZXNcbiAgICBhbmd1bGFyLmZvckVhY2goWydtaW5EYXRlJywgJ21heERhdGUnXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoJGF0dHJzW2tleV0pIHtcbiAgICAgICAgd2F0Y2hMaXN0ZW5lcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzW2tleV0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHNlbGZba2V5XSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG5ldyBEYXRlKHZhbHVlKSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZltrZXldID0gbmV3IERhdGUoZGF0ZUZpbHRlcih2YWx1ZSwgJ21lZGl1bScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZltrZXldID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWxmLnJlZnJlc2hWaWV3KCk7XG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGZba2V5XSA9IGRhdGVwaWNrZXJDb25maWdba2V5XSA/IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG5ldyBEYXRlKGRhdGVwaWNrZXJDb25maWdba2V5XSksIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKSA6IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goWydtaW5Nb2RlJywgJ21heE1vZGUnXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoJGF0dHJzW2tleV0pIHtcbiAgICAgICAgd2F0Y2hMaXN0ZW5lcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzW2tleV0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgc2VsZltrZXldID0gJHNjb3BlW2tleV0gPSBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkgPyB2YWx1ZSA6ICRhdHRyc1trZXldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdtaW5Nb2RlJyAmJiBzZWxmLm1vZGVzLmluZGV4T2YoJHNjb3BlLmRhdGVwaWNrZXJNb2RlKSA8IHNlbGYubW9kZXMuaW5kZXhPZihzZWxmW2tleV0pIHx8XG4gICAgICAgICAgICBrZXkgPT09ICdtYXhNb2RlJyAmJiBzZWxmLm1vZGVzLmluZGV4T2YoJHNjb3BlLmRhdGVwaWNrZXJNb2RlKSA+IHNlbGYubW9kZXMuaW5kZXhPZihzZWxmW2tleV0pKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0ZXBpY2tlck1vZGUgPSBzZWxmW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmW2tleV0gPSAkc2NvcGVba2V5XSA9IGRhdGVwaWNrZXJDb25maWdba2V5XSB8fCBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5pbml0RGF0ZSkpIHtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKCRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5pbml0RGF0ZSksIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKSB8fCBuZXcgRGF0ZSgpO1xuICAgICAgd2F0Y2hMaXN0ZW5lcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLmluaXREYXRlLCBmdW5jdGlvbihpbml0RGF0ZSkge1xuICAgICAgICBpZiAoaW5pdERhdGUgJiYgKG5nTW9kZWxDdHJsLiRpc0VtcHR5KG5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlKSB8fCBuZ01vZGVsQ3RybC4kaW52YWxpZCkpIHtcbiAgICAgICAgICBzZWxmLmFjdGl2ZURhdGUgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShpbml0RGF0ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgICAgIHNlbGYucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gICRzY29wZS5kYXRlcGlja2VyTW9kZSA9ICRzY29wZS5kYXRlcGlja2VyTW9kZSB8fCBkYXRlcGlja2VyQ29uZmlnLmRhdGVwaWNrZXJNb2RlO1xuICAkc2NvcGUudW5pcXVlSWQgPSAnZGF0ZXBpY2tlci0nICsgJHNjb3BlLiRpZCArICctJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKTtcblxuICAkc2NvcGUuZGlzYWJsZWQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZGlzYWJsZWQpIHx8IGZhbHNlO1xuICBpZiAoYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLm5nRGlzYWJsZWQpKSB7XG4gICAgd2F0Y2hMaXN0ZW5lcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nRGlzYWJsZWQsIGZ1bmN0aW9uKGRpc2FibGVkKSB7XG4gICAgICAkc2NvcGUuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgIHNlbGYucmVmcmVzaFZpZXcoKTtcbiAgICB9KSk7XG4gIH1cblxuICAkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbihkYXRlT2JqZWN0KSB7XG4gICAgaWYgKHNlbGYuY29tcGFyZShkYXRlT2JqZWN0LmRhdGUsIHNlbGYuYWN0aXZlRGF0ZSkgPT09IDApIHtcbiAgICAgICRzY29wZS5hY3RpdmVEYXRlSWQgPSBkYXRlT2JqZWN0LnVpZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24obmdNb2RlbEN0cmxfKSB7XG4gICAgbmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybF87XG4gICAgbmdNb2RlbE9wdGlvbnMgPSBuZ01vZGVsQ3RybF8uJG9wdGlvbnMgfHwgZGF0ZXBpY2tlckNvbmZpZy5uZ01vZGVsT3B0aW9ucztcblxuICAgIGlmIChuZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZSkge1xuICAgICAgdGhpcy5hY3RpdmVEYXRlID0gbmdNb2RlbEN0cmwuJG1vZGVsVmFsdWU7XG4gICAgfVxuXG4gICAgbmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9O1xuICB9O1xuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUpIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSksXG4gICAgICAgICAgaXNWYWxpZCA9ICFpc05hTihkYXRlKTtcblxuICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUoZGF0ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgfSBlbHNlIGlmICghJGRhdGVwaWNrZXJTdXBwcmVzc0Vycm9yKSB7XG4gICAgICAgICRsb2cuZXJyb3IoJ0RhdGVwaWNrZXIgZGlyZWN0aXZlOiBcIm5nLW1vZGVsXCIgdmFsdWUgbXVzdCBiZSBhIERhdGUgb2JqZWN0Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgfTtcblxuICB0aGlzLnJlZnJlc2hWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgICAgJHNjb3BlLnNlbGVjdGVkRHQgPSBudWxsO1xuICAgICAgdGhpcy5fcmVmcmVzaFZpZXcoKTtcbiAgICAgIGlmICgkc2NvcGUuYWN0aXZlRHQpIHtcbiAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGVJZCA9ICRzY29wZS5hY3RpdmVEdC51aWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRlID0gbmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSA/IG5ldyBEYXRlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUpIDogbnVsbDtcbiAgICAgIGRhdGUgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShkYXRlLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSk7XG4gICAgICBuZ01vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ2RhdGVEaXNhYmxlZCcsICFkYXRlIHx8XG4gICAgICAgIHRoaXMuZWxlbWVudCAmJiAhdGhpcy5pc0Rpc2FibGVkKGRhdGUpKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5jcmVhdGVEYXRlT2JqZWN0ID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0KSB7XG4gICAgdmFyIG1vZGVsID0gbmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSA/IG5ldyBEYXRlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUpIDogbnVsbDtcbiAgICBtb2RlbCA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG1vZGVsLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSk7XG4gICAgdmFyIGR0ID0ge1xuICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgIGxhYmVsOiBkYXRlUGFyc2VyLmZpbHRlcihkYXRlLCBmb3JtYXQpLFxuICAgICAgc2VsZWN0ZWQ6IG1vZGVsICYmIHRoaXMuY29tcGFyZShkYXRlLCBtb2RlbCkgPT09IDAsXG4gICAgICBkaXNhYmxlZDogdGhpcy5pc0Rpc2FibGVkKGRhdGUpLFxuICAgICAgY3VycmVudDogdGhpcy5jb21wYXJlKGRhdGUsIG5ldyBEYXRlKCkpID09PSAwLFxuICAgICAgY3VzdG9tQ2xhc3M6IHRoaXMuY3VzdG9tQ2xhc3MoZGF0ZSkgfHwgbnVsbFxuICAgIH07XG5cbiAgICBpZiAobW9kZWwgJiYgdGhpcy5jb21wYXJlKGRhdGUsIG1vZGVsKSA9PT0gMCkge1xuICAgICAgJHNjb3BlLnNlbGVjdGVkRHQgPSBkdDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5hY3RpdmVEYXRlICYmIHRoaXMuY29tcGFyZShkdC5kYXRlLCBzZWxmLmFjdGl2ZURhdGUpID09PSAwKSB7XG4gICAgICAkc2NvcGUuYWN0aXZlRHQgPSBkdDtcbiAgICB9XG5cbiAgICByZXR1cm4gZHQ7XG4gIH07XG5cbiAgdGhpcy5pc0Rpc2FibGVkID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiAkc2NvcGUuZGlzYWJsZWQgfHxcbiAgICAgIHRoaXMubWluRGF0ZSAmJiB0aGlzLmNvbXBhcmUoZGF0ZSwgdGhpcy5taW5EYXRlKSA8IDAgfHxcbiAgICAgIHRoaXMubWF4RGF0ZSAmJiB0aGlzLmNvbXBhcmUoZGF0ZSwgdGhpcy5tYXhEYXRlKSA+IDAgfHxcbiAgICAgICRhdHRycy5kYXRlRGlzYWJsZWQgJiYgJHNjb3BlLmRhdGVEaXNhYmxlZCh7ZGF0ZTogZGF0ZSwgbW9kZTogJHNjb3BlLmRhdGVwaWNrZXJNb2RlfSk7XG4gIH07XG5cbiAgdGhpcy5jdXN0b21DbGFzcyA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gJHNjb3BlLmN1c3RvbUNsYXNzKHtkYXRlOiBkYXRlLCBtb2RlOiAkc2NvcGUuZGF0ZXBpY2tlck1vZGV9KTtcbiAgfTtcblxuICAvLyBTcGxpdCBhcnJheSBpbnRvIHNtYWxsZXIgYXJyYXlzXG4gIHRoaXMuc3BsaXQgPSBmdW5jdGlvbihhcnIsIHNpemUpIHtcbiAgICB2YXIgYXJyYXlzID0gW107XG4gICAgd2hpbGUgKGFyci5sZW5ndGggPiAwKSB7XG4gICAgICBhcnJheXMucHVzaChhcnIuc3BsaWNlKDAsIHNpemUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5cztcbiAgfTtcblxuICAkc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIGlmICgkc2NvcGUuZGF0ZXBpY2tlck1vZGUgPT09IHNlbGYubWluTW9kZSkge1xuICAgICAgdmFyIGR0ID0gbmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSA/IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG5ldyBEYXRlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUpLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSkgOiBuZXcgRGF0ZSgwLCAwLCAwLCAwLCAwLCAwLCAwKTtcbiAgICAgIGR0LnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSk7XG4gICAgICBkdCA9IGRhdGVQYXJzZXIudG9UaW1lem9uZShkdCwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShkdCk7XG4gICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuYWN0aXZlRGF0ZSA9IGRhdGU7XG4gICAgICAkc2NvcGUuZGF0ZXBpY2tlck1vZGUgPSBzZWxmLm1vZGVzW3NlbGYubW9kZXMuaW5kZXhPZigkc2NvcGUuZGF0ZXBpY2tlck1vZGUpIC0gMV07XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5tb3ZlID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgdmFyIHllYXIgPSBzZWxmLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSArIGRpcmVjdGlvbiAqIChzZWxmLnN0ZXAueWVhcnMgfHwgMCksXG4gICAgICAgIG1vbnRoID0gc2VsZi5hY3RpdmVEYXRlLmdldE1vbnRoKCkgKyBkaXJlY3Rpb24gKiAoc2VsZi5zdGVwLm1vbnRocyB8fCAwKTtcbiAgICBzZWxmLmFjdGl2ZURhdGUuc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIDEpO1xuICAgIHNlbGYucmVmcmVzaFZpZXcoKTtcbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlTW9kZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgIGRpcmVjdGlvbiA9IGRpcmVjdGlvbiB8fCAxO1xuXG4gICAgaWYgKCRzY29wZS5kYXRlcGlja2VyTW9kZSA9PT0gc2VsZi5tYXhNb2RlICYmIGRpcmVjdGlvbiA9PT0gMSB8fFxuICAgICAgJHNjb3BlLmRhdGVwaWNrZXJNb2RlID09PSBzZWxmLm1pbk1vZGUgJiYgZGlyZWN0aW9uID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICRzY29wZS5kYXRlcGlja2VyTW9kZSA9IHNlbGYubW9kZXNbc2VsZi5tb2Rlcy5pbmRleE9mKCRzY29wZS5kYXRlcGlja2VyTW9kZSkgKyBkaXJlY3Rpb25dO1xuICB9O1xuXG4gIC8vIEtleSBldmVudCBtYXBwZXJcbiAgJHNjb3BlLmtleXMgPSB7IDEzOiAnZW50ZXInLCAzMjogJ3NwYWNlJywgMzM6ICdwYWdldXAnLCAzNDogJ3BhZ2Vkb3duJywgMzU6ICdlbmQnLCAzNjogJ2hvbWUnLCAzNzogJ2xlZnQnLCAzODogJ3VwJywgMzk6ICdyaWdodCcsIDQwOiAnZG93bicgfTtcblxuICB2YXIgZm9jdXNFbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5lbGVtZW50WzBdLmZvY3VzKCk7XG4gIH07XG5cbiAgLy8gTGlzdGVuIGZvciBmb2N1cyByZXF1ZXN0cyBmcm9tIHBvcHVwIGRpcmVjdGl2ZVxuICAkc2NvcGUuJG9uKCd1aWI6ZGF0ZXBpY2tlci5mb2N1cycsIGZvY3VzRWxlbWVudCk7XG5cbiAgJHNjb3BlLmtleWRvd24gPSBmdW5jdGlvbihldnQpIHtcbiAgICB2YXIga2V5ID0gJHNjb3BlLmtleXNbZXZ0LndoaWNoXTtcblxuICAgIGlmICgha2V5IHx8IGV2dC5zaGlmdEtleSB8fCBldnQuYWx0S2V5IHx8ICRzY29wZS5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghc2VsZi5zaG9ydGN1dFByb3BhZ2F0aW9uKSB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGtleSA9PT0gJ2VudGVyJyB8fCBrZXkgPT09ICdzcGFjZScpIHtcbiAgICAgIGlmIChzZWxmLmlzRGlzYWJsZWQoc2VsZi5hY3RpdmVEYXRlKSkge1xuICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmdcbiAgICAgIH1cbiAgICAgICRzY29wZS5zZWxlY3Qoc2VsZi5hY3RpdmVEYXRlKTtcbiAgICB9IGVsc2UgaWYgKGV2dC5jdHJsS2V5ICYmIChrZXkgPT09ICd1cCcgfHwga2V5ID09PSAnZG93bicpKSB7XG4gICAgICAkc2NvcGUudG9nZ2xlTW9kZShrZXkgPT09ICd1cCcgPyAxIDogLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmhhbmRsZUtleURvd24oa2V5LCBldnQpO1xuICAgICAgc2VsZi5yZWZyZXNoVmlldygpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuJG9uKFwiJGRlc3Ryb3lcIiwgZnVuY3Rpb24oKSB7XG4gICAgLy9DbGVhciBhbGwgd2F0Y2ggbGlzdGVuZXJzIG9uIGRlc3Ryb3lcbiAgICB3aGlsZSAod2F0Y2hMaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICB3YXRjaExpc3RlbmVycy5zaGlmdCgpKCk7XG4gICAgfVxuICB9KTtcbn1dKVxuXG4uY29udHJvbGxlcignVWliRGF5cGlja2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRlbGVtZW50JywgJ2RhdGVGaWx0ZXInLCBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQsIGRhdGVGaWx0ZXIpIHtcbiAgdmFyIERBWVNfSU5fTU9OVEggPSBbMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XG5cbiAgdGhpcy5zdGVwID0geyBtb250aHM6IDEgfTtcbiAgdGhpcy5lbGVtZW50ID0gJGVsZW1lbnQ7XG4gIGZ1bmN0aW9uIGdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgcmV0dXJuIG1vbnRoID09PSAxICYmIHllYXIgJSA0ID09PSAwICYmXG4gICAgICAoeWVhciAlIDEwMCAhPT0gMCB8fCB5ZWFyICUgNDAwID09PSAwKSA/IDI5IDogREFZU19JTl9NT05USFttb250aF07XG4gIH1cblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbihjdHJsKSB7XG4gICAgYW5ndWxhci5leHRlbmQoY3RybCwgdGhpcyk7XG4gICAgc2NvcGUuc2hvd1dlZWtzID0gY3RybC5zaG93V2Vla3M7XG4gICAgY3RybC5yZWZyZXNoVmlldygpO1xuICB9O1xuXG4gIHRoaXMuZ2V0RGF0ZXMgPSBmdW5jdGlvbihzdGFydERhdGUsIG4pIHtcbiAgICB2YXIgZGF0ZXMgPSBuZXcgQXJyYXkobiksIGN1cnJlbnQgPSBuZXcgRGF0ZShzdGFydERhdGUpLCBpID0gMCwgZGF0ZTtcbiAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShjdXJyZW50KTtcbiAgICAgIGRhdGVzW2krK10gPSBkYXRlO1xuICAgICAgY3VycmVudC5zZXREYXRlKGN1cnJlbnQuZ2V0RGF0ZSgpICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRlcztcbiAgfTtcblxuICB0aGlzLl9yZWZyZXNoVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB5ZWFyID0gdGhpcy5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICBtb250aCA9IHRoaXMuYWN0aXZlRGF0ZS5nZXRNb250aCgpLFxuICAgICAgZmlyc3REYXlPZk1vbnRoID0gbmV3IERhdGUodGhpcy5hY3RpdmVEYXRlKTtcblxuICAgIGZpcnN0RGF5T2ZNb250aC5zZXRGdWxsWWVhcih5ZWFyLCBtb250aCwgMSk7XG5cbiAgICB2YXIgZGlmZmVyZW5jZSA9IHRoaXMuc3RhcnRpbmdEYXkgLSBmaXJzdERheU9mTW9udGguZ2V0RGF5KCksXG4gICAgICBudW1EaXNwbGF5ZWRGcm9tUHJldmlvdXNNb250aCA9IGRpZmZlcmVuY2UgPiAwID9cbiAgICAgICAgNyAtIGRpZmZlcmVuY2UgOiAtIGRpZmZlcmVuY2UsXG4gICAgICBmaXJzdERhdGUgPSBuZXcgRGF0ZShmaXJzdERheU9mTW9udGgpO1xuXG4gICAgaWYgKG51bURpc3BsYXllZEZyb21QcmV2aW91c01vbnRoID4gMCkge1xuICAgICAgZmlyc3REYXRlLnNldERhdGUoLW51bURpc3BsYXllZEZyb21QcmV2aW91c01vbnRoICsgMSk7XG4gICAgfVxuXG4gICAgLy8gNDIgaXMgdGhlIG51bWJlciBvZiBkYXlzIG9uIGEgc2l4LXdlZWsgY2FsZW5kYXJcbiAgICB2YXIgZGF5cyA9IHRoaXMuZ2V0RGF0ZXMoZmlyc3REYXRlLCA0Mik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0MjsgaSArKykge1xuICAgICAgZGF5c1tpXSA9IGFuZ3VsYXIuZXh0ZW5kKHRoaXMuY3JlYXRlRGF0ZU9iamVjdChkYXlzW2ldLCB0aGlzLmZvcm1hdERheSksIHtcbiAgICAgICAgc2Vjb25kYXJ5OiBkYXlzW2ldLmdldE1vbnRoKCkgIT09IG1vbnRoLFxuICAgICAgICB1aWQ6IHNjb3BlLnVuaXF1ZUlkICsgJy0nICsgaVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2NvcGUubGFiZWxzID0gbmV3IEFycmF5KDcpO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgNzsgaisrKSB7XG4gICAgICBzY29wZS5sYWJlbHNbal0gPSB7XG4gICAgICAgIGFiYnI6IGRhdGVGaWx0ZXIoZGF5c1tqXS5kYXRlLCB0aGlzLmZvcm1hdERheUhlYWRlciksXG4gICAgICAgIGZ1bGw6IGRhdGVGaWx0ZXIoZGF5c1tqXS5kYXRlLCAnRUVFRScpXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNjb3BlLnRpdGxlID0gZGF0ZUZpbHRlcih0aGlzLmFjdGl2ZURhdGUsIHRoaXMuZm9ybWF0RGF5VGl0bGUpO1xuICAgIHNjb3BlLnJvd3MgPSB0aGlzLnNwbGl0KGRheXMsIDcpO1xuXG4gICAgaWYgKHNjb3BlLnNob3dXZWVrcykge1xuICAgICAgc2NvcGUud2Vla051bWJlcnMgPSBbXTtcbiAgICAgIHZhciB0aHVyc2RheUluZGV4ID0gKDQgKyA3IC0gdGhpcy5zdGFydGluZ0RheSkgJSA3LFxuICAgICAgICAgIG51bVdlZWtzID0gc2NvcGUucm93cy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBjdXJXZWVrID0gMDsgY3VyV2VlayA8IG51bVdlZWtzOyBjdXJXZWVrKyspIHtcbiAgICAgICAgc2NvcGUud2Vla051bWJlcnMucHVzaChcbiAgICAgICAgICBnZXRJU084NjAxV2Vla051bWJlcihzY29wZS5yb3dzW2N1cldlZWtdW3RodXJzZGF5SW5kZXhdLmRhdGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdGhpcy5jb21wYXJlID0gZnVuY3Rpb24oZGF0ZTEsIGRhdGUyKSB7XG4gICAgdmFyIF9kYXRlMSA9IG5ldyBEYXRlKGRhdGUxLmdldEZ1bGxZZWFyKCksIGRhdGUxLmdldE1vbnRoKCksIGRhdGUxLmdldERhdGUoKSk7XG4gICAgdmFyIF9kYXRlMiA9IG5ldyBEYXRlKGRhdGUyLmdldEZ1bGxZZWFyKCksIGRhdGUyLmdldE1vbnRoKCksIGRhdGUyLmdldERhdGUoKSk7XG4gICAgX2RhdGUxLnNldEZ1bGxZZWFyKGRhdGUxLmdldEZ1bGxZZWFyKCkpO1xuICAgIF9kYXRlMi5zZXRGdWxsWWVhcihkYXRlMi5nZXRGdWxsWWVhcigpKTtcbiAgICByZXR1cm4gX2RhdGUxIC0gX2RhdGUyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldElTTzg2MDFXZWVrTnVtYmVyKGRhdGUpIHtcbiAgICB2YXIgY2hlY2tEYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2hlY2tEYXRlLnNldERhdGUoY2hlY2tEYXRlLmdldERhdGUoKSArIDQgLSAoY2hlY2tEYXRlLmdldERheSgpIHx8IDcpKTsgLy8gVGh1cnNkYXlcbiAgICB2YXIgdGltZSA9IGNoZWNrRGF0ZS5nZXRUaW1lKCk7XG4gICAgY2hlY2tEYXRlLnNldE1vbnRoKDApOyAvLyBDb21wYXJlIHdpdGggSmFuIDFcbiAgICBjaGVja0RhdGUuc2V0RGF0ZSgxKTtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJvdW5kKCh0aW1lIC0gY2hlY2tEYXRlKSAvIDg2NDAwMDAwKSAvIDcpICsgMTtcbiAgfVxuXG4gIHRoaXMuaGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uKGtleSwgZXZ0KSB7XG4gICAgdmFyIGRhdGUgPSB0aGlzLmFjdGl2ZURhdGUuZ2V0RGF0ZSgpO1xuXG4gICAgaWYgKGtleSA9PT0gJ2xlZnQnKSB7XG4gICAgICBkYXRlID0gZGF0ZSAtIDE7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICd1cCcpIHtcbiAgICAgIGRhdGUgPSBkYXRlIC0gNztcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgZGF0ZSA9IGRhdGUgKyAxO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnZG93bicpIHtcbiAgICAgIGRhdGUgPSBkYXRlICsgNztcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3BhZ2V1cCcgfHwga2V5ID09PSAncGFnZWRvd24nKSB7XG4gICAgICB2YXIgbW9udGggPSB0aGlzLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSArIChrZXkgPT09ICdwYWdldXAnID8gLSAxIDogMSk7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUuc2V0TW9udGgobW9udGgsIDEpO1xuICAgICAgZGF0ZSA9IE1hdGgubWluKGdldERheXNJbk1vbnRoKHRoaXMuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLCB0aGlzLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSksIGRhdGUpO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnaG9tZScpIHtcbiAgICAgIGRhdGUgPSAxO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnZW5kJykge1xuICAgICAgZGF0ZSA9IGdldERheXNJbk1vbnRoKHRoaXMuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLCB0aGlzLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSk7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlRGF0ZS5zZXREYXRlKGRhdGUpO1xuICB9O1xufV0pXG5cbi5jb250cm9sbGVyKCdVaWJNb250aHBpY2tlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICckZWxlbWVudCcsICdkYXRlRmlsdGVyJywgZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBkYXRlRmlsdGVyKSB7XG4gIHRoaXMuc3RlcCA9IHsgeWVhcnM6IDEgfTtcbiAgdGhpcy5lbGVtZW50ID0gJGVsZW1lbnQ7XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oY3RybCkge1xuICAgIGFuZ3VsYXIuZXh0ZW5kKGN0cmwsIHRoaXMpO1xuICAgIGN0cmwucmVmcmVzaFZpZXcoKTtcbiAgfTtcblxuICB0aGlzLl9yZWZyZXNoVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtb250aHMgPSBuZXcgQXJyYXkoMTIpLFxuICAgICAgICB5ZWFyID0gdGhpcy5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICAgIGRhdGU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0aGlzLmFjdGl2ZURhdGUpO1xuICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5ZWFyLCBpLCAxKTtcbiAgICAgIG1vbnRoc1tpXSA9IGFuZ3VsYXIuZXh0ZW5kKHRoaXMuY3JlYXRlRGF0ZU9iamVjdChkYXRlLCB0aGlzLmZvcm1hdE1vbnRoKSwge1xuICAgICAgICB1aWQ6IHNjb3BlLnVuaXF1ZUlkICsgJy0nICsgaVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2NvcGUudGl0bGUgPSBkYXRlRmlsdGVyKHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5mb3JtYXRNb250aFRpdGxlKTtcbiAgICBzY29wZS5yb3dzID0gdGhpcy5zcGxpdChtb250aHMsIDMpO1xuICB9O1xuXG4gIHRoaXMuY29tcGFyZSA9IGZ1bmN0aW9uKGRhdGUxLCBkYXRlMikge1xuICAgIHZhciBfZGF0ZTEgPSBuZXcgRGF0ZShkYXRlMS5nZXRGdWxsWWVhcigpLCBkYXRlMS5nZXRNb250aCgpKTtcbiAgICB2YXIgX2RhdGUyID0gbmV3IERhdGUoZGF0ZTIuZ2V0RnVsbFllYXIoKSwgZGF0ZTIuZ2V0TW9udGgoKSk7XG4gICAgX2RhdGUxLnNldEZ1bGxZZWFyKGRhdGUxLmdldEZ1bGxZZWFyKCkpO1xuICAgIF9kYXRlMi5zZXRGdWxsWWVhcihkYXRlMi5nZXRGdWxsWWVhcigpKTtcbiAgICByZXR1cm4gX2RhdGUxIC0gX2RhdGUyO1xuICB9O1xuXG4gIHRoaXMuaGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uKGtleSwgZXZ0KSB7XG4gICAgdmFyIGRhdGUgPSB0aGlzLmFjdGl2ZURhdGUuZ2V0TW9udGgoKTtcblxuICAgIGlmIChrZXkgPT09ICdsZWZ0Jykge1xuICAgICAgZGF0ZSA9IGRhdGUgLSAxO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAndXAnKSB7XG4gICAgICBkYXRlID0gZGF0ZSAtIDM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdyaWdodCcpIHtcbiAgICAgIGRhdGUgPSBkYXRlICsgMTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2Rvd24nKSB7XG4gICAgICBkYXRlID0gZGF0ZSArIDM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdwYWdldXAnIHx8IGtleSA9PT0gJ3BhZ2Vkb3duJykge1xuICAgICAgdmFyIHllYXIgPSB0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSArIChrZXkgPT09ICdwYWdldXAnID8gLSAxIDogMSk7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUuc2V0RnVsbFllYXIoeWVhcik7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdob21lJykge1xuICAgICAgZGF0ZSA9IDA7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdlbmQnKSB7XG4gICAgICBkYXRlID0gMTE7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlRGF0ZS5zZXRNb250aChkYXRlKTtcbiAgfTtcbn1dKVxuXG4uY29udHJvbGxlcignVWliWWVhcnBpY2tlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICckZWxlbWVudCcsICdkYXRlRmlsdGVyJywgZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBkYXRlRmlsdGVyKSB7XG4gIHZhciBjb2x1bW5zLCByYW5nZTtcbiAgdGhpcy5lbGVtZW50ID0gJGVsZW1lbnQ7XG5cbiAgZnVuY3Rpb24gZ2V0U3RhcnRpbmdZZWFyKHllYXIpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoKHllYXIgLSAxKSAvIHJhbmdlLCAxMCkgKiByYW5nZSArIDE7XG4gIH1cblxuICB0aGlzLnllYXJwaWNrZXJJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29sdW1ucyA9IHRoaXMueWVhckNvbHVtbnM7XG4gICAgcmFuZ2UgPSB0aGlzLnllYXJSb3dzICogY29sdW1ucztcbiAgICB0aGlzLnN0ZXAgPSB7IHllYXJzOiByYW5nZSB9O1xuICB9O1xuXG4gIHRoaXMuX3JlZnJlc2hWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHllYXJzID0gbmV3IEFycmF5KHJhbmdlKSwgZGF0ZTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBzdGFydCA9IGdldFN0YXJ0aW5nWWVhcih0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSk7IGkgPCByYW5nZTsgaSsrKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUodGhpcy5hY3RpdmVEYXRlKTtcbiAgICAgIGRhdGUuc2V0RnVsbFllYXIoc3RhcnQgKyBpLCAwLCAxKTtcbiAgICAgIHllYXJzW2ldID0gYW5ndWxhci5leHRlbmQodGhpcy5jcmVhdGVEYXRlT2JqZWN0KGRhdGUsIHRoaXMuZm9ybWF0WWVhciksIHtcbiAgICAgICAgdWlkOiBzY29wZS51bmlxdWVJZCArICctJyArIGlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNjb3BlLnRpdGxlID0gW3llYXJzWzBdLmxhYmVsLCB5ZWFyc1tyYW5nZSAtIDFdLmxhYmVsXS5qb2luKCcgLSAnKTtcbiAgICBzY29wZS5yb3dzID0gdGhpcy5zcGxpdCh5ZWFycywgY29sdW1ucyk7XG4gICAgc2NvcGUuY29sdW1ucyA9IGNvbHVtbnM7XG4gIH07XG5cbiAgdGhpcy5jb21wYXJlID0gZnVuY3Rpb24oZGF0ZTEsIGRhdGUyKSB7XG4gICAgcmV0dXJuIGRhdGUxLmdldEZ1bGxZZWFyKCkgLSBkYXRlMi5nZXRGdWxsWWVhcigpO1xuICB9O1xuXG4gIHRoaXMuaGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uKGtleSwgZXZ0KSB7XG4gICAgdmFyIGRhdGUgPSB0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgIGlmIChrZXkgPT09ICdsZWZ0Jykge1xuICAgICAgZGF0ZSA9IGRhdGUgLSAxO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAndXAnKSB7XG4gICAgICBkYXRlID0gZGF0ZSAtIGNvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdyaWdodCcpIHtcbiAgICAgIGRhdGUgPSBkYXRlICsgMTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2Rvd24nKSB7XG4gICAgICBkYXRlID0gZGF0ZSArIGNvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdwYWdldXAnIHx8IGtleSA9PT0gJ3BhZ2Vkb3duJykge1xuICAgICAgZGF0ZSArPSAoa2V5ID09PSAncGFnZXVwJyA/IC0gMSA6IDEpICogcmFuZ2U7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdob21lJykge1xuICAgICAgZGF0ZSA9IGdldFN0YXJ0aW5nWWVhcih0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdlbmQnKSB7XG4gICAgICBkYXRlID0gZ2V0U3RhcnRpbmdZZWFyKHRoaXMuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpKSArIHJhbmdlIC0gMTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVEYXRlLnNldEZ1bGxZZWFyKGRhdGUpO1xuICB9O1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkRhdGVwaWNrZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9kYXRlcGlja2VyLmh0bWwnO1xuICAgIH0sXG4gICAgc2NvcGU6IHtcbiAgICAgIGRhdGVwaWNrZXJNb2RlOiAnPT8nLFxuICAgICAgZGF0ZXBpY2tlck9wdGlvbnM6ICc9PycsXG4gICAgICBkYXRlRGlzYWJsZWQ6ICcmJyxcbiAgICAgIGN1c3RvbUNsYXNzOiAnJicsXG4gICAgICBzaG9ydGN1dFByb3BhZ2F0aW9uOiAnJj8nXG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ3VpYkRhdGVwaWNrZXInLCAnXm5nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnVWliRGF0ZXBpY2tlckNvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2RhdGVwaWNrZXInLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBkYXRlcGlja2VyQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBkYXRlcGlja2VyQ3RybC5pbml0KG5nTW9kZWxDdHJsKTtcbiAgICB9XG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJEYXlwaWNrZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9kYXkuaHRtbCc7XG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ151aWJEYXRlcGlja2VyJywgJ3VpYkRheXBpY2tlciddLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJEYXlwaWNrZXJDb250cm9sbGVyJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgZGF0ZXBpY2tlckN0cmwgPSBjdHJsc1swXSxcbiAgICAgICAgZGF5cGlja2VyQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBkYXlwaWNrZXJDdHJsLmluaXQoZGF0ZXBpY2tlckN0cmwpO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYk1vbnRocGlja2VyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvbW9udGguaHRtbCc7XG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ151aWJEYXRlcGlja2VyJywgJ3VpYk1vbnRocGlja2VyJ10sXG4gICAgY29udHJvbGxlcjogJ1VpYk1vbnRocGlja2VyQ29udHJvbGxlcicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgdmFyIGRhdGVwaWNrZXJDdHJsID0gY3RybHNbMF0sXG4gICAgICAgIG1vbnRocGlja2VyQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBtb250aHBpY2tlckN0cmwuaW5pdChkYXRlcGlja2VyQ3RybCk7XG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliWWVhcnBpY2tlcicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL3llYXIuaHRtbCc7XG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ151aWJEYXRlcGlja2VyJywgJ3VpYlllYXJwaWNrZXInXSxcbiAgICBjb250cm9sbGVyOiAnVWliWWVhcnBpY2tlckNvbnRyb2xsZXInLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBjdHJsID0gY3RybHNbMF07XG4gICAgICBhbmd1bGFyLmV4dGVuZChjdHJsLCBjdHJsc1sxXSk7XG4gICAgICBjdHJsLnllYXJwaWNrZXJJbml0KCk7XG5cbiAgICAgIGN0cmwucmVmcmVzaFZpZXcoKTtcbiAgICB9XG4gIH07XG59KVxuXG4uY29uc3RhbnQoJ3VpYkRhdGVwaWNrZXJQb3B1cENvbmZpZycsIHtcbiAgYWx0SW5wdXRGb3JtYXRzOiBbXSxcbiAgYXBwZW5kVG9Cb2R5OiBmYWxzZSxcbiAgY2xlYXJUZXh0OiAnQ2xlYXInLFxuICBjbG9zZU9uRGF0ZVNlbGVjdGlvbjogdHJ1ZSxcbiAgY2xvc2VUZXh0OiAnRG9uZScsXG4gIGN1cnJlbnRUZXh0OiAnVG9kYXknLFxuICBkYXRlcGlja2VyUG9wdXA6ICd5eXl5LU1NLWRkJyxcbiAgZGF0ZXBpY2tlclBvcHVwVGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9wb3B1cC5odG1sJyxcbiAgZGF0ZXBpY2tlclRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5odG1sJyxcbiAgaHRtbDVUeXBlczoge1xuICAgIGRhdGU6ICd5eXl5LU1NLWRkJyxcbiAgICAnZGF0ZXRpbWUtbG9jYWwnOiAneXl5eS1NTS1kZFRISDptbTpzcy5zc3MnLFxuICAgICdtb250aCc6ICd5eXl5LU1NJ1xuICB9LFxuICBvbk9wZW5Gb2N1czogdHJ1ZSxcbiAgc2hvd0J1dHRvbkJhcjogdHJ1ZVxufSlcblxuLmNvbnRyb2xsZXIoJ1VpYkRhdGVwaWNrZXJQb3B1cENvbnRyb2xsZXInLCBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCAnJGNvbXBpbGUnLCAnJHBhcnNlJywgJyRkb2N1bWVudCcsICckcm9vdFNjb3BlJywgJyR1aWJQb3NpdGlvbicsICdkYXRlRmlsdGVyJywgJ3VpYkRhdGVQYXJzZXInLCAndWliRGF0ZXBpY2tlclBvcHVwQ29uZmlnJywgJyR0aW1lb3V0JywgJ3VpYkRhdGVwaWNrZXJDb25maWcnLFxuZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCAkY29tcGlsZSwgJHBhcnNlLCAkZG9jdW1lbnQsICRyb290U2NvcGUsICRwb3NpdGlvbiwgZGF0ZUZpbHRlciwgZGF0ZVBhcnNlciwgZGF0ZXBpY2tlclBvcHVwQ29uZmlnLCAkdGltZW91dCwgZGF0ZXBpY2tlckNvbmZpZykge1xuICB2YXIgY2FjaGUgPSB7fSxcbiAgICBpc0h0bWw1RGF0ZUlucHV0ID0gZmFsc2U7XG4gIHZhciBkYXRlRm9ybWF0LCBjbG9zZU9uRGF0ZVNlbGVjdGlvbiwgYXBwZW5kVG9Cb2R5LCBvbk9wZW5Gb2N1cyxcbiAgICBkYXRlcGlja2VyUG9wdXBUZW1wbGF0ZVVybCwgZGF0ZXBpY2tlclRlbXBsYXRlVXJsLCBwb3B1cEVsLCBkYXRlcGlja2VyRWwsXG4gICAgbmdNb2RlbCwgbmdNb2RlbE9wdGlvbnMsICRwb3B1cCwgYWx0SW5wdXRGb3JtYXRzLCB3YXRjaExpc3RlbmVycyA9IFtdO1xuXG4gIHNjb3BlLndhdGNoRGF0YSA9IHt9O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKF9uZ01vZGVsXykge1xuICAgIG5nTW9kZWwgPSBfbmdNb2RlbF87XG4gICAgbmdNb2RlbE9wdGlvbnMgPSBfbmdNb2RlbF8uJG9wdGlvbnMgfHwgZGF0ZXBpY2tlckNvbmZpZy5uZ01vZGVsT3B0aW9ucztcbiAgICBjbG9zZU9uRGF0ZVNlbGVjdGlvbiA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmNsb3NlT25EYXRlU2VsZWN0aW9uKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuY2xvc2VPbkRhdGVTZWxlY3Rpb24pIDogZGF0ZXBpY2tlclBvcHVwQ29uZmlnLmNsb3NlT25EYXRlU2VsZWN0aW9uO1xuICAgIGFwcGVuZFRvQm9keSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRhdGVwaWNrZXJBcHBlbmRUb0JvZHkpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5kYXRlcGlja2VyQXBwZW5kVG9Cb2R5KSA6IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5hcHBlbmRUb0JvZHk7XG4gICAgb25PcGVuRm9jdXMgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5vbk9wZW5Gb2N1cykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLm9uT3BlbkZvY3VzKSA6IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5vbk9wZW5Gb2N1cztcbiAgICBkYXRlcGlja2VyUG9wdXBUZW1wbGF0ZVVybCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRhdGVwaWNrZXJQb3B1cFRlbXBsYXRlVXJsKSA/IGF0dHJzLmRhdGVwaWNrZXJQb3B1cFRlbXBsYXRlVXJsIDogZGF0ZXBpY2tlclBvcHVwQ29uZmlnLmRhdGVwaWNrZXJQb3B1cFRlbXBsYXRlVXJsO1xuICAgIGRhdGVwaWNrZXJUZW1wbGF0ZVVybCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRhdGVwaWNrZXJUZW1wbGF0ZVVybCkgPyBhdHRycy5kYXRlcGlja2VyVGVtcGxhdGVVcmwgOiBkYXRlcGlja2VyUG9wdXBDb25maWcuZGF0ZXBpY2tlclRlbXBsYXRlVXJsO1xuICAgIGFsdElucHV0Rm9ybWF0cyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmFsdElucHV0Rm9ybWF0cykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmFsdElucHV0Rm9ybWF0cykgOiBkYXRlcGlja2VyUG9wdXBDb25maWcuYWx0SW5wdXRGb3JtYXRzO1xuXG4gICAgc2NvcGUuc2hvd0J1dHRvbkJhciA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLnNob3dCdXR0b25CYXIpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5zaG93QnV0dG9uQmFyKSA6IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5zaG93QnV0dG9uQmFyO1xuXG4gICAgaWYgKGRhdGVwaWNrZXJQb3B1cENvbmZpZy5odG1sNVR5cGVzW2F0dHJzLnR5cGVdKSB7XG4gICAgICBkYXRlRm9ybWF0ID0gZGF0ZXBpY2tlclBvcHVwQ29uZmlnLmh0bWw1VHlwZXNbYXR0cnMudHlwZV07XG4gICAgICBpc0h0bWw1RGF0ZUlucHV0ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0ZUZvcm1hdCA9IGF0dHJzLnVpYkRhdGVwaWNrZXJQb3B1cCB8fCBkYXRlcGlja2VyUG9wdXBDb25maWcuZGF0ZXBpY2tlclBvcHVwO1xuICAgICAgYXR0cnMuJG9ic2VydmUoJ3VpYkRhdGVwaWNrZXJQb3B1cCcsIGZ1bmN0aW9uKHZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICB2YXIgbmV3RGF0ZUZvcm1hdCA9IHZhbHVlIHx8IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5kYXRlcGlja2VyUG9wdXA7XG4gICAgICAgIC8vIEludmFsaWRhdGUgdGhlICRtb2RlbFZhbHVlIHRvIGVuc3VyZSB0aGF0IGZvcm1hdHRlcnMgcmUtcnVuXG4gICAgICAgIC8vIEZJWE1FOiBSZWZhY3RvciB3aGVuIFBSIGlzIG1lcmdlZDogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9wdWxsLzEwNzY0XG4gICAgICAgIGlmIChuZXdEYXRlRm9ybWF0ICE9PSBkYXRlRm9ybWF0KSB7XG4gICAgICAgICAgZGF0ZUZvcm1hdCA9IG5ld0RhdGVGb3JtYXQ7XG4gICAgICAgICAgbmdNb2RlbC4kbW9kZWxWYWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICBpZiAoIWRhdGVGb3JtYXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndWliRGF0ZXBpY2tlclBvcHVwIG11c3QgaGF2ZSBhIGRhdGUgZm9ybWF0IHNwZWNpZmllZC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghZGF0ZUZvcm1hdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1aWJEYXRlcGlja2VyUG9wdXAgbXVzdCBoYXZlIGEgZGF0ZSBmb3JtYXQgc3BlY2lmaWVkLicpO1xuICAgIH1cblxuICAgIGlmIChpc0h0bWw1RGF0ZUlucHV0ICYmIGF0dHJzLnVpYkRhdGVwaWNrZXJQb3B1cCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIVE1MNSBkYXRlIGlucHV0IHR5cGVzIGRvIG5vdCBzdXBwb3J0IGN1c3RvbSBmb3JtYXRzLicpO1xuICAgIH1cblxuICAgIC8vIHBvcHVwIGVsZW1lbnQgdXNlZCB0byBkaXNwbGF5IGNhbGVuZGFyXG4gICAgcG9wdXBFbCA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdiB1aWItZGF0ZXBpY2tlci1wb3B1cC13cmFwPjxkaXYgdWliLWRhdGVwaWNrZXI+PC9kaXY+PC9kaXY+Jyk7XG4gICAgc2NvcGUubmdNb2RlbE9wdGlvbnMgPSBhbmd1bGFyLmNvcHkobmdNb2RlbE9wdGlvbnMpO1xuICAgIHNjb3BlLm5nTW9kZWxPcHRpb25zLnRpbWV6b25lID0gbnVsbDtcbiAgICBwb3B1cEVsLmF0dHIoe1xuICAgICAgJ25nLW1vZGVsJzogJ2RhdGUnLFxuICAgICAgJ25nLW1vZGVsLW9wdGlvbnMnOiAnbmdNb2RlbE9wdGlvbnMnLFxuICAgICAgJ25nLWNoYW5nZSc6ICdkYXRlU2VsZWN0aW9uKGRhdGUpJyxcbiAgICAgICd0ZW1wbGF0ZS11cmwnOiBkYXRlcGlja2VyUG9wdXBUZW1wbGF0ZVVybFxuICAgIH0pO1xuXG4gICAgLy8gZGF0ZXBpY2tlciBlbGVtZW50XG4gICAgZGF0ZXBpY2tlckVsID0gYW5ndWxhci5lbGVtZW50KHBvcHVwRWwuY2hpbGRyZW4oKVswXSk7XG4gICAgZGF0ZXBpY2tlckVsLmF0dHIoJ3RlbXBsYXRlLXVybCcsIGRhdGVwaWNrZXJUZW1wbGF0ZVVybCk7XG5cbiAgICBpZiAoaXNIdG1sNURhdGVJbnB1dCkge1xuICAgICAgaWYgKGF0dHJzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoJ2RhdGVwaWNrZXItbW9kZScsICdcIm1vbnRoXCInKTtcbiAgICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoJ21pbi1tb2RlJywgJ21vbnRoJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2goc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnMsIGZ1bmN0aW9uKHZhbHVlLCBvcHRpb24pIHtcbiAgICAgICAgLy8gSWdub3JlIHRoaXMgb3B0aW9ucywgd2lsbCBiZSBtYW5hZ2VkIGxhdGVyXG4gICAgICAgIGlmIChbJ21pbkRhdGUnLCAnbWF4RGF0ZScsICdtaW5Nb2RlJywgJ21heE1vZGUnLCAnaW5pdERhdGUnLCAnZGF0ZXBpY2tlck1vZGUnXS5pbmRleE9mKG9wdGlvbikgPT09IC0xKSB7XG4gICAgICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoY2FtZWx0b0Rhc2gob3B0aW9uKSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKGNhbWVsdG9EYXNoKG9wdGlvbiksICdkYXRlcGlja2VyT3B0aW9ucy4nICsgb3B0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYW5ndWxhci5mb3JFYWNoKFsnbWluTW9kZScsICdtYXhNb2RlJywgJ2RhdGVwaWNrZXJNb2RlJywgJ3Nob3J0Y3V0UHJvcGFnYXRpb24nXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoYXR0cnNba2V5XSkge1xuICAgICAgICB2YXIgZ2V0QXR0cmlidXRlID0gJHBhcnNlKGF0dHJzW2tleV0pO1xuICAgICAgICB2YXIgcHJvcENvbmZpZyA9IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEF0dHJpYnV0ZShzY29wZS4kcGFyZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoY2FtZWx0b0Rhc2goa2V5KSwgJ3dhdGNoRGF0YS4nICsga2V5KTtcblxuICAgICAgICAvLyBQcm9wYWdhdGUgY2hhbmdlcyBmcm9tIGRhdGVwaWNrZXIgdG8gb3V0c2lkZVxuICAgICAgICBpZiAoa2V5ID09PSAnZGF0ZXBpY2tlck1vZGUnKSB7XG4gICAgICAgICAgdmFyIHNldEF0dHJpYnV0ZSA9IGdldEF0dHJpYnV0ZS5hc3NpZ247XG4gICAgICAgICAgcHJvcENvbmZpZy5zZXQgPSBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBzZXRBdHRyaWJ1dGUoc2NvcGUuJHBhcmVudCwgdik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzY29wZS53YXRjaERhdGEsIGtleSwgcHJvcENvbmZpZyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goWydtaW5EYXRlJywgJ21heERhdGUnLCAnaW5pdERhdGUnXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoYXR0cnNba2V5XSkge1xuICAgICAgICB2YXIgZ2V0QXR0cmlidXRlID0gJHBhcnNlKGF0dHJzW2tleV0pO1xuXG4gICAgICAgIHdhdGNoTGlzdGVuZXJzLnB1c2goc2NvcGUuJHBhcmVudC4kd2F0Y2goZ2V0QXR0cmlidXRlLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdtaW5EYXRlJyB8fCBrZXkgPT09ICdtYXhEYXRlJykge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNhY2hlW2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgY2FjaGVba2V5XSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG5ldyBEYXRlKHZhbHVlKSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FjaGVba2V5XSA9IG5ldyBEYXRlKGRhdGVGaWx0ZXIodmFsdWUsICdtZWRpdW0nKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLndhdGNoRGF0YVtrZXldID0gdmFsdWUgPT09IG51bGwgPyBudWxsIDogY2FjaGVba2V5XTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NvcGUud2F0Y2hEYXRhW2tleV0gPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShuZXcgRGF0ZSh2YWx1ZSksIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcblxuICAgICAgICBkYXRlcGlja2VyRWwuYXR0cihjYW1lbHRvRGFzaChrZXkpLCAnd2F0Y2hEYXRhLicgKyBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGF0dHJzLmRhdGVEaXNhYmxlZCkge1xuICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoJ2RhdGUtZGlzYWJsZWQnLCAnZGF0ZURpc2FibGVkKHsgZGF0ZTogZGF0ZSwgbW9kZTogbW9kZSB9KScpO1xuICAgIH1cblxuICAgIGFuZ3VsYXIuZm9yRWFjaChbJ2Zvcm1hdERheScsICdmb3JtYXRNb250aCcsICdmb3JtYXRZZWFyJywgJ2Zvcm1hdERheUhlYWRlcicsICdmb3JtYXREYXlUaXRsZScsICdmb3JtYXRNb250aFRpdGxlJywgJ3Nob3dXZWVrcycsICdzdGFydGluZ0RheScsICd5ZWFyUm93cycsICd5ZWFyQ29sdW1ucyddLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChhdHRyc1trZXldKSkge1xuICAgICAgICBkYXRlcGlja2VyRWwuYXR0cihjYW1lbHRvRGFzaChrZXkpLCBhdHRyc1trZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChhdHRycy5jdXN0b21DbGFzcykge1xuICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoJ2N1c3RvbS1jbGFzcycsICdjdXN0b21DbGFzcyh7IGRhdGU6IGRhdGUsIG1vZGU6IG1vZGUgfSknKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzSHRtbDVEYXRlSW5wdXQpIHtcbiAgICAgIC8vIEludGVybmFsIEFQSSB0byBtYWludGFpbiB0aGUgY29ycmVjdCBuZy1pbnZhbGlkLVtrZXldIGNsYXNzXG4gICAgICBuZ01vZGVsLiQkcGFyc2VyTmFtZSA9ICdkYXRlJztcbiAgICAgIG5nTW9kZWwuJHZhbGlkYXRvcnMuZGF0ZSA9IHZhbGlkYXRvcjtcbiAgICAgIG5nTW9kZWwuJHBhcnNlcnMudW5zaGlmdChwYXJzZURhdGUpO1xuICAgICAgbmdNb2RlbC4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChuZ01vZGVsLiRpc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgIHNjb3BlLmRhdGUgPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS5kYXRlID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUodmFsdWUsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcblxuICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihzY29wZS5kYXRlKSkge1xuICAgICAgICAgIHNjb3BlLmRhdGUgPSBuZXcgRGF0ZShzY29wZS5kYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRlUGFyc2VyLmZpbHRlcihzY29wZS5kYXRlLCBkYXRlRm9ybWF0KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZ01vZGVsLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgc2NvcGUuZGF0ZSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKHZhbHVlLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERldGVjdCBjaGFuZ2VzIGluIHRoZSB2aWV3IGZyb20gdGhlIHRleHQgYm94XG4gICAgbmdNb2RlbC4kdmlld0NoYW5nZUxpc3RlbmVycy5wdXNoKGZ1bmN0aW9uKCkge1xuICAgICAgc2NvcGUuZGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhuZ01vZGVsLiR2aWV3VmFsdWUpO1xuICAgIH0pO1xuXG4gICAgZWxlbWVudC5vbigna2V5ZG93bicsIGlucHV0S2V5ZG93bkJpbmQpO1xuXG4gICAgJHBvcHVwID0gJGNvbXBpbGUocG9wdXBFbCkoc2NvcGUpO1xuICAgIC8vIFByZXZlbnQgalF1ZXJ5IGNhY2hlIG1lbW9yeSBsZWFrICh0ZW1wbGF0ZSBpcyBub3cgcmVkdW5kYW50IGFmdGVyIGxpbmtpbmcpXG4gICAgcG9wdXBFbC5yZW1vdmUoKTtcblxuICAgIGlmIChhcHBlbmRUb0JvZHkpIHtcbiAgICAgICRkb2N1bWVudC5maW5kKCdib2R5JykuYXBwZW5kKCRwb3B1cCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuYWZ0ZXIoJHBvcHVwKTtcbiAgICB9XG5cbiAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2NvcGUuaXNPcGVuID09PSB0cnVlKSB7XG4gICAgICAgIGlmICghJHJvb3RTY29wZS4kJHBoYXNlKSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHBvcHVwLnJlbW92ZSgpO1xuICAgICAgZWxlbWVudC5vZmYoJ2tleWRvd24nLCBpbnB1dEtleWRvd25CaW5kKTtcbiAgICAgICRkb2N1bWVudC5vZmYoJ2NsaWNrJywgZG9jdW1lbnRDbGlja0JpbmQpO1xuXG4gICAgICAvL0NsZWFyIGFsbCB3YXRjaCBsaXN0ZW5lcnMgb24gZGVzdHJveVxuICAgICAgd2hpbGUgKHdhdGNoTGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICB3YXRjaExpc3RlbmVycy5zaGlmdCgpKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgc2NvcGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBzY29wZVtrZXkgKyAnVGV4dCddIHx8IGRhdGVwaWNrZXJQb3B1cENvbmZpZ1trZXkgKyAnVGV4dCddO1xuICB9O1xuXG4gIHNjb3BlLmlzRGlzYWJsZWQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgaWYgKGRhdGUgPT09ICd0b2RheScpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzY29wZS53YXRjaERhdGEubWluRGF0ZSAmJiBzY29wZS5jb21wYXJlKGRhdGUsIGNhY2hlLm1pbkRhdGUpIDwgMCB8fFxuICAgICAgICBzY29wZS53YXRjaERhdGEubWF4RGF0ZSAmJiBzY29wZS5jb21wYXJlKGRhdGUsIGNhY2hlLm1heERhdGUpID4gMDtcbiAgfTtcblxuICBzY29wZS5jb21wYXJlID0gZnVuY3Rpb24oZGF0ZTEsIGRhdGUyKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUxLmdldEZ1bGxZZWFyKCksIGRhdGUxLmdldE1vbnRoKCksIGRhdGUxLmdldERhdGUoKSkgLSBuZXcgRGF0ZShkYXRlMi5nZXRGdWxsWWVhcigpLCBkYXRlMi5nZXRNb250aCgpLCBkYXRlMi5nZXREYXRlKCkpO1xuICB9O1xuXG4gIC8vIElubmVyIGNoYW5nZVxuICBzY29wZS5kYXRlU2VsZWN0aW9uID0gZnVuY3Rpb24oZHQpIHtcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoZHQpKSB7XG4gICAgICBzY29wZS5kYXRlID0gZHQ7XG4gICAgfVxuICAgIHZhciBkYXRlID0gc2NvcGUuZGF0ZSA/IGRhdGVQYXJzZXIuZmlsdGVyKHNjb3BlLmRhdGUsIGRhdGVGb3JtYXQpIDogbnVsbDsgLy8gU2V0dGluZyB0byBOVUxMIGlzIG5lY2Vzc2FyeSBmb3IgZm9ybSB2YWxpZGF0b3JzIHRvIGZ1bmN0aW9uXG4gICAgZWxlbWVudC52YWwoZGF0ZSk7XG4gICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGRhdGUpO1xuXG4gICAgaWYgKGNsb3NlT25EYXRlU2VsZWN0aW9uKSB7XG4gICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICAgIGVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICB9XG4gIH07XG5cbiAgc2NvcGUua2V5ZG93biA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQud2hpY2ggPT09IDI3KSB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICAgIGVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICB9XG4gIH07XG5cbiAgc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIGlmIChkYXRlID09PSAndG9kYXknKSB7XG4gICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEYXRlKHNjb3BlLmRhdGUpKSB7XG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZShzY29wZS5kYXRlKTtcbiAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXRlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2NvcGUuZGF0ZVNlbGVjdGlvbihkYXRlKTtcbiAgfTtcblxuICBzY29wZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xuICAgIGVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgfTtcblxuICBzY29wZS5kaXNhYmxlZCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRpc2FibGVkKSB8fCBmYWxzZTtcbiAgaWYgKGF0dHJzLm5nRGlzYWJsZWQpIHtcbiAgICB3YXRjaExpc3RlbmVycy5wdXNoKHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZShhdHRycy5uZ0Rpc2FibGVkKSwgZnVuY3Rpb24oZGlzYWJsZWQpIHtcbiAgICAgIHNjb3BlLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfSkpO1xuICB9XG5cbiAgc2NvcGUuJHdhdGNoKCdpc09wZW4nLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgaWYgKCFzY29wZS5kaXNhYmxlZCkge1xuICAgICAgICBzY29wZS5wb3NpdGlvbiA9IGFwcGVuZFRvQm9keSA/ICRwb3NpdGlvbi5vZmZzZXQoZWxlbWVudCkgOiAkcG9zaXRpb24ucG9zaXRpb24oZWxlbWVudCk7XG4gICAgICAgIHNjb3BlLnBvc2l0aW9uLnRvcCA9IHNjb3BlLnBvc2l0aW9uLnRvcCArIGVsZW1lbnQucHJvcCgnb2Zmc2V0SGVpZ2h0Jyk7XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKG9uT3BlbkZvY3VzKSB7XG4gICAgICAgICAgICBzY29wZS4kYnJvYWRjYXN0KCd1aWI6ZGF0ZXBpY2tlci5mb2N1cycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkZG9jdW1lbnQub24oJ2NsaWNrJywgZG9jdW1lbnRDbGlja0JpbmQpO1xuICAgICAgICB9LCAwLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBkb2N1bWVudENsaWNrQmluZCk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBjYW1lbHRvRGFzaChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24oJDEpIHsgcmV0dXJuICctJyArICQxLnRvTG93ZXJDYXNlKCk7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VEYXRlU3RyaW5nKHZpZXdWYWx1ZSkge1xuICAgIHZhciBkYXRlID0gZGF0ZVBhcnNlci5wYXJzZSh2aWV3VmFsdWUsIGRhdGVGb3JtYXQsIHNjb3BlLmRhdGUpO1xuICAgIGlmIChpc05hTihkYXRlKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbHRJbnB1dEZvcm1hdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0ZSA9IGRhdGVQYXJzZXIucGFyc2Uodmlld1ZhbHVlLCBhbHRJbnB1dEZvcm1hdHNbaV0sIHNjb3BlLmRhdGUpO1xuICAgICAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZURhdGUodmlld1ZhbHVlKSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIodmlld1ZhbHVlKSkge1xuICAgICAgLy8gcHJlc3VtYWJseSB0aW1lc3RhbXAgdG8gZGF0ZSBvYmplY3RcbiAgICAgIHZpZXdWYWx1ZSA9IG5ldyBEYXRlKHZpZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCF2aWV3VmFsdWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChhbmd1bGFyLmlzRGF0ZSh2aWV3VmFsdWUpICYmICFpc05hTih2aWV3VmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmlld1ZhbHVlO1xuICAgIH1cblxuICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHZpZXdWYWx1ZSkpIHtcbiAgICAgIHZhciBkYXRlID0gcGFyc2VEYXRlU3RyaW5nKHZpZXdWYWx1ZSk7XG4gICAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiBkYXRlUGFyc2VyLnRvVGltZXpvbmUoZGF0ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZ01vZGVsLiRvcHRpb25zICYmIG5nTW9kZWwuJG9wdGlvbnMuYWxsb3dJbnZhbGlkID8gdmlld1ZhbHVlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsaWRhdG9yKG1vZGVsVmFsdWUsIHZpZXdWYWx1ZSkge1xuICAgIHZhciB2YWx1ZSA9IG1vZGVsVmFsdWUgfHwgdmlld1ZhbHVlO1xuXG4gICAgaWYgKCFhdHRycy5uZ1JlcXVpcmVkICYmICF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICB2YWx1ZSA9IG5ldyBEYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoYW5ndWxhci5pc0RhdGUodmFsdWUpICYmICFpc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgcmV0dXJuICFpc05hTihwYXJzZURhdGVTdHJpbmcodmlld1ZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9jdW1lbnRDbGlja0JpbmQoZXZlbnQpIHtcbiAgICBpZiAoIXNjb3BlLmlzT3BlbiAmJiBzY29wZS5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwb3B1cCA9ICRwb3B1cFswXTtcbiAgICB2YXIgZHBDb250YWluc1RhcmdldCA9IGVsZW1lbnRbMF0uY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcbiAgICAvLyBUaGUgcG9wdXAgbm9kZSBtYXkgbm90IGJlIGFuIGVsZW1lbnQgbm9kZVxuICAgIC8vIEluIHNvbWUgYnJvd3NlcnMgKElFKSBvbmx5IGVsZW1lbnQgbm9kZXMgaGF2ZSB0aGUgJ2NvbnRhaW5zJyBmdW5jdGlvblxuICAgIHZhciBwb3B1cENvbnRhaW5zVGFyZ2V0ID0gcG9wdXAuY29udGFpbnMgIT09IHVuZGVmaW5lZCAmJiBwb3B1cC5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIGlmIChzY29wZS5pc09wZW4gJiYgIShkcENvbnRhaW5zVGFyZ2V0IHx8IHBvcHVwQ29udGFpbnNUYXJnZXQpKSB7XG4gICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5wdXRLZXlkb3duQmluZChldnQpIHtcbiAgICBpZiAoZXZ0LndoaWNoID09PSAyNyAmJiBzY29wZS5pc09wZW4pIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgZWxlbWVudFswXS5mb2N1cygpO1xuICAgIH0gZWxzZSBpZiAoZXZ0LndoaWNoID09PSA0MCAmJiAhc2NvcGUuaXNPcGVuKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgc2NvcGUuaXNPcGVuID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkRhdGVwaWNrZXJQb3B1cCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6IFsnbmdNb2RlbCcsICd1aWJEYXRlcGlja2VyUG9wdXAnXSxcbiAgICBjb250cm9sbGVyOiAnVWliRGF0ZXBpY2tlclBvcHVwQ29udHJvbGxlcicsXG4gICAgc2NvcGU6IHtcbiAgICAgIGRhdGVwaWNrZXJPcHRpb25zOiAnPT8nLFxuICAgICAgaXNPcGVuOiAnPT8nLFxuICAgICAgY3VycmVudFRleHQ6ICdAJyxcbiAgICAgIGNsZWFyVGV4dDogJ0AnLFxuICAgICAgY2xvc2VUZXh0OiAnQCcsXG4gICAgICBkYXRlRGlzYWJsZWQ6ICcmJyxcbiAgICAgIGN1c3RvbUNsYXNzOiAnJidcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBuZ01vZGVsID0gY3RybHNbMF0sXG4gICAgICAgIGN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgY3RybC5pbml0KG5nTW9kZWwpO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYkRhdGVwaWNrZXJQb3B1cFdyYXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL3BvcHVwLmh0bWwnO1xuICAgIH1cbiAgfTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmRlYm91bmNlJywgW10pXG4vKipcbiAqIEEgaGVscGVyLCBpbnRlcm5hbCBzZXJ2aWNlIHRoYXQgZGVib3VuY2VzIGEgZnVuY3Rpb25cbiAqL1xuICAuZmFjdG9yeSgnJCRkZWJvdW5jZScsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgIHJldHVybiBmdW5jdGlvbihjYWxsYmFjaywgZGVib3VuY2VUaW1lKSB7XG4gICAgICB2YXIgdGltZW91dFByb21pc2U7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh0aW1lb3V0UHJvbWlzZSkge1xuICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lb3V0UHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lb3V0UHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICB9LCBkZWJvdW5jZVRpbWUpO1xuICAgICAgfTtcbiAgICB9O1xuICB9XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAuZHJvcGRvd24nLCBbJ3VpLmJvb3RzdHJhcC5wb3NpdGlvbiddKVxuXG4uY29uc3RhbnQoJ3VpYkRyb3Bkb3duQ29uZmlnJywge1xuICBhcHBlbmRUb09wZW5DbGFzczogJ3VpYi1kcm9wZG93bi1vcGVuJyxcbiAgb3BlbkNsYXNzOiAnb3Blbidcbn0pXG5cbi5zZXJ2aWNlKCd1aWJEcm9wZG93blNlcnZpY2UnLCBbJyRkb2N1bWVudCcsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJGRvY3VtZW50LCAkcm9vdFNjb3BlKSB7XG4gIHZhciBvcGVuU2NvcGUgPSBudWxsO1xuXG4gIHRoaXMub3BlbiA9IGZ1bmN0aW9uKGRyb3Bkb3duU2NvcGUpIHtcbiAgICBpZiAoIW9wZW5TY29wZSkge1xuICAgICAgJGRvY3VtZW50Lm9uKCdjbGljaycsIGNsb3NlRHJvcGRvd24pO1xuICAgICAgJGRvY3VtZW50Lm9uKCdrZXlkb3duJywga2V5YmluZEZpbHRlcik7XG4gICAgfVxuXG4gICAgaWYgKG9wZW5TY29wZSAmJiBvcGVuU2NvcGUgIT09IGRyb3Bkb3duU2NvcGUpIHtcbiAgICAgIG9wZW5TY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvcGVuU2NvcGUgPSBkcm9wZG93blNjb3BlO1xuICB9O1xuXG4gIHRoaXMuY2xvc2UgPSBmdW5jdGlvbihkcm9wZG93blNjb3BlKSB7XG4gICAgaWYgKG9wZW5TY29wZSA9PT0gZHJvcGRvd25TY29wZSkge1xuICAgICAgb3BlblNjb3BlID0gbnVsbDtcbiAgICAgICRkb2N1bWVudC5vZmYoJ2NsaWNrJywgY2xvc2VEcm9wZG93bik7XG4gICAgICAkZG9jdW1lbnQub2ZmKCdrZXlkb3duJywga2V5YmluZEZpbHRlcik7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjbG9zZURyb3Bkb3duID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgLy8gVGhpcyBtZXRob2QgbWF5IHN0aWxsIGJlIGNhbGxlZCBkdXJpbmcgdGhlIHNhbWUgbW91c2UgZXZlbnQgdGhhdFxuICAgIC8vIHVuYm91bmQgdGhpcyBldmVudCBoYW5kbGVyLiBTbyBjaGVjayBvcGVuU2NvcGUgYmVmb3JlIHByb2NlZWRpbmcuXG4gICAgaWYgKCFvcGVuU2NvcGUpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAoZXZ0ICYmIG9wZW5TY29wZS5nZXRBdXRvQ2xvc2UoKSA9PT0gJ2Rpc2FibGVkJykgeyByZXR1cm47IH1cblxuICAgIGlmIChldnQgJiYgZXZ0LndoaWNoID09PSAzKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIHRvZ2dsZUVsZW1lbnQgPSBvcGVuU2NvcGUuZ2V0VG9nZ2xlRWxlbWVudCgpO1xuICAgIGlmIChldnQgJiYgdG9nZ2xlRWxlbWVudCAmJiB0b2dnbGVFbGVtZW50WzBdLmNvbnRhaW5zKGV2dC50YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRyb3Bkb3duRWxlbWVudCA9IG9wZW5TY29wZS5nZXREcm9wZG93bkVsZW1lbnQoKTtcbiAgICBpZiAoZXZ0ICYmIG9wZW5TY29wZS5nZXRBdXRvQ2xvc2UoKSA9PT0gJ291dHNpZGVDbGljaycgJiZcbiAgICAgIGRyb3Bkb3duRWxlbWVudCAmJiBkcm9wZG93bkVsZW1lbnRbMF0uY29udGFpbnMoZXZ0LnRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcGVuU2NvcGUuaXNPcGVuID0gZmFsc2U7XG5cbiAgICBpZiAoISRyb290U2NvcGUuJCRwaGFzZSkge1xuICAgICAgb3BlblNjb3BlLiRhcHBseSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIga2V5YmluZEZpbHRlciA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQud2hpY2ggPT09IDI3KSB7XG4gICAgICBvcGVuU2NvcGUuZm9jdXNUb2dnbGVFbGVtZW50KCk7XG4gICAgICBjbG9zZURyb3Bkb3duKCk7XG4gICAgfSBlbHNlIGlmIChvcGVuU2NvcGUuaXNLZXluYXZFbmFibGVkKCkgJiYgWzM4LCA0MF0uaW5kZXhPZihldnQud2hpY2gpICE9PSAtMSAmJiBvcGVuU2NvcGUuaXNPcGVuKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG9wZW5TY29wZS5mb2N1c0Ryb3Bkb3duRW50cnkoZXZ0LndoaWNoKTtcbiAgICB9XG4gIH07XG59XSlcblxuLmNvbnRyb2xsZXIoJ1VpYkRyb3Bkb3duQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICckcGFyc2UnLCAndWliRHJvcGRvd25Db25maWcnLCAndWliRHJvcGRvd25TZXJ2aWNlJywgJyRhbmltYXRlJywgJyR1aWJQb3NpdGlvbicsICckZG9jdW1lbnQnLCAnJGNvbXBpbGUnLCAnJHRlbXBsYXRlUmVxdWVzdCcsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHBhcnNlLCBkcm9wZG93bkNvbmZpZywgdWliRHJvcGRvd25TZXJ2aWNlLCAkYW5pbWF0ZSwgJHBvc2l0aW9uLCAkZG9jdW1lbnQsICRjb21waWxlLCAkdGVtcGxhdGVSZXF1ZXN0KSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBzY29wZSA9ICRzY29wZS4kbmV3KCksIC8vIGNyZWF0ZSBhIGNoaWxkIHNjb3BlIHNvIHdlIGFyZSBub3QgcG9sbHV0aW5nIG9yaWdpbmFsIG9uZVxuICAgIHRlbXBsYXRlU2NvcGUsXG4gICAgYXBwZW5kVG9PcGVuQ2xhc3MgPSBkcm9wZG93bkNvbmZpZy5hcHBlbmRUb09wZW5DbGFzcyxcbiAgICBvcGVuQ2xhc3MgPSBkcm9wZG93bkNvbmZpZy5vcGVuQ2xhc3MsXG4gICAgZ2V0SXNPcGVuLFxuICAgIHNldElzT3BlbiA9IGFuZ3VsYXIubm9vcCxcbiAgICB0b2dnbGVJbnZva2VyID0gJGF0dHJzLm9uVG9nZ2xlID8gJHBhcnNlKCRhdHRycy5vblRvZ2dsZSkgOiBhbmd1bGFyLm5vb3AsXG4gICAgYXBwZW5kVG9Cb2R5ID0gZmFsc2UsXG4gICAgYXBwZW5kVG8gPSBudWxsLFxuICAgIGtleW5hdkVuYWJsZWQgPSBmYWxzZSxcbiAgICBzZWxlY3RlZE9wdGlvbiA9IG51bGwsXG4gICAgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5Jyk7XG5cbiAgJGVsZW1lbnQuYWRkQ2xhc3MoJ2Ryb3Bkb3duJyk7XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRhdHRycy5pc09wZW4pIHtcbiAgICAgIGdldElzT3BlbiA9ICRwYXJzZSgkYXR0cnMuaXNPcGVuKTtcbiAgICAgIHNldElzT3BlbiA9IGdldElzT3Blbi5hc3NpZ247XG5cbiAgICAgICRzY29wZS4kd2F0Y2goZ2V0SXNPcGVuLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBzY29wZS5pc09wZW4gPSAhIXZhbHVlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5kcm9wZG93bkFwcGVuZFRvKSkge1xuICAgICAgdmFyIGFwcGVuZFRvRWwgPSAkcGFyc2UoJGF0dHJzLmRyb3Bkb3duQXBwZW5kVG8pKHNjb3BlKTtcbiAgICAgIGlmIChhcHBlbmRUb0VsKSB7XG4gICAgICAgIGFwcGVuZFRvID0gYW5ndWxhci5lbGVtZW50KGFwcGVuZFRvRWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGVuZFRvQm9keSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5kcm9wZG93bkFwcGVuZFRvQm9keSk7XG4gICAga2V5bmF2RW5hYmxlZCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5rZXlib2FyZE5hdik7XG5cbiAgICBpZiAoYXBwZW5kVG9Cb2R5ICYmICFhcHBlbmRUbykge1xuICAgICAgYXBwZW5kVG8gPSBib2R5O1xuICAgIH1cblxuICAgIGlmIChhcHBlbmRUbyAmJiBzZWxmLmRyb3Bkb3duTWVudSkge1xuICAgICAgYXBwZW5kVG8uYXBwZW5kKHNlbGYuZHJvcGRvd25NZW51KTtcbiAgICAgICRlbGVtZW50Lm9uKCckZGVzdHJveScsIGZ1bmN0aW9uIGhhbmRsZURlc3Ryb3lFdmVudCgpIHtcbiAgICAgICAgc2VsZi5kcm9wZG93bk1lbnUucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy50b2dnbGUgPSBmdW5jdGlvbihvcGVuKSB7XG4gICAgcmV0dXJuIHNjb3BlLmlzT3BlbiA9IGFyZ3VtZW50cy5sZW5ndGggPyAhIW9wZW4gOiAhc2NvcGUuaXNPcGVuO1xuICB9O1xuXG4gIC8vIEFsbG93IG90aGVyIGRpcmVjdGl2ZXMgdG8gd2F0Y2ggc3RhdHVzXG4gIHRoaXMuaXNPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNjb3BlLmlzT3BlbjtcbiAgfTtcblxuICBzY29wZS5nZXRUb2dnbGVFbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYudG9nZ2xlRWxlbWVudDtcbiAgfTtcblxuICBzY29wZS5nZXRBdXRvQ2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJGF0dHJzLmF1dG9DbG9zZSB8fCAnYWx3YXlzJzsgLy9vciAnb3V0c2lkZUNsaWNrJyBvciAnZGlzYWJsZWQnXG4gIH07XG5cbiAgc2NvcGUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkZWxlbWVudDtcbiAgfTtcblxuICBzY29wZS5pc0tleW5hdkVuYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ga2V5bmF2RW5hYmxlZDtcbiAgfTtcblxuICBzY29wZS5mb2N1c0Ryb3Bkb3duRW50cnkgPSBmdW5jdGlvbihrZXlDb2RlKSB7XG4gICAgdmFyIGVsZW1zID0gc2VsZi5kcm9wZG93bk1lbnUgPyAvL0lmIGFwcGVuZCB0byBib2R5IGlzIHVzZWQuXG4gICAgICBhbmd1bGFyLmVsZW1lbnQoc2VsZi5kcm9wZG93bk1lbnUpLmZpbmQoJ2EnKSA6XG4gICAgICAkZWxlbWVudC5maW5kKCd1bCcpLmVxKDApLmZpbmQoJ2EnKTtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSA0MDoge1xuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoc2VsZi5zZWxlY3RlZE9wdGlvbikpIHtcbiAgICAgICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uID0gc2VsZi5zZWxlY3RlZE9wdGlvbiA9PT0gZWxlbXMubGVuZ3RoIC0gMSA/XG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uIDpcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRPcHRpb24gKyAxO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAzODoge1xuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNOdW1iZXIoc2VsZi5zZWxlY3RlZE9wdGlvbikpIHtcbiAgICAgICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uID0gZWxlbXMubGVuZ3RoIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uID0gc2VsZi5zZWxlY3RlZE9wdGlvbiA9PT0gMCA/XG4gICAgICAgICAgICAwIDogc2VsZi5zZWxlY3RlZE9wdGlvbiAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGVsZW1zW3NlbGYuc2VsZWN0ZWRPcHRpb25dLmZvY3VzKCk7XG4gIH07XG5cbiAgc2NvcGUuZ2V0RHJvcGRvd25FbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZHJvcGRvd25NZW51O1xuICB9O1xuXG4gIHNjb3BlLmZvY3VzVG9nZ2xlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzZWxmLnRvZ2dsZUVsZW1lbnQpIHtcbiAgICAgIHNlbGYudG9nZ2xlRWxlbWVudFswXS5mb2N1cygpO1xuICAgIH1cbiAgfTtcblxuICBzY29wZS4kd2F0Y2goJ2lzT3BlbicsIGZ1bmN0aW9uKGlzT3Blbiwgd2FzT3Blbikge1xuICAgIGlmIChhcHBlbmRUbyAmJiBzZWxmLmRyb3Bkb3duTWVudSkge1xuICAgICAgdmFyIHBvcyA9ICRwb3NpdGlvbi5wb3NpdGlvbkVsZW1lbnRzKCRlbGVtZW50LCBzZWxmLmRyb3Bkb3duTWVudSwgJ2JvdHRvbS1sZWZ0JywgdHJ1ZSksXG4gICAgICAgIGNzcyxcbiAgICAgICAgcmlnaHRhbGlnbjtcblxuICAgICAgY3NzID0ge1xuICAgICAgICB0b3A6IHBvcy50b3AgKyAncHgnLFxuICAgICAgICBkaXNwbGF5OiBpc09wZW4gPyAnYmxvY2snIDogJ25vbmUnXG4gICAgICB9O1xuXG4gICAgICByaWdodGFsaWduID0gc2VsZi5kcm9wZG93bk1lbnUuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbiAgICAgIGlmICghcmlnaHRhbGlnbikge1xuICAgICAgICBjc3MubGVmdCA9IHBvcy5sZWZ0ICsgJ3B4JztcbiAgICAgICAgY3NzLnJpZ2h0ID0gJ2F1dG8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3NzLmxlZnQgPSAnYXV0byc7XG4gICAgICAgIGNzcy5yaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIC1cbiAgICAgICAgICAocG9zLmxlZnQgKyAkZWxlbWVudC5wcm9wKCdvZmZzZXRXaWR0aCcpKSArICdweCc7XG4gICAgICB9XG5cbiAgICAgIC8vIE5lZWQgdG8gYWRqdXN0IG91ciBwb3NpdGlvbmluZyB0byBiZSByZWxhdGl2ZSB0byB0aGUgYXBwZW5kVG8gY29udGFpbmVyXG4gICAgICAvLyBpZiBpdCdzIG5vdCB0aGUgYm9keSBlbGVtZW50XG4gICAgICBpZiAoIWFwcGVuZFRvQm9keSkge1xuICAgICAgICB2YXIgYXBwZW5kT2Zmc2V0ID0gJHBvc2l0aW9uLm9mZnNldChhcHBlbmRUbyk7XG5cbiAgICAgICAgY3NzLnRvcCA9IHBvcy50b3AgLSBhcHBlbmRPZmZzZXQudG9wICsgJ3B4JztcblxuICAgICAgICBpZiAoIXJpZ2h0YWxpZ24pIHtcbiAgICAgICAgICBjc3MubGVmdCA9IHBvcy5sZWZ0IC0gYXBwZW5kT2Zmc2V0LmxlZnQgKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNzcy5yaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIC1cbiAgICAgICAgICAgIChwb3MubGVmdCAtIGFwcGVuZE9mZnNldC5sZWZ0ICsgJGVsZW1lbnQucHJvcCgnb2Zmc2V0V2lkdGgnKSkgKyAncHgnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuZHJvcGRvd25NZW51LmNzcyhjc3MpO1xuICAgIH1cblxuICAgIHZhciBvcGVuQ29udGFpbmVyID0gYXBwZW5kVG8gPyBhcHBlbmRUbyA6ICRlbGVtZW50O1xuXG4gICAgJGFuaW1hdGVbaXNPcGVuID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKG9wZW5Db250YWluZXIsIGFwcGVuZFRvID8gYXBwZW5kVG9PcGVuQ2xhc3MgOiBvcGVuQ2xhc3MpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaXNPcGVuKSAmJiBpc09wZW4gIT09IHdhc09wZW4pIHtcbiAgICAgICAgdG9nZ2xlSW52b2tlcigkc2NvcGUsIHsgb3BlbjogISFpc09wZW4gfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICBpZiAoc2VsZi5kcm9wZG93bk1lbnVUZW1wbGF0ZVVybCkge1xuICAgICAgICAkdGVtcGxhdGVSZXF1ZXN0KHNlbGYuZHJvcGRvd25NZW51VGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24odHBsQ29udGVudCkge1xuICAgICAgICAgIHRlbXBsYXRlU2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgJGNvbXBpbGUodHBsQ29udGVudC50cmltKCkpKHRlbXBsYXRlU2NvcGUsIGZ1bmN0aW9uKGRyb3Bkb3duRWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIG5ld0VsID0gZHJvcGRvd25FbGVtZW50O1xuICAgICAgICAgICAgc2VsZi5kcm9wZG93bk1lbnUucmVwbGFjZVdpdGgobmV3RWwpO1xuICAgICAgICAgICAgc2VsZi5kcm9wZG93bk1lbnUgPSBuZXdFbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLmZvY3VzVG9nZ2xlRWxlbWVudCgpO1xuICAgICAgdWliRHJvcGRvd25TZXJ2aWNlLm9wZW4oc2NvcGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc2VsZi5kcm9wZG93bk1lbnVUZW1wbGF0ZVVybCkge1xuICAgICAgICBpZiAodGVtcGxhdGVTY29wZSkge1xuICAgICAgICAgIHRlbXBsYXRlU2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3RWwgPSBhbmd1bGFyLmVsZW1lbnQoJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj48L3VsPicpO1xuICAgICAgICBzZWxmLmRyb3Bkb3duTWVudS5yZXBsYWNlV2l0aChuZXdFbCk7XG4gICAgICAgIHNlbGYuZHJvcGRvd25NZW51ID0gbmV3RWw7XG4gICAgICB9XG5cbiAgICAgIHVpYkRyb3Bkb3duU2VydmljZS5jbG9zZShzY29wZSk7XG4gICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHNldElzT3BlbikpIHtcbiAgICAgIHNldElzT3Blbigkc2NvcGUsIGlzT3Blbik7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjb3BlLmdldEF1dG9DbG9zZSgpICE9PSAnZGlzYWJsZWQnKSB7XG4gICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkRyb3Bkb3duJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgY29udHJvbGxlcjogJ1VpYkRyb3Bkb3duQ29udHJvbGxlcicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBkcm9wZG93bkN0cmwpIHtcbiAgICAgIGRyb3Bkb3duQ3RybC5pbml0KCk7XG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliRHJvcGRvd25NZW51JywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiAnP151aWJEcm9wZG93bicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBkcm9wZG93bkN0cmwpIHtcbiAgICAgIGlmICghZHJvcGRvd25DdHJsIHx8IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRyb3Bkb3duTmVzdGVkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcblxuICAgICAgdmFyIHRwbFVybCA9IGF0dHJzLnRlbXBsYXRlVXJsO1xuICAgICAgaWYgKHRwbFVybCkge1xuICAgICAgICBkcm9wZG93bkN0cmwuZHJvcGRvd25NZW51VGVtcGxhdGVVcmwgPSB0cGxVcmw7XG4gICAgICB9XG5cbiAgICAgIGlmICghZHJvcGRvd25DdHJsLmRyb3Bkb3duTWVudSkge1xuICAgICAgICBkcm9wZG93bkN0cmwuZHJvcGRvd25NZW51ID0gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJEcm9wZG93blRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6ICc/XnVpYkRyb3Bkb3duJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGRyb3Bkb3duQ3RybCkge1xuICAgICAgaWYgKCFkcm9wZG93bkN0cmwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdkcm9wZG93bi10b2dnbGUnKTtcblxuICAgICAgZHJvcGRvd25DdHJsLnRvZ2dsZUVsZW1lbnQgPSBlbGVtZW50O1xuXG4gICAgICB2YXIgdG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICghZWxlbWVudC5oYXNDbGFzcygnZGlzYWJsZWQnKSAmJiAhYXR0cnMuZGlzYWJsZWQpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcm9wZG93bkN0cmwudG9nZ2xlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XG5cbiAgICAgIC8vIFdBSS1BUklBXG4gICAgICBlbGVtZW50LmF0dHIoeyAnYXJpYS1oYXNwb3B1cCc6IHRydWUsICdhcmlhLWV4cGFuZGVkJzogZmFsc2UgfSk7XG4gICAgICBzY29wZS4kd2F0Y2goZHJvcGRvd25DdHJsLmlzT3BlbiwgZnVuY3Rpb24oaXNPcGVuKSB7XG4gICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsICEhaXNPcGVuKTtcbiAgICAgIH0pO1xuXG4gICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQudW5iaW5kKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnN0YWNrZWRNYXAnLCBbXSlcbi8qKlxuICogQSBoZWxwZXIsIGludGVybmFsIGRhdGEgc3RydWN0dXJlIHRoYXQgYWN0cyBhcyBhIG1hcCBidXQgYWxzbyBhbGxvd3MgZ2V0dGluZyAvIHJlbW92aW5nXG4gKiBlbGVtZW50cyBpbiB0aGUgTElGTyBvcmRlclxuICovXG4gIC5mYWN0b3J5KCckJHN0YWNrZWRNYXAnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3JlYXRlTmV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0YWNrID0gW107XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChrZXkgPT09IHN0YWNrW2ldLmtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFja1tpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAga2V5czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBrZXlzLnB1c2goc3RhY2tbaV0ua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gLTE7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChrZXkgPT09IHN0YWNrW2ldLmtleSkge1xuICAgICAgICAgICAgICAgIGlkeCA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGFjay5zcGxpY2UoaWR4LCAxKVswXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZVRvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhY2suc3BsaWNlKHN0YWNrLmxlbmd0aCAtIDEsIDEpWzBdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbGVuZ3RoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGFjay5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5tb2RhbCcsIFsndWkuYm9vdHN0cmFwLnN0YWNrZWRNYXAnXSlcbi8qKlxuICogQSBoZWxwZXIsIGludGVybmFsIGRhdGEgc3RydWN0dXJlIHRoYXQgc3RvcmVzIGFsbCByZWZlcmVuY2VzIGF0dGFjaGVkIHRvIGtleVxuICovXG4gIC5mYWN0b3J5KCckJG11bHRpTWFwJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0ZU5ldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYXAgPSB7fTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG1hcCkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBtYXBba2V5XVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIG1hcFtrZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaGFzS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiAhIW1hcFtrZXldO1xuICAgICAgICAgIH0sXG4gICAgICAgICAga2V5czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHB1dDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFtYXBba2V5XSkge1xuICAgICAgICAgICAgICBtYXBba2V5XSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXBba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IG1hcFtrZXldO1xuXG4gICAgICAgICAgICBpZiAoIXZhbHVlcykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpZHggPSB2YWx1ZXMuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgICAgIHZhbHVlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBtYXBba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuLyoqXG4gKiBQbHVnZ2FibGUgcmVzb2x2ZSBtZWNoYW5pc20gZm9yIHRoZSBtb2RhbCByZXNvbHZlIHJlc29sdXRpb25cbiAqIFN1cHBvcnRzIFVJIFJvdXRlcidzICRyZXNvbHZlIHNlcnZpY2VcbiAqL1xuICAucHJvdmlkZXIoJyR1aWJSZXNvbHZlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc29sdmUgPSB0aGlzO1xuICAgIHRoaXMucmVzb2x2ZXIgPSBudWxsO1xuXG4gICAgdGhpcy5zZXRSZXNvbHZlciA9IGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICB0aGlzLnJlc29sdmVyID0gcmVzb2x2ZXI7XG4gICAgfTtcblxuICAgIHRoaXMuJGdldCA9IFsnJGluamVjdG9yJywgJyRxJywgZnVuY3Rpb24oJGluamVjdG9yLCAkcSkge1xuICAgICAgdmFyIHJlc29sdmVyID0gcmVzb2x2ZS5yZXNvbHZlciA/ICRpbmplY3Rvci5nZXQocmVzb2x2ZS5yZXNvbHZlcikgOiBudWxsO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24oaW52b2NhYmxlcywgbG9jYWxzLCBwYXJlbnQsIHNlbGYpIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlci5yZXNvbHZlKGludm9jYWJsZXMsIGxvY2FscywgcGFyZW50LCBzZWxmKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZvY2FibGVzLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih2YWx1ZSkgfHwgYW5ndWxhci5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKCRxLnJlc29sdmUoJGluamVjdG9yLmludm9rZSh2YWx1ZSkpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaCgkcS5yZXNvbHZlKCRpbmplY3Rvci5nZXQodmFsdWUpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKCRxLnJlc29sdmUodmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZXMpIHtcbiAgICAgICAgICAgIHZhciByZXNvbHZlT2JqID0ge307XG4gICAgICAgICAgICB2YXIgcmVzb2x2ZUl0ZXIgPSAwO1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGludm9jYWJsZXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZU9ialtrZXldID0gcmVzb2x2ZXNbcmVzb2x2ZUl0ZXIrK107XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVPYmo7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV07XG4gIH0pXG5cbi8qKlxuICogQSBoZWxwZXIgZGlyZWN0aXZlIGZvciB0aGUgJG1vZGFsIHNlcnZpY2UuIEl0IGNyZWF0ZXMgYSBiYWNrZHJvcCBlbGVtZW50LlxuICovXG4gIC5kaXJlY3RpdmUoJ3VpYk1vZGFsQmFja2Ryb3AnLCBbJyRhbmltYXRlQ3NzJywgJyRpbmplY3RvcicsICckdWliTW9kYWxTdGFjaycsXG4gIGZ1bmN0aW9uKCRhbmltYXRlQ3NzLCAkaW5qZWN0b3IsICRtb2RhbFN0YWNrKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS9tb2RhbC9iYWNrZHJvcC5odG1sJyxcbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRFbGVtZW50LCB0QXR0cnMpIHtcbiAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3ModEF0dHJzLmJhY2tkcm9wQ2xhc3MpO1xuICAgICAgICByZXR1cm4gbGlua0ZuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaW5rRm4oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBpZiAoYXR0cnMubW9kYWxJbkNsYXNzKSB7XG4gICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICBhZGRDbGFzczogYXR0cnMubW9kYWxJbkNsYXNzXG4gICAgICAgIH0pLnN0YXJ0KCk7XG5cbiAgICAgICAgc2NvcGUuJG9uKCRtb2RhbFN0YWNrLk5PV19DTE9TSU5HX0VWRU5ULCBmdW5jdGlvbihlLCBzZXRJc0FzeW5jKSB7XG4gICAgICAgICAgdmFyIGRvbmUgPSBzZXRJc0FzeW5jKCk7XG4gICAgICAgICAgaWYgKHNjb3BlLm1vZGFsT3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3M6IGF0dHJzLm1vZGFsSW5DbGFzc1xuICAgICAgICAgICAgfSkuc3RhcnQoKS50aGVuKGRvbmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKVxuXG4gIC5kaXJlY3RpdmUoJ3VpYk1vZGFsV2luZG93JywgWyckdWliTW9kYWxTdGFjaycsICckcScsICckYW5pbWF0ZScsICckYW5pbWF0ZUNzcycsICckZG9jdW1lbnQnLFxuICBmdW5jdGlvbigkbW9kYWxTdGFjaywgJHEsICRhbmltYXRlLCAkYW5pbWF0ZUNzcywgJGRvY3VtZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGluZGV4OiAnQCdcbiAgICAgIH0sXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgIHJldHVybiB0QXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9tb2RhbC93aW5kb3cuaHRtbCc7XG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoYXR0cnMud2luZG93Q2xhc3MgfHwgJycpO1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKGF0dHJzLndpbmRvd1RvcENsYXNzIHx8ICcnKTtcbiAgICAgICAgc2NvcGUuc2l6ZSA9IGF0dHJzLnNpemU7XG5cbiAgICAgICAgc2NvcGUuY2xvc2UgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICB2YXIgbW9kYWwgPSAkbW9kYWxTdGFjay5nZXRUb3AoKTtcbiAgICAgICAgICBpZiAobW9kYWwgJiYgbW9kYWwudmFsdWUuYmFja2Ryb3AgJiZcbiAgICAgICAgICAgIG1vZGFsLnZhbHVlLmJhY2tkcm9wICE9PSAnc3RhdGljJyAmJlxuICAgICAgICAgICAgZXZ0LnRhcmdldCA9PT0gZXZ0LmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgJG1vZGFsU3RhY2suZGlzbWlzcyhtb2RhbC5rZXksICdiYWNrZHJvcCBjbGljaycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBtb3ZlZCBmcm9tIHRlbXBsYXRlIHRvIGZpeCBpc3N1ZSAjMjI4MFxuICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIHNjb3BlLmNsb3NlKTtcblxuICAgICAgICAvLyBUaGlzIHByb3BlcnR5IGlzIG9ubHkgYWRkZWQgdG8gdGhlIHNjb3BlIGZvciB0aGUgcHVycG9zZSBvZiBkZXRlY3Rpbmcgd2hlbiB0aGlzIGRpcmVjdGl2ZSBpcyByZW5kZXJlZC5cbiAgICAgICAgLy8gV2UgY2FuIGRldGVjdCB0aGF0IGJ5IHVzaW5nIHRoaXMgcHJvcGVydHkgaW4gdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpcmVjdGl2ZSBhbmQgdGhlbiB1c2VcbiAgICAgICAgLy8ge0BsaW5rIEF0dHJpYnV0ZSMkb2JzZXJ2ZX0gb24gaXQuIEZvciBtb3JlIGRldGFpbHMgcGxlYXNlIHNlZSB7QGxpbmsgVGFibGVDb2x1bW5SZXNpemV9LlxuICAgICAgICBzY29wZS4kaXNSZW5kZXJlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gRGVmZXJyZWQgb2JqZWN0IHRoYXQgd2lsbCBiZSByZXNvbHZlZCB3aGVuIHRoaXMgbW9kYWwgaXMgcmVuZGVyLlxuICAgICAgICB2YXIgbW9kYWxSZW5kZXJEZWZlck9iaiA9ICRxLmRlZmVyKCk7XG4gICAgICAgIC8vIE9ic2VydmUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb24gbmV4dCBkaWdlc3QgY3ljbGUgYWZ0ZXIgY29tcGlsYXRpb24sIGVuc3VyaW5nIHRoYXQgdGhlIERPTSBpcyByZWFkeS5cbiAgICAgICAgLy8gSW4gb3JkZXIgdG8gdXNlIHRoaXMgd2F5IG9mIGZpbmRpbmcgd2hldGhlciBET00gaXMgcmVhZHksIHdlIG5lZWQgdG8gb2JzZXJ2ZSBhIHNjb3BlIHByb3BlcnR5IHVzZWQgaW4gbW9kYWwncyB0ZW1wbGF0ZS5cbiAgICAgICAgYXR0cnMuJG9ic2VydmUoJ21vZGFsUmVuZGVyJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgbW9kYWxSZW5kZXJEZWZlck9iai5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBtb2RhbFJlbmRlckRlZmVyT2JqLnByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYW5pbWF0aW9uUHJvbWlzZSA9IG51bGw7XG5cbiAgICAgICAgICBpZiAoYXR0cnMubW9kYWxJbkNsYXNzKSB7XG4gICAgICAgICAgICBhbmltYXRpb25Qcm9taXNlID0gJGFuaW1hdGVDc3MoZWxlbWVudCwge1xuICAgICAgICAgICAgICBhZGRDbGFzczogYXR0cnMubW9kYWxJbkNsYXNzXG4gICAgICAgICAgICB9KS5zdGFydCgpO1xuXG4gICAgICAgICAgICBzY29wZS4kb24oJG1vZGFsU3RhY2suTk9XX0NMT1NJTkdfRVZFTlQsIGZ1bmN0aW9uKGUsIHNldElzQXN5bmMpIHtcbiAgICAgICAgICAgICAgdmFyIGRvbmUgPSBzZXRJc0FzeW5jKCk7XG4gICAgICAgICAgICAgIGlmICgkYW5pbWF0ZUNzcykge1xuICAgICAgICAgICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBhdHRycy5tb2RhbEluQ2xhc3NcbiAgICAgICAgICAgICAgICB9KS5zdGFydCgpLnRoZW4oZG9uZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgYXR0cnMubW9kYWxJbkNsYXNzKS50aGVuKGRvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICAgICRxLndoZW4oYW5pbWF0aW9uUHJvbWlzZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIHdpdGhpbiB0aGUgZnJlc2hseS1vcGVuZWQgbW9kYWwgYWxyZWFkeSBoYXMgZm9jdXMgKHBlcmhhcHMgdmlhIGFcbiAgICAgICAgICAgICAqIGRpcmVjdGl2ZSB0aGF0IGNhdXNlcyBmb2N1cykuIHRoZW4gbm8gbmVlZCB0byB0cnkgYW5kIGZvY3VzIGFueXRoaW5nLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoISgkZG9jdW1lbnRbMF0uYWN0aXZlRWxlbWVudCAmJiBlbGVtZW50WzBdLmNvbnRhaW5zKCRkb2N1bWVudFswXS5hY3RpdmVFbGVtZW50KSkpIHtcbiAgICAgICAgICAgICAgdmFyIGlucHV0V2l0aEF1dG9mb2N1cyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2F1dG9mb2N1c10nKTtcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEF1dG8tZm9jdXNpbmcgb2YgYSBmcmVzaGx5LW9wZW5lZCBtb2RhbCBlbGVtZW50IGNhdXNlcyBhbnkgY2hpbGQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICogd2l0aCB0aGUgYXV0b2ZvY3VzIGF0dHJpYnV0ZSB0byBsb3NlIGZvY3VzLiBUaGlzIGlzIGFuIGlzc3VlIG9uIHRvdWNoXG4gICAgICAgICAgICAgICAqIGJhc2VkIGRldmljZXMgd2hpY2ggd2lsbCBzaG93IGFuZCB0aGVuIGhpZGUgdGhlIG9uc2NyZWVuIGtleWJvYXJkLlxuICAgICAgICAgICAgICAgKiBBdHRlbXB0cyB0byByZWZvY3VzIHRoZSBhdXRvZm9jdXMgZWxlbWVudCB2aWEgSmF2YVNjcmlwdCB3aWxsIG5vdCByZW9wZW5cbiAgICAgICAgICAgICAgICogdGhlIG9uc2NyZWVuIGtleWJvYXJkLiBGaXhlZCBieSB1cGRhdGVkIHRoZSBmb2N1c2luZyBsb2dpYyB0byBvbmx5IGF1dG9mb2N1c1xuICAgICAgICAgICAgICAgKiB0aGUgbW9kYWwgZWxlbWVudCBpZiB0aGUgbW9kYWwgZG9lcyBub3QgY29udGFpbiBhbiBhdXRvZm9jdXMgZWxlbWVudC5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIGlmIChpbnB1dFdpdGhBdXRvZm9jdXMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dFdpdGhBdXRvZm9jdXMuZm9jdXMoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIE5vdGlmeSB7QGxpbmsgJG1vZGFsU3RhY2t9IHRoYXQgbW9kYWwgaXMgcmVuZGVyZWQuXG4gICAgICAgICAgdmFyIG1vZGFsID0gJG1vZGFsU3RhY2suZ2V0VG9wKCk7XG4gICAgICAgICAgaWYgKG1vZGFsKSB7XG4gICAgICAgICAgICAkbW9kYWxTdGFjay5tb2RhbFJlbmRlcmVkKG1vZGFsLmtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSlcblxuICAuZGlyZWN0aXZlKCd1aWJNb2RhbEFuaW1hdGlvbkNsYXNzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKHRFbGVtZW50LCB0QXR0cnMpIHtcbiAgICAgICAgaWYgKHRBdHRycy5tb2RhbEFuaW1hdGlvbikge1xuICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKHRBdHRycy51aWJNb2RhbEFuaW1hdGlvbkNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pXG5cbiAgLmRpcmVjdGl2ZSgndWliTW9kYWxUcmFuc2NsdWRlJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZSkge1xuICAgICAgICB0cmFuc2NsdWRlKHNjb3BlLiRwYXJlbnQsIGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgICAgZWxlbWVudC5lbXB0eSgpO1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGNsb25lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuICAuZmFjdG9yeSgnJHVpYk1vZGFsU3RhY2snLCBbJyRhbmltYXRlJywgJyRhbmltYXRlQ3NzJywgJyRkb2N1bWVudCcsXG4gICAgJyRjb21waWxlJywgJyRyb290U2NvcGUnLCAnJHEnLCAnJCRtdWx0aU1hcCcsICckJHN0YWNrZWRNYXAnLFxuICAgIGZ1bmN0aW9uKCRhbmltYXRlLCAkYW5pbWF0ZUNzcywgJGRvY3VtZW50LCAkY29tcGlsZSwgJHJvb3RTY29wZSwgJHEsICQkbXVsdGlNYXAsICQkc3RhY2tlZE1hcCkge1xuICAgICAgdmFyIE9QRU5FRF9NT0RBTF9DTEFTUyA9ICdtb2RhbC1vcGVuJztcblxuICAgICAgdmFyIGJhY2tkcm9wRG9tRWwsIGJhY2tkcm9wU2NvcGU7XG4gICAgICB2YXIgb3BlbmVkV2luZG93cyA9ICQkc3RhY2tlZE1hcC5jcmVhdGVOZXcoKTtcbiAgICAgIHZhciBvcGVuZWRDbGFzc2VzID0gJCRtdWx0aU1hcC5jcmVhdGVOZXcoKTtcbiAgICAgIHZhciAkbW9kYWxTdGFjayA9IHtcbiAgICAgICAgTk9XX0NMT1NJTkdfRVZFTlQ6ICdtb2RhbC5zdGFjay5ub3ctY2xvc2luZydcbiAgICAgIH07XG5cbiAgICAgIC8vTW9kYWwgZm9jdXMgYmVoYXZpb3JcbiAgICAgIHZhciBmb2N1c2FibGVFbGVtZW50TGlzdDtcbiAgICAgIHZhciBmb2N1c0luZGV4ID0gMDtcbiAgICAgIHZhciB0YWJhYmJsZVNlbGVjdG9yID0gJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgJyArXG4gICAgICAgICdidXR0b246bm90KFtkaXNhYmxlZF0pLHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgJyArXG4gICAgICAgICdpZnJhbWUsIG9iamVjdCwgZW1iZWQsICpbdGFiaW5kZXhdLCAqW2NvbnRlbnRlZGl0YWJsZT10cnVlXSc7XG5cbiAgICAgIGZ1bmN0aW9uIGJhY2tkcm9wSW5kZXgoKSB7XG4gICAgICAgIHZhciB0b3BCYWNrZHJvcEluZGV4ID0gLTE7XG4gICAgICAgIHZhciBvcGVuZWQgPSBvcGVuZWRXaW5kb3dzLmtleXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcGVuZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAob3BlbmVkV2luZG93cy5nZXQob3BlbmVkW2ldKS52YWx1ZS5iYWNrZHJvcCkge1xuICAgICAgICAgICAgdG9wQmFja2Ryb3BJbmRleCA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3BCYWNrZHJvcEluZGV4O1xuICAgICAgfVxuXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaChiYWNrZHJvcEluZGV4LCBmdW5jdGlvbihuZXdCYWNrZHJvcEluZGV4KSB7XG4gICAgICAgIGlmIChiYWNrZHJvcFNjb3BlKSB7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5pbmRleCA9IG5ld0JhY2tkcm9wSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiByZW1vdmVNb2RhbFdpbmRvdyhtb2RhbEluc3RhbmNlLCBlbGVtZW50VG9SZWNlaXZlRm9jdXMpIHtcbiAgICAgICAgdmFyIG1vZGFsV2luZG93ID0gb3BlbmVkV2luZG93cy5nZXQobW9kYWxJbnN0YW5jZSkudmFsdWU7XG4gICAgICAgIHZhciBhcHBlbmRUb0VsZW1lbnQgPSBtb2RhbFdpbmRvdy5hcHBlbmRUbztcblxuICAgICAgICAvL2NsZWFuIHVwIHRoZSBzdGFja1xuICAgICAgICBvcGVuZWRXaW5kb3dzLnJlbW92ZShtb2RhbEluc3RhbmNlKTtcblxuICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUobW9kYWxXaW5kb3cubW9kYWxEb21FbCwgbW9kYWxXaW5kb3cubW9kYWxTY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIG1vZGFsQm9keUNsYXNzID0gbW9kYWxXaW5kb3cub3BlbmVkQ2xhc3MgfHwgT1BFTkVEX01PREFMX0NMQVNTO1xuICAgICAgICAgIG9wZW5lZENsYXNzZXMucmVtb3ZlKG1vZGFsQm9keUNsYXNzLCBtb2RhbEluc3RhbmNlKTtcbiAgICAgICAgICBhcHBlbmRUb0VsZW1lbnQudG9nZ2xlQ2xhc3MobW9kYWxCb2R5Q2xhc3MsIG9wZW5lZENsYXNzZXMuaGFzS2V5KG1vZGFsQm9keUNsYXNzKSk7XG4gICAgICAgICAgdG9nZ2xlVG9wV2luZG93Q2xhc3ModHJ1ZSk7XG4gICAgICAgIH0sIG1vZGFsV2luZG93LmNsb3NlZERlZmVycmVkKTtcbiAgICAgICAgY2hlY2tSZW1vdmVCYWNrZHJvcCgpO1xuXG4gICAgICAgIC8vbW92ZSBmb2N1cyB0byBzcGVjaWZpZWQgZWxlbWVudCBpZiBhdmFpbGFibGUsIG9yIGVsc2UgdG8gYm9keVxuICAgICAgICBpZiAoZWxlbWVudFRvUmVjZWl2ZUZvY3VzICYmIGVsZW1lbnRUb1JlY2VpdmVGb2N1cy5mb2N1cykge1xuICAgICAgICAgIGVsZW1lbnRUb1JlY2VpdmVGb2N1cy5mb2N1cygpO1xuICAgICAgICB9IGVsc2UgaWYgKGFwcGVuZFRvRWxlbWVudC5mb2N1cykge1xuICAgICAgICAgIGFwcGVuZFRvRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBvciByZW1vdmUgXCJ3aW5kb3dUb3BDbGFzc1wiIGZyb20gdGhlIHRvcCB3aW5kb3cgaW4gdGhlIHN0YWNrXG4gICAgICBmdW5jdGlvbiB0b2dnbGVUb3BXaW5kb3dDbGFzcyh0b2dnbGVTd2l0Y2gpIHtcbiAgICAgICAgdmFyIG1vZGFsV2luZG93O1xuXG4gICAgICAgIGlmIChvcGVuZWRXaW5kb3dzLmxlbmd0aCgpID4gMCkge1xuICAgICAgICAgIG1vZGFsV2luZG93ID0gb3BlbmVkV2luZG93cy50b3AoKS52YWx1ZTtcbiAgICAgICAgICBtb2RhbFdpbmRvdy5tb2RhbERvbUVsLnRvZ2dsZUNsYXNzKG1vZGFsV2luZG93LndpbmRvd1RvcENsYXNzIHx8ICcnLCB0b2dnbGVTd2l0Y2gpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrUmVtb3ZlQmFja2Ryb3AoKSB7XG4gICAgICAgIC8vcmVtb3ZlIGJhY2tkcm9wIGlmIG5vIGxvbmdlciBuZWVkZWRcbiAgICAgICAgaWYgKGJhY2tkcm9wRG9tRWwgJiYgYmFja2Ryb3BJbmRleCgpID09PSAtMSkge1xuICAgICAgICAgIHZhciBiYWNrZHJvcFNjb3BlUmVmID0gYmFja2Ryb3BTY29wZTtcbiAgICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUoYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmID0gbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBiYWNrZHJvcERvbUVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlQWZ0ZXJBbmltYXRlKGRvbUVsLCBzY29wZSwgZG9uZSwgY2xvc2VkRGVmZXJyZWQpIHtcbiAgICAgICAgdmFyIGFzeW5jRGVmZXJyZWQ7XG4gICAgICAgIHZhciBhc3luY1Byb21pc2UgPSBudWxsO1xuICAgICAgICB2YXIgc2V0SXNBc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghYXN5bmNEZWZlcnJlZCkge1xuICAgICAgICAgICAgYXN5bmNEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBhc3luY1Byb21pc2UgPSBhc3luY0RlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRG9uZSgpIHtcbiAgICAgICAgICAgIGFzeW5jRGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHNjb3BlLiRicm9hZGNhc3QoJG1vZGFsU3RhY2suTk9XX0NMT1NJTkdfRVZFTlQsIHNldElzQXN5bmMpO1xuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBpdCdzIGludGVudGlvbmFsIHRoYXQgYXN5bmNQcm9taXNlIG1pZ2h0IGJlIG51bGwuXG4gICAgICAgIC8vIFRoYXQncyB3aGVuIHNldElzQXN5bmMgaGFzIG5vdCBiZWVuIGNhbGxlZCBkdXJpbmcgdGhlXG4gICAgICAgIC8vIE5PV19DTE9TSU5HX0VWRU5UIGJyb2FkY2FzdC5cbiAgICAgICAgcmV0dXJuICRxLndoZW4oYXN5bmNQcm9taXNlKS50aGVuKGFmdGVyQW5pbWF0aW5nKTtcblxuICAgICAgICBmdW5jdGlvbiBhZnRlckFuaW1hdGluZygpIHtcbiAgICAgICAgICBpZiAoYWZ0ZXJBbmltYXRpbmcuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZnRlckFuaW1hdGluZy5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICRhbmltYXRlQ3NzKGRvbUVsLCB7XG4gICAgICAgICAgICBldmVudDogJ2xlYXZlJ1xuICAgICAgICAgIH0pLnN0YXJ0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRvbUVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgaWYgKGNsb3NlZERlZmVycmVkKSB7XG4gICAgICAgICAgICAgIGNsb3NlZERlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJGRvY3VtZW50Lm9uKCdrZXlkb3duJywga2V5ZG93bkxpc3RlbmVyKTtcblxuICAgICAgJHJvb3RTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICRkb2N1bWVudC5vZmYoJ2tleWRvd24nLCBrZXlkb3duTGlzdGVuZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIGtleWRvd25MaXN0ZW5lcihldnQpIHtcbiAgICAgICAgaWYgKGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgIHJldHVybiBldnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbW9kYWwgPSBvcGVuZWRXaW5kb3dzLnRvcCgpO1xuICAgICAgICBpZiAobW9kYWwpIHtcbiAgICAgICAgICBzd2l0Y2ggKGV2dC53aGljaCkge1xuICAgICAgICAgICAgY2FzZSAyNzoge1xuICAgICAgICAgICAgICBpZiAobW9kYWwudmFsdWUua2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICRtb2RhbFN0YWNrLmRpc21pc3MobW9kYWwua2V5LCAnZXNjYXBlIGtleSBwcmVzcycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSA5OiB7XG4gICAgICAgICAgICAgICRtb2RhbFN0YWNrLmxvYWRGb2N1c0VsZW1lbnRMaXN0KG1vZGFsKTtcbiAgICAgICAgICAgICAgdmFyIGZvY3VzQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtb2RhbFN0YWNrLmlzRm9jdXNJbkZpcnN0SXRlbShldnQpIHx8ICRtb2RhbFN0YWNrLmlzTW9kYWxGb2N1c2VkKGV2dCwgbW9kYWwpKSB7XG4gICAgICAgICAgICAgICAgICBmb2N1c0NoYW5nZWQgPSAkbW9kYWxTdGFjay5mb2N1c0xhc3RGb2N1c2FibGVFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICgkbW9kYWxTdGFjay5pc0ZvY3VzSW5MYXN0SXRlbShldnQpKSB7XG4gICAgICAgICAgICAgICAgICBmb2N1c0NoYW5nZWQgPSAkbW9kYWxTdGFjay5mb2N1c0ZpcnN0Rm9jdXNhYmxlRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChmb2N1c0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICRtb2RhbFN0YWNrLm9wZW4gPSBmdW5jdGlvbihtb2RhbEluc3RhbmNlLCBtb2RhbCkge1xuICAgICAgICB2YXIgbW9kYWxPcGVuZXIgPSAkZG9jdW1lbnRbMF0uYWN0aXZlRWxlbWVudCxcbiAgICAgICAgICBtb2RhbEJvZHlDbGFzcyA9IG1vZGFsLm9wZW5lZENsYXNzIHx8IE9QRU5FRF9NT0RBTF9DTEFTUztcblxuICAgICAgICB0b2dnbGVUb3BXaW5kb3dDbGFzcyhmYWxzZSk7XG5cbiAgICAgICAgb3BlbmVkV2luZG93cy5hZGQobW9kYWxJbnN0YW5jZSwge1xuICAgICAgICAgIGRlZmVycmVkOiBtb2RhbC5kZWZlcnJlZCxcbiAgICAgICAgICByZW5kZXJEZWZlcnJlZDogbW9kYWwucmVuZGVyRGVmZXJyZWQsXG4gICAgICAgICAgY2xvc2VkRGVmZXJyZWQ6IG1vZGFsLmNsb3NlZERlZmVycmVkLFxuICAgICAgICAgIG1vZGFsU2NvcGU6IG1vZGFsLnNjb3BlLFxuICAgICAgICAgIGJhY2tkcm9wOiBtb2RhbC5iYWNrZHJvcCxcbiAgICAgICAgICBrZXlib2FyZDogbW9kYWwua2V5Ym9hcmQsXG4gICAgICAgICAgb3BlbmVkQ2xhc3M6IG1vZGFsLm9wZW5lZENsYXNzLFxuICAgICAgICAgIHdpbmRvd1RvcENsYXNzOiBtb2RhbC53aW5kb3dUb3BDbGFzcyxcbiAgICAgICAgICBhbmltYXRpb246IG1vZGFsLmFuaW1hdGlvbixcbiAgICAgICAgICBhcHBlbmRUbzogbW9kYWwuYXBwZW5kVG9cbiAgICAgICAgfSk7XG5cbiAgICAgICAgb3BlbmVkQ2xhc3Nlcy5wdXQobW9kYWxCb2R5Q2xhc3MsIG1vZGFsSW5zdGFuY2UpO1xuXG4gICAgICAgIHZhciBhcHBlbmRUb0VsZW1lbnQgPSBtb2RhbC5hcHBlbmRUbyxcbiAgICAgICAgICAgIGN1cnJCYWNrZHJvcEluZGV4ID0gYmFja2Ryb3BJbmRleCgpO1xuXG4gICAgICAgIGlmICghYXBwZW5kVG9FbGVtZW50Lmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYXBwZW5kVG8gZWxlbWVudCBub3QgZm91bmQuIE1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IHBhc3NlZCBpcyBpbiBET00uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyckJhY2tkcm9wSW5kZXggPj0gMCAmJiAhYmFja2Ryb3BEb21FbCkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5tb2RhbE9wdGlvbnMgPSBtb2RhbDtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlLmluZGV4ID0gY3VyckJhY2tkcm9wSW5kZXg7XG4gICAgICAgICAgYmFja2Ryb3BEb21FbCA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdiB1aWItbW9kYWwtYmFja2Ryb3A9XCJtb2RhbC1iYWNrZHJvcFwiPjwvZGl2PicpO1xuICAgICAgICAgIGJhY2tkcm9wRG9tRWwuYXR0cignYmFja2Ryb3AtY2xhc3MnLCBtb2RhbC5iYWNrZHJvcENsYXNzKTtcbiAgICAgICAgICBpZiAobW9kYWwuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICBiYWNrZHJvcERvbUVsLmF0dHIoJ21vZGFsLWFuaW1hdGlvbicsICd0cnVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgICRjb21waWxlKGJhY2tkcm9wRG9tRWwpKGJhY2tkcm9wU2NvcGUpO1xuICAgICAgICAgICRhbmltYXRlLmVudGVyKGJhY2tkcm9wRG9tRWwsIGFwcGVuZFRvRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5ndWxhckRvbUVsID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IHVpYi1tb2RhbC13aW5kb3c9XCJtb2RhbC13aW5kb3dcIj48L2Rpdj4nKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmF0dHIoe1xuICAgICAgICAgICd0ZW1wbGF0ZS11cmwnOiBtb2RhbC53aW5kb3dUZW1wbGF0ZVVybCxcbiAgICAgICAgICAnd2luZG93LWNsYXNzJzogbW9kYWwud2luZG93Q2xhc3MsXG4gICAgICAgICAgJ3dpbmRvdy10b3AtY2xhc3MnOiBtb2RhbC53aW5kb3dUb3BDbGFzcyxcbiAgICAgICAgICAnc2l6ZSc6IG1vZGFsLnNpemUsXG4gICAgICAgICAgJ2luZGV4Jzogb3BlbmVkV2luZG93cy5sZW5ndGgoKSAtIDEsXG4gICAgICAgICAgJ2FuaW1hdGUnOiAnYW5pbWF0ZSdcbiAgICAgICAgfSkuaHRtbChtb2RhbC5jb250ZW50KTtcbiAgICAgICAgaWYgKG1vZGFsLmFuaW1hdGlvbikge1xuICAgICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCdtb2RhbC1hbmltYXRpb24nLCAndHJ1ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGFuaW1hdGUuZW50ZXIoJGNvbXBpbGUoYW5ndWxhckRvbUVsKShtb2RhbC5zY29wZSksIGFwcGVuZFRvRWxlbWVudClcbiAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGFwcGVuZFRvRWxlbWVudCwgbW9kYWxCb2R5Q2xhc3MpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIG9wZW5lZFdpbmRvd3MudG9wKCkudmFsdWUubW9kYWxEb21FbCA9IGFuZ3VsYXJEb21FbDtcbiAgICAgICAgb3BlbmVkV2luZG93cy50b3AoKS52YWx1ZS5tb2RhbE9wZW5lciA9IG1vZGFsT3BlbmVyO1xuXG4gICAgICAgICRtb2RhbFN0YWNrLmNsZWFyRm9jdXNMaXN0Q2FjaGUoKTtcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIGJyb2FkY2FzdENsb3NpbmcobW9kYWxXaW5kb3csIHJlc3VsdE9yUmVhc29uLCBjbG9zaW5nKSB7XG4gICAgICAgIHJldHVybiAhbW9kYWxXaW5kb3cudmFsdWUubW9kYWxTY29wZS4kYnJvYWRjYXN0KCdtb2RhbC5jbG9zaW5nJywgcmVzdWx0T3JSZWFzb24sIGNsb3NpbmcpLmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICB9XG5cbiAgICAgICRtb2RhbFN0YWNrLmNsb3NlID0gZnVuY3Rpb24obW9kYWxJbnN0YW5jZSwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpO1xuICAgICAgICBpZiAobW9kYWxXaW5kb3cgJiYgYnJvYWRjYXN0Q2xvc2luZyhtb2RhbFdpbmRvdywgcmVzdWx0LCB0cnVlKSkge1xuICAgICAgICAgIG1vZGFsV2luZG93LnZhbHVlLm1vZGFsU2NvcGUuJCR1aWJEZXN0cnVjdGlvblNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgICAgbW9kYWxXaW5kb3cudmFsdWUuZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIHJlbW92ZU1vZGFsV2luZG93KG1vZGFsSW5zdGFuY2UsIG1vZGFsV2luZG93LnZhbHVlLm1vZGFsT3BlbmVyKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIW1vZGFsV2luZG93O1xuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suZGlzbWlzcyA9IGZ1bmN0aW9uKG1vZGFsSW5zdGFuY2UsIHJlYXNvbikge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93ICYmIGJyb2FkY2FzdENsb3NpbmcobW9kYWxXaW5kb3csIHJlYXNvbiwgZmFsc2UpKSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cudmFsdWUubW9kYWxTY29wZS4kJHVpYkRlc3RydWN0aW9uU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICBtb2RhbFdpbmRvdy52YWx1ZS5kZWZlcnJlZC5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICByZW1vdmVNb2RhbFdpbmRvdyhtb2RhbEluc3RhbmNlLCBtb2RhbFdpbmRvdy52YWx1ZS5tb2RhbE9wZW5lcik7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFtb2RhbFdpbmRvdztcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmRpc21pc3NBbGwgPSBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgdmFyIHRvcE1vZGFsID0gdGhpcy5nZXRUb3AoKTtcbiAgICAgICAgd2hpbGUgKHRvcE1vZGFsICYmIHRoaXMuZGlzbWlzcyh0b3BNb2RhbC5rZXksIHJlYXNvbikpIHtcbiAgICAgICAgICB0b3BNb2RhbCA9IHRoaXMuZ2V0VG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmdldFRvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gb3BlbmVkV2luZG93cy50b3AoKTtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLm1vZGFsUmVuZGVyZWQgPSBmdW5jdGlvbihtb2RhbEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpO1xuICAgICAgICBpZiAobW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy52YWx1ZS5yZW5kZXJEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmZvY3VzRmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9jdXNhYmxlRWxlbWVudExpc3RbMF0uZm9jdXMoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuICAgICAgJG1vZGFsU3RhY2suZm9jdXNMYXN0Rm9jdXNhYmxlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRMaXN0W2ZvY3VzYWJsZUVsZW1lbnRMaXN0Lmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suaXNNb2RhbEZvY3VzZWQgPSBmdW5jdGlvbihldnQsIG1vZGFsV2luZG93KSB7XG4gICAgICAgIGlmIChldnQgJiYgbW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICB2YXIgbW9kYWxEb21FbCA9IG1vZGFsV2luZG93LnZhbHVlLm1vZGFsRG9tRWw7XG4gICAgICAgICAgaWYgKG1vZGFsRG9tRWwgJiYgbW9kYWxEb21FbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAoZXZ0LnRhcmdldCB8fCBldnQuc3JjRWxlbWVudCkgPT09IG1vZGFsRG9tRWxbMF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmlzRm9jdXNJbkZpcnN0SXRlbSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiAoZXZ0LnRhcmdldCB8fCBldnQuc3JjRWxlbWVudCkgPT09IGZvY3VzYWJsZUVsZW1lbnRMaXN0WzBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmlzRm9jdXNJbkxhc3RJdGVtID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIChldnQudGFyZ2V0IHx8IGV2dC5zcmNFbGVtZW50KSA9PT0gZm9jdXNhYmxlRWxlbWVudExpc3RbZm9jdXNhYmxlRWxlbWVudExpc3QubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suY2xlYXJGb2N1c0xpc3RDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb2N1c2FibGVFbGVtZW50TGlzdCA9IFtdO1xuICAgICAgICBmb2N1c0luZGV4ID0gMDtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmxvYWRGb2N1c0VsZW1lbnRMaXN0ID0gZnVuY3Rpb24obW9kYWxXaW5kb3cpIHtcbiAgICAgICAgaWYgKGZvY3VzYWJsZUVsZW1lbnRMaXN0ID09PSB1bmRlZmluZWQgfHwgIWZvY3VzYWJsZUVsZW1lbnRMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGlmIChtb2RhbFdpbmRvdykge1xuICAgICAgICAgICAgdmFyIG1vZGFsRG9tRTEgPSBtb2RhbFdpbmRvdy52YWx1ZS5tb2RhbERvbUVsO1xuICAgICAgICAgICAgaWYgKG1vZGFsRG9tRTEgJiYgbW9kYWxEb21FMS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudExpc3QgPSBtb2RhbERvbUUxWzBdLnF1ZXJ5U2VsZWN0b3JBbGwodGFiYWJibGVTZWxlY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gJG1vZGFsU3RhY2s7XG4gICAgfV0pXG5cbiAgLnByb3ZpZGVyKCckdWliTW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgJG1vZGFsUHJvdmlkZXIgPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgYmFja2Ryb3A6IHRydWUsIC8vY2FuIGFsc28gYmUgZmFsc2Ugb3IgJ3N0YXRpYydcbiAgICAgICAga2V5Ym9hcmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICAkZ2V0OiBbJyRyb290U2NvcGUnLCAnJHEnLCAnJGRvY3VtZW50JywgJyR0ZW1wbGF0ZVJlcXVlc3QnLCAnJGNvbnRyb2xsZXInLCAnJHVpYlJlc29sdmUnLCAnJHVpYk1vZGFsU3RhY2snLFxuICAgICAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsICRkb2N1bWVudCwgJHRlbXBsYXRlUmVxdWVzdCwgJGNvbnRyb2xsZXIsICR1aWJSZXNvbHZlLCAkbW9kYWxTdGFjaykge1xuICAgICAgICAgIHZhciAkbW9kYWwgPSB7fTtcblxuICAgICAgICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlUHJvbWlzZShvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy50ZW1wbGF0ZSA/ICRxLndoZW4ob3B0aW9ucy50ZW1wbGF0ZSkgOlxuICAgICAgICAgICAgICAkdGVtcGxhdGVSZXF1ZXN0KGFuZ3VsYXIuaXNGdW5jdGlvbihvcHRpb25zLnRlbXBsYXRlVXJsKSA/XG4gICAgICAgICAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZVVybCgpIDogb3B0aW9ucy50ZW1wbGF0ZVVybCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByb21pc2VDaGFpbiA9IG51bGw7XG4gICAgICAgICAgJG1vZGFsLmdldFByb21pc2VDaGFpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VDaGFpbjtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJG1vZGFsLm9wZW4gPSBmdW5jdGlvbihtb2RhbE9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbFJlc3VsdERlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHZhciBtb2RhbE9wZW5lZERlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHZhciBtb2RhbENsb3NlZERlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHZhciBtb2RhbFJlbmRlckRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgICAgICAgLy9wcmVwYXJlIGFuIGluc3RhbmNlIG9mIGEgbW9kYWwgdG8gYmUgaW5qZWN0ZWQgaW50byBjb250cm9sbGVycyBhbmQgcmV0dXJuZWQgdG8gYSBjYWxsZXJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0ge1xuICAgICAgICAgICAgICByZXN1bHQ6IG1vZGFsUmVzdWx0RGVmZXJyZWQucHJvbWlzZSxcbiAgICAgICAgICAgICAgb3BlbmVkOiBtb2RhbE9wZW5lZERlZmVycmVkLnByb21pc2UsXG4gICAgICAgICAgICAgIGNsb3NlZDogbW9kYWxDbG9zZWREZWZlcnJlZC5wcm9taXNlLFxuICAgICAgICAgICAgICByZW5kZXJlZDogbW9kYWxSZW5kZXJEZWZlcnJlZC5wcm9taXNlLFxuICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkbW9kYWxTdGFjay5jbG9zZShtb2RhbEluc3RhbmNlLCByZXN1bHQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBkaXNtaXNzOiBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRtb2RhbFN0YWNrLmRpc21pc3MobW9kYWxJbnN0YW5jZSwgcmVhc29uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9tZXJnZSBhbmQgY2xlYW4gdXAgb3B0aW9uc1xuICAgICAgICAgICAgbW9kYWxPcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sICRtb2RhbFByb3ZpZGVyLm9wdGlvbnMsIG1vZGFsT3B0aW9ucyk7XG4gICAgICAgICAgICBtb2RhbE9wdGlvbnMucmVzb2x2ZSA9IG1vZGFsT3B0aW9ucy5yZXNvbHZlIHx8IHt9O1xuICAgICAgICAgICAgbW9kYWxPcHRpb25zLmFwcGVuZFRvID0gbW9kYWxPcHRpb25zLmFwcGVuZFRvIHx8ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCk7XG5cbiAgICAgICAgICAgIC8vdmVyaWZ5IG9wdGlvbnNcbiAgICAgICAgICAgIGlmICghbW9kYWxPcHRpb25zLnRlbXBsYXRlICYmICFtb2RhbE9wdGlvbnMudGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmUgb2YgdGVtcGxhdGUgb3IgdGVtcGxhdGVVcmwgb3B0aW9ucyBpcyByZXF1aXJlZC4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlQW5kUmVzb2x2ZVByb21pc2UgPVxuICAgICAgICAgICAgICAkcS5hbGwoW2dldFRlbXBsYXRlUHJvbWlzZShtb2RhbE9wdGlvbnMpLCAkdWliUmVzb2x2ZS5yZXNvbHZlKG1vZGFsT3B0aW9ucy5yZXNvbHZlLCB7fSwgbnVsbCwgbnVsbCldKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVdpdGhUZW1wbGF0ZSgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlQW5kUmVzb2x2ZVByb21pc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdhaXQgZm9yIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBleGlzdGluZyBwcm9taXNlIGNoYWluLlxuICAgICAgICAgICAgLy8gVGhlbiBzd2l0Y2ggdG8gb3VyIG93biBjb21iaW5lZCBwcm9taXNlIGRlcGVuZGVuY3kgKHJlZ2FyZGxlc3Mgb2YgaG93IHRoZSBwcmV2aW91cyBtb2RhbCBmYXJlZCkuXG4gICAgICAgICAgICAvLyBUaGVuIGFkZCB0byAkbW9kYWxTdGFjayBhbmQgcmVzb2x2ZSBvcGVuZWQuXG4gICAgICAgICAgICAvLyBGaW5hbGx5IGNsZWFuIHVwIHRoZSBjaGFpbiB2YXJpYWJsZSBpZiBubyBzdWJzZXF1ZW50IG1vZGFsIGhhcyBvdmVyd3JpdHRlbiBpdC5cbiAgICAgICAgICAgIHZhciBzYW1lUHJvbWlzZTtcbiAgICAgICAgICAgIHNhbWVQcm9taXNlID0gcHJvbWlzZUNoYWluID0gJHEuYWxsKFtwcm9taXNlQ2hhaW5dKVxuICAgICAgICAgICAgICAudGhlbihyZXNvbHZlV2l0aFRlbXBsYXRlLCByZXNvbHZlV2l0aFRlbXBsYXRlKVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlU3VjY2Vzcyh0cGxBbmRWYXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3ZpZGVkU2NvcGUgPSBtb2RhbE9wdGlvbnMuc2NvcGUgfHwgJHJvb3RTY29wZTtcblxuICAgICAgICAgICAgICAgIHZhciBtb2RhbFNjb3BlID0gcHJvdmlkZWRTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kY2xvc2UgPSBtb2RhbEluc3RhbmNlLmNsb3NlO1xuICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGRpc21pc3MgPSBtb2RhbEluc3RhbmNlLmRpc21pc3M7XG5cbiAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIGlmICghbW9kYWxTY29wZS4kJHVpYkRlc3RydWN0aW9uU2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGRpc21pc3MoJyR1aWJVbnNjaGVkdWxlZERlc3RydWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY3RybEluc3RhbmNlLCBjdHJsTG9jYWxzID0ge307XG5cbiAgICAgICAgICAgICAgICAvL2NvbnRyb2xsZXJzXG4gICAgICAgICAgICAgICAgaWYgKG1vZGFsT3B0aW9ucy5jb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgICBjdHJsTG9jYWxzLiRzY29wZSA9IG1vZGFsU2NvcGU7XG4gICAgICAgICAgICAgICAgICBjdHJsTG9jYWxzLiR1aWJNb2RhbEluc3RhbmNlID0gbW9kYWxJbnN0YW5jZTtcbiAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0cGxBbmRWYXJzWzFdLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGN0cmxMb2NhbHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZSA9ICRjb250cm9sbGVyKG1vZGFsT3B0aW9ucy5jb250cm9sbGVyLCBjdHJsTG9jYWxzKTtcbiAgICAgICAgICAgICAgICAgIGlmIChtb2RhbE9wdGlvbnMuY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RhbE9wdGlvbnMuYmluZFRvQ29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICAgIGN0cmxJbnN0YW5jZS4kY2xvc2UgPSBtb2RhbFNjb3BlLiRjbG9zZTtcbiAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UuJGRpc21pc3MgPSBtb2RhbFNjb3BlLiRkaXNtaXNzO1xuICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKGN0cmxJbnN0YW5jZSwgcHJvdmlkZWRTY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlW21vZGFsT3B0aW9ucy5jb250cm9sbGVyQXNdID0gY3RybEluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRtb2RhbFN0YWNrLm9wZW4obW9kYWxJbnN0YW5jZSwge1xuICAgICAgICAgICAgICAgICAgc2NvcGU6IG1vZGFsU2NvcGUsXG4gICAgICAgICAgICAgICAgICBkZWZlcnJlZDogbW9kYWxSZXN1bHREZWZlcnJlZCxcbiAgICAgICAgICAgICAgICAgIHJlbmRlckRlZmVycmVkOiBtb2RhbFJlbmRlckRlZmVycmVkLFxuICAgICAgICAgICAgICAgICAgY2xvc2VkRGVmZXJyZWQ6IG1vZGFsQ2xvc2VkRGVmZXJyZWQsXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiB0cGxBbmRWYXJzWzBdLFxuICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBtb2RhbE9wdGlvbnMuYW5pbWF0aW9uLFxuICAgICAgICAgICAgICAgICAgYmFja2Ryb3A6IG1vZGFsT3B0aW9ucy5iYWNrZHJvcCxcbiAgICAgICAgICAgICAgICAgIGtleWJvYXJkOiBtb2RhbE9wdGlvbnMua2V5Ym9hcmQsXG4gICAgICAgICAgICAgICAgICBiYWNrZHJvcENsYXNzOiBtb2RhbE9wdGlvbnMuYmFja2Ryb3BDbGFzcyxcbiAgICAgICAgICAgICAgICAgIHdpbmRvd1RvcENsYXNzOiBtb2RhbE9wdGlvbnMud2luZG93VG9wQ2xhc3MsXG4gICAgICAgICAgICAgICAgICB3aW5kb3dDbGFzczogbW9kYWxPcHRpb25zLndpbmRvd0NsYXNzLFxuICAgICAgICAgICAgICAgICAgd2luZG93VGVtcGxhdGVVcmw6IG1vZGFsT3B0aW9ucy53aW5kb3dUZW1wbGF0ZVVybCxcbiAgICAgICAgICAgICAgICAgIHNpemU6IG1vZGFsT3B0aW9ucy5zaXplLFxuICAgICAgICAgICAgICAgICAgb3BlbmVkQ2xhc3M6IG1vZGFsT3B0aW9ucy5vcGVuZWRDbGFzcyxcbiAgICAgICAgICAgICAgICAgIGFwcGVuZFRvOiBtb2RhbE9wdGlvbnMuYXBwZW5kVG9cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtb2RhbE9wZW5lZERlZmVycmVkLnJlc29sdmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIHJlc29sdmVFcnJvcihyZWFzb24pIHtcbiAgICAgICAgICAgICAgbW9kYWxPcGVuZWREZWZlcnJlZC5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICAgICAgbW9kYWxSZXN1bHREZWZlcnJlZC5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICAgIH0pWydmaW5hbGx5J10oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9taXNlQ2hhaW4gPT09IHNhbWVQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZUNoYWluID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb2RhbEluc3RhbmNlO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gJG1vZGFsO1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcblxuICAgIHJldHVybiAkbW9kYWxQcm92aWRlcjtcbiAgfSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAucGFnaW5nJywgW10pXG4vKipcbiAqIEhlbHBlciBpbnRlcm5hbCBzZXJ2aWNlIGZvciBnZW5lcmF0aW5nIGNvbW1vbiBjb250cm9sbGVyIGNvZGUgYmV0d2VlbiB0aGVcbiAqIHBhZ2VyIGFuZCBwYWdpbmF0aW9uIGNvbXBvbmVudHNcbiAqL1xuLmZhY3RvcnkoJ3VpYlBhZ2luZycsIFsnJHBhcnNlJywgZnVuY3Rpb24oJHBhcnNlKSB7XG4gIHJldHVybiB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbihjdHJsLCAkc2NvcGUsICRhdHRycykge1xuICAgICAgY3RybC5zZXROdW1QYWdlcyA9ICRhdHRycy5udW1QYWdlcyA/ICRwYXJzZSgkYXR0cnMubnVtUGFnZXMpLmFzc2lnbiA6IGFuZ3VsYXIubm9vcDtcbiAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSB7ICRzZXRWaWV3VmFsdWU6IGFuZ3VsYXIubm9vcCB9OyAvLyBudWxsTW9kZWxDdHJsXG4gICAgICBjdHJsLl93YXRjaGVycyA9IFtdO1xuXG4gICAgICBjdHJsLmluaXQgPSBmdW5jdGlvbihuZ01vZGVsQ3RybCwgY29uZmlnKSB7XG4gICAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICAgICAgY3RybC5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGN0cmwucmVuZGVyKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCRhdHRycy5pdGVtc1BlclBhZ2UpIHtcbiAgICAgICAgICBjdHJsLl93YXRjaGVycy5wdXNoKCRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLml0ZW1zUGVyUGFnZSksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBjdHJsLml0ZW1zUGVyUGFnZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICAkc2NvcGUudG90YWxQYWdlcyA9IGN0cmwuY2FsY3VsYXRlVG90YWxQYWdlcygpO1xuICAgICAgICAgICAgY3RybC51cGRhdGVQYWdlKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0cmwuaXRlbXNQZXJQYWdlID0gY29uZmlnLml0ZW1zUGVyUGFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3RvdGFsSXRlbXMnLCBmdW5jdGlvbihuZXdUb3RhbCwgb2xkVG90YWwpIHtcbiAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobmV3VG90YWwpIHx8IG5ld1RvdGFsICE9PSBvbGRUb3RhbCkge1xuICAgICAgICAgICAgJHNjb3BlLnRvdGFsUGFnZXMgPSBjdHJsLmNhbGN1bGF0ZVRvdGFsUGFnZXMoKTtcbiAgICAgICAgICAgIGN0cmwudXBkYXRlUGFnZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBjdHJsLmNhbGN1bGF0ZVRvdGFsUGFnZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRvdGFsUGFnZXMgPSBjdHJsLml0ZW1zUGVyUGFnZSA8IDEgPyAxIDogTWF0aC5jZWlsKCRzY29wZS50b3RhbEl0ZW1zIC8gY3RybC5pdGVtc1BlclBhZ2UpO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodG90YWxQYWdlcyB8fCAwLCAxKTtcbiAgICAgIH07XG5cbiAgICAgIGN0cmwucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5wYWdlID0gcGFyc2VJbnQoY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlLCAxMCkgfHwgMTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZWxlY3RQYWdlID0gZnVuY3Rpb24ocGFnZSwgZXZ0KSB7XG4gICAgICAgIGlmIChldnQpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjbGlja0FsbG93ZWQgPSAhJHNjb3BlLm5nRGlzYWJsZWQgfHwgIWV2dDtcbiAgICAgICAgaWYgKGNsaWNrQWxsb3dlZCAmJiAkc2NvcGUucGFnZSAhPT0gcGFnZSAmJiBwYWdlID4gMCAmJiBwYWdlIDw9ICRzY29wZS50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgaWYgKGV2dCAmJiBldnQudGFyZ2V0KSB7XG4gICAgICAgICAgICBldnQudGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHBhZ2UpO1xuICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gJHNjb3BlW2tleSArICdUZXh0J10gfHwgY3RybC5jb25maWdba2V5ICsgJ1RleHQnXTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5ub1ByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkc2NvcGUucGFnZSA9PT0gMTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5ub05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICRzY29wZS5wYWdlID09PSAkc2NvcGUudG90YWxQYWdlcztcbiAgICAgIH07XG5cbiAgICAgIGN0cmwudXBkYXRlUGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjdHJsLnNldE51bVBhZ2VzKCRzY29wZS4kcGFyZW50LCAkc2NvcGUudG90YWxQYWdlcyk7IC8vIFJlYWRvbmx5IHZhcmlhYmxlXG5cbiAgICAgICAgaWYgKCRzY29wZS5wYWdlID4gJHNjb3BlLnRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0UGFnZSgkc2NvcGUudG90YWxQYWdlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoaWxlIChjdHJsLl93YXRjaGVycy5sZW5ndGgpIHtcbiAgICAgICAgICBjdHJsLl93YXRjaGVycy5zaGlmdCgpKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5wYWdlcicsIFsndWkuYm9vdHN0cmFwLnBhZ2luZyddKVxuXG4uY29udHJvbGxlcignVWliUGFnZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF0dHJzJywgJ3VpYlBhZ2luZycsICd1aWJQYWdlckNvbmZpZycsIGZ1bmN0aW9uKCRzY29wZSwgJGF0dHJzLCB1aWJQYWdpbmcsIHVpYlBhZ2VyQ29uZmlnKSB7XG4gICRzY29wZS5hbGlnbiA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5hbGlnbikgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuYWxpZ24pIDogdWliUGFnZXJDb25maWcuYWxpZ247XG5cbiAgdWliUGFnaW5nLmNyZWF0ZSh0aGlzLCAkc2NvcGUsICRhdHRycyk7XG59XSlcblxuLmNvbnN0YW50KCd1aWJQYWdlckNvbmZpZycsIHtcbiAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgcHJldmlvdXNUZXh0OiAnwqsgUHJldmlvdXMnLFxuICBuZXh0VGV4dDogJ05leHQgwrsnLFxuICBhbGlnbjogdHJ1ZVxufSlcblxuLmRpcmVjdGl2ZSgndWliUGFnZXInLCBbJ3VpYlBhZ2VyQ29uZmlnJywgZnVuY3Rpb24odWliUGFnZXJDb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICBzY29wZToge1xuICAgICAgdG90YWxJdGVtczogJz0nLFxuICAgICAgcHJldmlvdXNUZXh0OiAnQCcsXG4gICAgICBuZXh0VGV4dDogJ0AnLFxuICAgICAgbmdEaXNhYmxlZDogJz0nXG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ3VpYlBhZ2VyJywgJz9uZ01vZGVsJ10sXG4gICAgY29udHJvbGxlcjogJ1VpYlBhZ2VyQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAncGFnZXInLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvcGFnZXIvcGFnZXIuaHRtbCc7XG4gICAgfSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgIHJldHVybjsgLy8gZG8gbm90aGluZyBpZiBubyBuZy1tb2RlbFxuICAgICAgfVxuXG4gICAgICBwYWdpbmF0aW9uQ3RybC5pbml0KG5nTW9kZWxDdHJsLCB1aWJQYWdlckNvbmZpZyk7XG4gICAgfVxuICB9O1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnBhZ2luYXRpb24nLCBbJ3VpLmJvb3RzdHJhcC5wYWdpbmcnXSlcbi5jb250cm9sbGVyKCdVaWJQYWdpbmF0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdHRycycsICckcGFyc2UnLCAndWliUGFnaW5nJywgJ3VpYlBhZ2luYXRpb25Db25maWcnLCBmdW5jdGlvbigkc2NvcGUsICRhdHRycywgJHBhcnNlLCB1aWJQYWdpbmcsIHVpYlBhZ2luYXRpb25Db25maWcpIHtcbiAgdmFyIGN0cmwgPSB0aGlzO1xuICAvLyBTZXR1cCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgdmFyIG1heFNpemUgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMubWF4U2l6ZSkgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMubWF4U2l6ZSkgOiB1aWJQYWdpbmF0aW9uQ29uZmlnLm1heFNpemUsXG4gICAgcm90YXRlID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLnJvdGF0ZSkgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMucm90YXRlKSA6IHVpYlBhZ2luYXRpb25Db25maWcucm90YXRlLFxuICAgIGZvcmNlRWxsaXBzZXMgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZm9yY2VFbGxpcHNlcykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuZm9yY2VFbGxpcHNlcykgOiB1aWJQYWdpbmF0aW9uQ29uZmlnLmZvcmNlRWxsaXBzZXMsXG4gICAgYm91bmRhcnlMaW5rTnVtYmVycyA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5ib3VuZGFyeUxpbmtOdW1iZXJzKSA/ICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5ib3VuZGFyeUxpbmtOdW1iZXJzKSA6IHVpYlBhZ2luYXRpb25Db25maWcuYm91bmRhcnlMaW5rTnVtYmVycztcbiAgJHNjb3BlLmJvdW5kYXJ5TGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuYm91bmRhcnlMaW5rcykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuYm91bmRhcnlMaW5rcykgOiB1aWJQYWdpbmF0aW9uQ29uZmlnLmJvdW5kYXJ5TGlua3M7XG4gICRzY29wZS5kaXJlY3Rpb25MaW5rcyA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5kaXJlY3Rpb25MaW5rcykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuZGlyZWN0aW9uTGlua3MpIDogdWliUGFnaW5hdGlvbkNvbmZpZy5kaXJlY3Rpb25MaW5rcztcblxuICB1aWJQYWdpbmcuY3JlYXRlKHRoaXMsICRzY29wZSwgJGF0dHJzKTtcblxuICBpZiAoJGF0dHJzLm1heFNpemUpIHtcbiAgICBjdHJsLl93YXRjaGVycy5wdXNoKCRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLm1heFNpemUpLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgbWF4U2l6ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICBjdHJsLnJlbmRlcigpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBwYWdlIG9iamVjdCB1c2VkIGluIHRlbXBsYXRlXG4gIGZ1bmN0aW9uIG1ha2VQYWdlKG51bWJlciwgdGV4dCwgaXNBY3RpdmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbnVtYmVyOiBudW1iZXIsXG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgYWN0aXZlOiBpc0FjdGl2ZVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWdlcyhjdXJyZW50UGFnZSwgdG90YWxQYWdlcykge1xuICAgIHZhciBwYWdlcyA9IFtdO1xuXG4gICAgLy8gRGVmYXVsdCBwYWdlIGxpbWl0c1xuICAgIHZhciBzdGFydFBhZ2UgPSAxLCBlbmRQYWdlID0gdG90YWxQYWdlcztcbiAgICB2YXIgaXNNYXhTaXplZCA9IGFuZ3VsYXIuaXNEZWZpbmVkKG1heFNpemUpICYmIG1heFNpemUgPCB0b3RhbFBhZ2VzO1xuXG4gICAgLy8gcmVjb21wdXRlIGlmIG1heFNpemVcbiAgICBpZiAoaXNNYXhTaXplZCkge1xuICAgICAgaWYgKHJvdGF0ZSkge1xuICAgICAgICAvLyBDdXJyZW50IHBhZ2UgaXMgZGlzcGxheWVkIGluIHRoZSBtaWRkbGUgb2YgdGhlIHZpc2libGUgb25lc1xuICAgICAgICBzdGFydFBhZ2UgPSBNYXRoLm1heChjdXJyZW50UGFnZSAtIE1hdGguZmxvb3IobWF4U2l6ZSAvIDIpLCAxKTtcbiAgICAgICAgZW5kUGFnZSA9IHN0YXJ0UGFnZSArIG1heFNpemUgLSAxO1xuXG4gICAgICAgIC8vIEFkanVzdCBpZiBsaW1pdCBpcyBleGNlZWRlZFxuICAgICAgICBpZiAoZW5kUGFnZSA+IHRvdGFsUGFnZXMpIHtcbiAgICAgICAgICBlbmRQYWdlID0gdG90YWxQYWdlcztcbiAgICAgICAgICBzdGFydFBhZ2UgPSBlbmRQYWdlIC0gbWF4U2l6ZSArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFZpc2libGUgcGFnZXMgYXJlIHBhZ2luYXRlZCB3aXRoIG1heFNpemVcbiAgICAgICAgc3RhcnRQYWdlID0gKE1hdGguY2VpbChjdXJyZW50UGFnZSAvIG1heFNpemUpIC0gMSkgKiBtYXhTaXplICsgMTtcblxuICAgICAgICAvLyBBZGp1c3QgbGFzdCBwYWdlIGlmIGxpbWl0IGlzIGV4Y2VlZGVkXG4gICAgICAgIGVuZFBhZ2UgPSBNYXRoLm1pbihzdGFydFBhZ2UgKyBtYXhTaXplIC0gMSwgdG90YWxQYWdlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIHBhZ2UgbnVtYmVyIGxpbmtzXG4gICAgZm9yICh2YXIgbnVtYmVyID0gc3RhcnRQYWdlOyBudW1iZXIgPD0gZW5kUGFnZTsgbnVtYmVyKyspIHtcbiAgICAgIHZhciBwYWdlID0gbWFrZVBhZ2UobnVtYmVyLCBudW1iZXIsIG51bWJlciA9PT0gY3VycmVudFBhZ2UpO1xuICAgICAgcGFnZXMucHVzaChwYWdlKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgbGlua3MgdG8gbW92ZSBiZXR3ZWVuIHBhZ2Ugc2V0c1xuICAgIGlmIChpc01heFNpemVkICYmIG1heFNpemUgPiAwICYmICghcm90YXRlIHx8IGZvcmNlRWxsaXBzZXMgfHwgYm91bmRhcnlMaW5rTnVtYmVycykpIHtcbiAgICAgIGlmIChzdGFydFBhZ2UgPiAxKSB7XG4gICAgICAgIGlmICghYm91bmRhcnlMaW5rTnVtYmVycyB8fCBzdGFydFBhZ2UgPiAzKSB7IC8vbmVlZCBlbGxpcHNpcyBmb3IgYWxsIG9wdGlvbnMgdW5sZXNzIHJhbmdlIGlzIHRvbyBjbG9zZSB0byBiZWdpbm5pbmdcbiAgICAgICAgdmFyIHByZXZpb3VzUGFnZVNldCA9IG1ha2VQYWdlKHN0YXJ0UGFnZSAtIDEsICcuLi4nLCBmYWxzZSk7XG4gICAgICAgIHBhZ2VzLnVuc2hpZnQocHJldmlvdXNQYWdlU2V0KTtcbiAgICAgIH1cbiAgICAgICAgaWYgKGJvdW5kYXJ5TGlua051bWJlcnMpIHtcbiAgICAgICAgICBpZiAoc3RhcnRQYWdlID09PSAzKSB7IC8vbmVlZCB0byByZXBsYWNlIGVsbGlwc2lzIHdoZW4gdGhlIGJ1dHRvbnMgd291bGQgYmUgc2VxdWVudGlhbFxuICAgICAgICAgICAgdmFyIHNlY29uZFBhZ2VMaW5rID0gbWFrZVBhZ2UoMiwgJzInLCBmYWxzZSk7XG4gICAgICAgICAgICBwYWdlcy51bnNoaWZ0KHNlY29uZFBhZ2VMaW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9hZGQgdGhlIGZpcnN0IHBhZ2VcbiAgICAgICAgICB2YXIgZmlyc3RQYWdlTGluayA9IG1ha2VQYWdlKDEsICcxJywgZmFsc2UpO1xuICAgICAgICAgIHBhZ2VzLnVuc2hpZnQoZmlyc3RQYWdlTGluayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVuZFBhZ2UgPCB0b3RhbFBhZ2VzKSB7XG4gICAgICAgIGlmICghYm91bmRhcnlMaW5rTnVtYmVycyB8fCBlbmRQYWdlIDwgdG90YWxQYWdlcyAtIDIpIHsgLy9uZWVkIGVsbGlwc2lzIGZvciBhbGwgb3B0aW9ucyB1bmxlc3MgcmFuZ2UgaXMgdG9vIGNsb3NlIHRvIGVuZFxuICAgICAgICB2YXIgbmV4dFBhZ2VTZXQgPSBtYWtlUGFnZShlbmRQYWdlICsgMSwgJy4uLicsIGZhbHNlKTtcbiAgICAgICAgcGFnZXMucHVzaChuZXh0UGFnZVNldCk7XG4gICAgICB9XG4gICAgICAgIGlmIChib3VuZGFyeUxpbmtOdW1iZXJzKSB7XG4gICAgICAgICAgaWYgKGVuZFBhZ2UgPT09IHRvdGFsUGFnZXMgLSAyKSB7IC8vbmVlZCB0byByZXBsYWNlIGVsbGlwc2lzIHdoZW4gdGhlIGJ1dHRvbnMgd291bGQgYmUgc2VxdWVudGlhbFxuICAgICAgICAgICAgdmFyIHNlY29uZFRvTGFzdFBhZ2VMaW5rID0gbWFrZVBhZ2UodG90YWxQYWdlcyAtIDEsIHRvdGFsUGFnZXMgLSAxLCBmYWxzZSk7XG4gICAgICAgICAgICBwYWdlcy5wdXNoKHNlY29uZFRvTGFzdFBhZ2VMaW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy9hZGQgdGhlIGxhc3QgcGFnZVxuICAgICAgICAgIHZhciBsYXN0UGFnZUxpbmsgPSBtYWtlUGFnZSh0b3RhbFBhZ2VzLCB0b3RhbFBhZ2VzLCBmYWxzZSk7XG4gICAgICAgICAgcGFnZXMucHVzaChsYXN0UGFnZUxpbmspO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYWdlcztcbiAgfVxuXG4gIHZhciBvcmlnaW5hbFJlbmRlciA9IHRoaXMucmVuZGVyO1xuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIG9yaWdpbmFsUmVuZGVyKCk7XG4gICAgaWYgKCRzY29wZS5wYWdlID4gMCAmJiAkc2NvcGUucGFnZSA8PSAkc2NvcGUudG90YWxQYWdlcykge1xuICAgICAgJHNjb3BlLnBhZ2VzID0gZ2V0UGFnZXMoJHNjb3BlLnBhZ2UsICRzY29wZS50b3RhbFBhZ2VzKTtcbiAgICB9XG4gIH07XG59XSlcblxuLmNvbnN0YW50KCd1aWJQYWdpbmF0aW9uQ29uZmlnJywge1xuICBpdGVtc1BlclBhZ2U6IDEwLFxuICBib3VuZGFyeUxpbmtzOiBmYWxzZSxcbiAgYm91bmRhcnlMaW5rTnVtYmVyczogZmFsc2UsXG4gIGRpcmVjdGlvbkxpbmtzOiB0cnVlLFxuICBmaXJzdFRleHQ6ICdGaXJzdCcsXG4gIHByZXZpb3VzVGV4dDogJ1ByZXZpb3VzJyxcbiAgbmV4dFRleHQ6ICdOZXh0JyxcbiAgbGFzdFRleHQ6ICdMYXN0JyxcbiAgcm90YXRlOiB0cnVlLFxuICBmb3JjZUVsbGlwc2VzOiBmYWxzZVxufSlcblxuLmRpcmVjdGl2ZSgndWliUGFnaW5hdGlvbicsIFsnJHBhcnNlJywgJ3VpYlBhZ2luYXRpb25Db25maWcnLCBmdW5jdGlvbigkcGFyc2UsIHVpYlBhZ2luYXRpb25Db25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICBzY29wZToge1xuICAgICAgdG90YWxJdGVtczogJz0nLFxuICAgICAgZmlyc3RUZXh0OiAnQCcsXG4gICAgICBwcmV2aW91c1RleHQ6ICdAJyxcbiAgICAgIG5leHRUZXh0OiAnQCcsXG4gICAgICBsYXN0VGV4dDogJ0AnLFxuICAgICAgbmdEaXNhYmxlZDonPSdcbiAgICB9LFxuICAgIHJlcXVpcmU6IFsndWliUGFnaW5hdGlvbicsICc/bmdNb2RlbCddLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJQYWdpbmF0aW9uQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAncGFnaW5hdGlvbicsXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9wYWdpbmF0aW9uL3BhZ2luYXRpb24uaHRtbCc7XG4gICAgfSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcbiAgICAgIH1cblxuICAgICAgcGFnaW5hdGlvbkN0cmwuaW5pdChuZ01vZGVsQ3RybCwgdWliUGFnaW5hdGlvbkNvbmZpZyk7XG4gICAgfVxuICB9O1xufV0pO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgZmVhdHVyZXMgYXJlIHN0aWxsIG91dHN0YW5kaW5nOiBhbmltYXRpb24gYXMgYVxuICogZnVuY3Rpb24sIHBsYWNlbWVudCBhcyBhIGZ1bmN0aW9uLCBpbnNpZGUsIHN1cHBvcnQgZm9yIG1vcmUgdHJpZ2dlcnMgdGhhblxuICoganVzdCBtb3VzZSBlbnRlci9sZWF2ZSwgaHRtbCB0b29sdGlwcywgYW5kIHNlbGVjdG9yIGRlbGVnYXRpb24uXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAudG9vbHRpcCcsIFsndWkuYm9vdHN0cmFwLnBvc2l0aW9uJywgJ3VpLmJvb3RzdHJhcC5zdGFja2VkTWFwJ10pXG5cbi8qKlxuICogVGhlICR0b29sdGlwIHNlcnZpY2UgY3JlYXRlcyB0b29sdGlwLSBhbmQgcG9wb3Zlci1saWtlIGRpcmVjdGl2ZXMgYXMgd2VsbCBhc1xuICogaG91c2VzIGdsb2JhbCBvcHRpb25zIGZvciB0aGVtLlxuICovXG4ucHJvdmlkZXIoJyR1aWJUb29sdGlwJywgZnVuY3Rpb24oKSB7XG4gIC8vIFRoZSBkZWZhdWx0IG9wdGlvbnMgdG9vbHRpcCBhbmQgcG9wb3Zlci5cbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgcGxhY2VtZW50Q2xhc3NQcmVmaXg6ICcnLFxuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwb3B1cERlbGF5OiAwLFxuICAgIHBvcHVwQ2xvc2VEZWxheTogMCxcbiAgICB1c2VDb250ZW50RXhwOiBmYWxzZVxuICB9O1xuXG4gIC8vIERlZmF1bHQgaGlkZSB0cmlnZ2VycyBmb3IgZWFjaCBzaG93IHRyaWdnZXJcbiAgdmFyIHRyaWdnZXJNYXAgPSB7XG4gICAgJ21vdXNlZW50ZXInOiAnbW91c2VsZWF2ZScsXG4gICAgJ2NsaWNrJzogJ2NsaWNrJyxcbiAgICAnb3V0c2lkZUNsaWNrJzogJ291dHNpZGVDbGljaycsXG4gICAgJ2ZvY3VzJzogJ2JsdXInLFxuICAgICdub25lJzogJydcbiAgfTtcblxuICAvLyBUaGUgb3B0aW9ucyBzcGVjaWZpZWQgdG8gdGhlIHByb3ZpZGVyIGdsb2JhbGx5LlxuICB2YXIgZ2xvYmFsT3B0aW9ucyA9IHt9O1xuXG4gIC8qKlxuICAgKiBgb3B0aW9ucyh7fSlgIGFsbG93cyBnbG9iYWwgY29uZmlndXJhdGlvbiBvZiBhbGwgdG9vbHRpcHMgaW4gdGhlXG4gICAqIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSggJ0FwcCcsIFsndWkuYm9vdHN0cmFwLnRvb2x0aXAnXSwgZnVuY3Rpb24oICR0b29sdGlwUHJvdmlkZXIgKSB7XG4gICAqICAgICAvLyBwbGFjZSB0b29sdGlwcyBsZWZ0IGluc3RlYWQgb2YgdG9wIGJ5IGRlZmF1bHRcbiAgICogICAgICR0b29sdGlwUHJvdmlkZXIub3B0aW9ucyggeyBwbGFjZW1lbnQ6ICdsZWZ0JyB9ICk7XG4gICAqICAgfSk7XG4gICAqL1xuXHR0aGlzLm9wdGlvbnMgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGFuZ3VsYXIuZXh0ZW5kKGdsb2JhbE9wdGlvbnMsIHZhbHVlKTtcblx0fTtcblxuICAvKipcbiAgICogVGhpcyBhbGxvd3MgeW91IHRvIGV4dGVuZCB0aGUgc2V0IG9mIHRyaWdnZXIgbWFwcGluZ3MgYXZhaWxhYmxlLiBFLmcuOlxuICAgKlxuICAgKiAgICR0b29sdGlwUHJvdmlkZXIuc2V0VHJpZ2dlcnMoICdvcGVuVHJpZ2dlcic6ICdjbG9zZVRyaWdnZXInICk7XG4gICAqL1xuICB0aGlzLnNldFRyaWdnZXJzID0gZnVuY3Rpb24gc2V0VHJpZ2dlcnModHJpZ2dlcnMpIHtcbiAgICBhbmd1bGFyLmV4dGVuZCh0cmlnZ2VyTWFwLCB0cmlnZ2Vycyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBoZWxwZXIgZnVuY3Rpb24gZm9yIHRyYW5zbGF0aW5nIGNhbWVsLWNhc2UgdG8gc25ha2VfY2FzZS5cbiAgICovXG4gIGZ1bmN0aW9uIHNuYWtlX2Nhc2UobmFtZSkge1xuICAgIHZhciByZWdleHAgPSAvW0EtWl0vZztcbiAgICB2YXIgc2VwYXJhdG9yID0gJy0nO1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UocmVnZXhwLCBmdW5jdGlvbihsZXR0ZXIsIHBvcykge1xuICAgICAgcmV0dXJuIChwb3MgPyBzZXBhcmF0b3IgOiAnJykgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhY3R1YWwgaW5zdGFuY2Ugb2YgdGhlICR0b29sdGlwIHNlcnZpY2UuXG4gICAqIFRPRE8gc3VwcG9ydCBtdWx0aXBsZSB0cmlnZ2Vyc1xuICAgKi9cbiAgdGhpcy4kZ2V0ID0gWyckd2luZG93JywgJyRjb21waWxlJywgJyR0aW1lb3V0JywgJyRkb2N1bWVudCcsICckdWliUG9zaXRpb24nLCAnJGludGVycG9sYXRlJywgJyRyb290U2NvcGUnLCAnJHBhcnNlJywgJyQkc3RhY2tlZE1hcCcsIGZ1bmN0aW9uKCR3aW5kb3csICRjb21waWxlLCAkdGltZW91dCwgJGRvY3VtZW50LCAkcG9zaXRpb24sICRpbnRlcnBvbGF0ZSwgJHJvb3RTY29wZSwgJHBhcnNlLCAkJHN0YWNrZWRNYXApIHtcbiAgICB2YXIgb3BlbmVkVG9vbHRpcHMgPSAkJHN0YWNrZWRNYXAuY3JlYXRlTmV3KCk7XG4gICAgJGRvY3VtZW50Lm9uKCdrZXlwcmVzcycsIGtleXByZXNzTGlzdGVuZXIpO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAkZG9jdW1lbnQub2ZmKCdrZXlwcmVzcycsIGtleXByZXNzTGlzdGVuZXIpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24ga2V5cHJlc3NMaXN0ZW5lcihlKSB7XG4gICAgICBpZiAoZS53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgdmFyIGxhc3QgPSBvcGVuZWRUb29sdGlwcy50b3AoKTtcbiAgICAgICAgaWYgKGxhc3QpIHtcbiAgICAgICAgICBsYXN0LnZhbHVlLmNsb3NlKCk7XG4gICAgICAgICAgb3BlbmVkVG9vbHRpcHMucmVtb3ZlVG9wKCk7XG4gICAgICAgICAgbGFzdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gJHRvb2x0aXAodHRUeXBlLCBwcmVmaXgsIGRlZmF1bHRUcmlnZ2VyU2hvdywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgZ2xvYmFsT3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBhbiBvYmplY3Qgb2Ygc2hvdyBhbmQgaGlkZSB0cmlnZ2Vycy5cbiAgICAgICAqXG4gICAgICAgKiBJZiBhIHRyaWdnZXIgaXMgc3VwcGxpZWQsXG4gICAgICAgKiBpdCBpcyB1c2VkIHRvIHNob3cgdGhlIHRvb2x0aXA7IG90aGVyd2lzZSwgaXQgd2lsbCB1c2UgdGhlIGB0cmlnZ2VyYFxuICAgICAgICogb3B0aW9uIHBhc3NlZCB0byB0aGUgYCR0b29sdGlwUHJvdmlkZXIub3B0aW9uc2AgbWV0aG9kOyBlbHNlIGl0IHdpbGxcbiAgICAgICAqIGRlZmF1bHQgdG8gdGhlIHRyaWdnZXIgc3VwcGxpZWQgdG8gdGhpcyBkaXJlY3RpdmUgZmFjdG9yeS5cbiAgICAgICAqXG4gICAgICAgKiBUaGUgaGlkZSB0cmlnZ2VyIGlzIGJhc2VkIG9uIHRoZSBzaG93IHRyaWdnZXIuIElmIHRoZSBgdHJpZ2dlcmAgb3B0aW9uXG4gICAgICAgKiB3YXMgcGFzc2VkIHRvIHRoZSBgJHRvb2x0aXBQcm92aWRlci5vcHRpb25zYCBtZXRob2QsIGl0IHdpbGwgdXNlIHRoZVxuICAgICAgICogbWFwcGVkIHRyaWdnZXIgZnJvbSBgdHJpZ2dlck1hcGAgb3IgdGhlIHBhc3NlZCB0cmlnZ2VyIGlmIHRoZSBtYXAgaXNcbiAgICAgICAqIHVuZGVmaW5lZDsgb3RoZXJ3aXNlLCBpdCB1c2VzIHRoZSBgdHJpZ2dlck1hcGAgdmFsdWUgb2YgdGhlIHNob3dcbiAgICAgICAqIHRyaWdnZXI7IGVsc2UgaXQgd2lsbCBqdXN0IHVzZSB0aGUgc2hvdyB0cmlnZ2VyLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBnZXRUcmlnZ2Vycyh0cmlnZ2VyKSB7XG4gICAgICAgIHZhciBzaG93ID0gKHRyaWdnZXIgfHwgb3B0aW9ucy50cmlnZ2VyIHx8IGRlZmF1bHRUcmlnZ2VyU2hvdykuc3BsaXQoJyAnKTtcbiAgICAgICAgdmFyIGhpZGUgPSBzaG93Lm1hcChmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHRyaWdnZXJNYXBbdHJpZ2dlcl0gfHwgdHJpZ2dlcjtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2hvdzogc2hvdyxcbiAgICAgICAgICBoaWRlOiBoaWRlXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHZhciBkaXJlY3RpdmVOYW1lID0gc25ha2VfY2FzZSh0dFR5cGUpO1xuXG4gICAgICB2YXIgc3RhcnRTeW0gPSAkaW50ZXJwb2xhdGUuc3RhcnRTeW1ib2woKTtcbiAgICAgIHZhciBlbmRTeW0gPSAkaW50ZXJwb2xhdGUuZW5kU3ltYm9sKCk7XG4gICAgICB2YXIgdGVtcGxhdGUgPVxuICAgICAgICAnPGRpdiAnKyBkaXJlY3RpdmVOYW1lICsgJy1wb3B1cCAnK1xuICAgICAgICAgICd0aXRsZT1cIicgKyBzdGFydFN5bSArICd0aXRsZScgKyBlbmRTeW0gKyAnXCIgJytcbiAgICAgICAgICAob3B0aW9ucy51c2VDb250ZW50RXhwID9cbiAgICAgICAgICAgICdjb250ZW50LWV4cD1cImNvbnRlbnRFeHAoKVwiICcgOlxuICAgICAgICAgICAgJ2NvbnRlbnQ9XCInICsgc3RhcnRTeW0gKyAnY29udGVudCcgKyBlbmRTeW0gKyAnXCIgJykgK1xuICAgICAgICAgICdwbGFjZW1lbnQ9XCInICsgc3RhcnRTeW0gKyAncGxhY2VtZW50JyArIGVuZFN5bSArICdcIiAnK1xuICAgICAgICAgICdwb3B1cC1jbGFzcz1cIicgKyBzdGFydFN5bSArICdwb3B1cENsYXNzJyArIGVuZFN5bSArICdcIiAnK1xuICAgICAgICAgICdhbmltYXRpb249XCJhbmltYXRpb25cIiAnICtcbiAgICAgICAgICAnaXMtb3Blbj1cImlzT3BlblwiJyArXG4gICAgICAgICAgJ29yaWdpbi1zY29wZT1cIm9yaWdTY29wZVwiICcgK1xuICAgICAgICAgICdzdHlsZT1cInZpc2liaWxpdHk6IGhpZGRlbjsgZGlzcGxheTogYmxvY2s7IHRvcDogLTk5OTlweDsgbGVmdDogLTk5OTlweDtcIicgK1xuICAgICAgICAgICc+JyArXG4gICAgICAgICc8L2Rpdj4nO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0RWxlbSwgdEF0dHJzKSB7XG4gICAgICAgICAgdmFyIHRvb2x0aXBMaW5rZXIgPSAkY29tcGlsZSh0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIHRvb2x0aXBDdHJsKSB7XG4gICAgICAgICAgICB2YXIgdG9vbHRpcDtcbiAgICAgICAgICAgIHZhciB0b29sdGlwTGlua2VkU2NvcGU7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvblRpbWVvdXQ7XG4gICAgICAgICAgICB2YXIgc2hvd1RpbWVvdXQ7XG4gICAgICAgICAgICB2YXIgaGlkZVRpbWVvdXQ7XG4gICAgICAgICAgICB2YXIgcG9zaXRpb25UaW1lb3V0O1xuICAgICAgICAgICAgdmFyIGFwcGVuZFRvQm9keSA9IGFuZ3VsYXIuaXNEZWZpbmVkKG9wdGlvbnMuYXBwZW5kVG9Cb2R5KSA/IG9wdGlvbnMuYXBwZW5kVG9Cb2R5IDogZmFsc2U7XG4gICAgICAgICAgICB2YXIgdHJpZ2dlcnMgPSBnZXRUcmlnZ2Vycyh1bmRlZmluZWQpO1xuICAgICAgICAgICAgdmFyIGhhc0VuYWJsZUV4cCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzW3ByZWZpeCArICdFbmFibGUnXSk7XG4gICAgICAgICAgICB2YXIgdHRTY29wZSA9IHNjb3BlLiRuZXcodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgcmVwb3NpdGlvblNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGlzT3BlblBhcnNlID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnNbcHJlZml4ICsgJ0lzT3BlbiddKSA/ICRwYXJzZShhdHRyc1twcmVmaXggKyAnSXNPcGVuJ10pIDogZmFsc2U7XG4gICAgICAgICAgICB2YXIgY29udGVudFBhcnNlID0gb3B0aW9ucy51c2VDb250ZW50RXhwID8gJHBhcnNlKGF0dHJzW3R0VHlwZV0pIDogZmFsc2U7XG4gICAgICAgICAgICB2YXIgb2JzZXJ2ZXJzID0gW107XG5cbiAgICAgICAgICAgIHZhciBwb3NpdGlvblRvb2x0aXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgdG9vbHRpcCBleGlzdHMgYW5kIGlzIG5vdCBlbXB0eVxuICAgICAgICAgICAgICBpZiAoIXRvb2x0aXAgfHwgIXRvb2x0aXAuaHRtbCgpKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgIGlmICghcG9zaXRpb25UaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25UaW1lb3V0ID0gJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgcG9zaXRpb25pbmcuXG4gICAgICAgICAgICAgICAgICB0b29sdGlwLmNzcyh7IHRvcDogMCwgbGVmdDogMCB9KTtcblxuICAgICAgICAgICAgICAgICAgLy8gTm93IHNldCB0aGUgY2FsY3VsYXRlZCBwb3NpdGlvbmluZy5cbiAgICAgICAgICAgICAgICAgIHZhciB0dFBvc2l0aW9uID0gJHBvc2l0aW9uLnBvc2l0aW9uRWxlbWVudHMoZWxlbWVudCwgdG9vbHRpcCwgdHRTY29wZS5wbGFjZW1lbnQsIGFwcGVuZFRvQm9keSk7XG4gICAgICAgICAgICAgICAgICB0b29sdGlwLmNzcyh7IHRvcDogdHRQb3NpdGlvbi50b3AgKyAncHgnLCBsZWZ0OiB0dFBvc2l0aW9uLmxlZnQgKyAncHgnLCB2aXNpYmlsaXR5OiAndmlzaWJsZScgfSk7XG5cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwbGFjZW1lbnQgY2xhc3MgaXMgcHJlZml4ZWQsIHN0aWxsIG5lZWRcbiAgICAgICAgICAgICAgICAgIC8vIHRvIHJlbW92ZSB0aGUgVFdCUyBzdGFuZGFyZCBjbGFzcy5cbiAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ3RvcCBib3R0b20gbGVmdCByaWdodCcpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICB0b29sdGlwLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ3RvcCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICd0b3AtbGVmdCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICd0b3AtcmlnaHQgJyArXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2VtZW50Q2xhc3NQcmVmaXggKyAnYm90dG9tICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ2JvdHRvbS1sZWZ0ICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ2JvdHRvbS1yaWdodCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdsZWZ0ICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ2xlZnQtdG9wICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ2xlZnQtYm90dG9tICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ3JpZ2h0ICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ3JpZ2h0LXRvcCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdyaWdodC1ib3R0b20nKTtcblxuICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlbWVudCA9IHR0UG9zaXRpb24ucGxhY2VtZW50LnNwbGl0KCctJyk7XG4gICAgICAgICAgICAgICAgICB0b29sdGlwLmFkZENsYXNzKHBsYWNlbWVudFswXSArICcgJyArIG9wdGlvbnMucGxhY2VtZW50Q2xhc3NQcmVmaXggKyB0dFBvc2l0aW9uLnBsYWNlbWVudCk7XG4gICAgICAgICAgICAgICAgICAkcG9zaXRpb24ucG9zaXRpb25BcnJvdyh0b29sdGlwLCB0dFBvc2l0aW9uLnBsYWNlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBTZXQgdXAgdGhlIGNvcnJlY3Qgc2NvcGUgdG8gYWxsb3cgdHJhbnNjbHVzaW9uIGxhdGVyXG4gICAgICAgICAgICB0dFNjb3BlLm9yaWdTY29wZSA9IHNjb3BlO1xuXG4gICAgICAgICAgICAvLyBCeSBkZWZhdWx0LCB0aGUgdG9vbHRpcCBpcyBub3Qgb3Blbi5cbiAgICAgICAgICAgIC8vIFRPRE8gYWRkIGFiaWxpdHkgdG8gc3RhcnQgdG9vbHRpcCBvcGVuZWRcbiAgICAgICAgICAgIHR0U2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICBvcGVuZWRUb29sdGlwcy5hZGQodHRTY29wZSwge1xuICAgICAgICAgICAgICBjbG9zZTogaGlkZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVRvb2x0aXBCaW5kKCkge1xuICAgICAgICAgICAgICBpZiAoIXR0U2NvcGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgc2hvd1Rvb2x0aXBCaW5kKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGlkZVRvb2x0aXBCaW5kKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgdG9vbHRpcCB3aXRoIGRlbGF5IGlmIHNwZWNpZmllZCwgb3RoZXJ3aXNlIHNob3cgaXQgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dUb29sdGlwQmluZCgpIHtcbiAgICAgICAgICAgICAgaWYgKGhhc0VuYWJsZUV4cCAmJiAhc2NvcGUuJGV2YWwoYXR0cnNbcHJlZml4ICsgJ0VuYWJsZSddKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNhbmNlbEhpZGUoKTtcbiAgICAgICAgICAgICAgcHJlcGFyZVRvb2x0aXAoKTtcblxuICAgICAgICAgICAgICBpZiAodHRTY29wZS5wb3B1cERlbGF5KSB7XG4gICAgICAgICAgICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGUgdG9vbHRpcCB3YXMgYWxyZWFkeSBzY2hlZHVsZWQgdG8gcG9wLXVwLlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaGFwcGVucyBpZiBzaG93IGlzIHRyaWdnZXJlZCBtdWx0aXBsZSB0aW1lcyBiZWZvcmUgYW55IGhpZGUgaXMgdHJpZ2dlcmVkLlxuICAgICAgICAgICAgICAgIGlmICghc2hvd1RpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgIHNob3dUaW1lb3V0ID0gJHRpbWVvdXQoc2hvdywgdHRTY29wZS5wb3B1cERlbGF5LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNob3coKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBoaWRlVG9vbHRpcEJpbmQoKSB7XG4gICAgICAgICAgICAgIGNhbmNlbFNob3coKTtcblxuICAgICAgICAgICAgICBpZiAodHRTY29wZS5wb3B1cENsb3NlRGVsYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhpZGVUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICBoaWRlVGltZW91dCA9ICR0aW1lb3V0KGhpZGUsIHR0U2NvcGUucG9wdXBDbG9zZURlbGF5LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaG93IHRoZSB0b29sdGlwIHBvcHVwIGVsZW1lbnQuXG4gICAgICAgICAgICBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICAgICAgICBjYW5jZWxTaG93KCk7XG4gICAgICAgICAgICAgIGNhbmNlbEhpZGUoKTtcblxuICAgICAgICAgICAgICAvLyBEb24ndCBzaG93IGVtcHR5IHRvb2x0aXBzLlxuICAgICAgICAgICAgICBpZiAoIXR0U2NvcGUuY29udGVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLm5vb3A7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjcmVhdGVUb29sdGlwKCk7XG5cbiAgICAgICAgICAgICAgLy8gQW5kIHNob3cgdGhlIHRvb2x0aXAuXG4gICAgICAgICAgICAgIHR0U2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0dFNjb3BlLmlzT3BlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXNzaWduSXNPcGVuKHRydWUpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9vbHRpcCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuY2VsU2hvdygpIHtcbiAgICAgICAgICAgICAgaWYgKHNob3dUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHNob3dUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICBzaG93VGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAocG9zaXRpb25UaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHBvc2l0aW9uVGltZW91dCk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25UaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSB0b29sdGlwIHBvcHVwIGVsZW1lbnQuXG4gICAgICAgICAgICBmdW5jdGlvbiBoaWRlKCkge1xuICAgICAgICAgICAgICBpZiAoIXR0U2NvcGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBGaXJzdCB0aGluZ3MgZmlyc3Q6IHdlIGRvbid0IHNob3cgaXQgYW55bW9yZS5cbiAgICAgICAgICAgICAgdHRTY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0dFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICB0dFNjb3BlLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYXNzaWduSXNPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgIC8vIEFuZCBub3cgd2UgcmVtb3ZlIGl0IGZyb20gdGhlIERPTS4gSG93ZXZlciwgaWYgd2UgaGF2ZSBhbmltYXRpb24sIHdlXG4gICAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIHdhaXQgZm9yIGl0IHRvIGV4cGlyZSBiZWZvcmVoYW5kLlxuICAgICAgICAgICAgICAgICAgLy8gRklYTUU6IHRoaXMgaXMgYSBwbGFjZWhvbGRlciBmb3IgYSBwb3J0IG9mIHRoZSB0cmFuc2l0aW9ucyBsaWJyYXJ5LlxuICAgICAgICAgICAgICAgICAgLy8gVGhlIGZhZGUgdHJhbnNpdGlvbiBpbiBUV0JTIGlzIDE1MG1zLlxuICAgICAgICAgICAgICAgICAgaWYgKHR0U2NvcGUuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdHJhbnNpdGlvblRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uVGltZW91dCA9ICR0aW1lb3V0KHJlbW92ZVRvb2x0aXAsIDE1MCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVUb29sdGlwKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuY2VsSGlkZSgpIHtcbiAgICAgICAgICAgICAgaWYgKGhpZGVUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKGhpZGVUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICBoaWRlVGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvblRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodHJhbnNpdGlvblRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25UaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVUb29sdGlwKCkge1xuICAgICAgICAgICAgICAvLyBUaGVyZSBjYW4gb25seSBiZSBvbmUgdG9vbHRpcCBlbGVtZW50IHBlciBkaXJlY3RpdmUgc2hvd24gYXQgb25jZS5cbiAgICAgICAgICAgICAgaWYgKHRvb2x0aXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0b29sdGlwTGlua2VkU2NvcGUgPSB0dFNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgICAgdG9vbHRpcCA9IHRvb2x0aXBMaW5rZXIodG9vbHRpcExpbmtlZFNjb3BlLCBmdW5jdGlvbih0b29sdGlwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFwcGVuZFRvQm9keSkge1xuICAgICAgICAgICAgICAgICAgJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5hcHBlbmQodG9vbHRpcCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWZ0ZXIodG9vbHRpcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBwcmVwT2JzZXJ2ZXJzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZVRvb2x0aXAoKSB7XG4gICAgICAgICAgICAgIGNhbmNlbFNob3coKTtcbiAgICAgICAgICAgICAgY2FuY2VsSGlkZSgpO1xuICAgICAgICAgICAgICB1bnJlZ2lzdGVyT2JzZXJ2ZXJzKCk7XG5cbiAgICAgICAgICAgICAgaWYgKHRvb2x0aXApIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRvb2x0aXAgPSBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0b29sdGlwTGlua2VkU2NvcGUpIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwTGlua2VkU2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0b29sdGlwTGlua2VkU2NvcGUgPSBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2V0IHRoZSBpbml0aWFsIHNjb3BlIHZhbHVlcy4gT25jZVxuICAgICAgICAgICAgICogdGhlIHRvb2x0aXAgaXMgY3JlYXRlZCwgdGhlIG9ic2VydmVyc1xuICAgICAgICAgICAgICogd2lsbCBiZSBhZGRlZCB0byBrZWVwIHRoaW5ncyBpbiBzeW5jLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBwcmVwYXJlVG9vbHRpcCgpIHtcbiAgICAgICAgICAgICAgdHRTY29wZS50aXRsZSA9IGF0dHJzW3ByZWZpeCArICdUaXRsZSddO1xuICAgICAgICAgICAgICBpZiAoY29udGVudFBhcnNlKSB7XG4gICAgICAgICAgICAgICAgdHRTY29wZS5jb250ZW50ID0gY29udGVudFBhcnNlKHNjb3BlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0dFNjb3BlLmNvbnRlbnQgPSBhdHRyc1t0dFR5cGVdO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdHRTY29wZS5wb3B1cENsYXNzID0gYXR0cnNbcHJlZml4ICsgJ0NsYXNzJ107XG4gICAgICAgICAgICAgIHR0U2NvcGUucGxhY2VtZW50ID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnNbcHJlZml4ICsgJ1BsYWNlbWVudCddKSA/IGF0dHJzW3ByZWZpeCArICdQbGFjZW1lbnQnXSA6IG9wdGlvbnMucGxhY2VtZW50O1xuXG4gICAgICAgICAgICAgIHZhciBkZWxheSA9IHBhcnNlSW50KGF0dHJzW3ByZWZpeCArICdQb3B1cERlbGF5J10sIDEwKTtcbiAgICAgICAgICAgICAgdmFyIGNsb3NlRGVsYXkgPSBwYXJzZUludChhdHRyc1twcmVmaXggKyAnUG9wdXBDbG9zZURlbGF5J10sIDEwKTtcbiAgICAgICAgICAgICAgdHRTY29wZS5wb3B1cERlbGF5ID0gIWlzTmFOKGRlbGF5KSA/IGRlbGF5IDogb3B0aW9ucy5wb3B1cERlbGF5O1xuICAgICAgICAgICAgICB0dFNjb3BlLnBvcHVwQ2xvc2VEZWxheSA9ICFpc05hTihjbG9zZURlbGF5KSA/IGNsb3NlRGVsYXkgOiBvcHRpb25zLnBvcHVwQ2xvc2VEZWxheTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYXNzaWduSXNPcGVuKGlzT3Blbikge1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuUGFyc2UgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGlzT3BlblBhcnNlLmFzc2lnbikpIHtcbiAgICAgICAgICAgICAgICBpc09wZW5QYXJzZS5hc3NpZ24oc2NvcGUsIGlzT3Blbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHRTY29wZS5jb250ZW50RXhwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0dFNjb3BlLmNvbnRlbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE9ic2VydmUgdGhlIHJlbGV2YW50IGF0dHJpYnV0ZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdkaXNhYmxlZCcsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsU2hvdygpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHZhbCAmJiB0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgIGhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChpc09wZW5QYXJzZSkge1xuICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goaXNPcGVuUGFyc2UsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh0dFNjb3BlICYmICF2YWwgPT09IHR0U2NvcGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICB0b2dnbGVUb29sdGlwQmluZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByZXBPYnNlcnZlcnMoKSB7XG4gICAgICAgICAgICAgIG9ic2VydmVycy5sZW5ndGggPSAwO1xuXG4gICAgICAgICAgICAgIGlmIChjb250ZW50UGFyc2UpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMucHVzaChcbiAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChjb250ZW50UGFyc2UsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICB0dFNjb3BlLmNvbnRlbnQgPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsICYmIHR0U2NvcGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMucHVzaChcbiAgICAgICAgICAgICAgICAgIHRvb2x0aXBMaW5rZWRTY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVwb3NpdGlvblNjaGVkdWxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJlcG9zaXRpb25TY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXBMaW5rZWRTY29wZS4kJHBvc3REaWdlc3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXBvc2l0aW9uU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHRTY29wZSAmJiB0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9ic2VydmVycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUodHRUeXBlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdHRTY29wZS5jb250ZW50ID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbCAmJiB0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgIGhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnB1c2goXG4gICAgICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUocHJlZml4ICsgJ1RpdGxlJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgICB0dFNjb3BlLnRpdGxlID0gdmFsO1xuICAgICAgICAgICAgICAgICAgaWYgKHR0U2NvcGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9vbHRpcCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnB1c2goXG4gICAgICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUocHJlZml4ICsgJ1BsYWNlbWVudCcsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgICAgdHRTY29wZS5wbGFjZW1lbnQgPSB2YWwgPyB2YWwgOiBvcHRpb25zLnBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICAgIGlmICh0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1bnJlZ2lzdGVyT2JzZXJ2ZXJzKCkge1xuICAgICAgICAgICAgICBpZiAob2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChvYnNlcnZlcnMsIGZ1bmN0aW9uKG9ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICBvYnNlcnZlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG9ic2VydmVycy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhpZGUgdG9vbHRpcHMvcG9wb3ZlcnMgZm9yIG91dHNpZGVDbGljayB0cmlnZ2VyXG4gICAgICAgICAgICBmdW5jdGlvbiBib2R5SGlkZVRvb2x0aXBCaW5kKGUpIHtcbiAgICAgICAgICAgICAgaWYgKCF0dFNjb3BlIHx8ICF0dFNjb3BlLmlzT3BlbiB8fCAhdG9vbHRpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHRvb2x0aXAvcG9wb3ZlciBsaW5rIG9yIHRvb2wgdG9vbHRpcC9wb3BvdmVyIGl0c2VsZiB3ZXJlIG5vdCBjbGlja2VkXG4gICAgICAgICAgICAgIGlmICghZWxlbWVudFswXS5jb250YWlucyhlLnRhcmdldCkgJiYgIXRvb2x0aXBbMF0uY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgaGlkZVRvb2x0aXBCaW5kKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVucmVnaXN0ZXJUcmlnZ2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB0cmlnZ2Vycy5zaG93LmZvckVhY2goZnVuY3Rpb24odHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyID09PSAnb3V0c2lkZUNsaWNrJykge1xuICAgICAgICAgICAgICAgICAgZWxlbWVudC5vZmYoJ2NsaWNrJywgdG9nZ2xlVG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50Lm9mZih0cmlnZ2VyLCBzaG93VG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgICAgZWxlbWVudC5vZmYodHJpZ2dlciwgdG9nZ2xlVG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRyaWdnZXJzLmhpZGUuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRyaWdnZXIgPT09ICdvdXRzaWRlQ2xpY2snKSB7XG4gICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKCdjbGljaycsIGJvZHlIaWRlVG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50Lm9mZih0cmlnZ2VyLCBoaWRlVG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBwcmVwVHJpZ2dlcnMoKSB7XG4gICAgICAgICAgICAgIHZhciB2YWwgPSBhdHRyc1twcmVmaXggKyAnVHJpZ2dlciddO1xuICAgICAgICAgICAgICB1bnJlZ2lzdGVyVHJpZ2dlcnMoKTtcblxuICAgICAgICAgICAgICB0cmlnZ2VycyA9IGdldFRyaWdnZXJzKHZhbCk7XG5cbiAgICAgICAgICAgICAgaWYgKHRyaWdnZXJzLnNob3cgIT09ICdub25lJykge1xuICAgICAgICAgICAgICAgIHRyaWdnZXJzLnNob3cuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyLCBpZHgpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyID09PSAnb3V0c2lkZUNsaWNrJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIHRvZ2dsZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdjbGljaycsIGJvZHlIaWRlVG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyID09PSB0cmlnZ2Vycy5oaWRlW2lkeF0pIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbih0cmlnZ2VyLCB0b2dnbGVUb29sdGlwQmluZCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbih0cmlnZ2VyLCBzaG93VG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKHRyaWdnZXJzLmhpZGVbaWR4XSwgaGlkZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbigna2V5cHJlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICAgIGhpZGVUb29sdGlwQmluZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmVwVHJpZ2dlcnMoKTtcblxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IHNjb3BlLiRldmFsKGF0dHJzW3ByZWZpeCArICdBbmltYXRpb24nXSk7XG4gICAgICAgICAgICB0dFNjb3BlLmFuaW1hdGlvbiA9IGFuZ3VsYXIuaXNEZWZpbmVkKGFuaW1hdGlvbikgPyAhIWFuaW1hdGlvbiA6IG9wdGlvbnMuYW5pbWF0aW9uO1xuXG4gICAgICAgICAgICB2YXIgYXBwZW5kVG9Cb2R5VmFsO1xuICAgICAgICAgICAgdmFyIGFwcGVuZEtleSA9IHByZWZpeCArICdBcHBlbmRUb0JvZHknO1xuICAgICAgICAgICAgaWYgKGFwcGVuZEtleSBpbiBhdHRycyAmJiBhdHRyc1thcHBlbmRLZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgYXBwZW5kVG9Cb2R5VmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFwcGVuZFRvQm9keVZhbCA9IHNjb3BlLiRldmFsKGF0dHJzW2FwcGVuZEtleV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcHBlbmRUb0JvZHkgPSBhbmd1bGFyLmlzRGVmaW5lZChhcHBlbmRUb0JvZHlWYWwpID8gYXBwZW5kVG9Cb2R5VmFsIDogYXBwZW5kVG9Cb2R5O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdG9vbHRpcCBpcyBkZXN0cm95ZWQgYW5kIHJlbW92ZWQuXG4gICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gb25EZXN0cm95VG9vbHRpcCgpIHtcbiAgICAgICAgICAgICAgdW5yZWdpc3RlclRyaWdnZXJzKCk7XG4gICAgICAgICAgICAgIHJlbW92ZVRvb2x0aXAoKTtcbiAgICAgICAgICAgICAgb3BlbmVkVG9vbHRpcHMucmVtb3ZlKHR0U2NvcGUpO1xuICAgICAgICAgICAgICB0dFNjb3BlID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfV07XG59KVxuXG4vLyBUaGlzIGlzIG1vc3RseSBuZ0luY2x1ZGUgY29kZSBidXQgd2l0aCBhIGN1c3RvbSBzY29wZVxuLmRpcmVjdGl2ZSgndWliVG9vbHRpcFRlbXBsYXRlVHJhbnNjbHVkZScsIFtcbiAgICAgICAgICckYW5pbWF0ZScsICckc2NlJywgJyRjb21waWxlJywgJyR0ZW1wbGF0ZVJlcXVlc3QnLFxuZnVuY3Rpb24gKCRhbmltYXRlLCAkc2NlLCAkY29tcGlsZSwgJHRlbXBsYXRlUmVxdWVzdCkge1xuICByZXR1cm4ge1xuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgdmFyIG9yaWdTY29wZSA9IHNjb3BlLiRldmFsKGF0dHJzLnRvb2x0aXBUZW1wbGF0ZVRyYW5zY2x1ZGVTY29wZSk7XG5cbiAgICAgIHZhciBjaGFuZ2VDb3VudGVyID0gMCxcbiAgICAgICAgY3VycmVudFNjb3BlLFxuICAgICAgICBwcmV2aW91c0VsZW1lbnQsXG4gICAgICAgIGN1cnJlbnRFbGVtZW50O1xuXG4gICAgICB2YXIgY2xlYW51cExhc3RJbmNsdWRlQ29udGVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocHJldmlvdXNFbGVtZW50KSB7XG4gICAgICAgICAgcHJldmlvdXNFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgIHByZXZpb3VzRWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFNjb3BlKSB7XG4gICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCkge1xuICAgICAgICAgICRhbmltYXRlLmxlYXZlKGN1cnJlbnRFbGVtZW50KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBjdXJyZW50RWxlbWVudDtcbiAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNjb3BlLiR3YXRjaCgkc2NlLnBhcnNlQXNSZXNvdXJjZVVybChhdHRycy51aWJUb29sdGlwVGVtcGxhdGVUcmFuc2NsdWRlKSwgZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIHZhciB0aGlzQ2hhbmdlSWQgPSArK2NoYW5nZUNvdW50ZXI7XG5cbiAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgIC8vc2V0IHRoZSAybmQgcGFyYW0gdG8gdHJ1ZSB0byBpZ25vcmUgdGhlIHRlbXBsYXRlIHJlcXVlc3QgZXJyb3Igc28gdGhhdCB0aGUgaW5uZXJcbiAgICAgICAgICAvL2NvbnRlbnRzIGFuZCBzY29wZSBjYW4gYmUgY2xlYW5lZCB1cC5cbiAgICAgICAgICAkdGVtcGxhdGVSZXF1ZXN0KHNyYywgdHJ1ZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHRoaXNDaGFuZ2VJZCAhPT0gY2hhbmdlQ291bnRlcikgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHZhciBuZXdTY29wZSA9IG9yaWdTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSByZXNwb25zZTtcblxuICAgICAgICAgICAgdmFyIGNsb25lID0gJGNvbXBpbGUodGVtcGxhdGUpKG5ld1Njb3BlLCBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgICBjbGVhbnVwTGFzdEluY2x1ZGVDb250ZW50KCk7XG4gICAgICAgICAgICAgICRhbmltYXRlLmVudGVyKGNsb25lLCBlbGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY2xvbmU7XG5cbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZW1pdCgnJGluY2x1ZGVDb250ZW50TG9hZGVkJywgc3JjKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzQ2hhbmdlSWQgPT09IGNoYW5nZUNvdW50ZXIpIHtcbiAgICAgICAgICAgICAgY2xlYW51cExhc3RJbmNsdWRlQ29udGVudCgpO1xuICAgICAgICAgICAgICBzY29wZS4kZW1pdCgnJGluY2x1ZGVDb250ZW50RXJyb3InLCBzcmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNjb3BlLiRlbWl0KCckaW5jbHVkZUNvbnRlbnRSZXF1ZXN0ZWQnLCBzcmMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsZWFudXBMYXN0SW5jbHVkZUNvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBjbGVhbnVwTGFzdEluY2x1ZGVDb250ZW50KTtcbiAgICB9XG4gIH07XG59XSlcblxuLyoqXG4gKiBOb3RlIHRoYXQgaXQncyBpbnRlbnRpb25hbCB0aGF0IHRoZXNlIGNsYXNzZXMgYXJlICpub3QqIGFwcGxpZWQgdGhyb3VnaCAkYW5pbWF0ZS5cbiAqIFRoZXkgbXVzdCBub3QgYmUgYW5pbWF0ZWQgYXMgdGhleSdyZSBleHBlY3RlZCB0byBiZSBwcmVzZW50IG9uIHRoZSB0b29sdGlwIG9uXG4gKiBpbml0aWFsaXphdGlvbi5cbiAqL1xuLmRpcmVjdGl2ZSgndWliVG9vbHRpcENsYXNzZXMnLCBbJyR1aWJQb3NpdGlvbicsIGZ1bmN0aW9uKCR1aWJQb3NpdGlvbikge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAvLyBuZWVkIHRvIHNldCB0aGUgcHJpbWFyeSBwb3NpdGlvbiBzbyB0aGVcbiAgICAgIC8vIGFycm93IGhhcyBzcGFjZSBkdXJpbmcgcG9zaXRpb24gbWVhc3VyZS5cbiAgICAgIC8vIHRvb2x0aXAucG9zaXRpb25Ub29sdGlwKClcbiAgICAgIGlmIChzY29wZS5wbGFjZW1lbnQpIHtcbiAgICAgICAgLy8gLy8gVGhlcmUgYXJlIG5vIHRvcC1sZWZ0IGV0Yy4uLiBjbGFzc2VzXG4gICAgICAgIC8vIC8vIGluIFRXQlMsIHNvIHdlIG5lZWQgdGhlIHByaW1hcnkgcG9zaXRpb24uXG4gICAgICAgIHZhciBwb3NpdGlvbiA9ICR1aWJQb3NpdGlvbi5wYXJzZVBsYWNlbWVudChzY29wZS5wbGFjZW1lbnQpO1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKHBvc2l0aW9uWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3RvcCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NvcGUucG9wdXBDbGFzcykge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKHNjb3BlLnBvcHVwQ2xhc3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NvcGUuYW5pbWF0aW9uKCkpIHtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhhdHRycy50b29sdGlwQW5pbWF0aW9uQ2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJUb29sdGlwUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7IGNvbnRlbnQ6ICdAJywgcGxhY2VtZW50OiAnQCcsIHBvcHVwQ2xhc3M6ICdAJywgYW5pbWF0aW9uOiAnJicsIGlzT3BlbjogJyYnIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvdG9vbHRpcC90b29sdGlwLXBvcHVwLmh0bWwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJUb29sdGlwJywgWyAnJHVpYlRvb2x0aXAnLCBmdW5jdGlvbigkdWliVG9vbHRpcCkge1xuICByZXR1cm4gJHVpYlRvb2x0aXAoJ3VpYlRvb2x0aXAnLCAndG9vbHRpcCcsICdtb3VzZWVudGVyJyk7XG59XSlcblxuLmRpcmVjdGl2ZSgndWliVG9vbHRpcFRlbXBsYXRlUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7IGNvbnRlbnRFeHA6ICcmJywgcGxhY2VtZW50OiAnQCcsIHBvcHVwQ2xhc3M6ICdAJywgYW5pbWF0aW9uOiAnJicsIGlzT3BlbjogJyYnLFxuICAgICAgb3JpZ2luU2NvcGU6ICcmJyB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3Rvb2x0aXAvdG9vbHRpcC10ZW1wbGF0ZS1wb3B1cC5odG1sJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliVG9vbHRpcFRlbXBsYXRlJywgWyckdWliVG9vbHRpcCcsIGZ1bmN0aW9uKCR1aWJUb29sdGlwKSB7XG4gIHJldHVybiAkdWliVG9vbHRpcCgndWliVG9vbHRpcFRlbXBsYXRlJywgJ3Rvb2x0aXAnLCAnbW91c2VlbnRlcicsIHtcbiAgICB1c2VDb250ZW50RXhwOiB0cnVlXG4gIH0pO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRvb2x0aXBIdG1sUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7IGNvbnRlbnRFeHA6ICcmJywgcGxhY2VtZW50OiAnQCcsIHBvcHVwQ2xhc3M6ICdAJywgYW5pbWF0aW9uOiAnJicsIGlzT3BlbjogJyYnIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvdG9vbHRpcC90b29sdGlwLWh0bWwtcG9wdXAuaHRtbCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRvb2x0aXBIdG1sJywgWyckdWliVG9vbHRpcCcsIGZ1bmN0aW9uKCR1aWJUb29sdGlwKSB7XG4gIHJldHVybiAkdWliVG9vbHRpcCgndWliVG9vbHRpcEh0bWwnLCAndG9vbHRpcCcsICdtb3VzZWVudGVyJywge1xuICAgIHVzZUNvbnRlbnRFeHA6IHRydWVcbiAgfSk7XG59XSk7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBmZWF0dXJlcyBhcmUgc3RpbGwgb3V0c3RhbmRpbmc6IHBvcHVwIGRlbGF5LCBhbmltYXRpb24gYXMgYVxuICogZnVuY3Rpb24sIHBsYWNlbWVudCBhcyBhIGZ1bmN0aW9uLCBpbnNpZGUsIHN1cHBvcnQgZm9yIG1vcmUgdHJpZ2dlcnMgdGhhblxuICoganVzdCBtb3VzZSBlbnRlci9sZWF2ZSwgYW5kIHNlbGVjdG9yIGRlbGVnYXRhdGlvbi5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5wb3BvdmVyJywgWyd1aS5ib290c3RyYXAudG9vbHRpcCddKVxuXG4uZGlyZWN0aXZlKCd1aWJQb3BvdmVyVGVtcGxhdGVQb3B1cCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHsgdGl0bGU6ICdAJywgY29udGVudEV4cDogJyYnLCBwbGFjZW1lbnQ6ICdAJywgcG9wdXBDbGFzczogJ0AnLCBhbmltYXRpb246ICcmJywgaXNPcGVuOiAnJicsXG4gICAgICBvcmlnaW5TY29wZTogJyYnIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvcG9wb3Zlci9wb3BvdmVyLXRlbXBsYXRlLmh0bWwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJQb3BvdmVyVGVtcGxhdGUnLCBbJyR1aWJUb29sdGlwJywgZnVuY3Rpb24oJHVpYlRvb2x0aXApIHtcbiAgcmV0dXJuICR1aWJUb29sdGlwKCd1aWJQb3BvdmVyVGVtcGxhdGUnLCAncG9wb3ZlcicsICdjbGljaycsIHtcbiAgICB1c2VDb250ZW50RXhwOiB0cnVlXG4gIH0pO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlBvcG92ZXJIdG1sUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7IGNvbnRlbnRFeHA6ICcmJywgdGl0bGU6ICdAJywgcGxhY2VtZW50OiAnQCcsIHBvcHVwQ2xhc3M6ICdAJywgYW5pbWF0aW9uOiAnJicsIGlzT3BlbjogJyYnIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvcG9wb3Zlci9wb3BvdmVyLWh0bWwuaHRtbCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlBvcG92ZXJIdG1sJywgWyckdWliVG9vbHRpcCcsIGZ1bmN0aW9uKCR1aWJUb29sdGlwKSB7XG4gIHJldHVybiAkdWliVG9vbHRpcCgndWliUG9wb3Zlckh0bWwnLCAncG9wb3ZlcicsICdjbGljaycsIHtcbiAgICB1c2VDb250ZW50RXhwOiB0cnVlXG4gIH0pO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlBvcG92ZXJQb3B1cCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHsgdGl0bGU6ICdAJywgY29udGVudDogJ0AnLCBwbGFjZW1lbnQ6ICdAJywgcG9wdXBDbGFzczogJ0AnLCBhbmltYXRpb246ICcmJywgaXNPcGVuOiAnJicgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS9wb3BvdmVyL3BvcG92ZXIuaHRtbCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlBvcG92ZXInLCBbJyR1aWJUb29sdGlwJywgZnVuY3Rpb24oJHVpYlRvb2x0aXApIHtcbiAgcmV0dXJuICR1aWJUb29sdGlwKCd1aWJQb3BvdmVyJywgJ3BvcG92ZXInLCAnY2xpY2snKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5wcm9ncmVzc2JhcicsIFtdKVxuXG4uY29uc3RhbnQoJ3VpYlByb2dyZXNzQ29uZmlnJywge1xuICBhbmltYXRlOiB0cnVlLFxuICBtYXg6IDEwMFxufSlcblxuLmNvbnRyb2xsZXIoJ1VpYlByb2dyZXNzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdHRycycsICd1aWJQcm9ncmVzc0NvbmZpZycsIGZ1bmN0aW9uKCRzY29wZSwgJGF0dHJzLCBwcm9ncmVzc0NvbmZpZykge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBhbmltYXRlID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmFuaW1hdGUpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLmFuaW1hdGUpIDogcHJvZ3Jlc3NDb25maWcuYW5pbWF0ZTtcblxuICB0aGlzLmJhcnMgPSBbXTtcbiAgJHNjb3BlLm1heCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5tYXgpID8gJHNjb3BlLm1heCA6IHByb2dyZXNzQ29uZmlnLm1heDtcblxuICB0aGlzLmFkZEJhciA9IGZ1bmN0aW9uKGJhciwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICBpZiAoIWFuaW1hdGUpIHtcbiAgICAgIGVsZW1lbnQuY3NzKHsndHJhbnNpdGlvbic6ICdub25lJ30pO1xuICAgIH1cblxuICAgIHRoaXMuYmFycy5wdXNoKGJhcik7XG5cbiAgICBiYXIubWF4ID0gJHNjb3BlLm1heDtcbiAgICBiYXIudGl0bGUgPSBhdHRycyAmJiBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy50aXRsZSkgPyBhdHRycy50aXRsZSA6ICdwcm9ncmVzc2Jhcic7XG5cbiAgICBiYXIuJHdhdGNoKCd2YWx1ZScsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBiYXIucmVjYWxjdWxhdGVQZXJjZW50YWdlKCk7XG4gICAgfSk7XG5cbiAgICBiYXIucmVjYWxjdWxhdGVQZXJjZW50YWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG90YWxQZXJjZW50YWdlID0gc2VsZi5iYXJzLnJlZHVjZShmdW5jdGlvbih0b3RhbCwgYmFyKSB7XG4gICAgICAgIGJhci5wZXJjZW50ID0gKygxMDAgKiBiYXIudmFsdWUgLyBiYXIubWF4KS50b0ZpeGVkKDIpO1xuICAgICAgICByZXR1cm4gdG90YWwgKyBiYXIucGVyY2VudDtcbiAgICAgIH0sIDApO1xuXG4gICAgICBpZiAodG90YWxQZXJjZW50YWdlID4gMTAwKSB7XG4gICAgICAgIGJhci5wZXJjZW50IC09IHRvdGFsUGVyY2VudGFnZSAtIDEwMDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYmFyLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgc2VsZi5yZW1vdmVCYXIoYmFyKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbW92ZUJhciA9IGZ1bmN0aW9uKGJhcikge1xuICAgIHRoaXMuYmFycy5zcGxpY2UodGhpcy5iYXJzLmluZGV4T2YoYmFyKSwgMSk7XG4gICAgdGhpcy5iYXJzLmZvckVhY2goZnVuY3Rpb24gKGJhcikge1xuICAgICAgYmFyLnJlY2FsY3VsYXRlUGVyY2VudGFnZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS4kd2F0Y2goJ21heCcsIGZ1bmN0aW9uKG1heCkge1xuICAgIHNlbGYuYmFycy5mb3JFYWNoKGZ1bmN0aW9uKGJhcikge1xuICAgICAgYmFyLm1heCA9ICRzY29wZS5tYXg7XG4gICAgICBiYXIucmVjYWxjdWxhdGVQZXJjZW50YWdlKCk7XG4gICAgfSk7XG4gIH0pO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlByb2dyZXNzJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJQcm9ncmVzc0NvbnRyb2xsZXInLFxuICAgIHJlcXVpcmU6ICd1aWJQcm9ncmVzcycsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1heDogJz0/J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3MuaHRtbCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYkJhcicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXF1aXJlOiAnXnVpYlByb2dyZXNzJyxcbiAgICBzY29wZToge1xuICAgICAgdmFsdWU6ICc9JyxcbiAgICAgIHR5cGU6ICdAJ1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvcHJvZ3Jlc3NiYXIvYmFyLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgcHJvZ3Jlc3NDdHJsKSB7XG4gICAgICBwcm9ncmVzc0N0cmwuYWRkQmFyKHNjb3BlLCBlbGVtZW50LCBhdHRycyk7XG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliUHJvZ3Jlc3NiYXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgY29udHJvbGxlcjogJ1VpYlByb2dyZXNzQ29udHJvbGxlcicsXG4gICAgc2NvcGU6IHtcbiAgICAgIHZhbHVlOiAnPScsXG4gICAgICBtYXg6ICc9PycsXG4gICAgICB0eXBlOiAnQCdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3Byb2dyZXNzYmFyL3Byb2dyZXNzYmFyLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgcHJvZ3Jlc3NDdHJsKSB7XG4gICAgICBwcm9ncmVzc0N0cmwuYWRkQmFyKHNjb3BlLCBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5jaGlsZHJlbigpWzBdKSwge3RpdGxlOiBhdHRycy50aXRsZX0pO1xuICAgIH1cbiAgfTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnJhdGluZycsIFtdKVxuXG4uY29uc3RhbnQoJ3VpYlJhdGluZ0NvbmZpZycsIHtcbiAgbWF4OiA1LFxuICBzdGF0ZU9uOiBudWxsLFxuICBzdGF0ZU9mZjogbnVsbCxcbiAgdGl0bGVzIDogWydvbmUnLCAndHdvJywgJ3RocmVlJywgJ2ZvdXInLCAnZml2ZSddXG59KVxuXG4uY29udHJvbGxlcignVWliUmF0aW5nQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdHRycycsICd1aWJSYXRpbmdDb25maWcnLCBmdW5jdGlvbigkc2NvcGUsICRhdHRycywgcmF0aW5nQ29uZmlnKSB7XG4gIHZhciBuZ01vZGVsQ3RybCA9IHsgJHNldFZpZXdWYWx1ZTogYW5ndWxhci5ub29wIH07XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24obmdNb2RlbEN0cmxfKSB7XG4gICAgbmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybF87XG4gICAgbmdNb2RlbEN0cmwuJHJlbmRlciA9IHRoaXMucmVuZGVyO1xuXG4gICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlIDw8IDAgIT09IHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGVPbiA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5zdGF0ZU9uKSA/ICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5zdGF0ZU9uKSA6IHJhdGluZ0NvbmZpZy5zdGF0ZU9uO1xuICAgIHRoaXMuc3RhdGVPZmYgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuc3RhdGVPZmYpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnN0YXRlT2ZmKSA6IHJhdGluZ0NvbmZpZy5zdGF0ZU9mZjtcbiAgICB2YXIgdG1wVGl0bGVzID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLnRpdGxlcykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMudGl0bGVzKSA6IHJhdGluZ0NvbmZpZy50aXRsZXMgO1xuICAgIHRoaXMudGl0bGVzID0gYW5ndWxhci5pc0FycmF5KHRtcFRpdGxlcykgJiYgdG1wVGl0bGVzLmxlbmd0aCA+IDAgP1xuICAgICAgdG1wVGl0bGVzIDogcmF0aW5nQ29uZmlnLnRpdGxlcztcblxuICAgIHZhciByYXRpbmdTdGF0ZXMgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMucmF0aW5nU3RhdGVzKSA/XG4gICAgICAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMucmF0aW5nU3RhdGVzKSA6XG4gICAgICBuZXcgQXJyYXkoYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLm1heCkgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMubWF4KSA6IHJhdGluZ0NvbmZpZy5tYXgpO1xuICAgICRzY29wZS5yYW5nZSA9IHRoaXMuYnVpbGRUZW1wbGF0ZU9iamVjdHMocmF0aW5nU3RhdGVzKTtcbiAgfTtcblxuICB0aGlzLmJ1aWxkVGVtcGxhdGVPYmplY3RzID0gZnVuY3Rpb24oc3RhdGVzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBzdGF0ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBzdGF0ZXNbaV0gPSBhbmd1bGFyLmV4dGVuZCh7IGluZGV4OiBpIH0sIHsgc3RhdGVPbjogdGhpcy5zdGF0ZU9uLCBzdGF0ZU9mZjogdGhpcy5zdGF0ZU9mZiwgdGl0bGU6IHRoaXMuZ2V0VGl0bGUoaSkgfSwgc3RhdGVzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlcztcbiAgfTtcblxuICB0aGlzLmdldFRpdGxlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPj0gdGhpcy50aXRsZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRpdGxlc1tpbmRleF07XG4gIH07XG5cbiAgJHNjb3BlLnJhdGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICghJHNjb3BlLnJlYWRvbmx5ICYmIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gJHNjb3BlLnJhbmdlLmxlbmd0aCkge1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlID09PSB2YWx1ZSA/IDAgOiB2YWx1ZSk7XG4gICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5lbnRlciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKCEkc2NvcGUucmVhZG9ubHkpIHtcbiAgICAgICRzY29wZS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICAkc2NvcGUub25Ib3Zlcih7dmFsdWU6IHZhbHVlfSk7XG4gIH07XG5cbiAgJHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnZhbHVlID0gbmdNb2RlbEN0cmwuJHZpZXdWYWx1ZTtcbiAgICAkc2NvcGUub25MZWF2ZSgpO1xuICB9O1xuXG4gICRzY29wZS5vbktleWRvd24gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoLygzN3wzOHwzOXw0MCkvLnRlc3QoZXZ0LndoaWNoKSkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAkc2NvcGUucmF0ZSgkc2NvcGUudmFsdWUgKyAoZXZ0LndoaWNoID09PSAzOCB8fCBldnQud2hpY2ggPT09IDM5ID8gMSA6IC0xKSk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnZhbHVlID0gbmdNb2RlbEN0cmwuJHZpZXdWYWx1ZTtcbiAgfTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJSYXRpbmcnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiBbJ3VpYlJhdGluZycsICduZ01vZGVsJ10sXG4gICAgc2NvcGU6IHtcbiAgICAgIHJlYWRvbmx5OiAnPT8nLFxuICAgICAgb25Ib3ZlcjogJyYnLFxuICAgICAgb25MZWF2ZTogJyYnXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiAnVWliUmF0aW5nQ29udHJvbGxlcicsXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvcmF0aW5nL3JhdGluZy5odG1sJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciByYXRpbmdDdHJsID0gY3RybHNbMF0sIG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG4gICAgICByYXRpbmdDdHJsLmluaXQobmdNb2RlbEN0cmwpO1xuICAgIH1cbiAgfTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnRhYnMnLCBbXSlcblxuLmNvbnRyb2xsZXIoJ1VpYlRhYnNldENvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgdmFyIGN0cmwgPSB0aGlzLFxuICAgICAgdGFicyA9IGN0cmwudGFicyA9ICRzY29wZS50YWJzID0gW107XG5cbiAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3RlZFRhYikge1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh0YWJzLCBmdW5jdGlvbih0YWIpIHtcbiAgICAgIGlmICh0YWIuYWN0aXZlICYmIHRhYiAhPT0gc2VsZWN0ZWRUYWIpIHtcbiAgICAgICAgdGFiLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0YWIub25EZXNlbGVjdCgpO1xuICAgICAgICBzZWxlY3RlZFRhYi5zZWxlY3RDYWxsZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzZWxlY3RlZFRhYi5hY3RpdmUgPSB0cnVlO1xuICAgIC8vIG9ubHkgY2FsbCBzZWxlY3QgaWYgaXQgaGFzIG5vdCBhbHJlYWR5IGJlZW4gY2FsbGVkXG4gICAgaWYgKCFzZWxlY3RlZFRhYi5zZWxlY3RDYWxsZWQpIHtcbiAgICAgIHNlbGVjdGVkVGFiLm9uU2VsZWN0KCk7XG4gICAgICBzZWxlY3RlZFRhYi5zZWxlY3RDYWxsZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjdHJsLmFkZFRhYiA9IGZ1bmN0aW9uIGFkZFRhYih0YWIpIHtcbiAgICB0YWJzLnB1c2godGFiKTtcbiAgICAvLyB3ZSBjYW4ndCBydW4gdGhlIHNlbGVjdCBmdW5jdGlvbiBvbiB0aGUgZmlyc3QgdGFiXG4gICAgLy8gc2luY2UgdGhhdCB3b3VsZCBzZWxlY3QgaXQgdHdpY2VcbiAgICBpZiAodGFicy5sZW5ndGggPT09IDEgJiYgdGFiLmFjdGl2ZSAhPT0gZmFsc2UpIHtcbiAgICAgIHRhYi5hY3RpdmUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGFiLmFjdGl2ZSkge1xuICAgICAgY3RybC5zZWxlY3QodGFiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFiLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBjdHJsLnJlbW92ZVRhYiA9IGZ1bmN0aW9uIHJlbW92ZVRhYih0YWIpIHtcbiAgICB2YXIgaW5kZXggPSB0YWJzLmluZGV4T2YodGFiKTtcbiAgICAvL1NlbGVjdCBhIG5ldyB0YWIgaWYgdGhlIHRhYiB0byBiZSByZW1vdmVkIGlzIHNlbGVjdGVkIGFuZCBub3QgZGVzdHJveWVkXG4gICAgaWYgKHRhYi5hY3RpdmUgJiYgdGFicy5sZW5ndGggPiAxICYmICFkZXN0cm95ZWQpIHtcbiAgICAgIC8vSWYgdGhpcyBpcyB0aGUgbGFzdCB0YWIsIHNlbGVjdCB0aGUgcHJldmlvdXMgdGFiLiBlbHNlLCB0aGUgbmV4dCB0YWIuXG4gICAgICB2YXIgbmV3QWN0aXZlSW5kZXggPSBpbmRleCA9PT0gdGFicy5sZW5ndGggLSAxID8gaW5kZXggLSAxIDogaW5kZXggKyAxO1xuICAgICAgY3RybC5zZWxlY3QodGFic1tuZXdBY3RpdmVJbmRleF0pO1xuICAgIH1cbiAgICB0YWJzLnNwbGljZShpbmRleCwgMSk7XG4gIH07XG5cbiAgdmFyIGRlc3Ryb3llZDtcbiAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICBkZXN0cm95ZWQgPSB0cnVlO1xuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJUYWJzZXQnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIHR5cGU6ICdAJ1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogJ1VpYlRhYnNldENvbnRyb2xsZXInLFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3RhYnMvdGFic2V0Lmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgc2NvcGUudmVydGljYWwgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy52ZXJ0aWNhbCkgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLnZlcnRpY2FsKSA6IGZhbHNlO1xuICAgICAgc2NvcGUuanVzdGlmaWVkID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuanVzdGlmaWVkKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuanVzdGlmaWVkKSA6IGZhbHNlO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRhYicsIFsnJHBhcnNlJywgZnVuY3Rpb24oJHBhcnNlKSB7XG4gIHJldHVybiB7XG4gICAgcmVxdWlyZTogJ151aWJUYWJzZXQnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvdGFicy90YWIuaHRtbCcsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgYWN0aXZlOiAnPT8nLFxuICAgICAgaGVhZGluZzogJ0AnLFxuICAgICAgb25TZWxlY3Q6ICcmc2VsZWN0JywgLy9UaGlzIGNhbGxiYWNrIGlzIGNhbGxlZCBpbiBjb250ZW50SGVhZGluZ1RyYW5zY2x1ZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vbmNlIGl0IGluc2VydHMgdGhlIHRhYidzIGNvbnRlbnQgaW50byB0aGUgZG9tXG4gICAgICBvbkRlc2VsZWN0OiAnJmRlc2VsZWN0J1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAvL0VtcHR5IGNvbnRyb2xsZXIgc28gb3RoZXIgZGlyZWN0aXZlcyBjYW4gcmVxdWlyZSBiZWluZyAndW5kZXInIGEgdGFiXG4gICAgfSxcbiAgICBjb250cm9sbGVyQXM6ICd0YWInLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCB0YWJzZXRDdHJsLCB0cmFuc2NsdWRlKSB7XG4gICAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgdGFic2V0Q3RybC5zZWxlY3Qoc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIGlmIChhdHRycy5kaXNhYmxlKSB7XG4gICAgICAgIHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZShhdHRycy5kaXNhYmxlKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBzY29wZS5kaXNhYmxlZCA9ICEhIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghc2NvcGUuZGlzYWJsZWQpIHtcbiAgICAgICAgICBzY29wZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0YWJzZXRDdHJsLmFkZFRhYihzY29wZSk7XG4gICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRhYnNldEN0cmwucmVtb3ZlVGFiKHNjb3BlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvL1dlIG5lZWQgdG8gdHJhbnNjbHVkZSBsYXRlciwgb25jZSB0aGUgY29udGVudCBjb250YWluZXIgaXMgcmVhZHkuXG4gICAgICAvL3doZW4gdGhpcyBsaW5rIGhhcHBlbnMsIHdlJ3JlIGluc2lkZSBhIHRhYiBoZWFkaW5nLlxuICAgICAgc2NvcGUuJHRyYW5zY2x1ZGVGbiA9IHRyYW5zY2x1ZGU7XG4gICAgfVxuICB9O1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRhYkhlYWRpbmdUcmFuc2NsdWRlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiAnXnVpYlRhYicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSkge1xuICAgICAgc2NvcGUuJHdhdGNoKCdoZWFkaW5nRWxlbWVudCcsIGZ1bmN0aW9uIHVwZGF0ZUhlYWRpbmdFbGVtZW50KGhlYWRpbmcpIHtcbiAgICAgICAgaWYgKGhlYWRpbmcpIHtcbiAgICAgICAgICBlbG0uaHRtbCgnJyk7XG4gICAgICAgICAgZWxtLmFwcGVuZChoZWFkaW5nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliVGFiQ29udGVudFRyYW5zY2x1ZGUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcXVpcmU6ICdedWliVGFic2V0JyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycykge1xuICAgICAgdmFyIHRhYiA9IHNjb3BlLiRldmFsKGF0dHJzLnVpYlRhYkNvbnRlbnRUcmFuc2NsdWRlKTtcblxuICAgICAgLy9Ob3cgb3VyIHRhYiBpcyByZWFkeSB0byBiZSB0cmFuc2NsdWRlZDogYm90aCB0aGUgdGFiIGhlYWRpbmcgYXJlYVxuICAgICAgLy9hbmQgdGhlIHRhYiBjb250ZW50IGFyZWEgYXJlIGxvYWRlZC4gIFRyYW5zY2x1ZGUgJ2VtIGJvdGguXG4gICAgICB0YWIuJHRyYW5zY2x1ZGVGbih0YWIuJHBhcmVudCwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGNvbnRlbnRzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgaWYgKGlzVGFiSGVhZGluZyhub2RlKSkge1xuICAgICAgICAgICAgLy9MZXQgdGFiSGVhZGluZ1RyYW5zY2x1ZGUga25vdy5cbiAgICAgICAgICAgIHRhYi5oZWFkaW5nRWxlbWVudCA9IG5vZGU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsbS5hcHBlbmQobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBpc1RhYkhlYWRpbmcobm9kZSkge1xuICAgIHJldHVybiBub2RlLnRhZ05hbWUgJiYgKFxuICAgICAgbm9kZS5oYXNBdHRyaWJ1dGUoJ3VpYi10YWItaGVhZGluZycpIHx8XG4gICAgICBub2RlLmhhc0F0dHJpYnV0ZSgnZGF0YS11aWItdGFiLWhlYWRpbmcnKSB8fFxuICAgICAgbm9kZS5oYXNBdHRyaWJ1dGUoJ3gtdWliLXRhYi1oZWFkaW5nJykgfHxcbiAgICAgIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAndWliLXRhYi1oZWFkaW5nJyB8fFxuICAgICAgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdkYXRhLXVpYi10YWItaGVhZGluZycgfHxcbiAgICAgIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAneC11aWItdGFiLWhlYWRpbmcnXG4gICAgKTtcbiAgfVxufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAudGltZXBpY2tlcicsIFtdKVxuXG4uY29uc3RhbnQoJ3VpYlRpbWVwaWNrZXJDb25maWcnLCB7XG4gIGhvdXJTdGVwOiAxLFxuICBtaW51dGVTdGVwOiAxLFxuICBzZWNvbmRTdGVwOiAxLFxuICBzaG93TWVyaWRpYW46IHRydWUsXG4gIHNob3dTZWNvbmRzOiBmYWxzZSxcbiAgbWVyaWRpYW5zOiBudWxsLFxuICByZWFkb25seUlucHV0OiBmYWxzZSxcbiAgbW91c2V3aGVlbDogdHJ1ZSxcbiAgYXJyb3drZXlzOiB0cnVlLFxuICBzaG93U3Bpbm5lcnM6IHRydWUsXG4gIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3RpbWVwaWNrZXIvdGltZXBpY2tlci5odG1sJ1xufSlcblxuLmNvbnRyb2xsZXIoJ1VpYlRpbWVwaWNrZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgJyRwYXJzZScsICckbG9nJywgJyRsb2NhbGUnLCAndWliVGltZXBpY2tlckNvbmZpZycsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHBhcnNlLCAkbG9nLCAkbG9jYWxlLCB0aW1lcGlja2VyQ29uZmlnKSB7XG4gIHZhciBzZWxlY3RlZCA9IG5ldyBEYXRlKCksXG4gICAgd2F0Y2hlcnMgPSBbXSxcbiAgICBuZ01vZGVsQ3RybCA9IHsgJHNldFZpZXdWYWx1ZTogYW5ndWxhci5ub29wIH0sIC8vIG51bGxNb2RlbEN0cmxcbiAgICBtZXJpZGlhbnMgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMubWVyaWRpYW5zKSA/ICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5tZXJpZGlhbnMpIDogdGltZXBpY2tlckNvbmZpZy5tZXJpZGlhbnMgfHwgJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLkFNUE1TO1xuXG4gICRzY29wZS50YWJpbmRleCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy50YWJpbmRleCkgPyAkYXR0cnMudGFiaW5kZXggOiAwO1xuICAkZWxlbWVudC5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKG5nTW9kZWxDdHJsXywgaW5wdXRzKSB7XG4gICAgbmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybF87XG4gICAgbmdNb2RlbEN0cmwuJHJlbmRlciA9IHRoaXMucmVuZGVyO1xuXG4gICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMudW5zaGlmdChmdW5jdGlvbihtb2RlbFZhbHVlKSB7XG4gICAgICByZXR1cm4gbW9kZWxWYWx1ZSA/IG5ldyBEYXRlKG1vZGVsVmFsdWUpIDogbnVsbDtcbiAgICB9KTtcblxuICAgIHZhciBob3Vyc0lucHV0RWwgPSBpbnB1dHMuZXEoMCksXG4gICAgICAgIG1pbnV0ZXNJbnB1dEVsID0gaW5wdXRzLmVxKDEpLFxuICAgICAgICBzZWNvbmRzSW5wdXRFbCA9IGlucHV0cy5lcSgyKTtcblxuICAgIHZhciBtb3VzZXdoZWVsID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLm1vdXNld2hlZWwpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLm1vdXNld2hlZWwpIDogdGltZXBpY2tlckNvbmZpZy5tb3VzZXdoZWVsO1xuXG4gICAgaWYgKG1vdXNld2hlZWwpIHtcbiAgICAgIHRoaXMuc2V0dXBNb3VzZXdoZWVsRXZlbnRzKGhvdXJzSW5wdXRFbCwgbWludXRlc0lucHV0RWwsIHNlY29uZHNJbnB1dEVsKTtcbiAgICB9XG5cbiAgICB2YXIgYXJyb3drZXlzID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmFycm93a2V5cykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuYXJyb3drZXlzKSA6IHRpbWVwaWNrZXJDb25maWcuYXJyb3drZXlzO1xuICAgIGlmIChhcnJvd2tleXMpIHtcbiAgICAgIHRoaXMuc2V0dXBBcnJvd2tleUV2ZW50cyhob3Vyc0lucHV0RWwsIG1pbnV0ZXNJbnB1dEVsLCBzZWNvbmRzSW5wdXRFbCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnJlYWRvbmx5SW5wdXQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMucmVhZG9ubHlJbnB1dCkgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMucmVhZG9ubHlJbnB1dCkgOiB0aW1lcGlja2VyQ29uZmlnLnJlYWRvbmx5SW5wdXQ7XG4gICAgdGhpcy5zZXR1cElucHV0RXZlbnRzKGhvdXJzSW5wdXRFbCwgbWludXRlc0lucHV0RWwsIHNlY29uZHNJbnB1dEVsKTtcbiAgfTtcblxuICB2YXIgaG91clN0ZXAgPSB0aW1lcGlja2VyQ29uZmlnLmhvdXJTdGVwO1xuICBpZiAoJGF0dHJzLmhvdXJTdGVwKSB7XG4gICAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5ob3VyU3RlcCksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBob3VyU3RlcCA9ICt2YWx1ZTtcbiAgICB9KSk7XG4gIH1cblxuICB2YXIgbWludXRlU3RlcCA9IHRpbWVwaWNrZXJDb25maWcubWludXRlU3RlcDtcbiAgaWYgKCRhdHRycy5taW51dGVTdGVwKSB7XG4gICAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5taW51dGVTdGVwKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIG1pbnV0ZVN0ZXAgPSArdmFsdWU7XG4gICAgfSkpO1xuICB9XG5cbiAgdmFyIG1pbjtcbiAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5taW4pLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcbiAgICBtaW4gPSBpc05hTihkdCkgPyB1bmRlZmluZWQgOiBkdDtcbiAgfSkpO1xuXG4gIHZhciBtYXg7XG4gIHdhdGNoZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZSgkYXR0cnMubWF4KSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgZHQgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgbWF4ID0gaXNOYU4oZHQpID8gdW5kZWZpbmVkIDogZHQ7XG4gIH0pKTtcblxuICB2YXIgZGlzYWJsZWQgPSBmYWxzZTtcbiAgaWYgKCRhdHRycy5uZ0Rpc2FibGVkKSB7XG4gICAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5uZ0Rpc2FibGVkKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGRpc2FibGVkID0gdmFsdWU7XG4gICAgfSkpO1xuICB9XG5cbiAgJHNjb3BlLm5vSW5jcmVtZW50SG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5jcmVtZW50ZWRTZWxlY3RlZCA9IGFkZE1pbnV0ZXMoc2VsZWN0ZWQsIGhvdXJTdGVwICogNjApO1xuICAgIHJldHVybiBkaXNhYmxlZCB8fCBpbmNyZW1lbnRlZFNlbGVjdGVkID4gbWF4IHx8XG4gICAgICBpbmNyZW1lbnRlZFNlbGVjdGVkIDwgc2VsZWN0ZWQgJiYgaW5jcmVtZW50ZWRTZWxlY3RlZCA8IG1pbjtcbiAgfTtcblxuICAkc2NvcGUubm9EZWNyZW1lbnRIb3VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWNyZW1lbnRlZFNlbGVjdGVkID0gYWRkTWludXRlcyhzZWxlY3RlZCwgLWhvdXJTdGVwICogNjApO1xuICAgIHJldHVybiBkaXNhYmxlZCB8fCBkZWNyZW1lbnRlZFNlbGVjdGVkIDwgbWluIHx8XG4gICAgICBkZWNyZW1lbnRlZFNlbGVjdGVkID4gc2VsZWN0ZWQgJiYgZGVjcmVtZW50ZWRTZWxlY3RlZCA+IG1heDtcbiAgfTtcblxuICAkc2NvcGUubm9JbmNyZW1lbnRNaW51dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluY3JlbWVudGVkU2VsZWN0ZWQgPSBhZGRNaW51dGVzKHNlbGVjdGVkLCBtaW51dGVTdGVwKTtcbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgaW5jcmVtZW50ZWRTZWxlY3RlZCA+IG1heCB8fFxuICAgICAgaW5jcmVtZW50ZWRTZWxlY3RlZCA8IHNlbGVjdGVkICYmIGluY3JlbWVudGVkU2VsZWN0ZWQgPCBtaW47XG4gIH07XG5cbiAgJHNjb3BlLm5vRGVjcmVtZW50TWludXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWNyZW1lbnRlZFNlbGVjdGVkID0gYWRkTWludXRlcyhzZWxlY3RlZCwgLW1pbnV0ZVN0ZXApO1xuICAgIHJldHVybiBkaXNhYmxlZCB8fCBkZWNyZW1lbnRlZFNlbGVjdGVkIDwgbWluIHx8XG4gICAgICBkZWNyZW1lbnRlZFNlbGVjdGVkID4gc2VsZWN0ZWQgJiYgZGVjcmVtZW50ZWRTZWxlY3RlZCA+IG1heDtcbiAgfTtcblxuICAkc2NvcGUubm9JbmNyZW1lbnRTZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluY3JlbWVudGVkU2VsZWN0ZWQgPSBhZGRTZWNvbmRzKHNlbGVjdGVkLCBzZWNvbmRTdGVwKTtcbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgaW5jcmVtZW50ZWRTZWxlY3RlZCA+IG1heCB8fFxuICAgICAgaW5jcmVtZW50ZWRTZWxlY3RlZCA8IHNlbGVjdGVkICYmIGluY3JlbWVudGVkU2VsZWN0ZWQgPCBtaW47XG4gIH07XG5cbiAgJHNjb3BlLm5vRGVjcmVtZW50U2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWNyZW1lbnRlZFNlbGVjdGVkID0gYWRkU2Vjb25kcyhzZWxlY3RlZCwgLXNlY29uZFN0ZXApO1xuICAgIHJldHVybiBkaXNhYmxlZCB8fCBkZWNyZW1lbnRlZFNlbGVjdGVkIDwgbWluIHx8XG4gICAgICBkZWNyZW1lbnRlZFNlbGVjdGVkID4gc2VsZWN0ZWQgJiYgZGVjcmVtZW50ZWRTZWxlY3RlZCA+IG1heDtcbiAgfTtcblxuICAkc2NvcGUubm9Ub2dnbGVNZXJpZGlhbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzZWxlY3RlZC5nZXRIb3VycygpIDwgMTIpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZCB8fCBhZGRNaW51dGVzKHNlbGVjdGVkLCAxMiAqIDYwKSA+IG1heDtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgYWRkTWludXRlcyhzZWxlY3RlZCwgLTEyICogNjApIDwgbWluO1xuICB9O1xuXG4gIHZhciBzZWNvbmRTdGVwID0gdGltZXBpY2tlckNvbmZpZy5zZWNvbmRTdGVwO1xuICBpZiAoJGF0dHJzLnNlY29uZFN0ZXApIHtcbiAgICB3YXRjaGVycy5wdXNoKCRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLnNlY29uZFN0ZXApLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgc2Vjb25kU3RlcCA9ICt2YWx1ZTtcbiAgICB9KSk7XG4gIH1cblxuICAkc2NvcGUuc2hvd1NlY29uZHMgPSB0aW1lcGlja2VyQ29uZmlnLnNob3dTZWNvbmRzO1xuICBpZiAoJGF0dHJzLnNob3dTZWNvbmRzKSB7XG4gICAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5zaG93U2Vjb25kcyksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAkc2NvcGUuc2hvd1NlY29uZHMgPSAhIXZhbHVlO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8vIDEySCAvIDI0SCBtb2RlXG4gICRzY29wZS5zaG93TWVyaWRpYW4gPSB0aW1lcGlja2VyQ29uZmlnLnNob3dNZXJpZGlhbjtcbiAgaWYgKCRhdHRycy5zaG93TWVyaWRpYW4pIHtcbiAgICB3YXRjaGVycy5wdXNoKCRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLnNob3dNZXJpZGlhbiksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAkc2NvcGUuc2hvd01lcmlkaWFuID0gISF2YWx1ZTtcblxuICAgICAgaWYgKG5nTW9kZWxDdHJsLiRlcnJvci50aW1lKSB7XG4gICAgICAgIC8vIEV2YWx1YXRlIGZyb20gdGVtcGxhdGVcbiAgICAgICAgdmFyIGhvdXJzID0gZ2V0SG91cnNGcm9tVGVtcGxhdGUoKSwgbWludXRlcyA9IGdldE1pbnV0ZXNGcm9tVGVtcGxhdGUoKTtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGhvdXJzKSAmJiBhbmd1bGFyLmlzRGVmaW5lZChtaW51dGVzKSkge1xuICAgICAgICAgIHNlbGVjdGVkLnNldEhvdXJzKGhvdXJzKTtcbiAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZVRlbXBsYXRlKCk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgLy8gR2V0ICRzY29wZS5ob3VycyBpbiAyNEggbW9kZSBpZiB2YWxpZFxuICBmdW5jdGlvbiBnZXRIb3Vyc0Zyb21UZW1wbGF0ZSgpIHtcbiAgICB2YXIgaG91cnMgPSArJHNjb3BlLmhvdXJzO1xuICAgIHZhciB2YWxpZCA9ICRzY29wZS5zaG93TWVyaWRpYW4gPyBob3VycyA+IDAgJiYgaG91cnMgPCAxMyA6XG4gICAgICBob3VycyA+PSAwICYmIGhvdXJzIDwgMjQ7XG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoJHNjb3BlLnNob3dNZXJpZGlhbikge1xuICAgICAgaWYgKGhvdXJzID09PSAxMikge1xuICAgICAgICBob3VycyA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoJHNjb3BlLm1lcmlkaWFuID09PSBtZXJpZGlhbnNbMV0pIHtcbiAgICAgICAgaG91cnMgPSBob3VycyArIDEyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaG91cnM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNaW51dGVzRnJvbVRlbXBsYXRlKCkge1xuICAgIHZhciBtaW51dGVzID0gKyRzY29wZS5taW51dGVzO1xuICAgIHJldHVybiBtaW51dGVzID49IDAgJiYgbWludXRlcyA8IDYwID8gbWludXRlcyA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNlY29uZHNGcm9tVGVtcGxhdGUoKSB7XG4gICAgdmFyIHNlY29uZHMgPSArJHNjb3BlLnNlY29uZHM7XG4gICAgcmV0dXJuIHNlY29uZHMgPj0gMCAmJiBzZWNvbmRzIDwgNjAgPyBzZWNvbmRzIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFkKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSAmJiB2YWx1ZS50b1N0cmluZygpLmxlbmd0aCA8IDIgP1xuICAgICAgJzAnICsgdmFsdWUgOiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG5cbiAgLy8gUmVzcG9uZCBvbiBtb3VzZXdoZWVsIHNwaW5cbiAgdGhpcy5zZXR1cE1vdXNld2hlZWxFdmVudHMgPSBmdW5jdGlvbihob3Vyc0lucHV0RWwsIG1pbnV0ZXNJbnB1dEVsLCBzZWNvbmRzSW5wdXRFbCkge1xuICAgIHZhciBpc1Njcm9sbGluZ1VwID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudCkge1xuICAgICAgICBlID0gZS5vcmlnaW5hbEV2ZW50O1xuICAgICAgfVxuICAgICAgLy9waWNrIGNvcnJlY3QgZGVsdGEgdmFyaWFibGUgZGVwZW5kaW5nIG9uIGV2ZW50XG4gICAgICB2YXIgZGVsdGEgPSBlLndoZWVsRGVsdGEgPyBlLndoZWVsRGVsdGEgOiAtZS5kZWx0YVk7XG4gICAgICByZXR1cm4gZS5kZXRhaWwgfHwgZGVsdGEgPiAwO1xuICAgIH07XG5cbiAgICBob3Vyc0lucHV0RWwuYmluZCgnbW91c2V3aGVlbCB3aGVlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShpc1Njcm9sbGluZ1VwKGUpID8gJHNjb3BlLmluY3JlbWVudEhvdXJzKCkgOiAkc2NvcGUuZGVjcmVtZW50SG91cnMoKSk7XG4gICAgICB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICBtaW51dGVzSW5wdXRFbC5iaW5kKCdtb3VzZXdoZWVsIHdoZWVsJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGlzU2Nyb2xsaW5nVXAoZSkgPyAkc2NvcGUuaW5jcmVtZW50TWludXRlcygpIDogJHNjb3BlLmRlY3JlbWVudE1pbnV0ZXMoKSk7XG4gICAgICB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICAgc2Vjb25kc0lucHV0RWwuYmluZCgnbW91c2V3aGVlbCB3aGVlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShpc1Njcm9sbGluZ1VwKGUpID8gJHNjb3BlLmluY3JlbWVudFNlY29uZHMoKSA6ICRzY29wZS5kZWNyZW1lbnRTZWNvbmRzKCkpO1xuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFJlc3BvbmQgb24gdXAvZG93biBhcnJvd2tleXNcbiAgdGhpcy5zZXR1cEFycm93a2V5RXZlbnRzID0gZnVuY3Rpb24oaG91cnNJbnB1dEVsLCBtaW51dGVzSW5wdXRFbCwgc2Vjb25kc0lucHV0RWwpIHtcbiAgICBob3Vyc0lucHV0RWwuYmluZCgna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDM4KSB7IC8vIHVwXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRzY29wZS5pbmNyZW1lbnRIb3VycygpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09PSA0MCkgeyAvLyBkb3duXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRzY29wZS5kZWNyZW1lbnRIb3VycygpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbWludXRlc0lucHV0RWwuYmluZCgna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDM4KSB7IC8vIHVwXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRzY29wZS5pbmNyZW1lbnRNaW51dGVzKCk7XG4gICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT09IDQwKSB7IC8vIGRvd25cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgJHNjb3BlLmRlY3JlbWVudE1pbnV0ZXMoKTtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlY29uZHNJbnB1dEVsLmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICAgIGlmIChlLndoaWNoID09PSAzOCkgeyAvLyB1cFxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc2NvcGUuaW5jcmVtZW50U2Vjb25kcygpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09PSA0MCkgeyAvLyBkb3duXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRzY29wZS5kZWNyZW1lbnRTZWNvbmRzKCk7XG4gICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5zZXR1cElucHV0RXZlbnRzID0gZnVuY3Rpb24oaG91cnNJbnB1dEVsLCBtaW51dGVzSW5wdXRFbCwgc2Vjb25kc0lucHV0RWwpIHtcbiAgICBpZiAoJHNjb3BlLnJlYWRvbmx5SW5wdXQpIHtcbiAgICAgICRzY29wZS51cGRhdGVIb3VycyA9IGFuZ3VsYXIubm9vcDtcbiAgICAgICRzY29wZS51cGRhdGVNaW51dGVzID0gYW5ndWxhci5ub29wO1xuICAgICAgJHNjb3BlLnVwZGF0ZVNlY29uZHMgPSBhbmd1bGFyLm5vb3A7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGludmFsaWRhdGUgPSBmdW5jdGlvbihpbnZhbGlkSG91cnMsIGludmFsaWRNaW51dGVzLCBpbnZhbGlkU2Vjb25kcykge1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShudWxsKTtcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgndGltZScsIGZhbHNlKTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpbnZhbGlkSG91cnMpKSB7XG4gICAgICAgICRzY29wZS5pbnZhbGlkSG91cnMgPSBpbnZhbGlkSG91cnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpbnZhbGlkTWludXRlcykpIHtcbiAgICAgICAgJHNjb3BlLmludmFsaWRNaW51dGVzID0gaW52YWxpZE1pbnV0ZXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChpbnZhbGlkU2Vjb25kcykpIHtcbiAgICAgICAgJHNjb3BlLmludmFsaWRTZWNvbmRzID0gaW52YWxpZFNlY29uZHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVIb3VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhvdXJzID0gZ2V0SG91cnNGcm9tVGVtcGxhdGUoKSxcbiAgICAgICAgbWludXRlcyA9IGdldE1pbnV0ZXNGcm9tVGVtcGxhdGUoKTtcblxuICAgICAgbmdNb2RlbEN0cmwuJHNldERpcnR5KCk7XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChob3VycykgJiYgYW5ndWxhci5pc0RlZmluZWQobWludXRlcykpIHtcbiAgICAgICAgc2VsZWN0ZWQuc2V0SG91cnMoaG91cnMpO1xuICAgICAgICBzZWxlY3RlZC5zZXRNaW51dGVzKG1pbnV0ZXMpO1xuICAgICAgICBpZiAoc2VsZWN0ZWQgPCBtaW4gfHwgc2VsZWN0ZWQgPiBtYXgpIHtcbiAgICAgICAgICBpbnZhbGlkYXRlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZnJlc2goJ2gnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW52YWxpZGF0ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaG91cnNJbnB1dEVsLmJpbmQoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgICBuZ01vZGVsQ3RybC4kc2V0VG91Y2hlZCgpO1xuICAgICAgaWYgKCRzY29wZS5ob3VycyA9PT0gbnVsbCB8fCAkc2NvcGUuaG91cnMgPT09ICcnKSB7XG4gICAgICAgIGludmFsaWRhdGUodHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKCEkc2NvcGUuaW52YWxpZEhvdXJzICYmICRzY29wZS5ob3VycyA8IDEwKSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLmhvdXJzID0gcGFkKCRzY29wZS5ob3Vycyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHNjb3BlLnVwZGF0ZU1pbnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtaW51dGVzID0gZ2V0TWludXRlc0Zyb21UZW1wbGF0ZSgpLFxuICAgICAgICBob3VycyA9IGdldEhvdXJzRnJvbVRlbXBsYXRlKCk7XG5cbiAgICAgIG5nTW9kZWxDdHJsLiRzZXREaXJ0eSgpO1xuXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobWludXRlcykgJiYgYW5ndWxhci5pc0RlZmluZWQoaG91cnMpKSB7XG4gICAgICAgIHNlbGVjdGVkLnNldEhvdXJzKGhvdXJzKTtcbiAgICAgICAgc2VsZWN0ZWQuc2V0TWludXRlcyhtaW51dGVzKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkIDwgbWluIHx8IHNlbGVjdGVkID4gbWF4KSB7XG4gICAgICAgICAgaW52YWxpZGF0ZSh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZnJlc2goJ20nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW52YWxpZGF0ZSh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBtaW51dGVzSW5wdXRFbC5iaW5kKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFRvdWNoZWQoKTtcbiAgICAgIGlmICgkc2NvcGUubWludXRlcyA9PT0gbnVsbCkge1xuICAgICAgICBpbnZhbGlkYXRlKHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKCEkc2NvcGUuaW52YWxpZE1pbnV0ZXMgJiYgJHNjb3BlLm1pbnV0ZXMgPCAxMCkge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5taW51dGVzID0gcGFkKCRzY29wZS5taW51dGVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkc2NvcGUudXBkYXRlU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlY29uZHMgPSBnZXRTZWNvbmRzRnJvbVRlbXBsYXRlKCk7XG5cbiAgICAgIG5nTW9kZWxDdHJsLiRzZXREaXJ0eSgpO1xuXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoc2Vjb25kcykpIHtcbiAgICAgICAgc2VsZWN0ZWQuc2V0U2Vjb25kcyhzZWNvbmRzKTtcbiAgICAgICAgcmVmcmVzaCgncycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW52YWxpZGF0ZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlY29uZHNJbnB1dEVsLmJpbmQoJ2JsdXInLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoISRzY29wZS5pbnZhbGlkU2Vjb25kcyAmJiAkc2NvcGUuc2Vjb25kcyA8IDEwKSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5zZWNvbmRzID0gcGFkKCRzY29wZS5zZWNvbmRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRlID0gbmdNb2RlbEN0cmwuJHZpZXdWYWx1ZTtcblxuICAgIGlmIChpc05hTihkYXRlKSkge1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFZhbGlkaXR5KCd0aW1lJywgZmFsc2UpO1xuICAgICAgJGxvZy5lcnJvcignVGltZXBpY2tlciBkaXJlY3RpdmU6IFwibmctbW9kZWxcIiB2YWx1ZSBtdXN0IGJlIGEgRGF0ZSBvYmplY3QsIGEgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBzaW5jZSAwMS4wMS4xOTcwIG9yIGEgc3RyaW5nIHJlcHJlc2VudGluZyBhbiBSRkMyODIyIG9yIElTTyA4NjAxIGRhdGUuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgIHNlbGVjdGVkID0gZGF0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGVjdGVkIDwgbWluIHx8IHNlbGVjdGVkID4gbWF4KSB7XG4gICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgndGltZScsIGZhbHNlKTtcbiAgICAgICAgJHNjb3BlLmludmFsaWRIb3VycyA9IHRydWU7XG4gICAgICAgICRzY29wZS5pbnZhbGlkTWludXRlcyA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYWtlVmFsaWQoKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZVRlbXBsYXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIENhbGwgaW50ZXJuYWxseSB3aGVuIHdlIGtub3cgdGhhdCBtb2RlbCBpcyB2YWxpZC5cbiAgZnVuY3Rpb24gcmVmcmVzaChrZXlib2FyZENoYW5nZSkge1xuICAgIG1ha2VWYWxpZCgpO1xuICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUobmV3IERhdGUoc2VsZWN0ZWQpKTtcbiAgICB1cGRhdGVUZW1wbGF0ZShrZXlib2FyZENoYW5nZSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlVmFsaWQoKSB7XG4gICAgbmdNb2RlbEN0cmwuJHNldFZhbGlkaXR5KCd0aW1lJywgdHJ1ZSk7XG4gICAgJHNjb3BlLmludmFsaWRIb3VycyA9IGZhbHNlO1xuICAgICRzY29wZS5pbnZhbGlkTWludXRlcyA9IGZhbHNlO1xuICAgICRzY29wZS5pbnZhbGlkU2Vjb25kcyA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVGVtcGxhdGUoa2V5Ym9hcmRDaGFuZ2UpIHtcbiAgICBpZiAoIW5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlKSB7XG4gICAgICAkc2NvcGUuaG91cnMgPSBudWxsO1xuICAgICAgJHNjb3BlLm1pbnV0ZXMgPSBudWxsO1xuICAgICAgJHNjb3BlLnNlY29uZHMgPSBudWxsO1xuICAgICAgJHNjb3BlLm1lcmlkaWFuID0gbWVyaWRpYW5zWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaG91cnMgPSBzZWxlY3RlZC5nZXRIb3VycygpLFxuICAgICAgICBtaW51dGVzID0gc2VsZWN0ZWQuZ2V0TWludXRlcygpLFxuICAgICAgICBzZWNvbmRzID0gc2VsZWN0ZWQuZ2V0U2Vjb25kcygpO1xuXG4gICAgICBpZiAoJHNjb3BlLnNob3dNZXJpZGlhbikge1xuICAgICAgICBob3VycyA9IGhvdXJzID09PSAwIHx8IGhvdXJzID09PSAxMiA/IDEyIDogaG91cnMgJSAxMjsgLy8gQ29udmVydCAyNCB0byAxMiBob3VyIHN5c3RlbVxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuaG91cnMgPSBrZXlib2FyZENoYW5nZSA9PT0gJ2gnID8gaG91cnMgOiBwYWQoaG91cnMpO1xuICAgICAgaWYgKGtleWJvYXJkQ2hhbmdlICE9PSAnbScpIHtcbiAgICAgICAgJHNjb3BlLm1pbnV0ZXMgPSBwYWQobWludXRlcyk7XG4gICAgICB9XG4gICAgICAkc2NvcGUubWVyaWRpYW4gPSBzZWxlY3RlZC5nZXRIb3VycygpIDwgMTIgPyBtZXJpZGlhbnNbMF0gOiBtZXJpZGlhbnNbMV07XG5cbiAgICAgIGlmIChrZXlib2FyZENoYW5nZSAhPT0gJ3MnKSB7XG4gICAgICAgICRzY29wZS5zZWNvbmRzID0gcGFkKHNlY29uZHMpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLm1lcmlkaWFuID0gc2VsZWN0ZWQuZ2V0SG91cnMoKSA8IDEyID8gbWVyaWRpYW5zWzBdIDogbWVyaWRpYW5zWzFdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNlY29uZHNUb1NlbGVjdGVkKHNlY29uZHMpIHtcbiAgICBzZWxlY3RlZCA9IGFkZFNlY29uZHMoc2VsZWN0ZWQsIHNlY29uZHMpO1xuICAgIHJlZnJlc2goKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE1pbnV0ZXMoc2VsZWN0ZWQsIG1pbnV0ZXMpIHtcbiAgICByZXR1cm4gYWRkU2Vjb25kcyhzZWxlY3RlZCwgbWludXRlcyo2MCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRTZWNvbmRzKGRhdGUsIHNlY29uZHMpIHtcbiAgICB2YXIgZHQgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArIHNlY29uZHMgKiAxMDAwKTtcbiAgICB2YXIgbmV3RGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIG5ld0RhdGUuc2V0SG91cnMoZHQuZ2V0SG91cnMoKSwgZHQuZ2V0TWludXRlcygpLCBkdC5nZXRTZWNvbmRzKCkpO1xuICAgIHJldHVybiBuZXdEYXRlO1xuICB9XG5cbiAgJHNjb3BlLnNob3dTcGlubmVycyA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5zaG93U3Bpbm5lcnMpID9cbiAgICAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuc2hvd1NwaW5uZXJzKSA6IHRpbWVwaWNrZXJDb25maWcuc2hvd1NwaW5uZXJzO1xuXG4gICRzY29wZS5pbmNyZW1lbnRIb3VycyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghJHNjb3BlLm5vSW5jcmVtZW50SG91cnMoKSkge1xuICAgICAgYWRkU2Vjb25kc1RvU2VsZWN0ZWQoaG91clN0ZXAgKiA2MCAqIDYwKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmRlY3JlbWVudEhvdXJzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEkc2NvcGUubm9EZWNyZW1lbnRIb3VycygpKSB7XG4gICAgICBhZGRTZWNvbmRzVG9TZWxlY3RlZCgtaG91clN0ZXAgKiA2MCAqIDYwKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmluY3JlbWVudE1pbnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISRzY29wZS5ub0luY3JlbWVudE1pbnV0ZXMoKSkge1xuICAgICAgYWRkU2Vjb25kc1RvU2VsZWN0ZWQobWludXRlU3RlcCAqIDYwKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmRlY3JlbWVudE1pbnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISRzY29wZS5ub0RlY3JlbWVudE1pbnV0ZXMoKSkge1xuICAgICAgYWRkU2Vjb25kc1RvU2VsZWN0ZWQoLW1pbnV0ZVN0ZXAgKiA2MCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5pbmNyZW1lbnRTZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEkc2NvcGUubm9JbmNyZW1lbnRTZWNvbmRzKCkpIHtcbiAgICAgIGFkZFNlY29uZHNUb1NlbGVjdGVkKHNlY29uZFN0ZXApO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZGVjcmVtZW50U2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghJHNjb3BlLm5vRGVjcmVtZW50U2Vjb25kcygpKSB7XG4gICAgICBhZGRTZWNvbmRzVG9TZWxlY3RlZCgtc2Vjb25kU3RlcCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVNZXJpZGlhbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtaW51dGVzID0gZ2V0TWludXRlc0Zyb21UZW1wbGF0ZSgpLFxuICAgICAgICBob3VycyA9IGdldEhvdXJzRnJvbVRlbXBsYXRlKCk7XG5cbiAgICBpZiAoISRzY29wZS5ub1RvZ2dsZU1lcmlkaWFuKCkpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChtaW51dGVzKSAmJiBhbmd1bGFyLmlzRGVmaW5lZChob3VycykpIHtcbiAgICAgICAgYWRkU2Vjb25kc1RvU2VsZWN0ZWQoMTIgKiA2MCAqIChzZWxlY3RlZC5nZXRIb3VycygpIDwgMTIgPyA2MCA6IC02MCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLm1lcmlkaWFuID0gJHNjb3BlLm1lcmlkaWFuID09PSBtZXJpZGlhbnNbMF0gPyBtZXJpZGlhbnNbMV0gOiBtZXJpZGlhbnNbMF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5ibHVyID0gZnVuY3Rpb24oKSB7XG4gICAgbmdNb2RlbEN0cmwuJHNldFRvdWNoZWQoKTtcbiAgfTtcblxuICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgIHdoaWxlICh3YXRjaGVycy5sZW5ndGgpIHtcbiAgICAgIHdhdGNoZXJzLnNoaWZ0KCkoKTtcbiAgICB9XG4gIH0pO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRpbWVwaWNrZXInLCBbJ3VpYlRpbWVwaWNrZXJDb25maWcnLCBmdW5jdGlvbih1aWJUaW1lcGlja2VyQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVxdWlyZTogWyd1aWJUaW1lcGlja2VyJywgJz9ebmdNb2RlbCddLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJUaW1lcGlja2VyQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAndGltZXBpY2tlcicsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge30sXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgdWliVGltZXBpY2tlckNvbmZpZy50ZW1wbGF0ZVVybDtcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciB0aW1lcGlja2VyQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAobmdNb2RlbEN0cmwpIHtcbiAgICAgICAgdGltZXBpY2tlckN0cmwuaW5pdChuZ01vZGVsQ3RybCwgZWxlbWVudC5maW5kKCdpbnB1dCcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAudHlwZWFoZWFkJywgWyd1aS5ib290c3RyYXAuZGVib3VuY2UnLCAndWkuYm9vdHN0cmFwLnBvc2l0aW9uJ10pXG5cbi8qKlxuICogQSBoZWxwZXIgc2VydmljZSB0aGF0IGNhbiBwYXJzZSB0eXBlYWhlYWQncyBzeW50YXggKHN0cmluZyBwcm92aWRlZCBieSB1c2VycylcbiAqIEV4dHJhY3RlZCB0byBhIHNlcGFyYXRlIHNlcnZpY2UgZm9yIGVhc2Ugb2YgdW5pdCB0ZXN0aW5nXG4gKi9cbiAgLmZhY3RvcnkoJ3VpYlR5cGVhaGVhZFBhcnNlcicsIFsnJHBhcnNlJywgZnVuY3Rpb24oJHBhcnNlKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgMDAwMDAxMTEwMDAwMDAwMDAwMDAwMjIyMDAwMDAwMDAwMDAwMDAwMDMzMzMzMzMzMzMzMzMzMzAwMDAwMDAwMDAwNDQwMDBcbiAgICB2YXIgVFlQRUFIRUFEX1JFR0VYUCA9IC9eXFxzKihbXFxzXFxTXSs/KSg/Olxccythc1xccysoW1xcc1xcU10rPykpP1xccytmb3JcXHMrKD86KFtcXCRcXHddW1xcJFxcd1xcZF0qKSlcXHMraW5cXHMrKFtcXHNcXFNdKz8pJC87XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcnNlOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBpbnB1dC5tYXRjaChUWVBFQUhFQURfUkVHRVhQKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdFeHBlY3RlZCB0eXBlYWhlYWQgc3BlY2lmaWNhdGlvbiBpbiBmb3JtIG9mIFwiX21vZGVsVmFsdWVfIChhcyBfbGFiZWxfKT8gZm9yIF9pdGVtXyBpbiBfY29sbGVjdGlvbl9cIicgK1xuICAgICAgICAgICAgICAnIGJ1dCBnb3QgXCInICsgaW5wdXQgKyAnXCIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGl0ZW1OYW1lOiBtYXRjaFszXSxcbiAgICAgICAgICBzb3VyY2U6ICRwYXJzZShtYXRjaFs0XSksXG4gICAgICAgICAgdmlld01hcHBlcjogJHBhcnNlKG1hdGNoWzJdIHx8IG1hdGNoWzFdKSxcbiAgICAgICAgICBtb2RlbE1hcHBlcjogJHBhcnNlKG1hdGNoWzFdKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1dKVxuXG4gIC5jb250cm9sbGVyKCdVaWJUeXBlYWhlYWRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgJyRjb21waWxlJywgJyRwYXJzZScsICckcScsICckdGltZW91dCcsICckZG9jdW1lbnQnLCAnJHdpbmRvdycsICckcm9vdFNjb3BlJywgJyQkZGVib3VuY2UnLCAnJHVpYlBvc2l0aW9uJywgJ3VpYlR5cGVhaGVhZFBhcnNlcicsXG4gICAgZnVuY3Rpb24ob3JpZ2luYWxTY29wZSwgZWxlbWVudCwgYXR0cnMsICRjb21waWxlLCAkcGFyc2UsICRxLCAkdGltZW91dCwgJGRvY3VtZW50LCAkd2luZG93LCAkcm9vdFNjb3BlLCAkJGRlYm91bmNlLCAkcG9zaXRpb24sIHR5cGVhaGVhZFBhcnNlcikge1xuICAgIHZhciBIT1RfS0VZUyA9IFs5LCAxMywgMjcsIDM4LCA0MF07XG4gICAgdmFyIGV2ZW50RGVib3VuY2VUaW1lID0gMjAwO1xuICAgIHZhciBtb2RlbEN0cmwsIG5nTW9kZWxPcHRpb25zO1xuICAgIC8vU1VQUE9SVEVEIEFUVFJJQlVURVMgKE9QVElPTlMpXG5cbiAgICAvL21pbmltYWwgbm8gb2YgY2hhcmFjdGVycyB0aGF0IG5lZWRzIHRvIGJlIGVudGVyZWQgYmVmb3JlIHR5cGVhaGVhZCBraWNrcy1pblxuICAgIHZhciBtaW5MZW5ndGggPSBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZE1pbkxlbmd0aCk7XG4gICAgaWYgKCFtaW5MZW5ndGggJiYgbWluTGVuZ3RoICE9PSAwKSB7XG4gICAgICBtaW5MZW5ndGggPSAxO1xuICAgIH1cblxuICAgIC8vbWluaW1hbCB3YWl0IHRpbWUgYWZ0ZXIgbGFzdCBjaGFyYWN0ZXIgdHlwZWQgYmVmb3JlIHR5cGVhaGVhZCBraWNrcy1pblxuICAgIHZhciB3YWl0VGltZSA9IG9yaWdpbmFsU2NvcGUuJGV2YWwoYXR0cnMudHlwZWFoZWFkV2FpdE1zKSB8fCAwO1xuXG4gICAgLy9zaG91bGQgaXQgcmVzdHJpY3QgbW9kZWwgdmFsdWVzIHRvIHRoZSBvbmVzIHNlbGVjdGVkIGZyb20gdGhlIHBvcHVwIG9ubHk/XG4gICAgdmFyIGlzRWRpdGFibGUgPSBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZEVkaXRhYmxlKSAhPT0gZmFsc2U7XG4gICAgb3JpZ2luYWxTY29wZS4kd2F0Y2goYXR0cnMudHlwZWFoZWFkRWRpdGFibGUsIGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgIGlzRWRpdGFibGUgPSBuZXdWYWwgIT09IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy9iaW5kaW5nIHRvIGEgdmFyaWFibGUgdGhhdCBpbmRpY2F0ZXMgaWYgbWF0Y2hlcyBhcmUgYmVpbmcgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5XG4gICAgdmFyIGlzTG9hZGluZ1NldHRlciA9ICRwYXJzZShhdHRycy50eXBlYWhlYWRMb2FkaW5nKS5hc3NpZ24gfHwgYW5ndWxhci5ub29wO1xuXG4gICAgLy9hIGNhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gYSBtYXRjaCBpcyBzZWxlY3RlZFxuICAgIHZhciBvblNlbGVjdENhbGxiYWNrID0gJHBhcnNlKGF0dHJzLnR5cGVhaGVhZE9uU2VsZWN0KTtcblxuICAgIC8vc2hvdWxkIGl0IHNlbGVjdCBoaWdobGlnaHRlZCBwb3B1cCB2YWx1ZSB3aGVuIGxvc2luZyBmb2N1cz9cbiAgICB2YXIgaXNTZWxlY3RPbkJsdXIgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy50eXBlYWhlYWRTZWxlY3RPbkJsdXIpID8gb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRTZWxlY3RPbkJsdXIpIDogZmFsc2U7XG5cbiAgICAvL2JpbmRpbmcgdG8gYSB2YXJpYWJsZSB0aGF0IGluZGljYXRlcyBpZiB0aGVyZSB3ZXJlIG5vIHJlc3VsdHMgYWZ0ZXIgdGhlIHF1ZXJ5IGlzIGNvbXBsZXRlZFxuICAgIHZhciBpc05vUmVzdWx0c1NldHRlciA9ICRwYXJzZShhdHRycy50eXBlYWhlYWROb1Jlc3VsdHMpLmFzc2lnbiB8fCBhbmd1bGFyLm5vb3A7XG5cbiAgICB2YXIgaW5wdXRGb3JtYXR0ZXIgPSBhdHRycy50eXBlYWhlYWRJbnB1dEZvcm1hdHRlciA/ICRwYXJzZShhdHRycy50eXBlYWhlYWRJbnB1dEZvcm1hdHRlcikgOiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgYXBwZW5kVG9Cb2R5ID0gYXR0cnMudHlwZWFoZWFkQXBwZW5kVG9Cb2R5ID8gb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRBcHBlbmRUb0JvZHkpIDogZmFsc2U7XG5cbiAgICB2YXIgYXBwZW5kVG8gPSBhdHRycy50eXBlYWhlYWRBcHBlbmRUbyA/XG4gICAgICBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZEFwcGVuZFRvKSA6IG51bGw7XG5cbiAgICB2YXIgZm9jdXNGaXJzdCA9IG9yaWdpbmFsU2NvcGUuJGV2YWwoYXR0cnMudHlwZWFoZWFkRm9jdXNGaXJzdCkgIT09IGZhbHNlO1xuXG4gICAgLy9JZiBpbnB1dCBtYXRjaGVzIGFuIGl0ZW0gb2YgdGhlIGxpc3QgZXhhY3RseSwgc2VsZWN0IGl0IGF1dG9tYXRpY2FsbHlcbiAgICB2YXIgc2VsZWN0T25FeGFjdCA9IGF0dHJzLnR5cGVhaGVhZFNlbGVjdE9uRXhhY3QgPyBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZFNlbGVjdE9uRXhhY3QpIDogZmFsc2U7XG5cbiAgICAvL2JpbmRpbmcgdG8gYSB2YXJpYWJsZSB0aGF0IGluZGljYXRlcyBpZiBkcm9wZG93biBpcyBvcGVuXG4gICAgdmFyIGlzT3BlblNldHRlciA9ICRwYXJzZShhdHRycy50eXBlYWhlYWRJc09wZW4pLmFzc2lnbiB8fCBhbmd1bGFyLm5vb3A7XG5cbiAgICB2YXIgc2hvd0hpbnQgPSBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZFNob3dIaW50KSB8fCBmYWxzZTtcblxuICAgIC8vSU5URVJOQUwgVkFSSUFCTEVTXG5cbiAgICAvL21vZGVsIHNldHRlciBleGVjdXRlZCB1cG9uIG1hdGNoIHNlbGVjdGlvblxuICAgIHZhciBwYXJzZWRNb2RlbCA9ICRwYXJzZShhdHRycy5uZ01vZGVsKTtcbiAgICB2YXIgaW52b2tlTW9kZWxTZXR0ZXIgPSAkcGFyc2UoYXR0cnMubmdNb2RlbCArICcoJCQkcCknKTtcbiAgICB2YXIgJHNldE1vZGVsVmFsdWUgPSBmdW5jdGlvbihzY29wZSwgbmV3VmFsdWUpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocGFyc2VkTW9kZWwob3JpZ2luYWxTY29wZSkpICYmXG4gICAgICAgIG5nTW9kZWxPcHRpb25zICYmIG5nTW9kZWxPcHRpb25zLiRvcHRpb25zICYmIG5nTW9kZWxPcHRpb25zLiRvcHRpb25zLmdldHRlclNldHRlcikge1xuICAgICAgICByZXR1cm4gaW52b2tlTW9kZWxTZXR0ZXIoc2NvcGUsIHskJCRwOiBuZXdWYWx1ZX0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFyc2VkTW9kZWwuYXNzaWduKHNjb3BlLCBuZXdWYWx1ZSk7XG4gICAgfTtcblxuICAgIC8vZXhwcmVzc2lvbnMgdXNlZCBieSB0eXBlYWhlYWRcbiAgICB2YXIgcGFyc2VyUmVzdWx0ID0gdHlwZWFoZWFkUGFyc2VyLnBhcnNlKGF0dHJzLnVpYlR5cGVhaGVhZCk7XG5cbiAgICB2YXIgaGFzRm9jdXM7XG5cbiAgICAvL1VzZWQgdG8gYXZvaWQgYnVnIGluIGlPUyB3ZWJ2aWV3IHdoZXJlIGlPUyBrZXlib2FyZCBkb2VzIG5vdCBmaXJlXG4gICAgLy9tb3VzZWRvd24gJiBtb3VzZXVwIGV2ZW50c1xuICAgIC8vSXNzdWUgIzM2OTlcbiAgICB2YXIgc2VsZWN0ZWQ7XG5cbiAgICAvL2NyZWF0ZSBhIGNoaWxkIHNjb3BlIGZvciB0aGUgdHlwZWFoZWFkIGRpcmVjdGl2ZSBzbyB3ZSBhcmUgbm90IHBvbGx1dGluZyBvcmlnaW5hbCBzY29wZVxuICAgIC8vd2l0aCB0eXBlYWhlYWQtc3BlY2lmaWMgZGF0YSAobWF0Y2hlcywgcXVlcnkgZXRjLilcbiAgICB2YXIgc2NvcGUgPSBvcmlnaW5hbFNjb3BlLiRuZXcoKTtcbiAgICB2YXIgb2ZmRGVzdHJveSA9IG9yaWdpbmFsU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgc2NvcGUuJGRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICBzY29wZS4kb24oJyRkZXN0cm95Jywgb2ZmRGVzdHJveSk7XG5cbiAgICAvLyBXQUktQVJJQVxuICAgIHZhciBwb3B1cElkID0gJ3R5cGVhaGVhZC0nICsgc2NvcGUuJGlkICsgJy0nICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuICAgIGVsZW1lbnQuYXR0cih7XG4gICAgICAnYXJpYS1hdXRvY29tcGxldGUnOiAnbGlzdCcsXG4gICAgICAnYXJpYS1leHBhbmRlZCc6IGZhbHNlLFxuICAgICAgJ2FyaWEtb3ducyc6IHBvcHVwSWRcbiAgICB9KTtcblxuICAgIHZhciBpbnB1dHNDb250YWluZXIsIGhpbnRJbnB1dEVsZW07XG4gICAgLy9hZGQgcmVhZC1vbmx5IGlucHV0IHRvIHNob3cgaGludFxuICAgIGlmIChzaG93SGludCkge1xuICAgICAgaW5wdXRzQ29udGFpbmVyID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpO1xuICAgICAgaW5wdXRzQ29udGFpbmVyLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgIGVsZW1lbnQuYWZ0ZXIoaW5wdXRzQ29udGFpbmVyKTtcbiAgICAgIGhpbnRJbnB1dEVsZW0gPSBlbGVtZW50LmNsb25lKCk7XG4gICAgICBoaW50SW5wdXRFbGVtLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xuICAgICAgaGludElucHV0RWxlbS52YWwoJycpO1xuICAgICAgaGludElucHV0RWxlbS5jc3Moe1xuICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAndG9wJzogJzBweCcsXG4gICAgICAgICdsZWZ0JzogJzBweCcsXG4gICAgICAgICdib3JkZXItY29sb3InOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAnYm94LXNoYWRvdyc6ICdub25lJyxcbiAgICAgICAgJ29wYWNpdHknOiAxLFxuICAgICAgICAnYmFja2dyb3VuZCc6ICdub25lIDAlIDAlIC8gYXV0byByZXBlYXQgc2Nyb2xsIHBhZGRpbmctYm94IGJvcmRlci1ib3ggcmdiKDI1NSwgMjU1LCAyNTUpJyxcbiAgICAgICAgJ2NvbG9yJzogJyM5OTknXG4gICAgICB9KTtcbiAgICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcbiAgICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJ3RvcCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJ3RyYW5zcGFyZW50J1xuICAgICAgfSk7XG4gICAgICBpbnB1dHNDb250YWluZXIuYXBwZW5kKGhpbnRJbnB1dEVsZW0pO1xuICAgICAgaGludElucHV0RWxlbS5hZnRlcihlbGVtZW50KTtcbiAgICB9XG5cbiAgICAvL3BvcC11cCBlbGVtZW50IHVzZWQgdG8gZGlzcGxheSBtYXRjaGVzXG4gICAgdmFyIHBvcFVwRWwgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgdWliLXR5cGVhaGVhZC1wb3B1cD48L2Rpdj4nKTtcbiAgICBwb3BVcEVsLmF0dHIoe1xuICAgICAgaWQ6IHBvcHVwSWQsXG4gICAgICBtYXRjaGVzOiAnbWF0Y2hlcycsXG4gICAgICBhY3RpdmU6ICdhY3RpdmVJZHgnLFxuICAgICAgc2VsZWN0OiAnc2VsZWN0KGFjdGl2ZUlkeCwgZXZ0KScsXG4gICAgICAnbW92ZS1pbi1wcm9ncmVzcyc6ICdtb3ZlSW5Qcm9ncmVzcycsXG4gICAgICBxdWVyeTogJ3F1ZXJ5JyxcbiAgICAgIHBvc2l0aW9uOiAncG9zaXRpb24nLFxuICAgICAgJ2Fzc2lnbi1pcy1vcGVuJzogJ2Fzc2lnbklzT3Blbihpc09wZW4pJyxcbiAgICAgIGRlYm91bmNlOiAnZGVib3VuY2VVcGRhdGUnXG4gICAgfSk7XG4gICAgLy9jdXN0b20gaXRlbSB0ZW1wbGF0ZVxuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChhdHRycy50eXBlYWhlYWRUZW1wbGF0ZVVybCkpIHtcbiAgICAgIHBvcFVwRWwuYXR0cigndGVtcGxhdGUtdXJsJywgYXR0cnMudHlwZWFoZWFkVGVtcGxhdGVVcmwpO1xuICAgIH1cblxuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChhdHRycy50eXBlYWhlYWRQb3B1cFRlbXBsYXRlVXJsKSkge1xuICAgICAgcG9wVXBFbC5hdHRyKCdwb3B1cC10ZW1wbGF0ZS11cmwnLCBhdHRycy50eXBlYWhlYWRQb3B1cFRlbXBsYXRlVXJsKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzZXRIaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2hvd0hpbnQpIHtcbiAgICAgICAgaGludElucHV0RWxlbS52YWwoJycpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzZXRNYXRjaGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICBzY29wZS5tYXRjaGVzID0gW107XG4gICAgICBzY29wZS5hY3RpdmVJZHggPSAtMTtcbiAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAgIHJlc2V0SGludCgpO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0TWF0Y2hJZCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gcG9wdXBJZCArICctb3B0aW9uLScgKyBpbmRleDtcbiAgICB9O1xuXG4gICAgLy8gSW5kaWNhdGUgdGhhdCB0aGUgc3BlY2lmaWVkIG1hdGNoIGlzIHRoZSBhY3RpdmUgKHByZS1zZWxlY3RlZCkgaXRlbSBpbiB0aGUgbGlzdCBvd25lZCBieSB0aGlzIHR5cGVhaGVhZC5cbiAgICAvLyBUaGlzIGF0dHJpYnV0ZSBpcyBhZGRlZCBvciByZW1vdmVkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgYGFjdGl2ZUlkeGAgY2hhbmdlcy5cbiAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZUlkeCcsIGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIGdldE1hdGNoSWQoaW5kZXgpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBpbnB1dElzRXhhY3RNYXRjaCA9IGZ1bmN0aW9uKGlucHV0VmFsdWUsIGluZGV4KSB7XG4gICAgICBpZiAoc2NvcGUubWF0Y2hlcy5sZW5ndGggPiBpbmRleCAmJiBpbnB1dFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpbnB1dFZhbHVlLnRvVXBwZXJDYXNlKCkgPT09IHNjb3BlLm1hdGNoZXNbaW5kZXhdLmxhYmVsLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIGdldE1hdGNoZXNBc3luYyA9IGZ1bmN0aW9uKGlucHV0VmFsdWUsIGV2dCkge1xuICAgICAgdmFyIGxvY2FscyA9IHskdmlld1ZhbHVlOiBpbnB1dFZhbHVlfTtcbiAgICAgIGlzTG9hZGluZ1NldHRlcihvcmlnaW5hbFNjb3BlLCB0cnVlKTtcbiAgICAgIGlzTm9SZXN1bHRzU2V0dGVyKG9yaWdpbmFsU2NvcGUsIGZhbHNlKTtcbiAgICAgICRxLndoZW4ocGFyc2VyUmVzdWx0LnNvdXJjZShvcmlnaW5hbFNjb3BlLCBsb2NhbHMpKS50aGVuKGZ1bmN0aW9uKG1hdGNoZXMpIHtcbiAgICAgICAgLy9pdCBtaWdodCBoYXBwZW4gdGhhdCBzZXZlcmFsIGFzeW5jIHF1ZXJpZXMgd2VyZSBpbiBwcm9ncmVzcyBpZiBhIHVzZXIgd2VyZSB0eXBpbmcgZmFzdFxuICAgICAgICAvL2J1dCB3ZSBhcmUgaW50ZXJlc3RlZCBvbmx5IGluIHJlc3BvbnNlcyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGN1cnJlbnQgdmlldyB2YWx1ZVxuICAgICAgICB2YXIgb25DdXJyZW50UmVxdWVzdCA9IGlucHV0VmFsdWUgPT09IG1vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICBpZiAob25DdXJyZW50UmVxdWVzdCAmJiBoYXNGb2N1cykge1xuICAgICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2NvcGUuYWN0aXZlSWR4ID0gZm9jdXNGaXJzdCA/IDAgOiAtMTtcbiAgICAgICAgICAgIGlzTm9SZXN1bHRzU2V0dGVyKG9yaWdpbmFsU2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHNjb3BlLm1hdGNoZXMubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgLy90cmFuc2Zvcm0gbGFiZWxzXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgbG9jYWxzW3BhcnNlclJlc3VsdC5pdGVtTmFtZV0gPSBtYXRjaGVzW2ldO1xuICAgICAgICAgICAgICBzY29wZS5tYXRjaGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiBnZXRNYXRjaElkKGkpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBwYXJzZXJSZXN1bHQudmlld01hcHBlcihzY29wZSwgbG9jYWxzKSxcbiAgICAgICAgICAgICAgICBtb2RlbDogbWF0Y2hlc1tpXVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUucXVlcnkgPSBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgLy9wb3NpdGlvbiBwb3AtdXAgd2l0aCBtYXRjaGVzIC0gd2UgbmVlZCB0byByZS1jYWxjdWxhdGUgaXRzIHBvc2l0aW9uIGVhY2ggdGltZSB3ZSBhcmUgb3BlbmluZyBhIHdpbmRvd1xuICAgICAgICAgICAgLy93aXRoIG1hdGNoZXMgYXMgYSBwb3AtdXAgbWlnaHQgYmUgYWJzb2x1dGUtcG9zaXRpb25lZCBhbmQgcG9zaXRpb24gb2YgYW4gaW5wdXQgbWlnaHQgaGF2ZSBjaGFuZ2VkIG9uIGEgcGFnZVxuICAgICAgICAgICAgLy9kdWUgdG8gb3RoZXIgZWxlbWVudHMgYmVpbmcgcmVuZGVyZWRcbiAgICAgICAgICAgIHJlY2FsY3VsYXRlUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vU2VsZWN0IHRoZSBzaW5nbGUgcmVtYWluaW5nIG9wdGlvbiBpZiB1c2VyIGlucHV0IG1hdGNoZXNcbiAgICAgICAgICAgIGlmIChzZWxlY3RPbkV4YWN0ICYmIHNjb3BlLm1hdGNoZXMubGVuZ3RoID09PSAxICYmIGlucHV0SXNFeGFjdE1hdGNoKGlucHV0VmFsdWUsIDApKSB7XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKHNjb3BlLmRlYm91bmNlVXBkYXRlKSB8fCBhbmd1bGFyLmlzT2JqZWN0KHNjb3BlLmRlYm91bmNlVXBkYXRlKSkge1xuICAgICAgICAgICAgICAgICQkZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3QoMCwgZXZ0KTtcbiAgICAgICAgICAgICAgICB9LCBhbmd1bGFyLmlzTnVtYmVyKHNjb3BlLmRlYm91bmNlVXBkYXRlKSA/IHNjb3BlLmRlYm91bmNlVXBkYXRlIDogc2NvcGUuZGVib3VuY2VVcGRhdGVbJ2RlZmF1bHQnXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0KDAsIGV2dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNob3dIaW50KSB7XG4gICAgICAgICAgICAgIHZhciBmaXJzdExhYmVsID0gc2NvcGUubWF0Y2hlc1swXS5sYWJlbDtcbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoaW5wdXRWYWx1ZSkgJiZcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICBmaXJzdExhYmVsLnNsaWNlKDAsIGlucHV0VmFsdWUubGVuZ3RoKS50b1VwcGVyQ2FzZSgpID09PSBpbnB1dFZhbHVlLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBoaW50SW5wdXRFbGVtLnZhbChpbnB1dFZhbHVlICsgZmlyc3RMYWJlbC5zbGljZShpbnB1dFZhbHVlLmxlbmd0aCkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhpbnRJbnB1dEVsZW0udmFsKCcnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNldE1hdGNoZXMoKTtcbiAgICAgICAgICAgIGlzTm9SZXN1bHRzU2V0dGVyKG9yaWdpbmFsU2NvcGUsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob25DdXJyZW50UmVxdWVzdCkge1xuICAgICAgICAgIGlzTG9hZGluZ1NldHRlcihvcmlnaW5hbFNjb3BlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNldE1hdGNoZXMoKTtcbiAgICAgICAgaXNMb2FkaW5nU2V0dGVyKG9yaWdpbmFsU2NvcGUsIGZhbHNlKTtcbiAgICAgICAgaXNOb1Jlc3VsdHNTZXR0ZXIob3JpZ2luYWxTY29wZSwgdHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gYmluZCBldmVudHMgb25seSBpZiBhcHBlbmRUb0JvZHkgcGFyYW1zIGV4aXN0IC0gcGVyZm9ybWFuY2UgZmVhdHVyZVxuICAgIGlmIChhcHBlbmRUb0JvZHkpIHtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5vbigncmVzaXplJywgZmlyZVJlY2FsY3VsYXRpbmcpO1xuICAgICAgJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5vbignc2Nyb2xsJywgZmlyZVJlY2FsY3VsYXRpbmcpO1xuICAgIH1cblxuICAgIC8vIERlY2xhcmUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiBvdXRzaWRlIHJlY2FsY3VsYXRpbmcgZm9yXG4gICAgLy8gcHJvcGVyIGRlYm91bmNpbmdcbiAgICB2YXIgZGVib3VuY2VkUmVjYWxjdWxhdGUgPSAkJGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gaWYgcG9wdXAgaXMgdmlzaWJsZVxuICAgICAgaWYgKHNjb3BlLm1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJlY2FsY3VsYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUubW92ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB9LCBldmVudERlYm91bmNlVGltZSk7XG5cbiAgICAvLyBEZWZhdWx0IHByb2dyZXNzIHR5cGVcbiAgICBzY29wZS5tb3ZlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gZmlyZVJlY2FsY3VsYXRpbmcoKSB7XG4gICAgICBpZiAoIXNjb3BlLm1vdmVJblByb2dyZXNzKSB7XG4gICAgICAgIHNjb3BlLm1vdmVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgfVxuXG4gICAgICBkZWJvdW5jZWRSZWNhbGN1bGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIHJlY2FsY3VsYXRlIGFjdHVhbCBwb3NpdGlvbiBhbmQgc2V0IG5ldyB2YWx1ZXMgdG8gc2NvcGVcbiAgICAvLyBhZnRlciBkaWdlc3QgbG9vcCBpcyBwb3B1cCBpbiByaWdodCBwb3NpdGlvblxuICAgIGZ1bmN0aW9uIHJlY2FsY3VsYXRlUG9zaXRpb24oKSB7XG4gICAgICBzY29wZS5wb3NpdGlvbiA9IGFwcGVuZFRvQm9keSA/ICRwb3NpdGlvbi5vZmZzZXQoZWxlbWVudCkgOiAkcG9zaXRpb24ucG9zaXRpb24oZWxlbWVudCk7XG4gICAgICBzY29wZS5wb3NpdGlvbi50b3AgKz0gZWxlbWVudC5wcm9wKCdvZmZzZXRIZWlnaHQnKTtcbiAgICB9XG5cbiAgICAvL3dlIG5lZWQgdG8gcHJvcGFnYXRlIHVzZXIncyBxdWVyeSBzbyB3ZSBjYW4gaGlnbGlnaHQgbWF0Y2hlc1xuICAgIHNjb3BlLnF1ZXJ5ID0gdW5kZWZpbmVkO1xuXG4gICAgLy9EZWNsYXJlIHRoZSB0aW1lb3V0IHByb21pc2UgdmFyIG91dHNpZGUgdGhlIGZ1bmN0aW9uIHNjb3BlIHNvIHRoYXQgc3RhY2tlZCBjYWxscyBjYW4gYmUgY2FuY2VsbGVkIGxhdGVyXG4gICAgdmFyIHRpbWVvdXRQcm9taXNlO1xuXG4gICAgdmFyIHNjaGVkdWxlU2VhcmNoV2l0aFRpbWVvdXQgPSBmdW5jdGlvbihpbnB1dFZhbHVlKSB7XG4gICAgICB0aW1lb3V0UHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBnZXRNYXRjaGVzQXN5bmMoaW5wdXRWYWx1ZSk7XG4gICAgICB9LCB3YWl0VGltZSk7XG4gICAgfTtcblxuICAgIHZhciBjYW5jZWxQcmV2aW91c1RpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aW1lb3V0UHJvbWlzZSkge1xuICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dFByb21pc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXNldE1hdGNoZXMoKTtcblxuICAgIHNjb3BlLmFzc2lnbklzT3BlbiA9IGZ1bmN0aW9uIChpc09wZW4pIHtcbiAgICAgIGlzT3BlblNldHRlcihvcmlnaW5hbFNjb3BlLCBpc09wZW4pO1xuICAgIH07XG5cbiAgICBzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihhY3RpdmVJZHgsIGV2dCkge1xuICAgICAgLy9jYWxsZWQgZnJvbSB3aXRoaW4gdGhlICRkaWdlc3QoKSBjeWNsZVxuICAgICAgdmFyIGxvY2FscyA9IHt9O1xuICAgICAgdmFyIG1vZGVsLCBpdGVtO1xuXG4gICAgICBzZWxlY3RlZCA9IHRydWU7XG4gICAgICBsb2NhbHNbcGFyc2VyUmVzdWx0Lml0ZW1OYW1lXSA9IGl0ZW0gPSBzY29wZS5tYXRjaGVzW2FjdGl2ZUlkeF0ubW9kZWw7XG4gICAgICBtb2RlbCA9IHBhcnNlclJlc3VsdC5tb2RlbE1hcHBlcihvcmlnaW5hbFNjb3BlLCBsb2NhbHMpO1xuICAgICAgJHNldE1vZGVsVmFsdWUob3JpZ2luYWxTY29wZSwgbW9kZWwpO1xuICAgICAgbW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgnZWRpdGFibGUnLCB0cnVlKTtcbiAgICAgIG1vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ3BhcnNlJywgdHJ1ZSk7XG5cbiAgICAgIG9uU2VsZWN0Q2FsbGJhY2sob3JpZ2luYWxTY29wZSwge1xuICAgICAgICAkaXRlbTogaXRlbSxcbiAgICAgICAgJG1vZGVsOiBtb2RlbCxcbiAgICAgICAgJGxhYmVsOiBwYXJzZXJSZXN1bHQudmlld01hcHBlcihvcmlnaW5hbFNjb3BlLCBsb2NhbHMpLFxuICAgICAgICAkZXZlbnQ6IGV2dFxuICAgICAgfSk7XG5cbiAgICAgIHJlc2V0TWF0Y2hlcygpO1xuXG4gICAgICAvL3JldHVybiBmb2N1cyB0byB0aGUgaW5wdXQgZWxlbWVudCBpZiBhIG1hdGNoIHdhcyBzZWxlY3RlZCB2aWEgYSBtb3VzZSBjbGljayBldmVudFxuICAgICAgLy8gdXNlIHRpbWVvdXQgdG8gYXZvaWQgJHJvb3RTY29wZTppbnByb2cgZXJyb3JcbiAgICAgIGlmIChzY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRGb2N1c09uU2VsZWN0KSAhPT0gZmFsc2UpIHtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7IGVsZW1lbnRbMF0uZm9jdXMoKTsgfSwgMCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvL2JpbmQga2V5Ym9hcmQgZXZlbnRzOiBhcnJvd3MgdXAoMzgpIC8gZG93big0MCksIGVudGVyKDEzKSBhbmQgdGFiKDkpLCBlc2MoMjcpXG4gICAgZWxlbWVudC5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgLy90eXBlYWhlYWQgaXMgb3BlbiBhbmQgYW4gXCJpbnRlcmVzdGluZ1wiIGtleSB3YXMgcHJlc3NlZFxuICAgICAgaWYgKHNjb3BlLm1hdGNoZXMubGVuZ3RoID09PSAwIHx8IEhPVF9LRVlTLmluZGV4T2YoZXZ0LndoaWNoKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGVyZSdzIG5vdGhpbmcgc2VsZWN0ZWQgKGkuZS4gZm9jdXNGaXJzdCkgYW5kIGVudGVyIG9yIHRhYiBpcyBoaXQsIGNsZWFyIHRoZSByZXN1bHRzXG4gICAgICBpZiAoc2NvcGUuYWN0aXZlSWR4ID09PSAtMSAmJiAoZXZ0LndoaWNoID09PSA5IHx8IGV2dC53aGljaCA9PT0gMTMpKSB7XG4gICAgICAgIHJlc2V0TWF0Y2hlcygpO1xuICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdGFyZ2V0O1xuICAgICAgc3dpdGNoIChldnQud2hpY2gpIHtcbiAgICAgICAgY2FzZSA5OlxuICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihzY29wZS5kZWJvdW5jZVVwZGF0ZSkgfHwgYW5ndWxhci5pc09iamVjdChzY29wZS5kZWJvdW5jZVVwZGF0ZSkpIHtcbiAgICAgICAgICAgICAgJCRkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3Qoc2NvcGUuYWN0aXZlSWR4LCBldnQpO1xuICAgICAgICAgICAgICB9LCBhbmd1bGFyLmlzTnVtYmVyKHNjb3BlLmRlYm91bmNlVXBkYXRlKSA/IHNjb3BlLmRlYm91bmNlVXBkYXRlIDogc2NvcGUuZGVib3VuY2VVcGRhdGVbJ2RlZmF1bHQnXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzY29wZS5zZWxlY3Qoc2NvcGUuYWN0aXZlSWR4LCBldnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgIHJlc2V0TWF0Y2hlcygpO1xuICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICBzY29wZS5hY3RpdmVJZHggPSAoc2NvcGUuYWN0aXZlSWR4ID4gMCA/IHNjb3BlLmFjdGl2ZUlkeCA6IHNjb3BlLm1hdGNoZXMubGVuZ3RoKSAtIDE7XG4gICAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgIHRhcmdldCA9IHBvcFVwRWwuZmluZCgnbGknKVtzY29wZS5hY3RpdmVJZHhdO1xuICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLnNjcm9sbFRvcCA9IHRhcmdldC5vZmZzZXRUb3A7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgc2NvcGUuYWN0aXZlSWR4ID0gKHNjb3BlLmFjdGl2ZUlkeCArIDEpICUgc2NvcGUubWF0Y2hlcy5sZW5ndGg7XG4gICAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgIHRhcmdldCA9IHBvcFVwRWwuZmluZCgnbGknKVtzY29wZS5hY3RpdmVJZHhdO1xuICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLnNjcm9sbFRvcCA9IHRhcmdldC5vZmZzZXRUb3A7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBlbGVtZW50LmJpbmQoJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaGFzRm9jdXMgPSB0cnVlO1xuICAgICAgaWYgKG1pbkxlbmd0aCA9PT0gMCAmJiAhbW9kZWxDdHJsLiR2aWV3VmFsdWUpIHtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ2V0TWF0Y2hlc0FzeW5jKG1vZGVsQ3RybC4kdmlld1ZhbHVlLCBldnQpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGVsZW1lbnQuYmluZCgnYmx1cicsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgaWYgKGlzU2VsZWN0T25CbHVyICYmIHNjb3BlLm1hdGNoZXMubGVuZ3RoICYmIHNjb3BlLmFjdGl2ZUlkeCAhPT0gLTEgJiYgIXNlbGVjdGVkKSB7XG4gICAgICAgIHNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHNjb3BlLmRlYm91bmNlVXBkYXRlKSAmJiBhbmd1bGFyLmlzTnVtYmVyKHNjb3BlLmRlYm91bmNlVXBkYXRlLmJsdXIpKSB7XG4gICAgICAgICAgICAkJGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBzY29wZS5zZWxlY3Qoc2NvcGUuYWN0aXZlSWR4LCBldnQpO1xuICAgICAgICAgICAgfSwgc2NvcGUuZGVib3VuY2VVcGRhdGUuYmx1cik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdChzY29wZS5hY3RpdmVJZHgsIGV2dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNFZGl0YWJsZSAmJiBtb2RlbEN0cmwuJGVycm9yLmVkaXRhYmxlKSB7XG4gICAgICAgIG1vZGVsQ3RybC4kdmlld1ZhbHVlID0gJyc7XG4gICAgICAgIGVsZW1lbnQudmFsKCcnKTtcbiAgICAgIH1cbiAgICAgIGhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICBzZWxlY3RlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gS2VlcCByZWZlcmVuY2UgdG8gY2xpY2sgaGFuZGxlciB0byB1bmJpbmQgaXQuXG4gICAgdmFyIGRpc21pc3NDbGlja0hhbmRsZXIgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgIC8vIElzc3VlICMzOTczXG4gICAgICAvLyBGaXJlZm94IHRyZWF0cyByaWdodCBjbGljayBhcyBhIGNsaWNrIG9uIGRvY3VtZW50XG4gICAgICBpZiAoZWxlbWVudFswXSAhPT0gZXZ0LnRhcmdldCAmJiBldnQud2hpY2ggIT09IDMgJiYgc2NvcGUubWF0Y2hlcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgcmVzZXRNYXRjaGVzKCk7XG4gICAgICAgIGlmICghJHJvb3RTY29wZS4kJHBoYXNlKSB7XG4gICAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgICRkb2N1bWVudC5vbignY2xpY2snLCBkaXNtaXNzQ2xpY2tIYW5kbGVyKTtcblxuICAgIG9yaWdpbmFsU2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBkaXNtaXNzQ2xpY2tIYW5kbGVyKTtcbiAgICAgIGlmIChhcHBlbmRUb0JvZHkgfHwgYXBwZW5kVG8pIHtcbiAgICAgICAgJHBvcHVwLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXBwZW5kVG9Cb2R5KSB7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5vZmYoJ3Jlc2l6ZScsIGZpcmVSZWNhbGN1bGF0aW5nKTtcbiAgICAgICAgJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5vZmYoJ3Njcm9sbCcsIGZpcmVSZWNhbGN1bGF0aW5nKTtcbiAgICAgIH1cbiAgICAgIC8vIFByZXZlbnQgalF1ZXJ5IGNhY2hlIG1lbW9yeSBsZWFrXG4gICAgICBwb3BVcEVsLnJlbW92ZSgpO1xuXG4gICAgICBpZiAoc2hvd0hpbnQpIHtcbiAgICAgICAgICBpbnB1dHNDb250YWluZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgJHBvcHVwID0gJGNvbXBpbGUocG9wVXBFbCkoc2NvcGUpO1xuXG4gICAgaWYgKGFwcGVuZFRvQm9keSkge1xuICAgICAgJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5hcHBlbmQoJHBvcHVwKTtcbiAgICB9IGVsc2UgaWYgKGFwcGVuZFRvKSB7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoYXBwZW5kVG8pLmVxKDApLmFwcGVuZCgkcG9wdXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmFmdGVyKCRwb3B1cCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oX21vZGVsQ3RybCwgX25nTW9kZWxPcHRpb25zKSB7XG4gICAgICBtb2RlbEN0cmwgPSBfbW9kZWxDdHJsO1xuICAgICAgbmdNb2RlbE9wdGlvbnMgPSBfbmdNb2RlbE9wdGlvbnM7XG5cbiAgICAgIHNjb3BlLmRlYm91bmNlVXBkYXRlID0gbW9kZWxDdHJsLiRvcHRpb25zICYmICRwYXJzZShtb2RlbEN0cmwuJG9wdGlvbnMuZGVib3VuY2UpKG9yaWdpbmFsU2NvcGUpO1xuXG4gICAgICAvL3BsdWcgaW50byAkcGFyc2VycyBwaXBlbGluZSB0byBvcGVuIGEgdHlwZWFoZWFkIG9uIHZpZXcgY2hhbmdlcyBpbml0aWF0ZWQgZnJvbSBET01cbiAgICAgIC8vJHBhcnNlcnMga2ljay1pbiBvbiBhbGwgdGhlIGNoYW5nZXMgY29taW5nIGZyb20gdGhlIHZpZXcgYXMgd2VsbCBhcyBtYW51YWxseSB0cmlnZ2VyZWQgYnkgJHNldFZpZXdWYWx1ZVxuICAgICAgbW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQoZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgICBoYXNGb2N1cyA9IHRydWU7XG5cbiAgICAgICAgaWYgKG1pbkxlbmd0aCA9PT0gMCB8fCBpbnB1dFZhbHVlICYmIGlucHV0VmFsdWUubGVuZ3RoID49IG1pbkxlbmd0aCkge1xuICAgICAgICAgIGlmICh3YWl0VGltZSA+IDApIHtcbiAgICAgICAgICAgIGNhbmNlbFByZXZpb3VzVGltZW91dCgpO1xuICAgICAgICAgICAgc2NoZWR1bGVTZWFyY2hXaXRoVGltZW91dChpbnB1dFZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0TWF0Y2hlc0FzeW5jKGlucHV0VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc0xvYWRpbmdTZXR0ZXIob3JpZ2luYWxTY29wZSwgZmFsc2UpO1xuICAgICAgICAgIGNhbmNlbFByZXZpb3VzVGltZW91dCgpO1xuICAgICAgICAgIHJlc2V0TWF0Y2hlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICAgICAgICByZXR1cm4gaW5wdXRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaW5wdXRWYWx1ZSkge1xuICAgICAgICAgIC8vIFJlc2V0IGluIGNhc2UgdXNlciBoYWQgdHlwZWQgc29tZXRoaW5nIHByZXZpb3VzbHkuXG4gICAgICAgICAgbW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgnZWRpdGFibGUnLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ2VkaXRhYmxlJywgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSk7XG5cbiAgICAgIG1vZGVsQ3RybC4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgdmFyIGNhbmRpZGF0ZVZpZXdWYWx1ZSwgZW1wdHlWaWV3VmFsdWU7XG4gICAgICAgIHZhciBsb2NhbHMgPSB7fTtcblxuICAgICAgICAvLyBUaGUgdmFsaWRpdHkgbWF5IGJlIHNldCB0byBmYWxzZSB2aWEgJHBhcnNlcnMgKHNlZSBhYm92ZSkgaWZcbiAgICAgICAgLy8gdGhlIG1vZGVsIGlzIHJlc3RyaWN0ZWQgdG8gc2VsZWN0ZWQgdmFsdWVzLiBJZiB0aGUgbW9kZWxcbiAgICAgICAgLy8gaXMgc2V0IG1hbnVhbGx5IGl0IGlzIGNvbnNpZGVyZWQgdG8gYmUgdmFsaWQuXG4gICAgICAgIGlmICghaXNFZGl0YWJsZSkge1xuICAgICAgICAgIG1vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ2VkaXRhYmxlJywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5wdXRGb3JtYXR0ZXIpIHtcbiAgICAgICAgICBsb2NhbHMuJG1vZGVsID0gbW9kZWxWYWx1ZTtcbiAgICAgICAgICByZXR1cm4gaW5wdXRGb3JtYXR0ZXIob3JpZ2luYWxTY29wZSwgbG9jYWxzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaXQgbWlnaHQgaGFwcGVuIHRoYXQgd2UgZG9uJ3QgaGF2ZSBlbm91Z2ggaW5mbyB0byBwcm9wZXJseSByZW5kZXIgaW5wdXQgdmFsdWVcbiAgICAgICAgLy93ZSBuZWVkIHRvIGNoZWNrIGZvciB0aGlzIHNpdHVhdGlvbiBhbmQgc2ltcGx5IHJldHVybiBtb2RlbCB2YWx1ZSBpZiB3ZSBjYW4ndCBhcHBseSBjdXN0b20gZm9ybWF0dGluZ1xuICAgICAgICBsb2NhbHNbcGFyc2VyUmVzdWx0Lml0ZW1OYW1lXSA9IG1vZGVsVmFsdWU7XG4gICAgICAgIGNhbmRpZGF0ZVZpZXdWYWx1ZSA9IHBhcnNlclJlc3VsdC52aWV3TWFwcGVyKG9yaWdpbmFsU2NvcGUsIGxvY2Fscyk7XG4gICAgICAgIGxvY2Fsc1twYXJzZXJSZXN1bHQuaXRlbU5hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICBlbXB0eVZpZXdWYWx1ZSA9IHBhcnNlclJlc3VsdC52aWV3TWFwcGVyKG9yaWdpbmFsU2NvcGUsIGxvY2Fscyk7XG5cbiAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZVZpZXdWYWx1ZSAhPT0gZW1wdHlWaWV3VmFsdWUgPyBjYW5kaWRhdGVWaWV3VmFsdWUgOiBtb2RlbFZhbHVlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfV0pXG5cbiAgLmRpcmVjdGl2ZSgndWliVHlwZWFoZWFkJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRyb2xsZXI6ICdVaWJUeXBlYWhlYWRDb250cm9sbGVyJyxcbiAgICAgIHJlcXVpcmU6IFsnbmdNb2RlbCcsICdeP25nTW9kZWxPcHRpb25zJywgJ3VpYlR5cGVhaGVhZCddLFxuICAgICAgbGluazogZnVuY3Rpb24ob3JpZ2luYWxTY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICAgIGN0cmxzWzJdLmluaXQoY3RybHNbMF0sIGN0cmxzWzFdKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuXG4gIC5kaXJlY3RpdmUoJ3VpYlR5cGVhaGVhZFBvcHVwJywgWyckJGRlYm91bmNlJywgZnVuY3Rpb24oJCRkZWJvdW5jZSkge1xuICAgIHJldHVybiB7XG4gICAgICBzY29wZToge1xuICAgICAgICBtYXRjaGVzOiAnPScsXG4gICAgICAgIHF1ZXJ5OiAnPScsXG4gICAgICAgIGFjdGl2ZTogJz0nLFxuICAgICAgICBwb3NpdGlvbjogJyYnLFxuICAgICAgICBtb3ZlSW5Qcm9ncmVzczogJz0nLFxuICAgICAgICBzZWxlY3Q6ICcmJyxcbiAgICAgICAgYXNzaWduSXNPcGVuOiAnJicsXG4gICAgICAgIGRlYm91bmNlOiAnJidcbiAgICAgIH0sXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHJldHVybiBhdHRycy5wb3B1cFRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvdHlwZWFoZWFkL3R5cGVhaGVhZC1wb3B1cC5odG1sJztcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgc2NvcGUudGVtcGxhdGVVcmwgPSBhdHRycy50ZW1wbGF0ZVVybDtcblxuICAgICAgICBzY29wZS5pc09wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgaXNEcm9wZG93bk9wZW4gPSBzY29wZS5tYXRjaGVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgc2NvcGUuYXNzaWduSXNPcGVuKHsgaXNPcGVuOiBpc0Ryb3Bkb3duT3BlbiB9KTtcbiAgICAgICAgICByZXR1cm4gaXNEcm9wZG93bk9wZW47XG4gICAgICAgIH07XG5cbiAgICAgICAgc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbihtYXRjaElkeCkge1xuICAgICAgICAgIHJldHVybiBzY29wZS5hY3RpdmUgPT09IG1hdGNoSWR4O1xuICAgICAgICB9O1xuXG4gICAgICAgIHNjb3BlLnNlbGVjdEFjdGl2ZSA9IGZ1bmN0aW9uKG1hdGNoSWR4KSB7XG4gICAgICAgICAgc2NvcGUuYWN0aXZlID0gbWF0Y2hJZHg7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2NvcGUuc2VsZWN0TWF0Y2ggPSBmdW5jdGlvbihhY3RpdmVJZHgsIGV2dCkge1xuICAgICAgICAgIHZhciBkZWJvdW5jZSA9IHNjb3BlLmRlYm91bmNlKCk7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoZGVib3VuY2UpIHx8IGFuZ3VsYXIuaXNPYmplY3QoZGVib3VuY2UpKSB7XG4gICAgICAgICAgICAkJGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBzY29wZS5zZWxlY3Qoe2FjdGl2ZUlkeDogYWN0aXZlSWR4LCBldnQ6IGV2dH0pO1xuICAgICAgICAgICAgfSwgYW5ndWxhci5pc051bWJlcihkZWJvdW5jZSkgPyBkZWJvdW5jZSA6IGRlYm91bmNlWydkZWZhdWx0J10pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY29wZS5zZWxlY3Qoe2FjdGl2ZUlkeDogYWN0aXZlSWR4LCBldnQ6IGV2dH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSlcblxuICAuZGlyZWN0aXZlKCd1aWJUeXBlYWhlYWRNYXRjaCcsIFsnJHRlbXBsYXRlUmVxdWVzdCcsICckY29tcGlsZScsICckcGFyc2UnLCBmdW5jdGlvbigkdGVtcGxhdGVSZXF1ZXN0LCAkY29tcGlsZSwgJHBhcnNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGluZGV4OiAnPScsXG4gICAgICAgIG1hdGNoOiAnPScsXG4gICAgICAgIHF1ZXJ5OiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIHRwbFVybCA9ICRwYXJzZShhdHRycy50ZW1wbGF0ZVVybCkoc2NvcGUuJHBhcmVudCkgfHwgJ3VpYi90ZW1wbGF0ZS90eXBlYWhlYWQvdHlwZWFoZWFkLW1hdGNoLmh0bWwnO1xuICAgICAgICAkdGVtcGxhdGVSZXF1ZXN0KHRwbFVybCkudGhlbihmdW5jdGlvbih0cGxDb250ZW50KSB7XG4gICAgICAgICAgdmFyIHRwbEVsID0gYW5ndWxhci5lbGVtZW50KHRwbENvbnRlbnQudHJpbSgpKTtcbiAgICAgICAgICBlbGVtZW50LnJlcGxhY2VXaXRoKHRwbEVsKTtcbiAgICAgICAgICAkY29tcGlsZSh0cGxFbCkoc2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSlcblxuICAuZmlsdGVyKCd1aWJUeXBlYWhlYWRIaWdobGlnaHQnLCBbJyRzY2UnLCAnJGluamVjdG9yJywgJyRsb2cnLCBmdW5jdGlvbigkc2NlLCAkaW5qZWN0b3IsICRsb2cpIHtcbiAgICB2YXIgaXNTYW5pdGl6ZVByZXNlbnQ7XG4gICAgaXNTYW5pdGl6ZVByZXNlbnQgPSAkaW5qZWN0b3IuaGFzKCckc2FuaXRpemUnKTtcblxuICAgIGZ1bmN0aW9uIGVzY2FwZVJlZ2V4cChxdWVyeVRvRXNjYXBlKSB7XG4gICAgICAvLyBSZWdleDogY2FwdHVyZSB0aGUgd2hvbGUgcXVlcnkgc3RyaW5nIGFuZCByZXBsYWNlIGl0IHdpdGggdGhlIHN0cmluZyB0aGF0IHdpbGwgYmUgdXNlZCB0byBtYXRjaFxuICAgICAgLy8gdGhlIHJlc3VsdHMsIGZvciBleGFtcGxlIGlmIHRoZSBjYXB0dXJlIGlzIFwiYVwiIHRoZSByZXN1bHQgd2lsbCBiZSBcXGFcbiAgICAgIHJldHVybiBxdWVyeVRvRXNjYXBlLnJlcGxhY2UoLyhbLj8qK14kW1xcXVxcXFwoKXt9fC1dKS9nLCAnXFxcXCQxJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udGFpbnNIdG1sKG1hdGNoSXRlbSkge1xuICAgICAgcmV0dXJuIC88Lio+L2cudGVzdChtYXRjaEl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihtYXRjaEl0ZW0sIHF1ZXJ5KSB7XG4gICAgICBpZiAoIWlzU2FuaXRpemVQcmVzZW50ICYmIGNvbnRhaW5zSHRtbChtYXRjaEl0ZW0pKSB7XG4gICAgICAgICRsb2cud2FybignVW5zYWZlIHVzZSBvZiB0eXBlYWhlYWQgcGxlYXNlIHVzZSBuZ1Nhbml0aXplJyk7IC8vIFdhcm4gdGhlIHVzZXIgYWJvdXQgdGhlIGRhbmdlclxuICAgICAgfVxuICAgICAgbWF0Y2hJdGVtID0gcXVlcnkgPyAoJycgKyBtYXRjaEl0ZW0pLnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdleHAocXVlcnkpLCAnZ2knKSwgJzxzdHJvbmc+JCY8L3N0cm9uZz4nKSA6IG1hdGNoSXRlbTsgLy8gUmVwbGFjZXMgdGhlIGNhcHR1cmUgc3RyaW5nIHdpdGggYSB0aGUgc2FtZSBzdHJpbmcgaW5zaWRlIG9mIGEgXCJzdHJvbmdcIiB0YWdcbiAgICAgIGlmICghaXNTYW5pdGl6ZVByZXNlbnQpIHtcbiAgICAgICAgbWF0Y2hJdGVtID0gJHNjZS50cnVzdEFzSHRtbChtYXRjaEl0ZW0pOyAvLyBJZiAkc2FuaXRpemUgaXMgbm90IHByZXNlbnQgd2UgcGFjayB0aGUgc3RyaW5nIGluIGEgJHNjZSBvYmplY3QgZm9yIHRoZSBuZy1iaW5kLWh0bWwgZGlyZWN0aXZlXG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2hJdGVtO1xuICAgIH07XG4gIH1dKTtcbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAuY2Fyb3VzZWwnKS5ydW4oZnVuY3Rpb24oKSB7IWFuZ3VsYXIuJCRjc3AoKS5ub0lubGluZVN0eWxlICYmIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnaGVhZCcpLnByZXBlbmQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4ubmctYW5pbWF0ZS5pdGVtOm5vdCgubGVmdCk6bm90KC5yaWdodCl7LXdlYmtpdC10cmFuc2l0aW9uOjBzIGVhc2UtaW4tb3V0IGxlZnQ7dHJhbnNpdGlvbjowcyBlYXNlLWluLW91dCBsZWZ0fTwvc3R5bGU+Jyk7IH0pO1xuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5kYXRlcGlja2VyJykucnVuKGZ1bmN0aW9uKCkgeyFhbmd1bGFyLiQkY3NwKCkubm9JbmxpbmVTdHlsZSAmJiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2hlYWQnKS5wcmVwZW5kKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+LnVpYi1kYXRlcGlja2VyIC51aWItdGl0bGV7d2lkdGg6MTAwJTt9LnVpYi1kYXkgYnV0dG9uLC51aWItbW9udGggYnV0dG9uLC51aWIteWVhciBidXR0b257bWluLXdpZHRoOjEwMCU7fS51aWItZGF0ZXBpY2tlci1wb3B1cC5kcm9wZG93bi1tZW51e2Rpc3BsYXk6YmxvY2s7fS51aWItYnV0dG9uLWJhcntwYWRkaW5nOjEwcHggOXB4IDJweDt9PC9zdHlsZT4nKTsgfSk7XG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnRpbWVwaWNrZXInKS5ydW4oZnVuY3Rpb24oKSB7IWFuZ3VsYXIuJCRjc3AoKS5ub0lubGluZVN0eWxlICYmIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnaGVhZCcpLnByZXBlbmQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4udWliLXRpbWUgaW5wdXR7d2lkdGg6NTBweDt9PC9zdHlsZT4nKTsgfSk7XG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnR5cGVhaGVhZCcpLnJ1bihmdW5jdGlvbigpIHshYW5ndWxhci4kJGNzcCgpLm5vSW5saW5lU3R5bGUgJiYgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdoZWFkJykucHJlcGVuZCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlt1aWItdHlwZWFoZWFkLXBvcHVwXS5kcm9wZG93bi1tZW51e2Rpc3BsYXk6YmxvY2s7fTwvc3R5bGU+Jyk7IH0pO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJSaDRUcHlcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2E3OTVkOTI0LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJSaDRUcHlcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiUmg0VHB5XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzXCIsXCIvLi4vLi4vZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJSaDRUcHlcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiUmg0VHB5XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiXX0=
