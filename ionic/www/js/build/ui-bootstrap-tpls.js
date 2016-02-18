(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 1.1.2 - 2016-02-01
 * License: MIT
 */angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.isClass","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.debounce","ui.bootstrap.dropdown","ui.bootstrap.stackedMap","ui.bootstrap.modal","ui.bootstrap.paging","ui.bootstrap.pager","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module("ui.bootstrap.tpls", ["uib/template/accordion/accordion-group.html","uib/template/accordion/accordion.html","uib/template/alert/alert.html","uib/template/carousel/carousel.html","uib/template/carousel/slide.html","uib/template/datepicker/datepicker.html","uib/template/datepicker/day.html","uib/template/datepicker/month.html","uib/template/datepicker/popup.html","uib/template/datepicker/year.html","uib/template/modal/backdrop.html","uib/template/modal/window.html","uib/template/pager/pager.html","uib/template/pagination/pagination.html","uib/template/tooltip/tooltip-html-popup.html","uib/template/tooltip/tooltip-popup.html","uib/template/tooltip/tooltip-template-popup.html","uib/template/popover/popover-html.html","uib/template/popover/popover-template.html","uib/template/popover/popover.html","uib/template/progressbar/bar.html","uib/template/progressbar/progress.html","uib/template/progressbar/progressbar.html","uib/template/rating/rating.html","uib/template/tabs/tab.html","uib/template/tabs/tabset.html","uib/template/timepicker/timepicker.html","uib/template/typeahead/typeahead-match.html","uib/template/typeahead/typeahead-popup.html"]);
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

angular.module("uib/template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/accordion/accordion-group.html",
    "<div class=\"panel\" ng-class=\"panelClass || 'panel-default'\">\n" +
    "  <div role=\"tab\" id=\"{{::headingId}}\" aria-selected=\"{{isOpen}}\" class=\"panel-heading\" ng-keypress=\"toggleOpen($event)\">\n" +
    "    <h4 class=\"panel-title\">\n" +
    "      <a role=\"button\" data-toggle=\"collapse\" href aria-expanded=\"{{isOpen}}\" aria-controls=\"{{::panelId}}\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" uib-accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "  <div id=\"{{::panelId}}\" aria-labelledby=\"{{::headingId}}\" aria-hidden=\"{{!isOpen}}\" role=\"tabpanel\" class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
    "    <div class=\"panel-body\" ng-transclude></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/accordion/accordion.html",
    "<div role=\"tablist\" class=\"panel-group\" ng-transclude></div>");
}]);

angular.module("uib/template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/alert/alert.html",
    "<div class=\"alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">\n" +
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"close({$event: $event})\">\n" +
    "        <span aria-hidden=\"true\">&times;</span>\n" +
    "        <span class=\"sr-only\">Close</span>\n" +
    "    </button>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/carousel/carousel.html",
    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\">\n" +
    "  <div class=\"carousel-inner\" ng-transclude></div>\n" +
    "  <a role=\"button\" href class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\">\n" +
    "    <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></span>\n" +
    "    <span class=\"sr-only\">previous</span>\n" +
    "  </a>\n" +
    "  <a role=\"button\" href class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\">\n" +
    "    <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "    <span class=\"sr-only\">next</span>\n" +
    "  </a>\n" +
    "  <ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
    "    <li ng-repeat=\"slide in slides | orderBy:indexOfSlide track by $index\" ng-class=\"{ active: isActive(slide) }\" ng-click=\"select(slide)\">\n" +
    "      <span class=\"sr-only\">slide {{ $index + 1 }} of {{ slides.length }}<span ng-if=\"isActive(slide)\">, currently active</span></span>\n" +
    "    </li>\n" +
    "  </ol>\n" +
    "</div>");
}]);

angular.module("uib/template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/carousel/slide.html",
    "<div ng-class=\"{\n" +
    "    'active': active\n" +
    "  }\" class=\"item text-center\" ng-transclude></div>\n" +
    "");
}]);

angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/datepicker.html",
    "<div class=\"uib-datepicker\" ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
    "  <uib-daypicker ng-switch-when=\"day\" tabindex=\"0\"></uib-daypicker>\n" +
    "  <uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\"></uib-monthpicker>\n" +
    "  <uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\"></uib-yearpicker>\n" +
    "</div>");
}]);

angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/day.html",
    "<table class=\"uib-daypicker\" role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/month.html",
    "<table class=\"uib-monthpicker\" role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/popup.html",
    "<div>\n" +
    "  <ul class=\"uib-datepicker-popup dropdown-menu\" dropdown-nested ng-if=\"isOpen\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
    "    <li ng-transclude></li>\n" +
    "    <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
    "    <span class=\"btn-group pull-left\">\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today')\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
    "    </span>\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/year.html",
    "<table class=\"uib-yearpicker\" role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/modal/backdrop.html",
    "<div class=\"modal-backdrop\"\n" +
    "     uib-modal-animation-class=\"fade\"\n" +
    "     modal-in-class=\"in\"\n" +
    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
    "></div>\n" +
    "");
}]);

angular.module("uib/template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/modal/window.html",
    "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal\"\n" +
    "    uib-modal-animation-class=\"fade\"\n" +
    "    modal-in-class=\"in\"\n" +
    "    ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\">\n" +
    "    <div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/pager/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/pager/pager.html",
    "<ul class=\"pager\">\n" +
    "  <li ng-class=\"{disabled: noPrevious()||ngDisabled, previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-class=\"{disabled: noNext()||ngDisabled, next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/pagination/pagination.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\">{{::getText('first')}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\">{{::getText('last')}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("uib/template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-html-popup.html",
    "<div class=\"tooltip\"\n" +
    "  tooltip-animation-class=\"fade\"\n" +
    "  uib-tooltip-classes\n" +
    "  ng-class=\"{ in: isOpen() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" ng-bind-html=\"contentExp()\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-popup.html",
    "<div class=\"tooltip\"\n" +
    "  tooltip-animation-class=\"fade\"\n" +
    "  uib-tooltip-classes\n" +
    "  ng-class=\"{ in: isOpen() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-template-popup.html",
    "<div class=\"tooltip\"\n" +
    "  tooltip-animation-class=\"fade\"\n" +
    "  uib-tooltip-classes\n" +
    "  ng-class=\"{ in: isOpen() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\"\n" +
    "    uib-tooltip-template-transclude=\"contentExp()\"\n" +
    "    tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/popover/popover-html.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/popover/popover-html.html",
    "<div class=\"popover\"\n" +
    "  tooltip-animation-class=\"fade\"\n" +
    "  uib-tooltip-classes\n" +
    "  ng-class=\"{ in: isOpen() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" ng-bind-html=\"contentExp()\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/popover/popover-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/popover/popover-template.html",
    "<div class=\"popover\"\n" +
    "  tooltip-animation-class=\"fade\"\n" +
    "  uib-tooltip-classes\n" +
    "  ng-class=\"{ in: isOpen() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
    "      <div class=\"popover-content\"\n" +
    "        uib-tooltip-template-transclude=\"contentExp()\"\n" +
    "        tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/popover/popover.html",
    "<div class=\"popover\"\n" +
    "  tooltip-animation-class=\"fade\"\n" +
    "  uib-tooltip-classes\n" +
    "  ng-class=\"{ in: isOpen() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/progressbar/bar.html",
    "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" ng-transclude></div>\n" +
    "");
}]);

angular.module("uib/template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/progressbar/progress.html",
    "<div class=\"progress\" ng-transclude aria-labelledby=\"{{::title}}\"></div>");
}]);

angular.module("uib/template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/progressbar/progressbar.html",
    "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\">\n" +
    "    <span ng-repeat-start=\"r in range track by $index\" class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
    "    <i ng-repeat-end ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"glyphicon\" ng-class=\"$index < value && (r.stateOn || 'glyphicon-star') || (r.stateOff || 'glyphicon-star-empty')\" ng-attr-title=\"{{r.title}}\" aria-valuetext=\"{{r.title}}\"></i>\n" +
    "</span>\n" +
    "");
}]);

angular.module("uib/template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tabs/tab.html",
    "<li ng-class=\"{active: active, disabled: disabled}\" class=\"uib-tab\">\n" +
    "  <a href ng-click=\"select()\" uib-tab-heading-transclude>{{heading}}</a>\n" +
    "</li>\n" +
    "");
}]);

angular.module("uib/template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tabs/tabset.html",
    "<div>\n" +
    "  <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane\" \n" +
    "         ng-repeat=\"tab in tabs\" \n" +
    "         ng-class=\"{active: tab.active}\"\n" +
    "         uib-tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/timepicker/timepicker.html",
    "<table class=\"uib-timepicker\">\n" +
    "  <tbody>\n" +
    "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
    "      <td class=\"uib-increment hours\"><a ng-click=\"incrementHours()\" ng-class=\"{disabled: noIncrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementHours()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "      <td>&nbsp;</td>\n" +
    "      <td class=\"uib-increment minutes\"><a ng-click=\"incrementMinutes()\" ng-class=\"{disabled: noIncrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementMinutes()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "      <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
    "      <td ng-show=\"showSeconds\" class=\"uib-increment seconds\"><a ng-click=\"incrementSeconds()\" ng-class=\"{disabled: noIncrementSeconds()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementSeconds()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "      <td ng-show=\"showMeridian\"></td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <td class=\"form-group uib-time hours\" ng-class=\"{'has-error': invalidHours}\">\n" +
    "        <input style=\"width:50px;\" type=\"text\" placeholder=\"HH\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementHours()\" ng-blur=\"blur()\">\n" +
    "      </td>\n" +
    "      <td class=\"uib-separator\">:</td>\n" +
    "      <td class=\"form-group uib-time minutes\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
    "        <input style=\"width:50px;\" type=\"text\" placeholder=\"MM\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementMinutes()\" ng-blur=\"blur()\">\n" +
    "      </td>\n" +
    "      <td ng-show=\"showSeconds\" class=\"uib-separator\">:</td>\n" +
    "      <td class=\"form-group uib-time seconds\" ng-class=\"{'has-error': invalidSeconds}\" ng-show=\"showSeconds\">\n" +
    "        <input style=\"width:50px;\" type=\"text\" placeholder=\"SS\" ng-model=\"seconds\" ng-change=\"updateSeconds()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementSeconds()\" ng-blur=\"blur()\">\n" +
    "      </td>\n" +
    "      <td ng-show=\"showMeridian\" class=\"uib-time am-pm\"><button type=\"button\" ng-class=\"{disabled: noToggleMeridian()}\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\" ng-disabled=\"noToggleMeridian()\" tabindex=\"{{::tabindex}}\">{{meridian}}</button></td>\n" +
    "    </tr>\n" +
    "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
    "      <td class=\"uib-decrement hours\"><a ng-click=\"decrementHours()\" ng-class=\"{disabled: noDecrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementHours()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "      <td>&nbsp;</td>\n" +
    "      <td class=\"uib-decrement minutes\"><a ng-click=\"decrementMinutes()\" ng-class=\"{disabled: noDecrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementMinutes()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "      <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
    "      <td ng-show=\"showSeconds\" class=\"uib-decrement seconds\"><a ng-click=\"decrementSeconds()\" ng-class=\"{disabled: noDecrementSeconds()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementSeconds()\" tabindex=\"{{::tabindex}}\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "      <td ng-show=\"showMeridian\"></td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/typeahead/typeahead-match.html",
    "<a href\n" +
    "   tabindex=\"-1\"\n" +
    "   ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"\n" +
    "   ng-attr-title=\"{{match.label}}\"></a>\n" +
    "");
}]);

angular.module("uib/template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index, $event)\" role=\"option\" id=\"{{::match.id}}\">\n" +
    "        <div uib-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
angular.module('ui.bootstrap.carousel').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'); });
angular.module('ui.bootstrap.datepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-datepicker-popup.dropdown-menu{display:block;}.uib-button-bar{padding:10px 9px 2px;}</style>'); });
angular.module('ui.bootstrap.timepicker').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">.uib-time input{width:50px;}</style>'); });
angular.module('ui.bootstrap.typeahead').run(function() {!angular.$$csp().noInlineStyle && angular.element(document).find('head').prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'); });
}).call(this,require("Rh4Tpy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_2acf9099.js","/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXdqZGljay9Eb2N1bWVudHMvQ29oYWVzdXNfUHJvamVjdHMvYmFuYW5hL2lvbmljL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbmRyZXdqZGljay9Eb2N1bWVudHMvQ29oYWVzdXNfUHJvamVjdHMvYmFuYW5hL2lvbmljL25vZGVfbW9kdWxlcy9hbmd1bGFyLXVpLWJvb3RzdHJhcC9kaXN0L2Zha2VfMmFjZjkwOTkuanMiLCIvVXNlcnMvYW5kcmV3amRpY2svRG9jdW1lbnRzL0NvaGFlc3VzX1Byb2plY3RzL2JhbmFuYS9pb25pYy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvYW5kcmV3amRpY2svRG9jdW1lbnRzL0NvaGFlc3VzX1Byb2plY3RzL2JhbmFuYS9pb25pYy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL1VzZXJzL2FuZHJld2pkaWNrL0RvY3VtZW50cy9Db2hhZXN1c19Qcm9qZWN0cy9iYW5hbmEvaW9uaWMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL2FuZHJld2pkaWNrL0RvY3VtZW50cy9Db2hhZXN1c19Qcm9qZWN0cy9iYW5hbmEvaW9uaWMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qXG4gKiBhbmd1bGFyLXVpLWJvb3RzdHJhcFxuICogaHR0cDovL2FuZ3VsYXItdWkuZ2l0aHViLmlvL2Jvb3RzdHJhcC9cblxuICogVmVyc2lvbjogMS4xLjIgLSAyMDE2LTAyLTAxXG4gKiBMaWNlbnNlOiBNSVRcbiAqL2FuZ3VsYXIubW9kdWxlKFwidWkuYm9vdHN0cmFwXCIsIFtcInVpLmJvb3RzdHJhcC50cGxzXCIsIFwidWkuYm9vdHN0cmFwLmNvbGxhcHNlXCIsXCJ1aS5ib290c3RyYXAuYWNjb3JkaW9uXCIsXCJ1aS5ib290c3RyYXAuYWxlcnRcIixcInVpLmJvb3RzdHJhcC5idXR0b25zXCIsXCJ1aS5ib290c3RyYXAuY2Fyb3VzZWxcIixcInVpLmJvb3RzdHJhcC5kYXRlcGFyc2VyXCIsXCJ1aS5ib290c3RyYXAuaXNDbGFzc1wiLFwidWkuYm9vdHN0cmFwLnBvc2l0aW9uXCIsXCJ1aS5ib290c3RyYXAuZGF0ZXBpY2tlclwiLFwidWkuYm9vdHN0cmFwLmRlYm91bmNlXCIsXCJ1aS5ib290c3RyYXAuZHJvcGRvd25cIixcInVpLmJvb3RzdHJhcC5zdGFja2VkTWFwXCIsXCJ1aS5ib290c3RyYXAubW9kYWxcIixcInVpLmJvb3RzdHJhcC5wYWdpbmdcIixcInVpLmJvb3RzdHJhcC5wYWdlclwiLFwidWkuYm9vdHN0cmFwLnBhZ2luYXRpb25cIixcInVpLmJvb3RzdHJhcC50b29sdGlwXCIsXCJ1aS5ib290c3RyYXAucG9wb3ZlclwiLFwidWkuYm9vdHN0cmFwLnByb2dyZXNzYmFyXCIsXCJ1aS5ib290c3RyYXAucmF0aW5nXCIsXCJ1aS5ib290c3RyYXAudGFic1wiLFwidWkuYm9vdHN0cmFwLnRpbWVwaWNrZXJcIixcInVpLmJvb3RzdHJhcC50eXBlYWhlYWRcIl0pO1xuYW5ndWxhci5tb2R1bGUoXCJ1aS5ib290c3RyYXAudHBsc1wiLCBbXCJ1aWIvdGVtcGxhdGUvYWNjb3JkaW9uL2FjY29yZGlvbi1ncm91cC5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvYWNjb3JkaW9uL2FjY29yZGlvbi5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvYWxlcnQvYWxlcnQuaHRtbFwiLFwidWliL3RlbXBsYXRlL2Nhcm91c2VsL2Nhcm91c2VsLmh0bWxcIixcInVpYi90ZW1wbGF0ZS9jYXJvdXNlbC9zbGlkZS5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9kYXRlcGlja2VyLmh0bWxcIixcInVpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL2RheS5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9tb250aC5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9wb3B1cC5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci95ZWFyLmh0bWxcIixcInVpYi90ZW1wbGF0ZS9tb2RhbC9iYWNrZHJvcC5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvbW9kYWwvd2luZG93Lmh0bWxcIixcInVpYi90ZW1wbGF0ZS9wYWdlci9wYWdlci5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmh0bWxcIixcInVpYi90ZW1wbGF0ZS90b29sdGlwL3Rvb2x0aXAtaHRtbC1wb3B1cC5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvdG9vbHRpcC90b29sdGlwLXBvcHVwLmh0bWxcIixcInVpYi90ZW1wbGF0ZS90b29sdGlwL3Rvb2x0aXAtdGVtcGxhdGUtcG9wdXAuaHRtbFwiLFwidWliL3RlbXBsYXRlL3BvcG92ZXIvcG9wb3Zlci1odG1sLmh0bWxcIixcInVpYi90ZW1wbGF0ZS9wb3BvdmVyL3BvcG92ZXItdGVtcGxhdGUuaHRtbFwiLFwidWliL3RlbXBsYXRlL3BvcG92ZXIvcG9wb3Zlci5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvcHJvZ3Jlc3NiYXIvYmFyLmh0bWxcIixcInVpYi90ZW1wbGF0ZS9wcm9ncmVzc2Jhci9wcm9ncmVzcy5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIuaHRtbFwiLFwidWliL3RlbXBsYXRlL3JhdGluZy9yYXRpbmcuaHRtbFwiLFwidWliL3RlbXBsYXRlL3RhYnMvdGFiLmh0bWxcIixcInVpYi90ZW1wbGF0ZS90YWJzL3RhYnNldC5odG1sXCIsXCJ1aWIvdGVtcGxhdGUvdGltZXBpY2tlci90aW1lcGlja2VyLmh0bWxcIixcInVpYi90ZW1wbGF0ZS90eXBlYWhlYWQvdHlwZWFoZWFkLW1hdGNoLmh0bWxcIixcInVpYi90ZW1wbGF0ZS90eXBlYWhlYWQvdHlwZWFoZWFkLXBvcHVwLmh0bWxcIl0pO1xuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5jb2xsYXBzZScsIFtdKVxuXG4gIC5kaXJlY3RpdmUoJ3VpYkNvbGxhcHNlJywgWyckYW5pbWF0ZScsICckcScsICckcGFyc2UnLCAnJGluamVjdG9yJywgZnVuY3Rpb24oJGFuaW1hdGUsICRxLCAkcGFyc2UsICRpbmplY3Rvcikge1xuICAgIHZhciAkYW5pbWF0ZUNzcyA9ICRpbmplY3Rvci5oYXMoJyRhbmltYXRlQ3NzJykgPyAkaW5qZWN0b3IuZ2V0KCckYW5pbWF0ZUNzcycpIDogbnVsbDtcbiAgICByZXR1cm4ge1xuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBleHBhbmRpbmdFeHByID0gJHBhcnNlKGF0dHJzLmV4cGFuZGluZyksXG4gICAgICAgICAgICBleHBhbmRlZEV4cHIgPSAkcGFyc2UoYXR0cnMuZXhwYW5kZWQpLFxuICAgICAgICAgICAgY29sbGFwc2luZ0V4cHIgPSAkcGFyc2UoYXR0cnMuY29sbGFwc2luZyksXG4gICAgICAgICAgICBjb2xsYXBzZWRFeHByID0gJHBhcnNlKGF0dHJzLmNvbGxhcHNlZCk7XG5cbiAgICAgICAgaWYgKCFzY29wZS4kZXZhbChhdHRycy51aWJDb2xsYXBzZSkpIHtcbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdpbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIGZhbHNlKVxuICAgICAgICAgICAgLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4cGFuZCgpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5oYXNDbGFzcygnY29sbGFwc2UnKSAmJiBlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHEucmVzb2x2ZShleHBhbmRpbmdFeHByKHNjb3BlKSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuXG4gICAgICAgICAgICAgIGlmICgkYW5pbWF0ZUNzcykge1xuICAgICAgICAgICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgIGFkZENsYXNzOiAnaW4nLFxuICAgICAgICAgICAgICAgICAgZWFzaW5nOiAnZWFzZScsXG4gICAgICAgICAgICAgICAgICB0bzogeyBoZWlnaHQ6IGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ICsgJ3B4JyB9XG4gICAgICAgICAgICAgICAgfSkuc3RhcnQoKVsnZmluYWxseSddKGV4cGFuZERvbmUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsZW1lbnQsICdpbicsIHtcbiAgICAgICAgICAgICAgICAgIHRvOiB7IGhlaWdodDogZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgKyAncHgnIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGV4cGFuZERvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4cGFuZERvbmUoKSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgICAgIC5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG4gICAgICAgICAgZXhwYW5kZWRFeHByKHNjb3BlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxhcHNlKCkge1xuICAgICAgICAgIGlmICghZWxlbWVudC5oYXNDbGFzcygnY29sbGFwc2UnKSAmJiAhZWxlbWVudC5oYXNDbGFzcygnaW4nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxhcHNlRG9uZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICRxLnJlc29sdmUoY29sbGFwc2luZ0V4cHIoc2NvcGUpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAvLyBJTVBPUlRBTlQ6IFRoZSBoZWlnaHQgbXVzdCBiZSBzZXQgYmVmb3JlIGFkZGluZyBcImNvbGxhcHNpbmdcIiBjbGFzcy5cbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIHRoZSBicm93c2VyIGF0dGVtcHRzIHRvIGFuaW1hdGUgZnJvbSBoZWlnaHQgMCAoaW5cbiAgICAgICAgICAgICAgICAvLyBjb2xsYXBzaW5nIGNsYXNzKSB0byB0aGUgZ2l2ZW4gaGVpZ2h0IGhlcmUuXG4gICAgICAgICAgICAgICAgLmNzcyh7aGVpZ2h0OiBlbGVtZW50WzBdLnNjcm9sbEhlaWdodCArICdweCd9KVxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxseSBhbGwgcGFuZWwgY29sbGFwc2UgaGF2ZSB0aGUgY29sbGFwc2UgY2xhc3MsIHRoaXMgcmVtb3ZhbFxuICAgICAgICAgICAgICAgIC8vIHByZXZlbnRzIHRoZSBhbmltYXRpb24gZnJvbSBqdW1waW5nIHRvIGNvbGxhcHNlZCBzdGF0ZVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICAgICAgICAgICBpZiAoJGFuaW1hdGVDc3MpIHtcbiAgICAgICAgICAgICAgICAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICByZW1vdmVDbGFzczogJ2luJyxcbiAgICAgICAgICAgICAgICAgIHRvOiB7aGVpZ2h0OiAnMCd9XG4gICAgICAgICAgICAgICAgfSkuc3RhcnQoKVsnZmluYWxseSddKGNvbGxhcHNlRG9uZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ2luJywge1xuICAgICAgICAgICAgICAgICAgdG86IHtoZWlnaHQ6ICcwJ31cbiAgICAgICAgICAgICAgICB9KS50aGVuKGNvbGxhcHNlRG9uZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VEb25lKCkge1xuICAgICAgICAgIGVsZW1lbnQuY3NzKHtoZWlnaHQ6ICcwJ30pOyAvLyBSZXF1aXJlZCBzbyB0aGF0IGNvbGxhcHNlIHdvcmtzIHdoZW4gYW5pbWF0aW9uIGlzIGRpc2FibGVkXG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlJyk7XG4gICAgICAgICAgY29sbGFwc2VkRXhwcihzY29wZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS4kd2F0Y2goYXR0cnMudWliQ29sbGFwc2UsIGZ1bmN0aW9uKHNob3VsZENvbGxhcHNlKSB7XG4gICAgICAgICAgaWYgKHNob3VsZENvbGxhcHNlKSB7XG4gICAgICAgICAgICBjb2xsYXBzZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBhbmQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5hY2NvcmRpb24nLCBbJ3VpLmJvb3RzdHJhcC5jb2xsYXBzZSddKVxuXG4uY29uc3RhbnQoJ3VpYkFjY29yZGlvbkNvbmZpZycsIHtcbiAgY2xvc2VPdGhlcnM6IHRydWVcbn0pXG5cbi5jb250cm9sbGVyKCdVaWJBY2NvcmRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF0dHJzJywgJ3VpYkFjY29yZGlvbkNvbmZpZycsIGZ1bmN0aW9uKCRzY29wZSwgJGF0dHJzLCBhY2NvcmRpb25Db25maWcpIHtcbiAgLy8gVGhpcyBhcnJheSBrZWVwcyB0cmFjayBvZiB0aGUgYWNjb3JkaW9uIGdyb3Vwc1xuICB0aGlzLmdyb3VwcyA9IFtdO1xuXG4gIC8vIEVuc3VyZSB0aGF0IGFsbCB0aGUgZ3JvdXBzIGluIHRoaXMgYWNjb3JkaW9uIGFyZSBjbG9zZWQsIHVubGVzcyBjbG9zZS1vdGhlcnMgZXhwbGljaXRseSBzYXlzIG5vdCB0b1xuICB0aGlzLmNsb3NlT3RoZXJzID0gZnVuY3Rpb24ob3Blbkdyb3VwKSB7XG4gICAgdmFyIGNsb3NlT3RoZXJzID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmNsb3NlT3RoZXJzKSA/XG4gICAgICAkc2NvcGUuJGV2YWwoJGF0dHJzLmNsb3NlT3RoZXJzKSA6IGFjY29yZGlvbkNvbmZpZy5jbG9zZU90aGVycztcbiAgICBpZiAoY2xvc2VPdGhlcnMpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLmdyb3VwcywgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgICAgaWYgKGdyb3VwICE9PSBvcGVuR3JvdXApIHtcbiAgICAgICAgICBncm91cC5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoaXMgaXMgY2FsbGVkIGZyb20gdGhlIGFjY29yZGlvbi1ncm91cCBkaXJlY3RpdmUgdG8gYWRkIGl0c2VsZiB0byB0aGUgYWNjb3JkaW9uXG4gIHRoaXMuYWRkR3JvdXAgPSBmdW5jdGlvbihncm91cFNjb3BlKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXBTY29wZSk7XG5cbiAgICBncm91cFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhhdC5yZW1vdmVHcm91cChncm91cFNjb3BlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUaGlzIGlzIGNhbGxlZCBmcm9tIHRoZSBhY2NvcmRpb24tZ3JvdXAgZGlyZWN0aXZlIHdoZW4gdG8gcmVtb3ZlIGl0c2VsZlxuICB0aGlzLnJlbW92ZUdyb3VwID0gZnVuY3Rpb24oZ3JvdXApIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLmdyb3Vwcy5pbmRleE9mKGdyb3VwKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLmdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcbn1dKVxuXG4vLyBUaGUgYWNjb3JkaW9uIGRpcmVjdGl2ZSBzaW1wbHkgc2V0cyB1cCB0aGUgZGlyZWN0aXZlIGNvbnRyb2xsZXJcbi8vIGFuZCBhZGRzIGFuIGFjY29yZGlvbiBDU1MgY2xhc3MgdG8gaXRzZWxmIGVsZW1lbnQuXG4uZGlyZWN0aXZlKCd1aWJBY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250cm9sbGVyOiAnVWliQWNjb3JkaW9uQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnYWNjb3JkaW9uJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvYWNjb3JkaW9uL2FjY29yZGlvbi5odG1sJztcbiAgICB9XG4gIH07XG59KVxuXG4vLyBUaGUgYWNjb3JkaW9uLWdyb3VwIGRpcmVjdGl2ZSBpbmRpY2F0ZXMgYSBibG9jayBvZiBodG1sIHRoYXQgd2lsbCBleHBhbmQgYW5kIGNvbGxhcHNlIGluIGFuIGFjY29yZGlvblxuLmRpcmVjdGl2ZSgndWliQWNjb3JkaW9uR3JvdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiAnXnVpYkFjY29yZGlvbicsICAgICAgICAgLy8gV2UgbmVlZCB0aGlzIGRpcmVjdGl2ZSB0byBiZSBpbnNpZGUgYW4gYWNjb3JkaW9uXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSwgICAgICAgICAgICAgIC8vIEl0IHRyYW5zY2x1ZGVzIHRoZSBjb250ZW50cyBvZiB0aGUgZGlyZWN0aXZlIGludG8gdGhlIHRlbXBsYXRlXG4gICAgcmVwbGFjZTogdHJ1ZSwgICAgICAgICAgICAgICAgLy8gVGhlIGVsZW1lbnQgY29udGFpbmluZyB0aGUgZGlyZWN0aXZlIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdGVtcGxhdGVcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2FjY29yZGlvbi9hY2NvcmRpb24tZ3JvdXAuaHRtbCc7XG4gICAgfSxcbiAgICBzY29wZToge1xuICAgICAgaGVhZGluZzogJ0AnLCAgICAgICAgICAgICAgIC8vIEludGVycG9sYXRlIHRoZSBoZWFkaW5nIGF0dHJpYnV0ZSBvbnRvIHRoaXMgc2NvcGVcbiAgICAgIGlzT3BlbjogJz0/JyxcbiAgICAgIGlzRGlzYWJsZWQ6ICc9PydcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zZXRIZWFkaW5nID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmhlYWRpbmcgPSBlbGVtZW50O1xuICAgICAgfTtcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYWNjb3JkaW9uQ3RybCkge1xuICAgICAgYWNjb3JkaW9uQ3RybC5hZGRHcm91cChzY29wZSk7XG5cbiAgICAgIHNjb3BlLm9wZW5DbGFzcyA9IGF0dHJzLm9wZW5DbGFzcyB8fCAncGFuZWwtb3Blbic7XG4gICAgICBzY29wZS5wYW5lbENsYXNzID0gYXR0cnMucGFuZWxDbGFzcyB8fCAncGFuZWwtZGVmYXVsdCc7XG4gICAgICBzY29wZS4kd2F0Y2goJ2lzT3BlbicsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3Moc2NvcGUub3BlbkNsYXNzLCAhIXZhbHVlKTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgYWNjb3JkaW9uQ3RybC5jbG9zZU90aGVycyhzY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzY29wZS50b2dnbGVPcGVuID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgIGlmICghc2NvcGUuaXNEaXNhYmxlZCkge1xuICAgICAgICAgIGlmICghJGV2ZW50IHx8ICRldmVudC53aGljaCA9PT0gMzIpIHtcbiAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9ICFzY29wZS5pc09wZW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgaWQgPSAnYWNjb3JkaW9uZ3JvdXAtJyArIHNjb3BlLiRpZCArICctJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKTtcbiAgICAgIHNjb3BlLmhlYWRpbmdJZCA9IGlkICsgJy10YWInO1xuICAgICAgc2NvcGUucGFuZWxJZCA9IGlkICsgJy1wYW5lbCc7XG4gICAgfVxuICB9O1xufSlcblxuLy8gVXNlIGFjY29yZGlvbi1oZWFkaW5nIGJlbG93IGFuIGFjY29yZGlvbi1ncm91cCB0byBwcm92aWRlIGEgaGVhZGluZyBjb250YWluaW5nIEhUTUxcbi5kaXJlY3RpdmUoJ3VpYkFjY29yZGlvbkhlYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLCAgIC8vIEdyYWIgdGhlIGNvbnRlbnRzIHRvIGJlIHVzZWQgYXMgdGhlIGhlYWRpbmdcbiAgICB0ZW1wbGF0ZTogJycsICAgICAgIC8vIEluIGVmZmVjdCByZW1vdmUgdGhpcyBlbGVtZW50IVxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgcmVxdWlyZTogJ151aWJBY2NvcmRpb25Hcm91cCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBhY2NvcmRpb25Hcm91cEN0cmwsIHRyYW5zY2x1ZGUpIHtcbiAgICAgIC8vIFBhc3MgdGhlIGhlYWRpbmcgdG8gdGhlIGFjY29yZGlvbi1ncm91cCBjb250cm9sbGVyXG4gICAgICAvLyBzbyB0aGF0IGl0IGNhbiBiZSB0cmFuc2NsdWRlZCBpbnRvIHRoZSByaWdodCBwbGFjZSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgIC8vIFtUaGUgc2Vjb25kIHBhcmFtZXRlciB0byB0cmFuc2NsdWRlIGNhdXNlcyB0aGUgZWxlbWVudHMgdG8gYmUgY2xvbmVkIHNvIHRoYXQgdGhleSB3b3JrIGluIG5nLXJlcGVhdF1cbiAgICAgIGFjY29yZGlvbkdyb3VwQ3RybC5zZXRIZWFkaW5nKHRyYW5zY2x1ZGUoc2NvcGUsIGFuZ3VsYXIubm9vcCkpO1xuICAgIH1cbiAgfTtcbn0pXG5cbi8vIFVzZSBpbiB0aGUgYWNjb3JkaW9uLWdyb3VwIHRlbXBsYXRlIHRvIGluZGljYXRlIHdoZXJlIHlvdSB3YW50IHRoZSBoZWFkaW5nIHRvIGJlIHRyYW5zY2x1ZGVkXG4vLyBZb3UgbXVzdCBwcm92aWRlIHRoZSBwcm9wZXJ0eSBvbiB0aGUgYWNjb3JkaW9uLWdyb3VwIGNvbnRyb2xsZXIgdGhhdCB3aWxsIGhvbGQgdGhlIHRyYW5zY2x1ZGVkIGVsZW1lbnRcbi5kaXJlY3RpdmUoJ3VpYkFjY29yZGlvblRyYW5zY2x1ZGUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiAnXnVpYkFjY29yZGlvbkdyb3VwJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIHtcbiAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRyb2xsZXJbYXR0cnMudWliQWNjb3JkaW9uVHJhbnNjbHVkZV07IH0sIGZ1bmN0aW9uKGhlYWRpbmcpIHtcbiAgICAgICAgaWYgKGhlYWRpbmcpIHtcbiAgICAgICAgICBlbGVtZW50LmZpbmQoJ3NwYW4nKS5odG1sKCcnKTtcbiAgICAgICAgICBlbGVtZW50LmZpbmQoJ3NwYW4nKS5hcHBlbmQoaGVhZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmFsZXJ0JywgW10pXG5cbi5jb250cm9sbGVyKCdVaWJBbGVydENvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAnJGludGVycG9sYXRlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMsICRpbnRlcnBvbGF0ZSwgJHRpbWVvdXQpIHtcbiAgJHNjb3BlLmNsb3NlYWJsZSA9ICEhJGF0dHJzLmNsb3NlO1xuXG4gIHZhciBkaXNtaXNzT25UaW1lb3V0ID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmRpc21pc3NPblRpbWVvdXQpID9cbiAgICAkaW50ZXJwb2xhdGUoJGF0dHJzLmRpc21pc3NPblRpbWVvdXQpKCRzY29wZS4kcGFyZW50KSA6IG51bGw7XG5cbiAgaWYgKGRpc21pc3NPblRpbWVvdXQpIHtcbiAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5jbG9zZSgpO1xuICAgIH0sIHBhcnNlSW50KGRpc21pc3NPblRpbWVvdXQsIDEwKSk7XG4gIH1cbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJBbGVydCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIGNvbnRyb2xsZXI6ICdVaWJBbGVydENvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2FsZXJ0JyxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2FsZXJ0L2FsZXJ0Lmh0bWwnO1xuICAgIH0sXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICB0eXBlOiAnQCcsXG4gICAgICBjbG9zZTogJyYnXG4gICAgfVxuICB9O1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAuYnV0dG9ucycsIFtdKVxuXG4uY29uc3RhbnQoJ3VpYkJ1dHRvbkNvbmZpZycsIHtcbiAgYWN0aXZlQ2xhc3M6ICdhY3RpdmUnLFxuICB0b2dnbGVFdmVudDogJ2NsaWNrJ1xufSlcblxuLmNvbnRyb2xsZXIoJ1VpYkJ1dHRvbnNDb250cm9sbGVyJywgWyd1aWJCdXR0b25Db25maWcnLCBmdW5jdGlvbihidXR0b25Db25maWcpIHtcbiAgdGhpcy5hY3RpdmVDbGFzcyA9IGJ1dHRvbkNvbmZpZy5hY3RpdmVDbGFzcyB8fCAnYWN0aXZlJztcbiAgdGhpcy50b2dnbGVFdmVudCA9IGJ1dHRvbkNvbmZpZy50b2dnbGVFdmVudCB8fCAnY2xpY2snO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkJ0blJhZGlvJywgWyckcGFyc2UnLCBmdW5jdGlvbigkcGFyc2UpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiBbJ3VpYkJ0blJhZGlvJywgJ25nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnVWliQnV0dG9uc0NvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2J1dHRvbnMnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBidXR0b25zQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuICAgICAgdmFyIHVuY2hlY2thYmxlRXhwciA9ICRwYXJzZShhdHRycy51aWJVbmNoZWNrYWJsZSk7XG5cbiAgICAgIGVsZW1lbnQuZmluZCgnaW5wdXQnKS5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xuXG4gICAgICAvL21vZGVsIC0+IFVJXG4gICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoYnV0dG9uc0N0cmwuYWN0aXZlQ2xhc3MsIGFuZ3VsYXIuZXF1YWxzKG5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlLCBzY29wZS4kZXZhbChhdHRycy51aWJCdG5SYWRpbykpKTtcbiAgICAgIH07XG5cbiAgICAgIC8vdWktPm1vZGVsXG4gICAgICBlbGVtZW50Lm9uKGJ1dHRvbnNDdHJsLnRvZ2dsZUV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF0dHJzLmRpc2FibGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gZWxlbWVudC5oYXNDbGFzcyhidXR0b25zQ3RybC5hY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgaWYgKCFpc0FjdGl2ZSB8fCBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy51bmNoZWNrYWJsZSkpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGlzQWN0aXZlID8gbnVsbCA6IHNjb3BlLiRldmFsKGF0dHJzLnVpYkJ0blJhZGlvKSk7XG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYXR0cnMudWliVW5jaGVja2FibGUpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKHVuY2hlY2thYmxlRXhwciwgZnVuY3Rpb24odW5jaGVja2FibGUpIHtcbiAgICAgICAgICBhdHRycy4kc2V0KCd1bmNoZWNrYWJsZScsIHVuY2hlY2thYmxlID8gJycgOiBudWxsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkJ0bkNoZWNrYm94JywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVxdWlyZTogWyd1aWJCdG5DaGVja2JveCcsICduZ01vZGVsJ10sXG4gICAgY29udHJvbGxlcjogJ1VpYkJ1dHRvbnNDb250cm9sbGVyJyxcbiAgICBjb250cm9sbGVyQXM6ICdidXR0b24nLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBidXR0b25zQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBlbGVtZW50LmZpbmQoJ2lucHV0JykuY3NzKHtkaXNwbGF5OiAnbm9uZSd9KTtcblxuICAgICAgZnVuY3Rpb24gZ2V0VHJ1ZVZhbHVlKCkge1xuICAgICAgICByZXR1cm4gZ2V0Q2hlY2tib3hWYWx1ZShhdHRycy5idG5DaGVja2JveFRydWUsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRGYWxzZVZhbHVlKCkge1xuICAgICAgICByZXR1cm4gZ2V0Q2hlY2tib3hWYWx1ZShhdHRycy5idG5DaGVja2JveEZhbHNlLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldENoZWNrYm94VmFsdWUoYXR0cmlidXRlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJpYnV0ZSkgPyBzY29wZS4kZXZhbChhdHRyaWJ1dGUpIDogZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuXG4gICAgICAvL21vZGVsIC0+IFVJXG4gICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoYnV0dG9uc0N0cmwuYWN0aXZlQ2xhc3MsIGFuZ3VsYXIuZXF1YWxzKG5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlLCBnZXRUcnVlVmFsdWUoKSkpO1xuICAgICAgfTtcblxuICAgICAgLy91aS0+bW9kZWxcbiAgICAgIGVsZW1lbnQub24oYnV0dG9uc0N0cmwudG9nZ2xlRXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXR0cnMuZGlzYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShlbGVtZW50Lmhhc0NsYXNzKGJ1dHRvbnNDdHJsLmFjdGl2ZUNsYXNzKSA/IGdldEZhbHNlVmFsdWUoKSA6IGdldFRydWVWYWx1ZSgpKTtcbiAgICAgICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAuY2Fyb3VzZWwnLCBbXSlcblxuLmNvbnRyb2xsZXIoJ1VpYkNhcm91c2VsQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRpbnRlcnZhbCcsICckdGltZW91dCcsICckYW5pbWF0ZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRpbnRlcnZhbCwgJHRpbWVvdXQsICRhbmltYXRlKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBzbGlkZXMgPSBzZWxmLnNsaWRlcyA9ICRzY29wZS5zbGlkZXMgPSBbXSxcbiAgICBTTElERV9ESVJFQ1RJT04gPSAndWliLXNsaWRlRGlyZWN0aW9uJyxcbiAgICBjdXJyZW50SW5kZXggPSAtMSxcbiAgICBjdXJyZW50SW50ZXJ2YWwsIGlzUGxheWluZywgYnVmZmVyZWRUcmFuc2l0aW9ucyA9IFtdO1xuICBzZWxmLmN1cnJlbnRTbGlkZSA9IG51bGw7XG5cbiAgdmFyIGRlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIHNlbGYuYWRkU2xpZGUgPSBmdW5jdGlvbihzbGlkZSwgZWxlbWVudCkge1xuICAgIHNsaWRlLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICBzbGlkZXMucHVzaChzbGlkZSk7XG4gICAgLy9pZiB0aGlzIGlzIHRoZSBmaXJzdCBzbGlkZSBvciB0aGUgc2xpZGUgaXMgc2V0IHRvIGFjdGl2ZSwgc2VsZWN0IGl0XG4gICAgaWYgKHNsaWRlcy5sZW5ndGggPT09IDEgfHwgc2xpZGUuYWN0aXZlKSB7XG4gICAgICBpZiAoJHNjb3BlLiRjdXJyZW50VHJhbnNpdGlvbikge1xuICAgICAgICAkc2NvcGUuJGN1cnJlbnRUcmFuc2l0aW9uID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zZWxlY3Qoc2xpZGVzW3NsaWRlcy5sZW5ndGggLSAxXSk7XG4gICAgICBpZiAoc2xpZGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAkc2NvcGUucGxheSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzbGlkZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi5nZXRDdXJyZW50SW5kZXggPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2VsZi5jdXJyZW50U2xpZGUgJiYgYW5ndWxhci5pc0RlZmluZWQoc2VsZi5jdXJyZW50U2xpZGUuaW5kZXgpKSB7XG4gICAgICByZXR1cm4gK3NlbGYuY3VycmVudFNsaWRlLmluZGV4O1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICB9O1xuXG4gIHNlbGYubmV4dCA9ICRzY29wZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5ld0luZGV4ID0gKHNlbGYuZ2V0Q3VycmVudEluZGV4KCkgKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG5cbiAgICBpZiAobmV3SW5kZXggPT09IDAgJiYgJHNjb3BlLm5vV3JhcCgpKSB7XG4gICAgICAkc2NvcGUucGF1c2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZi5zZWxlY3QoZ2V0U2xpZGVCeUluZGV4KG5ld0luZGV4KSwgJ25leHQnKTtcbiAgfTtcblxuICBzZWxmLnByZXYgPSAkc2NvcGUucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXdJbmRleCA9IHNlbGYuZ2V0Q3VycmVudEluZGV4KCkgLSAxIDwgMCA/IHNsaWRlcy5sZW5ndGggLSAxIDogc2VsZi5nZXRDdXJyZW50SW5kZXgoKSAtIDE7XG5cbiAgICBpZiAoJHNjb3BlLm5vV3JhcCgpICYmIG5ld0luZGV4ID09PSBzbGlkZXMubGVuZ3RoIC0gMSkge1xuICAgICAgJHNjb3BlLnBhdXNlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYuc2VsZWN0KGdldFNsaWRlQnlJbmRleChuZXdJbmRleCksICdwcmV2Jyk7XG4gIH07XG5cbiAgc2VsZi5yZW1vdmVTbGlkZSA9IGZ1bmN0aW9uKHNsaWRlKSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHNsaWRlLmluZGV4KSkge1xuICAgICAgc2xpZGVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gK2EuaW5kZXggPiArYi5pbmRleDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBidWZmZXJlZEluZGV4ID0gYnVmZmVyZWRUcmFuc2l0aW9ucy5pbmRleE9mKHNsaWRlKTtcbiAgICBpZiAoYnVmZmVyZWRJbmRleCAhPT0gLTEpIHtcbiAgICAgIGJ1ZmZlcmVkVHJhbnNpdGlvbnMuc3BsaWNlKGJ1ZmZlcmVkSW5kZXgsIDEpO1xuICAgIH1cbiAgICAvL2dldCB0aGUgaW5kZXggb2YgdGhlIHNsaWRlIGluc2lkZSB0aGUgY2Fyb3VzZWxcbiAgICB2YXIgaW5kZXggPSBzbGlkZXMuaW5kZXhPZihzbGlkZSk7XG4gICAgc2xpZGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2xpZGVzLmxlbmd0aCA+IDAgJiYgc2xpZGUuYWN0aXZlKSB7XG4gICAgICAgIGlmIChpbmRleCA+PSBzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZi5zZWxlY3Qoc2xpZGVzW2luZGV4IC0gMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuc2VsZWN0KHNsaWRlc1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRJbmRleCA+IGluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleC0tO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9jbGVhbiB0aGUgY3VycmVudFNsaWRlIHdoZW4gbm8gbW9yZSBzbGlkZVxuICAgIGlmIChzbGlkZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxmLmN1cnJlbnRTbGlkZSA9IG51bGw7XG4gICAgICBjbGVhckJ1ZmZlcmVkVHJhbnNpdGlvbnMoKTtcbiAgICB9XG4gIH07XG5cbiAgLyogZGlyZWN0aW9uOiBcInByZXZcIiBvciBcIm5leHRcIiAqL1xuICBzZWxmLnNlbGVjdCA9ICRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihuZXh0U2xpZGUsIGRpcmVjdGlvbikge1xuICAgIHZhciBuZXh0SW5kZXggPSAkc2NvcGUuaW5kZXhPZlNsaWRlKG5leHRTbGlkZSk7XG4gICAgLy9EZWNpZGUgZGlyZWN0aW9uIGlmIGl0J3Mgbm90IGdpdmVuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkaXJlY3Rpb24gPSBuZXh0SW5kZXggPiBzZWxmLmdldEN1cnJlbnRJbmRleCgpID8gJ25leHQnIDogJ3ByZXYnO1xuICAgIH1cbiAgICAvL1ByZXZlbnQgdGhpcyB1c2VyLXRyaWdnZXJlZCB0cmFuc2l0aW9uIGZyb20gb2NjdXJyaW5nIGlmIHRoZXJlIGlzIGFscmVhZHkgb25lIGluIHByb2dyZXNzXG4gICAgaWYgKG5leHRTbGlkZSAmJiBuZXh0U2xpZGUgIT09IHNlbGYuY3VycmVudFNsaWRlICYmICEkc2NvcGUuJGN1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICBnb05leHQobmV4dFNsaWRlLCBuZXh0SW5kZXgsIGRpcmVjdGlvbik7XG4gICAgfSBlbHNlIGlmIChuZXh0U2xpZGUgJiYgbmV4dFNsaWRlICE9PSBzZWxmLmN1cnJlbnRTbGlkZSAmJiAkc2NvcGUuJGN1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICBidWZmZXJlZFRyYW5zaXRpb25zLnB1c2gobmV4dFNsaWRlKTtcbiAgICAgIG5leHRTbGlkZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLyogQWxsb3cgb3V0c2lkZSBwZW9wbGUgdG8gY2FsbCBpbmRleE9mIG9uIHNsaWRlcyBhcnJheSAqL1xuICAkc2NvcGUuaW5kZXhPZlNsaWRlID0gZnVuY3Rpb24oc2xpZGUpIHtcbiAgICByZXR1cm4gYW5ndWxhci5pc0RlZmluZWQoc2xpZGUuaW5kZXgpID8gK3NsaWRlLmluZGV4IDogc2xpZGVzLmluZGV4T2Yoc2xpZGUpO1xuICB9O1xuXG4gICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKHNsaWRlKSB7XG4gICAgcmV0dXJuIHNlbGYuY3VycmVudFNsaWRlID09PSBzbGlkZTtcbiAgfTtcblxuICAkc2NvcGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISRzY29wZS5ub1BhdXNlKSB7XG4gICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHJlc2V0VGltZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWlzUGxheWluZykge1xuICAgICAgaXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgIHJlc3RhcnRUaW1lcigpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgIGRlc3Ryb3llZCA9IHRydWU7XG4gICAgcmVzZXRUaW1lcigpO1xuICB9KTtcblxuICAkc2NvcGUuJHdhdGNoKCdub1RyYW5zaXRpb24nLCBmdW5jdGlvbihub1RyYW5zaXRpb24pIHtcbiAgICAkYW5pbWF0ZS5lbmFibGVkKCRlbGVtZW50LCAhbm9UcmFuc2l0aW9uKTtcbiAgfSk7XG5cbiAgJHNjb3BlLiR3YXRjaCgnaW50ZXJ2YWwnLCByZXN0YXJ0VGltZXIpO1xuXG4gICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdzbGlkZXMnLCByZXNldFRyYW5zaXRpb24pO1xuXG4gIGZ1bmN0aW9uIGNsZWFyQnVmZmVyZWRUcmFuc2l0aW9ucygpIHtcbiAgICB3aGlsZSAoYnVmZmVyZWRUcmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1ZmZlcmVkVHJhbnNpdGlvbnMuc2hpZnQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZUJ5SW5kZXgoaW5kZXgpIHtcbiAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChzbGlkZXNbaW5kZXhdLmluZGV4KSkge1xuICAgICAgcmV0dXJuIHNsaWRlc1tpbmRleF07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gc2xpZGVzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgaWYgKHNsaWRlc1tpXS5pbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHNsaWRlc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnb05leHQoc2xpZGUsIGluZGV4LCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoZGVzdHJveWVkKSB7IHJldHVybjsgfVxuXG4gICAgYW5ndWxhci5leHRlbmQoc2xpZGUsIHtkaXJlY3Rpb246IGRpcmVjdGlvbiwgYWN0aXZlOiB0cnVlfSk7XG4gICAgYW5ndWxhci5leHRlbmQoc2VsZi5jdXJyZW50U2xpZGUgfHwge30sIHtkaXJlY3Rpb246IGRpcmVjdGlvbiwgYWN0aXZlOiBmYWxzZX0pO1xuICAgIGlmICgkYW5pbWF0ZS5lbmFibGVkKCRlbGVtZW50KSAmJiAhJHNjb3BlLiRjdXJyZW50VHJhbnNpdGlvbiAmJlxuICAgICAgc2xpZGUuJGVsZW1lbnQgJiYgc2VsZi5zbGlkZXMubGVuZ3RoID4gMSkge1xuICAgICAgc2xpZGUuJGVsZW1lbnQuZGF0YShTTElERV9ESVJFQ1RJT04sIHNsaWRlLmRpcmVjdGlvbik7XG4gICAgICBpZiAoc2VsZi5jdXJyZW50U2xpZGUgJiYgc2VsZi5jdXJyZW50U2xpZGUuJGVsZW1lbnQpIHtcbiAgICAgICAgc2VsZi5jdXJyZW50U2xpZGUuJGVsZW1lbnQuZGF0YShTTElERV9ESVJFQ1RJT04sIHNsaWRlLmRpcmVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS4kY3VycmVudFRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgJGFuaW1hdGUub24oJ2FkZENsYXNzJywgc2xpZGUuJGVsZW1lbnQsIGZ1bmN0aW9uKGVsZW1lbnQsIHBoYXNlKSB7XG4gICAgICAgIGlmIChwaGFzZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgICAgICRzY29wZS4kY3VycmVudFRyYW5zaXRpb24gPSBudWxsO1xuICAgICAgICAgICRhbmltYXRlLm9mZignYWRkQ2xhc3MnLCBlbGVtZW50KTtcbiAgICAgICAgICBpZiAoYnVmZmVyZWRUcmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSBidWZmZXJlZFRyYW5zaXRpb25zLnBvcCgpO1xuICAgICAgICAgICAgdmFyIG5leHRJbmRleCA9ICRzY29wZS5pbmRleE9mU2xpZGUobmV4dFNsaWRlKTtcbiAgICAgICAgICAgIHZhciBuZXh0RGlyZWN0aW9uID0gbmV4dEluZGV4ID4gc2VsZi5nZXRDdXJyZW50SW5kZXgoKSA/ICduZXh0JyA6ICdwcmV2JztcbiAgICAgICAgICAgIGNsZWFyQnVmZmVyZWRUcmFuc2l0aW9ucygpO1xuXG4gICAgICAgICAgICBnb05leHQobmV4dFNsaWRlLCBuZXh0SW5kZXgsIG5leHREaXJlY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZi5jdXJyZW50U2xpZGUgPSBzbGlkZTtcbiAgICBjdXJyZW50SW5kZXggPSBpbmRleDtcblxuICAgIC8vZXZlcnkgdGltZSB5b3UgY2hhbmdlIHNsaWRlcywgcmVzZXQgdGhlIHRpbWVyXG4gICAgcmVzdGFydFRpbWVyKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRpbWVyKCkge1xuICAgIGlmIChjdXJyZW50SW50ZXJ2YWwpIHtcbiAgICAgICRpbnRlcnZhbC5jYW5jZWwoY3VycmVudEludGVydmFsKTtcbiAgICAgIGN1cnJlbnRJbnRlcnZhbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcmFuc2l0aW9uKHNsaWRlcykge1xuICAgIGlmICghc2xpZGVzLmxlbmd0aCkge1xuICAgICAgJHNjb3BlLiRjdXJyZW50VHJhbnNpdGlvbiA9IG51bGw7XG4gICAgICBjbGVhckJ1ZmZlcmVkVHJhbnNpdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXN0YXJ0VGltZXIoKSB7XG4gICAgcmVzZXRUaW1lcigpO1xuICAgIHZhciBpbnRlcnZhbCA9ICskc2NvcGUuaW50ZXJ2YWw7XG4gICAgaWYgKCFpc05hTihpbnRlcnZhbCkgJiYgaW50ZXJ2YWwgPiAwKSB7XG4gICAgICBjdXJyZW50SW50ZXJ2YWwgPSAkaW50ZXJ2YWwodGltZXJGbiwgaW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRm4oKSB7XG4gICAgdmFyIGludGVydmFsID0gKyRzY29wZS5pbnRlcnZhbDtcbiAgICBpZiAoaXNQbGF5aW5nICYmICFpc05hTihpbnRlcnZhbCkgJiYgaW50ZXJ2YWwgPiAwICYmIHNsaWRlcy5sZW5ndGgpIHtcbiAgICAgICRzY29wZS5uZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzY29wZS5wYXVzZSgpO1xuICAgIH1cbiAgfVxufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYkNhcm91c2VsJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJDYXJvdXNlbENvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2Nhcm91c2VsJyxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2Nhcm91c2VsL2Nhcm91c2VsLmh0bWwnO1xuICAgIH0sXG4gICAgc2NvcGU6IHtcbiAgICAgIGludGVydmFsOiAnPScsXG4gICAgICBub1RyYW5zaXRpb246ICc9JyxcbiAgICAgIG5vUGF1c2U6ICc9JyxcbiAgICAgIG5vV3JhcDogJyYnXG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliU2xpZGUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiAnXnVpYkNhcm91c2VsJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9jYXJvdXNlbC9zbGlkZS5odG1sJztcbiAgICB9LFxuICAgIHNjb3BlOiB7XG4gICAgICBhY3RpdmU6ICc9PycsXG4gICAgICBhY3R1YWw6ICc9PycsXG4gICAgICBpbmRleDogJz0/J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY2Fyb3VzZWxDdHJsKSB7XG4gICAgICBjYXJvdXNlbEN0cmwuYWRkU2xpZGUoc2NvcGUsIGVsZW1lbnQpO1xuICAgICAgLy93aGVuIHRoZSBzY29wZSBpcyBkZXN0cm95ZWQgdGhlbiByZW1vdmUgdGhlIHNsaWRlIGZyb20gdGhlIGN1cnJlbnQgc2xpZGVzIGFycmF5XG4gICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhcm91c2VsQ3RybC5yZW1vdmVTbGlkZShzY29wZSk7XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUuJHdhdGNoKCdhY3RpdmUnLCBmdW5jdGlvbihhY3RpdmUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgIGNhcm91c2VsQ3RybC5zZWxlY3Qoc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KVxuXG4uYW5pbWF0aW9uKCcuaXRlbScsIFsnJGFuaW1hdGVDc3MnLFxuZnVuY3Rpb24oJGFuaW1hdGVDc3MpIHtcbiAgdmFyIFNMSURFX0RJUkVDVElPTiA9ICd1aWItc2xpZGVEaXJlY3Rpb24nO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSwgY2FsbGJhY2spIHtcbiAgICBlbGVtZW50LnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYmVmb3JlQWRkQ2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzTmFtZSwgZG9uZSkge1xuICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgICAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGVsZW1lbnQuZGF0YShTTElERV9ESVJFQ1RJT04pO1xuICAgICAgICB2YXIgZGlyZWN0aW9uQ2xhc3MgPSBkaXJlY3Rpb24gPT09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICAgIHZhciByZW1vdmVDbGFzc0ZuID0gcmVtb3ZlQ2xhc3MuYmluZCh0aGlzLCBlbGVtZW50LFxuICAgICAgICAgIGRpcmVjdGlvbkNsYXNzICsgJyAnICsgZGlyZWN0aW9uLCBkb25lKTtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhkaXJlY3Rpb24pO1xuXG4gICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHthZGRDbGFzczogZGlyZWN0aW9uQ2xhc3N9KVxuICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgLmRvbmUocmVtb3ZlQ2xhc3NGbik7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgZG9uZSgpO1xuICAgIH0sXG4gICAgYmVmb3JlUmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChlbGVtZW50LCBjbGFzc05hbWUsIGRvbmUpIHtcbiAgICAgIGlmIChjbGFzc05hbWUgPT09ICdhY3RpdmUnKSB7XG4gICAgICAgIHZhciBzdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBlbGVtZW50LmRhdGEoU0xJREVfRElSRUNUSU9OKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbkNsYXNzID0gZGlyZWN0aW9uID09PSAnbmV4dCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgICAgICB2YXIgcmVtb3ZlQ2xhc3NGbiA9IHJlbW92ZUNsYXNzLmJpbmQodGhpcywgZWxlbWVudCwgZGlyZWN0aW9uQ2xhc3MsIGRvbmUpO1xuXG4gICAgICAgICRhbmltYXRlQ3NzKGVsZW1lbnQsIHthZGRDbGFzczogZGlyZWN0aW9uQ2xhc3N9KVxuICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgLmRvbmUocmVtb3ZlQ2xhc3NGbik7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5kYXRlcGFyc2VyJywgW10pXG5cbi5zZXJ2aWNlKCd1aWJEYXRlUGFyc2VyJywgWyckbG9nJywgJyRsb2NhbGUnLCAnZGF0ZUZpbHRlcicsICdvcmRlckJ5RmlsdGVyJywgZnVuY3Rpb24oJGxvZywgJGxvY2FsZSwgZGF0ZUZpbHRlciwgb3JkZXJCeUZpbHRlcikge1xuICAvLyBQdWxsZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWJvc3RvY2svZDMvYmxvYi9tYXN0ZXIvc3JjL2Zvcm1hdC9yZXF1b3RlLmpzXG4gIHZhciBTUEVDSUFMX0NIQVJBQ1RFUlNfUkVHRVhQID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG4gIHZhciBsb2NhbGVJZDtcbiAgdmFyIGZvcm1hdENvZGVUb1JlZ2V4O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsZUlkID0gJGxvY2FsZS5pZDtcblxuICAgIHRoaXMucGFyc2VycyA9IHt9O1xuICAgIHRoaXMuZm9ybWF0dGVycyA9IHt9O1xuXG4gICAgZm9ybWF0Q29kZVRvUmVnZXggPSBbXG4gICAgICB7XG4gICAgICAgIGtleTogJ3l5eXknLFxuICAgICAgICByZWdleDogJ1xcXFxkezR9JyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMueWVhciA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgdmFyIF9kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBfZGF0ZS5zZXRGdWxsWWVhcihNYXRoLmFicyhkYXRlLmdldEZ1bGxZZWFyKCkpKTtcbiAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihfZGF0ZSwgJ3l5eXknKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAneXknLFxuICAgICAgICByZWdleDogJ1xcXFxkezJ9JyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMueWVhciA9ICt2YWx1ZSArIDIwMDA7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgIHZhciBfZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgX2RhdGUuc2V0RnVsbFllYXIoTWF0aC5hYnMoZGF0ZS5nZXRGdWxsWWVhcigpKSk7XG4gICAgICAgICAgcmV0dXJuIGRhdGVGaWx0ZXIoX2RhdGUsICd5eScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICd5JyxcbiAgICAgICAgcmVnZXg6ICdcXFxcZHsxLDR9JyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMueWVhciA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgdmFyIF9kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBfZGF0ZS5zZXRGdWxsWWVhcihNYXRoLmFicyhkYXRlLmdldEZ1bGxZZWFyKCkpKTtcbiAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihfZGF0ZSwgJ3knKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnTSEnLFxuICAgICAgICByZWdleDogJzA/WzEtOV18MVswLTJdJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMubW9udGggPSB2YWx1ZSAtIDE7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICAgICAgICBpZiAoL15bMC05XSQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnTU0nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnTScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdNTU1NJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5NT05USC5qb2luKCd8JyksXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLm1vbnRoID0gJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLk1PTlRILmluZGV4T2YodmFsdWUpOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ01NTU0nKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnTU1NJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVE1PTlRILmpvaW4oJ3wnKSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMubW9udGggPSAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlRNT05USC5pbmRleE9mKHZhbHVlKTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdNTU0nKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnTU0nLFxuICAgICAgICByZWdleDogJzBbMS05XXwxWzAtMl0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5tb250aCA9IHZhbHVlIC0gMTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdNTScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdNJyxcbiAgICAgICAgcmVnZXg6ICdbMS05XXwxWzAtMl0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5tb250aCA9IHZhbHVlIC0gMTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdNJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2QhJyxcbiAgICAgICAgcmVnZXg6ICdbMC0yXT9bMC05XXsxfXwzWzAtMV17MX0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5kYXRlID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBkYXRlLmdldERhdGUoKTtcbiAgICAgICAgICBpZiAoL15bMS05XSQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnZGQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnZCcpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdkZCcsXG4gICAgICAgIHJlZ2V4OiAnWzAtMl1bMC05XXsxfXwzWzAtMV17MX0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5kYXRlID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ2RkJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ2QnLFxuICAgICAgICByZWdleDogJ1sxLTJdP1swLTldezF9fDNbMC0xXXsxfScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLmRhdGUgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnZCcpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdFRUVFJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5EQVkuam9pbignfCcpLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ0VFRUUnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnRUVFJyxcbiAgICAgICAgcmVnZXg6ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWS5qb2luKCd8JyksXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnRUVFJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ0hIJyxcbiAgICAgICAgcmVnZXg6ICcoPzowfDEpWzAtOV18MlswLTNdJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMuaG91cnMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnSEgnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnaGgnLFxuICAgICAgICByZWdleDogJzBbMC05XXwxWzAtMl0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5ob3VycyA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdoaCcpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdIJyxcbiAgICAgICAgcmVnZXg6ICcxP1swLTldfDJbMC0zXScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLmhvdXJzID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ0gnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnaCcsXG4gICAgICAgIHJlZ2V4OiAnWzAtOV18MVswLTJdJyxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uKHZhbHVlKSB7IHRoaXMuaG91cnMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnaCcpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdtbScsXG4gICAgICAgIHJlZ2V4OiAnWzAtNV1bMC05XScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLm1pbnV0ZXMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnbW0nKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnbScsXG4gICAgICAgIHJlZ2V4OiAnWzAtOV18WzEtNV1bMC05XScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLm1pbnV0ZXMgPSArdmFsdWU7IH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnbScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdzc3MnLFxuICAgICAgICByZWdleDogJ1swLTldWzAtOV1bMC05XScsXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzLm1pbGxpc2Vjb25kcyA9ICt2YWx1ZTsgfSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICdzc3MnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnc3MnLFxuICAgICAgICByZWdleDogJ1swLTVdWzAtOV0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5zZWNvbmRzID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ3NzJyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3MnLFxuICAgICAgICByZWdleDogJ1swLTldfFsxLTVdWzAtOV0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHsgdGhpcy5zZWNvbmRzID0gK3ZhbHVlOyB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ3MnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnYScsXG4gICAgICAgIHJlZ2V4OiAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuQU1QTVMuam9pbignfCcpLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5ob3VycyA9PT0gMTIpIHtcbiAgICAgICAgICAgIHRoaXMuaG91cnMgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJ1BNJykge1xuICAgICAgICAgICAgdGhpcy5ob3VycyArPSAxMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnYScpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdaJyxcbiAgICAgICAgcmVnZXg6ICdbKy1dXFxcXGR7NH0nLFxuICAgICAgICBhcHBseTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKC8oWystXSkoXFxkezJ9KShcXGR7Mn0pLyksXG4gICAgICAgICAgICBzaWduID0gbWF0Y2hlc1sxXSxcbiAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hlc1syXSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaGVzWzNdO1xuICAgICAgICAgIHRoaXMuaG91cnMgKz0gdG9JbnQoc2lnbiArIGhvdXJzKTtcbiAgICAgICAgICB0aGlzLm1pbnV0ZXMgKz0gdG9JbnQoc2lnbiArIG1pbnV0ZXMpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnWicpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICd3dycsXG4gICAgICAgIHJlZ2V4OiAnWzAtNF1bMC05XXw1WzAtM10nLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ3d3Jyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ3cnLFxuICAgICAgICByZWdleDogJ1swLTldfFsxLTRdWzAtOV18NVswLTNdJyxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlKSB7IHJldHVybiBkYXRlRmlsdGVyKGRhdGUsICd3Jyk7IH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogJ0dHR0cnLFxuICAgICAgICByZWdleDogJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLkVSQU5BTUVTLmpvaW4oJ3wnKS5yZXBsYWNlKC9cXHMvZywgJ1xcXFxzJyksXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnR0dHRycpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdHR0cnLFxuICAgICAgICByZWdleDogJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLkVSQVMuam9pbignfCcpLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIGRhdGVGaWx0ZXIoZGF0ZSwgJ0dHRycpOyB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6ICdHRycsXG4gICAgICAgIHJlZ2V4OiAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuRVJBUy5qb2luKCd8JyksXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnR0cnKTsgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnRycsXG4gICAgICAgIHJlZ2V4OiAkbG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuRVJBUy5qb2luKCd8JyksXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oZGF0ZSkgeyByZXR1cm4gZGF0ZUZpbHRlcihkYXRlLCAnRycpOyB9XG4gICAgICB9XG4gICAgXTtcbiAgfTtcblxuICB0aGlzLmluaXQoKTtcblxuICBmdW5jdGlvbiBjcmVhdGVQYXJzZXIoZm9ybWF0LCBmdW5jKSB7XG4gICAgdmFyIG1hcCA9IFtdLCByZWdleCA9IGZvcm1hdC5zcGxpdCgnJyk7XG5cbiAgICAvLyBjaGVjayBmb3IgbGl0ZXJhbCB2YWx1ZXNcbiAgICB2YXIgcXVvdGVJbmRleCA9IGZvcm1hdC5pbmRleE9mKCdcXCcnKTtcbiAgICBpZiAocXVvdGVJbmRleCA+IC0xKSB7XG4gICAgICB2YXIgaW5MaXRlcmFsID0gZmFsc2U7XG4gICAgICBmb3JtYXQgPSBmb3JtYXQuc3BsaXQoJycpO1xuICAgICAgZm9yICh2YXIgaSA9IHF1b3RlSW5kZXg7IGkgPCBmb3JtYXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGluTGl0ZXJhbCkge1xuICAgICAgICAgIGlmIChmb3JtYXRbaV0gPT09ICdcXCcnKSB7XG4gICAgICAgICAgICBpZiAoaSArIDEgPCBmb3JtYXQubGVuZ3RoICYmIGZvcm1hdFtpKzFdID09PSAnXFwnJykgeyAvLyBlc2NhcGVkIHNpbmdsZSBxdW90ZVxuICAgICAgICAgICAgICBmb3JtYXRbaSsxXSA9ICckJztcbiAgICAgICAgICAgICAgcmVnZXhbaSsxXSA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHsgLy8gZW5kIG9mIGxpdGVyYWxcbiAgICAgICAgICAgICAgcmVnZXhbaV0gPSAnJztcbiAgICAgICAgICAgICAgaW5MaXRlcmFsID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvcm1hdFtpXSA9ICckJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZm9ybWF0W2ldID09PSAnXFwnJykgeyAvLyBzdGFydCBvZiBsaXRlcmFsXG4gICAgICAgICAgICBmb3JtYXRbaV0gPSAnJCc7XG4gICAgICAgICAgICByZWdleFtpXSA9ICcnO1xuICAgICAgICAgICAgaW5MaXRlcmFsID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9ybWF0ID0gZm9ybWF0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIGFuZ3VsYXIuZm9yRWFjaChmb3JtYXRDb2RlVG9SZWdleCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIGluZGV4ID0gZm9ybWF0LmluZGV4T2YoZGF0YS5rZXkpO1xuXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICBmb3JtYXQgPSBmb3JtYXQuc3BsaXQoJycpO1xuXG4gICAgICAgIHJlZ2V4W2luZGV4XSA9ICcoJyArIGRhdGEucmVnZXggKyAnKSc7XG4gICAgICAgIGZvcm1hdFtpbmRleF0gPSAnJCc7IC8vIEN1c3RvbSBzeW1ib2wgdG8gZGVmaW5lIGNvbnN1bWVkIHBhcnQgb2YgZm9ybWF0XG4gICAgICAgIGZvciAodmFyIGkgPSBpbmRleCArIDEsIG4gPSBpbmRleCArIGRhdGEua2V5Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgIHJlZ2V4W2ldID0gJyc7XG4gICAgICAgICAgZm9ybWF0W2ldID0gJyQnO1xuICAgICAgICB9XG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdC5qb2luKCcnKTtcblxuICAgICAgICBtYXAucHVzaCh7XG4gICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgIGtleTogZGF0YS5rZXksXG4gICAgICAgICAgYXBwbHk6IGRhdGFbZnVuY10sXG4gICAgICAgICAgbWF0Y2hlcjogZGF0YS5yZWdleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyByZWdleC5qb2luKCcnKSArICckJyksXG4gICAgICBtYXA6IG9yZGVyQnlGaWx0ZXIobWFwLCAnaW5kZXgnKVxuICAgIH07XG4gIH1cblxuICB0aGlzLmZpbHRlciA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCkge1xuICAgIGlmICghYW5ndWxhci5pc0RhdGUoZGF0ZSkgfHwgaXNOYU4oZGF0ZSkgfHwgIWZvcm1hdCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZvcm1hdCA9ICRsb2NhbGUuREFURVRJTUVfRk9STUFUU1tmb3JtYXRdIHx8IGZvcm1hdDtcblxuICAgIGlmICgkbG9jYWxlLmlkICE9PSBsb2NhbGVJZCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmZvcm1hdHRlcnNbZm9ybWF0XSkge1xuICAgICAgdGhpcy5mb3JtYXR0ZXJzW2Zvcm1hdF0gPSBjcmVhdGVQYXJzZXIoZm9ybWF0LCAnZm9ybWF0dGVyJyk7XG4gICAgfVxuXG4gICAgdmFyIHBhcnNlciA9IHRoaXMuZm9ybWF0dGVyc1tmb3JtYXRdLFxuICAgICAgbWFwID0gcGFyc2VyLm1hcDtcblxuICAgIHZhciBfZm9ybWF0ID0gZm9ybWF0O1xuXG4gICAgcmV0dXJuIG1hcC5yZWR1Y2UoZnVuY3Rpb24oc3RyLCBtYXBwZXIsIGkpIHtcbiAgICAgIHZhciBtYXRjaCA9IF9mb3JtYXQubWF0Y2gobmV3IFJlZ0V4cCgnKC4qKScgKyBtYXBwZXIua2V5KSk7XG4gICAgICBpZiAobWF0Y2ggJiYgYW5ndWxhci5pc1N0cmluZyhtYXRjaFsxXSkpIHtcbiAgICAgICAgc3RyICs9IG1hdGNoWzFdO1xuICAgICAgICBfZm9ybWF0ID0gX2Zvcm1hdC5yZXBsYWNlKG1hdGNoWzFdICsgbWFwcGVyLmtleSwgJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAobWFwcGVyLmFwcGx5KSB7XG4gICAgICAgIHJldHVybiBzdHIgKyBtYXBwZXIuYXBwbHkuY2FsbChudWxsLCBkYXRlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LCAnJyk7XG4gIH07XG5cbiAgdGhpcy5wYXJzZSA9IGZ1bmN0aW9uKGlucHV0LCBmb3JtYXQsIGJhc2VEYXRlKSB7XG4gICAgaWYgKCFhbmd1bGFyLmlzU3RyaW5nKGlucHV0KSB8fCAhZm9ybWF0KSB7XG4gICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgZm9ybWF0ID0gJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTW2Zvcm1hdF0gfHwgZm9ybWF0O1xuICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKFNQRUNJQUxfQ0hBUkFDVEVSU19SRUdFWFAsICdcXFxcJCYnKTtcblxuICAgIGlmICgkbG9jYWxlLmlkICE9PSBsb2NhbGVJZCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnBhcnNlcnNbZm9ybWF0XSkge1xuICAgICAgdGhpcy5wYXJzZXJzW2Zvcm1hdF0gPSBjcmVhdGVQYXJzZXIoZm9ybWF0LCAnYXBwbHknKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyc2VyID0gdGhpcy5wYXJzZXJzW2Zvcm1hdF0sXG4gICAgICAgIHJlZ2V4ID0gcGFyc2VyLnJlZ2V4LFxuICAgICAgICBtYXAgPSBwYXJzZXIubWFwLFxuICAgICAgICByZXN1bHRzID0gaW5wdXQubWF0Y2gocmVnZXgpLFxuICAgICAgICB0ek9mZnNldCA9IGZhbHNlO1xuICAgIGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICB2YXIgZmllbGRzLCBkdDtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGF0ZShiYXNlRGF0ZSkgJiYgIWlzTmFOKGJhc2VEYXRlLmdldFRpbWUoKSkpIHtcbiAgICAgICAgZmllbGRzID0ge1xuICAgICAgICAgIHllYXI6IGJhc2VEYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgbW9udGg6IGJhc2VEYXRlLmdldE1vbnRoKCksXG4gICAgICAgICAgZGF0ZTogYmFzZURhdGUuZ2V0RGF0ZSgpLFxuICAgICAgICAgIGhvdXJzOiBiYXNlRGF0ZS5nZXRIb3VycygpLFxuICAgICAgICAgIG1pbnV0ZXM6IGJhc2VEYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgICBzZWNvbmRzOiBiYXNlRGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgICAgICAgbWlsbGlzZWNvbmRzOiBiYXNlRGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGJhc2VEYXRlKSB7XG4gICAgICAgICAgJGxvZy53YXJuKCdkYXRlcGFyc2VyOicsICdiYXNlRGF0ZSBpcyBub3QgYSB2YWxpZCBkYXRlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZmllbGRzID0geyB5ZWFyOiAxOTAwLCBtb250aDogMCwgZGF0ZTogMSwgaG91cnM6IDAsIG1pbnV0ZXM6IDAsIHNlY29uZHM6IDAsIG1pbGxpc2Vjb25kczogMCB9O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMSwgbiA9IHJlc3VsdHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciBtYXBwZXIgPSBtYXBbaSAtIDFdO1xuICAgICAgICBpZiAobWFwcGVyLm1hdGNoZXIgPT09ICdaJykge1xuICAgICAgICAgIHR6T2Zmc2V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBwZXIuYXBwbHkpIHtcbiAgICAgICAgICBtYXBwZXIuYXBwbHkuY2FsbChmaWVsZHMsIHJlc3VsdHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRlc2V0dGVyID0gdHpPZmZzZXQgPyBEYXRlLnByb3RvdHlwZS5zZXRVVENGdWxsWWVhciA6XG4gICAgICAgIERhdGUucHJvdG90eXBlLnNldEZ1bGxZZWFyO1xuICAgICAgdmFyIHRpbWVzZXR0ZXIgPSB0ek9mZnNldCA/IERhdGUucHJvdG90eXBlLnNldFVUQ0hvdXJzIDpcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUuc2V0SG91cnM7XG5cbiAgICAgIGlmIChpc1ZhbGlkKGZpZWxkcy55ZWFyLCBmaWVsZHMubW9udGgsIGZpZWxkcy5kYXRlKSkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc0RhdGUoYmFzZURhdGUpICYmICFpc05hTihiYXNlRGF0ZS5nZXRUaW1lKCkpICYmICF0ek9mZnNldCkge1xuICAgICAgICAgIGR0ID0gbmV3IERhdGUoYmFzZURhdGUpO1xuICAgICAgICAgIGRhdGVzZXR0ZXIuY2FsbChkdCwgZmllbGRzLnllYXIsIGZpZWxkcy5tb250aCwgZmllbGRzLmRhdGUpO1xuICAgICAgICAgIHRpbWVzZXR0ZXIuY2FsbChkdCwgZmllbGRzLmhvdXJzLCBmaWVsZHMubWludXRlcyxcbiAgICAgICAgICAgIGZpZWxkcy5zZWNvbmRzLCBmaWVsZHMubWlsbGlzZWNvbmRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkdCA9IG5ldyBEYXRlKDApO1xuICAgICAgICAgIGRhdGVzZXR0ZXIuY2FsbChkdCwgZmllbGRzLnllYXIsIGZpZWxkcy5tb250aCwgZmllbGRzLmRhdGUpO1xuICAgICAgICAgIHRpbWVzZXR0ZXIuY2FsbChkdCwgZmllbGRzLmhvdXJzIHx8IDAsIGZpZWxkcy5taW51dGVzIHx8IDAsXG4gICAgICAgICAgICBmaWVsZHMuc2Vjb25kcyB8fCAwLCBmaWVsZHMubWlsbGlzZWNvbmRzIHx8IDApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkdDtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ2hlY2sgaWYgZGF0ZSBpcyB2YWxpZCBmb3Igc3BlY2lmaWMgbW9udGggKGFuZCB5ZWFyIGZvciBGZWJydWFyeSkuXG4gIC8vIE1vbnRoOiAwID0gSmFuLCAxID0gRmViLCBldGNcbiAgZnVuY3Rpb24gaXNWYWxpZCh5ZWFyLCBtb250aCwgZGF0ZSkge1xuICAgIGlmIChkYXRlIDwgMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChtb250aCA9PT0gMSAmJiBkYXRlID4gMjgpIHtcbiAgICAgIHJldHVybiBkYXRlID09PSAyOSAmJiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCB8fCB5ZWFyICUgNDAwID09PSAwKTtcbiAgICB9XG5cbiAgICBpZiAobW9udGggPT09IDMgfHwgbW9udGggPT09IDUgfHwgbW9udGggPT09IDggfHwgbW9udGggPT09IDEwKSB7XG4gICAgICByZXR1cm4gZGF0ZSA8IDMxO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9JbnQoc3RyKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHN0ciwgMTApO1xuICB9XG5cbiAgdGhpcy50b1RpbWV6b25lID0gdG9UaW1lem9uZTtcbiAgdGhpcy5mcm9tVGltZXpvbmUgPSBmcm9tVGltZXpvbmU7XG4gIHRoaXMudGltZXpvbmVUb09mZnNldCA9IHRpbWV6b25lVG9PZmZzZXQ7XG4gIHRoaXMuYWRkRGF0ZU1pbnV0ZXMgPSBhZGREYXRlTWludXRlcztcbiAgdGhpcy5jb252ZXJ0VGltZXpvbmVUb0xvY2FsID0gY29udmVydFRpbWV6b25lVG9Mb2NhbDtcblxuICBmdW5jdGlvbiB0b1RpbWV6b25lKGRhdGUsIHRpbWV6b25lKSB7XG4gICAgcmV0dXJuIGRhdGUgJiYgdGltZXpvbmUgPyBjb252ZXJ0VGltZXpvbmVUb0xvY2FsKGRhdGUsIHRpbWV6b25lKSA6IGRhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBmcm9tVGltZXpvbmUoZGF0ZSwgdGltZXpvbmUpIHtcbiAgICByZXR1cm4gZGF0ZSAmJiB0aW1lem9uZSA/IGNvbnZlcnRUaW1lem9uZVRvTG9jYWwoZGF0ZSwgdGltZXpvbmUsIHRydWUpIDogZGF0ZTtcbiAgfVxuXG4gIC8vaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iLzRkYWFmZDNkYmU2YTgwZDU3OGY1YTMxZGYxYmI5OWM3NzU1OTU0M2Uvc3JjL0FuZ3VsYXIuanMjTDEyMDdcbiAgZnVuY3Rpb24gdGltZXpvbmVUb09mZnNldCh0aW1lem9uZSwgZmFsbGJhY2spIHtcbiAgICB2YXIgcmVxdWVzdGVkVGltZXpvbmVPZmZzZXQgPSBEYXRlLnBhcnNlKCdKYW4gMDEsIDE5NzAgMDA6MDA6MDAgJyArIHRpbWV6b25lKSAvIDYwMDAwO1xuICAgIHJldHVybiBpc05hTihyZXF1ZXN0ZWRUaW1lem9uZU9mZnNldCkgPyBmYWxsYmFjayA6IHJlcXVlc3RlZFRpbWV6b25lT2Zmc2V0O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkRGF0ZU1pbnV0ZXMoZGF0ZSwgbWludXRlcykge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XG4gICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgbWludXRlcyk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0VGltZXpvbmVUb0xvY2FsKGRhdGUsIHRpbWV6b25lLCByZXZlcnNlKSB7XG4gICAgcmV2ZXJzZSA9IHJldmVyc2UgPyAtMSA6IDE7XG4gICAgdmFyIHRpbWV6b25lT2Zmc2V0ID0gdGltZXpvbmVUb09mZnNldCh0aW1lem9uZSwgZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpKTtcbiAgICByZXR1cm4gYWRkRGF0ZU1pbnV0ZXMoZGF0ZSwgcmV2ZXJzZSAqICh0aW1lem9uZU9mZnNldCAtIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSkpO1xuICB9XG59XSk7XG5cbi8vIEF2b2lkaW5nIHVzZSBvZiBuZy1jbGFzcyBhcyBpdCBjcmVhdGVzIGEgbG90IG9mIHdhdGNoZXJzIHdoZW4gYSBjbGFzcyBpcyB0byBiZSBhcHBsaWVkIHRvXG4vLyBhdCBtb3N0IG9uZSBlbGVtZW50LlxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5pc0NsYXNzJywgW10pXG4uZGlyZWN0aXZlKCd1aWJJc0NsYXNzJywgW1xuICAgICAgICAgJyRhbmltYXRlJyxcbmZ1bmN0aW9uICgkYW5pbWF0ZSkge1xuICAvLyAgICAgICAgICAgICAgICAgICAgMTExMTExMTEgICAgICAgICAgMjIyMjIyMjJcbiAgdmFyIE9OX1JFR0VYUCA9IC9eXFxzKihbXFxzXFxTXSs/KVxccytvblxccysoW1xcc1xcU10rPylcXHMqJC87XG4gIC8vICAgICAgICAgICAgICAgICAgICAxMTExMTExMSAgICAgICAgICAgMjIyMjIyMjJcbiAgdmFyIElTX1JFR0VYUCA9IC9eXFxzKihbXFxzXFxTXSs/KVxccytmb3JcXHMrKFtcXHNcXFNdKz8pXFxzKiQvO1xuXG4gIHZhciBkYXRhUGVyVHJhY2tlZCA9IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBjb21waWxlOiBmdW5jdGlvbiAodEVsZW1lbnQsIHRBdHRycykge1xuICAgICAgdmFyIGxpbmtlZFNjb3BlcyA9IFtdO1xuICAgICAgdmFyIGluc3RhbmNlcyA9IFtdO1xuICAgICAgdmFyIGV4cFRvRGF0YSA9IHt9O1xuICAgICAgdmFyIGxhc3RBY3RpdmF0ZWQgPSBudWxsO1xuICAgICAgdmFyIG9uRXhwTWF0Y2hlcyA9IHRBdHRycy51aWJJc0NsYXNzLm1hdGNoKE9OX1JFR0VYUCk7XG4gICAgICB2YXIgb25FeHAgPSBvbkV4cE1hdGNoZXNbMl07XG4gICAgICB2YXIgZXhwc1N0ciA9IG9uRXhwTWF0Y2hlc1sxXTtcbiAgICAgIHZhciBleHBzID0gZXhwc1N0ci5zcGxpdCgnLCcpO1xuXG4gICAgICByZXR1cm4gbGlua0ZuO1xuXG4gICAgICBmdW5jdGlvbiBsaW5rRm4oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGxpbmtlZFNjb3Blcy5wdXNoKHNjb3BlKTtcbiAgICAgICAgaW5zdGFuY2VzLnB1c2goe1xuICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cHMuZm9yRWFjaChmdW5jdGlvbiAoZXhwLCBrKSB7XG4gICAgICAgICAgYWRkRm9yRXhwKGV4cCwgc2NvcGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgcmVtb3ZlU2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRGb3JFeHAoZXhwLCBzY29wZSkge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IGV4cC5tYXRjaChJU19SRUdFWFApO1xuICAgICAgICB2YXIgY2xhenogPSBzY29wZS4kZXZhbChtYXRjaGVzWzFdKTtcbiAgICAgICAgdmFyIGNvbXBhcmVXaXRoRXhwID0gbWF0Y2hlc1syXTtcbiAgICAgICAgdmFyIGRhdGEgPSBleHBUb0RhdGFbZXhwXTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgdmFyIHdhdGNoRm4gPSBmdW5jdGlvbiAoY29tcGFyZVdpdGhWYWwpIHtcbiAgICAgICAgICAgIHZhciBuZXdBY3RpdmF0ZWQgPSBudWxsO1xuICAgICAgICAgICAgaW5zdGFuY2VzLnNvbWUoZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIHZhciB0aGlzVmFsID0gaW5zdGFuY2Uuc2NvcGUuJGV2YWwob25FeHApO1xuICAgICAgICAgICAgICBpZiAodGhpc1ZhbCA9PT0gY29tcGFyZVdpdGhWYWwpIHtcbiAgICAgICAgICAgICAgICBuZXdBY3RpdmF0ZWQgPSBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZGF0YS5sYXN0QWN0aXZhdGVkICE9PSBuZXdBY3RpdmF0ZWQpIHtcbiAgICAgICAgICAgICAgaWYgKGRhdGEubGFzdEFjdGl2YXRlZCkge1xuICAgICAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKGRhdGEubGFzdEFjdGl2YXRlZC5lbGVtZW50LCBjbGF6eik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKG5ld0FjdGl2YXRlZCkge1xuICAgICAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKG5ld0FjdGl2YXRlZC5lbGVtZW50LCBjbGF6eik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGF0YS5sYXN0QWN0aXZhdGVkID0gbmV3QWN0aXZhdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgZXhwVG9EYXRhW2V4cF0gPSBkYXRhID0ge1xuICAgICAgICAgICAgbGFzdEFjdGl2YXRlZDogbnVsbCxcbiAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgIHdhdGNoRm46IHdhdGNoRm4sXG4gICAgICAgICAgICBjb21wYXJlV2l0aEV4cDogY29tcGFyZVdpdGhFeHAsXG4gICAgICAgICAgICB3YXRjaGVyOiBzY29wZS4kd2F0Y2goY29tcGFyZVdpdGhFeHAsIHdhdGNoRm4pXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLndhdGNoRm4oc2NvcGUuJGV2YWwoY29tcGFyZVdpdGhFeHApKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlU2NvcGUoZSkge1xuICAgICAgICB2YXIgcmVtb3ZlZFNjb3BlID0gZS50YXJnZXRTY29wZTtcbiAgICAgICAgdmFyIGluZGV4ID0gbGlua2VkU2NvcGVzLmluZGV4T2YocmVtb3ZlZFNjb3BlKTtcbiAgICAgICAgbGlua2VkU2NvcGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGluc3RhbmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpZiAobGlua2VkU2NvcGVzLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBuZXdXYXRjaFNjb3BlID0gbGlua2VkU2NvcGVzWzBdO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChleHBUb0RhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zY29wZSA9PT0gcmVtb3ZlZFNjb3BlKSB7XG4gICAgICAgICAgICAgIGRhdGEud2F0Y2hlciA9IG5ld1dhdGNoU2NvcGUuJHdhdGNoKGRhdGEuY29tcGFyZVdpdGhFeHAsIGRhdGEud2F0Y2hGbik7XG4gICAgICAgICAgICAgIGRhdGEuc2NvcGUgPSBuZXdXYXRjaFNjb3BlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGV4cFRvRGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufV0pO1xuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5wb3NpdGlvbicsIFtdKVxuXG4vKipcbiAqIEEgc2V0IG9mIHV0aWxpdHkgbWV0aG9kcyBmb3Igd29ya2luZyB3aXRoIHRoZSBET00uXG4gKiBJdCBpcyBtZWFudCB0byBiZSB1c2VkIHdoZXJlIHdlIG5lZWQgdG8gYWJzb2x1dGUtcG9zaXRpb24gZWxlbWVudHMgaW5cbiAqIHJlbGF0aW9uIHRvIGFub3RoZXIgZWxlbWVudCAodGhpcyBpcyB0aGUgY2FzZSBmb3IgdG9vbHRpcHMsIHBvcG92ZXJzLFxuICogdHlwZWFoZWFkIHN1Z2dlc3Rpb25zIGV0Yy4pLlxuICovXG4gIC5mYWN0b3J5KCckdWliUG9zaXRpb24nLCBbJyRkb2N1bWVudCcsICckd2luZG93JywgZnVuY3Rpb24oJGRvY3VtZW50LCAkd2luZG93KSB7XG4gICAgLyoqXG4gICAgICogVXNlZCBieSBzY3JvbGxiYXJXaWR0aCgpIGZ1bmN0aW9uIHRvIGNhY2hlIHNjcm9sbGJhcidzIHdpZHRoLlxuICAgICAqIERvIG5vdCBhY2Nlc3MgdGhpcyB2YXJpYWJsZSBkaXJlY3RseSwgdXNlIHNjcm9sbGJhcldpZHRoKCkgaW5zdGVhZC5cbiAgICAgKi9cbiAgICB2YXIgU0NST0xMQkFSX1dJRFRIO1xuICAgIHZhciBPVkVSRkxPV19SRUdFWCA9IHtcbiAgICAgIG5vcm1hbDogLyhhdXRvfHNjcm9sbCkvLFxuICAgICAgaGlkZGVuOiAvKGF1dG98c2Nyb2xsfGhpZGRlbikvXG4gICAgfTtcbiAgICB2YXIgUExBQ0VNRU5UX1JFR0VYID0ge1xuICAgICAgYXV0bzogL1xccz9hdXRvP1xccz8vaSxcbiAgICAgIHByaW1hcnk6IC9eKHRvcHxib3R0b218bGVmdHxyaWdodCkkLyxcbiAgICAgIHNlY29uZGFyeTogL14odG9wfGJvdHRvbXxsZWZ0fHJpZ2h0fGNlbnRlcikkLyxcbiAgICAgIHZlcnRpY2FsOiAvXih0b3B8Ym90dG9tKSQvXG4gICAgfTtcblxuICAgIHJldHVybiB7XG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgYSByYXcgRE9NIGVsZW1lbnQgZnJvbSBhIGpRdWVyeS9qUUxpdGUgZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW0gLSBUaGUgZWxlbWVudCB0byBjb252ZXJ0LlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtlbGVtZW50fSBBIEhUTUwgZWxlbWVudC5cbiAgICAgICAqL1xuICAgICAgZ2V0UmF3Tm9kZTogZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICByZXR1cm4gZWxlbVswXSB8fCBlbGVtO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm92aWRlcyBhIHBhcnNlZCBudW1iZXIgZm9yIGEgc3R5bGUgcHJvcGVydHkuICBTdHJpcHNcbiAgICAgICAqIHVuaXRzIGFuZCBjYXN0cyBpbnZhbGlkIG51bWJlcnMgdG8gMC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBUaGUgc3R5bGUgdmFsdWUgdG8gcGFyc2UuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge251bWJlcn0gQSB2YWxpZCBudW1iZXIuXG4gICAgICAgKi9cbiAgICAgIHBhcnNlU3R5bGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgPyB2YWx1ZSA6IDA7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIHRoZSBjbG9zZXN0IHBvc2l0aW9uZWQgYW5jZXN0b3IuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtZW50IC0gVGhlIGVsZW1lbnQgdG8gZ2V0IHRoZSBvZmZlc3QgcGFyZW50IGZvci5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZWxlbWVudH0gVGhlIGNsb3Nlc3QgcG9zaXRpb25lZCBhbmNlc3Rvci5cbiAgICAgICAqL1xuICAgICAgb2Zmc2V0UGFyZW50OiBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgIGVsZW0gPSB0aGlzLmdldFJhd05vZGUoZWxlbSk7XG5cbiAgICAgICAgdmFyIG9mZnNldFBhcmVudCA9IGVsZW0ub2Zmc2V0UGFyZW50IHx8ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgZnVuY3Rpb24gaXNTdGF0aWNQb3NpdGlvbmVkKGVsKSB7XG4gICAgICAgICAgcmV0dXJuICgkd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnBvc2l0aW9uIHx8ICdzdGF0aWMnKSA9PT0gJ3N0YXRpYyc7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIG9mZnNldFBhcmVudCAhPT0gJGRvY3VtZW50WzBdLmRvY3VtZW50RWxlbWVudCAmJiBpc1N0YXRpY1Bvc2l0aW9uZWQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIHRoZSBzY3JvbGxiYXIgd2lkdGgsIGNvbmNlcHQgZnJvbSBUV0JTIG1lYXN1cmVTY3JvbGxiYXIoKVxuICAgICAgICogZnVuY3Rpb24gaW4gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL2pzL21vZGFsLmpzXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHdpZHRoIG9mIHRoZSBicm93c2VyIHNjb2xsYmFyLlxuICAgICAgICovXG4gICAgICBzY3JvbGxiYXJXaWR0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKFNDUk9MTEJBUl9XSURUSCkpIHtcbiAgICAgICAgICB2YXIgc2Nyb2xsRWxlbSA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAtOTk5OXB4OyB3aWR0aDogNTBweDsgaGVpZ2h0OiA1MHB4OyBvdmVyZmxvdzogc2Nyb2xsO1wiPjwvZGl2PicpO1xuICAgICAgICAgICRkb2N1bWVudC5maW5kKCdib2R5JykuYXBwZW5kKHNjcm9sbEVsZW0pO1xuICAgICAgICAgIFNDUk9MTEJBUl9XSURUSCA9IHNjcm9sbEVsZW1bMF0ub2Zmc2V0V2lkdGggLSBzY3JvbGxFbGVtWzBdLmNsaWVudFdpZHRoO1xuICAgICAgICAgIFNDUk9MTEJBUl9XSURUSCA9IGlzRmluaXRlKFNDUk9MTEJBUl9XSURUSCkgPyBTQ1JPTExCQVJfV0lEVEggOiAwO1xuICAgICAgICAgIHNjcm9sbEVsZW0ucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gU0NST0xMQkFSX1dJRFRIO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm92aWRlcyB0aGUgY2xvc2VzdCBzY3JvbGxhYmxlIGFuY2VzdG9yLlxuICAgICAgICogQSBwb3J0IG9mIHRoZSBqUXVlcnkgVUkgc2Nyb2xsUGFyZW50IG1ldGhvZDpcbiAgICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5LXVpL2Jsb2IvbWFzdGVyL3VpL3Njcm9sbC1wYXJlbnQuanNcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW0gLSBUaGUgZWxlbWVudCB0byBmaW5kIHRoZSBzY3JvbGwgcGFyZW50IG9mLlxuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gW2luY2x1ZGVIaWRkZW49ZmFsc2VdIC0gU2hvdWxkIHNjcm9sbCBzdHlsZSBvZiAnaGlkZGVuJyBiZSBjb25zaWRlcmVkLFxuICAgICAgICogICBkZWZhdWx0IGlzIGZhbHNlLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtlbGVtZW50fSBBIEhUTUwgZWxlbWVudC5cbiAgICAgICAqL1xuICAgICAgc2Nyb2xsUGFyZW50OiBmdW5jdGlvbihlbGVtLCBpbmNsdWRlSGlkZGVuKSB7XG4gICAgICAgIGVsZW0gPSB0aGlzLmdldFJhd05vZGUoZWxlbSk7XG5cbiAgICAgICAgdmFyIG92ZXJmbG93UmVnZXggPSBpbmNsdWRlSGlkZGVuID8gT1ZFUkZMT1dfUkVHRVguaGlkZGVuIDogT1ZFUkZMT1dfUkVHRVgubm9ybWFsO1xuICAgICAgICB2YXIgZG9jdW1lbnRFbCA9ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHZhciBlbGVtU3R5bGUgPSAkd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG4gICAgICAgIHZhciBleGNsdWRlU3RhdGljID0gZWxlbVN0eWxlLnBvc2l0aW9uID09PSAnYWJzb2x1dGUnO1xuICAgICAgICB2YXIgc2Nyb2xsUGFyZW50ID0gZWxlbS5wYXJlbnRFbGVtZW50IHx8IGRvY3VtZW50RWw7XG5cbiAgICAgICAgaWYgKHNjcm9sbFBhcmVudCA9PT0gZG9jdW1lbnRFbCB8fCBlbGVtU3R5bGUucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICByZXR1cm4gZG9jdW1lbnRFbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChzY3JvbGxQYXJlbnQucGFyZW50RWxlbWVudCAmJiBzY3JvbGxQYXJlbnQgIT09IGRvY3VtZW50RWwpIHtcbiAgICAgICAgICB2YXIgc3BTdHlsZSA9ICR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzY3JvbGxQYXJlbnQpO1xuICAgICAgICAgIGlmIChleGNsdWRlU3RhdGljICYmIHNwU3R5bGUucG9zaXRpb24gIT09ICdzdGF0aWMnKSB7XG4gICAgICAgICAgICBleGNsdWRlU3RhdGljID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFleGNsdWRlU3RhdGljICYmIG92ZXJmbG93UmVnZXgudGVzdChzcFN0eWxlLm92ZXJmbG93ICsgc3BTdHlsZS5vdmVyZmxvd1kgKyBzcFN0eWxlLm92ZXJmbG93WCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY3JvbGxQYXJlbnQgPSBzY3JvbGxQYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzY3JvbGxQYXJlbnQ7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIHJlYWQtb25seSBlcXVpdmFsZW50IG9mIGpRdWVyeSdzIHBvc2l0aW9uIGZ1bmN0aW9uOlxuICAgICAgICogaHR0cDovL2FwaS5qcXVlcnkuY29tL3Bvc2l0aW9uLyAtIGRpc3RhbmNlIHRvIGNsb3Nlc3QgcG9zaXRpb25lZFxuICAgICAgICogYW5jZXN0b3IuICBEb2VzIG5vdCBhY2NvdW50IGZvciBtYXJnaW5zIGJ5IGRlZmF1bHQgbGlrZSBqUXVlcnkgcG9zaXRpb24uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtIC0gVGhlIGVsZW1lbnQgdG8gY2FjbHVsYXRlIHRoZSBwb3NpdGlvbiBvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IFtpbmNsdWRlTWFyZ2lucz1mYWxzZV0gLSBTaG91bGQgbWFyZ2lucyBiZSBhY2NvdW50ZWRcbiAgICAgICAqIGZvciwgZGVmYXVsdCBpcyBmYWxzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAgICAgKiAgIDx1bD5cbiAgICAgICAqICAgICA8bGk+Kip3aWR0aCoqOiB0aGUgd2lkdGggb2YgdGhlIGVsZW1lbnQ8L2xpPlxuICAgICAgICogICAgIDxsaT4qKmhlaWdodCoqOiB0aGUgaGVpZ2h0IG9mIHRoZSBlbGVtZW50PC9saT5cbiAgICAgICAqICAgICA8bGk+Kip0b3AqKjogZGlzdGFuY2UgdG8gdG9wIGVkZ2Ugb2Ygb2Zmc2V0IHBhcmVudDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqbGVmdCoqOiBkaXN0YW5jZSB0byBsZWZ0IGVkZ2Ugb2Ygb2Zmc2V0IHBhcmVudDwvbGk+XG4gICAgICAgKiAgIDwvdWw+XG4gICAgICAgKi9cbiAgICAgIHBvc2l0aW9uOiBmdW5jdGlvbihlbGVtLCBpbmNsdWRlTWFnaW5zKSB7XG4gICAgICAgIGVsZW0gPSB0aGlzLmdldFJhd05vZGUoZWxlbSk7XG5cbiAgICAgICAgdmFyIGVsZW1PZmZzZXQgPSB0aGlzLm9mZnNldChlbGVtKTtcbiAgICAgICAgaWYgKGluY2x1ZGVNYWdpbnMpIHtcbiAgICAgICAgICB2YXIgZWxlbVN0eWxlID0gJHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xuICAgICAgICAgIGVsZW1PZmZzZXQudG9wIC09IHRoaXMucGFyc2VTdHlsZShlbGVtU3R5bGUubWFyZ2luVG9wKTtcbiAgICAgICAgICBlbGVtT2Zmc2V0LmxlZnQgLT0gdGhpcy5wYXJzZVN0eWxlKGVsZW1TdHlsZS5tYXJnaW5MZWZ0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQoZWxlbSk7XG4gICAgICAgIHZhciBwYXJlbnRPZmZzZXQgPSB7dG9wOiAwLCBsZWZ0OiAwfTtcblxuICAgICAgICBpZiAocGFyZW50ICE9PSAkZG9jdW1lbnRbMF0uZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgICAgcGFyZW50T2Zmc2V0ID0gdGhpcy5vZmZzZXQocGFyZW50KTtcbiAgICAgICAgICBwYXJlbnRPZmZzZXQudG9wICs9IHBhcmVudC5jbGllbnRUb3AgLSBwYXJlbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgIHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcmVudC5jbGllbnRMZWZ0IC0gcGFyZW50LnNjcm9sbExlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKGFuZ3VsYXIuaXNOdW1iZXIoZWxlbU9mZnNldC53aWR0aCkgPyBlbGVtT2Zmc2V0LndpZHRoIDogZWxlbS5vZmZzZXRXaWR0aCksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGFuZ3VsYXIuaXNOdW1iZXIoZWxlbU9mZnNldC5oZWlnaHQpID8gZWxlbU9mZnNldC5oZWlnaHQgOiBlbGVtLm9mZnNldEhlaWdodCksXG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKGVsZW1PZmZzZXQudG9wIC0gcGFyZW50T2Zmc2V0LnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChlbGVtT2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdClcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgcmVhZC1vbmx5IGVxdWl2YWxlbnQgb2YgalF1ZXJ5J3Mgb2Zmc2V0IGZ1bmN0aW9uOlxuICAgICAgICogaHR0cDovL2FwaS5qcXVlcnkuY29tL29mZnNldC8gLSBkaXN0YW5jZSB0byB2aWV3cG9ydC4gIERvZXNcbiAgICAgICAqIG5vdCBhY2NvdW50IGZvciBib3JkZXJzLCBtYXJnaW5zLCBvciBwYWRkaW5nIG9uIHRoZSBib2R5XG4gICAgICAgKiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbSAtIFRoZSBlbGVtZW50IHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0IG9uLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICAgICAqICAgPHVsPlxuICAgICAgICogICAgIDxsaT4qKndpZHRoKio6IHRoZSB3aWR0aCBvZiB0aGUgZWxlbWVudDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqaGVpZ2h0Kio6IHRoZSBoZWlnaHQgb2YgdGhlIGVsZW1lbnQ8L2xpPlxuICAgICAgICogICAgIDxsaT4qKnRvcCoqOiBkaXN0YW5jZSB0byB0b3AgZWRnZSBvZiB2aWV3cG9ydDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqcmlnaHQqKjogZGlzdGFuY2UgdG8gYm90dG9tIGVkZ2Ugb2Ygdmlld3BvcnQ8L2xpPlxuICAgICAgICogICA8L3VsPlxuICAgICAgICovXG4gICAgICBvZmZzZXQ6IGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgZWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZShlbGVtKTtcblxuICAgICAgICB2YXIgZWxlbUJDUiA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoYW5ndWxhci5pc051bWJlcihlbGVtQkNSLndpZHRoKSA/IGVsZW1CQ1Iud2lkdGggOiBlbGVtLm9mZnNldFdpZHRoKSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoYW5ndWxhci5pc051bWJlcihlbGVtQkNSLmhlaWdodCkgPyBlbGVtQkNSLmhlaWdodCA6IGVsZW0ub2Zmc2V0SGVpZ2h0KSxcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQoZWxlbUJDUi50b3AgKyAoJHdpbmRvdy5wYWdlWU9mZnNldCB8fCAkZG9jdW1lbnRbMF0uZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCkpLFxuICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQoZWxlbUJDUi5sZWZ0ICsgKCR3aW5kb3cucGFnZVhPZmZzZXQgfHwgJGRvY3VtZW50WzBdLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0KSlcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJvdmlkZXMgb2Zmc2V0IGRpc3RhbmNlIHRvIHRoZSBjbG9zZXN0IHNjcm9sbGFibGUgYW5jZXN0b3JcbiAgICAgICAqIG9yIHZpZXdwb3J0LiAgQWNjb3VudHMgZm9yIGJvcmRlciBhbmQgc2Nyb2xsYmFyIHdpZHRoLlxuICAgICAgICpcbiAgICAgICAqIFJpZ2h0IGFuZCBib3R0b20gZGltZW5zaW9ucyByZXByZXNlbnQgdGhlIGRpc3RhbmNlIHRvIHRoZVxuICAgICAgICogcmVzcGVjdGl2ZSBlZGdlIG9mIHRoZSB2aWV3cG9ydCBlbGVtZW50LiAgSWYgdGhlIGVsZW1lbnRcbiAgICAgICAqIGVkZ2UgZXh0ZW5kcyBiZXlvbmQgdGhlIHZpZXdwb3J0LCBhIG5lZ2F0aXZlIHZhbHVlIHdpbGwgYmVcbiAgICAgICAqIHJlcG9ydGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbSAtIFRoZSBlbGVtZW50IHRvIGdldCB0aGUgdmlld3BvcnQgb2Zmc2V0IGZvci5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IFt1c2VEb2N1bWVudD1mYWxzZV0gLSBTaG91bGQgdGhlIHZpZXdwb3J0IGJlIHRoZSBkb2N1bWVudCBlbGVtZW50IGluc3RlYWRcbiAgICAgICAqIG9mIHRoZSBmaXJzdCBzY3JvbGxhYmxlIGVsZW1lbnQsIGRlZmF1bHQgaXMgZmFsc2UuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBbaW5jbHVkZVBhZGRpbmc9dHJ1ZV0gLSBTaG91bGQgdGhlIHBhZGRpbmcgb24gdGhlIG9mZnNldCBwYXJlbnQgZWxlbWVudFxuICAgICAgICogYmUgYWNjb3VudGVkIGZvciwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICAgICAqICAgPHVsPlxuICAgICAgICogICAgIDxsaT4qKnRvcCoqOiBkaXN0YW5jZSB0byB0aGUgdG9wIGNvbnRlbnQgZWRnZSBvZiB2aWV3cG9ydCBlbGVtZW50PC9saT5cbiAgICAgICAqICAgICA8bGk+Kipib3R0b20qKjogZGlzdGFuY2UgdG8gdGhlIGJvdHRvbSBjb250ZW50IGVkZ2Ugb2Ygdmlld3BvcnQgZWxlbWVudDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqbGVmdCoqOiBkaXN0YW5jZSB0byB0aGUgbGVmdCBjb250ZW50IGVkZ2Ugb2Ygdmlld3BvcnQgZWxlbWVudDwvbGk+XG4gICAgICAgKiAgICAgPGxpPioqcmlnaHQqKjogZGlzdGFuY2UgdG8gdGhlIHJpZ2h0IGNvbnRlbnQgZWRnZSBvZiB2aWV3cG9ydCBlbGVtZW50PC9saT5cbiAgICAgICAqICAgPC91bD5cbiAgICAgICAqL1xuICAgICAgdmlld3BvcnRPZmZzZXQ6IGZ1bmN0aW9uKGVsZW0sIHVzZURvY3VtZW50LCBpbmNsdWRlUGFkZGluZykge1xuICAgICAgICBlbGVtID0gdGhpcy5nZXRSYXdOb2RlKGVsZW0pO1xuICAgICAgICBpbmNsdWRlUGFkZGluZyA9IGluY2x1ZGVQYWRkaW5nICE9PSBmYWxzZSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICB2YXIgZWxlbUJDUiA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBvZmZzZXRCQ1IgPSB7dG9wOiAwLCBsZWZ0OiAwLCBib3R0b206IDAsIHJpZ2h0OiAwfTtcblxuICAgICAgICB2YXIgb2Zmc2V0UGFyZW50ID0gdXNlRG9jdW1lbnQgPyAkZG9jdW1lbnRbMF0uZG9jdW1lbnRFbGVtZW50IDogdGhpcy5zY3JvbGxQYXJlbnQoZWxlbSk7XG4gICAgICAgIHZhciBvZmZzZXRQYXJlbnRCQ1IgPSBvZmZzZXRQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgb2Zmc2V0QkNSLnRvcCA9IG9mZnNldFBhcmVudEJDUi50b3AgKyBvZmZzZXRQYXJlbnQuY2xpZW50VG9wO1xuICAgICAgICBvZmZzZXRCQ1IubGVmdCA9IG9mZnNldFBhcmVudEJDUi5sZWZ0ICsgb2Zmc2V0UGFyZW50LmNsaWVudExlZnQ7XG4gICAgICAgIGlmIChvZmZzZXRQYXJlbnQgPT09ICRkb2N1bWVudFswXS5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICBvZmZzZXRCQ1IudG9wICs9ICR3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgb2Zmc2V0QkNSLmxlZnQgKz0gJHdpbmRvdy5wYWdlWE9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBvZmZzZXRCQ1IuYm90dG9tID0gb2Zmc2V0QkNSLnRvcCArIG9mZnNldFBhcmVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIG9mZnNldEJDUi5yaWdodCA9IG9mZnNldEJDUi5sZWZ0ICsgb2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoO1xuXG4gICAgICAgIGlmIChpbmNsdWRlUGFkZGluZykge1xuICAgICAgICAgIHZhciBvZmZzZXRQYXJlbnRTdHlsZSA9ICR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpO1xuICAgICAgICAgIG9mZnNldEJDUi50b3AgKz0gdGhpcy5wYXJzZVN0eWxlKG9mZnNldFBhcmVudFN0eWxlLnBhZGRpbmdUb3ApO1xuICAgICAgICAgIG9mZnNldEJDUi5ib3R0b20gLT0gdGhpcy5wYXJzZVN0eWxlKG9mZnNldFBhcmVudFN0eWxlLnBhZGRpbmdCb3R0b20pO1xuICAgICAgICAgIG9mZnNldEJDUi5sZWZ0ICs9IHRoaXMucGFyc2VTdHlsZShvZmZzZXRQYXJlbnRTdHlsZS5wYWRkaW5nTGVmdCk7XG4gICAgICAgICAgb2Zmc2V0QkNSLnJpZ2h0IC09IHRoaXMucGFyc2VTdHlsZShvZmZzZXRQYXJlbnRTdHlsZS5wYWRkaW5nUmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQoZWxlbUJDUi50b3AgLSBvZmZzZXRCQ1IudG9wKSxcbiAgICAgICAgICBib3R0b206IE1hdGgucm91bmQob2Zmc2V0QkNSLmJvdHRvbSAtIGVsZW1CQ1IuYm90dG9tKSxcbiAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKGVsZW1CQ1IubGVmdCAtIG9mZnNldEJDUi5sZWZ0KSxcbiAgICAgICAgICByaWdodDogTWF0aC5yb3VuZChvZmZzZXRCQ1IucmlnaHQgLSBlbGVtQkNSLnJpZ2h0KVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm92aWRlcyBhbiBhcnJheSBvZiBwbGFjZW1lbnQgdmFsdWVzIHBhcnNlZCBmcm9tIGEgcGxhY2VtZW50IHN0cmluZy5cbiAgICAgICAqIEFsb25nIHdpdGggdGhlICdhdXRvJyBpbmRpY2F0b3IsIHN1cHBvcnRlZCBwbGFjZW1lbnQgc3RyaW5ncyBhcmU6XG4gICAgICAgKiAgIDx1bD5cbiAgICAgICAqICAgICA8bGk+dG9wOiBlbGVtZW50IG9uIHRvcCwgaG9yaXpvbnRhbGx5IGNlbnRlcmVkIG9uIGhvc3QgZWxlbWVudC48L2xpPlxuICAgICAgICogICAgIDxsaT50b3AtbGVmdDogZWxlbWVudCBvbiB0b3AsIGxlZnQgZWRnZSBhbGlnbmVkIHdpdGggaG9zdCBlbGVtZW50IGxlZnQgZWRnZS48L2xpPlxuICAgICAgICogICAgIDxsaT50b3AtcmlnaHQ6IGVsZW1lbnQgb24gdG9wLCBsZXJpZ2h0ZnQgZWRnZSBhbGlnbmVkIHdpdGggaG9zdCBlbGVtZW50IHJpZ2h0IGVkZ2UuPC9saT5cbiAgICAgICAqICAgICA8bGk+Ym90dG9tOiBlbGVtZW50IG9uIGJvdHRvbSwgaG9yaXpvbnRhbGx5IGNlbnRlcmVkIG9uIGhvc3QgZWxlbWVudC48L2xpPlxuICAgICAgICogICAgIDxsaT5ib3R0b20tbGVmdDogZWxlbWVudCBvbiBib3R0b20sIGxlZnQgZWRnZSBhbGlnbmVkIHdpdGggaG9zdCBlbGVtZW50IGxlZnQgZWRnZS48L2xpPlxuICAgICAgICogICAgIDxsaT5ib3R0b20tcmlnaHQ6IGVsZW1lbnQgb24gYm90dG9tLCByaWdodCBlZGdlIGFsaWduZWQgd2l0aCBob3N0IGVsZW1lbnQgcmlnaHQgZWRnZS48L2xpPlxuICAgICAgICogICAgIDxsaT5sZWZ0OiBlbGVtZW50IG9uIGxlZnQsIHZlcnRpY2FsbHkgY2VudGVyZWQgb24gaG9zdCBlbGVtZW50LjwvbGk+XG4gICAgICAgKiAgICAgPGxpPmxlZnQtdG9wOiBlbGVtZW50IG9uIGxlZnQsIHRvcCBlZGdlIGFsaWduZWQgd2l0aCBob3N0IGVsZW1lbnQgdG9wIGVkZ2UuPC9saT5cbiAgICAgICAqICAgICA8bGk+bGVmdC1ib3R0b206IGVsZW1lbnQgb24gbGVmdCwgYm90dG9tIGVkZ2UgYWxpZ25lZCB3aXRoIGhvc3QgZWxlbWVudCBib3R0b20gZWRnZS48L2xpPlxuICAgICAgICogICAgIDxsaT5yaWdodDogZWxlbWVudCBvbiByaWdodCwgdmVydGljYWxseSBjZW50ZXJlZCBvbiBob3N0IGVsZW1lbnQuPC9saT5cbiAgICAgICAqICAgICA8bGk+cmlnaHQtdG9wOiBlbGVtZW50IG9uIHJpZ2h0LCB0b3AgZWRnZSBhbGlnbmVkIHdpdGggaG9zdCBlbGVtZW50IHRvcCBlZGdlLjwvbGk+XG4gICAgICAgKiAgICAgPGxpPnJpZ2h0LWJvdHRvbTogZWxlbWVudCBvbiByaWdodCwgYm90dG9tIGVkZ2UgYWxpZ25lZCB3aXRoIGhvc3QgZWxlbWVudCBib3R0b20gZWRnZS48L2xpPlxuICAgICAgICogICA8L3VsPlxuICAgICAgICogQSBwbGFjZW1lbnQgc3RyaW5nIHdpdGggYW4gJ2F1dG8nIGluZGljYXRvciBpcyBleHBlY3RlZCB0byBiZVxuICAgICAgICogc3BhY2Ugc2VwYXJhdGVkIGZyb20gdGhlIHBsYWNlbWVudCwgaS5lOiAnYXV0byBib3R0b20tbGVmdCcgIElmXG4gICAgICAgKiB0aGUgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IHBsYWNlbWVudCB2YWx1ZXMgZG8gbm90IG1hdGNoICd0b3AsXG4gICAgICAgKiBib3R0b20sIGxlZnQsIHJpZ2h0JyB0aGVuICd0b3AnIHdpbGwgYmUgdGhlIHByaW1hcnkgcGxhY2VtZW50IGFuZFxuICAgICAgICogJ2NlbnRlcicgd2lsbCBiZSB0aGUgc2Vjb25kYXJ5IHBsYWNlbWVudC4gIElmICdhdXRvJyBpcyBwYXNzZWQsIHRydWVcbiAgICAgICAqIHdpbGwgYmUgcmV0dXJuZWQgYXMgdGhlIDNyZCB2YWx1ZSBvZiB0aGUgYXJyYXkuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBsYWNlbWVudCAtIFRoZSBwbGFjZW1lbnQgc3RyaW5nIHRvIHBhcnNlLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHthcnJheX0gQW4gYXJyYXkgd2l0aCB0aGUgZm9sbG93aW5nIHZhbHVlc1xuICAgICAgICogPHVsPlxuICAgICAgICogICA8bGk+KipbMF0qKjogVGhlIHByaW1hcnkgcGxhY2VtZW50LjwvbGk+XG4gICAgICAgKiAgIDxsaT4qKlsxXSoqOiBUaGUgc2Vjb25kYXJ5IHBsYWNlbWVudC48L2xpPlxuICAgICAgICogICA8bGk+KipbMl0qKjogSWYgYXV0byBpcyBwYXNzZWQ6IHRydWUsIGVsc2UgdW5kZWZpbmVkLjwvbGk+XG4gICAgICAgKiA8L3VsPlxuICAgICAgICovXG4gICAgICBwYXJzZVBsYWNlbWVudDogZnVuY3Rpb24ocGxhY2VtZW50KSB7XG4gICAgICAgIHZhciBhdXRvUGxhY2UgPSBQTEFDRU1FTlRfUkVHRVguYXV0by50ZXN0KHBsYWNlbWVudCk7XG4gICAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQucmVwbGFjZShQTEFDRU1FTlRfUkVHRVguYXV0bywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJyk7XG5cbiAgICAgICAgcGxhY2VtZW50WzBdID0gcGxhY2VtZW50WzBdIHx8ICd0b3AnO1xuICAgICAgICBpZiAoIVBMQUNFTUVOVF9SRUdFWC5wcmltYXJ5LnRlc3QocGxhY2VtZW50WzBdKSkge1xuICAgICAgICAgIHBsYWNlbWVudFswXSA9ICd0b3AnO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhY2VtZW50WzFdID0gcGxhY2VtZW50WzFdIHx8ICdjZW50ZXInO1xuICAgICAgICBpZiAoIVBMQUNFTUVOVF9SRUdFWC5zZWNvbmRhcnkudGVzdChwbGFjZW1lbnRbMV0pKSB7XG4gICAgICAgICAgcGxhY2VtZW50WzFdID0gJ2NlbnRlcic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXV0b1BsYWNlKSB7XG4gICAgICAgICAgcGxhY2VtZW50WzJdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGFjZW1lbnRbMl0gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGFjZW1lbnQ7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByb3ZpZGVzIGNvb3JkaW5hdGVzIGZvciBhbiBlbGVtZW50IHRvIGJlIHBvc2l0aW9uZWQgcmVsYXRpdmUgdG9cbiAgICAgICAqIGFub3RoZXIgZWxlbWVudC4gIFBhc3NpbmcgJ2F1dG8nIGFzIHBhcnQgb2YgdGhlIHBsYWNlbWVudCBwYXJhbWV0ZXJcbiAgICAgICAqIHdpbGwgZW5hYmxlIHNtYXJ0IHBsYWNlbWVudCAtIHdoZXJlIHRoZSBlbGVtZW50IGZpdHMuIGkuZTpcbiAgICAgICAqICdhdXRvIGxlZnQtdG9wJyB3aWxsIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBpcyBlbm91Z2ggc3BhY2UgdG8gdGhlIGxlZnRcbiAgICAgICAqIG9mIHRoZSBob3N0RWxlbSB0byBmaXQgdGhlIHRhcmdldEVsZW0sIGlmIG5vdCBwbGFjZSByaWdodCAoc2FtZSBmb3Igc2Vjb25kYXJ5XG4gICAgICAgKiB0b3AgcGxhY2VtZW50KS4gIEF2YWlsYWJsZSBzcGFjZSBpcyBjYWxjdWxhdGVkIHVzaW5nIHRoZSB2aWV3cG9ydE9mZnNldFxuICAgICAgICogZnVuY3Rpb24uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBob3N0RWxlbSAtIFRoZSBlbGVtZW50IHRvIHBvc2l0aW9uIGFnYWluc3QuXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IHRhcmdldEVsZW0gLSBUaGUgZWxlbWVudCB0byBwb3NpdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gW3BsYWNlbWVudD10b3BdIC0gVGhlIHBsYWNlbWVudCBmb3IgdGhlIHRhcmdldEVsZW0sXG4gICAgICAgKiAgIGRlZmF1bHQgaXMgJ3RvcCcuICdjZW50ZXInIGlzIGFzc3VtZWQgYXMgc2Vjb25kYXJ5IHBsYWNlbWVudCBmb3JcbiAgICAgICAqICAgJ3RvcCcsICdsZWZ0JywgJ3JpZ2h0JywgYW5kICdib3R0b20nIHBsYWNlbWVudHMuICBBdmFpbGFibGUgcGxhY2VtZW50cyBhcmU6XG4gICAgICAgKiAgIDx1bD5cbiAgICAgICAqICAgICA8bGk+dG9wPC9saT5cbiAgICAgICAqICAgICA8bGk+dG9wLXJpZ2h0PC9saT5cbiAgICAgICAqICAgICA8bGk+dG9wLWxlZnQ8L2xpPlxuICAgICAgICogICAgIDxsaT5ib3R0b208L2xpPlxuICAgICAgICogICAgIDxsaT5ib3R0b20tbGVmdDwvbGk+XG4gICAgICAgKiAgICAgPGxpPmJvdHRvbS1yaWdodDwvbGk+XG4gICAgICAgKiAgICAgPGxpPmxlZnQ8L2xpPlxuICAgICAgICogICAgIDxsaT5sZWZ0LXRvcDwvbGk+XG4gICAgICAgKiAgICAgPGxpPmxlZnQtYm90dG9tPC9saT5cbiAgICAgICAqICAgICA8bGk+cmlnaHQ8L2xpPlxuICAgICAgICogICAgIDxsaT5yaWdodC10b3A8L2xpPlxuICAgICAgICogICAgIDxsaT5yaWdodC1ib3R0b208L2xpPlxuICAgICAgICogICA8L3VsPlxuICAgICAgICogQHBhcmFtIHtib29sZWFuPX0gW2FwcGVuZFRvQm9keT1mYWxzZV0gLSBTaG91bGQgdGhlIHRvcCBhbmQgbGVmdCB2YWx1ZXMgcmV0dXJuZWRcbiAgICAgICAqICAgYmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBib2R5IGVsZW1lbnQsIGRlZmF1bHQgaXMgZmFsc2UuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH0gQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICogICA8dWw+XG4gICAgICAgKiAgICAgPGxpPioqdG9wKio6IFZhbHVlIGZvciB0YXJnZXRFbGVtIHRvcC48L2xpPlxuICAgICAgICogICAgIDxsaT4qKmxlZnQqKjogVmFsdWUgZm9yIHRhcmdldEVsZW0gbGVmdC48L2xpPlxuICAgICAgICogICAgIDxsaT4qKnBsYWNlbWVudCoqOiBUaGUgcmVzb2x2ZWQgcGxhY2VtZW50LjwvbGk+XG4gICAgICAgKiAgIDwvdWw+XG4gICAgICAgKi9cbiAgICAgIHBvc2l0aW9uRWxlbWVudHM6IGZ1bmN0aW9uKGhvc3RFbGVtLCB0YXJnZXRFbGVtLCBwbGFjZW1lbnQsIGFwcGVuZFRvQm9keSkge1xuICAgICAgICBob3N0RWxlbSA9IHRoaXMuZ2V0UmF3Tm9kZShob3N0RWxlbSk7XG4gICAgICAgIHRhcmdldEVsZW0gPSB0aGlzLmdldFJhd05vZGUodGFyZ2V0RWxlbSk7XG5cbiAgICAgICAgLy8gbmVlZCB0byByZWFkIGZyb20gcHJvcCB0byBzdXBwb3J0IHRlc3RzLlxuICAgICAgICB2YXIgdGFyZ2V0V2lkdGggPSBhbmd1bGFyLmlzRGVmaW5lZCh0YXJnZXRFbGVtLm9mZnNldFdpZHRoKSA/IHRhcmdldEVsZW0ub2Zmc2V0V2lkdGggOiB0YXJnZXRFbGVtLnByb3AoJ29mZnNldFdpZHRoJyk7XG4gICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBhbmd1bGFyLmlzRGVmaW5lZCh0YXJnZXRFbGVtLm9mZnNldEhlaWdodCkgPyB0YXJnZXRFbGVtLm9mZnNldEhlaWdodCA6IHRhcmdldEVsZW0ucHJvcCgnb2Zmc2V0SGVpZ2h0Jyk7XG5cbiAgICAgICAgcGxhY2VtZW50ID0gdGhpcy5wYXJzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuXG4gICAgICAgIHZhciBob3N0RWxlbVBvcyA9IGFwcGVuZFRvQm9keSA/IHRoaXMub2Zmc2V0KGhvc3RFbGVtKSA6IHRoaXMucG9zaXRpb24oaG9zdEVsZW0pO1xuICAgICAgICB2YXIgdGFyZ2V0RWxlbVBvcyA9IHt0b3A6IDAsIGxlZnQ6IDAsIHBsYWNlbWVudDogJyd9O1xuXG4gICAgICAgIGlmIChwbGFjZW1lbnRbMl0pIHtcbiAgICAgICAgICB2YXIgdmlld3BvcnRPZmZzZXQgPSB0aGlzLnZpZXdwb3J0T2Zmc2V0KGhvc3RFbGVtKTtcblxuICAgICAgICAgIHZhciB0YXJnZXRFbGVtU3R5bGUgPSAkd2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWxlbSk7XG4gICAgICAgICAgdmFyIGFkanVzdGVkU2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiB0YXJnZXRXaWR0aCArIE1hdGgucm91bmQoTWF0aC5hYnModGhpcy5wYXJzZVN0eWxlKHRhcmdldEVsZW1TdHlsZS5tYXJnaW5MZWZ0KSArIHRoaXMucGFyc2VTdHlsZSh0YXJnZXRFbGVtU3R5bGUubWFyZ2luUmlnaHQpKSksXG4gICAgICAgICAgICBoZWlnaHQ6IHRhcmdldEhlaWdodCArIE1hdGgucm91bmQoTWF0aC5hYnModGhpcy5wYXJzZVN0eWxlKHRhcmdldEVsZW1TdHlsZS5tYXJnaW5Ub3ApICsgdGhpcy5wYXJzZVN0eWxlKHRhcmdldEVsZW1TdHlsZS5tYXJnaW5Cb3R0b20pKSlcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcGxhY2VtZW50WzBdID0gcGxhY2VtZW50WzBdID09PSAndG9wJyAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0ID4gdmlld3BvcnRPZmZzZXQudG9wICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgPD0gdmlld3BvcnRPZmZzZXQuYm90dG9tID8gJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFswXSA9PT0gJ2JvdHRvbScgJiYgYWRqdXN0ZWRTaXplLmhlaWdodCA+IHZpZXdwb3J0T2Zmc2V0LmJvdHRvbSAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0IDw9IHZpZXdwb3J0T2Zmc2V0LnRvcCA/ICd0b3AnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMF0gPT09ICdsZWZ0JyAmJiBhZGp1c3RlZFNpemUud2lkdGggPiB2aWV3cG9ydE9mZnNldC5sZWZ0ICYmIGFkanVzdGVkU2l6ZS53aWR0aCA8PSB2aWV3cG9ydE9mZnNldC5yaWdodCA/ICdyaWdodCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFswXSA9PT0gJ3JpZ2h0JyAmJiBhZGp1c3RlZFNpemUud2lkdGggPiB2aWV3cG9ydE9mZnNldC5yaWdodCAmJiBhZGp1c3RlZFNpemUud2lkdGggPD0gdmlld3BvcnRPZmZzZXQubGVmdCA/ICdsZWZ0JyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50WzBdO1xuXG4gICAgICAgICAgcGxhY2VtZW50WzFdID0gcGxhY2VtZW50WzFdID09PSAndG9wJyAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0IC0gaG9zdEVsZW1Qb3MuaGVpZ2h0ID4gdmlld3BvcnRPZmZzZXQuYm90dG9tICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgLSBob3N0RWxlbVBvcy5oZWlnaHQgPD0gdmlld3BvcnRPZmZzZXQudG9wID8gJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFsxXSA9PT0gJ2JvdHRvbScgJiYgYWRqdXN0ZWRTaXplLmhlaWdodCAtIGhvc3RFbGVtUG9zLmhlaWdodCA+IHZpZXdwb3J0T2Zmc2V0LnRvcCAmJiBhZGp1c3RlZFNpemUuaGVpZ2h0IC0gaG9zdEVsZW1Qb3MuaGVpZ2h0IDw9IHZpZXdwb3J0T2Zmc2V0LmJvdHRvbSA/ICd0b3AnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV0gPT09ICdsZWZ0JyAmJiBhZGp1c3RlZFNpemUud2lkdGggLSBob3N0RWxlbVBvcy53aWR0aCA+IHZpZXdwb3J0T2Zmc2V0LnJpZ2h0ICYmIGFkanVzdGVkU2l6ZS53aWR0aCAtIGhvc3RFbGVtUG9zLndpZHRoIDw9IHZpZXdwb3J0T2Zmc2V0LmxlZnQgPyAncmlnaHQnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV0gPT09ICdyaWdodCcgJiYgYWRqdXN0ZWRTaXplLndpZHRoIC0gaG9zdEVsZW1Qb3Mud2lkdGggPiB2aWV3cG9ydE9mZnNldC5sZWZ0ICYmIGFkanVzdGVkU2l6ZS53aWR0aCAtIGhvc3RFbGVtUG9zLndpZHRoIDw9IHZpZXdwb3J0T2Zmc2V0LnJpZ2h0ID8gJ2xlZnQnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV07XG5cbiAgICAgICAgICBpZiAocGxhY2VtZW50WzFdID09PSAnY2VudGVyJykge1xuICAgICAgICAgICAgaWYgKFBMQUNFTUVOVF9SRUdFWC52ZXJ0aWNhbC50ZXN0KHBsYWNlbWVudFswXSkpIHtcbiAgICAgICAgICAgICAgdmFyIHhPdmVyZmxvdyA9IGhvc3RFbGVtUG9zLndpZHRoIC8gMiAtIHRhcmdldFdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0T2Zmc2V0LmxlZnQgKyB4T3ZlcmZsb3cgPCAwICYmIGFkanVzdGVkU2l6ZS53aWR0aCAtIGhvc3RFbGVtUG9zLndpZHRoIDw9IHZpZXdwb3J0T2Zmc2V0LnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcGxhY2VtZW50WzFdID0gJ2xlZnQnO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZpZXdwb3J0T2Zmc2V0LnJpZ2h0ICsgeE92ZXJmbG93IDwgMCAmJiBhZGp1c3RlZFNpemUud2lkdGggLSBob3N0RWxlbVBvcy53aWR0aCA8PSB2aWV3cG9ydE9mZnNldC5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgcGxhY2VtZW50WzFdID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIHlPdmVyZmxvdyA9IGhvc3RFbGVtUG9zLmhlaWdodCAvIDIgLSBhZGp1c3RlZFNpemUuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0T2Zmc2V0LnRvcCArIHlPdmVyZmxvdyA8IDAgJiYgYWRqdXN0ZWRTaXplLmhlaWdodCAtIGhvc3RFbGVtUG9zLmhlaWdodCA8PSB2aWV3cG9ydE9mZnNldC5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnRbMV0gPSAndG9wJztcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh2aWV3cG9ydE9mZnNldC5ib3R0b20gKyB5T3ZlcmZsb3cgPCAwICYmIGFkanVzdGVkU2l6ZS5oZWlnaHQgLSBob3N0RWxlbVBvcy5oZWlnaHQgPD0gdmlld3BvcnRPZmZzZXQudG9wKSB7XG4gICAgICAgICAgICAgICAgcGxhY2VtZW50WzFdID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBsYWNlbWVudFswXSkge1xuICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLnRvcCA9IGhvc3RFbGVtUG9zLnRvcCAtIHRhcmdldEhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLnRvcCA9IGhvc3RFbGVtUG9zLnRvcCArIGhvc3RFbGVtUG9zLmhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgdGFyZ2V0RWxlbVBvcy5sZWZ0ID0gaG9zdEVsZW1Qb3MubGVmdCAtIHRhcmdldFdpZHRoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgdGFyZ2V0RWxlbVBvcy5sZWZ0ID0gaG9zdEVsZW1Qb3MubGVmdCArIGhvc3RFbGVtUG9zLndpZHRoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBsYWNlbWVudFsxXSkge1xuICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLnRvcCA9IGhvc3RFbGVtUG9zLnRvcDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICB0YXJnZXRFbGVtUG9zLnRvcCA9IGhvc3RFbGVtUG9zLnRvcCArIGhvc3RFbGVtUG9zLmhlaWdodCAtIHRhcmdldEhlaWdodDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgdGFyZ2V0RWxlbVBvcy5sZWZ0ID0gaG9zdEVsZW1Qb3MubGVmdDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MubGVmdCA9IGhvc3RFbGVtUG9zLmxlZnQgKyBob3N0RWxlbVBvcy53aWR0aCAtIHRhcmdldFdpZHRoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnY2VudGVyJzpcbiAgICAgICAgICAgIGlmIChQTEFDRU1FTlRfUkVHRVgudmVydGljYWwudGVzdChwbGFjZW1lbnRbMF0pKSB7XG4gICAgICAgICAgICAgIHRhcmdldEVsZW1Qb3MubGVmdCA9IGhvc3RFbGVtUG9zLmxlZnQgKyBob3N0RWxlbVBvcy53aWR0aCAvIDIgLSB0YXJnZXRXaWR0aCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRFbGVtUG9zLnRvcCA9IGhvc3RFbGVtUG9zLnRvcCArIGhvc3RFbGVtUG9zLmhlaWdodCAvIDIgLSB0YXJnZXRIZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRFbGVtUG9zLnRvcCA9IE1hdGgucm91bmQodGFyZ2V0RWxlbVBvcy50b3ApO1xuICAgICAgICB0YXJnZXRFbGVtUG9zLmxlZnQgPSBNYXRoLnJvdW5kKHRhcmdldEVsZW1Qb3MubGVmdCk7XG4gICAgICAgIHRhcmdldEVsZW1Qb3MucGxhY2VtZW50ID0gcGxhY2VtZW50WzFdID09PSAnY2VudGVyJyA/IHBsYWNlbWVudFswXSA6IHBsYWNlbWVudFswXSArICctJyArIHBsYWNlbWVudFsxXTtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0RWxlbVBvcztcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgKiBQcm92aWRlcyBhIHdheSBmb3IgcG9zaXRpb25pbmcgdG9vbHRpcCAmIGRyb3Bkb3duXG4gICAgICAqIGFycm93cyB3aGVuIHVzaW5nIHBsYWNlbWVudCBvcHRpb25zIGJleW9uZCB0aGUgc3RhbmRhcmRcbiAgICAgICogbGVmdCwgcmlnaHQsIHRvcCwgb3IgYm90dG9tLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW0gLSBUaGUgdG9vbHRpcC9kcm9wZG93biBlbGVtZW50LlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGxhY2VtZW50IC0gVGhlIHBsYWNlbWVudCBmb3IgdGhlIGVsZW0uXG4gICAgICAqL1xuICAgICAgcG9zaXRpb25BcnJvdzogZnVuY3Rpb24oZWxlbSwgcGxhY2VtZW50KSB7XG4gICAgICAgIGVsZW0gPSB0aGlzLmdldFJhd05vZGUoZWxlbSk7XG5cbiAgICAgICAgdmFyIGlubmVyRWxlbSA9IGVsZW0ucXVlcnlTZWxlY3RvcignLnRvb2x0aXAtaW5uZXIsIC5wb3BvdmVyLWlubmVyJyk7XG4gICAgICAgIGlmICghaW5uZXJFbGVtKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlzVG9vbHRpcCA9IGFuZ3VsYXIuZWxlbWVudChpbm5lckVsZW0pLmhhc0NsYXNzKCd0b29sdGlwLWlubmVyJyk7XG5cbiAgICAgICAgdmFyIGFycm93RWxlbSA9IGlzVG9vbHRpcCA/IGVsZW0ucXVlcnlTZWxlY3RvcignLnRvb2x0aXAtYXJyb3cnKSA6IGVsZW0ucXVlcnlTZWxlY3RvcignLmFycm93Jyk7XG4gICAgICAgIGlmICghYXJyb3dFbGVtKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhY2VtZW50ID0gdGhpcy5wYXJzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICAgICAgICBpZiAocGxhY2VtZW50WzFdID09PSAnY2VudGVyJykge1xuICAgICAgICAgIC8vIG5vIGFkanVzdG1lbnQgbmVjZXNzYXJ5IC0ganVzdCByZXNldCBzdHlsZXNcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoYXJyb3dFbGVtKS5jc3Moe3RvcDogJycsIGJvdHRvbTogJycsIHJpZ2h0OiAnJywgbGVmdDogJycsIG1hcmdpbjogJyd9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYm9yZGVyUHJvcCA9ICdib3JkZXItJyArIHBsYWNlbWVudFswXSArICctd2lkdGgnO1xuICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSAkd2luZG93LmdldENvbXB1dGVkU3R5bGUoYXJyb3dFbGVtKVtib3JkZXJQcm9wXTtcblxuICAgICAgICB2YXIgYm9yZGVyUmFkaXVzUHJvcCA9ICdib3JkZXItJztcbiAgICAgICAgaWYgKFBMQUNFTUVOVF9SRUdFWC52ZXJ0aWNhbC50ZXN0KHBsYWNlbWVudFswXSkpIHtcbiAgICAgICAgICBib3JkZXJSYWRpdXNQcm9wICs9IHBsYWNlbWVudFswXSArICctJyArIHBsYWNlbWVudFsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBib3JkZXJSYWRpdXNQcm9wICs9IHBsYWNlbWVudFsxXSArICctJyArIHBsYWNlbWVudFswXTtcbiAgICAgICAgfVxuICAgICAgICBib3JkZXJSYWRpdXNQcm9wICs9ICctcmFkaXVzJztcbiAgICAgICAgdmFyIGJvcmRlclJhZGl1cyA9ICR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpc1Rvb2x0aXAgPyBpbm5lckVsZW0gOiBlbGVtKVtib3JkZXJSYWRpdXNQcm9wXTtcblxuICAgICAgICB2YXIgYXJyb3dDc3MgPSB7XG4gICAgICAgICAgdG9wOiAnYXV0bycsXG4gICAgICAgICAgYm90dG9tOiAnYXV0bycsXG4gICAgICAgICAgbGVmdDogJ2F1dG8nLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bycsXG4gICAgICAgICAgbWFyZ2luOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgc3dpdGNoIChwbGFjZW1lbnRbMF0pIHtcbiAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgYXJyb3dDc3MuYm90dG9tID0gaXNUb29sdGlwID8gJzAnIDogJy0nICsgYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgYXJyb3dDc3MudG9wID0gaXNUb29sdGlwID8gJzAnIDogJy0nICsgYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIGFycm93Q3NzLnJpZ2h0ID0gaXNUb29sdGlwID8gJzAnIDogJy0nICsgYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICBhcnJvd0Nzcy5sZWZ0ID0gaXNUb29sdGlwID8gJzAnIDogJy0nICsgYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGFycm93Q3NzW3BsYWNlbWVudFsxXV0gPSBib3JkZXJSYWRpdXM7XG5cbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGFycm93RWxlbSkuY3NzKGFycm93Q3NzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAuZGF0ZXBpY2tlcicsIFsndWkuYm9vdHN0cmFwLmRhdGVwYXJzZXInLCAndWkuYm9vdHN0cmFwLmlzQ2xhc3MnLCAndWkuYm9vdHN0cmFwLnBvc2l0aW9uJ10pXG5cbi52YWx1ZSgnJGRhdGVwaWNrZXJTdXBwcmVzc0Vycm9yJywgZmFsc2UpXG5cbi5jb25zdGFudCgndWliRGF0ZXBpY2tlckNvbmZpZycsIHtcbiAgZGF0ZXBpY2tlck1vZGU6ICdkYXknLFxuICBmb3JtYXREYXk6ICdkZCcsXG4gIGZvcm1hdE1vbnRoOiAnTU1NTScsXG4gIGZvcm1hdFllYXI6ICd5eXl5JyxcbiAgZm9ybWF0RGF5SGVhZGVyOiAnRUVFJyxcbiAgZm9ybWF0RGF5VGl0bGU6ICdNTU1NIHl5eXknLFxuICBmb3JtYXRNb250aFRpdGxlOiAneXl5eScsXG4gIG1heERhdGU6IG51bGwsXG4gIG1heE1vZGU6ICd5ZWFyJyxcbiAgbWluRGF0ZTogbnVsbCxcbiAgbWluTW9kZTogJ2RheScsXG4gIG5nTW9kZWxPcHRpb25zOiB7fSxcbiAgc2hvcnRjdXRQcm9wYWdhdGlvbjogZmFsc2UsXG4gIHNob3dXZWVrczogdHJ1ZSxcbiAgeWVhckNvbHVtbnM6IDUsXG4gIHllYXJSb3dzOiA0XG59KVxuXG4uY29udHJvbGxlcignVWliRGF0ZXBpY2tlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAnJHBhcnNlJywgJyRpbnRlcnBvbGF0ZScsICckbG9jYWxlJywgJyRsb2cnLCAnZGF0ZUZpbHRlcicsICd1aWJEYXRlcGlja2VyQ29uZmlnJywgJyRkYXRlcGlja2VyU3VwcHJlc3NFcnJvcicsICd1aWJEYXRlUGFyc2VyJyxcbiAgZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMsICRwYXJzZSwgJGludGVycG9sYXRlLCAkbG9jYWxlLCAkbG9nLCBkYXRlRmlsdGVyLCBkYXRlcGlja2VyQ29uZmlnLCAkZGF0ZXBpY2tlclN1cHByZXNzRXJyb3IsIGRhdGVQYXJzZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgbmdNb2RlbEN0cmwgPSB7ICRzZXRWaWV3VmFsdWU6IGFuZ3VsYXIubm9vcCB9LCAvLyBudWxsTW9kZWxDdHJsO1xuICAgICAgbmdNb2RlbE9wdGlvbnMgPSB7fSxcbiAgICAgIHdhdGNoTGlzdGVuZXJzID0gW107XG5cbiAgLy8gTW9kZXMgY2hhaW5cbiAgdGhpcy5tb2RlcyA9IFsnZGF5JywgJ21vbnRoJywgJ3llYXInXTtcblxuICBpZiAoJGF0dHJzLmRhdGVwaWNrZXJPcHRpb25zKSB7XG4gICAgYW5ndWxhci5mb3JFYWNoKFtcbiAgICAgICdmb3JtYXREYXknLFxuICAgICAgJ2Zvcm1hdERheUhlYWRlcicsXG4gICAgICAnZm9ybWF0RGF5VGl0bGUnLFxuICAgICAgJ2Zvcm1hdE1vbnRoJyxcbiAgICAgICdmb3JtYXRNb250aFRpdGxlJyxcbiAgICAgICdmb3JtYXRZZWFyJyxcbiAgICAgICdpbml0RGF0ZScsXG4gICAgICAnbWF4RGF0ZScsXG4gICAgICAnbWF4TW9kZScsXG4gICAgICAnbWluRGF0ZScsXG4gICAgICAnbWluTW9kZScsXG4gICAgICAnc2hvd1dlZWtzJyxcbiAgICAgICdzaG9ydGN1dFByb3BhZ2F0aW9uJyxcbiAgICAgICdzdGFydGluZ0RheScsXG4gICAgICAneWVhckNvbHVtbnMnLFxuICAgICAgJ3llYXJSb3dzJ1xuICAgIF0sIGZ1bmN0aW9uKGtleSkge1xuICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSAnZm9ybWF0RGF5JzpcbiAgICAgICAgY2FzZSAnZm9ybWF0RGF5SGVhZGVyJzpcbiAgICAgICAgY2FzZSAnZm9ybWF0RGF5VGl0bGUnOlxuICAgICAgICBjYXNlICdmb3JtYXRNb250aCc6XG4gICAgICAgIGNhc2UgJ2Zvcm1hdE1vbnRoVGl0bGUnOlxuICAgICAgICBjYXNlICdmb3JtYXRZZWFyJzpcbiAgICAgICAgICBzZWxmW2tleV0gPSBhbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnNba2V5XSkgPyAkaW50ZXJwb2xhdGUoJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zW2tleV0pKCRzY29wZS4kcGFyZW50KSA6IGRhdGVwaWNrZXJDb25maWdba2V5XTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2hvd1dlZWtzJzpcbiAgICAgICAgY2FzZSAnc2hvcnRjdXRQcm9wYWdhdGlvbic6XG4gICAgICAgIGNhc2UgJ3llYXJDb2x1bW5zJzpcbiAgICAgICAgY2FzZSAneWVhclJvd3MnOlxuICAgICAgICAgIHNlbGZba2V5XSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5kYXRlcGlja2VyT3B0aW9uc1trZXldKSA/XG4gICAgICAgICAgICAkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnNba2V5XSA6IGRhdGVwaWNrZXJDb25maWdba2V5XTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3RhcnRpbmdEYXknOlxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnMuc3RhcnRpbmdEYXkpKSB7XG4gICAgICAgICAgICBzZWxmLnN0YXJ0aW5nRGF5ID0gJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zLnN0YXJ0aW5nRGF5O1xuICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc051bWJlcihkYXRlcGlja2VyQ29uZmlnLnN0YXJ0aW5nRGF5KSkge1xuICAgICAgICAgICAgc2VsZi5zdGFydGluZ0RheSA9IGRhdGVwaWNrZXJDb25maWcuc3RhcnRpbmdEYXk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuc3RhcnRpbmdEYXkgPSAoJGxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLkZJUlNUREFZT0ZXRUVLICsgOCkgJSA3O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtYXhEYXRlJzpcbiAgICAgICAgY2FzZSAnbWluRGF0ZSc6XG4gICAgICAgICAgaWYgKCRzY29wZS5kYXRlcGlja2VyT3B0aW9uc1trZXldKSB7XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkgeyByZXR1cm4gJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zW2tleV07IH0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGZba2V5XSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG5ldyBEYXRlKHZhbHVlKSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzZWxmW2tleV0gPSBuZXcgRGF0ZShkYXRlRmlsdGVyKHZhbHVlLCAnbWVkaXVtJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmW2tleV0gPSBudWxsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVmlldygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGZba2V5XSA9IGRhdGVwaWNrZXJDb25maWdba2V5XSA/IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKG5ldyBEYXRlKGRhdGVwaWNrZXJDb25maWdba2V5XSksIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKSA6IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21heE1vZGUnOlxuICAgICAgICBjYXNlICdtaW5Nb2RlJzpcbiAgICAgICAgICBpZiAoJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zW2tleV0pIHtcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7IHJldHVybiAkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnNba2V5XTsgfSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgc2VsZltrZXldID0gJHNjb3BlW2tleV0gPSBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkgPyB2YWx1ZSA6IGRhdGVwaWNrZXJPcHRpb25zW2tleV07XG4gICAgICAgICAgICAgIGlmIChrZXkgPT09ICdtaW5Nb2RlJyAmJiBzZWxmLm1vZGVzLmluZGV4T2YoJHNjb3BlLmRhdGVwaWNrZXJNb2RlKSA8IHNlbGYubW9kZXMuaW5kZXhPZihzZWxmW2tleV0pIHx8XG4gICAgICAgICAgICAgICAga2V5ID09PSAnbWF4TW9kZScgJiYgc2VsZi5tb2Rlcy5pbmRleE9mKCRzY29wZS5kYXRlcGlja2VyTW9kZSkgPiBzZWxmLm1vZGVzLmluZGV4T2Yoc2VsZltrZXldKSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5kYXRlcGlja2VyTW9kZSA9IHNlbGZba2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGZba2V5XSA9ICRzY29wZVtrZXldID0gZGF0ZXBpY2tlckNvbmZpZ1trZXldIHx8IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2luaXREYXRlJzpcbiAgICAgICAgICBpZiAoJHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zLmluaXREYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZSgkc2NvcGUuZGF0ZXBpY2tlck9wdGlvbnMuaW5pdERhdGUsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKSB8fCBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHsgcmV0dXJuICRzY29wZS5kYXRlcGlja2VyT3B0aW9ucy5pbml0RGF0ZTsgfSwgZnVuY3Rpb24oaW5pdERhdGUpIHtcbiAgICAgICAgICAgICAgaWYgKGluaXREYXRlICYmIChuZ01vZGVsQ3RybC4kaXNFbXB0eShuZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZSkgfHwgbmdNb2RlbEN0cmwuJGludmFsaWQpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY3RpdmVEYXRlID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUoaW5pdERhdGUsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hWaWV3KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBJbnRlcnBvbGF0ZWQgY29uZmlndXJhdGlvbiBhdHRyaWJ1dGVzXG4gICAgYW5ndWxhci5mb3JFYWNoKFsnZm9ybWF0RGF5JywgJ2Zvcm1hdE1vbnRoJywgJ2Zvcm1hdFllYXInLCAnZm9ybWF0RGF5SGVhZGVyJywgJ2Zvcm1hdERheVRpdGxlJywgJ2Zvcm1hdE1vbnRoVGl0bGUnXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBzZWxmW2tleV0gPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnNba2V5XSkgPyAkaW50ZXJwb2xhdGUoJGF0dHJzW2tleV0pKCRzY29wZS4kcGFyZW50KSA6IGRhdGVwaWNrZXJDb25maWdba2V5XTtcbiAgICB9KTtcblxuICAgIC8vIEV2YWxlZCBjb25maWd1cmF0aW9uIGF0dHJpYnV0ZXNcbiAgICBhbmd1bGFyLmZvckVhY2goWydzaG93V2Vla3MnLCAneWVhclJvd3MnLCAneWVhckNvbHVtbnMnLCAnc2hvcnRjdXRQcm9wYWdhdGlvbiddLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHNlbGZba2V5XSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRyc1trZXldKSA/XG4gICAgICAgICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRyc1trZXldKSA6IGRhdGVwaWNrZXJDb25maWdba2V5XTtcbiAgICB9KTtcblxuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuc3RhcnRpbmdEYXkpKSB7XG4gICAgICBzZWxmLnN0YXJ0aW5nRGF5ID0gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnN0YXJ0aW5nRGF5KTtcbiAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoZGF0ZXBpY2tlckNvbmZpZy5zdGFydGluZ0RheSkpIHtcbiAgICAgIHNlbGYuc3RhcnRpbmdEYXkgPSBkYXRlcGlja2VyQ29uZmlnLnN0YXJ0aW5nRGF5O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnN0YXJ0aW5nRGF5ID0gKCRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5GSVJTVERBWU9GV0VFSyArIDgpICUgNztcbiAgICB9XG5cbiAgICAvLyBXYXRjaGFibGUgZGF0ZSBhdHRyaWJ1dGVzXG4gICAgYW5ndWxhci5mb3JFYWNoKFsnbWluRGF0ZScsICdtYXhEYXRlJ10sIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKCRhdHRyc1trZXldKSB7XG4gICAgICAgIHdhdGNoTGlzdGVuZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRyc1trZXldLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICBzZWxmW2tleV0gPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShuZXcgRGF0ZSh2YWx1ZSksIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGZba2V5XSA9IG5ldyBEYXRlKGRhdGVGaWx0ZXIodmFsdWUsICdtZWRpdW0nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGZba2V5XSA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZi5yZWZyZXNoVmlldygpO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmW2tleV0gPSBkYXRlcGlja2VyQ29uZmlnW2tleV0gPyBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShuZXcgRGF0ZShkYXRlcGlja2VyQ29uZmlnW2tleV0pLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSkgOiBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYW5ndWxhci5mb3JFYWNoKFsnbWluTW9kZScsICdtYXhNb2RlJ10sIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKCRhdHRyc1trZXldKSB7XG4gICAgICAgIHdhdGNoTGlzdGVuZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRyc1trZXldLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHNlbGZba2V5XSA9ICRzY29wZVtrZXldID0gYW5ndWxhci5pc0RlZmluZWQodmFsdWUpID8gdmFsdWUgOiAkYXR0cnNba2V5XTtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnbWluTW9kZScgJiYgc2VsZi5tb2Rlcy5pbmRleE9mKCRzY29wZS5kYXRlcGlja2VyTW9kZSkgPCBzZWxmLm1vZGVzLmluZGV4T2Yoc2VsZltrZXldKSB8fFxuICAgICAgICAgICAga2V5ID09PSAnbWF4TW9kZScgJiYgc2VsZi5tb2Rlcy5pbmRleE9mKCRzY29wZS5kYXRlcGlja2VyTW9kZSkgPiBzZWxmLm1vZGVzLmluZGV4T2Yoc2VsZltrZXldKSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGVwaWNrZXJNb2RlID0gc2VsZltrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZltrZXldID0gJHNjb3BlW2tleV0gPSBkYXRlcGlja2VyQ29uZmlnW2tleV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaW5pdERhdGUpKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZSgkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuaW5pdERhdGUpLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSkgfHwgbmV3IERhdGUoKTtcbiAgICAgIHdhdGNoTGlzdGVuZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRycy5pbml0RGF0ZSwgZnVuY3Rpb24oaW5pdERhdGUpIHtcbiAgICAgICAgaWYgKGluaXREYXRlICYmIChuZ01vZGVsQ3RybC4kaXNFbXB0eShuZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZSkgfHwgbmdNb2RlbEN0cmwuJGludmFsaWQpKSB7XG4gICAgICAgICAgc2VsZi5hY3RpdmVEYXRlID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUoaW5pdERhdGUsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgICAgICBzZWxmLnJlZnJlc2hWaWV3KCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmVEYXRlID0gbmV3IERhdGUoKTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUuZGF0ZXBpY2tlck1vZGUgPSAkc2NvcGUuZGF0ZXBpY2tlck1vZGUgfHwgZGF0ZXBpY2tlckNvbmZpZy5kYXRlcGlja2VyTW9kZTtcbiAgJHNjb3BlLnVuaXF1ZUlkID0gJ2RhdGVwaWNrZXItJyArICRzY29wZS4kaWQgKyAnLScgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCk7XG5cbiAgJHNjb3BlLmRpc2FibGVkID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmRpc2FibGVkKSB8fCBmYWxzZTtcbiAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5uZ0Rpc2FibGVkKSkge1xuICAgIHdhdGNoTGlzdGVuZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRycy5uZ0Rpc2FibGVkLCBmdW5jdGlvbihkaXNhYmxlZCkge1xuICAgICAgJHNjb3BlLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICBzZWxmLnJlZnJlc2hWaWV3KCk7XG4gICAgfSkpO1xuICB9XG5cbiAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24oZGF0ZU9iamVjdCkge1xuICAgIGlmIChzZWxmLmNvbXBhcmUoZGF0ZU9iamVjdC5kYXRlLCBzZWxmLmFjdGl2ZURhdGUpID09PSAwKSB7XG4gICAgICAkc2NvcGUuYWN0aXZlRGF0ZUlkID0gZGF0ZU9iamVjdC51aWQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKG5nTW9kZWxDdHJsXykge1xuICAgIG5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmxfO1xuICAgIG5nTW9kZWxPcHRpb25zID0gbmdNb2RlbEN0cmxfLiRvcHRpb25zIHx8IGRhdGVwaWNrZXJDb25maWcubmdNb2RlbE9wdGlvbnM7XG5cbiAgICBpZiAobmdNb2RlbEN0cmwuJG1vZGVsVmFsdWUpIHtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IG5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuICAgIH1cblxuICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYucmVuZGVyKCk7XG4gICAgfTtcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChuZ01vZGVsQ3RybC4kdmlld1ZhbHVlKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUpLFxuICAgICAgICAgIGlzVmFsaWQgPSAhaXNOYU4oZGF0ZSk7XG5cbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKGRhdGUsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgIH0gZWxzZSBpZiAoISRkYXRlcGlja2VyU3VwcHJlc3NFcnJvcikge1xuICAgICAgICAkbG9nLmVycm9yKCdEYXRlcGlja2VyIGRpcmVjdGl2ZTogXCJuZy1tb2RlbFwiIHZhbHVlIG11c3QgYmUgYSBEYXRlIG9iamVjdCcpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlZnJlc2hWaWV3KCk7XG4gIH07XG5cbiAgdGhpcy5yZWZyZXNoVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgICRzY29wZS5zZWxlY3RlZER0ID0gbnVsbDtcbiAgICAgIHRoaXMuX3JlZnJlc2hWaWV3KCk7XG4gICAgICBpZiAoJHNjb3BlLmFjdGl2ZUR0KSB7XG4gICAgICAgICRzY29wZS5hY3RpdmVEYXRlSWQgPSAkc2NvcGUuYWN0aXZlRHQudWlkO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0ZSA9IG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUgPyBuZXcgRGF0ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlKSA6IG51bGw7XG4gICAgICBkYXRlID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUoZGF0ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFZhbGlkaXR5KCdkYXRlRGlzYWJsZWQnLCAhZGF0ZSB8fFxuICAgICAgICB0aGlzLmVsZW1lbnQgJiYgIXRoaXMuaXNEaXNhYmxlZChkYXRlKSk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuY3JlYXRlRGF0ZU9iamVjdCA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCkge1xuICAgIHZhciBtb2RlbCA9IG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUgPyBuZXcgRGF0ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlKSA6IG51bGw7XG4gICAgbW9kZWwgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShtb2RlbCwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgIHZhciBkdCA9IHtcbiAgICAgIGRhdGU6IGRhdGUsXG4gICAgICBsYWJlbDogZGF0ZVBhcnNlci5maWx0ZXIoZGF0ZSwgZm9ybWF0KSxcbiAgICAgIHNlbGVjdGVkOiBtb2RlbCAmJiB0aGlzLmNvbXBhcmUoZGF0ZSwgbW9kZWwpID09PSAwLFxuICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNEaXNhYmxlZChkYXRlKSxcbiAgICAgIGN1cnJlbnQ6IHRoaXMuY29tcGFyZShkYXRlLCBuZXcgRGF0ZSgpKSA9PT0gMCxcbiAgICAgIGN1c3RvbUNsYXNzOiB0aGlzLmN1c3RvbUNsYXNzKGRhdGUpIHx8IG51bGxcbiAgICB9O1xuXG4gICAgaWYgKG1vZGVsICYmIHRoaXMuY29tcGFyZShkYXRlLCBtb2RlbCkgPT09IDApIHtcbiAgICAgICRzY29wZS5zZWxlY3RlZER0ID0gZHQ7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYWN0aXZlRGF0ZSAmJiB0aGlzLmNvbXBhcmUoZHQuZGF0ZSwgc2VsZi5hY3RpdmVEYXRlKSA9PT0gMCkge1xuICAgICAgJHNjb3BlLmFjdGl2ZUR0ID0gZHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGR0O1xuICB9O1xuXG4gIHRoaXMuaXNEaXNhYmxlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gJHNjb3BlLmRpc2FibGVkIHx8XG4gICAgICB0aGlzLm1pbkRhdGUgJiYgdGhpcy5jb21wYXJlKGRhdGUsIHRoaXMubWluRGF0ZSkgPCAwIHx8XG4gICAgICB0aGlzLm1heERhdGUgJiYgdGhpcy5jb21wYXJlKGRhdGUsIHRoaXMubWF4RGF0ZSkgPiAwIHx8XG4gICAgICAkYXR0cnMuZGF0ZURpc2FibGVkICYmICRzY29wZS5kYXRlRGlzYWJsZWQoe2RhdGU6IGRhdGUsIG1vZGU6ICRzY29wZS5kYXRlcGlja2VyTW9kZX0pO1xuICB9O1xuXG4gIHRoaXMuY3VzdG9tQ2xhc3MgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuICRzY29wZS5jdXN0b21DbGFzcyh7ZGF0ZTogZGF0ZSwgbW9kZTogJHNjb3BlLmRhdGVwaWNrZXJNb2RlfSk7XG4gIH07XG5cbiAgLy8gU3BsaXQgYXJyYXkgaW50byBzbWFsbGVyIGFycmF5c1xuICB0aGlzLnNwbGl0ID0gZnVuY3Rpb24oYXJyLCBzaXplKSB7XG4gICAgdmFyIGFycmF5cyA9IFtdO1xuICAgIHdoaWxlIChhcnIubGVuZ3RoID4gMCkge1xuICAgICAgYXJyYXlzLnB1c2goYXJyLnNwbGljZSgwLCBzaXplKSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheXM7XG4gIH07XG5cbiAgJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBpZiAoJHNjb3BlLmRhdGVwaWNrZXJNb2RlID09PSBzZWxmLm1pbk1vZGUpIHtcbiAgICAgIHZhciBkdCA9IG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUgPyBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShuZXcgRGF0ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlKSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpIDogbmV3IERhdGUoMCwgMCwgMCwgMCwgMCwgMCwgMCk7XG4gICAgICBkdC5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgZHQgPSBkYXRlUGFyc2VyLnRvVGltZXpvbmUoZHQsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoZHQpO1xuICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmFjdGl2ZURhdGUgPSBkYXRlO1xuICAgICAgJHNjb3BlLmRhdGVwaWNrZXJNb2RlID0gc2VsZi5tb2Rlc1tzZWxmLm1vZGVzLmluZGV4T2YoJHNjb3BlLmRhdGVwaWNrZXJNb2RlKSAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUubW92ZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgIHZhciB5ZWFyID0gc2VsZi5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCkgKyBkaXJlY3Rpb24gKiAoc2VsZi5zdGVwLnllYXJzIHx8IDApLFxuICAgICAgICBtb250aCA9IHNlbGYuYWN0aXZlRGF0ZS5nZXRNb250aCgpICsgZGlyZWN0aW9uICogKHNlbGYuc3RlcC5tb250aHMgfHwgMCk7XG4gICAgc2VsZi5hY3RpdmVEYXRlLnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCAxKTtcbiAgICBzZWxmLnJlZnJlc2hWaWV3KCk7XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZU1vZGUgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcbiAgICBkaXJlY3Rpb24gPSBkaXJlY3Rpb24gfHwgMTtcblxuICAgIGlmICgkc2NvcGUuZGF0ZXBpY2tlck1vZGUgPT09IHNlbGYubWF4TW9kZSAmJiBkaXJlY3Rpb24gPT09IDEgfHxcbiAgICAgICRzY29wZS5kYXRlcGlja2VyTW9kZSA9PT0gc2VsZi5taW5Nb2RlICYmIGRpcmVjdGlvbiA9PT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUuZGF0ZXBpY2tlck1vZGUgPSBzZWxmLm1vZGVzW3NlbGYubW9kZXMuaW5kZXhPZigkc2NvcGUuZGF0ZXBpY2tlck1vZGUpICsgZGlyZWN0aW9uXTtcbiAgfTtcblxuICAvLyBLZXkgZXZlbnQgbWFwcGVyXG4gICRzY29wZS5rZXlzID0geyAxMzogJ2VudGVyJywgMzI6ICdzcGFjZScsIDMzOiAncGFnZXVwJywgMzQ6ICdwYWdlZG93bicsIDM1OiAnZW5kJywgMzY6ICdob21lJywgMzc6ICdsZWZ0JywgMzg6ICd1cCcsIDM5OiAncmlnaHQnLCA0MDogJ2Rvd24nIH07XG5cbiAgdmFyIGZvY3VzRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZWxlbWVudFswXS5mb2N1cygpO1xuICB9O1xuXG4gIC8vIExpc3RlbiBmb3IgZm9jdXMgcmVxdWVzdHMgZnJvbSBwb3B1cCBkaXJlY3RpdmVcbiAgJHNjb3BlLiRvbigndWliOmRhdGVwaWNrZXIuZm9jdXMnLCBmb2N1c0VsZW1lbnQpO1xuXG4gICRzY29wZS5rZXlkb3duID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgdmFyIGtleSA9ICRzY29wZS5rZXlzW2V2dC53aGljaF07XG5cbiAgICBpZiAoIWtleSB8fCBldnQuc2hpZnRLZXkgfHwgZXZ0LmFsdEtleSB8fCAkc2NvcGUuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoIXNlbGYuc2hvcnRjdXRQcm9wYWdhdGlvbikge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdlbnRlcicgfHwga2V5ID09PSAnc3BhY2UnKSB7XG4gICAgICBpZiAoc2VsZi5pc0Rpc2FibGVkKHNlbGYuYWN0aXZlRGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBkbyBub3RoaW5nXG4gICAgICB9XG4gICAgICAkc2NvcGUuc2VsZWN0KHNlbGYuYWN0aXZlRGF0ZSk7XG4gICAgfSBlbHNlIGlmIChldnQuY3RybEtleSAmJiAoa2V5ID09PSAndXAnIHx8IGtleSA9PT0gJ2Rvd24nKSkge1xuICAgICAgJHNjb3BlLnRvZ2dsZU1vZGUoa2V5ID09PSAndXAnID8gMSA6IC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5oYW5kbGVLZXlEb3duKGtleSwgZXZ0KTtcbiAgICAgIHNlbGYucmVmcmVzaFZpZXcoKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLiRvbihcIiRkZXN0cm95XCIsIGZ1bmN0aW9uKCkge1xuICAgIC8vQ2xlYXIgYWxsIHdhdGNoIGxpc3RlbmVycyBvbiBkZXN0cm95XG4gICAgd2hpbGUgKHdhdGNoTGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgd2F0Y2hMaXN0ZW5lcnMuc2hpZnQoKSgpO1xuICAgIH1cbiAgfSk7XG59XSlcblxuLmNvbnRyb2xsZXIoJ1VpYkRheXBpY2tlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICckZWxlbWVudCcsICdkYXRlRmlsdGVyJywgZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBkYXRlRmlsdGVyKSB7XG4gIHZhciBEQVlTX0lOX01PTlRIID0gWzMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdO1xuXG4gIHRoaXMuc3RlcCA9IHsgbW9udGhzOiAxIH07XG4gIHRoaXMuZWxlbWVudCA9ICRlbGVtZW50O1xuICBmdW5jdGlvbiBnZXREYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgIHJldHVybiBtb250aCA9PT0gMSAmJiB5ZWFyICUgNCA9PT0gMCAmJlxuICAgICAgKHllYXIgJSAxMDAgIT09IDAgfHwgeWVhciAlIDQwMCA9PT0gMCkgPyAyOSA6IERBWVNfSU5fTU9OVEhbbW9udGhdO1xuICB9XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oY3RybCkge1xuICAgIGFuZ3VsYXIuZXh0ZW5kKGN0cmwsIHRoaXMpO1xuICAgIHNjb3BlLnNob3dXZWVrcyA9IGN0cmwuc2hvd1dlZWtzO1xuICAgIGN0cmwucmVmcmVzaFZpZXcoKTtcbiAgfTtcblxuICB0aGlzLmdldERhdGVzID0gZnVuY3Rpb24oc3RhcnREYXRlLCBuKSB7XG4gICAgdmFyIGRhdGVzID0gbmV3IEFycmF5KG4pLCBjdXJyZW50ID0gbmV3IERhdGUoc3RhcnREYXRlKSwgaSA9IDAsIGRhdGU7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoY3VycmVudCk7XG4gICAgICBkYXRlc1tpKytdID0gZGF0ZTtcbiAgICAgIGN1cnJlbnQuc2V0RGF0ZShjdXJyZW50LmdldERhdGUoKSArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZXM7XG4gIH07XG5cbiAgdGhpcy5fcmVmcmVzaFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeWVhciA9IHRoaXMuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgbW9udGggPSB0aGlzLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSxcbiAgICAgIGZpcnN0RGF5T2ZNb250aCA9IG5ldyBEYXRlKHRoaXMuYWN0aXZlRGF0ZSk7XG5cbiAgICBmaXJzdERheU9mTW9udGguc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIDEpO1xuXG4gICAgdmFyIGRpZmZlcmVuY2UgPSB0aGlzLnN0YXJ0aW5nRGF5IC0gZmlyc3REYXlPZk1vbnRoLmdldERheSgpLFxuICAgICAgbnVtRGlzcGxheWVkRnJvbVByZXZpb3VzTW9udGggPSBkaWZmZXJlbmNlID4gMCA/XG4gICAgICAgIDcgLSBkaWZmZXJlbmNlIDogLSBkaWZmZXJlbmNlLFxuICAgICAgZmlyc3REYXRlID0gbmV3IERhdGUoZmlyc3REYXlPZk1vbnRoKTtcblxuICAgIGlmIChudW1EaXNwbGF5ZWRGcm9tUHJldmlvdXNNb250aCA+IDApIHtcbiAgICAgIGZpcnN0RGF0ZS5zZXREYXRlKC1udW1EaXNwbGF5ZWRGcm9tUHJldmlvdXNNb250aCArIDEpO1xuICAgIH1cblxuICAgIC8vIDQyIGlzIHRoZSBudW1iZXIgb2YgZGF5cyBvbiBhIHNpeC13ZWVrIGNhbGVuZGFyXG4gICAgdmFyIGRheXMgPSB0aGlzLmdldERhdGVzKGZpcnN0RGF0ZSwgNDIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDI7IGkgKyspIHtcbiAgICAgIGRheXNbaV0gPSBhbmd1bGFyLmV4dGVuZCh0aGlzLmNyZWF0ZURhdGVPYmplY3QoZGF5c1tpXSwgdGhpcy5mb3JtYXREYXkpLCB7XG4gICAgICAgIHNlY29uZGFyeTogZGF5c1tpXS5nZXRNb250aCgpICE9PSBtb250aCxcbiAgICAgICAgdWlkOiBzY29wZS51bmlxdWVJZCArICctJyArIGlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNjb3BlLmxhYmVscyA9IG5ldyBBcnJheSg3KTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDc7IGorKykge1xuICAgICAgc2NvcGUubGFiZWxzW2pdID0ge1xuICAgICAgICBhYmJyOiBkYXRlRmlsdGVyKGRheXNbal0uZGF0ZSwgdGhpcy5mb3JtYXREYXlIZWFkZXIpLFxuICAgICAgICBmdWxsOiBkYXRlRmlsdGVyKGRheXNbal0uZGF0ZSwgJ0VFRUUnKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzY29wZS50aXRsZSA9IGRhdGVGaWx0ZXIodGhpcy5hY3RpdmVEYXRlLCB0aGlzLmZvcm1hdERheVRpdGxlKTtcbiAgICBzY29wZS5yb3dzID0gdGhpcy5zcGxpdChkYXlzLCA3KTtcblxuICAgIGlmIChzY29wZS5zaG93V2Vla3MpIHtcbiAgICAgIHNjb3BlLndlZWtOdW1iZXJzID0gW107XG4gICAgICB2YXIgdGh1cnNkYXlJbmRleCA9ICg0ICsgNyAtIHRoaXMuc3RhcnRpbmdEYXkpICUgNyxcbiAgICAgICAgICBudW1XZWVrcyA9IHNjb3BlLnJvd3MubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgY3VyV2VlayA9IDA7IGN1cldlZWsgPCBudW1XZWVrczsgY3VyV2VlaysrKSB7XG4gICAgICAgIHNjb3BlLndlZWtOdW1iZXJzLnB1c2goXG4gICAgICAgICAgZ2V0SVNPODYwMVdlZWtOdW1iZXIoc2NvcGUucm93c1tjdXJXZWVrXVt0aHVyc2RheUluZGV4XS5kYXRlKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuY29tcGFyZSA9IGZ1bmN0aW9uKGRhdGUxLCBkYXRlMikge1xuICAgIHZhciBfZGF0ZTEgPSBuZXcgRGF0ZShkYXRlMS5nZXRGdWxsWWVhcigpLCBkYXRlMS5nZXRNb250aCgpLCBkYXRlMS5nZXREYXRlKCkpO1xuICAgIHZhciBfZGF0ZTIgPSBuZXcgRGF0ZShkYXRlMi5nZXRGdWxsWWVhcigpLCBkYXRlMi5nZXRNb250aCgpLCBkYXRlMi5nZXREYXRlKCkpO1xuICAgIF9kYXRlMS5zZXRGdWxsWWVhcihkYXRlMS5nZXRGdWxsWWVhcigpKTtcbiAgICBfZGF0ZTIuc2V0RnVsbFllYXIoZGF0ZTIuZ2V0RnVsbFllYXIoKSk7XG4gICAgcmV0dXJuIF9kYXRlMSAtIF9kYXRlMjtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRJU084NjAxV2Vla051bWJlcihkYXRlKSB7XG4gICAgdmFyIGNoZWNrRGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNoZWNrRGF0ZS5zZXREYXRlKGNoZWNrRGF0ZS5nZXREYXRlKCkgKyA0IC0gKGNoZWNrRGF0ZS5nZXREYXkoKSB8fCA3KSk7IC8vIFRodXJzZGF5XG4gICAgdmFyIHRpbWUgPSBjaGVja0RhdGUuZ2V0VGltZSgpO1xuICAgIGNoZWNrRGF0ZS5zZXRNb250aCgwKTsgLy8gQ29tcGFyZSB3aXRoIEphbiAxXG4gICAgY2hlY2tEYXRlLnNldERhdGUoMSk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yb3VuZCgodGltZSAtIGNoZWNrRGF0ZSkgLyA4NjQwMDAwMCkgLyA3KSArIDE7XG4gIH1cblxuICB0aGlzLmhhbmRsZUtleURvd24gPSBmdW5jdGlvbihrZXksIGV2dCkge1xuICAgIHZhciBkYXRlID0gdGhpcy5hY3RpdmVEYXRlLmdldERhdGUoKTtcblxuICAgIGlmIChrZXkgPT09ICdsZWZ0Jykge1xuICAgICAgZGF0ZSA9IGRhdGUgLSAxO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAndXAnKSB7XG4gICAgICBkYXRlID0gZGF0ZSAtIDc7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdyaWdodCcpIHtcbiAgICAgIGRhdGUgPSBkYXRlICsgMTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2Rvd24nKSB7XG4gICAgICBkYXRlID0gZGF0ZSArIDc7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdwYWdldXAnIHx8IGtleSA9PT0gJ3BhZ2Vkb3duJykge1xuICAgICAgdmFyIG1vbnRoID0gdGhpcy5hY3RpdmVEYXRlLmdldE1vbnRoKCkgKyAoa2V5ID09PSAncGFnZXVwJyA/IC0gMSA6IDEpO1xuICAgICAgdGhpcy5hY3RpdmVEYXRlLnNldE1vbnRoKG1vbnRoLCAxKTtcbiAgICAgIGRhdGUgPSBNYXRoLm1pbihnZXREYXlzSW5Nb250aCh0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSwgdGhpcy5hY3RpdmVEYXRlLmdldE1vbnRoKCkpLCBkYXRlKTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2hvbWUnKSB7XG4gICAgICBkYXRlID0gMTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2VuZCcpIHtcbiAgICAgIGRhdGUgPSBnZXREYXlzSW5Nb250aCh0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSwgdGhpcy5hY3RpdmVEYXRlLmdldE1vbnRoKCkpO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZURhdGUuc2V0RGF0ZShkYXRlKTtcbiAgfTtcbn1dKVxuXG4uY29udHJvbGxlcignVWliTW9udGhwaWNrZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnZGF0ZUZpbHRlcicsIGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCwgZGF0ZUZpbHRlcikge1xuICB0aGlzLnN0ZXAgPSB7IHllYXJzOiAxIH07XG4gIHRoaXMuZWxlbWVudCA9ICRlbGVtZW50O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICBhbmd1bGFyLmV4dGVuZChjdHJsLCB0aGlzKTtcbiAgICBjdHJsLnJlZnJlc2hWaWV3KCk7XG4gIH07XG5cbiAgdGhpcy5fcmVmcmVzaFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbW9udGhzID0gbmV3IEFycmF5KDEyKSxcbiAgICAgICAgeWVhciA9IHRoaXMuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICBkYXRlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUodGhpcy5hY3RpdmVEYXRlKTtcbiAgICAgIGRhdGUuc2V0RnVsbFllYXIoeWVhciwgaSwgMSk7XG4gICAgICBtb250aHNbaV0gPSBhbmd1bGFyLmV4dGVuZCh0aGlzLmNyZWF0ZURhdGVPYmplY3QoZGF0ZSwgdGhpcy5mb3JtYXRNb250aCksIHtcbiAgICAgICAgdWlkOiBzY29wZS51bmlxdWVJZCArICctJyArIGlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNjb3BlLnRpdGxlID0gZGF0ZUZpbHRlcih0aGlzLmFjdGl2ZURhdGUsIHRoaXMuZm9ybWF0TW9udGhUaXRsZSk7XG4gICAgc2NvcGUucm93cyA9IHRoaXMuc3BsaXQobW9udGhzLCAzKTtcbiAgfTtcblxuICB0aGlzLmNvbXBhcmUgPSBmdW5jdGlvbihkYXRlMSwgZGF0ZTIpIHtcbiAgICB2YXIgX2RhdGUxID0gbmV3IERhdGUoZGF0ZTEuZ2V0RnVsbFllYXIoKSwgZGF0ZTEuZ2V0TW9udGgoKSk7XG4gICAgdmFyIF9kYXRlMiA9IG5ldyBEYXRlKGRhdGUyLmdldEZ1bGxZZWFyKCksIGRhdGUyLmdldE1vbnRoKCkpO1xuICAgIF9kYXRlMS5zZXRGdWxsWWVhcihkYXRlMS5nZXRGdWxsWWVhcigpKTtcbiAgICBfZGF0ZTIuc2V0RnVsbFllYXIoZGF0ZTIuZ2V0RnVsbFllYXIoKSk7XG4gICAgcmV0dXJuIF9kYXRlMSAtIF9kYXRlMjtcbiAgfTtcblxuICB0aGlzLmhhbmRsZUtleURvd24gPSBmdW5jdGlvbihrZXksIGV2dCkge1xuICAgIHZhciBkYXRlID0gdGhpcy5hY3RpdmVEYXRlLmdldE1vbnRoKCk7XG5cbiAgICBpZiAoa2V5ID09PSAnbGVmdCcpIHtcbiAgICAgIGRhdGUgPSBkYXRlIC0gMTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3VwJykge1xuICAgICAgZGF0ZSA9IGRhdGUgLSAzO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAncmlnaHQnKSB7XG4gICAgICBkYXRlID0gZGF0ZSArIDE7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdkb3duJykge1xuICAgICAgZGF0ZSA9IGRhdGUgKyAzO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAncGFnZXVwJyB8fCBrZXkgPT09ICdwYWdlZG93bicpIHtcbiAgICAgIHZhciB5ZWFyID0gdGhpcy5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCkgKyAoa2V5ID09PSAncGFnZXVwJyA/IC0gMSA6IDEpO1xuICAgICAgdGhpcy5hY3RpdmVEYXRlLnNldEZ1bGxZZWFyKHllYXIpO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnaG9tZScpIHtcbiAgICAgIGRhdGUgPSAwO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnZW5kJykge1xuICAgICAgZGF0ZSA9IDExO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZURhdGUuc2V0TW9udGgoZGF0ZSk7XG4gIH07XG59XSlcblxuLmNvbnRyb2xsZXIoJ1VpYlllYXJwaWNrZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnZGF0ZUZpbHRlcicsIGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCwgZGF0ZUZpbHRlcikge1xuICB2YXIgY29sdW1ucywgcmFuZ2U7XG4gIHRoaXMuZWxlbWVudCA9ICRlbGVtZW50O1xuXG4gIGZ1bmN0aW9uIGdldFN0YXJ0aW5nWWVhcih5ZWFyKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KCh5ZWFyIC0gMSkgLyByYW5nZSwgMTApICogcmFuZ2UgKyAxO1xuICB9XG5cbiAgdGhpcy55ZWFycGlja2VySW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbHVtbnMgPSB0aGlzLnllYXJDb2x1bW5zO1xuICAgIHJhbmdlID0gdGhpcy55ZWFyUm93cyAqIGNvbHVtbnM7XG4gICAgdGhpcy5zdGVwID0geyB5ZWFyczogcmFuZ2UgfTtcbiAgfTtcblxuICB0aGlzLl9yZWZyZXNoVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB5ZWFycyA9IG5ldyBBcnJheShyYW5nZSksIGRhdGU7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgc3RhcnQgPSBnZXRTdGFydGluZ1llYXIodGhpcy5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCkpOyBpIDwgcmFuZ2U7IGkrKykge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgICBkYXRlLnNldEZ1bGxZZWFyKHN0YXJ0ICsgaSwgMCwgMSk7XG4gICAgICB5ZWFyc1tpXSA9IGFuZ3VsYXIuZXh0ZW5kKHRoaXMuY3JlYXRlRGF0ZU9iamVjdChkYXRlLCB0aGlzLmZvcm1hdFllYXIpLCB7XG4gICAgICAgIHVpZDogc2NvcGUudW5pcXVlSWQgKyAnLScgKyBpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzY29wZS50aXRsZSA9IFt5ZWFyc1swXS5sYWJlbCwgeWVhcnNbcmFuZ2UgLSAxXS5sYWJlbF0uam9pbignIC0gJyk7XG4gICAgc2NvcGUucm93cyA9IHRoaXMuc3BsaXQoeWVhcnMsIGNvbHVtbnMpO1xuICAgIHNjb3BlLmNvbHVtbnMgPSBjb2x1bW5zO1xuICB9O1xuXG4gIHRoaXMuY29tcGFyZSA9IGZ1bmN0aW9uKGRhdGUxLCBkYXRlMikge1xuICAgIHJldHVybiBkYXRlMS5nZXRGdWxsWWVhcigpIC0gZGF0ZTIuZ2V0RnVsbFllYXIoKTtcbiAgfTtcblxuICB0aGlzLmhhbmRsZUtleURvd24gPSBmdW5jdGlvbihrZXksIGV2dCkge1xuICAgIHZhciBkYXRlID0gdGhpcy5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICBpZiAoa2V5ID09PSAnbGVmdCcpIHtcbiAgICAgIGRhdGUgPSBkYXRlIC0gMTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3VwJykge1xuICAgICAgZGF0ZSA9IGRhdGUgLSBjb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAncmlnaHQnKSB7XG4gICAgICBkYXRlID0gZGF0ZSArIDE7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdkb3duJykge1xuICAgICAgZGF0ZSA9IGRhdGUgKyBjb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAncGFnZXVwJyB8fCBrZXkgPT09ICdwYWdlZG93bicpIHtcbiAgICAgIGRhdGUgKz0gKGtleSA9PT0gJ3BhZ2V1cCcgPyAtIDEgOiAxKSAqIHJhbmdlO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnaG9tZScpIHtcbiAgICAgIGRhdGUgPSBnZXRTdGFydGluZ1llYXIodGhpcy5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCkpO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnZW5kJykge1xuICAgICAgZGF0ZSA9IGdldFN0YXJ0aW5nWWVhcih0aGlzLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSkgKyByYW5nZSAtIDE7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlRGF0ZS5zZXRGdWxsWWVhcihkYXRlKTtcbiAgfTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJEYXRlcGlja2VyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5odG1sJztcbiAgICB9LFxuICAgIHNjb3BlOiB7XG4gICAgICBkYXRlcGlja2VyTW9kZTogJz0/JyxcbiAgICAgIGRhdGVwaWNrZXJPcHRpb25zOiAnPT8nLFxuICAgICAgZGF0ZURpc2FibGVkOiAnJicsXG4gICAgICBjdXN0b21DbGFzczogJyYnLFxuICAgICAgc2hvcnRjdXRQcm9wYWdhdGlvbjogJyY/J1xuICAgIH0sXG4gICAgcmVxdWlyZTogWyd1aWJEYXRlcGlja2VyJywgJ15uZ01vZGVsJ10sXG4gICAgY29udHJvbGxlcjogJ1VpYkRhdGVwaWNrZXJDb250cm9sbGVyJyxcbiAgICBjb250cm9sbGVyQXM6ICdkYXRlcGlja2VyJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgZGF0ZXBpY2tlckN0cmwgPSBjdHJsc1swXSwgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgZGF0ZXBpY2tlckN0cmwuaW5pdChuZ01vZGVsQ3RybCk7XG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliRGF5cGlja2VyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvZGF5Lmh0bWwnO1xuICAgIH0sXG4gICAgcmVxdWlyZTogWydedWliRGF0ZXBpY2tlcicsICd1aWJEYXlwaWNrZXInXSxcbiAgICBjb250cm9sbGVyOiAnVWliRGF5cGlja2VyQ29udHJvbGxlcicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgdmFyIGRhdGVwaWNrZXJDdHJsID0gY3RybHNbMF0sXG4gICAgICAgIGRheXBpY2tlckN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgZGF5cGlja2VyQ3RybC5pbml0KGRhdGVwaWNrZXJDdHJsKTtcbiAgICB9XG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJNb250aHBpY2tlcicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3VpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL21vbnRoLmh0bWwnO1xuICAgIH0sXG4gICAgcmVxdWlyZTogWydedWliRGF0ZXBpY2tlcicsICd1aWJNb250aHBpY2tlciddLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJNb250aHBpY2tlckNvbnRyb2xsZXInLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBkYXRlcGlja2VyQ3RybCA9IGN0cmxzWzBdLFxuICAgICAgICBtb250aHBpY2tlckN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgbW9udGhwaWNrZXJDdHJsLmluaXQoZGF0ZXBpY2tlckN0cmwpO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlllYXJwaWNrZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci95ZWFyLmh0bWwnO1xuICAgIH0sXG4gICAgcmVxdWlyZTogWydedWliRGF0ZXBpY2tlcicsICd1aWJZZWFycGlja2VyJ10sXG4gICAgY29udHJvbGxlcjogJ1VpYlllYXJwaWNrZXJDb250cm9sbGVyJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgYW5ndWxhci5leHRlbmQoY3RybCwgY3RybHNbMV0pO1xuICAgICAgY3RybC55ZWFycGlja2VySW5pdCgpO1xuXG4gICAgICBjdHJsLnJlZnJlc2hWaWV3KCk7XG4gICAgfVxuICB9O1xufSlcblxuLmNvbnN0YW50KCd1aWJEYXRlcGlja2VyUG9wdXBDb25maWcnLCB7XG4gIGFsdElucHV0Rm9ybWF0czogW10sXG4gIGFwcGVuZFRvQm9keTogZmFsc2UsXG4gIGNsZWFyVGV4dDogJ0NsZWFyJyxcbiAgY2xvc2VPbkRhdGVTZWxlY3Rpb246IHRydWUsXG4gIGNsb3NlVGV4dDogJ0RvbmUnLFxuICBjdXJyZW50VGV4dDogJ1RvZGF5JyxcbiAgZGF0ZXBpY2tlclBvcHVwOiAneXl5eS1NTS1kZCcsXG4gIGRhdGVwaWNrZXJQb3B1cFRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvcG9wdXAuaHRtbCcsXG4gIGRhdGVwaWNrZXJUZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL2RhdGVwaWNrZXIuaHRtbCcsXG4gIGh0bWw1VHlwZXM6IHtcbiAgICBkYXRlOiAneXl5eS1NTS1kZCcsXG4gICAgJ2RhdGV0aW1lLWxvY2FsJzogJ3l5eXktTU0tZGRUSEg6bW06c3Muc3NzJyxcbiAgICAnbW9udGgnOiAneXl5eS1NTSdcbiAgfSxcbiAgb25PcGVuRm9jdXM6IHRydWUsXG4gIHNob3dCdXR0b25CYXI6IHRydWVcbn0pXG5cbi5jb250cm9sbGVyKCdVaWJEYXRlcGlja2VyUG9wdXBDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgJyRjb21waWxlJywgJyRwYXJzZScsICckZG9jdW1lbnQnLCAnJHJvb3RTY29wZScsICckdWliUG9zaXRpb24nLCAnZGF0ZUZpbHRlcicsICd1aWJEYXRlUGFyc2VyJywgJ3VpYkRhdGVwaWNrZXJQb3B1cENvbmZpZycsICckdGltZW91dCcsICd1aWJEYXRlcGlja2VyQ29uZmlnJyxcbmZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgJGNvbXBpbGUsICRwYXJzZSwgJGRvY3VtZW50LCAkcm9vdFNjb3BlLCAkcG9zaXRpb24sIGRhdGVGaWx0ZXIsIGRhdGVQYXJzZXIsIGRhdGVwaWNrZXJQb3B1cENvbmZpZywgJHRpbWVvdXQsIGRhdGVwaWNrZXJDb25maWcpIHtcbiAgdmFyIGNhY2hlID0ge30sXG4gICAgaXNIdG1sNURhdGVJbnB1dCA9IGZhbHNlO1xuICB2YXIgZGF0ZUZvcm1hdCwgY2xvc2VPbkRhdGVTZWxlY3Rpb24sIGFwcGVuZFRvQm9keSwgb25PcGVuRm9jdXMsXG4gICAgZGF0ZXBpY2tlclBvcHVwVGVtcGxhdGVVcmwsIGRhdGVwaWNrZXJUZW1wbGF0ZVVybCwgcG9wdXBFbCwgZGF0ZXBpY2tlckVsLFxuICAgIG5nTW9kZWwsIG5nTW9kZWxPcHRpb25zLCAkcG9wdXAsIGFsdElucHV0Rm9ybWF0cywgd2F0Y2hMaXN0ZW5lcnMgPSBbXTtcblxuICBzY29wZS53YXRjaERhdGEgPSB7fTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbihfbmdNb2RlbF8pIHtcbiAgICBuZ01vZGVsID0gX25nTW9kZWxfO1xuICAgIG5nTW9kZWxPcHRpb25zID0gX25nTW9kZWxfLiRvcHRpb25zIHx8IGRhdGVwaWNrZXJDb25maWcubmdNb2RlbE9wdGlvbnM7XG4gICAgY2xvc2VPbkRhdGVTZWxlY3Rpb24gPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5jbG9zZU9uRGF0ZVNlbGVjdGlvbikgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmNsb3NlT25EYXRlU2VsZWN0aW9uKSA6IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5jbG9zZU9uRGF0ZVNlbGVjdGlvbjtcbiAgICBhcHBlbmRUb0JvZHkgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kYXRlcGlja2VyQXBwZW5kVG9Cb2R5KSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuZGF0ZXBpY2tlckFwcGVuZFRvQm9keSkgOiBkYXRlcGlja2VyUG9wdXBDb25maWcuYXBwZW5kVG9Cb2R5O1xuICAgIG9uT3BlbkZvY3VzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMub25PcGVuRm9jdXMpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5vbk9wZW5Gb2N1cykgOiBkYXRlcGlja2VyUG9wdXBDb25maWcub25PcGVuRm9jdXM7XG4gICAgZGF0ZXBpY2tlclBvcHVwVGVtcGxhdGVVcmwgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kYXRlcGlja2VyUG9wdXBUZW1wbGF0ZVVybCkgPyBhdHRycy5kYXRlcGlja2VyUG9wdXBUZW1wbGF0ZVVybCA6IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5kYXRlcGlja2VyUG9wdXBUZW1wbGF0ZVVybDtcbiAgICBkYXRlcGlja2VyVGVtcGxhdGVVcmwgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kYXRlcGlja2VyVGVtcGxhdGVVcmwpID8gYXR0cnMuZGF0ZXBpY2tlclRlbXBsYXRlVXJsIDogZGF0ZXBpY2tlclBvcHVwQ29uZmlnLmRhdGVwaWNrZXJUZW1wbGF0ZVVybDtcbiAgICBhbHRJbnB1dEZvcm1hdHMgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5hbHRJbnB1dEZvcm1hdHMpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5hbHRJbnB1dEZvcm1hdHMpIDogZGF0ZXBpY2tlclBvcHVwQ29uZmlnLmFsdElucHV0Rm9ybWF0cztcblxuICAgIHNjb3BlLnNob3dCdXR0b25CYXIgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5zaG93QnV0dG9uQmFyKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuc2hvd0J1dHRvbkJhcikgOiBkYXRlcGlja2VyUG9wdXBDb25maWcuc2hvd0J1dHRvbkJhcjtcblxuICAgIGlmIChkYXRlcGlja2VyUG9wdXBDb25maWcuaHRtbDVUeXBlc1thdHRycy50eXBlXSkge1xuICAgICAgZGF0ZUZvcm1hdCA9IGRhdGVwaWNrZXJQb3B1cENvbmZpZy5odG1sNVR5cGVzW2F0dHJzLnR5cGVdO1xuICAgICAgaXNIdG1sNURhdGVJbnB1dCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGVGb3JtYXQgPSBhdHRycy51aWJEYXRlcGlja2VyUG9wdXAgfHwgZGF0ZXBpY2tlclBvcHVwQ29uZmlnLmRhdGVwaWNrZXJQb3B1cDtcbiAgICAgIGF0dHJzLiRvYnNlcnZlKCd1aWJEYXRlcGlja2VyUG9wdXAnLCBmdW5jdGlvbih2YWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgdmFyIG5ld0RhdGVGb3JtYXQgPSB2YWx1ZSB8fCBkYXRlcGlja2VyUG9wdXBDb25maWcuZGF0ZXBpY2tlclBvcHVwO1xuICAgICAgICAvLyBJbnZhbGlkYXRlIHRoZSAkbW9kZWxWYWx1ZSB0byBlbnN1cmUgdGhhdCBmb3JtYXR0ZXJzIHJlLXJ1blxuICAgICAgICAvLyBGSVhNRTogUmVmYWN0b3Igd2hlbiBQUiBpcyBtZXJnZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvcHVsbC8xMDc2NFxuICAgICAgICBpZiAobmV3RGF0ZUZvcm1hdCAhPT0gZGF0ZUZvcm1hdCkge1xuICAgICAgICAgIGRhdGVGb3JtYXQgPSBuZXdEYXRlRm9ybWF0O1xuICAgICAgICAgIG5nTW9kZWwuJG1vZGVsVmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKCFkYXRlRm9ybWF0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VpYkRhdGVwaWNrZXJQb3B1cCBtdXN0IGhhdmUgYSBkYXRlIGZvcm1hdCBzcGVjaWZpZWQuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGVGb3JtYXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndWliRGF0ZXBpY2tlclBvcHVwIG11c3QgaGF2ZSBhIGRhdGUgZm9ybWF0IHNwZWNpZmllZC4nKTtcbiAgICB9XG5cbiAgICBpZiAoaXNIdG1sNURhdGVJbnB1dCAmJiBhdHRycy51aWJEYXRlcGlja2VyUG9wdXApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSFRNTDUgZGF0ZSBpbnB1dCB0eXBlcyBkbyBub3Qgc3VwcG9ydCBjdXN0b20gZm9ybWF0cy4nKTtcbiAgICB9XG5cbiAgICAvLyBwb3B1cCBlbGVtZW50IHVzZWQgdG8gZGlzcGxheSBjYWxlbmRhclxuICAgIHBvcHVwRWwgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgdWliLWRhdGVwaWNrZXItcG9wdXAtd3JhcD48ZGl2IHVpYi1kYXRlcGlja2VyPjwvZGl2PjwvZGl2PicpO1xuICAgIHNjb3BlLm5nTW9kZWxPcHRpb25zID0gYW5ndWxhci5jb3B5KG5nTW9kZWxPcHRpb25zKTtcbiAgICBzY29wZS5uZ01vZGVsT3B0aW9ucy50aW1lem9uZSA9IG51bGw7XG4gICAgcG9wdXBFbC5hdHRyKHtcbiAgICAgICduZy1tb2RlbCc6ICdkYXRlJyxcbiAgICAgICduZy1tb2RlbC1vcHRpb25zJzogJ25nTW9kZWxPcHRpb25zJyxcbiAgICAgICduZy1jaGFuZ2UnOiAnZGF0ZVNlbGVjdGlvbihkYXRlKScsXG4gICAgICAndGVtcGxhdGUtdXJsJzogZGF0ZXBpY2tlclBvcHVwVGVtcGxhdGVVcmxcbiAgICB9KTtcblxuICAgIC8vIGRhdGVwaWNrZXIgZWxlbWVudFxuICAgIGRhdGVwaWNrZXJFbCA9IGFuZ3VsYXIuZWxlbWVudChwb3B1cEVsLmNoaWxkcmVuKClbMF0pO1xuICAgIGRhdGVwaWNrZXJFbC5hdHRyKCd0ZW1wbGF0ZS11cmwnLCBkYXRlcGlja2VyVGVtcGxhdGVVcmwpO1xuXG4gICAgaWYgKGlzSHRtbDVEYXRlSW5wdXQpIHtcbiAgICAgIGlmIChhdHRycy50eXBlID09PSAnbW9udGgnKSB7XG4gICAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKCdkYXRlcGlja2VyLW1vZGUnLCAnXCJtb250aFwiJyk7XG4gICAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKCdtaW4tbW9kZScsICdtb250aCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzY29wZS5kYXRlcGlja2VyT3B0aW9ucykge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHNjb3BlLmRhdGVwaWNrZXJPcHRpb25zLCBmdW5jdGlvbih2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGlzIG9wdGlvbnMsIHdpbGwgYmUgbWFuYWdlZCBsYXRlclxuICAgICAgICBpZiAoWydtaW5EYXRlJywgJ21heERhdGUnLCAnbWluTW9kZScsICdtYXhNb2RlJywgJ2luaXREYXRlJywgJ2RhdGVwaWNrZXJNb2RlJ10uaW5kZXhPZihvcHRpb24pID09PSAtMSkge1xuICAgICAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKGNhbWVsdG9EYXNoKG9wdGlvbiksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRlcGlja2VyRWwuYXR0cihjYW1lbHRvRGFzaChvcHRpb24pLCAnZGF0ZXBpY2tlck9wdGlvbnMuJyArIG9wdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGFuZ3VsYXIuZm9yRWFjaChbJ21pbk1vZGUnLCAnbWF4TW9kZScsICdkYXRlcGlja2VyTW9kZScsICdzaG9ydGN1dFByb3BhZ2F0aW9uJ10sIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGF0dHJzW2tleV0pIHtcbiAgICAgICAgdmFyIGdldEF0dHJpYnV0ZSA9ICRwYXJzZShhdHRyc1trZXldKTtcbiAgICAgICAgdmFyIHByb3BDb25maWcgPSB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRBdHRyaWJ1dGUoc2NvcGUuJHBhcmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKGNhbWVsdG9EYXNoKGtleSksICd3YXRjaERhdGEuJyArIGtleSk7XG5cbiAgICAgICAgLy8gUHJvcGFnYXRlIGNoYW5nZXMgZnJvbSBkYXRlcGlja2VyIHRvIG91dHNpZGVcbiAgICAgICAgaWYgKGtleSA9PT0gJ2RhdGVwaWNrZXJNb2RlJykge1xuICAgICAgICAgIHZhciBzZXRBdHRyaWJ1dGUgPSBnZXRBdHRyaWJ1dGUuYXNzaWduO1xuICAgICAgICAgIHByb3BDb25maWcuc2V0ID0gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgc2V0QXR0cmlidXRlKHNjb3BlLiRwYXJlbnQsIHYpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2NvcGUud2F0Y2hEYXRhLCBrZXksIHByb3BDb25maWcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYW5ndWxhci5mb3JFYWNoKFsnbWluRGF0ZScsICdtYXhEYXRlJywgJ2luaXREYXRlJ10sIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGF0dHJzW2tleV0pIHtcbiAgICAgICAgdmFyIGdldEF0dHJpYnV0ZSA9ICRwYXJzZShhdHRyc1trZXldKTtcblxuICAgICAgICB3YXRjaExpc3RlbmVycy5wdXNoKHNjb3BlLiRwYXJlbnQuJHdhdGNoKGdldEF0dHJpYnV0ZSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnbWluRGF0ZScgfHwga2V5ID09PSAnbWF4RGF0ZScpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBjYWNoZVtrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNhY2hlW2tleV0gPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZShuZXcgRGF0ZSh2YWx1ZSksIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNhY2hlW2tleV0gPSBuZXcgRGF0ZShkYXRlRmlsdGVyKHZhbHVlLCAnbWVkaXVtJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS53YXRjaERhdGFba2V5XSA9IHZhbHVlID09PSBudWxsID8gbnVsbCA6IGNhY2hlW2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjb3BlLndhdGNoRGF0YVtrZXldID0gZGF0ZVBhcnNlci5mcm9tVGltZXpvbmUobmV3IERhdGUodmFsdWUpLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoY2FtZWx0b0Rhc2goa2V5KSwgJ3dhdGNoRGF0YS4nICsga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChhdHRycy5kYXRlRGlzYWJsZWQpIHtcbiAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKCdkYXRlLWRpc2FibGVkJywgJ2RhdGVEaXNhYmxlZCh7IGRhdGU6IGRhdGUsIG1vZGU6IG1vZGUgfSknKTtcbiAgICB9XG5cbiAgICBhbmd1bGFyLmZvckVhY2goWydmb3JtYXREYXknLCAnZm9ybWF0TW9udGgnLCAnZm9ybWF0WWVhcicsICdmb3JtYXREYXlIZWFkZXInLCAnZm9ybWF0RGF5VGl0bGUnLCAnZm9ybWF0TW9udGhUaXRsZScsICdzaG93V2Vla3MnLCAnc3RhcnRpbmdEYXknLCAneWVhclJvd3MnLCAneWVhckNvbHVtbnMnXSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXR0cnNba2V5XSkpIHtcbiAgICAgICAgZGF0ZXBpY2tlckVsLmF0dHIoY2FtZWx0b0Rhc2goa2V5KSwgYXR0cnNba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoYXR0cnMuY3VzdG9tQ2xhc3MpIHtcbiAgICAgIGRhdGVwaWNrZXJFbC5hdHRyKCdjdXN0b20tY2xhc3MnLCAnY3VzdG9tQ2xhc3MoeyBkYXRlOiBkYXRlLCBtb2RlOiBtb2RlIH0pJyk7XG4gICAgfVxuXG4gICAgaWYgKCFpc0h0bWw1RGF0ZUlucHV0KSB7XG4gICAgICAvLyBJbnRlcm5hbCBBUEkgdG8gbWFpbnRhaW4gdGhlIGNvcnJlY3QgbmctaW52YWxpZC1ba2V5XSBjbGFzc1xuICAgICAgbmdNb2RlbC4kJHBhcnNlck5hbWUgPSAnZGF0ZSc7XG4gICAgICBuZ01vZGVsLiR2YWxpZGF0b3JzLmRhdGUgPSB2YWxpZGF0b3I7XG4gICAgICBuZ01vZGVsLiRwYXJzZXJzLnVuc2hpZnQocGFyc2VEYXRlKTtcbiAgICAgIG5nTW9kZWwuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAobmdNb2RlbC4kaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICBzY29wZS5kYXRlID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUuZGF0ZSA9IGRhdGVQYXJzZXIuZnJvbVRpbWV6b25lKHZhbHVlLCBuZ01vZGVsT3B0aW9ucy50aW1lem9uZSk7XG5cbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoc2NvcGUuZGF0ZSkpIHtcbiAgICAgICAgICBzY29wZS5kYXRlID0gbmV3IERhdGUoc2NvcGUuZGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0ZVBhcnNlci5maWx0ZXIoc2NvcGUuZGF0ZSwgZGF0ZUZvcm1hdCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmdNb2RlbC4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHNjb3BlLmRhdGUgPSBkYXRlUGFyc2VyLmZyb21UaW1lem9uZSh2YWx1ZSwgbmdNb2RlbE9wdGlvbnMudGltZXpvbmUpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3QgY2hhbmdlcyBpbiB0aGUgdmlldyBmcm9tIHRoZSB0ZXh0IGJveFxuICAgIG5nTW9kZWwuJHZpZXdDaGFuZ2VMaXN0ZW5lcnMucHVzaChmdW5jdGlvbigpIHtcbiAgICAgIHNjb3BlLmRhdGUgPSBwYXJzZURhdGVTdHJpbmcobmdNb2RlbC4kdmlld1ZhbHVlKTtcbiAgICB9KTtcblxuICAgIGVsZW1lbnQub24oJ2tleWRvd24nLCBpbnB1dEtleWRvd25CaW5kKTtcblxuICAgICRwb3B1cCA9ICRjb21waWxlKHBvcHVwRWwpKHNjb3BlKTtcbiAgICAvLyBQcmV2ZW50IGpRdWVyeSBjYWNoZSBtZW1vcnkgbGVhayAodGVtcGxhdGUgaXMgbm93IHJlZHVuZGFudCBhZnRlciBsaW5raW5nKVxuICAgIHBvcHVwRWwucmVtb3ZlKCk7XG5cbiAgICBpZiAoYXBwZW5kVG9Cb2R5KSB7XG4gICAgICAkZG9jdW1lbnQuZmluZCgnYm9keScpLmFwcGVuZCgkcG9wdXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmFmdGVyKCRwb3B1cCk7XG4gICAgfVxuXG4gICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNjb3BlLmlzT3BlbiA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAoISRyb290U2NvcGUuJCRwaGFzZSkge1xuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICRwb3B1cC5yZW1vdmUoKTtcbiAgICAgIGVsZW1lbnQub2ZmKCdrZXlkb3duJywgaW5wdXRLZXlkb3duQmluZCk7XG4gICAgICAkZG9jdW1lbnQub2ZmKCdjbGljaycsIGRvY3VtZW50Q2xpY2tCaW5kKTtcblxuICAgICAgLy9DbGVhciBhbGwgd2F0Y2ggbGlzdGVuZXJzIG9uIGRlc3Ryb3lcbiAgICAgIHdoaWxlICh3YXRjaExpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgICAgd2F0Y2hMaXN0ZW5lcnMuc2hpZnQoKSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHNjb3BlLmdldFRleHQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gc2NvcGVba2V5ICsgJ1RleHQnXSB8fCBkYXRlcGlja2VyUG9wdXBDb25maWdba2V5ICsgJ1RleHQnXTtcbiAgfTtcblxuICBzY29wZS5pc0Rpc2FibGVkID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIGlmIChkYXRlID09PSAndG9kYXknKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NvcGUud2F0Y2hEYXRhLm1pbkRhdGUgJiYgc2NvcGUuY29tcGFyZShkYXRlLCBjYWNoZS5taW5EYXRlKSA8IDAgfHxcbiAgICAgICAgc2NvcGUud2F0Y2hEYXRhLm1heERhdGUgJiYgc2NvcGUuY29tcGFyZShkYXRlLCBjYWNoZS5tYXhEYXRlKSA+IDA7XG4gIH07XG5cbiAgc2NvcGUuY29tcGFyZSA9IGZ1bmN0aW9uKGRhdGUxLCBkYXRlMikge1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlMS5nZXRGdWxsWWVhcigpLCBkYXRlMS5nZXRNb250aCgpLCBkYXRlMS5nZXREYXRlKCkpIC0gbmV3IERhdGUoZGF0ZTIuZ2V0RnVsbFllYXIoKSwgZGF0ZTIuZ2V0TW9udGgoKSwgZGF0ZTIuZ2V0RGF0ZSgpKTtcbiAgfTtcblxuICAvLyBJbm5lciBjaGFuZ2VcbiAgc2NvcGUuZGF0ZVNlbGVjdGlvbiA9IGZ1bmN0aW9uKGR0KSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGR0KSkge1xuICAgICAgc2NvcGUuZGF0ZSA9IGR0O1xuICAgIH1cbiAgICB2YXIgZGF0ZSA9IHNjb3BlLmRhdGUgPyBkYXRlUGFyc2VyLmZpbHRlcihzY29wZS5kYXRlLCBkYXRlRm9ybWF0KSA6IG51bGw7IC8vIFNldHRpbmcgdG8gTlVMTCBpcyBuZWNlc3NhcnkgZm9yIGZvcm0gdmFsaWRhdG9ycyB0byBmdW5jdGlvblxuICAgIGVsZW1lbnQudmFsKGRhdGUpO1xuICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShkYXRlKTtcblxuICAgIGlmIChjbG9zZU9uRGF0ZVNlbGVjdGlvbikge1xuICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgICBlbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgfVxuICB9O1xuXG4gIHNjb3BlLmtleWRvd24gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0LndoaWNoID09PSAyNykge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgICBlbGVtZW50WzBdLmZvY3VzKCk7XG4gICAgfVxuICB9O1xuXG4gIHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBpZiAoZGF0ZSA9PT0gJ3RvZGF5Jykge1xuICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGF0ZShzY29wZS5kYXRlKSkge1xuICAgICAgICBkYXRlID0gbmV3IERhdGUoc2NvcGUuZGF0ZSk7XG4gICAgICAgIGRhdGUuc2V0RnVsbFllYXIodG9kYXkuZ2V0RnVsbFllYXIoKSwgdG9kYXkuZ2V0TW9udGgoKSwgdG9kYXkuZ2V0RGF0ZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNjb3BlLmRhdGVTZWxlY3Rpb24oZGF0ZSk7XG4gIH07XG5cbiAgc2NvcGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICBlbGVtZW50WzBdLmZvY3VzKCk7XG4gIH07XG5cbiAgc2NvcGUuZGlzYWJsZWQgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kaXNhYmxlZCkgfHwgZmFsc2U7XG4gIGlmIChhdHRycy5uZ0Rpc2FibGVkKSB7XG4gICAgd2F0Y2hMaXN0ZW5lcnMucHVzaChzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoYXR0cnMubmdEaXNhYmxlZCksIGZ1bmN0aW9uKGRpc2FibGVkKSB7XG4gICAgICBzY29wZS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH0pKTtcbiAgfVxuXG4gIHNjb3BlLiR3YXRjaCgnaXNPcGVuJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICghc2NvcGUuZGlzYWJsZWQpIHtcbiAgICAgICAgc2NvcGUucG9zaXRpb24gPSBhcHBlbmRUb0JvZHkgPyAkcG9zaXRpb24ub2Zmc2V0KGVsZW1lbnQpIDogJHBvc2l0aW9uLnBvc2l0aW9uKGVsZW1lbnQpO1xuICAgICAgICBzY29wZS5wb3NpdGlvbi50b3AgPSBzY29wZS5wb3NpdGlvbi50b3AgKyBlbGVtZW50LnByb3AoJ29mZnNldEhlaWdodCcpO1xuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChvbk9wZW5Gb2N1cykge1xuICAgICAgICAgICAgc2NvcGUuJGJyb2FkY2FzdCgndWliOmRhdGVwaWNrZXIuZm9jdXMnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJGRvY3VtZW50Lm9uKCdjbGljaycsIGRvY3VtZW50Q2xpY2tCaW5kKTtcbiAgICAgICAgfSwgMCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICRkb2N1bWVudC5vZmYoJ2NsaWNrJywgZG9jdW1lbnRDbGlja0JpbmQpO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gY2FtZWx0b0Rhc2goc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uKCQxKSB7IHJldHVybiAnLScgKyAkMS50b0xvd2VyQ2FzZSgpOyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRGF0ZVN0cmluZyh2aWV3VmFsdWUpIHtcbiAgICB2YXIgZGF0ZSA9IGRhdGVQYXJzZXIucGFyc2Uodmlld1ZhbHVlLCBkYXRlRm9ybWF0LCBzY29wZS5kYXRlKTtcbiAgICBpZiAoaXNOYU4oZGF0ZSkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWx0SW5wdXRGb3JtYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGUgPSBkYXRlUGFyc2VyLnBhcnNlKHZpZXdWYWx1ZSwgYWx0SW5wdXRGb3JtYXRzW2ldLCBzY29wZS5kYXRlKTtcbiAgICAgICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VEYXRlKHZpZXdWYWx1ZSkge1xuICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKHZpZXdWYWx1ZSkpIHtcbiAgICAgIC8vIHByZXN1bWFibHkgdGltZXN0YW1wIHRvIGRhdGUgb2JqZWN0XG4gICAgICB2aWV3VmFsdWUgPSBuZXcgRGF0ZSh2aWV3VmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghdmlld1ZhbHVlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoYW5ndWxhci5pc0RhdGUodmlld1ZhbHVlKSAmJiAhaXNOYU4odmlld1ZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZpZXdWYWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoYW5ndWxhci5pc1N0cmluZyh2aWV3VmFsdWUpKSB7XG4gICAgICB2YXIgZGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyh2aWV3VmFsdWUpO1xuICAgICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgICByZXR1cm4gZGF0ZVBhcnNlci50b1RpbWV6b25lKGRhdGUsIG5nTW9kZWxPcHRpb25zLnRpbWV6b25lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmdNb2RlbC4kb3B0aW9ucyAmJiBuZ01vZGVsLiRvcHRpb25zLmFsbG93SW52YWxpZCA/IHZpZXdWYWx1ZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRvcihtb2RlbFZhbHVlLCB2aWV3VmFsdWUpIHtcbiAgICB2YXIgdmFsdWUgPSBtb2RlbFZhbHVlIHx8IHZpZXdWYWx1ZTtcblxuICAgIGlmICghYXR0cnMubmdSZXF1aXJlZCAmJiAhdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgdmFsdWUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGFuZ3VsYXIuaXNEYXRlKHZhbHVlKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoYW5ndWxhci5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VEYXRlU3RyaW5nKHZpZXdWYWx1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvY3VtZW50Q2xpY2tCaW5kKGV2ZW50KSB7XG4gICAgaWYgKCFzY29wZS5pc09wZW4gJiYgc2NvcGUuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcG9wdXAgPSAkcG9wdXBbMF07XG4gICAgdmFyIGRwQ29udGFpbnNUYXJnZXQgPSBlbGVtZW50WzBdLmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG4gICAgLy8gVGhlIHBvcHVwIG5vZGUgbWF5IG5vdCBiZSBhbiBlbGVtZW50IG5vZGVcbiAgICAvLyBJbiBzb21lIGJyb3dzZXJzIChJRSkgb25seSBlbGVtZW50IG5vZGVzIGhhdmUgdGhlICdjb250YWlucycgZnVuY3Rpb25cbiAgICB2YXIgcG9wdXBDb250YWluc1RhcmdldCA9IHBvcHVwLmNvbnRhaW5zICE9PSB1bmRlZmluZWQgJiYgcG9wdXAuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcbiAgICBpZiAoc2NvcGUuaXNPcGVuICYmICEoZHBDb250YWluc1RhcmdldCB8fCBwb3B1cENvbnRhaW5zVGFyZ2V0KSkge1xuICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlucHV0S2V5ZG93bkJpbmQoZXZ0KSB7XG4gICAgaWYgKGV2dC53aGljaCA9PT0gMjcgJiYgc2NvcGUuaXNPcGVuKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIGVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKGV2dC53aGljaCA9PT0gNDAgJiYgIXNjb3BlLmlzT3Blbikge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjb3BlLmlzT3BlbiA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJEYXRlcGlja2VyUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiBbJ25nTW9kZWwnLCAndWliRGF0ZXBpY2tlclBvcHVwJ10sXG4gICAgY29udHJvbGxlcjogJ1VpYkRhdGVwaWNrZXJQb3B1cENvbnRyb2xsZXInLFxuICAgIHNjb3BlOiB7XG4gICAgICBkYXRlcGlja2VyT3B0aW9uczogJz0/JyxcbiAgICAgIGlzT3BlbjogJz0/JyxcbiAgICAgIGN1cnJlbnRUZXh0OiAnQCcsXG4gICAgICBjbGVhclRleHQ6ICdAJyxcbiAgICAgIGNsb3NlVGV4dDogJ0AnLFxuICAgICAgZGF0ZURpc2FibGVkOiAnJicsXG4gICAgICBjdXN0b21DbGFzczogJyYnXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgbmdNb2RlbCA9IGN0cmxzWzBdLFxuICAgICAgICBjdHJsID0gY3RybHNbMV07XG5cbiAgICAgIGN0cmwuaW5pdChuZ01vZGVsKTtcbiAgICB9XG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJEYXRlcGlja2VyUG9wdXBXcmFwJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9wb3B1cC5odG1sJztcbiAgICB9XG4gIH07XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5kZWJvdW5jZScsIFtdKVxuLyoqXG4gKiBBIGhlbHBlciwgaW50ZXJuYWwgc2VydmljZSB0aGF0IGRlYm91bmNlcyBhIGZ1bmN0aW9uXG4gKi9cbiAgLmZhY3RvcnkoJyQkZGVib3VuY2UnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2ssIGRlYm91bmNlVGltZSkge1xuICAgICAgdmFyIHRpbWVvdXRQcm9taXNlO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBpZiAodGltZW91dFByb21pc2UpIHtcbiAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dFByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGltZW91dFByb21pc2UgPSAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSwgZGVib3VuY2VUaW1lKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmRyb3Bkb3duJywgWyd1aS5ib290c3RyYXAucG9zaXRpb24nXSlcblxuLmNvbnN0YW50KCd1aWJEcm9wZG93bkNvbmZpZycsIHtcbiAgYXBwZW5kVG9PcGVuQ2xhc3M6ICd1aWItZHJvcGRvd24tb3BlbicsXG4gIG9wZW5DbGFzczogJ29wZW4nXG59KVxuXG4uc2VydmljZSgndWliRHJvcGRvd25TZXJ2aWNlJywgWyckZG9jdW1lbnQnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRkb2N1bWVudCwgJHJvb3RTY29wZSkge1xuICB2YXIgb3BlblNjb3BlID0gbnVsbDtcblxuICB0aGlzLm9wZW4gPSBmdW5jdGlvbihkcm9wZG93blNjb3BlKSB7XG4gICAgaWYgKCFvcGVuU2NvcGUpIHtcbiAgICAgICRkb2N1bWVudC5vbignY2xpY2snLCBjbG9zZURyb3Bkb3duKTtcbiAgICAgICRkb2N1bWVudC5vbigna2V5ZG93bicsIGtleWJpbmRGaWx0ZXIpO1xuICAgIH1cblxuICAgIGlmIChvcGVuU2NvcGUgJiYgb3BlblNjb3BlICE9PSBkcm9wZG93blNjb3BlKSB7XG4gICAgICBvcGVuU2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb3BlblNjb3BlID0gZHJvcGRvd25TY29wZTtcbiAgfTtcblxuICB0aGlzLmNsb3NlID0gZnVuY3Rpb24oZHJvcGRvd25TY29wZSkge1xuICAgIGlmIChvcGVuU2NvcGUgPT09IGRyb3Bkb3duU2NvcGUpIHtcbiAgICAgIG9wZW5TY29wZSA9IG51bGw7XG4gICAgICAkZG9jdW1lbnQub2ZmKCdjbGljaycsIGNsb3NlRHJvcGRvd24pO1xuICAgICAgJGRvY3VtZW50Lm9mZigna2V5ZG93bicsIGtleWJpbmRGaWx0ZXIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY2xvc2VEcm9wZG93biA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIC8vIFRoaXMgbWV0aG9kIG1heSBzdGlsbCBiZSBjYWxsZWQgZHVyaW5nIHRoZSBzYW1lIG1vdXNlIGV2ZW50IHRoYXRcbiAgICAvLyB1bmJvdW5kIHRoaXMgZXZlbnQgaGFuZGxlci4gU28gY2hlY2sgb3BlblNjb3BlIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAgIGlmICghb3BlblNjb3BlKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKGV2dCAmJiBvcGVuU2NvcGUuZ2V0QXV0b0Nsb3NlKCkgPT09ICdkaXNhYmxlZCcpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAoZXZ0ICYmIGV2dC53aGljaCA9PT0gMykgeyByZXR1cm47IH1cblxuICAgIHZhciB0b2dnbGVFbGVtZW50ID0gb3BlblNjb3BlLmdldFRvZ2dsZUVsZW1lbnQoKTtcbiAgICBpZiAoZXZ0ICYmIHRvZ2dsZUVsZW1lbnQgJiYgdG9nZ2xlRWxlbWVudFswXS5jb250YWlucyhldnQudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkcm9wZG93bkVsZW1lbnQgPSBvcGVuU2NvcGUuZ2V0RHJvcGRvd25FbGVtZW50KCk7XG4gICAgaWYgKGV2dCAmJiBvcGVuU2NvcGUuZ2V0QXV0b0Nsb3NlKCkgPT09ICdvdXRzaWRlQ2xpY2snICYmXG4gICAgICBkcm9wZG93bkVsZW1lbnQgJiYgZHJvcGRvd25FbGVtZW50WzBdLmNvbnRhaW5zKGV2dC50YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3BlblNjb3BlLmlzT3BlbiA9IGZhbHNlO1xuXG4gICAgaWYgKCEkcm9vdFNjb3BlLiQkcGhhc2UpIHtcbiAgICAgIG9wZW5TY29wZS4kYXBwbHkoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGtleWJpbmRGaWx0ZXIgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0LndoaWNoID09PSAyNykge1xuICAgICAgb3BlblNjb3BlLmZvY3VzVG9nZ2xlRWxlbWVudCgpO1xuICAgICAgY2xvc2VEcm9wZG93bigpO1xuICAgIH0gZWxzZSBpZiAob3BlblNjb3BlLmlzS2V5bmF2RW5hYmxlZCgpICYmIFszOCwgNDBdLmluZGV4T2YoZXZ0LndoaWNoKSAhPT0gLTEgJiYgb3BlblNjb3BlLmlzT3Blbikge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBvcGVuU2NvcGUuZm9jdXNEcm9wZG93bkVudHJ5KGV2dC53aGljaCk7XG4gICAgfVxuICB9O1xufV0pXG5cbi5jb250cm9sbGVyKCdVaWJEcm9wZG93bkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCAnJHBhcnNlJywgJ3VpYkRyb3Bkb3duQ29uZmlnJywgJ3VpYkRyb3Bkb3duU2VydmljZScsICckYW5pbWF0ZScsICckdWliUG9zaXRpb24nLCAnJGRvY3VtZW50JywgJyRjb21waWxlJywgJyR0ZW1wbGF0ZVJlcXVlc3QnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRwYXJzZSwgZHJvcGRvd25Db25maWcsIHVpYkRyb3Bkb3duU2VydmljZSwgJGFuaW1hdGUsICRwb3NpdGlvbiwgJGRvY3VtZW50LCAkY29tcGlsZSwgJHRlbXBsYXRlUmVxdWVzdCkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgc2NvcGUgPSAkc2NvcGUuJG5ldygpLCAvLyBjcmVhdGUgYSBjaGlsZCBzY29wZSBzbyB3ZSBhcmUgbm90IHBvbGx1dGluZyBvcmlnaW5hbCBvbmVcbiAgICB0ZW1wbGF0ZVNjb3BlLFxuICAgIGFwcGVuZFRvT3BlbkNsYXNzID0gZHJvcGRvd25Db25maWcuYXBwZW5kVG9PcGVuQ2xhc3MsXG4gICAgb3BlbkNsYXNzID0gZHJvcGRvd25Db25maWcub3BlbkNsYXNzLFxuICAgIGdldElzT3BlbixcbiAgICBzZXRJc09wZW4gPSBhbmd1bGFyLm5vb3AsXG4gICAgdG9nZ2xlSW52b2tlciA9ICRhdHRycy5vblRvZ2dsZSA/ICRwYXJzZSgkYXR0cnMub25Ub2dnbGUpIDogYW5ndWxhci5ub29wLFxuICAgIGFwcGVuZFRvQm9keSA9IGZhbHNlLFxuICAgIGFwcGVuZFRvID0gbnVsbCxcbiAgICBrZXluYXZFbmFibGVkID0gZmFsc2UsXG4gICAgc2VsZWN0ZWRPcHRpb24gPSBudWxsLFxuICAgIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpO1xuXG4gICRlbGVtZW50LmFkZENsYXNzKCdkcm9wZG93bicpO1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkYXR0cnMuaXNPcGVuKSB7XG4gICAgICBnZXRJc09wZW4gPSAkcGFyc2UoJGF0dHJzLmlzT3Blbik7XG4gICAgICBzZXRJc09wZW4gPSBnZXRJc09wZW4uYXNzaWduO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKGdldElzT3BlbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgc2NvcGUuaXNPcGVuID0gISF2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZHJvcGRvd25BcHBlbmRUbykpIHtcbiAgICAgIHZhciBhcHBlbmRUb0VsID0gJHBhcnNlKCRhdHRycy5kcm9wZG93bkFwcGVuZFRvKShzY29wZSk7XG4gICAgICBpZiAoYXBwZW5kVG9FbCkge1xuICAgICAgICBhcHBlbmRUbyA9IGFuZ3VsYXIuZWxlbWVudChhcHBlbmRUb0VsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBlbmRUb0JvZHkgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZHJvcGRvd25BcHBlbmRUb0JvZHkpO1xuICAgIGtleW5hdkVuYWJsZWQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMua2V5Ym9hcmROYXYpO1xuXG4gICAgaWYgKGFwcGVuZFRvQm9keSAmJiAhYXBwZW5kVG8pIHtcbiAgICAgIGFwcGVuZFRvID0gYm9keTtcbiAgICB9XG5cbiAgICBpZiAoYXBwZW5kVG8gJiYgc2VsZi5kcm9wZG93bk1lbnUpIHtcbiAgICAgIGFwcGVuZFRvLmFwcGVuZChzZWxmLmRyb3Bkb3duTWVudSk7XG4gICAgICAkZWxlbWVudC5vbignJGRlc3Ryb3knLCBmdW5jdGlvbiBoYW5kbGVEZXN0cm95RXZlbnQoKSB7XG4gICAgICAgIHNlbGYuZHJvcGRvd25NZW51LnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMudG9nZ2xlID0gZnVuY3Rpb24ob3Blbikge1xuICAgIHJldHVybiBzY29wZS5pc09wZW4gPSBhcmd1bWVudHMubGVuZ3RoID8gISFvcGVuIDogIXNjb3BlLmlzT3BlbjtcbiAgfTtcblxuICAvLyBBbGxvdyBvdGhlciBkaXJlY3RpdmVzIHRvIHdhdGNoIHN0YXR1c1xuICB0aGlzLmlzT3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzY29wZS5pc09wZW47XG4gIH07XG5cbiAgc2NvcGUuZ2V0VG9nZ2xlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLnRvZ2dsZUVsZW1lbnQ7XG4gIH07XG5cbiAgc2NvcGUuZ2V0QXV0b0Nsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRhdHRycy5hdXRvQ2xvc2UgfHwgJ2Fsd2F5cyc7IC8vb3IgJ291dHNpZGVDbGljaycgb3IgJ2Rpc2FibGVkJ1xuICB9O1xuXG4gIHNjb3BlLmdldEVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJGVsZW1lbnQ7XG4gIH07XG5cbiAgc2NvcGUuaXNLZXluYXZFbmFibGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGtleW5hdkVuYWJsZWQ7XG4gIH07XG5cbiAgc2NvcGUuZm9jdXNEcm9wZG93bkVudHJ5ID0gZnVuY3Rpb24oa2V5Q29kZSkge1xuICAgIHZhciBlbGVtcyA9IHNlbGYuZHJvcGRvd25NZW51ID8gLy9JZiBhcHBlbmQgdG8gYm9keSBpcyB1c2VkLlxuICAgICAgYW5ndWxhci5lbGVtZW50KHNlbGYuZHJvcGRvd25NZW51KS5maW5kKCdhJykgOlxuICAgICAgJGVsZW1lbnQuZmluZCgndWwnKS5lcSgwKS5maW5kKCdhJyk7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgNDA6IHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzTnVtYmVyKHNlbGYuc2VsZWN0ZWRPcHRpb24pKSB7XG4gICAgICAgICAgc2VsZi5zZWxlY3RlZE9wdGlvbiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5zZWxlY3RlZE9wdGlvbiA9IHNlbGYuc2VsZWN0ZWRPcHRpb24gPT09IGVsZW1zLmxlbmd0aCAtIDEgP1xuICAgICAgICAgICAgc2VsZi5zZWxlY3RlZE9wdGlvbiA6XG4gICAgICAgICAgICBzZWxmLnNlbGVjdGVkT3B0aW9uICsgMTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgMzg6IHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzTnVtYmVyKHNlbGYuc2VsZWN0ZWRPcHRpb24pKSB7XG4gICAgICAgICAgc2VsZi5zZWxlY3RlZE9wdGlvbiA9IGVsZW1zLmxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5zZWxlY3RlZE9wdGlvbiA9IHNlbGYuc2VsZWN0ZWRPcHRpb24gPT09IDAgP1xuICAgICAgICAgICAgMCA6IHNlbGYuc2VsZWN0ZWRPcHRpb24gLSAxO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBlbGVtc1tzZWxmLnNlbGVjdGVkT3B0aW9uXS5mb2N1cygpO1xuICB9O1xuXG4gIHNjb3BlLmdldERyb3Bkb3duRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRyb3Bkb3duTWVudTtcbiAgfTtcblxuICBzY29wZS5mb2N1c1RvZ2dsZUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2VsZi50b2dnbGVFbGVtZW50KSB7XG4gICAgICBzZWxmLnRvZ2dsZUVsZW1lbnRbMF0uZm9jdXMoKTtcbiAgICB9XG4gIH07XG5cbiAgc2NvcGUuJHdhdGNoKCdpc09wZW4nLCBmdW5jdGlvbihpc09wZW4sIHdhc09wZW4pIHtcbiAgICBpZiAoYXBwZW5kVG8gJiYgc2VsZi5kcm9wZG93bk1lbnUpIHtcbiAgICAgIHZhciBwb3MgPSAkcG9zaXRpb24ucG9zaXRpb25FbGVtZW50cygkZWxlbWVudCwgc2VsZi5kcm9wZG93bk1lbnUsICdib3R0b20tbGVmdCcsIHRydWUpLFxuICAgICAgICBjc3MsXG4gICAgICAgIHJpZ2h0YWxpZ247XG5cbiAgICAgIGNzcyA9IHtcbiAgICAgICAgdG9wOiBwb3MudG9wICsgJ3B4JyxcbiAgICAgICAgZGlzcGxheTogaXNPcGVuID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgfTtcblxuICAgICAgcmlnaHRhbGlnbiA9IHNlbGYuZHJvcGRvd25NZW51Lmhhc0NsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4gICAgICBpZiAoIXJpZ2h0YWxpZ24pIHtcbiAgICAgICAgY3NzLmxlZnQgPSBwb3MubGVmdCArICdweCc7XG4gICAgICAgIGNzcy5yaWdodCA9ICdhdXRvJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNzcy5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgICBjc3MucmlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtXG4gICAgICAgICAgKHBvcy5sZWZ0ICsgJGVsZW1lbnQucHJvcCgnb2Zmc2V0V2lkdGgnKSkgKyAncHgnO1xuICAgICAgfVxuXG4gICAgICAvLyBOZWVkIHRvIGFkanVzdCBvdXIgcG9zaXRpb25pbmcgdG8gYmUgcmVsYXRpdmUgdG8gdGhlIGFwcGVuZFRvIGNvbnRhaW5lclxuICAgICAgLy8gaWYgaXQncyBub3QgdGhlIGJvZHkgZWxlbWVudFxuICAgICAgaWYgKCFhcHBlbmRUb0JvZHkpIHtcbiAgICAgICAgdmFyIGFwcGVuZE9mZnNldCA9ICRwb3NpdGlvbi5vZmZzZXQoYXBwZW5kVG8pO1xuXG4gICAgICAgIGNzcy50b3AgPSBwb3MudG9wIC0gYXBwZW5kT2Zmc2V0LnRvcCArICdweCc7XG5cbiAgICAgICAgaWYgKCFyaWdodGFsaWduKSB7XG4gICAgICAgICAgY3NzLmxlZnQgPSBwb3MubGVmdCAtIGFwcGVuZE9mZnNldC5sZWZ0ICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjc3MucmlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtXG4gICAgICAgICAgICAocG9zLmxlZnQgLSBhcHBlbmRPZmZzZXQubGVmdCArICRlbGVtZW50LnByb3AoJ29mZnNldFdpZHRoJykpICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLmRyb3Bkb3duTWVudS5jc3MoY3NzKTtcbiAgICB9XG5cbiAgICB2YXIgb3BlbkNvbnRhaW5lciA9IGFwcGVuZFRvID8gYXBwZW5kVG8gOiAkZWxlbWVudDtcblxuICAgICRhbmltYXRlW2lzT3BlbiA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShvcGVuQ29udGFpbmVyLCBhcHBlbmRUbyA/IGFwcGVuZFRvT3BlbkNsYXNzIDogb3BlbkNsYXNzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGlzT3BlbikgJiYgaXNPcGVuICE9PSB3YXNPcGVuKSB7XG4gICAgICAgIHRvZ2dsZUludm9rZXIoJHNjb3BlLCB7IG9wZW46ICEhaXNPcGVuIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgaWYgKHNlbGYuZHJvcGRvd25NZW51VGVtcGxhdGVVcmwpIHtcbiAgICAgICAgJHRlbXBsYXRlUmVxdWVzdChzZWxmLmRyb3Bkb3duTWVudVRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uKHRwbENvbnRlbnQpIHtcbiAgICAgICAgICB0ZW1wbGF0ZVNjb3BlID0gc2NvcGUuJG5ldygpO1xuICAgICAgICAgICRjb21waWxlKHRwbENvbnRlbnQudHJpbSgpKSh0ZW1wbGF0ZVNjb3BlLCBmdW5jdGlvbihkcm9wZG93bkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBuZXdFbCA9IGRyb3Bkb3duRWxlbWVudDtcbiAgICAgICAgICAgIHNlbGYuZHJvcGRvd25NZW51LnJlcGxhY2VXaXRoKG5ld0VsKTtcbiAgICAgICAgICAgIHNlbGYuZHJvcGRvd25NZW51ID0gbmV3RWw7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzY29wZS5mb2N1c1RvZ2dsZUVsZW1lbnQoKTtcbiAgICAgIHVpYkRyb3Bkb3duU2VydmljZS5vcGVuKHNjb3BlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHNlbGYuZHJvcGRvd25NZW51VGVtcGxhdGVVcmwpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlU2NvcGUpIHtcbiAgICAgICAgICB0ZW1wbGF0ZVNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld0VsID0gYW5ndWxhci5lbGVtZW50KCc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+PC91bD4nKTtcbiAgICAgICAgc2VsZi5kcm9wZG93bk1lbnUucmVwbGFjZVdpdGgobmV3RWwpO1xuICAgICAgICBzZWxmLmRyb3Bkb3duTWVudSA9IG5ld0VsO1xuICAgICAgfVxuXG4gICAgICB1aWJEcm9wZG93blNlcnZpY2UuY2xvc2Uoc2NvcGUpO1xuICAgICAgc2VsZi5zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihzZXRJc09wZW4pKSB7XG4gICAgICBzZXRJc09wZW4oJHNjb3BlLCBpc09wZW4pO1xuICAgIH1cbiAgfSk7XG5cbiAgJHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY29wZS5nZXRBdXRvQ2xvc2UoKSAhPT0gJ2Rpc2FibGVkJykge1xuICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XG4gICAgfVxuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJEcm9wZG93bicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIGNvbnRyb2xsZXI6ICdVaWJEcm9wZG93bkNvbnRyb2xsZXInLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZHJvcGRvd25DdHJsKSB7XG4gICAgICBkcm9wZG93bkN0cmwuaW5pdCgpO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYkRyb3Bkb3duTWVudScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVxdWlyZTogJz9edWliRHJvcGRvd24nLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZHJvcGRvd25DdHJsKSB7XG4gICAgICBpZiAoIWRyb3Bkb3duQ3RybCB8fCBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kcm9wZG93bk5lc3RlZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XG5cbiAgICAgIHZhciB0cGxVcmwgPSBhdHRycy50ZW1wbGF0ZVVybDtcbiAgICAgIGlmICh0cGxVcmwpIHtcbiAgICAgICAgZHJvcGRvd25DdHJsLmRyb3Bkb3duTWVudVRlbXBsYXRlVXJsID0gdHBsVXJsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRyb3Bkb3duQ3RybC5kcm9wZG93bk1lbnUpIHtcbiAgICAgICAgZHJvcGRvd25DdHJsLmRyb3Bkb3duTWVudSA9IGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliRHJvcGRvd25Ub2dnbGUnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlOiAnP151aWJEcm9wZG93bicsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBkcm9wZG93bkN0cmwpIHtcbiAgICAgIGlmICghZHJvcGRvd25DdHJsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnZHJvcGRvd24tdG9nZ2xlJyk7XG5cbiAgICAgIGRyb3Bkb3duQ3RybC50b2dnbGVFbGVtZW50ID0gZWxlbWVudDtcblxuICAgICAgdmFyIHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoIWVsZW1lbnQuaGFzQ2xhc3MoJ2Rpc2FibGVkJykgJiYgIWF0dHJzLmRpc2FibGVkKSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJvcGRvd25DdHJsLnRvZ2dsZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xuXG4gICAgICAvLyBXQUktQVJJQVxuICAgICAgZWxlbWVudC5hdHRyKHsgJ2FyaWEtaGFzcG9wdXAnOiB0cnVlLCAnYXJpYS1leHBhbmRlZCc6IGZhbHNlIH0pO1xuICAgICAgc2NvcGUuJHdhdGNoKGRyb3Bkb3duQ3RybC5pc09wZW4sIGZ1bmN0aW9uKGlzT3Blbikge1xuICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAhIWlzT3Blbik7XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtZW50LnVuYmluZCgnY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5zdGFja2VkTWFwJywgW10pXG4vKipcbiAqIEEgaGVscGVyLCBpbnRlcm5hbCBkYXRhIHN0cnVjdHVyZSB0aGF0IGFjdHMgYXMgYSBtYXAgYnV0IGFsc28gYWxsb3dzIGdldHRpbmcgLyByZW1vdmluZ1xuICogZWxlbWVudHMgaW4gdGhlIExJRk8gb3JkZXJcbiAqL1xuICAuZmFjdG9yeSgnJCRzdGFja2VkTWFwJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0ZU5ldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGFjayA9IFtdO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYWRkOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoa2V5ID09PSBzdGFja1tpXS5rZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhY2tbaV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAga2V5cy5wdXNoKHN0YWNrW2ldLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IC0xO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoa2V5ID09PSBzdGFja1tpXS5rZXkpIHtcbiAgICAgICAgICAgICAgICBpZHggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhY2suc3BsaWNlKGlkeCwgMSlbMF07XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVUb3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YWNrLnNwbGljZShzdGFjay5sZW5ndGggLSAxLCAxKVswXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxlbmd0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhY2subGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAubW9kYWwnLCBbJ3VpLmJvb3RzdHJhcC5zdGFja2VkTWFwJ10pXG4vKipcbiAqIEEgaGVscGVyLCBpbnRlcm5hbCBkYXRhIHN0cnVjdHVyZSB0aGF0IHN0b3JlcyBhbGwgcmVmZXJlbmNlcyBhdHRhY2hlZCB0byBrZXlcbiAqL1xuICAuZmFjdG9yeSgnJCRtdWx0aU1hcCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjcmVhdGVOZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFwID0ge307XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlbnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhtYXApLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbWFwW2tleV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBba2V5XTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhhc0tleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gISFtYXBba2V5XTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwdXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghbWFwW2tleV0pIHtcbiAgICAgICAgICAgICAgbWFwW2tleV0gPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFwW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBtYXBba2V5XTtcblxuICAgICAgICAgICAgaWYgKCF2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaWR4ID0gdmFsdWVzLmluZGV4T2YodmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICB2YWx1ZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBkZWxldGUgbWFwW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pXG5cbi8qKlxuICogUGx1Z2dhYmxlIHJlc29sdmUgbWVjaGFuaXNtIGZvciB0aGUgbW9kYWwgcmVzb2x2ZSByZXNvbHV0aW9uXG4gKiBTdXBwb3J0cyBVSSBSb3V0ZXIncyAkcmVzb2x2ZSBzZXJ2aWNlXG4gKi9cbiAgLnByb3ZpZGVyKCckdWliUmVzb2x2ZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXNvbHZlID0gdGhpcztcbiAgICB0aGlzLnJlc29sdmVyID0gbnVsbDtcblxuICAgIHRoaXMuc2V0UmVzb2x2ZXIgPSBmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgdGhpcy5yZXNvbHZlciA9IHJlc29sdmVyO1xuICAgIH07XG5cbiAgICB0aGlzLiRnZXQgPSBbJyRpbmplY3RvcicsICckcScsIGZ1bmN0aW9uKCRpbmplY3RvciwgJHEpIHtcbiAgICAgIHZhciByZXNvbHZlciA9IHJlc29sdmUucmVzb2x2ZXIgPyAkaW5qZWN0b3IuZ2V0KHJlc29sdmUucmVzb2x2ZXIpIDogbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uKGludm9jYWJsZXMsIGxvY2FscywgcGFyZW50LCBzZWxmKSB7XG4gICAgICAgICAgaWYgKHJlc29sdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXIucmVzb2x2ZShpbnZvY2FibGVzLCBsb2NhbHMsIHBhcmVudCwgc2VsZik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByb21pc2VzID0gW107XG5cbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2goaW52b2NhYmxlcywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odmFsdWUpIHx8IGFuZ3VsYXIuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaCgkcS5yZXNvbHZlKCRpbmplY3Rvci5pbnZva2UodmFsdWUpKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHByb21pc2VzLnB1c2goJHEucmVzb2x2ZSgkaW5qZWN0b3IuZ2V0KHZhbHVlKSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaCgkcS5yZXNvbHZlKHZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKHJlc29sdmVzKSB7XG4gICAgICAgICAgICB2YXIgcmVzb2x2ZU9iaiA9IHt9O1xuICAgICAgICAgICAgdmFyIHJlc29sdmVJdGVyID0gMDtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnZvY2FibGVzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgIHJlc29sdmVPYmpba2V5XSA9IHJlc29sdmVzW3Jlc29sdmVJdGVyKytdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlT2JqO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1dO1xuICB9KVxuXG4vKipcbiAqIEEgaGVscGVyIGRpcmVjdGl2ZSBmb3IgdGhlICRtb2RhbCBzZXJ2aWNlLiBJdCBjcmVhdGVzIGEgYmFja2Ryb3AgZWxlbWVudC5cbiAqL1xuICAuZGlyZWN0aXZlKCd1aWJNb2RhbEJhY2tkcm9wJywgWyckYW5pbWF0ZUNzcycsICckaW5qZWN0b3InLCAnJHVpYk1vZGFsU3RhY2snLFxuICBmdW5jdGlvbigkYW5pbWF0ZUNzcywgJGluamVjdG9yLCAkbW9kYWxTdGFjaykge1xuICAgIHJldHVybiB7XG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvbW9kYWwvYmFja2Ryb3AuaHRtbCcsXG4gICAgICBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgIHRFbGVtZW50LmFkZENsYXNzKHRBdHRycy5iYWNrZHJvcENsYXNzKTtcbiAgICAgICAgcmV0dXJuIGxpbmtGbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGlua0ZuKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgaWYgKGF0dHJzLm1vZGFsSW5DbGFzcykge1xuICAgICAgICAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgYWRkQ2xhc3M6IGF0dHJzLm1vZGFsSW5DbGFzc1xuICAgICAgICB9KS5zdGFydCgpO1xuXG4gICAgICAgIHNjb3BlLiRvbigkbW9kYWxTdGFjay5OT1dfQ0xPU0lOR19FVkVOVCwgZnVuY3Rpb24oZSwgc2V0SXNBc3luYykge1xuICAgICAgICAgIHZhciBkb25lID0gc2V0SXNBc3luYygpO1xuICAgICAgICAgIGlmIChzY29wZS5tb2RhbE9wdGlvbnMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBhdHRycy5tb2RhbEluQ2xhc3NcbiAgICAgICAgICAgIH0pLnN0YXJ0KCkudGhlbihkb25lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XSlcblxuICAuZGlyZWN0aXZlKCd1aWJNb2RhbFdpbmRvdycsIFsnJHVpYk1vZGFsU3RhY2snLCAnJHEnLCAnJGFuaW1hdGUnLCAnJGFuaW1hdGVDc3MnLCAnJGRvY3VtZW50JyxcbiAgZnVuY3Rpb24oJG1vZGFsU3RhY2ssICRxLCAkYW5pbWF0ZSwgJGFuaW1hdGVDc3MsICRkb2N1bWVudCkge1xuICAgIHJldHVybiB7XG4gICAgICBzY29wZToge1xuICAgICAgICBpbmRleDogJ0AnXG4gICAgICB9LFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24odEVsZW1lbnQsIHRBdHRycykge1xuICAgICAgICByZXR1cm4gdEF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvbW9kYWwvd2luZG93Lmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKGF0dHJzLndpbmRvd0NsYXNzIHx8ICcnKTtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhhdHRycy53aW5kb3dUb3BDbGFzcyB8fCAnJyk7XG4gICAgICAgIHNjb3BlLnNpemUgPSBhdHRycy5zaXplO1xuXG4gICAgICAgIHNjb3BlLmNsb3NlID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgdmFyIG1vZGFsID0gJG1vZGFsU3RhY2suZ2V0VG9wKCk7XG4gICAgICAgICAgaWYgKG1vZGFsICYmIG1vZGFsLnZhbHVlLmJhY2tkcm9wICYmXG4gICAgICAgICAgICBtb2RhbC52YWx1ZS5iYWNrZHJvcCAhPT0gJ3N0YXRpYycgJiZcbiAgICAgICAgICAgIGV2dC50YXJnZXQgPT09IGV2dC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICRtb2RhbFN0YWNrLmRpc21pc3MobW9kYWwua2V5LCAnYmFja2Ryb3AgY2xpY2snKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbW92ZWQgZnJvbSB0ZW1wbGF0ZSB0byBmaXggaXNzdWUgIzIyODBcbiAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBzY29wZS5jbG9zZSk7XG5cbiAgICAgICAgLy8gVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IGFkZGVkIHRvIHRoZSBzY29wZSBmb3IgdGhlIHB1cnBvc2Ugb2YgZGV0ZWN0aW5nIHdoZW4gdGhpcyBkaXJlY3RpdmUgaXMgcmVuZGVyZWQuXG4gICAgICAgIC8vIFdlIGNhbiBkZXRlY3QgdGhhdCBieSB1c2luZyB0aGlzIHByb3BlcnR5IGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3RpdmUgYW5kIHRoZW4gdXNlXG4gICAgICAgIC8vIHtAbGluayBBdHRyaWJ1dGUjJG9ic2VydmV9IG9uIGl0LiBGb3IgbW9yZSBkZXRhaWxzIHBsZWFzZSBzZWUge0BsaW5rIFRhYmxlQ29sdW1uUmVzaXplfS5cbiAgICAgICAgc2NvcGUuJGlzUmVuZGVyZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIERlZmVycmVkIG9iamVjdCB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiB0aGlzIG1vZGFsIGlzIHJlbmRlci5cbiAgICAgICAgdmFyIG1vZGFsUmVuZGVyRGVmZXJPYmogPSAkcS5kZWZlcigpO1xuICAgICAgICAvLyBPYnNlcnZlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIG9uIG5leHQgZGlnZXN0IGN5Y2xlIGFmdGVyIGNvbXBpbGF0aW9uLCBlbnN1cmluZyB0aGF0IHRoZSBET00gaXMgcmVhZHkuXG4gICAgICAgIC8vIEluIG9yZGVyIHRvIHVzZSB0aGlzIHdheSBvZiBmaW5kaW5nIHdoZXRoZXIgRE9NIGlzIHJlYWR5LCB3ZSBuZWVkIHRvIG9ic2VydmUgYSBzY29wZSBwcm9wZXJ0eSB1c2VkIGluIG1vZGFsJ3MgdGVtcGxhdGUuXG4gICAgICAgIGF0dHJzLiRvYnNlcnZlKCdtb2RhbFJlbmRlcicsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgIG1vZGFsUmVuZGVyRGVmZXJPYmoucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWxSZW5kZXJEZWZlck9iai5wcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFuaW1hdGlvblByb21pc2UgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKGF0dHJzLm1vZGFsSW5DbGFzcykge1xuICAgICAgICAgICAgYW5pbWF0aW9uUHJvbWlzZSA9ICRhbmltYXRlQ3NzKGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgYWRkQ2xhc3M6IGF0dHJzLm1vZGFsSW5DbGFzc1xuICAgICAgICAgICAgfSkuc3RhcnQoKTtcblxuICAgICAgICAgICAgc2NvcGUuJG9uKCRtb2RhbFN0YWNrLk5PV19DTE9TSU5HX0VWRU5ULCBmdW5jdGlvbihlLCBzZXRJc0FzeW5jKSB7XG4gICAgICAgICAgICAgIHZhciBkb25lID0gc2V0SXNBc3luYygpO1xuICAgICAgICAgICAgICBpZiAoJGFuaW1hdGVDc3MpIHtcbiAgICAgICAgICAgICAgICAkYW5pbWF0ZUNzcyhlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICByZW1vdmVDbGFzczogYXR0cnMubW9kYWxJbkNsYXNzXG4gICAgICAgICAgICAgICAgfSkuc3RhcnQoKS50aGVuKGRvbmUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRhbmltYXRlLnJlbW92ZUNsYXNzKGVsZW1lbnQsIGF0dHJzLm1vZGFsSW5DbGFzcykudGhlbihkb25lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICAkcS53aGVuKGFuaW1hdGlvblByb21pc2UpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyB3aXRoaW4gdGhlIGZyZXNobHktb3BlbmVkIG1vZGFsIGFscmVhZHkgaGFzIGZvY3VzIChwZXJoYXBzIHZpYSBhXG4gICAgICAgICAgICAgKiBkaXJlY3RpdmUgdGhhdCBjYXVzZXMgZm9jdXMpLiB0aGVuIG5vIG5lZWQgdG8gdHJ5IGFuZCBmb2N1cyBhbnl0aGluZy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCEoJGRvY3VtZW50WzBdLmFjdGl2ZUVsZW1lbnQgJiYgZWxlbWVudFswXS5jb250YWlucygkZG9jdW1lbnRbMF0uYWN0aXZlRWxlbWVudCkpKSB7XG4gICAgICAgICAgICAgIHZhciBpbnB1dFdpdGhBdXRvZm9jdXMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1thdXRvZm9jdXNdJyk7XG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBBdXRvLWZvY3VzaW5nIG9mIGEgZnJlc2hseS1vcGVuZWQgbW9kYWwgZWxlbWVudCBjYXVzZXMgYW55IGNoaWxkIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAqIHdpdGggdGhlIGF1dG9mb2N1cyBhdHRyaWJ1dGUgdG8gbG9zZSBmb2N1cy4gVGhpcyBpcyBhbiBpc3N1ZSBvbiB0b3VjaFxuICAgICAgICAgICAgICAgKiBiYXNlZCBkZXZpY2VzIHdoaWNoIHdpbGwgc2hvdyBhbmQgdGhlbiBoaWRlIHRoZSBvbnNjcmVlbiBrZXlib2FyZC5cbiAgICAgICAgICAgICAgICogQXR0ZW1wdHMgdG8gcmVmb2N1cyB0aGUgYXV0b2ZvY3VzIGVsZW1lbnQgdmlhIEphdmFTY3JpcHQgd2lsbCBub3QgcmVvcGVuXG4gICAgICAgICAgICAgICAqIHRoZSBvbnNjcmVlbiBrZXlib2FyZC4gRml4ZWQgYnkgdXBkYXRlZCB0aGUgZm9jdXNpbmcgbG9naWMgdG8gb25seSBhdXRvZm9jdXNcbiAgICAgICAgICAgICAgICogdGhlIG1vZGFsIGVsZW1lbnQgaWYgdGhlIG1vZGFsIGRvZXMgbm90IGNvbnRhaW4gYW4gYXV0b2ZvY3VzIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBpZiAoaW5wdXRXaXRoQXV0b2ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRXaXRoQXV0b2ZvY3VzLmZvY3VzKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFswXS5mb2N1cygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBOb3RpZnkge0BsaW5rICRtb2RhbFN0YWNrfSB0aGF0IG1vZGFsIGlzIHJlbmRlcmVkLlxuICAgICAgICAgIHZhciBtb2RhbCA9ICRtb2RhbFN0YWNrLmdldFRvcCgpO1xuICAgICAgICAgIGlmIChtb2RhbCkge1xuICAgICAgICAgICAgJG1vZGFsU3RhY2subW9kYWxSZW5kZXJlZChtb2RhbC5rZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pXG5cbiAgLmRpcmVjdGl2ZSgndWliTW9kYWxBbmltYXRpb25DbGFzcycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgIGlmICh0QXR0cnMubW9kYWxBbmltYXRpb24pIHtcbiAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcyh0QXR0cnMudWliTW9kYWxBbmltYXRpb25DbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KVxuXG4gIC5kaXJlY3RpdmUoJ3VpYk1vZGFsVHJhbnNjbHVkZScsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIsIHRyYW5zY2x1ZGUpIHtcbiAgICAgICAgdHJhbnNjbHVkZShzY29wZS4kcGFyZW50LCBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgIGVsZW1lbnQuZW1wdHkoKTtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pXG5cbiAgLmZhY3RvcnkoJyR1aWJNb2RhbFN0YWNrJywgWyckYW5pbWF0ZScsICckYW5pbWF0ZUNzcycsICckZG9jdW1lbnQnLFxuICAgICckY29tcGlsZScsICckcm9vdFNjb3BlJywgJyRxJywgJyQkbXVsdGlNYXAnLCAnJCRzdGFja2VkTWFwJyxcbiAgICBmdW5jdGlvbigkYW5pbWF0ZSwgJGFuaW1hdGVDc3MsICRkb2N1bWVudCwgJGNvbXBpbGUsICRyb290U2NvcGUsICRxLCAkJG11bHRpTWFwLCAkJHN0YWNrZWRNYXApIHtcbiAgICAgIHZhciBPUEVORURfTU9EQUxfQ0xBU1MgPSAnbW9kYWwtb3Blbic7XG5cbiAgICAgIHZhciBiYWNrZHJvcERvbUVsLCBiYWNrZHJvcFNjb3BlO1xuICAgICAgdmFyIG9wZW5lZFdpbmRvd3MgPSAkJHN0YWNrZWRNYXAuY3JlYXRlTmV3KCk7XG4gICAgICB2YXIgb3BlbmVkQ2xhc3NlcyA9ICQkbXVsdGlNYXAuY3JlYXRlTmV3KCk7XG4gICAgICB2YXIgJG1vZGFsU3RhY2sgPSB7XG4gICAgICAgIE5PV19DTE9TSU5HX0VWRU5UOiAnbW9kYWwuc3RhY2subm93LWNsb3NpbmcnXG4gICAgICB9O1xuXG4gICAgICAvL01vZGFsIGZvY3VzIGJlaGF2aW9yXG4gICAgICB2YXIgZm9jdXNhYmxlRWxlbWVudExpc3Q7XG4gICAgICB2YXIgZm9jdXNJbmRleCA9IDA7XG4gICAgICB2YXIgdGFiYWJibGVTZWxlY3RvciA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksICcgK1xuICAgICAgICAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKSxzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksICcgK1xuICAgICAgICAnaWZyYW1lLCBvYmplY3QsIGVtYmVkLCAqW3RhYmluZGV4XSwgKltjb250ZW50ZWRpdGFibGU9dHJ1ZV0nO1xuXG4gICAgICBmdW5jdGlvbiBiYWNrZHJvcEluZGV4KCkge1xuICAgICAgICB2YXIgdG9wQmFja2Ryb3BJbmRleCA9IC0xO1xuICAgICAgICB2YXIgb3BlbmVkID0gb3BlbmVkV2luZG93cy5rZXlzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3BlbmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG9wZW5lZFdpbmRvd3MuZ2V0KG9wZW5lZFtpXSkudmFsdWUuYmFja2Ryb3ApIHtcbiAgICAgICAgICAgIHRvcEJhY2tkcm9wSW5kZXggPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9wQmFja2Ryb3BJbmRleDtcbiAgICAgIH1cblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goYmFja2Ryb3BJbmRleCwgZnVuY3Rpb24obmV3QmFja2Ryb3BJbmRleCkge1xuICAgICAgICBpZiAoYmFja2Ryb3BTY29wZSkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUuaW5kZXggPSBuZXdCYWNrZHJvcEluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSwgZWxlbWVudFRvUmVjZWl2ZUZvY3VzKSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuICAgICAgICB2YXIgYXBwZW5kVG9FbGVtZW50ID0gbW9kYWxXaW5kb3cuYXBwZW5kVG87XG5cbiAgICAgICAgLy9jbGVhbiB1cCB0aGUgc3RhY2tcbiAgICAgICAgb3BlbmVkV2luZG93cy5yZW1vdmUobW9kYWxJbnN0YW5jZSk7XG5cbiAgICAgICAgcmVtb3ZlQWZ0ZXJBbmltYXRlKG1vZGFsV2luZG93Lm1vZGFsRG9tRWwsIG1vZGFsV2luZG93Lm1vZGFsU2NvcGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBtb2RhbEJvZHlDbGFzcyA9IG1vZGFsV2luZG93Lm9wZW5lZENsYXNzIHx8IE9QRU5FRF9NT0RBTF9DTEFTUztcbiAgICAgICAgICBvcGVuZWRDbGFzc2VzLnJlbW92ZShtb2RhbEJvZHlDbGFzcywgbW9kYWxJbnN0YW5jZSk7XG4gICAgICAgICAgYXBwZW5kVG9FbGVtZW50LnRvZ2dsZUNsYXNzKG1vZGFsQm9keUNsYXNzLCBvcGVuZWRDbGFzc2VzLmhhc0tleShtb2RhbEJvZHlDbGFzcykpO1xuICAgICAgICAgIHRvZ2dsZVRvcFdpbmRvd0NsYXNzKHRydWUpO1xuICAgICAgICB9LCBtb2RhbFdpbmRvdy5jbG9zZWREZWZlcnJlZCk7XG4gICAgICAgIGNoZWNrUmVtb3ZlQmFja2Ryb3AoKTtcblxuICAgICAgICAvL21vdmUgZm9jdXMgdG8gc3BlY2lmaWVkIGVsZW1lbnQgaWYgYXZhaWxhYmxlLCBvciBlbHNlIHRvIGJvZHlcbiAgICAgICAgaWYgKGVsZW1lbnRUb1JlY2VpdmVGb2N1cyAmJiBlbGVtZW50VG9SZWNlaXZlRm9jdXMuZm9jdXMpIHtcbiAgICAgICAgICBlbGVtZW50VG9SZWNlaXZlRm9jdXMuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcHBlbmRUb0VsZW1lbnQuZm9jdXMpIHtcbiAgICAgICAgICBhcHBlbmRUb0VsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZGQgb3IgcmVtb3ZlIFwid2luZG93VG9wQ2xhc3NcIiBmcm9tIHRoZSB0b3Agd2luZG93IGluIHRoZSBzdGFja1xuICAgICAgZnVuY3Rpb24gdG9nZ2xlVG9wV2luZG93Q2xhc3ModG9nZ2xlU3dpdGNoKSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdztcblxuICAgICAgICBpZiAob3BlbmVkV2luZG93cy5sZW5ndGgoKSA+IDApIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MudG9wKCkudmFsdWU7XG4gICAgICAgICAgbW9kYWxXaW5kb3cubW9kYWxEb21FbC50b2dnbGVDbGFzcyhtb2RhbFdpbmRvdy53aW5kb3dUb3BDbGFzcyB8fCAnJywgdG9nZ2xlU3dpdGNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjaGVja1JlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgICAvL3JlbW92ZSBiYWNrZHJvcCBpZiBubyBsb25nZXIgbmVlZGVkXG4gICAgICAgIGlmIChiYWNrZHJvcERvbUVsICYmIGJhY2tkcm9wSW5kZXgoKSA9PT0gLTEpIHtcbiAgICAgICAgICB2YXIgYmFja2Ryb3BTY29wZVJlZiA9IGJhY2tkcm9wU2NvcGU7XG4gICAgICAgICAgcmVtb3ZlQWZ0ZXJBbmltYXRlKGJhY2tkcm9wRG9tRWwsIGJhY2tkcm9wU2NvcGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYmFja2Ryb3BTY29wZVJlZiA9IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYmFja2Ryb3BEb21FbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZUFmdGVyQW5pbWF0ZShkb21FbCwgc2NvcGUsIGRvbmUsIGNsb3NlZERlZmVycmVkKSB7XG4gICAgICAgIHZhciBhc3luY0RlZmVycmVkO1xuICAgICAgICB2YXIgYXN5bmNQcm9taXNlID0gbnVsbDtcbiAgICAgICAgdmFyIHNldElzQXN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIWFzeW5jRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIGFzeW5jRGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgYXN5bmNQcm9taXNlID0gYXN5bmNEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBhc3luY0RvbmUoKSB7XG4gICAgICAgICAgICBhc3luY0RlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBzY29wZS4kYnJvYWRjYXN0KCRtb2RhbFN0YWNrLk5PV19DTE9TSU5HX0VWRU5ULCBzZXRJc0FzeW5jKTtcblxuICAgICAgICAvLyBOb3RlIHRoYXQgaXQncyBpbnRlbnRpb25hbCB0aGF0IGFzeW5jUHJvbWlzZSBtaWdodCBiZSBudWxsLlxuICAgICAgICAvLyBUaGF0J3Mgd2hlbiBzZXRJc0FzeW5jIGhhcyBub3QgYmVlbiBjYWxsZWQgZHVyaW5nIHRoZVxuICAgICAgICAvLyBOT1dfQ0xPU0lOR19FVkVOVCBicm9hZGNhc3QuXG4gICAgICAgIHJldHVybiAkcS53aGVuKGFzeW5jUHJvbWlzZSkudGhlbihhZnRlckFuaW1hdGluZyk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWZ0ZXJBbmltYXRpbmcoKSB7XG4gICAgICAgICAgaWYgKGFmdGVyQW5pbWF0aW5nLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYWZ0ZXJBbmltYXRpbmcuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICAkYW5pbWF0ZUNzcyhkb21FbCwge1xuICAgICAgICAgICAgZXZlbnQ6ICdsZWF2ZSdcbiAgICAgICAgICB9KS5zdGFydCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb21FbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGlmIChjbG9zZWREZWZlcnJlZCkge1xuICAgICAgICAgICAgICBjbG9zZWREZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBzY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICRkb2N1bWVudC5vbigna2V5ZG93bicsIGtleWRvd25MaXN0ZW5lcik7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkZG9jdW1lbnQub2ZmKCdrZXlkb3duJywga2V5ZG93bkxpc3RlbmVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBrZXlkb3duTGlzdGVuZXIoZXZ0KSB7XG4gICAgICAgIGlmIChldnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICByZXR1cm4gZXZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1vZGFsID0gb3BlbmVkV2luZG93cy50b3AoKTtcbiAgICAgICAgaWYgKG1vZGFsKSB7XG4gICAgICAgICAgc3dpdGNoIChldnQud2hpY2gpIHtcbiAgICAgICAgICAgIGNhc2UgMjc6IHtcbiAgICAgICAgICAgICAgaWYgKG1vZGFsLnZhbHVlLmtleWJvYXJkKSB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAkbW9kYWxTdGFjay5kaXNtaXNzKG1vZGFsLmtleSwgJ2VzY2FwZSBrZXkgcHJlc3MnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgOToge1xuICAgICAgICAgICAgICAkbW9kYWxTdGFjay5sb2FkRm9jdXNFbGVtZW50TGlzdChtb2RhbCk7XG4gICAgICAgICAgICAgIHZhciBmb2N1c0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKGV2dC5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgIGlmICgkbW9kYWxTdGFjay5pc0ZvY3VzSW5GaXJzdEl0ZW0oZXZ0KSB8fCAkbW9kYWxTdGFjay5pc01vZGFsRm9jdXNlZChldnQsIG1vZGFsKSkge1xuICAgICAgICAgICAgICAgICAgZm9jdXNDaGFuZ2VkID0gJG1vZGFsU3RhY2suZm9jdXNMYXN0Rm9jdXNhYmxlRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1vZGFsU3RhY2suaXNGb2N1c0luTGFzdEl0ZW0oZXZ0KSkge1xuICAgICAgICAgICAgICAgICAgZm9jdXNDaGFuZ2VkID0gJG1vZGFsU3RhY2suZm9jdXNGaXJzdEZvY3VzYWJsZUVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoZm9jdXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkbW9kYWxTdGFjay5vcGVuID0gZnVuY3Rpb24obW9kYWxJbnN0YW5jZSwgbW9kYWwpIHtcbiAgICAgICAgdmFyIG1vZGFsT3BlbmVyID0gJGRvY3VtZW50WzBdLmFjdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgbW9kYWxCb2R5Q2xhc3MgPSBtb2RhbC5vcGVuZWRDbGFzcyB8fCBPUEVORURfTU9EQUxfQ0xBU1M7XG5cbiAgICAgICAgdG9nZ2xlVG9wV2luZG93Q2xhc3MoZmFsc2UpO1xuXG4gICAgICAgIG9wZW5lZFdpbmRvd3MuYWRkKG1vZGFsSW5zdGFuY2UsIHtcbiAgICAgICAgICBkZWZlcnJlZDogbW9kYWwuZGVmZXJyZWQsXG4gICAgICAgICAgcmVuZGVyRGVmZXJyZWQ6IG1vZGFsLnJlbmRlckRlZmVycmVkLFxuICAgICAgICAgIGNsb3NlZERlZmVycmVkOiBtb2RhbC5jbG9zZWREZWZlcnJlZCxcbiAgICAgICAgICBtb2RhbFNjb3BlOiBtb2RhbC5zY29wZSxcbiAgICAgICAgICBiYWNrZHJvcDogbW9kYWwuYmFja2Ryb3AsXG4gICAgICAgICAga2V5Ym9hcmQ6IG1vZGFsLmtleWJvYXJkLFxuICAgICAgICAgIG9wZW5lZENsYXNzOiBtb2RhbC5vcGVuZWRDbGFzcyxcbiAgICAgICAgICB3aW5kb3dUb3BDbGFzczogbW9kYWwud2luZG93VG9wQ2xhc3MsXG4gICAgICAgICAgYW5pbWF0aW9uOiBtb2RhbC5hbmltYXRpb24sXG4gICAgICAgICAgYXBwZW5kVG86IG1vZGFsLmFwcGVuZFRvXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9wZW5lZENsYXNzZXMucHV0KG1vZGFsQm9keUNsYXNzLCBtb2RhbEluc3RhbmNlKTtcblxuICAgICAgICB2YXIgYXBwZW5kVG9FbGVtZW50ID0gbW9kYWwuYXBwZW5kVG8sXG4gICAgICAgICAgICBjdXJyQmFja2Ryb3BJbmRleCA9IGJhY2tkcm9wSW5kZXgoKTtcblxuICAgICAgICBpZiAoIWFwcGVuZFRvRWxlbWVudC5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGVuZFRvIGVsZW1lbnQgbm90IGZvdW5kLiBNYWtlIHN1cmUgdGhhdCB0aGUgZWxlbWVudCBwYXNzZWQgaXMgaW4gRE9NLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJCYWNrZHJvcEluZGV4ID49IDAgJiYgIWJhY2tkcm9wRG9tRWwpIHtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpO1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUubW9kYWxPcHRpb25zID0gbW9kYWw7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5pbmRleCA9IGN1cnJCYWNrZHJvcEluZGV4O1xuICAgICAgICAgIGJhY2tkcm9wRG9tRWwgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgdWliLW1vZGFsLWJhY2tkcm9wPVwibW9kYWwtYmFja2Ryb3BcIj48L2Rpdj4nKTtcbiAgICAgICAgICBiYWNrZHJvcERvbUVsLmF0dHIoJ2JhY2tkcm9wLWNsYXNzJywgbW9kYWwuYmFja2Ryb3BDbGFzcyk7XG4gICAgICAgICAgaWYgKG1vZGFsLmFuaW1hdGlvbikge1xuICAgICAgICAgICAgYmFja2Ryb3BEb21FbC5hdHRyKCdtb2RhbC1hbmltYXRpb24nLCAndHJ1ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkY29tcGlsZShiYWNrZHJvcERvbUVsKShiYWNrZHJvcFNjb3BlKTtcbiAgICAgICAgICAkYW5pbWF0ZS5lbnRlcihiYWNrZHJvcERvbUVsLCBhcHBlbmRUb0VsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuZ3VsYXJEb21FbCA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdiB1aWItbW9kYWwtd2luZG93PVwibW9kYWwtd2luZG93XCI+PC9kaXY+Jyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKHtcbiAgICAgICAgICAndGVtcGxhdGUtdXJsJzogbW9kYWwud2luZG93VGVtcGxhdGVVcmwsXG4gICAgICAgICAgJ3dpbmRvdy1jbGFzcyc6IG1vZGFsLndpbmRvd0NsYXNzLFxuICAgICAgICAgICd3aW5kb3ctdG9wLWNsYXNzJzogbW9kYWwud2luZG93VG9wQ2xhc3MsXG4gICAgICAgICAgJ3NpemUnOiBtb2RhbC5zaXplLFxuICAgICAgICAgICdpbmRleCc6IG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgLSAxLFxuICAgICAgICAgICdhbmltYXRlJzogJ2FuaW1hdGUnXG4gICAgICAgIH0pLmh0bWwobW9kYWwuY29udGVudCk7XG4gICAgICAgIGlmIChtb2RhbC5hbmltYXRpb24pIHtcbiAgICAgICAgICBhbmd1bGFyRG9tRWwuYXR0cignbW9kYWwtYW5pbWF0aW9uJywgJ3RydWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRhbmltYXRlLmVudGVyKCRjb21waWxlKGFuZ3VsYXJEb21FbCkobW9kYWwuc2NvcGUpLCBhcHBlbmRUb0VsZW1lbnQpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhhcHBlbmRUb0VsZW1lbnQsIG1vZGFsQm9keUNsYXNzKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBvcGVuZWRXaW5kb3dzLnRvcCgpLnZhbHVlLm1vZGFsRG9tRWwgPSBhbmd1bGFyRG9tRWw7XG4gICAgICAgIG9wZW5lZFdpbmRvd3MudG9wKCkudmFsdWUubW9kYWxPcGVuZXIgPSBtb2RhbE9wZW5lcjtcblxuICAgICAgICAkbW9kYWxTdGFjay5jbGVhckZvY3VzTGlzdENhY2hlKCk7XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBicm9hZGNhc3RDbG9zaW5nKG1vZGFsV2luZG93LCByZXN1bHRPclJlYXNvbiwgY2xvc2luZykge1xuICAgICAgICByZXR1cm4gIW1vZGFsV2luZG93LnZhbHVlLm1vZGFsU2NvcGUuJGJyb2FkY2FzdCgnbW9kYWwuY2xvc2luZycsIHJlc3VsdE9yUmVhc29uLCBjbG9zaW5nKS5kZWZhdWx0UHJldmVudGVkO1xuICAgICAgfVxuXG4gICAgICAkbW9kYWxTdGFjay5jbG9zZSA9IGZ1bmN0aW9uKG1vZGFsSW5zdGFuY2UsIHJlc3VsdCkge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93ICYmIGJyb2FkY2FzdENsb3NpbmcobW9kYWxXaW5kb3csIHJlc3VsdCwgdHJ1ZSkpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy52YWx1ZS5tb2RhbFNjb3BlLiQkdWliRGVzdHJ1Y3Rpb25TY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgIG1vZGFsV2luZG93LnZhbHVlLmRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICByZW1vdmVNb2RhbFdpbmRvdyhtb2RhbEluc3RhbmNlLCBtb2RhbFdpbmRvdy52YWx1ZS5tb2RhbE9wZW5lcik7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFtb2RhbFdpbmRvdztcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmRpc21pc3MgPSBmdW5jdGlvbihtb2RhbEluc3RhbmNlLCByZWFzb24pIHtcbiAgICAgICAgdmFyIG1vZGFsV2luZG93ID0gb3BlbmVkV2luZG93cy5nZXQobW9kYWxJbnN0YW5jZSk7XG4gICAgICAgIGlmIChtb2RhbFdpbmRvdyAmJiBicm9hZGNhc3RDbG9zaW5nKG1vZGFsV2luZG93LCByZWFzb24sIGZhbHNlKSkge1xuICAgICAgICAgIG1vZGFsV2luZG93LnZhbHVlLm1vZGFsU2NvcGUuJCR1aWJEZXN0cnVjdGlvblNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgICAgbW9kYWxXaW5kb3cudmFsdWUuZGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSwgbW9kYWxXaW5kb3cudmFsdWUubW9kYWxPcGVuZXIpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhbW9kYWxXaW5kb3c7XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5kaXNtaXNzQWxsID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIHZhciB0b3BNb2RhbCA9IHRoaXMuZ2V0VG9wKCk7XG4gICAgICAgIHdoaWxlICh0b3BNb2RhbCAmJiB0aGlzLmRpc21pc3ModG9wTW9kYWwua2V5LCByZWFzb24pKSB7XG4gICAgICAgICAgdG9wTW9kYWwgPSB0aGlzLmdldFRvcCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5nZXRUb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG9wZW5lZFdpbmRvd3MudG9wKCk7XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5tb2RhbFJlbmRlcmVkID0gZnVuY3Rpb24obW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cudmFsdWUucmVuZGVyRGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5mb2N1c0ZpcnN0Rm9jdXNhYmxlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRMaXN0WzBdLmZvY3VzKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcbiAgICAgICRtb2RhbFN0YWNrLmZvY3VzTGFzdEZvY3VzYWJsZUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZvY3VzYWJsZUVsZW1lbnRMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb2N1c2FibGVFbGVtZW50TGlzdFtmb2N1c2FibGVFbGVtZW50TGlzdC5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmlzTW9kYWxGb2N1c2VkID0gZnVuY3Rpb24oZXZ0LCBtb2RhbFdpbmRvdykge1xuICAgICAgICBpZiAoZXZ0ICYmIG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgdmFyIG1vZGFsRG9tRWwgPSBtb2RhbFdpbmRvdy52YWx1ZS5tb2RhbERvbUVsO1xuICAgICAgICAgIGlmIChtb2RhbERvbUVsICYmIG1vZGFsRG9tRWwubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGV2dC50YXJnZXQgfHwgZXZ0LnNyY0VsZW1lbnQpID09PSBtb2RhbERvbUVsWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5pc0ZvY3VzSW5GaXJzdEl0ZW0gPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgaWYgKGZvY3VzYWJsZUVsZW1lbnRMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gKGV2dC50YXJnZXQgfHwgZXZ0LnNyY0VsZW1lbnQpID09PSBmb2N1c2FibGVFbGVtZW50TGlzdFswXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5pc0ZvY3VzSW5MYXN0SXRlbSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiAoZXZ0LnRhcmdldCB8fCBldnQuc3JjRWxlbWVudCkgPT09IGZvY3VzYWJsZUVsZW1lbnRMaXN0W2ZvY3VzYWJsZUVsZW1lbnRMaXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmNsZWFyRm9jdXNMaXN0Q2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9jdXNhYmxlRWxlbWVudExpc3QgPSBbXTtcbiAgICAgICAgZm9jdXNJbmRleCA9IDA7XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5sb2FkRm9jdXNFbGVtZW50TGlzdCA9IGZ1bmN0aW9uKG1vZGFsV2luZG93KSB7XG4gICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50TGlzdCA9PT0gdW5kZWZpbmVkIHx8ICFmb2N1c2FibGVFbGVtZW50TGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAobW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbERvbUUxID0gbW9kYWxXaW5kb3cudmFsdWUubW9kYWxEb21FbDtcbiAgICAgICAgICAgIGlmIChtb2RhbERvbUUxICYmIG1vZGFsRG9tRTEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRMaXN0ID0gbW9kYWxEb21FMVswXS5xdWVyeVNlbGVjdG9yQWxsKHRhYmFiYmxlU2VsZWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuICRtb2RhbFN0YWNrO1xuICAgIH1dKVxuXG4gIC5wcm92aWRlcignJHVpYk1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyICRtb2RhbFByb3ZpZGVyID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgIGJhY2tkcm9wOiB0cnVlLCAvL2NhbiBhbHNvIGJlIGZhbHNlIG9yICdzdGF0aWMnXG4gICAgICAgIGtleWJvYXJkOiB0cnVlXG4gICAgICB9LFxuICAgICAgJGdldDogWyckcm9vdFNjb3BlJywgJyRxJywgJyRkb2N1bWVudCcsICckdGVtcGxhdGVSZXF1ZXN0JywgJyRjb250cm9sbGVyJywgJyR1aWJSZXNvbHZlJywgJyR1aWJNb2RhbFN0YWNrJyxcbiAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCAkZG9jdW1lbnQsICR0ZW1wbGF0ZVJlcXVlc3QsICRjb250cm9sbGVyLCAkdWliUmVzb2x2ZSwgJG1vZGFsU3RhY2spIHtcbiAgICAgICAgICB2YXIgJG1vZGFsID0ge307XG5cbiAgICAgICAgICBmdW5jdGlvbiBnZXRUZW1wbGF0ZVByb21pc2Uob3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMudGVtcGxhdGUgPyAkcS53aGVuKG9wdGlvbnMudGVtcGxhdGUpIDpcbiAgICAgICAgICAgICAgJHRlbXBsYXRlUmVxdWVzdChhbmd1bGFyLmlzRnVuY3Rpb24ob3B0aW9ucy50ZW1wbGF0ZVVybCkgP1xuICAgICAgICAgICAgICAgIG9wdGlvbnMudGVtcGxhdGVVcmwoKSA6IG9wdGlvbnMudGVtcGxhdGVVcmwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBwcm9taXNlQ2hhaW4gPSBudWxsO1xuICAgICAgICAgICRtb2RhbC5nZXRQcm9taXNlQ2hhaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlQ2hhaW47XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRtb2RhbC5vcGVuID0gZnVuY3Rpb24obW9kYWxPcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgbW9kYWxSZXN1bHREZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICB2YXIgbW9kYWxPcGVuZWREZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICB2YXIgbW9kYWxDbG9zZWREZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICB2YXIgbW9kYWxSZW5kZXJEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgIC8vcHJlcGFyZSBhbiBpbnN0YW5jZSBvZiBhIG1vZGFsIHRvIGJlIGluamVjdGVkIGludG8gY29udHJvbGxlcnMgYW5kIHJldHVybmVkIHRvIGEgY2FsbGVyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IHtcbiAgICAgICAgICAgICAgcmVzdWx0OiBtb2RhbFJlc3VsdERlZmVycmVkLnByb21pc2UsXG4gICAgICAgICAgICAgIG9wZW5lZDogbW9kYWxPcGVuZWREZWZlcnJlZC5wcm9taXNlLFxuICAgICAgICAgICAgICBjbG9zZWQ6IG1vZGFsQ2xvc2VkRGVmZXJyZWQucHJvbWlzZSxcbiAgICAgICAgICAgICAgcmVuZGVyZWQ6IG1vZGFsUmVuZGVyRGVmZXJyZWQucHJvbWlzZSxcbiAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1vZGFsU3RhY2suY2xvc2UobW9kYWxJbnN0YW5jZSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZGlzbWlzczogZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkbW9kYWxTdGFjay5kaXNtaXNzKG1vZGFsSW5zdGFuY2UsIHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vbWVyZ2UgYW5kIGNsZWFuIHVwIG9wdGlvbnNcbiAgICAgICAgICAgIG1vZGFsT3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkbW9kYWxQcm92aWRlci5vcHRpb25zLCBtb2RhbE9wdGlvbnMpO1xuICAgICAgICAgICAgbW9kYWxPcHRpb25zLnJlc29sdmUgPSBtb2RhbE9wdGlvbnMucmVzb2x2ZSB8fCB7fTtcbiAgICAgICAgICAgIG1vZGFsT3B0aW9ucy5hcHBlbmRUbyA9IG1vZGFsT3B0aW9ucy5hcHBlbmRUbyB8fCAkZG9jdW1lbnQuZmluZCgnYm9keScpLmVxKDApO1xuXG4gICAgICAgICAgICAvL3ZlcmlmeSBvcHRpb25zXG4gICAgICAgICAgICBpZiAoIW1vZGFsT3B0aW9ucy50ZW1wbGF0ZSAmJiAhbW9kYWxPcHRpb25zLnRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25lIG9mIHRlbXBsYXRlIG9yIHRlbXBsYXRlVXJsIG9wdGlvbnMgaXMgcmVxdWlyZWQuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUFuZFJlc29sdmVQcm9taXNlID1cbiAgICAgICAgICAgICAgJHEuYWxsKFtnZXRUZW1wbGF0ZVByb21pc2UobW9kYWxPcHRpb25zKSwgJHVpYlJlc29sdmUucmVzb2x2ZShtb2RhbE9wdGlvbnMucmVzb2x2ZSwge30sIG51bGwsIG51bGwpXSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlc29sdmVXaXRoVGVtcGxhdGUoKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZUFuZFJlc29sdmVQcm9taXNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXYWl0IGZvciB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgZXhpc3RpbmcgcHJvbWlzZSBjaGFpbi5cbiAgICAgICAgICAgIC8vIFRoZW4gc3dpdGNoIHRvIG91ciBvd24gY29tYmluZWQgcHJvbWlzZSBkZXBlbmRlbmN5IChyZWdhcmRsZXNzIG9mIGhvdyB0aGUgcHJldmlvdXMgbW9kYWwgZmFyZWQpLlxuICAgICAgICAgICAgLy8gVGhlbiBhZGQgdG8gJG1vZGFsU3RhY2sgYW5kIHJlc29sdmUgb3BlbmVkLlxuICAgICAgICAgICAgLy8gRmluYWxseSBjbGVhbiB1cCB0aGUgY2hhaW4gdmFyaWFibGUgaWYgbm8gc3Vic2VxdWVudCBtb2RhbCBoYXMgb3ZlcndyaXR0ZW4gaXQuXG4gICAgICAgICAgICB2YXIgc2FtZVByb21pc2U7XG4gICAgICAgICAgICBzYW1lUHJvbWlzZSA9IHByb21pc2VDaGFpbiA9ICRxLmFsbChbcHJvbWlzZUNoYWluXSlcbiAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZVdpdGhUZW1wbGF0ZSwgcmVzb2x2ZVdpdGhUZW1wbGF0ZSlcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZVN1Y2Nlc3ModHBsQW5kVmFycykge1xuICAgICAgICAgICAgICAgIHZhciBwcm92aWRlZFNjb3BlID0gbW9kYWxPcHRpb25zLnNjb3BlIHx8ICRyb290U2NvcGU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW9kYWxTY29wZSA9IHByb3ZpZGVkU2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgICAgIG1vZGFsU2NvcGUuJGNsb3NlID0gbW9kYWxJbnN0YW5jZS5jbG9zZTtcbiAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRkaXNtaXNzID0gbW9kYWxJbnN0YW5jZS5kaXNtaXNzO1xuXG4gICAgICAgICAgICAgICAgbW9kYWxTY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIW1vZGFsU2NvcGUuJCR1aWJEZXN0cnVjdGlvblNjaGVkdWxlZCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbFNjb3BlLiRkaXNtaXNzKCckdWliVW5zY2hlZHVsZWREZXN0cnVjdGlvbicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGN0cmxJbnN0YW5jZSwgY3RybExvY2FscyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgLy9jb250cm9sbGVyc1xuICAgICAgICAgICAgICAgIGlmIChtb2RhbE9wdGlvbnMuY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgY3RybExvY2Fscy4kc2NvcGUgPSBtb2RhbFNjb3BlO1xuICAgICAgICAgICAgICAgICAgY3RybExvY2Fscy4kdWliTW9kYWxJbnN0YW5jZSA9IG1vZGFsSW5zdGFuY2U7XG4gICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godHBsQW5kVmFyc1sxXSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsTG9jYWxzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UgPSAkY29udHJvbGxlcihtb2RhbE9wdGlvbnMuY29udHJvbGxlciwgY3RybExvY2Fscyk7XG4gICAgICAgICAgICAgICAgICBpZiAobW9kYWxPcHRpb25zLmNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kYWxPcHRpb25zLmJpbmRUb0NvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjdHJsSW5zdGFuY2UuJGNsb3NlID0gbW9kYWxTY29wZS4kY2xvc2U7XG4gICAgICAgICAgICAgICAgICAgICAgY3RybEluc3RhbmNlLiRkaXNtaXNzID0gbW9kYWxTY29wZS4kZGlzbWlzcztcbiAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChjdHJsSW5zdGFuY2UsIHByb3ZpZGVkU2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbW9kYWxTY29wZVttb2RhbE9wdGlvbnMuY29udHJvbGxlckFzXSA9IGN0cmxJbnN0YW5jZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkbW9kYWxTdGFjay5vcGVuKG1vZGFsSW5zdGFuY2UsIHtcbiAgICAgICAgICAgICAgICAgIHNjb3BlOiBtb2RhbFNjb3BlLFxuICAgICAgICAgICAgICAgICAgZGVmZXJyZWQ6IG1vZGFsUmVzdWx0RGVmZXJyZWQsXG4gICAgICAgICAgICAgICAgICByZW5kZXJEZWZlcnJlZDogbW9kYWxSZW5kZXJEZWZlcnJlZCxcbiAgICAgICAgICAgICAgICAgIGNsb3NlZERlZmVycmVkOiBtb2RhbENsb3NlZERlZmVycmVkLFxuICAgICAgICAgICAgICAgICAgY29udGVudDogdHBsQW5kVmFyc1swXSxcbiAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogbW9kYWxPcHRpb25zLmFuaW1hdGlvbixcbiAgICAgICAgICAgICAgICAgIGJhY2tkcm9wOiBtb2RhbE9wdGlvbnMuYmFja2Ryb3AsXG4gICAgICAgICAgICAgICAgICBrZXlib2FyZDogbW9kYWxPcHRpb25zLmtleWJvYXJkLFxuICAgICAgICAgICAgICAgICAgYmFja2Ryb3BDbGFzczogbW9kYWxPcHRpb25zLmJhY2tkcm9wQ2xhc3MsXG4gICAgICAgICAgICAgICAgICB3aW5kb3dUb3BDbGFzczogbW9kYWxPcHRpb25zLndpbmRvd1RvcENsYXNzLFxuICAgICAgICAgICAgICAgICAgd2luZG93Q2xhc3M6IG1vZGFsT3B0aW9ucy53aW5kb3dDbGFzcyxcbiAgICAgICAgICAgICAgICAgIHdpbmRvd1RlbXBsYXRlVXJsOiBtb2RhbE9wdGlvbnMud2luZG93VGVtcGxhdGVVcmwsXG4gICAgICAgICAgICAgICAgICBzaXplOiBtb2RhbE9wdGlvbnMuc2l6ZSxcbiAgICAgICAgICAgICAgICAgIG9wZW5lZENsYXNzOiBtb2RhbE9wdGlvbnMub3BlbmVkQ2xhc3MsXG4gICAgICAgICAgICAgICAgICBhcHBlbmRUbzogbW9kYWxPcHRpb25zLmFwcGVuZFRvXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbW9kYWxPcGVuZWREZWZlcnJlZC5yZXNvbHZlKHRydWUpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiByZXNvbHZlRXJyb3IocmVhc29uKSB7XG4gICAgICAgICAgICAgIG1vZGFsT3BlbmVkRGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgICAgIG1vZGFsUmVzdWx0RGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgICB9KVsnZmluYWxseSddKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAocHJvbWlzZUNoYWluID09PSBzYW1lUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHByb21pc2VDaGFpbiA9IG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbW9kYWxJbnN0YW5jZTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuICRtb2RhbDtcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG5cbiAgICByZXR1cm4gJG1vZGFsUHJvdmlkZXI7XG4gIH0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnBhZ2luZycsIFtdKVxuLyoqXG4gKiBIZWxwZXIgaW50ZXJuYWwgc2VydmljZSBmb3IgZ2VuZXJhdGluZyBjb21tb24gY29udHJvbGxlciBjb2RlIGJldHdlZW4gdGhlXG4gKiBwYWdlciBhbmQgcGFnaW5hdGlvbiBjb21wb25lbnRzXG4gKi9cbi5mYWN0b3J5KCd1aWJQYWdpbmcnLCBbJyRwYXJzZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xuICByZXR1cm4ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oY3RybCwgJHNjb3BlLCAkYXR0cnMpIHtcbiAgICAgIGN0cmwuc2V0TnVtUGFnZXMgPSAkYXR0cnMubnVtUGFnZXMgPyAkcGFyc2UoJGF0dHJzLm51bVBhZ2VzKS5hc3NpZ24gOiBhbmd1bGFyLm5vb3A7XG4gICAgICBjdHJsLm5nTW9kZWxDdHJsID0geyAkc2V0Vmlld1ZhbHVlOiBhbmd1bGFyLm5vb3AgfTsgLy8gbnVsbE1vZGVsQ3RybFxuICAgICAgY3RybC5fd2F0Y2hlcnMgPSBbXTtcblxuICAgICAgY3RybC5pbml0ID0gZnVuY3Rpb24obmdNb2RlbEN0cmwsIGNvbmZpZykge1xuICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgIGN0cmwuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjdHJsLnJlbmRlcigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICgkYXR0cnMuaXRlbXNQZXJQYWdlKSB7XG4gICAgICAgICAgY3RybC5fd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5pdGVtc1BlclBhZ2UpLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgY3RybC5pdGVtc1BlclBhZ2UgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgJHNjb3BlLnRvdGFsUGFnZXMgPSBjdHJsLmNhbGN1bGF0ZVRvdGFsUGFnZXMoKTtcbiAgICAgICAgICAgIGN0cmwudXBkYXRlUGFnZSgpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHJsLml0ZW1zUGVyUGFnZSA9IGNvbmZpZy5pdGVtc1BlclBhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuJHdhdGNoKCd0b3RhbEl0ZW1zJywgZnVuY3Rpb24obmV3VG90YWwsIG9sZFRvdGFsKSB7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKG5ld1RvdGFsKSB8fCBuZXdUb3RhbCAhPT0gb2xkVG90YWwpIHtcbiAgICAgICAgICAgICRzY29wZS50b3RhbFBhZ2VzID0gY3RybC5jYWxjdWxhdGVUb3RhbFBhZ2VzKCk7XG4gICAgICAgICAgICBjdHJsLnVwZGF0ZVBhZ2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY3RybC5jYWxjdWxhdGVUb3RhbFBhZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0b3RhbFBhZ2VzID0gY3RybC5pdGVtc1BlclBhZ2UgPCAxID8gMSA6IE1hdGguY2VpbCgkc2NvcGUudG90YWxJdGVtcyAvIGN0cmwuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRvdGFsUGFnZXMgfHwgMCwgMSk7XG4gICAgICB9O1xuXG4gICAgICBjdHJsLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUucGFnZSA9IHBhcnNlSW50KGN0cmwubmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSwgMTApIHx8IDE7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VsZWN0UGFnZSA9IGZ1bmN0aW9uKHBhZ2UsIGV2dCkge1xuICAgICAgICBpZiAoZXZ0KSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2xpY2tBbGxvd2VkID0gISRzY29wZS5uZ0Rpc2FibGVkIHx8ICFldnQ7XG4gICAgICAgIGlmIChjbGlja0FsbG93ZWQgJiYgJHNjb3BlLnBhZ2UgIT09IHBhZ2UgJiYgcGFnZSA+IDAgJiYgcGFnZSA8PSAkc2NvcGUudG90YWxQYWdlcykge1xuICAgICAgICAgIGlmIChldnQgJiYgZXZ0LnRhcmdldCkge1xuICAgICAgICAgICAgZXZ0LnRhcmdldC5ibHVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShwYWdlKTtcbiAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmdldFRleHQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuICRzY29wZVtrZXkgKyAnVGV4dCddIHx8IGN0cmwuY29uZmlnW2tleSArICdUZXh0J107XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUubm9QcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHNjb3BlLnBhZ2UgPT09IDE7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUubm9OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkc2NvcGUucGFnZSA9PT0gJHNjb3BlLnRvdGFsUGFnZXM7XG4gICAgICB9O1xuXG4gICAgICBjdHJsLnVwZGF0ZVBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY3RybC5zZXROdW1QYWdlcygkc2NvcGUuJHBhcmVudCwgJHNjb3BlLnRvdGFsUGFnZXMpOyAvLyBSZWFkb25seSB2YXJpYWJsZVxuXG4gICAgICAgIGlmICgkc2NvcGUucGFnZSA+ICRzY29wZS50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgJHNjb3BlLnNlbGVjdFBhZ2UoJHNjb3BlLnRvdGFsUGFnZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGlsZSAoY3RybC5fd2F0Y2hlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY3RybC5fd2F0Y2hlcnMuc2hpZnQoKSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAucGFnZXInLCBbJ3VpLmJvb3RzdHJhcC5wYWdpbmcnXSlcblxuLmNvbnRyb2xsZXIoJ1VpYlBhZ2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRhdHRycycsICd1aWJQYWdpbmcnLCAndWliUGFnZXJDb25maWcnLCBmdW5jdGlvbigkc2NvcGUsICRhdHRycywgdWliUGFnaW5nLCB1aWJQYWdlckNvbmZpZykge1xuICAkc2NvcGUuYWxpZ24gPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuYWxpZ24pID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLmFsaWduKSA6IHVpYlBhZ2VyQ29uZmlnLmFsaWduO1xuXG4gIHVpYlBhZ2luZy5jcmVhdGUodGhpcywgJHNjb3BlLCAkYXR0cnMpO1xufV0pXG5cbi5jb25zdGFudCgndWliUGFnZXJDb25maWcnLCB7XG4gIGl0ZW1zUGVyUGFnZTogMTAsXG4gIHByZXZpb3VzVGV4dDogJ8KrIFByZXZpb3VzJyxcbiAgbmV4dFRleHQ6ICdOZXh0IMK7JyxcbiAgYWxpZ246IHRydWVcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlBhZ2VyJywgWyd1aWJQYWdlckNvbmZpZycsIGZ1bmN0aW9uKHVpYlBhZ2VyQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIHRvdGFsSXRlbXM6ICc9JyxcbiAgICAgIHByZXZpb3VzVGV4dDogJ0AnLFxuICAgICAgbmV4dFRleHQ6ICdAJyxcbiAgICAgIG5nRGlzYWJsZWQ6ICc9J1xuICAgIH0sXG4gICAgcmVxdWlyZTogWyd1aWJQYWdlcicsICc/bmdNb2RlbCddLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJQYWdlckNvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ3BhZ2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL3BhZ2VyL3BhZ2VyLmh0bWwnO1xuICAgIH0sXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgcGFnaW5hdGlvbkN0cmwgPSBjdHJsc1swXSwgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcbiAgICAgIH1cblxuICAgICAgcGFnaW5hdGlvbkN0cmwuaW5pdChuZ01vZGVsQ3RybCwgdWliUGFnZXJDb25maWcpO1xuICAgIH1cbiAgfTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5wYWdpbmF0aW9uJywgWyd1aS5ib290c3RyYXAucGFnaW5nJ10pXG4uY29udHJvbGxlcignVWliUGFnaW5hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAnJHBhcnNlJywgJ3VpYlBhZ2luZycsICd1aWJQYWdpbmF0aW9uQ29uZmlnJywgZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMsICRwYXJzZSwgdWliUGFnaW5nLCB1aWJQYWdpbmF0aW9uQ29uZmlnKSB7XG4gIHZhciBjdHJsID0gdGhpcztcbiAgLy8gU2V0dXAgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gIHZhciBtYXhTaXplID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLm1heFNpemUpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLm1heFNpemUpIDogdWliUGFnaW5hdGlvbkNvbmZpZy5tYXhTaXplLFxuICAgIHJvdGF0ZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5yb3RhdGUpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnJvdGF0ZSkgOiB1aWJQYWdpbmF0aW9uQ29uZmlnLnJvdGF0ZSxcbiAgICBmb3JjZUVsbGlwc2VzID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmZvcmNlRWxsaXBzZXMpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLmZvcmNlRWxsaXBzZXMpIDogdWliUGFnaW5hdGlvbkNvbmZpZy5mb3JjZUVsbGlwc2VzLFxuICAgIGJvdW5kYXJ5TGlua051bWJlcnMgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuYm91bmRhcnlMaW5rTnVtYmVycykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuYm91bmRhcnlMaW5rTnVtYmVycykgOiB1aWJQYWdpbmF0aW9uQ29uZmlnLmJvdW5kYXJ5TGlua051bWJlcnM7XG4gICRzY29wZS5ib3VuZGFyeUxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLmJvdW5kYXJ5TGlua3MpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLmJvdW5kYXJ5TGlua3MpIDogdWliUGFnaW5hdGlvbkNvbmZpZy5ib3VuZGFyeUxpbmtzO1xuICAkc2NvcGUuZGlyZWN0aW9uTGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZGlyZWN0aW9uTGlua3MpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLmRpcmVjdGlvbkxpbmtzKSA6IHVpYlBhZ2luYXRpb25Db25maWcuZGlyZWN0aW9uTGlua3M7XG5cbiAgdWliUGFnaW5nLmNyZWF0ZSh0aGlzLCAkc2NvcGUsICRhdHRycyk7XG5cbiAgaWYgKCRhdHRycy5tYXhTaXplKSB7XG4gICAgY3RybC5fd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5tYXhTaXplKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIG1heFNpemUgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgY3RybC5yZW5kZXIoKTtcbiAgICB9KSk7XG4gIH1cblxuICAvLyBDcmVhdGUgcGFnZSBvYmplY3QgdXNlZCBpbiB0ZW1wbGF0ZVxuICBmdW5jdGlvbiBtYWtlUGFnZShudW1iZXIsIHRleHQsIGlzQWN0aXZlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG51bWJlcjogbnVtYmVyLFxuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIGFjdGl2ZTogaXNBY3RpdmVcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFnZXMoY3VycmVudFBhZ2UsIHRvdGFsUGFnZXMpIHtcbiAgICB2YXIgcGFnZXMgPSBbXTtcblxuICAgIC8vIERlZmF1bHQgcGFnZSBsaW1pdHNcbiAgICB2YXIgc3RhcnRQYWdlID0gMSwgZW5kUGFnZSA9IHRvdGFsUGFnZXM7XG4gICAgdmFyIGlzTWF4U2l6ZWQgPSBhbmd1bGFyLmlzRGVmaW5lZChtYXhTaXplKSAmJiBtYXhTaXplIDwgdG90YWxQYWdlcztcblxuICAgIC8vIHJlY29tcHV0ZSBpZiBtYXhTaXplXG4gICAgaWYgKGlzTWF4U2l6ZWQpIHtcbiAgICAgIGlmIChyb3RhdGUpIHtcbiAgICAgICAgLy8gQ3VycmVudCBwYWdlIGlzIGRpc3BsYXllZCBpbiB0aGUgbWlkZGxlIG9mIHRoZSB2aXNpYmxlIG9uZXNcbiAgICAgICAgc3RhcnRQYWdlID0gTWF0aC5tYXgoY3VycmVudFBhZ2UgLSBNYXRoLmZsb29yKG1heFNpemUgLyAyKSwgMSk7XG4gICAgICAgIGVuZFBhZ2UgPSBzdGFydFBhZ2UgKyBtYXhTaXplIC0gMTtcblxuICAgICAgICAvLyBBZGp1c3QgaWYgbGltaXQgaXMgZXhjZWVkZWRcbiAgICAgICAgaWYgKGVuZFBhZ2UgPiB0b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgZW5kUGFnZSA9IHRvdGFsUGFnZXM7XG4gICAgICAgICAgc3RhcnRQYWdlID0gZW5kUGFnZSAtIG1heFNpemUgKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBWaXNpYmxlIHBhZ2VzIGFyZSBwYWdpbmF0ZWQgd2l0aCBtYXhTaXplXG4gICAgICAgIHN0YXJ0UGFnZSA9IChNYXRoLmNlaWwoY3VycmVudFBhZ2UgLyBtYXhTaXplKSAtIDEpICogbWF4U2l6ZSArIDE7XG5cbiAgICAgICAgLy8gQWRqdXN0IGxhc3QgcGFnZSBpZiBsaW1pdCBpcyBleGNlZWRlZFxuICAgICAgICBlbmRQYWdlID0gTWF0aC5taW4oc3RhcnRQYWdlICsgbWF4U2l6ZSAtIDEsIHRvdGFsUGFnZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBwYWdlIG51bWJlciBsaW5rc1xuICAgIGZvciAodmFyIG51bWJlciA9IHN0YXJ0UGFnZTsgbnVtYmVyIDw9IGVuZFBhZ2U7IG51bWJlcisrKSB7XG4gICAgICB2YXIgcGFnZSA9IG1ha2VQYWdlKG51bWJlciwgbnVtYmVyLCBudW1iZXIgPT09IGN1cnJlbnRQYWdlKTtcbiAgICAgIHBhZ2VzLnB1c2gocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGxpbmtzIHRvIG1vdmUgYmV0d2VlbiBwYWdlIHNldHNcbiAgICBpZiAoaXNNYXhTaXplZCAmJiBtYXhTaXplID4gMCAmJiAoIXJvdGF0ZSB8fCBmb3JjZUVsbGlwc2VzIHx8IGJvdW5kYXJ5TGlua051bWJlcnMpKSB7XG4gICAgICBpZiAoc3RhcnRQYWdlID4gMSkge1xuICAgICAgICBpZiAoIWJvdW5kYXJ5TGlua051bWJlcnMgfHwgc3RhcnRQYWdlID4gMykgeyAvL25lZWQgZWxsaXBzaXMgZm9yIGFsbCBvcHRpb25zIHVubGVzcyByYW5nZSBpcyB0b28gY2xvc2UgdG8gYmVnaW5uaW5nXG4gICAgICAgIHZhciBwcmV2aW91c1BhZ2VTZXQgPSBtYWtlUGFnZShzdGFydFBhZ2UgLSAxLCAnLi4uJywgZmFsc2UpO1xuICAgICAgICBwYWdlcy51bnNoaWZ0KHByZXZpb3VzUGFnZVNldCk7XG4gICAgICB9XG4gICAgICAgIGlmIChib3VuZGFyeUxpbmtOdW1iZXJzKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0UGFnZSA9PT0gMykgeyAvL25lZWQgdG8gcmVwbGFjZSBlbGxpcHNpcyB3aGVuIHRoZSBidXR0b25zIHdvdWxkIGJlIHNlcXVlbnRpYWxcbiAgICAgICAgICAgIHZhciBzZWNvbmRQYWdlTGluayA9IG1ha2VQYWdlKDIsICcyJywgZmFsc2UpO1xuICAgICAgICAgICAgcGFnZXMudW5zaGlmdChzZWNvbmRQYWdlTGluayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vYWRkIHRoZSBmaXJzdCBwYWdlXG4gICAgICAgICAgdmFyIGZpcnN0UGFnZUxpbmsgPSBtYWtlUGFnZSgxLCAnMScsIGZhbHNlKTtcbiAgICAgICAgICBwYWdlcy51bnNoaWZ0KGZpcnN0UGFnZUxpbmspO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmRQYWdlIDwgdG90YWxQYWdlcykge1xuICAgICAgICBpZiAoIWJvdW5kYXJ5TGlua051bWJlcnMgfHwgZW5kUGFnZSA8IHRvdGFsUGFnZXMgLSAyKSB7IC8vbmVlZCBlbGxpcHNpcyBmb3IgYWxsIG9wdGlvbnMgdW5sZXNzIHJhbmdlIGlzIHRvbyBjbG9zZSB0byBlbmRcbiAgICAgICAgdmFyIG5leHRQYWdlU2V0ID0gbWFrZVBhZ2UoZW5kUGFnZSArIDEsICcuLi4nLCBmYWxzZSk7XG4gICAgICAgIHBhZ2VzLnB1c2gobmV4dFBhZ2VTZXQpO1xuICAgICAgfVxuICAgICAgICBpZiAoYm91bmRhcnlMaW5rTnVtYmVycykge1xuICAgICAgICAgIGlmIChlbmRQYWdlID09PSB0b3RhbFBhZ2VzIC0gMikgeyAvL25lZWQgdG8gcmVwbGFjZSBlbGxpcHNpcyB3aGVuIHRoZSBidXR0b25zIHdvdWxkIGJlIHNlcXVlbnRpYWxcbiAgICAgICAgICAgIHZhciBzZWNvbmRUb0xhc3RQYWdlTGluayA9IG1ha2VQYWdlKHRvdGFsUGFnZXMgLSAxLCB0b3RhbFBhZ2VzIC0gMSwgZmFsc2UpO1xuICAgICAgICAgICAgcGFnZXMucHVzaChzZWNvbmRUb0xhc3RQYWdlTGluayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vYWRkIHRoZSBsYXN0IHBhZ2VcbiAgICAgICAgICB2YXIgbGFzdFBhZ2VMaW5rID0gbWFrZVBhZ2UodG90YWxQYWdlcywgdG90YWxQYWdlcywgZmFsc2UpO1xuICAgICAgICAgIHBhZ2VzLnB1c2gobGFzdFBhZ2VMaW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFnZXM7XG4gIH1cblxuICB2YXIgb3JpZ2luYWxSZW5kZXIgPSB0aGlzLnJlbmRlcjtcbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBvcmlnaW5hbFJlbmRlcigpO1xuICAgIGlmICgkc2NvcGUucGFnZSA+IDAgJiYgJHNjb3BlLnBhZ2UgPD0gJHNjb3BlLnRvdGFsUGFnZXMpIHtcbiAgICAgICRzY29wZS5wYWdlcyA9IGdldFBhZ2VzKCRzY29wZS5wYWdlLCAkc2NvcGUudG90YWxQYWdlcyk7XG4gICAgfVxuICB9O1xufV0pXG5cbi5jb25zdGFudCgndWliUGFnaW5hdGlvbkNvbmZpZycsIHtcbiAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgYm91bmRhcnlMaW5rczogZmFsc2UsXG4gIGJvdW5kYXJ5TGlua051bWJlcnM6IGZhbHNlLFxuICBkaXJlY3Rpb25MaW5rczogdHJ1ZSxcbiAgZmlyc3RUZXh0OiAnRmlyc3QnLFxuICBwcmV2aW91c1RleHQ6ICdQcmV2aW91cycsXG4gIG5leHRUZXh0OiAnTmV4dCcsXG4gIGxhc3RUZXh0OiAnTGFzdCcsXG4gIHJvdGF0ZTogdHJ1ZSxcbiAgZm9yY2VFbGxpcHNlczogZmFsc2Vcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlBhZ2luYXRpb24nLCBbJyRwYXJzZScsICd1aWJQYWdpbmF0aW9uQ29uZmlnJywgZnVuY3Rpb24oJHBhcnNlLCB1aWJQYWdpbmF0aW9uQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIHRvdGFsSXRlbXM6ICc9JyxcbiAgICAgIGZpcnN0VGV4dDogJ0AnLFxuICAgICAgcHJldmlvdXNUZXh0OiAnQCcsXG4gICAgICBuZXh0VGV4dDogJ0AnLFxuICAgICAgbGFzdFRleHQ6ICdAJyxcbiAgICAgIG5nRGlzYWJsZWQ6Jz0nXG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ3VpYlBhZ2luYXRpb24nLCAnP25nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnVWliUGFnaW5hdGlvbkNvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ3BhZ2luYXRpb24nLFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd1aWIvdGVtcGxhdGUvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmh0bWwnO1xuICAgIH0sXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgcGFnaW5hdGlvbkN0cmwgPSBjdHJsc1swXSwgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgcmV0dXJuOyAvLyBkbyBub3RoaW5nIGlmIG5vIG5nLW1vZGVsXG4gICAgICB9XG5cbiAgICAgIHBhZ2luYXRpb25DdHJsLmluaXQobmdNb2RlbEN0cmwsIHVpYlBhZ2luYXRpb25Db25maWcpO1xuICAgIH1cbiAgfTtcbn1dKTtcblxuLyoqXG4gKiBUaGUgZm9sbG93aW5nIGZlYXR1cmVzIGFyZSBzdGlsbCBvdXRzdGFuZGluZzogYW5pbWF0aW9uIGFzIGFcbiAqIGZ1bmN0aW9uLCBwbGFjZW1lbnQgYXMgYSBmdW5jdGlvbiwgaW5zaWRlLCBzdXBwb3J0IGZvciBtb3JlIHRyaWdnZXJzIHRoYW5cbiAqIGp1c3QgbW91c2UgZW50ZXIvbGVhdmUsIGh0bWwgdG9vbHRpcHMsIGFuZCBzZWxlY3RvciBkZWxlZ2F0aW9uLlxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnRvb2x0aXAnLCBbJ3VpLmJvb3RzdHJhcC5wb3NpdGlvbicsICd1aS5ib290c3RyYXAuc3RhY2tlZE1hcCddKVxuXG4vKipcbiAqIFRoZSAkdG9vbHRpcCBzZXJ2aWNlIGNyZWF0ZXMgdG9vbHRpcC0gYW5kIHBvcG92ZXItbGlrZSBkaXJlY3RpdmVzIGFzIHdlbGwgYXNcbiAqIGhvdXNlcyBnbG9iYWwgb3B0aW9ucyBmb3IgdGhlbS5cbiAqL1xuLnByb3ZpZGVyKCckdWliVG9vbHRpcCcsIGZ1bmN0aW9uKCkge1xuICAvLyBUaGUgZGVmYXVsdCBvcHRpb25zIHRvb2x0aXAgYW5kIHBvcG92ZXIuXG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHBsYWNlbWVudENsYXNzUHJlZml4OiAnJyxcbiAgICBhbmltYXRpb246IHRydWUsXG4gICAgcG9wdXBEZWxheTogMCxcbiAgICBwb3B1cENsb3NlRGVsYXk6IDAsXG4gICAgdXNlQ29udGVudEV4cDogZmFsc2VcbiAgfTtcblxuICAvLyBEZWZhdWx0IGhpZGUgdHJpZ2dlcnMgZm9yIGVhY2ggc2hvdyB0cmlnZ2VyXG4gIHZhciB0cmlnZ2VyTWFwID0ge1xuICAgICdtb3VzZWVudGVyJzogJ21vdXNlbGVhdmUnLFxuICAgICdjbGljayc6ICdjbGljaycsXG4gICAgJ291dHNpZGVDbGljayc6ICdvdXRzaWRlQ2xpY2snLFxuICAgICdmb2N1cyc6ICdibHVyJyxcbiAgICAnbm9uZSc6ICcnXG4gIH07XG5cbiAgLy8gVGhlIG9wdGlvbnMgc3BlY2lmaWVkIHRvIHRoZSBwcm92aWRlciBnbG9iYWxseS5cbiAgdmFyIGdsb2JhbE9wdGlvbnMgPSB7fTtcblxuICAvKipcbiAgICogYG9wdGlvbnMoe30pYCBhbGxvd3MgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gb2YgYWxsIHRvb2x0aXBzIGluIHRoZVxuICAgKiBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoICdBcHAnLCBbJ3VpLmJvb3RzdHJhcC50b29sdGlwJ10sIGZ1bmN0aW9uKCAkdG9vbHRpcFByb3ZpZGVyICkge1xuICAgKiAgICAgLy8gcGxhY2UgdG9vbHRpcHMgbGVmdCBpbnN0ZWFkIG9mIHRvcCBieSBkZWZhdWx0XG4gICAqICAgICAkdG9vbHRpcFByb3ZpZGVyLm9wdGlvbnMoIHsgcGxhY2VtZW50OiAnbGVmdCcgfSApO1xuICAgKiAgIH0pO1xuICAgKi9cblx0dGhpcy5vcHRpb25zID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRhbmd1bGFyLmV4dGVuZChnbG9iYWxPcHRpb25zLCB2YWx1ZSk7XG5cdH07XG5cbiAgLyoqXG4gICAqIFRoaXMgYWxsb3dzIHlvdSB0byBleHRlbmQgdGhlIHNldCBvZiB0cmlnZ2VyIG1hcHBpbmdzIGF2YWlsYWJsZS4gRS5nLjpcbiAgICpcbiAgICogICAkdG9vbHRpcFByb3ZpZGVyLnNldFRyaWdnZXJzKCAnb3BlblRyaWdnZXInOiAnY2xvc2VUcmlnZ2VyJyApO1xuICAgKi9cbiAgdGhpcy5zZXRUcmlnZ2VycyA9IGZ1bmN0aW9uIHNldFRyaWdnZXJzKHRyaWdnZXJzKSB7XG4gICAgYW5ndWxhci5leHRlbmQodHJpZ2dlck1hcCwgdHJpZ2dlcnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIGZvciB0cmFuc2xhdGluZyBjYW1lbC1jYXNlIHRvIHNuYWtlX2Nhc2UuXG4gICAqL1xuICBmdW5jdGlvbiBzbmFrZV9jYXNlKG5hbWUpIHtcbiAgICB2YXIgcmVnZXhwID0gL1tBLVpdL2c7XG4gICAgdmFyIHNlcGFyYXRvciA9ICctJztcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKHJlZ2V4cCwgZnVuY3Rpb24obGV0dGVyLCBwb3MpIHtcbiAgICAgIHJldHVybiAocG9zID8gc2VwYXJhdG9yIDogJycpICsgbGV0dGVyLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYWN0dWFsIGluc3RhbmNlIG9mIHRoZSAkdG9vbHRpcCBzZXJ2aWNlLlxuICAgKiBUT0RPIHN1cHBvcnQgbXVsdGlwbGUgdHJpZ2dlcnNcbiAgICovXG4gIHRoaXMuJGdldCA9IFsnJHdpbmRvdycsICckY29tcGlsZScsICckdGltZW91dCcsICckZG9jdW1lbnQnLCAnJHVpYlBvc2l0aW9uJywgJyRpbnRlcnBvbGF0ZScsICckcm9vdFNjb3BlJywgJyRwYXJzZScsICckJHN0YWNrZWRNYXAnLCBmdW5jdGlvbigkd2luZG93LCAkY29tcGlsZSwgJHRpbWVvdXQsICRkb2N1bWVudCwgJHBvc2l0aW9uLCAkaW50ZXJwb2xhdGUsICRyb290U2NvcGUsICRwYXJzZSwgJCRzdGFja2VkTWFwKSB7XG4gICAgdmFyIG9wZW5lZFRvb2x0aXBzID0gJCRzdGFja2VkTWFwLmNyZWF0ZU5ldygpO1xuICAgICRkb2N1bWVudC5vbigna2V5cHJlc3MnLCBrZXlwcmVzc0xpc3RlbmVyKTtcblxuICAgICRyb290U2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgJGRvY3VtZW50Lm9mZigna2V5cHJlc3MnLCBrZXlwcmVzc0xpc3RlbmVyKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGtleXByZXNzTGlzdGVuZXIoZSkge1xuICAgICAgaWYgKGUud2hpY2ggPT09IDI3KSB7XG4gICAgICAgIHZhciBsYXN0ID0gb3BlbmVkVG9vbHRpcHMudG9wKCk7XG4gICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgbGFzdC52YWx1ZS5jbG9zZSgpO1xuICAgICAgICAgIG9wZW5lZFRvb2x0aXBzLnJlbW92ZVRvcCgpO1xuICAgICAgICAgIGxhc3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICR0b29sdGlwKHR0VHlwZSwgcHJlZml4LCBkZWZhdWx0VHJpZ2dlclNob3csIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIGdsb2JhbE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgYW4gb2JqZWN0IG9mIHNob3cgYW5kIGhpZGUgdHJpZ2dlcnMuXG4gICAgICAgKlxuICAgICAgICogSWYgYSB0cmlnZ2VyIGlzIHN1cHBsaWVkLFxuICAgICAgICogaXQgaXMgdXNlZCB0byBzaG93IHRoZSB0b29sdGlwOyBvdGhlcndpc2UsIGl0IHdpbGwgdXNlIHRoZSBgdHJpZ2dlcmBcbiAgICAgICAqIG9wdGlvbiBwYXNzZWQgdG8gdGhlIGAkdG9vbHRpcFByb3ZpZGVyLm9wdGlvbnNgIG1ldGhvZDsgZWxzZSBpdCB3aWxsXG4gICAgICAgKiBkZWZhdWx0IHRvIHRoZSB0cmlnZ2VyIHN1cHBsaWVkIHRvIHRoaXMgZGlyZWN0aXZlIGZhY3RvcnkuXG4gICAgICAgKlxuICAgICAgICogVGhlIGhpZGUgdHJpZ2dlciBpcyBiYXNlZCBvbiB0aGUgc2hvdyB0cmlnZ2VyLiBJZiB0aGUgYHRyaWdnZXJgIG9wdGlvblxuICAgICAgICogd2FzIHBhc3NlZCB0byB0aGUgYCR0b29sdGlwUHJvdmlkZXIub3B0aW9uc2AgbWV0aG9kLCBpdCB3aWxsIHVzZSB0aGVcbiAgICAgICAqIG1hcHBlZCB0cmlnZ2VyIGZyb20gYHRyaWdnZXJNYXBgIG9yIHRoZSBwYXNzZWQgdHJpZ2dlciBpZiB0aGUgbWFwIGlzXG4gICAgICAgKiB1bmRlZmluZWQ7IG90aGVyd2lzZSwgaXQgdXNlcyB0aGUgYHRyaWdnZXJNYXBgIHZhbHVlIG9mIHRoZSBzaG93XG4gICAgICAgKiB0cmlnZ2VyOyBlbHNlIGl0IHdpbGwganVzdCB1c2UgdGhlIHNob3cgdHJpZ2dlci5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZ2V0VHJpZ2dlcnModHJpZ2dlcikge1xuICAgICAgICB2YXIgc2hvdyA9ICh0cmlnZ2VyIHx8IG9wdGlvbnMudHJpZ2dlciB8fCBkZWZhdWx0VHJpZ2dlclNob3cpLnNwbGl0KCcgJyk7XG4gICAgICAgIHZhciBoaWRlID0gc2hvdy5tYXAoZnVuY3Rpb24odHJpZ2dlcikge1xuICAgICAgICAgIHJldHVybiB0cmlnZ2VyTWFwW3RyaWdnZXJdIHx8IHRyaWdnZXI7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNob3c6IHNob3csXG4gICAgICAgICAgaGlkZTogaGlkZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB2YXIgZGlyZWN0aXZlTmFtZSA9IHNuYWtlX2Nhc2UodHRUeXBlKTtcblxuICAgICAgdmFyIHN0YXJ0U3ltID0gJGludGVycG9sYXRlLnN0YXJ0U3ltYm9sKCk7XG4gICAgICB2YXIgZW5kU3ltID0gJGludGVycG9sYXRlLmVuZFN5bWJvbCgpO1xuICAgICAgdmFyIHRlbXBsYXRlID1cbiAgICAgICAgJzxkaXYgJysgZGlyZWN0aXZlTmFtZSArICctcG9wdXAgJytcbiAgICAgICAgICAndGl0bGU9XCInICsgc3RhcnRTeW0gKyAndGl0bGUnICsgZW5kU3ltICsgJ1wiICcrXG4gICAgICAgICAgKG9wdGlvbnMudXNlQ29udGVudEV4cCA/XG4gICAgICAgICAgICAnY29udGVudC1leHA9XCJjb250ZW50RXhwKClcIiAnIDpcbiAgICAgICAgICAgICdjb250ZW50PVwiJyArIHN0YXJ0U3ltICsgJ2NvbnRlbnQnICsgZW5kU3ltICsgJ1wiICcpICtcbiAgICAgICAgICAncGxhY2VtZW50PVwiJyArIHN0YXJ0U3ltICsgJ3BsYWNlbWVudCcgKyBlbmRTeW0gKyAnXCIgJytcbiAgICAgICAgICAncG9wdXAtY2xhc3M9XCInICsgc3RhcnRTeW0gKyAncG9wdXBDbGFzcycgKyBlbmRTeW0gKyAnXCIgJytcbiAgICAgICAgICAnYW5pbWF0aW9uPVwiYW5pbWF0aW9uXCIgJyArXG4gICAgICAgICAgJ2lzLW9wZW49XCJpc09wZW5cIicgK1xuICAgICAgICAgICdvcmlnaW4tc2NvcGU9XCJvcmlnU2NvcGVcIiAnICtcbiAgICAgICAgICAnc3R5bGU9XCJ2aXNpYmlsaXR5OiBoaWRkZW47IGRpc3BsYXk6IGJsb2NrOyB0b3A6IC05OTk5cHg7IGxlZnQ6IC05OTk5cHg7XCInICtcbiAgICAgICAgICAnPicgK1xuICAgICAgICAnPC9kaXY+JztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24odEVsZW0sIHRBdHRycykge1xuICAgICAgICAgIHZhciB0b29sdGlwTGlua2VyID0gJGNvbXBpbGUodGVtcGxhdGUpO1xuXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB0b29sdGlwQ3RybCkge1xuICAgICAgICAgICAgdmFyIHRvb2x0aXA7XG4gICAgICAgICAgICB2YXIgdG9vbHRpcExpbmtlZFNjb3BlO1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25UaW1lb3V0O1xuICAgICAgICAgICAgdmFyIHNob3dUaW1lb3V0O1xuICAgICAgICAgICAgdmFyIGhpZGVUaW1lb3V0O1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uVGltZW91dDtcbiAgICAgICAgICAgIHZhciBhcHBlbmRUb0JvZHkgPSBhbmd1bGFyLmlzRGVmaW5lZChvcHRpb25zLmFwcGVuZFRvQm9keSkgPyBvcHRpb25zLmFwcGVuZFRvQm9keSA6IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHRyaWdnZXJzID0gZ2V0VHJpZ2dlcnModW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHZhciBoYXNFbmFibGVFeHAgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRyc1twcmVmaXggKyAnRW5hYmxlJ10pO1xuICAgICAgICAgICAgdmFyIHR0U2NvcGUgPSBzY29wZS4kbmV3KHRydWUpO1xuICAgICAgICAgICAgdmFyIHJlcG9zaXRpb25TY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBpc09wZW5QYXJzZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzW3ByZWZpeCArICdJc09wZW4nXSkgPyAkcGFyc2UoYXR0cnNbcHJlZml4ICsgJ0lzT3BlbiddKSA6IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRQYXJzZSA9IG9wdGlvbnMudXNlQ29udGVudEV4cCA/ICRwYXJzZShhdHRyc1t0dFR5cGVdKSA6IGZhbHNlO1xuICAgICAgICAgICAgdmFyIG9ic2VydmVycyA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgcG9zaXRpb25Ub29sdGlwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRvb2x0aXAgZXhpc3RzIGFuZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgaWYgKCF0b29sdGlwIHx8ICF0b29sdGlwLmh0bWwoKSkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICBpZiAoIXBvc2l0aW9uVGltZW91dCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uVGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHBvc2l0aW9uaW5nLlxuICAgICAgICAgICAgICAgICAgdG9vbHRpcC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIC8vIE5vdyBzZXQgdGhlIGNhbGN1bGF0ZWQgcG9zaXRpb25pbmcuXG4gICAgICAgICAgICAgICAgICB2YXIgdHRQb3NpdGlvbiA9ICRwb3NpdGlvbi5wb3NpdGlvbkVsZW1lbnRzKGVsZW1lbnQsIHRvb2x0aXAsIHR0U2NvcGUucGxhY2VtZW50LCBhcHBlbmRUb0JvZHkpO1xuICAgICAgICAgICAgICAgICAgdG9vbHRpcC5jc3MoeyB0b3A6IHR0UG9zaXRpb24udG9wICsgJ3B4JywgbGVmdDogdHRQb3NpdGlvbi5sZWZ0ICsgJ3B4JywgdmlzaWJpbGl0eTogJ3Zpc2libGUnIH0pO1xuXG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcGxhY2VtZW50IGNsYXNzIGlzIHByZWZpeGVkLCBzdGlsbCBuZWVkXG4gICAgICAgICAgICAgICAgICAvLyB0byByZW1vdmUgdGhlIFRXQlMgc3RhbmRhcmQgY2xhc3MuXG4gICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwLnJlbW92ZUNsYXNzKCd0b3AgYm90dG9tIGxlZnQgcmlnaHQnKTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgdG9vbHRpcC5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICd0b3AgJyArXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2VtZW50Q2xhc3NQcmVmaXggKyAndG9wLWxlZnQgJyArXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2VtZW50Q2xhc3NQcmVmaXggKyAndG9wLXJpZ2h0ICcgK1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgJ2JvdHRvbSAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdib3R0b20tbGVmdCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdib3R0b20tcmlnaHQgJyArXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2VtZW50Q2xhc3NQcmVmaXggKyAnbGVmdCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdsZWZ0LXRvcCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdsZWZ0LWJvdHRvbSAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdyaWdodCAnICtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5wbGFjZW1lbnRDbGFzc1ByZWZpeCArICdyaWdodC10b3AgJyArXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucGxhY2VtZW50Q2xhc3NQcmVmaXggKyAncmlnaHQtYm90dG9tJyk7XG5cbiAgICAgICAgICAgICAgICAgIHZhciBwbGFjZW1lbnQgPSB0dFBvc2l0aW9uLnBsYWNlbWVudC5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgICAgdG9vbHRpcC5hZGRDbGFzcyhwbGFjZW1lbnRbMF0gKyAnICcgKyBvcHRpb25zLnBsYWNlbWVudENsYXNzUHJlZml4ICsgdHRQb3NpdGlvbi5wbGFjZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgJHBvc2l0aW9uLnBvc2l0aW9uQXJyb3codG9vbHRpcCwgdHRQb3NpdGlvbi5wbGFjZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvblRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gU2V0IHVwIHRoZSBjb3JyZWN0IHNjb3BlIHRvIGFsbG93IHRyYW5zY2x1c2lvbiBsYXRlclxuICAgICAgICAgICAgdHRTY29wZS5vcmlnU2NvcGUgPSBzY29wZTtcblxuICAgICAgICAgICAgLy8gQnkgZGVmYXVsdCwgdGhlIHRvb2x0aXAgaXMgbm90IG9wZW4uXG4gICAgICAgICAgICAvLyBUT0RPIGFkZCBhYmlsaXR5IHRvIHN0YXJ0IHRvb2x0aXAgb3BlbmVkXG4gICAgICAgICAgICB0dFNjb3BlLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgb3BlbmVkVG9vbHRpcHMuYWRkKHR0U2NvcGUsIHtcbiAgICAgICAgICAgICAgY2xvc2U6IGhpZGVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB0b2dnbGVUb29sdGlwQmluZCgpIHtcbiAgICAgICAgICAgICAgaWYgKCF0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgIHNob3dUb29sdGlwQmluZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhpZGVUb29sdGlwQmluZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgdGhlIHRvb2x0aXAgd2l0aCBkZWxheSBpZiBzcGVjaWZpZWQsIG90aGVyd2lzZSBzaG93IGl0IGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBmdW5jdGlvbiBzaG93VG9vbHRpcEJpbmQoKSB7XG4gICAgICAgICAgICAgIGlmIChoYXNFbmFibGVFeHAgJiYgIXNjb3BlLiRldmFsKGF0dHJzW3ByZWZpeCArICdFbmFibGUnXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjYW5jZWxIaWRlKCk7XG4gICAgICAgICAgICAgIHByZXBhcmVUb29sdGlwKCk7XG5cbiAgICAgICAgICAgICAgaWYgKHR0U2NvcGUucG9wdXBEZWxheSkge1xuICAgICAgICAgICAgICAgIC8vIERvIG5vdGhpbmcgaWYgdGhlIHRvb2x0aXAgd2FzIGFscmVhZHkgc2NoZWR1bGVkIHRvIHBvcC11cC5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGhhcHBlbnMgaWYgc2hvdyBpcyB0cmlnZ2VyZWQgbXVsdGlwbGUgdGltZXMgYmVmb3JlIGFueSBoaWRlIGlzIHRyaWdnZXJlZC5cbiAgICAgICAgICAgICAgICBpZiAoIXNob3dUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICBzaG93VGltZW91dCA9ICR0aW1lb3V0KHNob3csIHR0U2NvcGUucG9wdXBEZWxheSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaG93KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gaGlkZVRvb2x0aXBCaW5kKCkge1xuICAgICAgICAgICAgICBjYW5jZWxTaG93KCk7XG5cbiAgICAgICAgICAgICAgaWYgKHR0U2NvcGUucG9wdXBDbG9zZURlbGF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoaWRlVGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgaGlkZVRpbWVvdXQgPSAkdGltZW91dChoaWRlLCB0dFNjb3BlLnBvcHVwQ2xvc2VEZWxheSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgdG9vbHRpcCBwb3B1cCBlbGVtZW50LlxuICAgICAgICAgICAgZnVuY3Rpb24gc2hvdygpIHtcbiAgICAgICAgICAgICAgY2FuY2VsU2hvdygpO1xuICAgICAgICAgICAgICBjYW5jZWxIaWRlKCk7XG5cbiAgICAgICAgICAgICAgLy8gRG9uJ3Qgc2hvdyBlbXB0eSB0b29sdGlwcy5cbiAgICAgICAgICAgICAgaWYgKCF0dFNjb3BlLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5ndWxhci5ub29wO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY3JlYXRlVG9vbHRpcCgpO1xuXG4gICAgICAgICAgICAgIC8vIEFuZCBzaG93IHRoZSB0b29sdGlwLlxuICAgICAgICAgICAgICB0dFNjb3BlLiRldmFsQXN5bmMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdHRTY29wZS5pc09wZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFzc2lnbklzT3Blbih0cnVlKTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbmNlbFNob3coKSB7XG4gICAgICAgICAgICAgIGlmIChzaG93VGltZW91dCkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbChzaG93VGltZW91dCk7XG4gICAgICAgICAgICAgICAgc2hvd1RpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uVGltZW91dCkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbChwb3NpdGlvblRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uVGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGlkZSB0aGUgdG9vbHRpcCBwb3B1cCBlbGVtZW50LlxuICAgICAgICAgICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgICAgICAgaWYgKCF0dFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gRmlyc3QgdGhpbmdzIGZpcnN0OiB3ZSBkb24ndCBzaG93IGl0IGFueW1vcmUuXG4gICAgICAgICAgICAgIHR0U2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodHRTY29wZSkge1xuICAgICAgICAgICAgICAgICAgdHRTY29wZS5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGFzc2lnbklzT3BlbihmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAvLyBBbmQgbm93IHdlIHJlbW92ZSBpdCBmcm9tIHRoZSBET00uIEhvd2V2ZXIsIGlmIHdlIGhhdmUgYW5pbWF0aW9uLCB3ZVxuICAgICAgICAgICAgICAgICAgLy8gbmVlZCB0byB3YWl0IGZvciBpdCB0byBleHBpcmUgYmVmb3JlaGFuZC5cbiAgICAgICAgICAgICAgICAgIC8vIEZJWE1FOiB0aGlzIGlzIGEgcGxhY2Vob2xkZXIgZm9yIGEgcG9ydCBvZiB0aGUgdHJhbnNpdGlvbnMgbGlicmFyeS5cbiAgICAgICAgICAgICAgICAgIC8vIFRoZSBmYWRlIHRyYW5zaXRpb24gaW4gVFdCUyBpcyAxNTBtcy5cbiAgICAgICAgICAgICAgICAgIGlmICh0dFNjb3BlLmFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyYW5zaXRpb25UaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvblRpbWVvdXQgPSAkdGltZW91dChyZW1vdmVUb29sdGlwLCAxNTAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbmNlbEhpZGUoKSB7XG4gICAgICAgICAgICAgIGlmIChoaWRlVGltZW91dCkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbChoaWRlVGltZW91dCk7XG4gICAgICAgICAgICAgICAgaGlkZVRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25UaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRyYW5zaXRpb25UaW1lb3V0KTtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uVGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlVG9vbHRpcCgpIHtcbiAgICAgICAgICAgICAgLy8gVGhlcmUgY2FuIG9ubHkgYmUgb25lIHRvb2x0aXAgZWxlbWVudCBwZXIgZGlyZWN0aXZlIHNob3duIGF0IG9uY2UuXG4gICAgICAgICAgICAgIGlmICh0b29sdGlwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdG9vbHRpcExpbmtlZFNjb3BlID0gdHRTY29wZS4kbmV3KCk7XG4gICAgICAgICAgICAgIHRvb2x0aXAgPSB0b29sdGlwTGlua2VyKHRvb2x0aXBMaW5rZWRTY29wZSwgZnVuY3Rpb24odG9vbHRpcCkge1xuICAgICAgICAgICAgICAgIGlmIChhcHBlbmRUb0JvZHkpIHtcbiAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5maW5kKCdib2R5JykuYXBwZW5kKHRvb2x0aXApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50LmFmdGVyKHRvb2x0aXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcHJlcE9ic2VydmVycygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmVUb29sdGlwKCkge1xuICAgICAgICAgICAgICBjYW5jZWxTaG93KCk7XG4gICAgICAgICAgICAgIGNhbmNlbEhpZGUoKTtcbiAgICAgICAgICAgICAgdW5yZWdpc3Rlck9ic2VydmVycygpO1xuXG4gICAgICAgICAgICAgIGlmICh0b29sdGlwKSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0b29sdGlwID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodG9vbHRpcExpbmtlZFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcExpbmtlZFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdG9vbHRpcExpbmtlZFNjb3BlID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNldCB0aGUgaW5pdGlhbCBzY29wZSB2YWx1ZXMuIE9uY2VcbiAgICAgICAgICAgICAqIHRoZSB0b29sdGlwIGlzIGNyZWF0ZWQsIHRoZSBvYnNlcnZlcnNcbiAgICAgICAgICAgICAqIHdpbGwgYmUgYWRkZWQgdG8ga2VlcCB0aGluZ3MgaW4gc3luYy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gcHJlcGFyZVRvb2x0aXAoKSB7XG4gICAgICAgICAgICAgIHR0U2NvcGUudGl0bGUgPSBhdHRyc1twcmVmaXggKyAnVGl0bGUnXTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRlbnRQYXJzZSkge1xuICAgICAgICAgICAgICAgIHR0U2NvcGUuY29udGVudCA9IGNvbnRlbnRQYXJzZShzY29wZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHRTY29wZS5jb250ZW50ID0gYXR0cnNbdHRUeXBlXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHR0U2NvcGUucG9wdXBDbGFzcyA9IGF0dHJzW3ByZWZpeCArICdDbGFzcyddO1xuICAgICAgICAgICAgICB0dFNjb3BlLnBsYWNlbWVudCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzW3ByZWZpeCArICdQbGFjZW1lbnQnXSkgPyBhdHRyc1twcmVmaXggKyAnUGxhY2VtZW50J10gOiBvcHRpb25zLnBsYWNlbWVudDtcblxuICAgICAgICAgICAgICB2YXIgZGVsYXkgPSBwYXJzZUludChhdHRyc1twcmVmaXggKyAnUG9wdXBEZWxheSddLCAxMCk7XG4gICAgICAgICAgICAgIHZhciBjbG9zZURlbGF5ID0gcGFyc2VJbnQoYXR0cnNbcHJlZml4ICsgJ1BvcHVwQ2xvc2VEZWxheSddLCAxMCk7XG4gICAgICAgICAgICAgIHR0U2NvcGUucG9wdXBEZWxheSA9ICFpc05hTihkZWxheSkgPyBkZWxheSA6IG9wdGlvbnMucG9wdXBEZWxheTtcbiAgICAgICAgICAgICAgdHRTY29wZS5wb3B1cENsb3NlRGVsYXkgPSAhaXNOYU4oY2xvc2VEZWxheSkgPyBjbG9zZURlbGF5IDogb3B0aW9ucy5wb3B1cENsb3NlRGVsYXk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFzc2lnbklzT3Blbihpc09wZW4pIHtcbiAgICAgICAgICAgICAgaWYgKGlzT3BlblBhcnNlICYmIGFuZ3VsYXIuaXNGdW5jdGlvbihpc09wZW5QYXJzZS5hc3NpZ24pKSB7XG4gICAgICAgICAgICAgICAgaXNPcGVuUGFyc2UuYXNzaWduKHNjb3BlLCBpc09wZW4pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHR0U2NvcGUuY29udGVudEV4cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gdHRTY29wZS5jb250ZW50O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBPYnNlcnZlIHRoZSByZWxldmFudCBhdHRyaWJ1dGVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZGlzYWJsZWQnLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgIGNhbmNlbFNob3coKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh2YWwgJiYgdHRTY29wZS5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICBoaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaXNPcGVuUGFyc2UpIHtcbiAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGlzT3BlblBhcnNlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAodHRTY29wZSAmJiAhdmFsID09PSB0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgdG9nZ2xlVG9vbHRpcEJpbmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBwcmVwT2JzZXJ2ZXJzKCkge1xuICAgICAgICAgICAgICBvYnNlcnZlcnMubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgICBpZiAoY29udGVudFBhcnNlKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnB1c2goXG4gICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goY29udGVudFBhcnNlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdHRTY29wZS5jb250ZW50ID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbCAmJiB0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgIGhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnB1c2goXG4gICAgICAgICAgICAgICAgICB0b29sdGlwTGlua2VkU2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcG9zaXRpb25TY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXBvc2l0aW9uU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwTGlua2VkU2NvcGUuJCRwb3N0RGlnZXN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3NpdGlvblNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR0U2NvcGUgJiYgdHRTY29wZS5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub29sdGlwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMucHVzaChcbiAgICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKHR0VHlwZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHR0U2NvcGUuY29udGVudCA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWwgJiYgdHRTY29wZS5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub29sdGlwKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG9ic2VydmVycy5wdXNoKFxuICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKHByZWZpeCArICdUaXRsZScsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgICAgdHRTY29wZS50aXRsZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgIGlmICh0dFNjb3BlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIG9ic2VydmVycy5wdXNoKFxuICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKHByZWZpeCArICdQbGFjZW1lbnQnLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgIHR0U2NvcGUucGxhY2VtZW50ID0gdmFsID8gdmFsIDogb3B0aW9ucy5wbGFjZW1lbnQ7XG4gICAgICAgICAgICAgICAgICBpZiAodHRTY29wZS5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub29sdGlwKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdW5yZWdpc3Rlck9ic2VydmVycygpIHtcbiAgICAgICAgICAgICAgaWYgKG9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gob2JzZXJ2ZXJzLCBmdW5jdGlvbihvYnNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBoaWRlIHRvb2x0aXBzL3BvcG92ZXJzIGZvciBvdXRzaWRlQ2xpY2sgdHJpZ2dlclxuICAgICAgICAgICAgZnVuY3Rpb24gYm9keUhpZGVUb29sdGlwQmluZChlKSB7XG4gICAgICAgICAgICAgIGlmICghdHRTY29wZSB8fCAhdHRTY29wZS5pc09wZW4gfHwgIXRvb2x0aXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB0b29sdGlwL3BvcG92ZXIgbGluayBvciB0b29sIHRvb2x0aXAvcG9wb3ZlciBpdHNlbGYgd2VyZSBub3QgY2xpY2tlZFxuICAgICAgICAgICAgICBpZiAoIWVsZW1lbnRbMF0uY29udGFpbnMoZS50YXJnZXQpICYmICF0b29sdGlwWzBdLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIGhpZGVUb29sdGlwQmluZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1bnJlZ2lzdGVyVHJpZ2dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdHJpZ2dlcnMuc2hvdy5mb3JFYWNoKGZ1bmN0aW9uKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ291dHNpZGVDbGljaycpIHtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQub2ZmKCdjbGljaycsIHRvZ2dsZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZWxlbWVudC5vZmYodHJpZ2dlciwgc2hvd1Rvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQub2ZmKHRyaWdnZXIsIHRvZ2dsZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0cmlnZ2Vycy5oaWRlLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyID09PSAnb3V0c2lkZUNsaWNrJykge1xuICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBib2R5SGlkZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZWxlbWVudC5vZmYodHJpZ2dlciwgaGlkZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gcHJlcFRyaWdnZXJzKCkge1xuICAgICAgICAgICAgICB2YXIgdmFsID0gYXR0cnNbcHJlZml4ICsgJ1RyaWdnZXInXTtcbiAgICAgICAgICAgICAgdW5yZWdpc3RlclRyaWdnZXJzKCk7XG5cbiAgICAgICAgICAgICAgdHJpZ2dlcnMgPSBnZXRUcmlnZ2Vycyh2YWwpO1xuXG4gICAgICAgICAgICAgIGlmICh0cmlnZ2Vycy5zaG93ICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICB0cmlnZ2Vycy5zaG93LmZvckVhY2goZnVuY3Rpb24odHJpZ2dlciwgaWR4KSB7XG4gICAgICAgICAgICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ291dHNpZGVDbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCB0b2dnbGVUb29sdGlwQmluZCk7XG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbignY2xpY2snLCBib2R5SGlkZVRvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciA9PT0gdHJpZ2dlcnMuaGlkZVtpZHhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24odHJpZ2dlciwgdG9nZ2xlVG9vbHRpcEJpbmQpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24odHJpZ2dlciwgc2hvd1Rvb2x0aXBCaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbih0cmlnZ2Vycy5oaWRlW2lkeF0sIGhpZGVUb29sdGlwQmluZCk7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2tleXByZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgICBoaWRlVG9vbHRpcEJpbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJlcFRyaWdnZXJzKCk7XG5cbiAgICAgICAgICAgIHZhciBhbmltYXRpb24gPSBzY29wZS4kZXZhbChhdHRyc1twcmVmaXggKyAnQW5pbWF0aW9uJ10pO1xuICAgICAgICAgICAgdHRTY29wZS5hbmltYXRpb24gPSBhbmd1bGFyLmlzRGVmaW5lZChhbmltYXRpb24pID8gISFhbmltYXRpb24gOiBvcHRpb25zLmFuaW1hdGlvbjtcblxuICAgICAgICAgICAgdmFyIGFwcGVuZFRvQm9keVZhbDtcbiAgICAgICAgICAgIHZhciBhcHBlbmRLZXkgPSBwcmVmaXggKyAnQXBwZW5kVG9Cb2R5JztcbiAgICAgICAgICAgIGlmIChhcHBlbmRLZXkgaW4gYXR0cnMgJiYgYXR0cnNbYXBwZW5kS2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGFwcGVuZFRvQm9keVZhbCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhcHBlbmRUb0JvZHlWYWwgPSBzY29wZS4kZXZhbChhdHRyc1thcHBlbmRLZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBwZW5kVG9Cb2R5ID0gYW5ndWxhci5pc0RlZmluZWQoYXBwZW5kVG9Cb2R5VmFsKSA/IGFwcGVuZFRvQm9keVZhbCA6IGFwcGVuZFRvQm9keTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRvb2x0aXAgaXMgZGVzdHJveWVkIGFuZCByZW1vdmVkLlxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uIG9uRGVzdHJveVRvb2x0aXAoKSB7XG4gICAgICAgICAgICAgIHVucmVnaXN0ZXJUcmlnZ2VycygpO1xuICAgICAgICAgICAgICByZW1vdmVUb29sdGlwKCk7XG4gICAgICAgICAgICAgIG9wZW5lZFRvb2x0aXBzLnJlbW92ZSh0dFNjb3BlKTtcbiAgICAgICAgICAgICAgdHRTY29wZSA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gIH1dO1xufSlcblxuLy8gVGhpcyBpcyBtb3N0bHkgbmdJbmNsdWRlIGNvZGUgYnV0IHdpdGggYSBjdXN0b20gc2NvcGVcbi5kaXJlY3RpdmUoJ3VpYlRvb2x0aXBUZW1wbGF0ZVRyYW5zY2x1ZGUnLCBbXG4gICAgICAgICAnJGFuaW1hdGUnLCAnJHNjZScsICckY29tcGlsZScsICckdGVtcGxhdGVSZXF1ZXN0JyxcbmZ1bmN0aW9uICgkYW5pbWF0ZSwgJHNjZSwgJGNvbXBpbGUsICR0ZW1wbGF0ZVJlcXVlc3QpIHtcbiAgcmV0dXJuIHtcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgIHZhciBvcmlnU2NvcGUgPSBzY29wZS4kZXZhbChhdHRycy50b29sdGlwVGVtcGxhdGVUcmFuc2NsdWRlU2NvcGUpO1xuXG4gICAgICB2YXIgY2hhbmdlQ291bnRlciA9IDAsXG4gICAgICAgIGN1cnJlbnRTY29wZSxcbiAgICAgICAgcHJldmlvdXNFbGVtZW50LFxuICAgICAgICBjdXJyZW50RWxlbWVudDtcblxuICAgICAgdmFyIGNsZWFudXBMYXN0SW5jbHVkZUNvbnRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHByZXZpb3VzRWxlbWVudCkge1xuICAgICAgICAgIHByZXZpb3VzRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgIGN1cnJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgIGN1cnJlbnRTY29wZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAkYW5pbWF0ZS5sZWF2ZShjdXJyZW50RWxlbWVudCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJldmlvdXNFbGVtZW50ID0gY3VycmVudEVsZW1lbnQ7XG4gICAgICAgICAgY3VycmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzY29wZS4kd2F0Y2goJHNjZS5wYXJzZUFzUmVzb3VyY2VVcmwoYXR0cnMudWliVG9vbHRpcFRlbXBsYXRlVHJhbnNjbHVkZSksIGZ1bmN0aW9uKHNyYykge1xuICAgICAgICB2YXIgdGhpc0NoYW5nZUlkID0gKytjaGFuZ2VDb3VudGVyO1xuXG4gICAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgICAvL3NldCB0aGUgMm5kIHBhcmFtIHRvIHRydWUgdG8gaWdub3JlIHRoZSB0ZW1wbGF0ZSByZXF1ZXN0IGVycm9yIHNvIHRoYXQgdGhlIGlubmVyXG4gICAgICAgICAgLy9jb250ZW50cyBhbmQgc2NvcGUgY2FuIGJlIGNsZWFuZWQgdXAuXG4gICAgICAgICAgJHRlbXBsYXRlUmVxdWVzdChzcmMsIHRydWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzQ2hhbmdlSWQgIT09IGNoYW5nZUNvdW50ZXIpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB2YXIgbmV3U2NvcGUgPSBvcmlnU2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gcmVzcG9uc2U7XG5cbiAgICAgICAgICAgIHZhciBjbG9uZSA9ICRjb21waWxlKHRlbXBsYXRlKShuZXdTY29wZSwgZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgY2xlYW51cExhc3RJbmNsdWRlQ29udGVudCgpO1xuICAgICAgICAgICAgICAkYW5pbWF0ZS5lbnRlcihjbG9uZSwgZWxlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gbmV3U2NvcGU7XG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGNsb25lO1xuXG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGVtaXQoJyRpbmNsdWRlQ29udGVudExvYWRlZCcsIHNyYyk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpc0NoYW5nZUlkID09PSBjaGFuZ2VDb3VudGVyKSB7XG4gICAgICAgICAgICAgIGNsZWFudXBMYXN0SW5jbHVkZUNvbnRlbnQoKTtcbiAgICAgICAgICAgICAgc2NvcGUuJGVtaXQoJyRpbmNsdWRlQ29udGVudEVycm9yJywgc3JjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzY29wZS4kZW1pdCgnJGluY2x1ZGVDb250ZW50UmVxdWVzdGVkJywgc3JjKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbGVhbnVwTGFzdEluY2x1ZGVDb250ZW50KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgY2xlYW51cExhc3RJbmNsdWRlQ29udGVudCk7XG4gICAgfVxuICB9O1xufV0pXG5cbi8qKlxuICogTm90ZSB0aGF0IGl0J3MgaW50ZW50aW9uYWwgdGhhdCB0aGVzZSBjbGFzc2VzIGFyZSAqbm90KiBhcHBsaWVkIHRocm91Z2ggJGFuaW1hdGUuXG4gKiBUaGV5IG11c3Qgbm90IGJlIGFuaW1hdGVkIGFzIHRoZXkncmUgZXhwZWN0ZWQgdG8gYmUgcHJlc2VudCBvbiB0aGUgdG9vbHRpcCBvblxuICogaW5pdGlhbGl6YXRpb24uXG4gKi9cbi5kaXJlY3RpdmUoJ3VpYlRvb2x0aXBDbGFzc2VzJywgWyckdWliUG9zaXRpb24nLCBmdW5jdGlvbigkdWliUG9zaXRpb24pIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgLy8gbmVlZCB0byBzZXQgdGhlIHByaW1hcnkgcG9zaXRpb24gc28gdGhlXG4gICAgICAvLyBhcnJvdyBoYXMgc3BhY2UgZHVyaW5nIHBvc2l0aW9uIG1lYXN1cmUuXG4gICAgICAvLyB0b29sdGlwLnBvc2l0aW9uVG9vbHRpcCgpXG4gICAgICBpZiAoc2NvcGUucGxhY2VtZW50KSB7XG4gICAgICAgIC8vIC8vIFRoZXJlIGFyZSBubyB0b3AtbGVmdCBldGMuLi4gY2xhc3Nlc1xuICAgICAgICAvLyAvLyBpbiBUV0JTLCBzbyB3ZSBuZWVkIHRoZSBwcmltYXJ5IHBvc2l0aW9uLlxuICAgICAgICB2YXIgcG9zaXRpb24gPSAkdWliUG9zaXRpb24ucGFyc2VQbGFjZW1lbnQoc2NvcGUucGxhY2VtZW50KTtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhwb3NpdGlvblswXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCd0b3AnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjb3BlLnBvcHVwQ2xhc3MpIHtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhzY29wZS5wb3B1cENsYXNzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjb3BlLmFuaW1hdGlvbigpKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoYXR0cnMudG9vbHRpcEFuaW1hdGlvbkNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XSlcblxuLmRpcmVjdGl2ZSgndWliVG9vbHRpcFBvcHVwJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZTogeyBjb250ZW50OiAnQCcsIHBsYWNlbWVudDogJ0AnLCBwb3B1cENsYXNzOiAnQCcsIGFuaW1hdGlvbjogJyYnLCBpc09wZW46ICcmJyB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3Rvb2x0aXAvdG9vbHRpcC1wb3B1cC5odG1sJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliVG9vbHRpcCcsIFsgJyR1aWJUb29sdGlwJywgZnVuY3Rpb24oJHVpYlRvb2x0aXApIHtcbiAgcmV0dXJuICR1aWJUb29sdGlwKCd1aWJUb29sdGlwJywgJ3Rvb2x0aXAnLCAnbW91c2VlbnRlcicpO1xufV0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRvb2x0aXBUZW1wbGF0ZVBvcHVwJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZTogeyBjb250ZW50RXhwOiAnJicsIHBsYWNlbWVudDogJ0AnLCBwb3B1cENsYXNzOiAnQCcsIGFuaW1hdGlvbjogJyYnLCBpc09wZW46ICcmJyxcbiAgICAgIG9yaWdpblNjb3BlOiAnJicgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS90b29sdGlwL3Rvb2x0aXAtdGVtcGxhdGUtcG9wdXAuaHRtbCdcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRvb2x0aXBUZW1wbGF0ZScsIFsnJHVpYlRvb2x0aXAnLCBmdW5jdGlvbigkdWliVG9vbHRpcCkge1xuICByZXR1cm4gJHVpYlRvb2x0aXAoJ3VpYlRvb2x0aXBUZW1wbGF0ZScsICd0b29sdGlwJywgJ21vdXNlZW50ZXInLCB7XG4gICAgdXNlQ29udGVudEV4cDogdHJ1ZVxuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJUb29sdGlwSHRtbFBvcHVwJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZTogeyBjb250ZW50RXhwOiAnJicsIHBsYWNlbWVudDogJ0AnLCBwb3B1cENsYXNzOiAnQCcsIGFuaW1hdGlvbjogJyYnLCBpc09wZW46ICcmJyB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3Rvb2x0aXAvdG9vbHRpcC1odG1sLXBvcHVwLmh0bWwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJUb29sdGlwSHRtbCcsIFsnJHVpYlRvb2x0aXAnLCBmdW5jdGlvbigkdWliVG9vbHRpcCkge1xuICByZXR1cm4gJHVpYlRvb2x0aXAoJ3VpYlRvb2x0aXBIdG1sJywgJ3Rvb2x0aXAnLCAnbW91c2VlbnRlcicsIHtcbiAgICB1c2VDb250ZW50RXhwOiB0cnVlXG4gIH0pO1xufV0pO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgZmVhdHVyZXMgYXJlIHN0aWxsIG91dHN0YW5kaW5nOiBwb3B1cCBkZWxheSwgYW5pbWF0aW9uIGFzIGFcbiAqIGZ1bmN0aW9uLCBwbGFjZW1lbnQgYXMgYSBmdW5jdGlvbiwgaW5zaWRlLCBzdXBwb3J0IGZvciBtb3JlIHRyaWdnZXJzIHRoYW5cbiAqIGp1c3QgbW91c2UgZW50ZXIvbGVhdmUsIGFuZCBzZWxlY3RvciBkZWxlZ2F0YXRpb24uXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAucG9wb3ZlcicsIFsndWkuYm9vdHN0cmFwLnRvb2x0aXAnXSlcblxuLmRpcmVjdGl2ZSgndWliUG9wb3ZlclRlbXBsYXRlUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7IHRpdGxlOiAnQCcsIGNvbnRlbnRFeHA6ICcmJywgcGxhY2VtZW50OiAnQCcsIHBvcHVwQ2xhc3M6ICdAJywgYW5pbWF0aW9uOiAnJicsIGlzT3BlbjogJyYnLFxuICAgICAgb3JpZ2luU2NvcGU6ICcmJyB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3BvcG92ZXIvcG9wb3Zlci10ZW1wbGF0ZS5odG1sJ1xuICB9O1xufSlcblxuLmRpcmVjdGl2ZSgndWliUG9wb3ZlclRlbXBsYXRlJywgWyckdWliVG9vbHRpcCcsIGZ1bmN0aW9uKCR1aWJUb29sdGlwKSB7XG4gIHJldHVybiAkdWliVG9vbHRpcCgndWliUG9wb3ZlclRlbXBsYXRlJywgJ3BvcG92ZXInLCAnY2xpY2snLCB7XG4gICAgdXNlQ29udGVudEV4cDogdHJ1ZVxuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJQb3BvdmVySHRtbFBvcHVwJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZTogeyBjb250ZW50RXhwOiAnJicsIHRpdGxlOiAnQCcsIHBsYWNlbWVudDogJ0AnLCBwb3B1cENsYXNzOiAnQCcsIGFuaW1hdGlvbjogJyYnLCBpc09wZW46ICcmJyB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3BvcG92ZXIvcG9wb3Zlci1odG1sLmh0bWwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJQb3BvdmVySHRtbCcsIFsnJHVpYlRvb2x0aXAnLCBmdW5jdGlvbigkdWliVG9vbHRpcCkge1xuICByZXR1cm4gJHVpYlRvb2x0aXAoJ3VpYlBvcG92ZXJIdG1sJywgJ3BvcG92ZXInLCAnY2xpY2snLCB7XG4gICAgdXNlQ29udGVudEV4cDogdHJ1ZVxuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJQb3BvdmVyUG9wdXAnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7IHRpdGxlOiAnQCcsIGNvbnRlbnQ6ICdAJywgcGxhY2VtZW50OiAnQCcsIHBvcHVwQ2xhc3M6ICdAJywgYW5pbWF0aW9uOiAnJicsIGlzT3BlbjogJyYnIH0sXG4gICAgdGVtcGxhdGVVcmw6ICd1aWIvdGVtcGxhdGUvcG9wb3Zlci9wb3BvdmVyLmh0bWwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJQb3BvdmVyJywgWyckdWliVG9vbHRpcCcsIGZ1bmN0aW9uKCR1aWJUb29sdGlwKSB7XG4gIHJldHVybiAkdWliVG9vbHRpcCgndWliUG9wb3ZlcicsICdwb3BvdmVyJywgJ2NsaWNrJyk7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAucHJvZ3Jlc3NiYXInLCBbXSlcblxuLmNvbnN0YW50KCd1aWJQcm9ncmVzc0NvbmZpZycsIHtcbiAgYW5pbWF0ZTogdHJ1ZSxcbiAgbWF4OiAxMDBcbn0pXG5cbi5jb250cm9sbGVyKCdVaWJQcm9ncmVzc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAndWliUHJvZ3Jlc3NDb25maWcnLCBmdW5jdGlvbigkc2NvcGUsICRhdHRycywgcHJvZ3Jlc3NDb25maWcpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgYW5pbWF0ZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5hbmltYXRlKSA/ICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5hbmltYXRlKSA6IHByb2dyZXNzQ29uZmlnLmFuaW1hdGU7XG5cbiAgdGhpcy5iYXJzID0gW107XG4gICRzY29wZS5tYXggPSBhbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUubWF4KSA/ICRzY29wZS5tYXggOiBwcm9ncmVzc0NvbmZpZy5tYXg7XG5cbiAgdGhpcy5hZGRCYXIgPSBmdW5jdGlvbihiYXIsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgaWYgKCFhbmltYXRlKSB7XG4gICAgICBlbGVtZW50LmNzcyh7J3RyYW5zaXRpb24nOiAnbm9uZSd9KTtcbiAgICB9XG5cbiAgICB0aGlzLmJhcnMucHVzaChiYXIpO1xuXG4gICAgYmFyLm1heCA9ICRzY29wZS5tYXg7XG4gICAgYmFyLnRpdGxlID0gYXR0cnMgJiYgYW5ndWxhci5pc0RlZmluZWQoYXR0cnMudGl0bGUpID8gYXR0cnMudGl0bGUgOiAncHJvZ3Jlc3NiYXInO1xuXG4gICAgYmFyLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgYmFyLnJlY2FsY3VsYXRlUGVyY2VudGFnZSgpO1xuICAgIH0pO1xuXG4gICAgYmFyLnJlY2FsY3VsYXRlUGVyY2VudGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRvdGFsUGVyY2VudGFnZSA9IHNlbGYuYmFycy5yZWR1Y2UoZnVuY3Rpb24odG90YWwsIGJhcikge1xuICAgICAgICBiYXIucGVyY2VudCA9ICsoMTAwICogYmFyLnZhbHVlIC8gYmFyLm1heCkudG9GaXhlZCgyKTtcbiAgICAgICAgcmV0dXJuIHRvdGFsICsgYmFyLnBlcmNlbnQ7XG4gICAgICB9LCAwKTtcblxuICAgICAgaWYgKHRvdGFsUGVyY2VudGFnZSA+IDEwMCkge1xuICAgICAgICBiYXIucGVyY2VudCAtPSB0b3RhbFBlcmNlbnRhZ2UgLSAxMDA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGJhci4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgIHNlbGYucmVtb3ZlQmFyKGJhcik7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW1vdmVCYXIgPSBmdW5jdGlvbihiYXIpIHtcbiAgICB0aGlzLmJhcnMuc3BsaWNlKHRoaXMuYmFycy5pbmRleE9mKGJhciksIDEpO1xuICAgIHRoaXMuYmFycy5mb3JFYWNoKGZ1bmN0aW9uIChiYXIpIHtcbiAgICAgIGJhci5yZWNhbGN1bGF0ZVBlcmNlbnRhZ2UoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuJHdhdGNoKCdtYXgnLCBmdW5jdGlvbihtYXgpIHtcbiAgICBzZWxmLmJhcnMuZm9yRWFjaChmdW5jdGlvbihiYXIpIHtcbiAgICAgIGJhci5tYXggPSAkc2NvcGUubWF4O1xuICAgICAgYmFyLnJlY2FsY3VsYXRlUGVyY2VudGFnZSgpO1xuICAgIH0pO1xuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJQcm9ncmVzcycsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICBjb250cm9sbGVyOiAnVWliUHJvZ3Jlc3NDb250cm9sbGVyJyxcbiAgICByZXF1aXJlOiAndWliUHJvZ3Jlc3MnLFxuICAgIHNjb3BlOiB7XG4gICAgICBtYXg6ICc9PydcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3Byb2dyZXNzYmFyL3Byb2dyZXNzLmh0bWwnXG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJCYXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgcmVxdWlyZTogJ151aWJQcm9ncmVzcycsXG4gICAgc2NvcGU6IHtcbiAgICAgIHZhbHVlOiAnPScsXG4gICAgICB0eXBlOiAnQCdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3Byb2dyZXNzYmFyL2Jhci5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHByb2dyZXNzQ3RybCkge1xuICAgICAgcHJvZ3Jlc3NDdHJsLmFkZEJhcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlByb2dyZXNzYmFyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIGNvbnRyb2xsZXI6ICdVaWJQcm9ncmVzc0NvbnRyb2xsZXInLFxuICAgIHNjb3BlOiB7XG4gICAgICB2YWx1ZTogJz0nLFxuICAgICAgbWF4OiAnPT8nLFxuICAgICAgdHlwZTogJ0AnXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS9wcm9ncmVzc2Jhci9wcm9ncmVzc2Jhci5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHByb2dyZXNzQ3RybCkge1xuICAgICAgcHJvZ3Jlc3NDdHJsLmFkZEJhcihzY29wZSwgYW5ndWxhci5lbGVtZW50KGVsZW1lbnQuY2hpbGRyZW4oKVswXSksIHt0aXRsZTogYXR0cnMudGl0bGV9KTtcbiAgICB9XG4gIH07XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5yYXRpbmcnLCBbXSlcblxuLmNvbnN0YW50KCd1aWJSYXRpbmdDb25maWcnLCB7XG4gIG1heDogNSxcbiAgc3RhdGVPbjogbnVsbCxcbiAgc3RhdGVPZmY6IG51bGwsXG4gIHRpdGxlcyA6IFsnb25lJywgJ3R3bycsICd0aHJlZScsICdmb3VyJywgJ2ZpdmUnXVxufSlcblxuLmNvbnRyb2xsZXIoJ1VpYlJhdGluZ0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAndWliUmF0aW5nQ29uZmlnJywgZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMsIHJhdGluZ0NvbmZpZykge1xuICB2YXIgbmdNb2RlbEN0cmwgPSB7ICRzZXRWaWV3VmFsdWU6IGFuZ3VsYXIubm9vcCB9O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKG5nTW9kZWxDdHJsXykge1xuICAgIG5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmxfO1xuICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSB0aGlzLnJlbmRlcjtcblxuICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA8PCAwICE9PSB2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IE1hdGgucm91bmQodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXRlT24gPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuc3RhdGVPbikgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMuc3RhdGVPbikgOiByYXRpbmdDb25maWcuc3RhdGVPbjtcbiAgICB0aGlzLnN0YXRlT2ZmID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLnN0YXRlT2ZmKSA/ICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5zdGF0ZU9mZikgOiByYXRpbmdDb25maWcuc3RhdGVPZmY7XG4gICAgdmFyIHRtcFRpdGxlcyA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy50aXRsZXMpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnRpdGxlcykgOiByYXRpbmdDb25maWcudGl0bGVzIDtcbiAgICB0aGlzLnRpdGxlcyA9IGFuZ3VsYXIuaXNBcnJheSh0bXBUaXRsZXMpICYmIHRtcFRpdGxlcy5sZW5ndGggPiAwID9cbiAgICAgIHRtcFRpdGxlcyA6IHJhdGluZ0NvbmZpZy50aXRsZXM7XG5cbiAgICB2YXIgcmF0aW5nU3RhdGVzID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLnJhdGluZ1N0YXRlcykgP1xuICAgICAgJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnJhdGluZ1N0YXRlcykgOlxuICAgICAgbmV3IEFycmF5KGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5tYXgpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLm1heCkgOiByYXRpbmdDb25maWcubWF4KTtcbiAgICAkc2NvcGUucmFuZ2UgPSB0aGlzLmJ1aWxkVGVtcGxhdGVPYmplY3RzKHJhdGluZ1N0YXRlcyk7XG4gIH07XG5cbiAgdGhpcy5idWlsZFRlbXBsYXRlT2JqZWN0cyA9IGZ1bmN0aW9uKHN0YXRlcykge1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gc3RhdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgc3RhdGVzW2ldID0gYW5ndWxhci5leHRlbmQoeyBpbmRleDogaSB9LCB7IHN0YXRlT246IHRoaXMuc3RhdGVPbiwgc3RhdGVPZmY6IHRoaXMuc3RhdGVPZmYsIHRpdGxlOiB0aGlzLmdldFRpdGxlKGkpIH0sIHN0YXRlc1tpXSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZXM7XG4gIH07XG5cbiAgdGhpcy5nZXRUaXRsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID49IHRoaXMudGl0bGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGluZGV4ICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50aXRsZXNbaW5kZXhdO1xuICB9O1xuXG4gICRzY29wZS5yYXRlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAoISRzY29wZS5yZWFkb25seSAmJiB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9ICRzY29wZS5yYW5nZS5sZW5ndGgpIHtcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSA9PT0gdmFsdWUgPyAwIDogdmFsdWUpO1xuICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZW50ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICghJHNjb3BlLnJlYWRvbmx5KSB7XG4gICAgICAkc2NvcGUudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgJHNjb3BlLm9uSG92ZXIoe3ZhbHVlOiB2YWx1ZX0pO1xuICB9O1xuXG4gICRzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS52YWx1ZSA9IG5nTW9kZWxDdHJsLiR2aWV3VmFsdWU7XG4gICAgJHNjb3BlLm9uTGVhdmUoKTtcbiAgfTtcblxuICAkc2NvcGUub25LZXlkb3duID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKC8oMzd8Mzh8Mzl8NDApLy50ZXN0KGV2dC53aGljaCkpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgJHNjb3BlLnJhdGUoJHNjb3BlLnZhbHVlICsgKGV2dC53aGljaCA9PT0gMzggfHwgZXZ0LndoaWNoID09PSAzOSA/IDEgOiAtMSkpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS52YWx1ZSA9IG5nTW9kZWxDdHJsLiR2aWV3VmFsdWU7XG4gIH07XG59XSlcblxuLmRpcmVjdGl2ZSgndWliUmF0aW5nJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVxdWlyZTogWyd1aWJSYXRpbmcnLCAnbmdNb2RlbCddLFxuICAgIHNjb3BlOiB7XG4gICAgICByZWFkb25seTogJz0/JyxcbiAgICAgIG9uSG92ZXI6ICcmJyxcbiAgICAgIG9uTGVhdmU6ICcmJ1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogJ1VpYlJhdGluZ0NvbnRyb2xsZXInLFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3JhdGluZy9yYXRpbmcuaHRtbCcsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgcmF0aW5nQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuICAgICAgcmF0aW5nQ3RybC5pbml0KG5nTW9kZWxDdHJsKTtcbiAgICB9XG4gIH07XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC50YWJzJywgW10pXG5cbi5jb250cm9sbGVyKCdVaWJUYWJzZXRDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gIHZhciBjdHJsID0gdGhpcyxcbiAgICAgIHRhYnMgPSBjdHJsLnRhYnMgPSAkc2NvcGUudGFicyA9IFtdO1xuXG4gIGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0ZWRUYWIpIHtcbiAgICBhbmd1bGFyLmZvckVhY2godGFicywgZnVuY3Rpb24odGFiKSB7XG4gICAgICBpZiAodGFiLmFjdGl2ZSAmJiB0YWIgIT09IHNlbGVjdGVkVGFiKSB7XG4gICAgICAgIHRhYi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGFiLm9uRGVzZWxlY3QoKTtcbiAgICAgICAgc2VsZWN0ZWRUYWIuc2VsZWN0Q2FsbGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc2VsZWN0ZWRUYWIuYWN0aXZlID0gdHJ1ZTtcbiAgICAvLyBvbmx5IGNhbGwgc2VsZWN0IGlmIGl0IGhhcyBub3QgYWxyZWFkeSBiZWVuIGNhbGxlZFxuICAgIGlmICghc2VsZWN0ZWRUYWIuc2VsZWN0Q2FsbGVkKSB7XG4gICAgICBzZWxlY3RlZFRhYi5vblNlbGVjdCgpO1xuICAgICAgc2VsZWN0ZWRUYWIuc2VsZWN0Q2FsbGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY3RybC5hZGRUYWIgPSBmdW5jdGlvbiBhZGRUYWIodGFiKSB7XG4gICAgdGFicy5wdXNoKHRhYik7XG4gICAgLy8gd2UgY2FuJ3QgcnVuIHRoZSBzZWxlY3QgZnVuY3Rpb24gb24gdGhlIGZpcnN0IHRhYlxuICAgIC8vIHNpbmNlIHRoYXQgd291bGQgc2VsZWN0IGl0IHR3aWNlXG4gICAgaWYgKHRhYnMubGVuZ3RoID09PSAxICYmIHRhYi5hY3RpdmUgIT09IGZhbHNlKSB7XG4gICAgICB0YWIuYWN0aXZlID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRhYi5hY3RpdmUpIHtcbiAgICAgIGN0cmwuc2VsZWN0KHRhYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhYi5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgY3RybC5yZW1vdmVUYWIgPSBmdW5jdGlvbiByZW1vdmVUYWIodGFiKSB7XG4gICAgdmFyIGluZGV4ID0gdGFicy5pbmRleE9mKHRhYik7XG4gICAgLy9TZWxlY3QgYSBuZXcgdGFiIGlmIHRoZSB0YWIgdG8gYmUgcmVtb3ZlZCBpcyBzZWxlY3RlZCBhbmQgbm90IGRlc3Ryb3llZFxuICAgIGlmICh0YWIuYWN0aXZlICYmIHRhYnMubGVuZ3RoID4gMSAmJiAhZGVzdHJveWVkKSB7XG4gICAgICAvL0lmIHRoaXMgaXMgdGhlIGxhc3QgdGFiLCBzZWxlY3QgdGhlIHByZXZpb3VzIHRhYi4gZWxzZSwgdGhlIG5leHQgdGFiLlxuICAgICAgdmFyIG5ld0FjdGl2ZUluZGV4ID0gaW5kZXggPT09IHRhYnMubGVuZ3RoIC0gMSA/IGluZGV4IC0gMSA6IGluZGV4ICsgMTtcbiAgICAgIGN0cmwuc2VsZWN0KHRhYnNbbmV3QWN0aXZlSW5kZXhdKTtcbiAgICB9XG4gICAgdGFicy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9O1xuXG4gIHZhciBkZXN0cm95ZWQ7XG4gICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgfSk7XG59XSlcblxuLmRpcmVjdGl2ZSgndWliVGFic2V0JywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICB0eXBlOiAnQCdcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6ICdVaWJUYWJzZXRDb250cm9sbGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS90YWJzL3RhYnNldC5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHNjb3BlLnZlcnRpY2FsID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMudmVydGljYWwpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy52ZXJ0aWNhbCkgOiBmYWxzZTtcbiAgICAgIHNjb3BlLmp1c3RpZmllZCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmp1c3RpZmllZCkgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmp1c3RpZmllZCkgOiBmYWxzZTtcbiAgICB9XG4gIH07XG59KVxuXG4uZGlyZWN0aXZlKCd1aWJUYWInLCBbJyRwYXJzZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6ICdedWliVGFic2V0JyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAndWliL3RlbXBsYXRlL3RhYnMvdGFiLmh0bWwnLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFjdGl2ZTogJz0/JyxcbiAgICAgIGhlYWRpbmc6ICdAJyxcbiAgICAgIG9uU2VsZWN0OiAnJnNlbGVjdCcsIC8vVGhpcyBjYWxsYmFjayBpcyBjYWxsZWQgaW4gY29udGVudEhlYWRpbmdUcmFuc2NsdWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vb25jZSBpdCBpbnNlcnRzIHRoZSB0YWIncyBjb250ZW50IGludG8gdGhlIGRvbVxuICAgICAgb25EZXNlbGVjdDogJyZkZXNlbGVjdCdcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgLy9FbXB0eSBjb250cm9sbGVyIHNvIG90aGVyIGRpcmVjdGl2ZXMgY2FuIHJlcXVpcmUgYmVpbmcgJ3VuZGVyJyBhIHRhYlxuICAgIH0sXG4gICAgY29udHJvbGxlckFzOiAndGFiJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycywgdGFic2V0Q3RybCwgdHJhbnNjbHVkZSkge1xuICAgICAgc2NvcGUuJHdhdGNoKCdhY3RpdmUnLCBmdW5jdGlvbihhY3RpdmUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgIHRhYnNldEN0cmwuc2VsZWN0KHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBpZiAoYXR0cnMuZGlzYWJsZSkge1xuICAgICAgICBzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoYXR0cnMuZGlzYWJsZSksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgc2NvcGUuZGlzYWJsZWQgPSAhISB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXNjb3BlLmRpc2FibGVkKSB7XG4gICAgICAgICAgc2NvcGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGFic2V0Q3RybC5hZGRUYWIoc2NvcGUpO1xuICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0YWJzZXRDdHJsLnJlbW92ZVRhYihzY29wZSk7XG4gICAgICB9KTtcblxuICAgICAgLy9XZSBuZWVkIHRvIHRyYW5zY2x1ZGUgbGF0ZXIsIG9uY2UgdGhlIGNvbnRlbnQgY29udGFpbmVyIGlzIHJlYWR5LlxuICAgICAgLy93aGVuIHRoaXMgbGluayBoYXBwZW5zLCB3ZSdyZSBpbnNpZGUgYSB0YWIgaGVhZGluZy5cbiAgICAgIHNjb3BlLiR0cmFuc2NsdWRlRm4gPSB0cmFuc2NsdWRlO1xuICAgIH1cbiAgfTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJUYWJIZWFkaW5nVHJhbnNjbHVkZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVxdWlyZTogJ151aWJUYWInLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0pIHtcbiAgICAgIHNjb3BlLiR3YXRjaCgnaGVhZGluZ0VsZW1lbnQnLCBmdW5jdGlvbiB1cGRhdGVIZWFkaW5nRWxlbWVudChoZWFkaW5nKSB7XG4gICAgICAgIGlmIChoZWFkaW5nKSB7XG4gICAgICAgICAgZWxtLmh0bWwoJycpO1xuICAgICAgICAgIGVsbS5hcHBlbmQoaGVhZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ3VpYlRhYkNvbnRlbnRUcmFuc2NsdWRlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiAnXnVpYlRhYnNldCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMpIHtcbiAgICAgIHZhciB0YWIgPSBzY29wZS4kZXZhbChhdHRycy51aWJUYWJDb250ZW50VHJhbnNjbHVkZSk7XG5cbiAgICAgIC8vTm93IG91ciB0YWIgaXMgcmVhZHkgdG8gYmUgdHJhbnNjbHVkZWQ6IGJvdGggdGhlIHRhYiBoZWFkaW5nIGFyZWFcbiAgICAgIC8vYW5kIHRoZSB0YWIgY29udGVudCBhcmVhIGFyZSBsb2FkZWQuICBUcmFuc2NsdWRlICdlbSBib3RoLlxuICAgICAgdGFiLiR0cmFuc2NsdWRlRm4odGFiLiRwYXJlbnQsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChjb250ZW50cywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIGlmIChpc1RhYkhlYWRpbmcobm9kZSkpIHtcbiAgICAgICAgICAgIC8vTGV0IHRhYkhlYWRpbmdUcmFuc2NsdWRlIGtub3cuXG4gICAgICAgICAgICB0YWIuaGVhZGluZ0VsZW1lbnQgPSBub2RlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbG0uYXBwZW5kKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNUYWJIZWFkaW5nKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS50YWdOYW1lICYmIChcbiAgICAgIG5vZGUuaGFzQXR0cmlidXRlKCd1aWItdGFiLWhlYWRpbmcnKSB8fFxuICAgICAgbm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdWliLXRhYi1oZWFkaW5nJykgfHxcbiAgICAgIG5vZGUuaGFzQXR0cmlidXRlKCd4LXVpYi10YWItaGVhZGluZycpIHx8XG4gICAgICBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3VpYi10YWItaGVhZGluZycgfHxcbiAgICAgIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGF0YS11aWItdGFiLWhlYWRpbmcnIHx8XG4gICAgICBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3gtdWliLXRhYi1oZWFkaW5nJ1xuICAgICk7XG4gIH1cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnRpbWVwaWNrZXInLCBbXSlcblxuLmNvbnN0YW50KCd1aWJUaW1lcGlja2VyQ29uZmlnJywge1xuICBob3VyU3RlcDogMSxcbiAgbWludXRlU3RlcDogMSxcbiAgc2Vjb25kU3RlcDogMSxcbiAgc2hvd01lcmlkaWFuOiB0cnVlLFxuICBzaG93U2Vjb25kczogZmFsc2UsXG4gIG1lcmlkaWFuczogbnVsbCxcbiAgcmVhZG9ubHlJbnB1dDogZmFsc2UsXG4gIG1vdXNld2hlZWw6IHRydWUsXG4gIGFycm93a2V5czogdHJ1ZSxcbiAgc2hvd1NwaW5uZXJzOiB0cnVlLFxuICB0ZW1wbGF0ZVVybDogJ3VpYi90ZW1wbGF0ZS90aW1lcGlja2VyL3RpbWVwaWNrZXIuaHRtbCdcbn0pXG5cbi5jb250cm9sbGVyKCdVaWJUaW1lcGlja2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICckcGFyc2UnLCAnJGxvZycsICckbG9jYWxlJywgJ3VpYlRpbWVwaWNrZXJDb25maWcnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRwYXJzZSwgJGxvZywgJGxvY2FsZSwgdGltZXBpY2tlckNvbmZpZykge1xuICB2YXIgc2VsZWN0ZWQgPSBuZXcgRGF0ZSgpLFxuICAgIHdhdGNoZXJzID0gW10sXG4gICAgbmdNb2RlbEN0cmwgPSB7ICRzZXRWaWV3VmFsdWU6IGFuZ3VsYXIubm9vcCB9LCAvLyBudWxsTW9kZWxDdHJsXG4gICAgbWVyaWRpYW5zID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLm1lcmlkaWFucykgPyAkc2NvcGUuJHBhcmVudC4kZXZhbCgkYXR0cnMubWVyaWRpYW5zKSA6IHRpbWVwaWNrZXJDb25maWcubWVyaWRpYW5zIHx8ICRsb2NhbGUuREFURVRJTUVfRk9STUFUUy5BTVBNUztcblxuICAkc2NvcGUudGFiaW5kZXggPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMudGFiaW5kZXgpID8gJGF0dHJzLnRhYmluZGV4IDogMDtcbiAgJGVsZW1lbnQucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbihuZ01vZGVsQ3RybF8sIGlucHV0cykge1xuICAgIG5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmxfO1xuICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSB0aGlzLnJlbmRlcjtcblxuICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZnVuY3Rpb24obW9kZWxWYWx1ZSkge1xuICAgICAgcmV0dXJuIG1vZGVsVmFsdWUgPyBuZXcgRGF0ZShtb2RlbFZhbHVlKSA6IG51bGw7XG4gICAgfSk7XG5cbiAgICB2YXIgaG91cnNJbnB1dEVsID0gaW5wdXRzLmVxKDApLFxuICAgICAgICBtaW51dGVzSW5wdXRFbCA9IGlucHV0cy5lcSgxKSxcbiAgICAgICAgc2Vjb25kc0lucHV0RWwgPSBpbnB1dHMuZXEoMik7XG5cbiAgICB2YXIgbW91c2V3aGVlbCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5tb3VzZXdoZWVsKSA/ICRzY29wZS4kcGFyZW50LiRldmFsKCRhdHRycy5tb3VzZXdoZWVsKSA6IHRpbWVwaWNrZXJDb25maWcubW91c2V3aGVlbDtcblxuICAgIGlmIChtb3VzZXdoZWVsKSB7XG4gICAgICB0aGlzLnNldHVwTW91c2V3aGVlbEV2ZW50cyhob3Vyc0lucHV0RWwsIG1pbnV0ZXNJbnB1dEVsLCBzZWNvbmRzSW5wdXRFbCk7XG4gICAgfVxuXG4gICAgdmFyIGFycm93a2V5cyA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5hcnJvd2tleXMpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLmFycm93a2V5cykgOiB0aW1lcGlja2VyQ29uZmlnLmFycm93a2V5cztcbiAgICBpZiAoYXJyb3drZXlzKSB7XG4gICAgICB0aGlzLnNldHVwQXJyb3drZXlFdmVudHMoaG91cnNJbnB1dEVsLCBtaW51dGVzSW5wdXRFbCwgc2Vjb25kc0lucHV0RWwpO1xuICAgIH1cblxuICAgICRzY29wZS5yZWFkb25seUlucHV0ID0gYW5ndWxhci5pc0RlZmluZWQoJGF0dHJzLnJlYWRvbmx5SW5wdXQpID8gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnJlYWRvbmx5SW5wdXQpIDogdGltZXBpY2tlckNvbmZpZy5yZWFkb25seUlucHV0O1xuICAgIHRoaXMuc2V0dXBJbnB1dEV2ZW50cyhob3Vyc0lucHV0RWwsIG1pbnV0ZXNJbnB1dEVsLCBzZWNvbmRzSW5wdXRFbCk7XG4gIH07XG5cbiAgdmFyIGhvdXJTdGVwID0gdGltZXBpY2tlckNvbmZpZy5ob3VyU3RlcDtcbiAgaWYgKCRhdHRycy5ob3VyU3RlcCkge1xuICAgIHdhdGNoZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZSgkYXR0cnMuaG91clN0ZXApLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaG91clN0ZXAgPSArdmFsdWU7XG4gICAgfSkpO1xuICB9XG5cbiAgdmFyIG1pbnV0ZVN0ZXAgPSB0aW1lcGlja2VyQ29uZmlnLm1pbnV0ZVN0ZXA7XG4gIGlmICgkYXR0cnMubWludXRlU3RlcCkge1xuICAgIHdhdGNoZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZSgkYXR0cnMubWludXRlU3RlcCksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBtaW51dGVTdGVwID0gK3ZhbHVlO1xuICAgIH0pKTtcbiAgfVxuXG4gIHZhciBtaW47XG4gIHdhdGNoZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZSgkYXR0cnMubWluKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgZHQgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgbWluID0gaXNOYU4oZHQpID8gdW5kZWZpbmVkIDogZHQ7XG4gIH0pKTtcblxuICB2YXIgbWF4O1xuICB3YXRjaGVycy5wdXNoKCRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLm1heCksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGR0ID0gbmV3IERhdGUodmFsdWUpO1xuICAgIG1heCA9IGlzTmFOKGR0KSA/IHVuZGVmaW5lZCA6IGR0O1xuICB9KSk7XG5cbiAgdmFyIGRpc2FibGVkID0gZmFsc2U7XG4gIGlmICgkYXR0cnMubmdEaXNhYmxlZCkge1xuICAgIHdhdGNoZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZSgkYXR0cnMubmdEaXNhYmxlZCksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBkaXNhYmxlZCA9IHZhbHVlO1xuICAgIH0pKTtcbiAgfVxuXG4gICRzY29wZS5ub0luY3JlbWVudEhvdXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluY3JlbWVudGVkU2VsZWN0ZWQgPSBhZGRNaW51dGVzKHNlbGVjdGVkLCBob3VyU3RlcCAqIDYwKTtcbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgaW5jcmVtZW50ZWRTZWxlY3RlZCA+IG1heCB8fFxuICAgICAgaW5jcmVtZW50ZWRTZWxlY3RlZCA8IHNlbGVjdGVkICYmIGluY3JlbWVudGVkU2VsZWN0ZWQgPCBtaW47XG4gIH07XG5cbiAgJHNjb3BlLm5vRGVjcmVtZW50SG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVjcmVtZW50ZWRTZWxlY3RlZCA9IGFkZE1pbnV0ZXMoc2VsZWN0ZWQsIC1ob3VyU3RlcCAqIDYwKTtcbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgZGVjcmVtZW50ZWRTZWxlY3RlZCA8IG1pbiB8fFxuICAgICAgZGVjcmVtZW50ZWRTZWxlY3RlZCA+IHNlbGVjdGVkICYmIGRlY3JlbWVudGVkU2VsZWN0ZWQgPiBtYXg7XG4gIH07XG5cbiAgJHNjb3BlLm5vSW5jcmVtZW50TWludXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmNyZW1lbnRlZFNlbGVjdGVkID0gYWRkTWludXRlcyhzZWxlY3RlZCwgbWludXRlU3RlcCk7XG4gICAgcmV0dXJuIGRpc2FibGVkIHx8IGluY3JlbWVudGVkU2VsZWN0ZWQgPiBtYXggfHxcbiAgICAgIGluY3JlbWVudGVkU2VsZWN0ZWQgPCBzZWxlY3RlZCAmJiBpbmNyZW1lbnRlZFNlbGVjdGVkIDwgbWluO1xuICB9O1xuXG4gICRzY29wZS5ub0RlY3JlbWVudE1pbnV0ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVjcmVtZW50ZWRTZWxlY3RlZCA9IGFkZE1pbnV0ZXMoc2VsZWN0ZWQsIC1taW51dGVTdGVwKTtcbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgZGVjcmVtZW50ZWRTZWxlY3RlZCA8IG1pbiB8fFxuICAgICAgZGVjcmVtZW50ZWRTZWxlY3RlZCA+IHNlbGVjdGVkICYmIGRlY3JlbWVudGVkU2VsZWN0ZWQgPiBtYXg7XG4gIH07XG5cbiAgJHNjb3BlLm5vSW5jcmVtZW50U2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmNyZW1lbnRlZFNlbGVjdGVkID0gYWRkU2Vjb25kcyhzZWxlY3RlZCwgc2Vjb25kU3RlcCk7XG4gICAgcmV0dXJuIGRpc2FibGVkIHx8IGluY3JlbWVudGVkU2VsZWN0ZWQgPiBtYXggfHxcbiAgICAgIGluY3JlbWVudGVkU2VsZWN0ZWQgPCBzZWxlY3RlZCAmJiBpbmNyZW1lbnRlZFNlbGVjdGVkIDwgbWluO1xuICB9O1xuXG4gICRzY29wZS5ub0RlY3JlbWVudFNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVjcmVtZW50ZWRTZWxlY3RlZCA9IGFkZFNlY29uZHMoc2VsZWN0ZWQsIC1zZWNvbmRTdGVwKTtcbiAgICByZXR1cm4gZGlzYWJsZWQgfHwgZGVjcmVtZW50ZWRTZWxlY3RlZCA8IG1pbiB8fFxuICAgICAgZGVjcmVtZW50ZWRTZWxlY3RlZCA+IHNlbGVjdGVkICYmIGRlY3JlbWVudGVkU2VsZWN0ZWQgPiBtYXg7XG4gIH07XG5cbiAgJHNjb3BlLm5vVG9nZ2xlTWVyaWRpYW4gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2VsZWN0ZWQuZ2V0SG91cnMoKSA8IDEyKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZWQgfHwgYWRkTWludXRlcyhzZWxlY3RlZCwgMTIgKiA2MCkgPiBtYXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc2FibGVkIHx8IGFkZE1pbnV0ZXMoc2VsZWN0ZWQsIC0xMiAqIDYwKSA8IG1pbjtcbiAgfTtcblxuICB2YXIgc2Vjb25kU3RlcCA9IHRpbWVwaWNrZXJDb25maWcuc2Vjb25kU3RlcDtcbiAgaWYgKCRhdHRycy5zZWNvbmRTdGVwKSB7XG4gICAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5zZWNvbmRTdGVwKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHNlY29uZFN0ZXAgPSArdmFsdWU7XG4gICAgfSkpO1xuICB9XG5cbiAgJHNjb3BlLnNob3dTZWNvbmRzID0gdGltZXBpY2tlckNvbmZpZy5zaG93U2Vjb25kcztcbiAgaWYgKCRhdHRycy5zaG93U2Vjb25kcykge1xuICAgIHdhdGNoZXJzLnB1c2goJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRwYXJzZSgkYXR0cnMuc2hvd1NlY29uZHMpLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgJHNjb3BlLnNob3dTZWNvbmRzID0gISF2YWx1ZTtcbiAgICB9KSk7XG4gIH1cblxuICAvLyAxMkggLyAyNEggbW9kZVxuICAkc2NvcGUuc2hvd01lcmlkaWFuID0gdGltZXBpY2tlckNvbmZpZy5zaG93TWVyaWRpYW47XG4gIGlmICgkYXR0cnMuc2hvd01lcmlkaWFuKSB7XG4gICAgd2F0Y2hlcnMucHVzaCgkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5zaG93TWVyaWRpYW4pLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgJHNjb3BlLnNob3dNZXJpZGlhbiA9ICEhdmFsdWU7XG5cbiAgICAgIGlmIChuZ01vZGVsQ3RybC4kZXJyb3IudGltZSkge1xuICAgICAgICAvLyBFdmFsdWF0ZSBmcm9tIHRlbXBsYXRlXG4gICAgICAgIHZhciBob3VycyA9IGdldEhvdXJzRnJvbVRlbXBsYXRlKCksIG1pbnV0ZXMgPSBnZXRNaW51dGVzRnJvbVRlbXBsYXRlKCk7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChob3VycykgJiYgYW5ndWxhci5pc0RlZmluZWQobWludXRlcykpIHtcbiAgICAgICAgICBzZWxlY3RlZC5zZXRIb3Vycyhob3Vycyk7XG4gICAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVUZW1wbGF0ZSgpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIC8vIEdldCAkc2NvcGUuaG91cnMgaW4gMjRIIG1vZGUgaWYgdmFsaWRcbiAgZnVuY3Rpb24gZ2V0SG91cnNGcm9tVGVtcGxhdGUoKSB7XG4gICAgdmFyIGhvdXJzID0gKyRzY29wZS5ob3VycztcbiAgICB2YXIgdmFsaWQgPSAkc2NvcGUuc2hvd01lcmlkaWFuID8gaG91cnMgPiAwICYmIGhvdXJzIDwgMTMgOlxuICAgICAgaG91cnMgPj0gMCAmJiBob3VycyA8IDI0O1xuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCRzY29wZS5zaG93TWVyaWRpYW4pIHtcbiAgICAgIGlmIChob3VycyA9PT0gMTIpIHtcbiAgICAgICAgaG91cnMgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKCRzY29wZS5tZXJpZGlhbiA9PT0gbWVyaWRpYW5zWzFdKSB7XG4gICAgICAgIGhvdXJzID0gaG91cnMgKyAxMjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhvdXJzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWludXRlc0Zyb21UZW1wbGF0ZSgpIHtcbiAgICB2YXIgbWludXRlcyA9ICskc2NvcGUubWludXRlcztcbiAgICByZXR1cm4gbWludXRlcyA+PSAwICYmIG1pbnV0ZXMgPCA2MCA/IG1pbnV0ZXMgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTZWNvbmRzRnJvbVRlbXBsYXRlKCkge1xuICAgIHZhciBzZWNvbmRzID0gKyRzY29wZS5zZWNvbmRzO1xuICAgIHJldHVybiBzZWNvbmRzID49IDAgJiYgc2Vjb25kcyA8IDYwID8gc2Vjb25kcyA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhZCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkgJiYgdmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPCAyID9cbiAgICAgICcwJyArIHZhbHVlIDogdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8vIFJlc3BvbmQgb24gbW91c2V3aGVlbCBzcGluXG4gIHRoaXMuc2V0dXBNb3VzZXdoZWVsRXZlbnRzID0gZnVuY3Rpb24oaG91cnNJbnB1dEVsLCBtaW51dGVzSW5wdXRFbCwgc2Vjb25kc0lucHV0RWwpIHtcbiAgICB2YXIgaXNTY3JvbGxpbmdVcCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgICAgIH1cbiAgICAgIC8vcGljayBjb3JyZWN0IGRlbHRhIHZhcmlhYmxlIGRlcGVuZGluZyBvbiBldmVudFxuICAgICAgdmFyIGRlbHRhID0gZS53aGVlbERlbHRhID8gZS53aGVlbERlbHRhIDogLWUuZGVsdGFZO1xuICAgICAgcmV0dXJuIGUuZGV0YWlsIHx8IGRlbHRhID4gMDtcbiAgICB9O1xuXG4gICAgaG91cnNJbnB1dEVsLmJpbmQoJ21vdXNld2hlZWwgd2hlZWwnLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoaXNTY3JvbGxpbmdVcChlKSA/ICRzY29wZS5pbmNyZW1lbnRIb3VycygpIDogJHNjb3BlLmRlY3JlbWVudEhvdXJzKCkpO1xuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgbWludXRlc0lucHV0RWwuYmluZCgnbW91c2V3aGVlbCB3aGVlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShpc1Njcm9sbGluZ1VwKGUpID8gJHNjb3BlLmluY3JlbWVudE1pbnV0ZXMoKSA6ICRzY29wZS5kZWNyZW1lbnRNaW51dGVzKCkpO1xuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgIHNlY29uZHNJbnB1dEVsLmJpbmQoJ21vdXNld2hlZWwgd2hlZWwnLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoaXNTY3JvbGxpbmdVcChlKSA/ICRzY29wZS5pbmNyZW1lbnRTZWNvbmRzKCkgOiAkc2NvcGUuZGVjcmVtZW50U2Vjb25kcygpKTtcbiAgICAgIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBSZXNwb25kIG9uIHVwL2Rvd24gYXJyb3drZXlzXG4gIHRoaXMuc2V0dXBBcnJvd2tleUV2ZW50cyA9IGZ1bmN0aW9uKGhvdXJzSW5wdXRFbCwgbWludXRlc0lucHV0RWwsIHNlY29uZHNJbnB1dEVsKSB7XG4gICAgaG91cnNJbnB1dEVsLmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICAgIGlmIChlLndoaWNoID09PSAzOCkgeyAvLyB1cFxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc2NvcGUuaW5jcmVtZW50SG91cnMoKTtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PT0gNDApIHsgLy8gZG93blxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc2NvcGUuZGVjcmVtZW50SG91cnMoKTtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1pbnV0ZXNJbnB1dEVsLmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICAgIGlmIChlLndoaWNoID09PSAzOCkgeyAvLyB1cFxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc2NvcGUuaW5jcmVtZW50TWludXRlcygpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLndoaWNoID09PSA0MCkgeyAvLyBkb3duXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICRzY29wZS5kZWNyZW1lbnRNaW51dGVzKCk7XG4gICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZWNvbmRzSW5wdXRFbC5iaW5kKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgICBpZiAoZS53aGljaCA9PT0gMzgpIHsgLy8gdXBcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgJHNjb3BlLmluY3JlbWVudFNlY29uZHMoKTtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PT0gNDApIHsgLy8gZG93blxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAkc2NvcGUuZGVjcmVtZW50U2Vjb25kcygpO1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuc2V0dXBJbnB1dEV2ZW50cyA9IGZ1bmN0aW9uKGhvdXJzSW5wdXRFbCwgbWludXRlc0lucHV0RWwsIHNlY29uZHNJbnB1dEVsKSB7XG4gICAgaWYgKCRzY29wZS5yZWFkb25seUlucHV0KSB7XG4gICAgICAkc2NvcGUudXBkYXRlSG91cnMgPSBhbmd1bGFyLm5vb3A7XG4gICAgICAkc2NvcGUudXBkYXRlTWludXRlcyA9IGFuZ3VsYXIubm9vcDtcbiAgICAgICRzY29wZS51cGRhdGVTZWNvbmRzID0gYW5ndWxhci5ub29wO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpbnZhbGlkYXRlID0gZnVuY3Rpb24oaW52YWxpZEhvdXJzLCBpbnZhbGlkTWludXRlcywgaW52YWxpZFNlY29uZHMpIHtcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUobnVsbCk7XG4gICAgICBuZ01vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ3RpbWUnLCBmYWxzZSk7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaW52YWxpZEhvdXJzKSkge1xuICAgICAgICAkc2NvcGUuaW52YWxpZEhvdXJzID0gaW52YWxpZEhvdXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaW52YWxpZE1pbnV0ZXMpKSB7XG4gICAgICAgICRzY29wZS5pbnZhbGlkTWludXRlcyA9IGludmFsaWRNaW51dGVzO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaW52YWxpZFNlY29uZHMpKSB7XG4gICAgICAgICRzY29wZS5pbnZhbGlkU2Vjb25kcyA9IGludmFsaWRTZWNvbmRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUudXBkYXRlSG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBob3VycyA9IGdldEhvdXJzRnJvbVRlbXBsYXRlKCksXG4gICAgICAgIG1pbnV0ZXMgPSBnZXRNaW51dGVzRnJvbVRlbXBsYXRlKCk7XG5cbiAgICAgIG5nTW9kZWxDdHJsLiRzZXREaXJ0eSgpO1xuXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaG91cnMpICYmIGFuZ3VsYXIuaXNEZWZpbmVkKG1pbnV0ZXMpKSB7XG4gICAgICAgIHNlbGVjdGVkLnNldEhvdXJzKGhvdXJzKTtcbiAgICAgICAgc2VsZWN0ZWQuc2V0TWludXRlcyhtaW51dGVzKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkIDwgbWluIHx8IHNlbGVjdGVkID4gbWF4KSB7XG4gICAgICAgICAgaW52YWxpZGF0ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZyZXNoKCdoJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludmFsaWRhdGUodHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGhvdXJzSW5wdXRFbC5iaW5kKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFRvdWNoZWQoKTtcbiAgICAgIGlmICgkc2NvcGUuaG91cnMgPT09IG51bGwgfHwgJHNjb3BlLmhvdXJzID09PSAnJykge1xuICAgICAgICBpbnZhbGlkYXRlKHRydWUpO1xuICAgICAgfSBlbHNlIGlmICghJHNjb3BlLmludmFsaWRIb3VycyAmJiAkc2NvcGUuaG91cnMgPCAxMCkge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5ob3VycyA9IHBhZCgkc2NvcGUuaG91cnMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICRzY29wZS51cGRhdGVNaW51dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWludXRlcyA9IGdldE1pbnV0ZXNGcm9tVGVtcGxhdGUoKSxcbiAgICAgICAgaG91cnMgPSBnZXRIb3Vyc0Zyb21UZW1wbGF0ZSgpO1xuXG4gICAgICBuZ01vZGVsQ3RybC4kc2V0RGlydHkoKTtcblxuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKG1pbnV0ZXMpICYmIGFuZ3VsYXIuaXNEZWZpbmVkKGhvdXJzKSkge1xuICAgICAgICBzZWxlY3RlZC5zZXRIb3Vycyhob3Vycyk7XG4gICAgICAgIHNlbGVjdGVkLnNldE1pbnV0ZXMobWludXRlcyk7XG4gICAgICAgIGlmIChzZWxlY3RlZCA8IG1pbiB8fCBzZWxlY3RlZCA+IG1heCkge1xuICAgICAgICAgIGludmFsaWRhdGUodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWZyZXNoKCdtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludmFsaWRhdGUodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbWludXRlc0lucHV0RWwuYmluZCgnYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRUb3VjaGVkKCk7XG4gICAgICBpZiAoJHNjb3BlLm1pbnV0ZXMgPT09IG51bGwpIHtcbiAgICAgICAgaW52YWxpZGF0ZSh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmICghJHNjb3BlLmludmFsaWRNaW51dGVzICYmICRzY29wZS5taW51dGVzIDwgMTApIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUubWludXRlcyA9IHBhZCgkc2NvcGUubWludXRlcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHNjb3BlLnVwZGF0ZVNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWNvbmRzID0gZ2V0U2Vjb25kc0Zyb21UZW1wbGF0ZSgpO1xuXG4gICAgICBuZ01vZGVsQ3RybC4kc2V0RGlydHkoKTtcblxuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHNlY29uZHMpKSB7XG4gICAgICAgIHNlbGVjdGVkLnNldFNlY29uZHMoc2Vjb25kcyk7XG4gICAgICAgIHJlZnJlc2goJ3MnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGludmFsaWRhdGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzZWNvbmRzSW5wdXRFbC5iaW5kKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKCEkc2NvcGUuaW52YWxpZFNlY29uZHMgJiYgJHNjb3BlLnNlY29uZHMgPCAxMCkge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuc2Vjb25kcyA9IHBhZCgkc2NvcGUuc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0ZSA9IG5nTW9kZWxDdHJsLiR2aWV3VmFsdWU7XG5cbiAgICBpZiAoaXNOYU4oZGF0ZSkpIHtcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgndGltZScsIGZhbHNlKTtcbiAgICAgICRsb2cuZXJyb3IoJ1RpbWVwaWNrZXIgZGlyZWN0aXZlOiBcIm5nLW1vZGVsXCIgdmFsdWUgbXVzdCBiZSBhIERhdGUgb2JqZWN0LCBhIG51bWJlciBvZiBtaWxsaXNlY29uZHMgc2luY2UgMDEuMDEuMTk3MCBvciBhIHN0cmluZyByZXByZXNlbnRpbmcgYW4gUkZDMjgyMiBvciBJU08gODYwMSBkYXRlLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZGF0ZSkge1xuICAgICAgICBzZWxlY3RlZCA9IGRhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxlY3RlZCA8IG1pbiB8fCBzZWxlY3RlZCA+IG1heCkge1xuICAgICAgICBuZ01vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ3RpbWUnLCBmYWxzZSk7XG4gICAgICAgICRzY29wZS5pbnZhbGlkSG91cnMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaW52YWxpZE1pbnV0ZXMgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFrZVZhbGlkKCk7XG4gICAgICB9XG4gICAgICB1cGRhdGVUZW1wbGF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBDYWxsIGludGVybmFsbHkgd2hlbiB3ZSBrbm93IHRoYXQgbW9kZWwgaXMgdmFsaWQuXG4gIGZ1bmN0aW9uIHJlZnJlc2goa2V5Ym9hcmRDaGFuZ2UpIHtcbiAgICBtYWtlVmFsaWQoKTtcbiAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKG5ldyBEYXRlKHNlbGVjdGVkKSk7XG4gICAgdXBkYXRlVGVtcGxhdGUoa2V5Ym9hcmRDaGFuZ2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVZhbGlkKCkge1xuICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgndGltZScsIHRydWUpO1xuICAgICRzY29wZS5pbnZhbGlkSG91cnMgPSBmYWxzZTtcbiAgICAkc2NvcGUuaW52YWxpZE1pbnV0ZXMgPSBmYWxzZTtcbiAgICAkc2NvcGUuaW52YWxpZFNlY29uZHMgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVRlbXBsYXRlKGtleWJvYXJkQ2hhbmdlKSB7XG4gICAgaWYgKCFuZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZSkge1xuICAgICAgJHNjb3BlLmhvdXJzID0gbnVsbDtcbiAgICAgICRzY29wZS5taW51dGVzID0gbnVsbDtcbiAgICAgICRzY29wZS5zZWNvbmRzID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXJpZGlhbiA9IG1lcmlkaWFuc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGhvdXJzID0gc2VsZWN0ZWQuZ2V0SG91cnMoKSxcbiAgICAgICAgbWludXRlcyA9IHNlbGVjdGVkLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgc2Vjb25kcyA9IHNlbGVjdGVkLmdldFNlY29uZHMoKTtcblxuICAgICAgaWYgKCRzY29wZS5zaG93TWVyaWRpYW4pIHtcbiAgICAgICAgaG91cnMgPSBob3VycyA9PT0gMCB8fCBob3VycyA9PT0gMTIgPyAxMiA6IGhvdXJzICUgMTI7IC8vIENvbnZlcnQgMjQgdG8gMTIgaG91ciBzeXN0ZW1cbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmhvdXJzID0ga2V5Ym9hcmRDaGFuZ2UgPT09ICdoJyA/IGhvdXJzIDogcGFkKGhvdXJzKTtcbiAgICAgIGlmIChrZXlib2FyZENoYW5nZSAhPT0gJ20nKSB7XG4gICAgICAgICRzY29wZS5taW51dGVzID0gcGFkKG1pbnV0ZXMpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLm1lcmlkaWFuID0gc2VsZWN0ZWQuZ2V0SG91cnMoKSA8IDEyID8gbWVyaWRpYW5zWzBdIDogbWVyaWRpYW5zWzFdO1xuXG4gICAgICBpZiAoa2V5Ym9hcmRDaGFuZ2UgIT09ICdzJykge1xuICAgICAgICAkc2NvcGUuc2Vjb25kcyA9IHBhZChzZWNvbmRzKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5tZXJpZGlhbiA9IHNlbGVjdGVkLmdldEhvdXJzKCkgPCAxMiA/IG1lcmlkaWFuc1swXSA6IG1lcmlkaWFuc1sxXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRTZWNvbmRzVG9TZWxlY3RlZChzZWNvbmRzKSB7XG4gICAgc2VsZWN0ZWQgPSBhZGRTZWNvbmRzKHNlbGVjdGVkLCBzZWNvbmRzKTtcbiAgICByZWZyZXNoKCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRNaW51dGVzKHNlbGVjdGVkLCBtaW51dGVzKSB7XG4gICAgcmV0dXJuIGFkZFNlY29uZHMoc2VsZWN0ZWQsIG1pbnV0ZXMqNjApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2Vjb25kcyhkYXRlLCBzZWNvbmRzKSB7XG4gICAgdmFyIGR0ID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyBzZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBuZXdEYXRlLnNldEhvdXJzKGR0LmdldEhvdXJzKCksIGR0LmdldE1pbnV0ZXMoKSwgZHQuZ2V0U2Vjb25kcygpKTtcbiAgICByZXR1cm4gbmV3RGF0ZTtcbiAgfVxuXG4gICRzY29wZS5zaG93U3Bpbm5lcnMgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuc2hvd1NwaW5uZXJzKSA/XG4gICAgJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzLnNob3dTcGlubmVycykgOiB0aW1lcGlja2VyQ29uZmlnLnNob3dTcGlubmVycztcblxuICAkc2NvcGUuaW5jcmVtZW50SG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISRzY29wZS5ub0luY3JlbWVudEhvdXJzKCkpIHtcbiAgICAgIGFkZFNlY29uZHNUb1NlbGVjdGVkKGhvdXJTdGVwICogNjAgKiA2MCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5kZWNyZW1lbnRIb3VycyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghJHNjb3BlLm5vRGVjcmVtZW50SG91cnMoKSkge1xuICAgICAgYWRkU2Vjb25kc1RvU2VsZWN0ZWQoLWhvdXJTdGVwICogNjAgKiA2MCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5pbmNyZW1lbnRNaW51dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEkc2NvcGUubm9JbmNyZW1lbnRNaW51dGVzKCkpIHtcbiAgICAgIGFkZFNlY29uZHNUb1NlbGVjdGVkKG1pbnV0ZVN0ZXAgKiA2MCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5kZWNyZW1lbnRNaW51dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEkc2NvcGUubm9EZWNyZW1lbnRNaW51dGVzKCkpIHtcbiAgICAgIGFkZFNlY29uZHNUb1NlbGVjdGVkKC1taW51dGVTdGVwICogNjApO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuaW5jcmVtZW50U2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghJHNjb3BlLm5vSW5jcmVtZW50U2Vjb25kcygpKSB7XG4gICAgICBhZGRTZWNvbmRzVG9TZWxlY3RlZChzZWNvbmRTdGVwKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmRlY3JlbWVudFNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoISRzY29wZS5ub0RlY3JlbWVudFNlY29uZHMoKSkge1xuICAgICAgYWRkU2Vjb25kc1RvU2VsZWN0ZWQoLXNlY29uZFN0ZXApO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlTWVyaWRpYW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWludXRlcyA9IGdldE1pbnV0ZXNGcm9tVGVtcGxhdGUoKSxcbiAgICAgICAgaG91cnMgPSBnZXRIb3Vyc0Zyb21UZW1wbGF0ZSgpO1xuXG4gICAgaWYgKCEkc2NvcGUubm9Ub2dnbGVNZXJpZGlhbigpKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobWludXRlcykgJiYgYW5ndWxhci5pc0RlZmluZWQoaG91cnMpKSB7XG4gICAgICAgIGFkZFNlY29uZHNUb1NlbGVjdGVkKDEyICogNjAgKiAoc2VsZWN0ZWQuZ2V0SG91cnMoKSA8IDEyID8gNjAgOiAtNjApKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5tZXJpZGlhbiA9ICRzY29wZS5tZXJpZGlhbiA9PT0gbWVyaWRpYW5zWzBdID8gbWVyaWRpYW5zWzFdIDogbWVyaWRpYW5zWzBdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuYmx1ciA9IGZ1bmN0aW9uKCkge1xuICAgIG5nTW9kZWxDdHJsLiRzZXRUb3VjaGVkKCk7XG4gIH07XG5cbiAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICB3aGlsZSAod2F0Y2hlcnMubGVuZ3RoKSB7XG4gICAgICB3YXRjaGVycy5zaGlmdCgpKCk7XG4gICAgfVxuICB9KTtcbn1dKVxuXG4uZGlyZWN0aXZlKCd1aWJUaW1lcGlja2VyJywgWyd1aWJUaW1lcGlja2VyQ29uZmlnJywgZnVuY3Rpb24odWliVGltZXBpY2tlckNvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHJlcXVpcmU6IFsndWliVGltZXBpY2tlcicsICc/Xm5nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnVWliVGltZXBpY2tlckNvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ3RpbWVwaWNrZXInLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHt9LFxuICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8IHVpYlRpbWVwaWNrZXJDb25maWcudGVtcGxhdGVVcmw7XG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgdGltZXBpY2tlckN0cmwgPSBjdHJsc1swXSwgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgaWYgKG5nTW9kZWxDdHJsKSB7XG4gICAgICAgIHRpbWVwaWNrZXJDdHJsLmluaXQobmdNb2RlbEN0cmwsIGVsZW1lbnQuZmluZCgnaW5wdXQnKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnR5cGVhaGVhZCcsIFsndWkuYm9vdHN0cmFwLmRlYm91bmNlJywgJ3VpLmJvb3RzdHJhcC5wb3NpdGlvbiddKVxuXG4vKipcbiAqIEEgaGVscGVyIHNlcnZpY2UgdGhhdCBjYW4gcGFyc2UgdHlwZWFoZWFkJ3Mgc3ludGF4IChzdHJpbmcgcHJvdmlkZWQgYnkgdXNlcnMpXG4gKiBFeHRyYWN0ZWQgdG8gYSBzZXBhcmF0ZSBzZXJ2aWNlIGZvciBlYXNlIG9mIHVuaXQgdGVzdGluZ1xuICovXG4gIC5mYWN0b3J5KCd1aWJUeXBlYWhlYWRQYXJzZXInLCBbJyRwYXJzZScsIGZ1bmN0aW9uKCRwYXJzZSkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIDAwMDAwMTExMDAwMDAwMDAwMDAwMDIyMjAwMDAwMDAwMDAwMDAwMDAzMzMzMzMzMzMzMzMzMzMwMDAwMDAwMDAwMDQ0MDAwXG4gICAgdmFyIFRZUEVBSEVBRF9SRUdFWFAgPSAvXlxccyooW1xcc1xcU10rPykoPzpcXHMrYXNcXHMrKFtcXHNcXFNdKz8pKT9cXHMrZm9yXFxzKyg/OihbXFwkXFx3XVtcXCRcXHdcXGRdKikpXFxzK2luXFxzKyhbXFxzXFxTXSs/KSQvO1xuICAgIHJldHVybiB7XG4gICAgICBwYXJzZTogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gaW5wdXQubWF0Y2goVFlQRUFIRUFEX1JFR0VYUCk7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnRXhwZWN0ZWQgdHlwZWFoZWFkIHNwZWNpZmljYXRpb24gaW4gZm9ybSBvZiBcIl9tb2RlbFZhbHVlXyAoYXMgX2xhYmVsXyk/IGZvciBfaXRlbV8gaW4gX2NvbGxlY3Rpb25fXCInICtcbiAgICAgICAgICAgICAgJyBidXQgZ290IFwiJyArIGlucHV0ICsgJ1wiLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpdGVtTmFtZTogbWF0Y2hbM10sXG4gICAgICAgICAgc291cmNlOiAkcGFyc2UobWF0Y2hbNF0pLFxuICAgICAgICAgIHZpZXdNYXBwZXI6ICRwYXJzZShtYXRjaFsyXSB8fCBtYXRjaFsxXSksXG4gICAgICAgICAgbW9kZWxNYXBwZXI6ICRwYXJzZShtYXRjaFsxXSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSlcblxuICAuY29udHJvbGxlcignVWliVHlwZWFoZWFkQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICckY29tcGlsZScsICckcGFyc2UnLCAnJHEnLCAnJHRpbWVvdXQnLCAnJGRvY3VtZW50JywgJyR3aW5kb3cnLCAnJHJvb3RTY29wZScsICckJGRlYm91bmNlJywgJyR1aWJQb3NpdGlvbicsICd1aWJUeXBlYWhlYWRQYXJzZXInLFxuICAgIGZ1bmN0aW9uKG9yaWdpbmFsU2NvcGUsIGVsZW1lbnQsIGF0dHJzLCAkY29tcGlsZSwgJHBhcnNlLCAkcSwgJHRpbWVvdXQsICRkb2N1bWVudCwgJHdpbmRvdywgJHJvb3RTY29wZSwgJCRkZWJvdW5jZSwgJHBvc2l0aW9uLCB0eXBlYWhlYWRQYXJzZXIpIHtcbiAgICB2YXIgSE9UX0tFWVMgPSBbOSwgMTMsIDI3LCAzOCwgNDBdO1xuICAgIHZhciBldmVudERlYm91bmNlVGltZSA9IDIwMDtcbiAgICB2YXIgbW9kZWxDdHJsLCBuZ01vZGVsT3B0aW9ucztcbiAgICAvL1NVUFBPUlRFRCBBVFRSSUJVVEVTIChPUFRJT05TKVxuXG4gICAgLy9taW5pbWFsIG5vIG9mIGNoYXJhY3RlcnMgdGhhdCBuZWVkcyB0byBiZSBlbnRlcmVkIGJlZm9yZSB0eXBlYWhlYWQga2lja3MtaW5cbiAgICB2YXIgbWluTGVuZ3RoID0gb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRNaW5MZW5ndGgpO1xuICAgIGlmICghbWluTGVuZ3RoICYmIG1pbkxlbmd0aCAhPT0gMCkge1xuICAgICAgbWluTGVuZ3RoID0gMTtcbiAgICB9XG5cbiAgICAvL21pbmltYWwgd2FpdCB0aW1lIGFmdGVyIGxhc3QgY2hhcmFjdGVyIHR5cGVkIGJlZm9yZSB0eXBlYWhlYWQga2lja3MtaW5cbiAgICB2YXIgd2FpdFRpbWUgPSBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZFdhaXRNcykgfHwgMDtcblxuICAgIC8vc2hvdWxkIGl0IHJlc3RyaWN0IG1vZGVsIHZhbHVlcyB0byB0aGUgb25lcyBzZWxlY3RlZCBmcm9tIHRoZSBwb3B1cCBvbmx5P1xuICAgIHZhciBpc0VkaXRhYmxlID0gb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRFZGl0YWJsZSkgIT09IGZhbHNlO1xuICAgIG9yaWdpbmFsU2NvcGUuJHdhdGNoKGF0dHJzLnR5cGVhaGVhZEVkaXRhYmxlLCBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICBpc0VkaXRhYmxlID0gbmV3VmFsICE9PSBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vYmluZGluZyB0byBhIHZhcmlhYmxlIHRoYXQgaW5kaWNhdGVzIGlmIG1hdGNoZXMgYXJlIGJlaW5nIHJldHJpZXZlZCBhc3luY2hyb25vdXNseVxuICAgIHZhciBpc0xvYWRpbmdTZXR0ZXIgPSAkcGFyc2UoYXR0cnMudHlwZWFoZWFkTG9hZGluZykuYXNzaWduIHx8IGFuZ3VsYXIubm9vcDtcblxuICAgIC8vYSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIGEgbWF0Y2ggaXMgc2VsZWN0ZWRcbiAgICB2YXIgb25TZWxlY3RDYWxsYmFjayA9ICRwYXJzZShhdHRycy50eXBlYWhlYWRPblNlbGVjdCk7XG5cbiAgICAvL3Nob3VsZCBpdCBzZWxlY3QgaGlnaGxpZ2h0ZWQgcG9wdXAgdmFsdWUgd2hlbiBsb3NpbmcgZm9jdXM/XG4gICAgdmFyIGlzU2VsZWN0T25CbHVyID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMudHlwZWFoZWFkU2VsZWN0T25CbHVyKSA/IG9yaWdpbmFsU2NvcGUuJGV2YWwoYXR0cnMudHlwZWFoZWFkU2VsZWN0T25CbHVyKSA6IGZhbHNlO1xuXG4gICAgLy9iaW5kaW5nIHRvIGEgdmFyaWFibGUgdGhhdCBpbmRpY2F0ZXMgaWYgdGhlcmUgd2VyZSBubyByZXN1bHRzIGFmdGVyIHRoZSBxdWVyeSBpcyBjb21wbGV0ZWRcbiAgICB2YXIgaXNOb1Jlc3VsdHNTZXR0ZXIgPSAkcGFyc2UoYXR0cnMudHlwZWFoZWFkTm9SZXN1bHRzKS5hc3NpZ24gfHwgYW5ndWxhci5ub29wO1xuXG4gICAgdmFyIGlucHV0Rm9ybWF0dGVyID0gYXR0cnMudHlwZWFoZWFkSW5wdXRGb3JtYXR0ZXIgPyAkcGFyc2UoYXR0cnMudHlwZWFoZWFkSW5wdXRGb3JtYXR0ZXIpIDogdW5kZWZpbmVkO1xuXG4gICAgdmFyIGFwcGVuZFRvQm9keSA9IGF0dHJzLnR5cGVhaGVhZEFwcGVuZFRvQm9keSA/IG9yaWdpbmFsU2NvcGUuJGV2YWwoYXR0cnMudHlwZWFoZWFkQXBwZW5kVG9Cb2R5KSA6IGZhbHNlO1xuXG4gICAgdmFyIGFwcGVuZFRvID0gYXR0cnMudHlwZWFoZWFkQXBwZW5kVG8gP1xuICAgICAgb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRBcHBlbmRUbykgOiBudWxsO1xuXG4gICAgdmFyIGZvY3VzRmlyc3QgPSBvcmlnaW5hbFNjb3BlLiRldmFsKGF0dHJzLnR5cGVhaGVhZEZvY3VzRmlyc3QpICE9PSBmYWxzZTtcblxuICAgIC8vSWYgaW5wdXQgbWF0Y2hlcyBhbiBpdGVtIG9mIHRoZSBsaXN0IGV4YWN0bHksIHNlbGVjdCBpdCBhdXRvbWF0aWNhbGx5XG4gICAgdmFyIHNlbGVjdE9uRXhhY3QgPSBhdHRycy50eXBlYWhlYWRTZWxlY3RPbkV4YWN0ID8gb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRTZWxlY3RPbkV4YWN0KSA6IGZhbHNlO1xuXG4gICAgLy9iaW5kaW5nIHRvIGEgdmFyaWFibGUgdGhhdCBpbmRpY2F0ZXMgaWYgZHJvcGRvd24gaXMgb3BlblxuICAgIHZhciBpc09wZW5TZXR0ZXIgPSAkcGFyc2UoYXR0cnMudHlwZWFoZWFkSXNPcGVuKS5hc3NpZ24gfHwgYW5ndWxhci5ub29wO1xuXG4gICAgdmFyIHNob3dIaW50ID0gb3JpZ2luYWxTY29wZS4kZXZhbChhdHRycy50eXBlYWhlYWRTaG93SGludCkgfHwgZmFsc2U7XG5cbiAgICAvL0lOVEVSTkFMIFZBUklBQkxFU1xuXG4gICAgLy9tb2RlbCBzZXR0ZXIgZXhlY3V0ZWQgdXBvbiBtYXRjaCBzZWxlY3Rpb25cbiAgICB2YXIgcGFyc2VkTW9kZWwgPSAkcGFyc2UoYXR0cnMubmdNb2RlbCk7XG4gICAgdmFyIGludm9rZU1vZGVsU2V0dGVyID0gJHBhcnNlKGF0dHJzLm5nTW9kZWwgKyAnKCQkJHApJyk7XG4gICAgdmFyICRzZXRNb2RlbFZhbHVlID0gZnVuY3Rpb24oc2NvcGUsIG5ld1ZhbHVlKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHBhcnNlZE1vZGVsKG9yaWdpbmFsU2NvcGUpKSAmJlxuICAgICAgICBuZ01vZGVsT3B0aW9ucyAmJiBuZ01vZGVsT3B0aW9ucy4kb3B0aW9ucyAmJiBuZ01vZGVsT3B0aW9ucy4kb3B0aW9ucy5nZXR0ZXJTZXR0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZU1vZGVsU2V0dGVyKHNjb3BlLCB7JCQkcDogbmV3VmFsdWV9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnNlZE1vZGVsLmFzc2lnbihzY29wZSwgbmV3VmFsdWUpO1xuICAgIH07XG5cbiAgICAvL2V4cHJlc3Npb25zIHVzZWQgYnkgdHlwZWFoZWFkXG4gICAgdmFyIHBhcnNlclJlc3VsdCA9IHR5cGVhaGVhZFBhcnNlci5wYXJzZShhdHRycy51aWJUeXBlYWhlYWQpO1xuXG4gICAgdmFyIGhhc0ZvY3VzO1xuXG4gICAgLy9Vc2VkIHRvIGF2b2lkIGJ1ZyBpbiBpT1Mgd2VidmlldyB3aGVyZSBpT1Mga2V5Ym9hcmQgZG9lcyBub3QgZmlyZVxuICAgIC8vbW91c2Vkb3duICYgbW91c2V1cCBldmVudHNcbiAgICAvL0lzc3VlICMzNjk5XG4gICAgdmFyIHNlbGVjdGVkO1xuXG4gICAgLy9jcmVhdGUgYSBjaGlsZCBzY29wZSBmb3IgdGhlIHR5cGVhaGVhZCBkaXJlY3RpdmUgc28gd2UgYXJlIG5vdCBwb2xsdXRpbmcgb3JpZ2luYWwgc2NvcGVcbiAgICAvL3dpdGggdHlwZWFoZWFkLXNwZWNpZmljIGRhdGEgKG1hdGNoZXMsIHF1ZXJ5IGV0Yy4pXG4gICAgdmFyIHNjb3BlID0gb3JpZ2luYWxTY29wZS4kbmV3KCk7XG4gICAgdmFyIG9mZkRlc3Ryb3kgPSBvcmlnaW5hbFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgIHNjb3BlLiRkZXN0cm95KCk7XG4gICAgfSk7XG4gICAgc2NvcGUuJG9uKCckZGVzdHJveScsIG9mZkRlc3Ryb3kpO1xuXG4gICAgLy8gV0FJLUFSSUFcbiAgICB2YXIgcG9wdXBJZCA9ICd0eXBlYWhlYWQtJyArIHNjb3BlLiRpZCArICctJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKTtcbiAgICBlbGVtZW50LmF0dHIoe1xuICAgICAgJ2FyaWEtYXV0b2NvbXBsZXRlJzogJ2xpc3QnLFxuICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBmYWxzZSxcbiAgICAgICdhcmlhLW93bnMnOiBwb3B1cElkXG4gICAgfSk7XG5cbiAgICB2YXIgaW5wdXRzQ29udGFpbmVyLCBoaW50SW5wdXRFbGVtO1xuICAgIC8vYWRkIHJlYWQtb25seSBpbnB1dCB0byBzaG93IGhpbnRcbiAgICBpZiAoc2hvd0hpbnQpIHtcbiAgICAgIGlucHV0c0NvbnRhaW5lciA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdj48L2Rpdj4nKTtcbiAgICAgIGlucHV0c0NvbnRhaW5lci5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgICBlbGVtZW50LmFmdGVyKGlucHV0c0NvbnRhaW5lcik7XG4gICAgICBoaW50SW5wdXRFbGVtID0gZWxlbWVudC5jbG9uZSgpO1xuICAgICAgaGludElucHV0RWxlbS5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICAgIGhpbnRJbnB1dEVsZW0udmFsKCcnKTtcbiAgICAgIGhpbnRJbnB1dEVsZW0uY3NzKHtcbiAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICAgJ3RvcCc6ICcwcHgnLFxuICAgICAgICAnbGVmdCc6ICcwcHgnLFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgJ2JveC1zaGFkb3cnOiAnbm9uZScsXG4gICAgICAgICdvcGFjaXR5JzogMSxcbiAgICAgICAgJ2JhY2tncm91bmQnOiAnbm9uZSAwJSAwJSAvIGF1dG8gcmVwZWF0IHNjcm9sbCBwYWRkaW5nLWJveCBib3JkZXItYm94IHJnYigyNTUsIDI1NSwgMjU1KScsXG4gICAgICAgICdjb2xvcic6ICcjOTk5J1xuICAgICAgfSk7XG4gICAgICBlbGVtZW50LmNzcyh7XG4gICAgICAgICdwb3NpdGlvbic6ICdyZWxhdGl2ZScsXG4gICAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICd0b3AnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICd0cmFuc3BhcmVudCdcbiAgICAgIH0pO1xuICAgICAgaW5wdXRzQ29udGFpbmVyLmFwcGVuZChoaW50SW5wdXRFbGVtKTtcbiAgICAgIGhpbnRJbnB1dEVsZW0uYWZ0ZXIoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy9wb3AtdXAgZWxlbWVudCB1c2VkIHRvIGRpc3BsYXkgbWF0Y2hlc1xuICAgIHZhciBwb3BVcEVsID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IHVpYi10eXBlYWhlYWQtcG9wdXA+PC9kaXY+Jyk7XG4gICAgcG9wVXBFbC5hdHRyKHtcbiAgICAgIGlkOiBwb3B1cElkLFxuICAgICAgbWF0Y2hlczogJ21hdGNoZXMnLFxuICAgICAgYWN0aXZlOiAnYWN0aXZlSWR4JyxcbiAgICAgIHNlbGVjdDogJ3NlbGVjdChhY3RpdmVJZHgsIGV2dCknLFxuICAgICAgJ21vdmUtaW4tcHJvZ3Jlc3MnOiAnbW92ZUluUHJvZ3Jlc3MnLFxuICAgICAgcXVlcnk6ICdxdWVyeScsXG4gICAgICBwb3NpdGlvbjogJ3Bvc2l0aW9uJyxcbiAgICAgICdhc3NpZ24taXMtb3Blbic6ICdhc3NpZ25Jc09wZW4oaXNPcGVuKScsXG4gICAgICBkZWJvdW5jZTogJ2RlYm91bmNlVXBkYXRlJ1xuICAgIH0pO1xuICAgIC8vY3VzdG9tIGl0ZW0gdGVtcGxhdGVcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXR0cnMudHlwZWFoZWFkVGVtcGxhdGVVcmwpKSB7XG4gICAgICBwb3BVcEVsLmF0dHIoJ3RlbXBsYXRlLXVybCcsIGF0dHJzLnR5cGVhaGVhZFRlbXBsYXRlVXJsKTtcbiAgICB9XG5cbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXR0cnMudHlwZWFoZWFkUG9wdXBUZW1wbGF0ZVVybCkpIHtcbiAgICAgIHBvcFVwRWwuYXR0cigncG9wdXAtdGVtcGxhdGUtdXJsJywgYXR0cnMudHlwZWFoZWFkUG9wdXBUZW1wbGF0ZVVybCk7XG4gICAgfVxuXG4gICAgdmFyIHJlc2V0SGludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNob3dIaW50KSB7XG4gICAgICAgIGhpbnRJbnB1dEVsZW0udmFsKCcnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHJlc2V0TWF0Y2hlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2NvcGUubWF0Y2hlcyA9IFtdO1xuICAgICAgc2NvcGUuYWN0aXZlSWR4ID0gLTE7XG4gICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgICByZXNldEhpbnQoKTtcbiAgICB9O1xuXG4gICAgdmFyIGdldE1hdGNoSWQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuIHBvcHVwSWQgKyAnLW9wdGlvbi0nICsgaW5kZXg7XG4gICAgfTtcblxuICAgIC8vIEluZGljYXRlIHRoYXQgdGhlIHNwZWNpZmllZCBtYXRjaCBpcyB0aGUgYWN0aXZlIChwcmUtc2VsZWN0ZWQpIGl0ZW0gaW4gdGhlIGxpc3Qgb3duZWQgYnkgdGhpcyB0eXBlYWhlYWQuXG4gICAgLy8gVGhpcyBhdHRyaWJ1dGUgaXMgYWRkZWQgb3IgcmVtb3ZlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIGBhY3RpdmVJZHhgIGNoYW5nZXMuXG4gICAgc2NvcGUuJHdhdGNoKCdhY3RpdmVJZHgnLCBmdW5jdGlvbihpbmRleCkge1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBnZXRNYXRjaElkKGluZGV4KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgaW5wdXRJc0V4YWN0TWF0Y2ggPSBmdW5jdGlvbihpbnB1dFZhbHVlLCBpbmRleCkge1xuICAgICAgaWYgKHNjb3BlLm1hdGNoZXMubGVuZ3RoID4gaW5kZXggJiYgaW5wdXRWYWx1ZSkge1xuICAgICAgICByZXR1cm4gaW5wdXRWYWx1ZS50b1VwcGVyQ2FzZSgpID09PSBzY29wZS5tYXRjaGVzW2luZGV4XS5sYWJlbC50b1VwcGVyQ2FzZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHZhciBnZXRNYXRjaGVzQXN5bmMgPSBmdW5jdGlvbihpbnB1dFZhbHVlLCBldnQpIHtcbiAgICAgIHZhciBsb2NhbHMgPSB7JHZpZXdWYWx1ZTogaW5wdXRWYWx1ZX07XG4gICAgICBpc0xvYWRpbmdTZXR0ZXIob3JpZ2luYWxTY29wZSwgdHJ1ZSk7XG4gICAgICBpc05vUmVzdWx0c1NldHRlcihvcmlnaW5hbFNjb3BlLCBmYWxzZSk7XG4gICAgICAkcS53aGVuKHBhcnNlclJlc3VsdC5zb3VyY2Uob3JpZ2luYWxTY29wZSwgbG9jYWxzKSkudGhlbihmdW5jdGlvbihtYXRjaGVzKSB7XG4gICAgICAgIC8vaXQgbWlnaHQgaGFwcGVuIHRoYXQgc2V2ZXJhbCBhc3luYyBxdWVyaWVzIHdlcmUgaW4gcHJvZ3Jlc3MgaWYgYSB1c2VyIHdlcmUgdHlwaW5nIGZhc3RcbiAgICAgICAgLy9idXQgd2UgYXJlIGludGVyZXN0ZWQgb25seSBpbiByZXNwb25zZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBjdXJyZW50IHZpZXcgdmFsdWVcbiAgICAgICAgdmFyIG9uQ3VycmVudFJlcXVlc3QgPSBpbnB1dFZhbHVlID09PSBtb2RlbEN0cmwuJHZpZXdWYWx1ZTtcbiAgICAgICAgaWYgKG9uQ3VycmVudFJlcXVlc3QgJiYgaGFzRm9jdXMpIHtcbiAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNjb3BlLmFjdGl2ZUlkeCA9IGZvY3VzRmlyc3QgPyAwIDogLTE7XG4gICAgICAgICAgICBpc05vUmVzdWx0c1NldHRlcihvcmlnaW5hbFNjb3BlLCBmYWxzZSk7XG4gICAgICAgICAgICBzY29wZS5tYXRjaGVzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgIC8vdHJhbnNmb3JtIGxhYmVsc1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGxvY2Fsc1twYXJzZXJSZXN1bHQuaXRlbU5hbWVdID0gbWF0Y2hlc1tpXTtcbiAgICAgICAgICAgICAgc2NvcGUubWF0Y2hlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogZ2V0TWF0Y2hJZChpKSxcbiAgICAgICAgICAgICAgICBsYWJlbDogcGFyc2VyUmVzdWx0LnZpZXdNYXBwZXIoc2NvcGUsIGxvY2FscyksXG4gICAgICAgICAgICAgICAgbW9kZWw6IG1hdGNoZXNbaV1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLnF1ZXJ5ID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgIC8vcG9zaXRpb24gcG9wLXVwIHdpdGggbWF0Y2hlcyAtIHdlIG5lZWQgdG8gcmUtY2FsY3VsYXRlIGl0cyBwb3NpdGlvbiBlYWNoIHRpbWUgd2UgYXJlIG9wZW5pbmcgYSB3aW5kb3dcbiAgICAgICAgICAgIC8vd2l0aCBtYXRjaGVzIGFzIGEgcG9wLXVwIG1pZ2h0IGJlIGFic29sdXRlLXBvc2l0aW9uZWQgYW5kIHBvc2l0aW9uIG9mIGFuIGlucHV0IG1pZ2h0IGhhdmUgY2hhbmdlZCBvbiBhIHBhZ2VcbiAgICAgICAgICAgIC8vZHVlIHRvIG90aGVyIGVsZW1lbnRzIGJlaW5nIHJlbmRlcmVkXG4gICAgICAgICAgICByZWNhbGN1bGF0ZVBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICAvL1NlbGVjdCB0aGUgc2luZ2xlIHJlbWFpbmluZyBvcHRpb24gaWYgdXNlciBpbnB1dCBtYXRjaGVzXG4gICAgICAgICAgICBpZiAoc2VsZWN0T25FeGFjdCAmJiBzY29wZS5tYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBpbnB1dElzRXhhY3RNYXRjaChpbnB1dFZhbHVlLCAwKSkge1xuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc051bWJlcihzY29wZS5kZWJvdW5jZVVwZGF0ZSkgfHwgYW5ndWxhci5pc09iamVjdChzY29wZS5kZWJvdW5jZVVwZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAkJGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0KDAsIGV2dCk7XG4gICAgICAgICAgICAgICAgfSwgYW5ndWxhci5pc051bWJlcihzY29wZS5kZWJvdW5jZVVwZGF0ZSkgPyBzY29wZS5kZWJvdW5jZVVwZGF0ZSA6IHNjb3BlLmRlYm91bmNlVXBkYXRlWydkZWZhdWx0J10pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjb3BlLnNlbGVjdCgwLCBldnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaG93SGludCkge1xuICAgICAgICAgICAgICB2YXIgZmlyc3RMYWJlbCA9IHNjb3BlLm1hdGNoZXNbMF0ubGFiZWw7XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGlucHV0VmFsdWUpICYmXG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZS5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgZmlyc3RMYWJlbC5zbGljZSgwLCBpbnB1dFZhbHVlLmxlbmd0aCkudG9VcHBlckNhc2UoKSA9PT0gaW5wdXRWYWx1ZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgaGludElucHV0RWxlbS52YWwoaW5wdXRWYWx1ZSArIGZpcnN0TGFiZWwuc2xpY2UoaW5wdXRWYWx1ZS5sZW5ndGgpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoaW50SW5wdXRFbGVtLnZhbCgnJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzZXRNYXRjaGVzKCk7XG4gICAgICAgICAgICBpc05vUmVzdWx0c1NldHRlcihvcmlnaW5hbFNjb3BlLCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9uQ3VycmVudFJlcXVlc3QpIHtcbiAgICAgICAgICBpc0xvYWRpbmdTZXR0ZXIob3JpZ2luYWxTY29wZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzZXRNYXRjaGVzKCk7XG4gICAgICAgIGlzTG9hZGluZ1NldHRlcihvcmlnaW5hbFNjb3BlLCBmYWxzZSk7XG4gICAgICAgIGlzTm9SZXN1bHRzU2V0dGVyKG9yaWdpbmFsU2NvcGUsIHRydWUpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIGJpbmQgZXZlbnRzIG9ubHkgaWYgYXBwZW5kVG9Cb2R5IHBhcmFtcyBleGlzdCAtIHBlcmZvcm1hbmNlIGZlYXR1cmVcbiAgICBpZiAoYXBwZW5kVG9Cb2R5KSB7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub24oJ3Jlc2l6ZScsIGZpcmVSZWNhbGN1bGF0aW5nKTtcbiAgICAgICRkb2N1bWVudC5maW5kKCdib2R5Jykub24oJ3Njcm9sbCcsIGZpcmVSZWNhbGN1bGF0aW5nKTtcbiAgICB9XG5cbiAgICAvLyBEZWNsYXJlIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gb3V0c2lkZSByZWNhbGN1bGF0aW5nIGZvclxuICAgIC8vIHByb3BlciBkZWJvdW5jaW5nXG4gICAgdmFyIGRlYm91bmNlZFJlY2FsY3VsYXRlID0gJCRkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgIC8vIGlmIHBvcHVwIGlzIHZpc2libGVcbiAgICAgIGlmIChzY29wZS5tYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICByZWNhbGN1bGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHNjb3BlLm1vdmVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgfSwgZXZlbnREZWJvdW5jZVRpbWUpO1xuXG4gICAgLy8gRGVmYXVsdCBwcm9ncmVzcyB0eXBlXG4gICAgc2NvcGUubW92ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGZpcmVSZWNhbGN1bGF0aW5nKCkge1xuICAgICAgaWYgKCFzY29wZS5tb3ZlSW5Qcm9ncmVzcykge1xuICAgICAgICBzY29wZS5tb3ZlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIH1cblxuICAgICAgZGVib3VuY2VkUmVjYWxjdWxhdGUoKTtcbiAgICB9XG5cbiAgICAvLyByZWNhbGN1bGF0ZSBhY3R1YWwgcG9zaXRpb24gYW5kIHNldCBuZXcgdmFsdWVzIHRvIHNjb3BlXG4gICAgLy8gYWZ0ZXIgZGlnZXN0IGxvb3AgaXMgcG9wdXAgaW4gcmlnaHQgcG9zaXRpb25cbiAgICBmdW5jdGlvbiByZWNhbGN1bGF0ZVBvc2l0aW9uKCkge1xuICAgICAgc2NvcGUucG9zaXRpb24gPSBhcHBlbmRUb0JvZHkgPyAkcG9zaXRpb24ub2Zmc2V0KGVsZW1lbnQpIDogJHBvc2l0aW9uLnBvc2l0aW9uKGVsZW1lbnQpO1xuICAgICAgc2NvcGUucG9zaXRpb24udG9wICs9IGVsZW1lbnQucHJvcCgnb2Zmc2V0SGVpZ2h0Jyk7XG4gICAgfVxuXG4gICAgLy93ZSBuZWVkIHRvIHByb3BhZ2F0ZSB1c2VyJ3MgcXVlcnkgc28gd2UgY2FuIGhpZ2xpZ2h0IG1hdGNoZXNcbiAgICBzY29wZS5xdWVyeSA9IHVuZGVmaW5lZDtcblxuICAgIC8vRGVjbGFyZSB0aGUgdGltZW91dCBwcm9taXNlIHZhciBvdXRzaWRlIHRoZSBmdW5jdGlvbiBzY29wZSBzbyB0aGF0IHN0YWNrZWQgY2FsbHMgY2FuIGJlIGNhbmNlbGxlZCBsYXRlclxuICAgIHZhciB0aW1lb3V0UHJvbWlzZTtcblxuICAgIHZhciBzY2hlZHVsZVNlYXJjaFdpdGhUaW1lb3V0ID0gZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgdGltZW91dFByb21pc2UgPSAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2V0TWF0Y2hlc0FzeW5jKGlucHV0VmFsdWUpO1xuICAgICAgfSwgd2FpdFRpbWUpO1xuICAgIH07XG5cbiAgICB2YXIgY2FuY2VsUHJldmlvdXNUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGltZW91dFByb21pc2UpIHtcbiAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXRQcm9taXNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVzZXRNYXRjaGVzKCk7XG5cbiAgICBzY29wZS5hc3NpZ25Jc09wZW4gPSBmdW5jdGlvbiAoaXNPcGVuKSB7XG4gICAgICBpc09wZW5TZXR0ZXIob3JpZ2luYWxTY29wZSwgaXNPcGVuKTtcbiAgICB9O1xuXG4gICAgc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oYWN0aXZlSWR4LCBldnQpIHtcbiAgICAgIC8vY2FsbGVkIGZyb20gd2l0aGluIHRoZSAkZGlnZXN0KCkgY3ljbGVcbiAgICAgIHZhciBsb2NhbHMgPSB7fTtcbiAgICAgIHZhciBtb2RlbCwgaXRlbTtcblxuICAgICAgc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgbG9jYWxzW3BhcnNlclJlc3VsdC5pdGVtTmFtZV0gPSBpdGVtID0gc2NvcGUubWF0Y2hlc1thY3RpdmVJZHhdLm1vZGVsO1xuICAgICAgbW9kZWwgPSBwYXJzZXJSZXN1bHQubW9kZWxNYXBwZXIob3JpZ2luYWxTY29wZSwgbG9jYWxzKTtcbiAgICAgICRzZXRNb2RlbFZhbHVlKG9yaWdpbmFsU2NvcGUsIG1vZGVsKTtcbiAgICAgIG1vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ2VkaXRhYmxlJywgdHJ1ZSk7XG4gICAgICBtb2RlbEN0cmwuJHNldFZhbGlkaXR5KCdwYXJzZScsIHRydWUpO1xuXG4gICAgICBvblNlbGVjdENhbGxiYWNrKG9yaWdpbmFsU2NvcGUsIHtcbiAgICAgICAgJGl0ZW06IGl0ZW0sXG4gICAgICAgICRtb2RlbDogbW9kZWwsXG4gICAgICAgICRsYWJlbDogcGFyc2VyUmVzdWx0LnZpZXdNYXBwZXIob3JpZ2luYWxTY29wZSwgbG9jYWxzKSxcbiAgICAgICAgJGV2ZW50OiBldnRcbiAgICAgIH0pO1xuXG4gICAgICByZXNldE1hdGNoZXMoKTtcblxuICAgICAgLy9yZXR1cm4gZm9jdXMgdG8gdGhlIGlucHV0IGVsZW1lbnQgaWYgYSBtYXRjaCB3YXMgc2VsZWN0ZWQgdmlhIGEgbW91c2UgY2xpY2sgZXZlbnRcbiAgICAgIC8vIHVzZSB0aW1lb3V0IHRvIGF2b2lkICRyb290U2NvcGU6aW5wcm9nIGVycm9yXG4gICAgICBpZiAoc2NvcGUuJGV2YWwoYXR0cnMudHlwZWFoZWFkRm9jdXNPblNlbGVjdCkgIT09IGZhbHNlKSB7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyBlbGVtZW50WzBdLmZvY3VzKCk7IH0sIDAsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9iaW5kIGtleWJvYXJkIGV2ZW50czogYXJyb3dzIHVwKDM4KSAvIGRvd24oNDApLCBlbnRlcigxMykgYW5kIHRhYig5KSwgZXNjKDI3KVxuICAgIGVsZW1lbnQub24oJ2tleWRvd24nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIC8vdHlwZWFoZWFkIGlzIG9wZW4gYW5kIGFuIFwiaW50ZXJlc3RpbmdcIiBrZXkgd2FzIHByZXNzZWRcbiAgICAgIGlmIChzY29wZS5tYXRjaGVzLmxlbmd0aCA9PT0gMCB8fCBIT1RfS0VZUy5pbmRleE9mKGV2dC53aGljaCkgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlcmUncyBub3RoaW5nIHNlbGVjdGVkIChpLmUuIGZvY3VzRmlyc3QpIGFuZCBlbnRlciBvciB0YWIgaXMgaGl0LCBjbGVhciB0aGUgcmVzdWx0c1xuICAgICAgaWYgKHNjb3BlLmFjdGl2ZUlkeCA9PT0gLTEgJiYgKGV2dC53aGljaCA9PT0gOSB8fCBldnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICByZXNldE1hdGNoZXMoKTtcbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHRhcmdldDtcbiAgICAgIHN3aXRjaCAoZXZ0LndoaWNoKSB7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIoc2NvcGUuZGVib3VuY2VVcGRhdGUpIHx8IGFuZ3VsYXIuaXNPYmplY3Qoc2NvcGUuZGVib3VuY2VVcGRhdGUpKSB7XG4gICAgICAgICAgICAgICQkZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0KHNjb3BlLmFjdGl2ZUlkeCwgZXZ0KTtcbiAgICAgICAgICAgICAgfSwgYW5ndWxhci5pc051bWJlcihzY29wZS5kZWJvdW5jZVVwZGF0ZSkgPyBzY29wZS5kZWJvdW5jZVVwZGF0ZSA6IHNjb3BlLmRlYm91bmNlVXBkYXRlWydkZWZhdWx0J10pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0KHNjb3BlLmFjdGl2ZUlkeCwgZXZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICByZXNldE1hdGNoZXMoKTtcbiAgICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgc2NvcGUuYWN0aXZlSWR4ID0gKHNjb3BlLmFjdGl2ZUlkeCA+IDAgPyBzY29wZS5hY3RpdmVJZHggOiBzY29wZS5tYXRjaGVzLmxlbmd0aCkgLSAxO1xuICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICB0YXJnZXQgPSBwb3BVcEVsLmZpbmQoJ2xpJylbc2NvcGUuYWN0aXZlSWR4XTtcbiAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5zY3JvbGxUb3AgPSB0YXJnZXQub2Zmc2V0VG9wO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgIHNjb3BlLmFjdGl2ZUlkeCA9IChzY29wZS5hY3RpdmVJZHggKyAxKSAlIHNjb3BlLm1hdGNoZXMubGVuZ3RoO1xuICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICB0YXJnZXQgPSBwb3BVcEVsLmZpbmQoJ2xpJylbc2NvcGUuYWN0aXZlSWR4XTtcbiAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5zY3JvbGxUb3AgPSB0YXJnZXQub2Zmc2V0VG9wO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZWxlbWVudC5iaW5kKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGhhc0ZvY3VzID0gdHJ1ZTtcbiAgICAgIGlmIChtaW5MZW5ndGggPT09IDAgJiYgIW1vZGVsQ3RybC4kdmlld1ZhbHVlKSB7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdldE1hdGNoZXNBc3luYyhtb2RlbEN0cmwuJHZpZXdWYWx1ZSwgZXZ0KTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBlbGVtZW50LmJpbmQoJ2JsdXInLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIGlmIChpc1NlbGVjdE9uQmx1ciAmJiBzY29wZS5tYXRjaGVzLmxlbmd0aCAmJiBzY29wZS5hY3RpdmVJZHggIT09IC0xICYmICFzZWxlY3RlZCkge1xuICAgICAgICBzZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChzY29wZS5kZWJvdW5jZVVwZGF0ZSkgJiYgYW5ndWxhci5pc051bWJlcihzY29wZS5kZWJvdW5jZVVwZGF0ZS5ibHVyKSkge1xuICAgICAgICAgICAgJCRkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0KHNjb3BlLmFjdGl2ZUlkeCwgZXZ0KTtcbiAgICAgICAgICAgIH0sIHNjb3BlLmRlYm91bmNlVXBkYXRlLmJsdXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY29wZS5zZWxlY3Qoc2NvcGUuYWN0aXZlSWR4LCBldnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWlzRWRpdGFibGUgJiYgbW9kZWxDdHJsLiRlcnJvci5lZGl0YWJsZSkge1xuICAgICAgICBtb2RlbEN0cmwuJHZpZXdWYWx1ZSA9ICcnO1xuICAgICAgICBlbGVtZW50LnZhbCgnJyk7XG4gICAgICB9XG4gICAgICBoYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIEtlZXAgcmVmZXJlbmNlIHRvIGNsaWNrIGhhbmRsZXIgdG8gdW5iaW5kIGl0LlxuICAgIHZhciBkaXNtaXNzQ2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAvLyBJc3N1ZSAjMzk3M1xuICAgICAgLy8gRmlyZWZveCB0cmVhdHMgcmlnaHQgY2xpY2sgYXMgYSBjbGljayBvbiBkb2N1bWVudFxuICAgICAgaWYgKGVsZW1lbnRbMF0gIT09IGV2dC50YXJnZXQgJiYgZXZ0LndoaWNoICE9PSAzICYmIHNjb3BlLm1hdGNoZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJlc2V0TWF0Y2hlcygpO1xuICAgICAgICBpZiAoISRyb290U2NvcGUuJCRwaGFzZSkge1xuICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAkZG9jdW1lbnQub24oJ2NsaWNrJywgZGlzbWlzc0NsaWNrSGFuZGxlcik7XG5cbiAgICBvcmlnaW5hbFNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICRkb2N1bWVudC5vZmYoJ2NsaWNrJywgZGlzbWlzc0NsaWNrSGFuZGxlcik7XG4gICAgICBpZiAoYXBwZW5kVG9Cb2R5IHx8IGFwcGVuZFRvKSB7XG4gICAgICAgICRwb3B1cC5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFwcGVuZFRvQm9keSkge1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykub2ZmKCdyZXNpemUnLCBmaXJlUmVjYWxjdWxhdGluZyk7XG4gICAgICAgICRkb2N1bWVudC5maW5kKCdib2R5Jykub2ZmKCdzY3JvbGwnLCBmaXJlUmVjYWxjdWxhdGluZyk7XG4gICAgICB9XG4gICAgICAvLyBQcmV2ZW50IGpRdWVyeSBjYWNoZSBtZW1vcnkgbGVha1xuICAgICAgcG9wVXBFbC5yZW1vdmUoKTtcblxuICAgICAgaWYgKHNob3dIaW50KSB7XG4gICAgICAgICAgaW5wdXRzQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyICRwb3B1cCA9ICRjb21waWxlKHBvcFVwRWwpKHNjb3BlKTtcblxuICAgIGlmIChhcHBlbmRUb0JvZHkpIHtcbiAgICAgICRkb2N1bWVudC5maW5kKCdib2R5JykuYXBwZW5kKCRwb3B1cCk7XG4gICAgfSBlbHNlIGlmIChhcHBlbmRUbykge1xuICAgICAgYW5ndWxhci5lbGVtZW50KGFwcGVuZFRvKS5lcSgwKS5hcHBlbmQoJHBvcHVwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5hZnRlcigkcG9wdXApO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKF9tb2RlbEN0cmwsIF9uZ01vZGVsT3B0aW9ucykge1xuICAgICAgbW9kZWxDdHJsID0gX21vZGVsQ3RybDtcbiAgICAgIG5nTW9kZWxPcHRpb25zID0gX25nTW9kZWxPcHRpb25zO1xuXG4gICAgICBzY29wZS5kZWJvdW5jZVVwZGF0ZSA9IG1vZGVsQ3RybC4kb3B0aW9ucyAmJiAkcGFyc2UobW9kZWxDdHJsLiRvcHRpb25zLmRlYm91bmNlKShvcmlnaW5hbFNjb3BlKTtcblxuICAgICAgLy9wbHVnIGludG8gJHBhcnNlcnMgcGlwZWxpbmUgdG8gb3BlbiBhIHR5cGVhaGVhZCBvbiB2aWV3IGNoYW5nZXMgaW5pdGlhdGVkIGZyb20gRE9NXG4gICAgICAvLyRwYXJzZXJzIGtpY2staW4gb24gYWxsIHRoZSBjaGFuZ2VzIGNvbWluZyBmcm9tIHRoZSB2aWV3IGFzIHdlbGwgYXMgbWFudWFsbHkgdHJpZ2dlcmVkIGJ5ICRzZXRWaWV3VmFsdWVcbiAgICAgIG1vZGVsQ3RybC4kcGFyc2Vycy51bnNoaWZ0KGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgICAgaGFzRm9jdXMgPSB0cnVlO1xuXG4gICAgICAgIGlmIChtaW5MZW5ndGggPT09IDAgfHwgaW5wdXRWYWx1ZSAmJiBpbnB1dFZhbHVlLmxlbmd0aCA+PSBtaW5MZW5ndGgpIHtcbiAgICAgICAgICBpZiAod2FpdFRpbWUgPiAwKSB7XG4gICAgICAgICAgICBjYW5jZWxQcmV2aW91c1RpbWVvdXQoKTtcbiAgICAgICAgICAgIHNjaGVkdWxlU2VhcmNoV2l0aFRpbWVvdXQoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldE1hdGNoZXNBc3luYyhpbnB1dFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNMb2FkaW5nU2V0dGVyKG9yaWdpbmFsU2NvcGUsIGZhbHNlKTtcbiAgICAgICAgICBjYW5jZWxQcmV2aW91c1RpbWVvdXQoKTtcbiAgICAgICAgICByZXNldE1hdGNoZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlucHV0VmFsdWUpIHtcbiAgICAgICAgICAvLyBSZXNldCBpbiBjYXNlIHVzZXIgaGFkIHR5cGVkIHNvbWV0aGluZyBwcmV2aW91c2x5LlxuICAgICAgICAgIG1vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ2VkaXRhYmxlJywgdHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBtb2RlbEN0cmwuJHNldFZhbGlkaXR5KCdlZGl0YWJsZScsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0pO1xuXG4gICAgICBtb2RlbEN0cmwuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihtb2RlbFZhbHVlKSB7XG4gICAgICAgIHZhciBjYW5kaWRhdGVWaWV3VmFsdWUsIGVtcHR5Vmlld1ZhbHVlO1xuICAgICAgICB2YXIgbG9jYWxzID0ge307XG5cbiAgICAgICAgLy8gVGhlIHZhbGlkaXR5IG1heSBiZSBzZXQgdG8gZmFsc2UgdmlhICRwYXJzZXJzIChzZWUgYWJvdmUpIGlmXG4gICAgICAgIC8vIHRoZSBtb2RlbCBpcyByZXN0cmljdGVkIHRvIHNlbGVjdGVkIHZhbHVlcy4gSWYgdGhlIG1vZGVsXG4gICAgICAgIC8vIGlzIHNldCBtYW51YWxseSBpdCBpcyBjb25zaWRlcmVkIHRvIGJlIHZhbGlkLlxuICAgICAgICBpZiAoIWlzRWRpdGFibGUpIHtcbiAgICAgICAgICBtb2RlbEN0cmwuJHNldFZhbGlkaXR5KCdlZGl0YWJsZScsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlucHV0Rm9ybWF0dGVyKSB7XG4gICAgICAgICAgbG9jYWxzLiRtb2RlbCA9IG1vZGVsVmFsdWU7XG4gICAgICAgICAgcmV0dXJuIGlucHV0Rm9ybWF0dGVyKG9yaWdpbmFsU2NvcGUsIGxvY2Fscyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2l0IG1pZ2h0IGhhcHBlbiB0aGF0IHdlIGRvbid0IGhhdmUgZW5vdWdoIGluZm8gdG8gcHJvcGVybHkgcmVuZGVyIGlucHV0IHZhbHVlXG4gICAgICAgIC8vd2UgbmVlZCB0byBjaGVjayBmb3IgdGhpcyBzaXR1YXRpb24gYW5kIHNpbXBseSByZXR1cm4gbW9kZWwgdmFsdWUgaWYgd2UgY2FuJ3QgYXBwbHkgY3VzdG9tIGZvcm1hdHRpbmdcbiAgICAgICAgbG9jYWxzW3BhcnNlclJlc3VsdC5pdGVtTmFtZV0gPSBtb2RlbFZhbHVlO1xuICAgICAgICBjYW5kaWRhdGVWaWV3VmFsdWUgPSBwYXJzZXJSZXN1bHQudmlld01hcHBlcihvcmlnaW5hbFNjb3BlLCBsb2NhbHMpO1xuICAgICAgICBsb2NhbHNbcGFyc2VyUmVzdWx0Lml0ZW1OYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZW1wdHlWaWV3VmFsdWUgPSBwYXJzZXJSZXN1bHQudmlld01hcHBlcihvcmlnaW5hbFNjb3BlLCBsb2NhbHMpO1xuXG4gICAgICAgIHJldHVybiBjYW5kaWRhdGVWaWV3VmFsdWUgIT09IGVtcHR5Vmlld1ZhbHVlID8gY2FuZGlkYXRlVmlld1ZhbHVlIDogbW9kZWxWYWx1ZTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1dKVxuXG4gIC5kaXJlY3RpdmUoJ3VpYlR5cGVhaGVhZCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250cm9sbGVyOiAnVWliVHlwZWFoZWFkQ29udHJvbGxlcicsXG4gICAgICByZXF1aXJlOiBbJ25nTW9kZWwnLCAnXj9uZ01vZGVsT3B0aW9ucycsICd1aWJUeXBlYWhlYWQnXSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKG9yaWdpbmFsU2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgICBjdHJsc1syXS5pbml0KGN0cmxzWzBdLCBjdHJsc1sxXSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuICAuZGlyZWN0aXZlKCd1aWJUeXBlYWhlYWRQb3B1cCcsIFsnJCRkZWJvdW5jZScsIGZ1bmN0aW9uKCQkZGVib3VuY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NvcGU6IHtcbiAgICAgICAgbWF0Y2hlczogJz0nLFxuICAgICAgICBxdWVyeTogJz0nLFxuICAgICAgICBhY3RpdmU6ICc9JyxcbiAgICAgICAgcG9zaXRpb246ICcmJyxcbiAgICAgICAgbW92ZUluUHJvZ3Jlc3M6ICc9JyxcbiAgICAgICAgc2VsZWN0OiAnJicsXG4gICAgICAgIGFzc2lnbklzT3BlbjogJyYnLFxuICAgICAgICBkZWJvdW5jZTogJyYnXG4gICAgICB9LFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgICByZXR1cm4gYXR0cnMucG9wdXBUZW1wbGF0ZVVybCB8fCAndWliL3RlbXBsYXRlL3R5cGVhaGVhZC90eXBlYWhlYWQtcG9wdXAuaHRtbCc7XG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHNjb3BlLnRlbXBsYXRlVXJsID0gYXR0cnMudGVtcGxhdGVVcmw7XG5cbiAgICAgICAgc2NvcGUuaXNPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGlzRHJvcGRvd25PcGVuID0gc2NvcGUubWF0Y2hlcy5sZW5ndGggPiAwO1xuICAgICAgICAgIHNjb3BlLmFzc2lnbklzT3Blbih7IGlzT3BlbjogaXNEcm9wZG93bk9wZW4gfSk7XG4gICAgICAgICAgcmV0dXJuIGlzRHJvcGRvd25PcGVuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24obWF0Y2hJZHgpIHtcbiAgICAgICAgICByZXR1cm4gc2NvcGUuYWN0aXZlID09PSBtYXRjaElkeDtcbiAgICAgICAgfTtcblxuICAgICAgICBzY29wZS5zZWxlY3RBY3RpdmUgPSBmdW5jdGlvbihtYXRjaElkeCkge1xuICAgICAgICAgIHNjb3BlLmFjdGl2ZSA9IG1hdGNoSWR4O1xuICAgICAgICB9O1xuXG4gICAgICAgIHNjb3BlLnNlbGVjdE1hdGNoID0gZnVuY3Rpb24oYWN0aXZlSWR4LCBldnQpIHtcbiAgICAgICAgICB2YXIgZGVib3VuY2UgPSBzY29wZS5kZWJvdW5jZSgpO1xuICAgICAgICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKGRlYm91bmNlKSB8fCBhbmd1bGFyLmlzT2JqZWN0KGRlYm91bmNlKSkge1xuICAgICAgICAgICAgJCRkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0KHthY3RpdmVJZHg6IGFjdGl2ZUlkeCwgZXZ0OiBldnR9KTtcbiAgICAgICAgICAgIH0sIGFuZ3VsYXIuaXNOdW1iZXIoZGVib3VuY2UpID8gZGVib3VuY2UgOiBkZWJvdW5jZVsnZGVmYXVsdCddKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NvcGUuc2VsZWN0KHthY3RpdmVJZHg6IGFjdGl2ZUlkeCwgZXZ0OiBldnR9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfV0pXG5cbiAgLmRpcmVjdGl2ZSgndWliVHlwZWFoZWFkTWF0Y2gnLCBbJyR0ZW1wbGF0ZVJlcXVlc3QnLCAnJGNvbXBpbGUnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHRlbXBsYXRlUmVxdWVzdCwgJGNvbXBpbGUsICRwYXJzZSkge1xuICAgIHJldHVybiB7XG4gICAgICBzY29wZToge1xuICAgICAgICBpbmRleDogJz0nLFxuICAgICAgICBtYXRjaDogJz0nLFxuICAgICAgICBxdWVyeTogJz0nXG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciB0cGxVcmwgPSAkcGFyc2UoYXR0cnMudGVtcGxhdGVVcmwpKHNjb3BlLiRwYXJlbnQpIHx8ICd1aWIvdGVtcGxhdGUvdHlwZWFoZWFkL3R5cGVhaGVhZC1tYXRjaC5odG1sJztcbiAgICAgICAgJHRlbXBsYXRlUmVxdWVzdCh0cGxVcmwpLnRoZW4oZnVuY3Rpb24odHBsQ29udGVudCkge1xuICAgICAgICAgIHZhciB0cGxFbCA9IGFuZ3VsYXIuZWxlbWVudCh0cGxDb250ZW50LnRyaW0oKSk7XG4gICAgICAgICAgZWxlbWVudC5yZXBsYWNlV2l0aCh0cGxFbCk7XG4gICAgICAgICAgJGNvbXBpbGUodHBsRWwpKHNjb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pXG5cbiAgLmZpbHRlcigndWliVHlwZWFoZWFkSGlnaGxpZ2h0JywgWyckc2NlJywgJyRpbmplY3RvcicsICckbG9nJywgZnVuY3Rpb24oJHNjZSwgJGluamVjdG9yLCAkbG9nKSB7XG4gICAgdmFyIGlzU2FuaXRpemVQcmVzZW50O1xuICAgIGlzU2FuaXRpemVQcmVzZW50ID0gJGluamVjdG9yLmhhcygnJHNhbml0aXplJyk7XG5cbiAgICBmdW5jdGlvbiBlc2NhcGVSZWdleHAocXVlcnlUb0VzY2FwZSkge1xuICAgICAgLy8gUmVnZXg6IGNhcHR1cmUgdGhlIHdob2xlIHF1ZXJ5IHN0cmluZyBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBzdHJpbmcgdGhhdCB3aWxsIGJlIHVzZWQgdG8gbWF0Y2hcbiAgICAgIC8vIHRoZSByZXN1bHRzLCBmb3IgZXhhbXBsZSBpZiB0aGUgY2FwdHVyZSBpcyBcImFcIiB0aGUgcmVzdWx0IHdpbGwgYmUgXFxhXG4gICAgICByZXR1cm4gcXVlcnlUb0VzY2FwZS5yZXBsYWNlKC8oWy4/KiteJFtcXF1cXFxcKCl7fXwtXSkvZywgJ1xcXFwkMScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zSHRtbChtYXRjaEl0ZW0pIHtcbiAgICAgIHJldHVybiAvPC4qPi9nLnRlc3QobWF0Y2hJdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24obWF0Y2hJdGVtLCBxdWVyeSkge1xuICAgICAgaWYgKCFpc1Nhbml0aXplUHJlc2VudCAmJiBjb250YWluc0h0bWwobWF0Y2hJdGVtKSkge1xuICAgICAgICAkbG9nLndhcm4oJ1Vuc2FmZSB1c2Ugb2YgdHlwZWFoZWFkIHBsZWFzZSB1c2UgbmdTYW5pdGl6ZScpOyAvLyBXYXJuIHRoZSB1c2VyIGFib3V0IHRoZSBkYW5nZXJcbiAgICAgIH1cbiAgICAgIG1hdGNoSXRlbSA9IHF1ZXJ5ID8gKCcnICsgbWF0Y2hJdGVtKS5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnZXhwKHF1ZXJ5KSwgJ2dpJyksICc8c3Ryb25nPiQmPC9zdHJvbmc+JykgOiBtYXRjaEl0ZW07IC8vIFJlcGxhY2VzIHRoZSBjYXB0dXJlIHN0cmluZyB3aXRoIGEgdGhlIHNhbWUgc3RyaW5nIGluc2lkZSBvZiBhIFwic3Ryb25nXCIgdGFnXG4gICAgICBpZiAoIWlzU2FuaXRpemVQcmVzZW50KSB7XG4gICAgICAgIG1hdGNoSXRlbSA9ICRzY2UudHJ1c3RBc0h0bWwobWF0Y2hJdGVtKTsgLy8gSWYgJHNhbml0aXplIGlzIG5vdCBwcmVzZW50IHdlIHBhY2sgdGhlIHN0cmluZyBpbiBhICRzY2Ugb2JqZWN0IGZvciB0aGUgbmctYmluZC1odG1sIGRpcmVjdGl2ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoSXRlbTtcbiAgICB9O1xuICB9XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL2FjY29yZGlvbi9hY2NvcmRpb24tZ3JvdXAuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS9hY2NvcmRpb24vYWNjb3JkaW9uLWdyb3VwLmh0bWxcIixcbiAgICBcIjxkaXYgY2xhc3M9XFxcInBhbmVsXFxcIiBuZy1jbGFzcz1cXFwicGFuZWxDbGFzcyB8fCAncGFuZWwtZGVmYXVsdCdcXFwiPlxcblwiICtcbiAgICBcIiAgPGRpdiByb2xlPVxcXCJ0YWJcXFwiIGlkPVxcXCJ7ezo6aGVhZGluZ0lkfX1cXFwiIGFyaWEtc2VsZWN0ZWQ9XFxcInt7aXNPcGVufX1cXFwiIGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nXFxcIiBuZy1rZXlwcmVzcz1cXFwidG9nZ2xlT3BlbigkZXZlbnQpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgPGg0IGNsYXNzPVxcXCJwYW5lbC10aXRsZVxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgPGEgcm9sZT1cXFwiYnV0dG9uXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGhyZWYgYXJpYS1leHBhbmRlZD1cXFwie3tpc09wZW59fVxcXCIgYXJpYS1jb250cm9scz1cXFwie3s6OnBhbmVsSWR9fVxcXCIgdGFiaW5kZXg9XFxcIjBcXFwiIGNsYXNzPVxcXCJhY2NvcmRpb24tdG9nZ2xlXFxcIiBuZy1jbGljaz1cXFwidG9nZ2xlT3BlbigpXFxcIiB1aWItYWNjb3JkaW9uLXRyYW5zY2x1ZGU9XFxcImhlYWRpbmdcXFwiPjxzcGFuIG5nLWNsYXNzPVxcXCJ7J3RleHQtbXV0ZWQnOiBpc0Rpc2FibGVkfVxcXCI+e3toZWFkaW5nfX08L3NwYW4+PC9hPlxcblwiICtcbiAgICBcIiAgICA8L2g0PlxcblwiICtcbiAgICBcIiAgPC9kaXY+XFxuXCIgK1xuICAgIFwiICA8ZGl2IGlkPVxcXCJ7ezo6cGFuZWxJZH19XFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcInt7OjpoZWFkaW5nSWR9fVxcXCIgYXJpYS1oaWRkZW49XFxcInt7IWlzT3Blbn19XFxcIiByb2xlPVxcXCJ0YWJwYW5lbFxcXCIgY2xhc3M9XFxcInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlXFxcIiB1aWItY29sbGFwc2U9XFxcIiFpc09wZW5cXFwiPlxcblwiICtcbiAgICBcIiAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1ib2R5XFxcIiBuZy10cmFuc2NsdWRlPjwvZGl2PlxcblwiICtcbiAgICBcIiAgPC9kaXY+XFxuXCIgK1xuICAgIFwiPC9kaXY+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS9hY2NvcmRpb24vYWNjb3JkaW9uLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvYWNjb3JkaW9uL2FjY29yZGlvbi5odG1sXCIsXG4gICAgXCI8ZGl2IHJvbGU9XFxcInRhYmxpc3RcXFwiIGNsYXNzPVxcXCJwYW5lbC1ncm91cFxcXCIgbmctdHJhbnNjbHVkZT48L2Rpdj5cIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL2FsZXJ0L2FsZXJ0Lmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvYWxlcnQvYWxlcnQuaHRtbFwiLFxuICAgIFwiPGRpdiBjbGFzcz1cXFwiYWxlcnRcXFwiIG5nLWNsYXNzPVxcXCJbJ2FsZXJ0LScgKyAodHlwZSB8fCAnd2FybmluZycpLCBjbG9zZWFibGUgPyAnYWxlcnQtZGlzbWlzc2libGUnIDogbnVsbF1cXFwiIHJvbGU9XFxcImFsZXJ0XFxcIj5cXG5cIiArXG4gICAgXCIgICAgPGJ1dHRvbiBuZy1zaG93PVxcXCJjbG9zZWFibGVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIiBuZy1jbGljaz1cXFwiY2xvc2UoeyRldmVudDogJGV2ZW50fSlcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPiZ0aW1lczs8L3NwYW4+XFxuXCIgK1xuICAgIFwiICAgICAgICA8c3BhbiBjbGFzcz1cXFwic3Itb25seVxcXCI+Q2xvc2U8L3NwYW4+XFxuXCIgK1xuICAgIFwiICAgIDwvYnV0dG9uPlxcblwiICtcbiAgICBcIiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XFxuXCIgK1xuICAgIFwiPC9kaXY+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS9jYXJvdXNlbC9jYXJvdXNlbC5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL2Nhcm91c2VsL2Nhcm91c2VsLmh0bWxcIixcbiAgICBcIjxkaXYgbmctbW91c2VlbnRlcj1cXFwicGF1c2UoKVxcXCIgbmctbW91c2VsZWF2ZT1cXFwicGxheSgpXFxcIiBjbGFzcz1cXFwiY2Fyb3VzZWxcXFwiIG5nLXN3aXBlLXJpZ2h0PVxcXCJwcmV2KClcXFwiIG5nLXN3aXBlLWxlZnQ9XFxcIm5leHQoKVxcXCI+XFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJjYXJvdXNlbC1pbm5lclxcXCIgbmctdHJhbnNjbHVkZT48L2Rpdj5cXG5cIiArXG4gICAgXCIgIDxhIHJvbGU9XFxcImJ1dHRvblxcXCIgaHJlZiBjbGFzcz1cXFwibGVmdCBjYXJvdXNlbC1jb250cm9sXFxcIiBuZy1jbGljaz1cXFwicHJldigpXFxcIiBuZy1zaG93PVxcXCJzbGlkZXMubGVuZ3RoID4gMVxcXCI+XFxuXCIgK1xuICAgIFwiICAgIDxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLWxlZnRcXFwiPjwvc3Bhbj5cXG5cIiArXG4gICAgXCIgICAgPHNwYW4gY2xhc3M9XFxcInNyLW9ubHlcXFwiPnByZXZpb3VzPC9zcGFuPlxcblwiICtcbiAgICBcIiAgPC9hPlxcblwiICtcbiAgICBcIiAgPGEgcm9sZT1cXFwiYnV0dG9uXFxcIiBocmVmIGNsYXNzPVxcXCJyaWdodCBjYXJvdXNlbC1jb250cm9sXFxcIiBuZy1jbGljaz1cXFwibmV4dCgpXFxcIiBuZy1zaG93PVxcXCJzbGlkZXMubGVuZ3RoID4gMVxcXCI+XFxuXCIgK1xuICAgIFwiICAgIDxzcGFuIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXJpZ2h0XFxcIj48L3NwYW4+XFxuXCIgK1xuICAgIFwiICAgIDxzcGFuIGNsYXNzPVxcXCJzci1vbmx5XFxcIj5uZXh0PC9zcGFuPlxcblwiICtcbiAgICBcIiAgPC9hPlxcblwiICtcbiAgICBcIiAgPG9sIGNsYXNzPVxcXCJjYXJvdXNlbC1pbmRpY2F0b3JzXFxcIiBuZy1zaG93PVxcXCJzbGlkZXMubGVuZ3RoID4gMVxcXCI+XFxuXCIgK1xuICAgIFwiICAgIDxsaSBuZy1yZXBlYXQ9XFxcInNsaWRlIGluIHNsaWRlcyB8IG9yZGVyQnk6aW5kZXhPZlNsaWRlIHRyYWNrIGJ5ICRpbmRleFxcXCIgbmctY2xhc3M9XFxcInsgYWN0aXZlOiBpc0FjdGl2ZShzbGlkZSkgfVxcXCIgbmctY2xpY2s9XFxcInNlbGVjdChzbGlkZSlcXFwiPlxcblwiICtcbiAgICBcIiAgICAgIDxzcGFuIGNsYXNzPVxcXCJzci1vbmx5XFxcIj5zbGlkZSB7eyAkaW5kZXggKyAxIH19IG9mIHt7IHNsaWRlcy5sZW5ndGggfX08c3BhbiBuZy1pZj1cXFwiaXNBY3RpdmUoc2xpZGUpXFxcIj4sIGN1cnJlbnRseSBhY3RpdmU8L3NwYW4+PC9zcGFuPlxcblwiICtcbiAgICBcIiAgICA8L2xpPlxcblwiICtcbiAgICBcIiAgPC9vbD5cXG5cIiArXG4gICAgXCI8L2Rpdj5cIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL2Nhcm91c2VsL3NsaWRlLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvY2Fyb3VzZWwvc2xpZGUuaHRtbFwiLFxuICAgIFwiPGRpdiBuZy1jbGFzcz1cXFwie1xcblwiICtcbiAgICBcIiAgICAnYWN0aXZlJzogYWN0aXZlXFxuXCIgK1xuICAgIFwiICB9XFxcIiBjbGFzcz1cXFwiaXRlbSB0ZXh0LWNlbnRlclxcXCIgbmctdHJhbnNjbHVkZT48L2Rpdj5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5odG1sXCIsXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJ1aWItZGF0ZXBpY2tlclxcXCIgbmctc3dpdGNoPVxcXCJkYXRlcGlja2VyTW9kZVxcXCIgcm9sZT1cXFwiYXBwbGljYXRpb25cXFwiIG5nLWtleWRvd249XFxcImtleWRvd24oJGV2ZW50KVxcXCI+XFxuXCIgK1xuICAgIFwiICA8dWliLWRheXBpY2tlciBuZy1zd2l0Y2gtd2hlbj1cXFwiZGF5XFxcIiB0YWJpbmRleD1cXFwiMFxcXCI+PC91aWItZGF5cGlja2VyPlxcblwiICtcbiAgICBcIiAgPHVpYi1tb250aHBpY2tlciBuZy1zd2l0Y2gtd2hlbj1cXFwibW9udGhcXFwiIHRhYmluZGV4PVxcXCIwXFxcIj48L3VpYi1tb250aHBpY2tlcj5cXG5cIiArXG4gICAgXCIgIDx1aWIteWVhcnBpY2tlciBuZy1zd2l0Y2gtd2hlbj1cXFwieWVhclxcXCIgdGFiaW5kZXg9XFxcIjBcXFwiPjwvdWliLXllYXJwaWNrZXI+XFxuXCIgK1xuICAgIFwiPC9kaXY+XCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL2RheS5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvZGF5Lmh0bWxcIixcbiAgICBcIjx0YWJsZSBjbGFzcz1cXFwidWliLWRheXBpY2tlclxcXCIgcm9sZT1cXFwiZ3JpZFxcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJ7ezo6dW5pcXVlSWR9fS10aXRsZVxcXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVxcXCJ7e2FjdGl2ZURhdGVJZH19XFxcIj5cXG5cIiArXG4gICAgXCIgIDx0aGVhZD5cXG5cIiArXG4gICAgXCIgICAgPHRyPlxcblwiICtcbiAgICBcIiAgICAgIDx0aD48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1sZWZ0IHVpYi1sZWZ0XFxcIiBuZy1jbGljaz1cXFwibW92ZSgtMSlcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+PGkgY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1sZWZ0XFxcIj48L2k+PC9idXR0b24+PC90aD5cXG5cIiArXG4gICAgXCIgICAgICA8dGggY29sc3Bhbj1cXFwie3s6OjUgKyBzaG93V2Vla3N9fVxcXCI+PGJ1dHRvbiBpZD1cXFwie3s6OnVuaXF1ZUlkfX0tdGl0bGVcXFwiIHJvbGU9XFxcImhlYWRpbmdcXFwiIGFyaWEtbGl2ZT1cXFwiYXNzZXJ0aXZlXFxcIiBhcmlhLWF0b21pYz1cXFwidHJ1ZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSB1aWItdGl0bGVcXFwiIG5nLWNsaWNrPVxcXCJ0b2dnbGVNb2RlKClcXFwiIG5nLWRpc2FibGVkPVxcXCJkYXRlcGlja2VyTW9kZSA9PT0gbWF4TW9kZVxcXCIgdGFiaW5kZXg9XFxcIi0xXFxcIj48c3Ryb25nPnt7dGl0bGV9fTwvc3Ryb25nPjwvYnV0dG9uPjwvdGg+XFxuXCIgK1xuICAgIFwiICAgICAgPHRoPjxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBwdWxsLXJpZ2h0IHVpYi1yaWdodFxcXCIgbmctY2xpY2s9XFxcIm1vdmUoMSlcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+PGkgY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1yaWdodFxcXCI+PC9pPjwvYnV0dG9uPjwvdGg+XFxuXCIgK1xuICAgIFwiICAgIDwvdHI+XFxuXCIgK1xuICAgIFwiICAgIDx0cj5cXG5cIiArXG4gICAgXCIgICAgICA8dGggbmctaWY9XFxcInNob3dXZWVrc1xcXCIgY2xhc3M9XFxcInRleHQtY2VudGVyXFxcIj48L3RoPlxcblwiICtcbiAgICBcIiAgICAgIDx0aCBuZy1yZXBlYXQ9XFxcImxhYmVsIGluIDo6bGFiZWxzIHRyYWNrIGJ5ICRpbmRleFxcXCIgY2xhc3M9XFxcInRleHQtY2VudGVyXFxcIj48c21hbGwgYXJpYS1sYWJlbD1cXFwie3s6OmxhYmVsLmZ1bGx9fVxcXCI+e3s6OmxhYmVsLmFiYnJ9fTwvc21hbGw+PC90aD5cXG5cIiArXG4gICAgXCIgICAgPC90cj5cXG5cIiArXG4gICAgXCIgIDwvdGhlYWQ+XFxuXCIgK1xuICAgIFwiICA8dGJvZHk+XFxuXCIgK1xuICAgIFwiICAgIDx0ciBjbGFzcz1cXFwidWliLXdlZWtzXFxcIiBuZy1yZXBlYXQ9XFxcInJvdyBpbiByb3dzIHRyYWNrIGJ5ICRpbmRleFxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIG5nLWlmPVxcXCJzaG93V2Vla3NcXFwiIGNsYXNzPVxcXCJ0ZXh0LWNlbnRlciBoNlxcXCI+PGVtPnt7IHdlZWtOdW1iZXJzWyRpbmRleF0gfX08L2VtPjwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIG5nLXJlcGVhdD1cXFwiZHQgaW4gcm93XFxcIiBjbGFzcz1cXFwidWliLWRheSB0ZXh0LWNlbnRlclxcXCIgcm9sZT1cXFwiZ3JpZGNlbGxcXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICBpZD1cXFwie3s6OmR0LnVpZH19XFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgbmctY2xhc3M9XFxcIjo6ZHQuY3VzdG9tQ2xhc3NcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICB1aWItaXMtY2xhc3M9XFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICdidG4taW5mbycgZm9yIHNlbGVjdGVkRHQsXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgJ2FjdGl2ZScgZm9yIGFjdGl2ZUR0XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgb24gZHRcXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgIG5nLWNsaWNrPVxcXCJzZWxlY3QoZHQuZGF0ZSlcXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgIG5nLWRpc2FibGVkPVxcXCI6OmR0LmRpc2FibGVkXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICB0YWJpbmRleD1cXFwiLTFcXFwiPjxzcGFuIG5nLWNsYXNzPVxcXCI6OnsndGV4dC1tdXRlZCc6IGR0LnNlY29uZGFyeSwgJ3RleHQtaW5mbyc6IGR0LmN1cnJlbnR9XFxcIj57ezo6ZHQubGFiZWx9fTwvc3Bhbj48L2J1dHRvbj5cXG5cIiArXG4gICAgXCIgICAgICA8L3RkPlxcblwiICtcbiAgICBcIiAgICA8L3RyPlxcblwiICtcbiAgICBcIiAgPC90Ym9keT5cXG5cIiArXG4gICAgXCI8L3RhYmxlPlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9tb250aC5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvbW9udGguaHRtbFwiLFxuICAgIFwiPHRhYmxlIGNsYXNzPVxcXCJ1aWItbW9udGhwaWNrZXJcXFwiIHJvbGU9XFxcImdyaWRcXFwiIGFyaWEtbGFiZWxsZWRieT1cXFwie3s6OnVuaXF1ZUlkfX0tdGl0bGVcXFwiIGFyaWEtYWN0aXZlZGVzY2VuZGFudD1cXFwie3thY3RpdmVEYXRlSWR9fVxcXCI+XFxuXCIgK1xuICAgIFwiICA8dGhlYWQ+XFxuXCIgK1xuICAgIFwiICAgIDx0cj5cXG5cIiArXG4gICAgXCIgICAgICA8dGg+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIHB1bGwtbGVmdCB1aWItbGVmdFxcXCIgbmctY2xpY2s9XFxcIm1vdmUoLTEpXFxcIiB0YWJpbmRleD1cXFwiLTFcXFwiPjxpIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tbGVmdFxcXCI+PC9pPjwvYnV0dG9uPjwvdGg+XFxuXCIgK1xuICAgIFwiICAgICAgPHRoPjxidXR0b24gaWQ9XFxcInt7Ojp1bmlxdWVJZH19LXRpdGxlXFxcIiByb2xlPVxcXCJoZWFkaW5nXFxcIiBhcmlhLWxpdmU9XFxcImFzc2VydGl2ZVxcXCIgYXJpYS1hdG9taWM9XFxcInRydWVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4tc20gdWliLXRpdGxlXFxcIiBuZy1jbGljaz1cXFwidG9nZ2xlTW9kZSgpXFxcIiBuZy1kaXNhYmxlZD1cXFwiZGF0ZXBpY2tlck1vZGUgPT09IG1heE1vZGVcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+PHN0cm9uZz57e3RpdGxlfX08L3N0cm9uZz48L2J1dHRvbj48L3RoPlxcblwiICtcbiAgICBcIiAgICAgIDx0aD48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCB1aWItcmlnaHRcXFwiIG5nLWNsaWNrPVxcXCJtb3ZlKDEpXFxcIiB0YWJpbmRleD1cXFwiLTFcXFwiPjxpIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tcmlnaHRcXFwiPjwvaT48L2J1dHRvbj48L3RoPlxcblwiICtcbiAgICBcIiAgICA8L3RyPlxcblwiICtcbiAgICBcIiAgPC90aGVhZD5cXG5cIiArXG4gICAgXCIgIDx0Ym9keT5cXG5cIiArXG4gICAgXCIgICAgPHRyIGNsYXNzPVxcXCJ1aWItbW9udGhzXFxcIiBuZy1yZXBlYXQ9XFxcInJvdyBpbiByb3dzIHRyYWNrIGJ5ICRpbmRleFxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIG5nLXJlcGVhdD1cXFwiZHQgaW4gcm93XFxcIiBjbGFzcz1cXFwidWliLW1vbnRoIHRleHQtY2VudGVyXFxcIiByb2xlPVxcXCJncmlkY2VsbFxcXCJcXG5cIiArXG4gICAgXCIgICAgICAgIGlkPVxcXCJ7ezo6ZHQudWlkfX1cXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICBuZy1jbGFzcz1cXFwiOjpkdC5jdXN0b21DbGFzc1xcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCJcXG5cIiArXG4gICAgXCIgICAgICAgICAgdWliLWlzLWNsYXNzPVxcXCJcXG5cIiArXG4gICAgXCIgICAgICAgICAgICAnYnRuLWluZm8nIGZvciBzZWxlY3RlZER0LFxcblwiICtcbiAgICBcIiAgICAgICAgICAgICdhY3RpdmUnIGZvciBhY3RpdmVEdFxcblwiICtcbiAgICBcIiAgICAgICAgICAgIG9uIGR0XFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICBuZy1jbGljaz1cXFwic2VsZWN0KGR0LmRhdGUpXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICBuZy1kaXNhYmxlZD1cXFwiOjpkdC5kaXNhYmxlZFxcXCJcXG5cIiArXG4gICAgXCIgICAgICAgICAgdGFiaW5kZXg9XFxcIi0xXFxcIj48c3BhbiBuZy1jbGFzcz1cXFwiOjp7J3RleHQtaW5mbyc6IGR0LmN1cnJlbnR9XFxcIj57ezo6ZHQubGFiZWx9fTwvc3Bhbj48L2J1dHRvbj5cXG5cIiArXG4gICAgXCIgICAgICA8L3RkPlxcblwiICtcbiAgICBcIiAgICA8L3RyPlxcblwiICtcbiAgICBcIiAgPC90Ym9keT5cXG5cIiArXG4gICAgXCI8L3RhYmxlPlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvZGF0ZXBpY2tlci9wb3B1cC5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL2RhdGVwaWNrZXIvcG9wdXAuaHRtbFwiLFxuICAgIFwiPGRpdj5cXG5cIiArXG4gICAgXCIgIDx1bCBjbGFzcz1cXFwidWliLWRhdGVwaWNrZXItcG9wdXAgZHJvcGRvd24tbWVudVxcXCIgZHJvcGRvd24tbmVzdGVkIG5nLWlmPVxcXCJpc09wZW5cXFwiIG5nLXN0eWxlPVxcXCJ7dG9wOiBwb3NpdGlvbi50b3ArJ3B4JywgbGVmdDogcG9zaXRpb24ubGVmdCsncHgnfVxcXCIgbmcta2V5ZG93bj1cXFwia2V5ZG93bigkZXZlbnQpXFxcIiBuZy1jbGljaz1cXFwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgPGxpIG5nLXRyYW5zY2x1ZGU+PC9saT5cXG5cIiArXG4gICAgXCIgICAgPGxpIG5nLWlmPVxcXCJzaG93QnV0dG9uQmFyXFxcIiBjbGFzcz1cXFwidWliLWJ1dHRvbi1iYXJcXFwiPlxcblwiICtcbiAgICBcIiAgICA8c3BhbiBjbGFzcz1cXFwiYnRuLWdyb3VwIHB1bGwtbGVmdFxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXNtIGJ0bi1pbmZvIHVpYi1kYXRlcGlja2VyLWN1cnJlbnRcXFwiIG5nLWNsaWNrPVxcXCJzZWxlY3QoJ3RvZGF5JylcXFwiIG5nLWRpc2FibGVkPVxcXCJpc0Rpc2FibGVkKCd0b2RheScpXFxcIj57eyBnZXRUZXh0KCdjdXJyZW50JykgfX08L2J1dHRvbj5cXG5cIiArXG4gICAgXCIgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tc20gYnRuLWRhbmdlciB1aWItY2xlYXJcXFwiIG5nLWNsaWNrPVxcXCJzZWxlY3QobnVsbClcXFwiPnt7IGdldFRleHQoJ2NsZWFyJykgfX08L2J1dHRvbj5cXG5cIiArXG4gICAgXCIgICAgPC9zcGFuPlxcblwiICtcbiAgICBcIiAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1zbSBidG4tc3VjY2VzcyBwdWxsLXJpZ2h0IHVpYi1jbG9zZVxcXCIgbmctY2xpY2s9XFxcImNsb3NlKClcXFwiPnt7IGdldFRleHQoJ2Nsb3NlJykgfX08L2J1dHRvbj5cXG5cIiArXG4gICAgXCIgICAgPC9saT5cXG5cIiArXG4gICAgXCIgIDwvdWw+XFxuXCIgK1xuICAgIFwiPC9kaXY+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL3llYXIuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS9kYXRlcGlja2VyL3llYXIuaHRtbFwiLFxuICAgIFwiPHRhYmxlIGNsYXNzPVxcXCJ1aWIteWVhcnBpY2tlclxcXCIgcm9sZT1cXFwiZ3JpZFxcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJ7ezo6dW5pcXVlSWR9fS10aXRsZVxcXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVxcXCJ7e2FjdGl2ZURhdGVJZH19XFxcIj5cXG5cIiArXG4gICAgXCIgIDx0aGVhZD5cXG5cIiArXG4gICAgXCIgICAgPHRyPlxcblwiICtcbiAgICBcIiAgICAgIDx0aD48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1sZWZ0IHVpYi1sZWZ0XFxcIiBuZy1jbGljaz1cXFwibW92ZSgtMSlcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+PGkgY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1sZWZ0XFxcIj48L2k+PC9idXR0b24+PC90aD5cXG5cIiArXG4gICAgXCIgICAgICA8dGggY29sc3Bhbj1cXFwie3s6OmNvbHVtbnMgLSAyfX1cXFwiPjxidXR0b24gaWQ9XFxcInt7Ojp1bmlxdWVJZH19LXRpdGxlXFxcIiByb2xlPVxcXCJoZWFkaW5nXFxcIiBhcmlhLWxpdmU9XFxcImFzc2VydGl2ZVxcXCIgYXJpYS1hdG9taWM9XFxcInRydWVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4tc20gdWliLXRpdGxlXFxcIiBuZy1jbGljaz1cXFwidG9nZ2xlTW9kZSgpXFxcIiBuZy1kaXNhYmxlZD1cXFwiZGF0ZXBpY2tlck1vZGUgPT09IG1heE1vZGVcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+PHN0cm9uZz57e3RpdGxlfX08L3N0cm9uZz48L2J1dHRvbj48L3RoPlxcblwiICtcbiAgICBcIiAgICAgIDx0aD48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBidG4tc20gcHVsbC1yaWdodCB1aWItcmlnaHRcXFwiIG5nLWNsaWNrPVxcXCJtb3ZlKDEpXFxcIiB0YWJpbmRleD1cXFwiLTFcXFwiPjxpIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tcmlnaHRcXFwiPjwvaT48L2J1dHRvbj48L3RoPlxcblwiICtcbiAgICBcIiAgICA8L3RyPlxcblwiICtcbiAgICBcIiAgPC90aGVhZD5cXG5cIiArXG4gICAgXCIgIDx0Ym9keT5cXG5cIiArXG4gICAgXCIgICAgPHRyIGNsYXNzPVxcXCJ1aWIteWVhcnNcXFwiIG5nLXJlcGVhdD1cXFwicm93IGluIHJvd3MgdHJhY2sgYnkgJGluZGV4XFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8dGQgbmctcmVwZWF0PVxcXCJkdCBpbiByb3dcXFwiIGNsYXNzPVxcXCJ1aWIteWVhciB0ZXh0LWNlbnRlclxcXCIgcm9sZT1cXFwiZ3JpZGNlbGxcXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICBpZD1cXFwie3s6OmR0LnVpZH19XFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgbmctY2xhc3M9XFxcIjo6ZHQuY3VzdG9tQ2xhc3NcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgIHVpYi1pcy1jbGFzcz1cXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgJ2J0bi1pbmZvJyBmb3Igc2VsZWN0ZWREdCxcXG5cIiArXG4gICAgXCIgICAgICAgICAgICAnYWN0aXZlJyBmb3IgYWN0aXZlRHRcXG5cIiArXG4gICAgXCIgICAgICAgICAgICBvbiBkdFxcXCJcXG5cIiArXG4gICAgXCIgICAgICAgICAgbmctY2xpY2s9XFxcInNlbGVjdChkdC5kYXRlKVxcXCJcXG5cIiArXG4gICAgXCIgICAgICAgICAgbmctZGlzYWJsZWQ9XFxcIjo6ZHQuZGlzYWJsZWRcXFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgIHRhYmluZGV4PVxcXCItMVxcXCI+PHNwYW4gbmctY2xhc3M9XFxcIjo6eyd0ZXh0LWluZm8nOiBkdC5jdXJyZW50fVxcXCI+e3s6OmR0LmxhYmVsfX08L3NwYW4+PC9idXR0b24+XFxuXCIgK1xuICAgIFwiICAgICAgPC90ZD5cXG5cIiArXG4gICAgXCIgICAgPC90cj5cXG5cIiArXG4gICAgXCIgIDwvdGJvZHk+XFxuXCIgK1xuICAgIFwiPC90YWJsZT5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL21vZGFsL2JhY2tkcm9wLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvbW9kYWwvYmFja2Ryb3AuaHRtbFwiLFxuICAgIFwiPGRpdiBjbGFzcz1cXFwibW9kYWwtYmFja2Ryb3BcXFwiXFxuXCIgK1xuICAgIFwiICAgICB1aWItbW9kYWwtYW5pbWF0aW9uLWNsYXNzPVxcXCJmYWRlXFxcIlxcblwiICtcbiAgICBcIiAgICAgbW9kYWwtaW4tY2xhc3M9XFxcImluXFxcIlxcblwiICtcbiAgICBcIiAgICAgbmctc3R5bGU9XFxcInsnei1pbmRleCc6IDEwNDAgKyAoaW5kZXggJiYgMSB8fCAwKSArIGluZGV4KjEwfVxcXCJcXG5cIiArXG4gICAgXCI+PC9kaXY+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS9tb2RhbC93aW5kb3cuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS9tb2RhbC93aW5kb3cuaHRtbFwiLFxuICAgIFwiPGRpdiBtb2RhbC1yZW5kZXI9XFxcInt7JGlzUmVuZGVyZWR9fVxcXCIgdGFiaW5kZXg9XFxcIi0xXFxcIiByb2xlPVxcXCJkaWFsb2dcXFwiIGNsYXNzPVxcXCJtb2RhbFxcXCJcXG5cIiArXG4gICAgXCIgICAgdWliLW1vZGFsLWFuaW1hdGlvbi1jbGFzcz1cXFwiZmFkZVxcXCJcXG5cIiArXG4gICAgXCIgICAgbW9kYWwtaW4tY2xhc3M9XFxcImluXFxcIlxcblwiICtcbiAgICBcIiAgICBuZy1zdHlsZT1cXFwieyd6LWluZGV4JzogMTA1MCArIGluZGV4KjEwLCBkaXNwbGF5OiAnYmxvY2snfVxcXCI+XFxuXCIgK1xuICAgIFwiICAgIDxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZyB7e3NpemUgPyAnbW9kYWwtJyArIHNpemUgOiAnJ319XFxcIj48ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIiB1aWItbW9kYWwtdHJhbnNjbHVkZT48L2Rpdj48L2Rpdj5cXG5cIiArXG4gICAgXCI8L2Rpdj5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL3BhZ2VyL3BhZ2VyLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvcGFnZXIvcGFnZXIuaHRtbFwiLFxuICAgIFwiPHVsIGNsYXNzPVxcXCJwYWdlclxcXCI+XFxuXCIgK1xuICAgIFwiICA8bGkgbmctY2xhc3M9XFxcIntkaXNhYmxlZDogbm9QcmV2aW91cygpfHxuZ0Rpc2FibGVkLCBwcmV2aW91czogYWxpZ259XFxcIj48YSBocmVmIG5nLWNsaWNrPVxcXCJzZWxlY3RQYWdlKHBhZ2UgLSAxLCAkZXZlbnQpXFxcIj57ezo6Z2V0VGV4dCgncHJldmlvdXMnKX19PC9hPjwvbGk+XFxuXCIgK1xuICAgIFwiICA8bGkgbmctY2xhc3M9XFxcIntkaXNhYmxlZDogbm9OZXh0KCl8fG5nRGlzYWJsZWQsIG5leHQ6IGFsaWdufVxcXCI+PGEgaHJlZiBuZy1jbGljaz1cXFwic2VsZWN0UGFnZShwYWdlICsgMSwgJGV2ZW50KVxcXCI+e3s6OmdldFRleHQoJ25leHQnKX19PC9hPjwvbGk+XFxuXCIgK1xuICAgIFwiPC91bD5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5odG1sXCIsXG4gICAgXCI8dWwgY2xhc3M9XFxcInBhZ2luYXRpb25cXFwiPlxcblwiICtcbiAgICBcIiAgPGxpIG5nLWlmPVxcXCI6OmJvdW5kYXJ5TGlua3NcXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vUHJldmlvdXMoKXx8bmdEaXNhYmxlZH1cXFwiIGNsYXNzPVxcXCJwYWdpbmF0aW9uLWZpcnN0XFxcIj48YSBocmVmIG5nLWNsaWNrPVxcXCJzZWxlY3RQYWdlKDEsICRldmVudClcXFwiPnt7OjpnZXRUZXh0KCdmaXJzdCcpfX08L2E+PC9saT5cXG5cIiArXG4gICAgXCIgIDxsaSBuZy1pZj1cXFwiOjpkaXJlY3Rpb25MaW5rc1xcXCIgbmctY2xhc3M9XFxcIntkaXNhYmxlZDogbm9QcmV2aW91cygpfHxuZ0Rpc2FibGVkfVxcXCIgY2xhc3M9XFxcInBhZ2luYXRpb24tcHJldlxcXCI+PGEgaHJlZiBuZy1jbGljaz1cXFwic2VsZWN0UGFnZShwYWdlIC0gMSwgJGV2ZW50KVxcXCI+e3s6OmdldFRleHQoJ3ByZXZpb3VzJyl9fTwvYT48L2xpPlxcblwiICtcbiAgICBcIiAgPGxpIG5nLXJlcGVhdD1cXFwicGFnZSBpbiBwYWdlcyB0cmFjayBieSAkaW5kZXhcXFwiIG5nLWNsYXNzPVxcXCJ7YWN0aXZlOiBwYWdlLmFjdGl2ZSxkaXNhYmxlZDogbmdEaXNhYmxlZCYmIXBhZ2UuYWN0aXZlfVxcXCIgY2xhc3M9XFxcInBhZ2luYXRpb24tcGFnZVxcXCI+PGEgaHJlZiBuZy1jbGljaz1cXFwic2VsZWN0UGFnZShwYWdlLm51bWJlciwgJGV2ZW50KVxcXCI+e3twYWdlLnRleHR9fTwvYT48L2xpPlxcblwiICtcbiAgICBcIiAgPGxpIG5nLWlmPVxcXCI6OmRpcmVjdGlvbkxpbmtzXFxcIiBuZy1jbGFzcz1cXFwie2Rpc2FibGVkOiBub05leHQoKXx8bmdEaXNhYmxlZH1cXFwiIGNsYXNzPVxcXCJwYWdpbmF0aW9uLW5leHRcXFwiPjxhIGhyZWYgbmctY2xpY2s9XFxcInNlbGVjdFBhZ2UocGFnZSArIDEsICRldmVudClcXFwiPnt7OjpnZXRUZXh0KCduZXh0Jyl9fTwvYT48L2xpPlxcblwiICtcbiAgICBcIiAgPGxpIG5nLWlmPVxcXCI6OmJvdW5kYXJ5TGlua3NcXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vTmV4dCgpfHxuZ0Rpc2FibGVkfVxcXCIgY2xhc3M9XFxcInBhZ2luYXRpb24tbGFzdFxcXCI+PGEgaHJlZiBuZy1jbGljaz1cXFwic2VsZWN0UGFnZSh0b3RhbFBhZ2VzLCAkZXZlbnQpXFxcIj57ezo6Z2V0VGV4dCgnbGFzdCcpfX08L2E+PC9saT5cXG5cIiArXG4gICAgXCI8L3VsPlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvdG9vbHRpcC90b29sdGlwLWh0bWwtcG9wdXAuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS90b29sdGlwL3Rvb2x0aXAtaHRtbC1wb3B1cC5odG1sXCIsXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJ0b29sdGlwXFxcIlxcblwiICtcbiAgICBcIiAgdG9vbHRpcC1hbmltYXRpb24tY2xhc3M9XFxcImZhZGVcXFwiXFxuXCIgK1xuICAgIFwiICB1aWItdG9vbHRpcC1jbGFzc2VzXFxuXCIgK1xuICAgIFwiICBuZy1jbGFzcz1cXFwieyBpbjogaXNPcGVuKCkgfVxcXCI+XFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJ0b29sdGlwLWFycm93XFxcIj48L2Rpdj5cXG5cIiArXG4gICAgXCIgIDxkaXYgY2xhc3M9XFxcInRvb2x0aXAtaW5uZXJcXFwiIG5nLWJpbmQtaHRtbD1cXFwiY29udGVudEV4cCgpXFxcIj48L2Rpdj5cXG5cIiArXG4gICAgXCI8L2Rpdj5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL3Rvb2x0aXAvdG9vbHRpcC1wb3B1cC5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3Rvb2x0aXAvdG9vbHRpcC1wb3B1cC5odG1sXCIsXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJ0b29sdGlwXFxcIlxcblwiICtcbiAgICBcIiAgdG9vbHRpcC1hbmltYXRpb24tY2xhc3M9XFxcImZhZGVcXFwiXFxuXCIgK1xuICAgIFwiICB1aWItdG9vbHRpcC1jbGFzc2VzXFxuXCIgK1xuICAgIFwiICBuZy1jbGFzcz1cXFwieyBpbjogaXNPcGVuKCkgfVxcXCI+XFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJ0b29sdGlwLWFycm93XFxcIj48L2Rpdj5cXG5cIiArXG4gICAgXCIgIDxkaXYgY2xhc3M9XFxcInRvb2x0aXAtaW5uZXJcXFwiIG5nLWJpbmQ9XFxcImNvbnRlbnRcXFwiPjwvZGl2PlxcblwiICtcbiAgICBcIjwvZGl2PlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvdG9vbHRpcC90b29sdGlwLXRlbXBsYXRlLXBvcHVwLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvdG9vbHRpcC90b29sdGlwLXRlbXBsYXRlLXBvcHVwLmh0bWxcIixcbiAgICBcIjxkaXYgY2xhc3M9XFxcInRvb2x0aXBcXFwiXFxuXCIgK1xuICAgIFwiICB0b29sdGlwLWFuaW1hdGlvbi1jbGFzcz1cXFwiZmFkZVxcXCJcXG5cIiArXG4gICAgXCIgIHVpYi10b29sdGlwLWNsYXNzZXNcXG5cIiArXG4gICAgXCIgIG5nLWNsYXNzPVxcXCJ7IGluOiBpc09wZW4oKSB9XFxcIj5cXG5cIiArXG4gICAgXCIgIDxkaXYgY2xhc3M9XFxcInRvb2x0aXAtYXJyb3dcXFwiPjwvZGl2PlxcblwiICtcbiAgICBcIiAgPGRpdiBjbGFzcz1cXFwidG9vbHRpcC1pbm5lclxcXCJcXG5cIiArXG4gICAgXCIgICAgdWliLXRvb2x0aXAtdGVtcGxhdGUtdHJhbnNjbHVkZT1cXFwiY29udGVudEV4cCgpXFxcIlxcblwiICtcbiAgICBcIiAgICB0b29sdGlwLXRlbXBsYXRlLXRyYW5zY2x1ZGUtc2NvcGU9XFxcIm9yaWdpblNjb3BlKClcXFwiPjwvZGl2PlxcblwiICtcbiAgICBcIjwvZGl2PlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvcG9wb3Zlci9wb3BvdmVyLWh0bWwuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS9wb3BvdmVyL3BvcG92ZXItaHRtbC5odG1sXCIsXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJwb3BvdmVyXFxcIlxcblwiICtcbiAgICBcIiAgdG9vbHRpcC1hbmltYXRpb24tY2xhc3M9XFxcImZhZGVcXFwiXFxuXCIgK1xuICAgIFwiICB1aWItdG9vbHRpcC1jbGFzc2VzXFxuXCIgK1xuICAgIFwiICBuZy1jbGFzcz1cXFwieyBpbjogaXNPcGVuKCkgfVxcXCI+XFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJhcnJvd1xcXCI+PC9kaXY+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJwb3BvdmVyLWlubmVyXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8aDMgY2xhc3M9XFxcInBvcG92ZXItdGl0bGVcXFwiIG5nLWJpbmQ9XFxcInRpdGxlXFxcIiBuZy1pZj1cXFwidGl0bGVcXFwiPjwvaDM+XFxuXCIgK1xuICAgIFwiICAgICAgPGRpdiBjbGFzcz1cXFwicG9wb3Zlci1jb250ZW50XFxcIiBuZy1iaW5kLWh0bWw9XFxcImNvbnRlbnRFeHAoKVxcXCI+PC9kaXY+XFxuXCIgK1xuICAgIFwiICA8L2Rpdj5cXG5cIiArXG4gICAgXCI8L2Rpdj5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL3BvcG92ZXIvcG9wb3Zlci10ZW1wbGF0ZS5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3BvcG92ZXIvcG9wb3Zlci10ZW1wbGF0ZS5odG1sXCIsXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJwb3BvdmVyXFxcIlxcblwiICtcbiAgICBcIiAgdG9vbHRpcC1hbmltYXRpb24tY2xhc3M9XFxcImZhZGVcXFwiXFxuXCIgK1xuICAgIFwiICB1aWItdG9vbHRpcC1jbGFzc2VzXFxuXCIgK1xuICAgIFwiICBuZy1jbGFzcz1cXFwieyBpbjogaXNPcGVuKCkgfVxcXCI+XFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJhcnJvd1xcXCI+PC9kaXY+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICA8ZGl2IGNsYXNzPVxcXCJwb3BvdmVyLWlubmVyXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8aDMgY2xhc3M9XFxcInBvcG92ZXItdGl0bGVcXFwiIG5nLWJpbmQ9XFxcInRpdGxlXFxcIiBuZy1pZj1cXFwidGl0bGVcXFwiPjwvaDM+XFxuXCIgK1xuICAgIFwiICAgICAgPGRpdiBjbGFzcz1cXFwicG9wb3Zlci1jb250ZW50XFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgdWliLXRvb2x0aXAtdGVtcGxhdGUtdHJhbnNjbHVkZT1cXFwiY29udGVudEV4cCgpXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgdG9vbHRpcC10ZW1wbGF0ZS10cmFuc2NsdWRlLXNjb3BlPVxcXCJvcmlnaW5TY29wZSgpXFxcIj48L2Rpdj5cXG5cIiArXG4gICAgXCIgIDwvZGl2PlxcblwiICtcbiAgICBcIjwvZGl2PlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvcG9wb3Zlci9wb3BvdmVyLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvcG9wb3Zlci9wb3BvdmVyLmh0bWxcIixcbiAgICBcIjxkaXYgY2xhc3M9XFxcInBvcG92ZXJcXFwiXFxuXCIgK1xuICAgIFwiICB0b29sdGlwLWFuaW1hdGlvbi1jbGFzcz1cXFwiZmFkZVxcXCJcXG5cIiArXG4gICAgXCIgIHVpYi10b29sdGlwLWNsYXNzZXNcXG5cIiArXG4gICAgXCIgIG5nLWNsYXNzPVxcXCJ7IGluOiBpc09wZW4oKSB9XFxcIj5cXG5cIiArXG4gICAgXCIgIDxkaXYgY2xhc3M9XFxcImFycm93XFxcIj48L2Rpdj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgIDxkaXYgY2xhc3M9XFxcInBvcG92ZXItaW5uZXJcXFwiPlxcblwiICtcbiAgICBcIiAgICAgIDxoMyBjbGFzcz1cXFwicG9wb3Zlci10aXRsZVxcXCIgbmctYmluZD1cXFwidGl0bGVcXFwiIG5nLWlmPVxcXCJ0aXRsZVxcXCI+PC9oMz5cXG5cIiArXG4gICAgXCIgICAgICA8ZGl2IGNsYXNzPVxcXCJwb3BvdmVyLWNvbnRlbnRcXFwiIG5nLWJpbmQ9XFxcImNvbnRlbnRcXFwiPjwvZGl2PlxcblwiICtcbiAgICBcIiAgPC9kaXY+XFxuXCIgK1xuICAgIFwiPC9kaXY+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS9wcm9ncmVzc2Jhci9iYXIuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS9wcm9ncmVzc2Jhci9iYXIuaHRtbFwiLFxuICAgIFwiPGRpdiBjbGFzcz1cXFwicHJvZ3Jlc3MtYmFyXFxcIiBuZy1jbGFzcz1cXFwidHlwZSAmJiAncHJvZ3Jlc3MtYmFyLScgKyB0eXBlXFxcIiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwie3t2YWx1ZX19XFxcIiBhcmlhLXZhbHVlbWluPVxcXCIwXFxcIiBhcmlhLXZhbHVlbWF4PVxcXCJ7e21heH19XFxcIiBuZy1zdHlsZT1cXFwie3dpZHRoOiAocGVyY2VudCA8IDEwMCA/IHBlcmNlbnQgOiAxMDApICsgJyUnfVxcXCIgYXJpYS12YWx1ZXRleHQ9XFxcInt7cGVyY2VudCB8IG51bWJlcjowfX0lXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcInt7Ojp0aXRsZX19XFxcIiBuZy10cmFuc2NsdWRlPjwvZGl2PlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3MuaHRtbFwiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInVpYi90ZW1wbGF0ZS9wcm9ncmVzc2Jhci9wcm9ncmVzcy5odG1sXCIsXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJwcm9ncmVzc1xcXCIgbmctdHJhbnNjbHVkZSBhcmlhLWxhYmVsbGVkYnk9XFxcInt7Ojp0aXRsZX19XFxcIj48L2Rpdj5cIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL3Byb2dyZXNzYmFyL3Byb2dyZXNzYmFyLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIuaHRtbFwiLFxuICAgIFwiPGRpdiBjbGFzcz1cXFwicHJvZ3Jlc3NcXFwiPlxcblwiICtcbiAgICBcIiAgPGRpdiBjbGFzcz1cXFwicHJvZ3Jlc3MtYmFyXFxcIiBuZy1jbGFzcz1cXFwidHlwZSAmJiAncHJvZ3Jlc3MtYmFyLScgKyB0eXBlXFxcIiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwie3t2YWx1ZX19XFxcIiBhcmlhLXZhbHVlbWluPVxcXCIwXFxcIiBhcmlhLXZhbHVlbWF4PVxcXCJ7e21heH19XFxcIiBuZy1zdHlsZT1cXFwie3dpZHRoOiAocGVyY2VudCA8IDEwMCA/IHBlcmNlbnQgOiAxMDApICsgJyUnfVxcXCIgYXJpYS12YWx1ZXRleHQ9XFxcInt7cGVyY2VudCB8IG51bWJlcjowfX0lXFxcIiBhcmlhLWxhYmVsbGVkYnk9XFxcInt7Ojp0aXRsZX19XFxcIiBuZy10cmFuc2NsdWRlPjwvZGl2PlxcblwiICtcbiAgICBcIjwvZGl2PlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvcmF0aW5nL3JhdGluZy5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3JhdGluZy9yYXRpbmcuaHRtbFwiLFxuICAgIFwiPHNwYW4gbmctbW91c2VsZWF2ZT1cXFwicmVzZXQoKVxcXCIgbmcta2V5ZG93bj1cXFwib25LZXlkb3duKCRldmVudClcXFwiIHRhYmluZGV4PVxcXCIwXFxcIiByb2xlPVxcXCJzbGlkZXJcXFwiIGFyaWEtdmFsdWVtaW49XFxcIjBcXFwiIGFyaWEtdmFsdWVtYXg9XFxcInt7cmFuZ2UubGVuZ3RofX1cXFwiIGFyaWEtdmFsdWVub3c9XFxcInt7dmFsdWV9fVxcXCI+XFxuXCIgK1xuICAgIFwiICAgIDxzcGFuIG5nLXJlcGVhdC1zdGFydD1cXFwiciBpbiByYW5nZSB0cmFjayBieSAkaW5kZXhcXFwiIGNsYXNzPVxcXCJzci1vbmx5XFxcIj4oe3sgJGluZGV4IDwgdmFsdWUgPyAnKicgOiAnICcgfX0pPC9zcGFuPlxcblwiICtcbiAgICBcIiAgICA8aSBuZy1yZXBlYXQtZW5kIG5nLW1vdXNlZW50ZXI9XFxcImVudGVyKCRpbmRleCArIDEpXFxcIiBuZy1jbGljaz1cXFwicmF0ZSgkaW5kZXggKyAxKVxcXCIgY2xhc3M9XFxcImdseXBoaWNvblxcXCIgbmctY2xhc3M9XFxcIiRpbmRleCA8IHZhbHVlICYmIChyLnN0YXRlT24gfHwgJ2dseXBoaWNvbi1zdGFyJykgfHwgKHIuc3RhdGVPZmYgfHwgJ2dseXBoaWNvbi1zdGFyLWVtcHR5JylcXFwiIG5nLWF0dHItdGl0bGU9XFxcInt7ci50aXRsZX19XFxcIiBhcmlhLXZhbHVldGV4dD1cXFwie3tyLnRpdGxlfX1cXFwiPjwvaT5cXG5cIiArXG4gICAgXCI8L3NwYW4+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZShcInVpYi90ZW1wbGF0ZS90YWJzL3RhYi5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3RhYnMvdGFiLmh0bWxcIixcbiAgICBcIjxsaSBuZy1jbGFzcz1cXFwie2FjdGl2ZTogYWN0aXZlLCBkaXNhYmxlZDogZGlzYWJsZWR9XFxcIiBjbGFzcz1cXFwidWliLXRhYlxcXCI+XFxuXCIgK1xuICAgIFwiICA8YSBocmVmIG5nLWNsaWNrPVxcXCJzZWxlY3QoKVxcXCIgdWliLXRhYi1oZWFkaW5nLXRyYW5zY2x1ZGU+e3toZWFkaW5nfX08L2E+XFxuXCIgK1xuICAgIFwiPC9saT5cXG5cIiArXG4gICAgXCJcIik7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKFwidWliL3RlbXBsYXRlL3RhYnMvdGFic2V0Lmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvdGFicy90YWJzZXQuaHRtbFwiLFxuICAgIFwiPGRpdj5cXG5cIiArXG4gICAgXCIgIDx1bCBjbGFzcz1cXFwibmF2IG5hdi17e3R5cGUgfHwgJ3RhYnMnfX1cXFwiIG5nLWNsYXNzPVxcXCJ7J25hdi1zdGFja2VkJzogdmVydGljYWwsICduYXYtanVzdGlmaWVkJzoganVzdGlmaWVkfVxcXCIgbmctdHJhbnNjbHVkZT48L3VsPlxcblwiICtcbiAgICBcIiAgPGRpdiBjbGFzcz1cXFwidGFiLWNvbnRlbnRcXFwiPlxcblwiICtcbiAgICBcIiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWItcGFuZVxcXCIgXFxuXCIgK1xuICAgIFwiICAgICAgICAgbmctcmVwZWF0PVxcXCJ0YWIgaW4gdGFic1xcXCIgXFxuXCIgK1xuICAgIFwiICAgICAgICAgbmctY2xhc3M9XFxcInthY3RpdmU6IHRhYi5hY3RpdmV9XFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgIHVpYi10YWItY29udGVudC10cmFuc2NsdWRlPVxcXCJ0YWJcXFwiPlxcblwiICtcbiAgICBcIiAgICA8L2Rpdj5cXG5cIiArXG4gICAgXCIgIDwvZGl2PlxcblwiICtcbiAgICBcIjwvZGl2PlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvdGltZXBpY2tlci90aW1lcGlja2VyLmh0bWxcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoXCJ1aWIvdGVtcGxhdGUvdGltZXBpY2tlci90aW1lcGlja2VyLmh0bWxcIixcbiAgICBcIjx0YWJsZSBjbGFzcz1cXFwidWliLXRpbWVwaWNrZXJcXFwiPlxcblwiICtcbiAgICBcIiAgPHRib2R5PlxcblwiICtcbiAgICBcIiAgICA8dHIgY2xhc3M9XFxcInRleHQtY2VudGVyXFxcIiBuZy1zaG93PVxcXCI6OnNob3dTcGlubmVyc1xcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIGNsYXNzPVxcXCJ1aWItaW5jcmVtZW50IGhvdXJzXFxcIj48YSBuZy1jbGljaz1cXFwiaW5jcmVtZW50SG91cnMoKVxcXCIgbmctY2xhc3M9XFxcIntkaXNhYmxlZDogbm9JbmNyZW1lbnRIb3VycygpfVxcXCIgY2xhc3M9XFxcImJ0biBidG4tbGlua1xcXCIgbmctZGlzYWJsZWQ9XFxcIm5vSW5jcmVtZW50SG91cnMoKVxcXCIgdGFiaW5kZXg9XFxcInt7Ojp0YWJpbmRleH19XFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXVwXFxcIj48L3NwYW4+PC9hPjwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkPiZuYnNwOzwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIGNsYXNzPVxcXCJ1aWItaW5jcmVtZW50IG1pbnV0ZXNcXFwiPjxhIG5nLWNsaWNrPVxcXCJpbmNyZW1lbnRNaW51dGVzKClcXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vSW5jcmVtZW50TWludXRlcygpfVxcXCIgY2xhc3M9XFxcImJ0biBidG4tbGlua1xcXCIgbmctZGlzYWJsZWQ9XFxcIm5vSW5jcmVtZW50TWludXRlcygpXFxcIiB0YWJpbmRleD1cXFwie3s6OnRhYmluZGV4fX1cXFwiPjxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tdXBcXFwiPjwvc3Bhbj48L2E+PC90ZD5cXG5cIiArXG4gICAgXCIgICAgICA8dGQgbmctc2hvdz1cXFwic2hvd1NlY29uZHNcXFwiPiZuYnNwOzwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIG5nLXNob3c9XFxcInNob3dTZWNvbmRzXFxcIiBjbGFzcz1cXFwidWliLWluY3JlbWVudCBzZWNvbmRzXFxcIj48YSBuZy1jbGljaz1cXFwiaW5jcmVtZW50U2Vjb25kcygpXFxcIiBuZy1jbGFzcz1cXFwie2Rpc2FibGVkOiBub0luY3JlbWVudFNlY29uZHMoKX1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWxpbmtcXFwiIG5nLWRpc2FibGVkPVxcXCJub0luY3JlbWVudFNlY29uZHMoKVxcXCIgdGFiaW5kZXg9XFxcInt7Ojp0YWJpbmRleH19XFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXVwXFxcIj48L3NwYW4+PC9hPjwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIG5nLXNob3c9XFxcInNob3dNZXJpZGlhblxcXCI+PC90ZD5cXG5cIiArXG4gICAgXCIgICAgPC90cj5cXG5cIiArXG4gICAgXCIgICAgPHRyPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZCBjbGFzcz1cXFwiZm9ybS1ncm91cCB1aWItdGltZSBob3Vyc1xcXCIgbmctY2xhc3M9XFxcInsnaGFzLWVycm9yJzogaW52YWxpZEhvdXJzfVxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgICA8aW5wdXQgc3R5bGU9XFxcIndpZHRoOjUwcHg7XFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiSEhcXFwiIG5nLW1vZGVsPVxcXCJob3Vyc1xcXCIgbmctY2hhbmdlPVxcXCJ1cGRhdGVIb3VycygpXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sIHRleHQtY2VudGVyXFxcIiBuZy1yZWFkb25seT1cXFwiOjpyZWFkb25seUlucHV0XFxcIiBtYXhsZW5ndGg9XFxcIjJcXFwiIHRhYmluZGV4PVxcXCJ7ezo6dGFiaW5kZXh9fVxcXCIgbmctZGlzYWJsZWQ9XFxcIm5vSW5jcmVtZW50SG91cnMoKVxcXCIgbmctYmx1cj1cXFwiYmx1cigpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8L3RkPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZCBjbGFzcz1cXFwidWliLXNlcGFyYXRvclxcXCI+OjwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIGNsYXNzPVxcXCJmb3JtLWdyb3VwIHVpYi10aW1lIG1pbnV0ZXNcXFwiIG5nLWNsYXNzPVxcXCJ7J2hhcy1lcnJvcic6IGludmFsaWRNaW51dGVzfVxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgICA8aW5wdXQgc3R5bGU9XFxcIndpZHRoOjUwcHg7XFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiTU1cXFwiIG5nLW1vZGVsPVxcXCJtaW51dGVzXFxcIiBuZy1jaGFuZ2U9XFxcInVwZGF0ZU1pbnV0ZXMoKVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbCB0ZXh0LWNlbnRlclxcXCIgbmctcmVhZG9ubHk9XFxcIjo6cmVhZG9ubHlJbnB1dFxcXCIgbWF4bGVuZ3RoPVxcXCIyXFxcIiB0YWJpbmRleD1cXFwie3s6OnRhYmluZGV4fX1cXFwiIG5nLWRpc2FibGVkPVxcXCJub0luY3JlbWVudE1pbnV0ZXMoKVxcXCIgbmctYmx1cj1cXFwiYmx1cigpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8L3RkPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZCBuZy1zaG93PVxcXCJzaG93U2Vjb25kc1xcXCIgY2xhc3M9XFxcInVpYi1zZXBhcmF0b3JcXFwiPjo8L3RkPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZCBjbGFzcz1cXFwiZm9ybS1ncm91cCB1aWItdGltZSBzZWNvbmRzXFxcIiBuZy1jbGFzcz1cXFwieydoYXMtZXJyb3InOiBpbnZhbGlkU2Vjb25kc31cXFwiIG5nLXNob3c9XFxcInNob3dTZWNvbmRzXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICAgIDxpbnB1dCBzdHlsZT1cXFwid2lkdGg6NTBweDtcXFwiIHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJTU1xcXCIgbmctbW9kZWw9XFxcInNlY29uZHNcXFwiIG5nLWNoYW5nZT1cXFwidXBkYXRlU2Vjb25kcygpXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sIHRleHQtY2VudGVyXFxcIiBuZy1yZWFkb25seT1cXFwicmVhZG9ubHlJbnB1dFxcXCIgbWF4bGVuZ3RoPVxcXCIyXFxcIiB0YWJpbmRleD1cXFwie3s6OnRhYmluZGV4fX1cXFwiIG5nLWRpc2FibGVkPVxcXCJub0luY3JlbWVudFNlY29uZHMoKVxcXCIgbmctYmx1cj1cXFwiYmx1cigpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8L3RkPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZCBuZy1zaG93PVxcXCJzaG93TWVyaWRpYW5cXFwiIGNsYXNzPVxcXCJ1aWItdGltZSBhbS1wbVxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vVG9nZ2xlTWVyaWRpYW4oKX1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHQgdGV4dC1jZW50ZXJcXFwiIG5nLWNsaWNrPVxcXCJ0b2dnbGVNZXJpZGlhbigpXFxcIiBuZy1kaXNhYmxlZD1cXFwibm9Ub2dnbGVNZXJpZGlhbigpXFxcIiB0YWJpbmRleD1cXFwie3s6OnRhYmluZGV4fX1cXFwiPnt7bWVyaWRpYW59fTwvYnV0dG9uPjwvdGQ+XFxuXCIgK1xuICAgIFwiICAgIDwvdHI+XFxuXCIgK1xuICAgIFwiICAgIDx0ciBjbGFzcz1cXFwidGV4dC1jZW50ZXJcXFwiIG5nLXNob3c9XFxcIjo6c2hvd1NwaW5uZXJzXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICA8dGQgY2xhc3M9XFxcInVpYi1kZWNyZW1lbnQgaG91cnNcXFwiPjxhIG5nLWNsaWNrPVxcXCJkZWNyZW1lbnRIb3VycygpXFxcIiBuZy1jbGFzcz1cXFwie2Rpc2FibGVkOiBub0RlY3JlbWVudEhvdXJzKCl9XFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1saW5rXFxcIiBuZy1kaXNhYmxlZD1cXFwibm9EZWNyZW1lbnRIb3VycygpXFxcIiB0YWJpbmRleD1cXFwie3s6OnRhYmluZGV4fX1cXFwiPjxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tZG93blxcXCI+PC9zcGFuPjwvYT48L3RkPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZD4mbmJzcDs8L3RkPlxcblwiICtcbiAgICBcIiAgICAgIDx0ZCBjbGFzcz1cXFwidWliLWRlY3JlbWVudCBtaW51dGVzXFxcIj48YSBuZy1jbGljaz1cXFwiZGVjcmVtZW50TWludXRlcygpXFxcIiBuZy1jbGFzcz1cXFwie2Rpc2FibGVkOiBub0RlY3JlbWVudE1pbnV0ZXMoKX1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWxpbmtcXFwiIG5nLWRpc2FibGVkPVxcXCJub0RlY3JlbWVudE1pbnV0ZXMoKVxcXCIgdGFiaW5kZXg9XFxcInt7Ojp0YWJpbmRleH19XFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLWRvd25cXFwiPjwvc3Bhbj48L2E+PC90ZD5cXG5cIiArXG4gICAgXCIgICAgICA8dGQgbmctc2hvdz1cXFwic2hvd1NlY29uZHNcXFwiPiZuYnNwOzwvdGQ+XFxuXCIgK1xuICAgIFwiICAgICAgPHRkIG5nLXNob3c9XFxcInNob3dTZWNvbmRzXFxcIiBjbGFzcz1cXFwidWliLWRlY3JlbWVudCBzZWNvbmRzXFxcIj48YSBuZy1jbGljaz1cXFwiZGVjcmVtZW50U2Vjb25kcygpXFxcIiBuZy1jbGFzcz1cXFwie2Rpc2FibGVkOiBub0RlY3JlbWVudFNlY29uZHMoKX1cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWxpbmtcXFwiIG5nLWRpc2FibGVkPVxcXCJub0RlY3JlbWVudFNlY29uZHMoKVxcXCIgdGFiaW5kZXg9XFxcInt7Ojp0YWJpbmRleH19XFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLWRvd25cXFwiPjwvc3Bhbj48L2E+PC90ZD5cXG5cIiArXG4gICAgXCIgICAgICA8dGQgbmctc2hvdz1cXFwic2hvd01lcmlkaWFuXFxcIj48L3RkPlxcblwiICtcbiAgICBcIiAgICA8L3RyPlxcblwiICtcbiAgICBcIiAgPC90Ym9keT5cXG5cIiArXG4gICAgXCI8L3RhYmxlPlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvdHlwZWFoZWFkL3R5cGVhaGVhZC1tYXRjaC5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3R5cGVhaGVhZC90eXBlYWhlYWQtbWF0Y2guaHRtbFwiLFxuICAgIFwiPGEgaHJlZlxcblwiICtcbiAgICBcIiAgIHRhYmluZGV4PVxcXCItMVxcXCJcXG5cIiArXG4gICAgXCIgICBuZy1iaW5kLWh0bWw9XFxcIm1hdGNoLmxhYmVsIHwgdWliVHlwZWFoZWFkSGlnaGxpZ2h0OnF1ZXJ5XFxcIlxcblwiICtcbiAgICBcIiAgIG5nLWF0dHItdGl0bGU9XFxcInt7bWF0Y2gubGFiZWx9fVxcXCI+PC9hPlxcblwiICtcbiAgICBcIlwiKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoXCJ1aWIvdGVtcGxhdGUvdHlwZWFoZWFkL3R5cGVhaGVhZC1wb3B1cC5odG1sXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KFwidWliL3RlbXBsYXRlL3R5cGVhaGVhZC90eXBlYWhlYWQtcG9wdXAuaHRtbFwiLFxuICAgIFwiPHVsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIiBuZy1zaG93PVxcXCJpc09wZW4oKSAmJiAhbW92ZUluUHJvZ3Jlc3NcXFwiIG5nLXN0eWxlPVxcXCJ7dG9wOiBwb3NpdGlvbigpLnRvcCsncHgnLCBsZWZ0OiBwb3NpdGlvbigpLmxlZnQrJ3B4J31cXFwiIHJvbGU9XFxcImxpc3Rib3hcXFwiIGFyaWEtaGlkZGVuPVxcXCJ7eyFpc09wZW4oKX19XFxcIj5cXG5cIiArXG4gICAgXCIgICAgPGxpIG5nLXJlcGVhdD1cXFwibWF0Y2ggaW4gbWF0Y2hlcyB0cmFjayBieSAkaW5kZXhcXFwiIG5nLWNsYXNzPVxcXCJ7YWN0aXZlOiBpc0FjdGl2ZSgkaW5kZXgpIH1cXFwiIG5nLW1vdXNlZW50ZXI9XFxcInNlbGVjdEFjdGl2ZSgkaW5kZXgpXFxcIiBuZy1jbGljaz1cXFwic2VsZWN0TWF0Y2goJGluZGV4LCAkZXZlbnQpXFxcIiByb2xlPVxcXCJvcHRpb25cXFwiIGlkPVxcXCJ7ezo6bWF0Y2guaWR9fVxcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgICA8ZGl2IHVpYi10eXBlYWhlYWQtbWF0Y2ggaW5kZXg9XFxcIiRpbmRleFxcXCIgbWF0Y2g9XFxcIm1hdGNoXFxcIiBxdWVyeT1cXFwicXVlcnlcXFwiIHRlbXBsYXRlLXVybD1cXFwidGVtcGxhdGVVcmxcXFwiPjwvZGl2PlxcblwiICtcbiAgICBcIiAgICA8L2xpPlxcblwiICtcbiAgICBcIjwvdWw+XFxuXCIgK1xuICAgIFwiXCIpO1xufV0pO1xuYW5ndWxhci5tb2R1bGUoJ3VpLmJvb3RzdHJhcC5jYXJvdXNlbCcpLnJ1bihmdW5jdGlvbigpIHshYW5ndWxhci4kJGNzcCgpLm5vSW5saW5lU3R5bGUgJiYgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdoZWFkJykucHJlcGVuZCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPi5uZy1hbmltYXRlLml0ZW06bm90KC5sZWZ0KTpub3QoLnJpZ2h0KXstd2Via2l0LXRyYW5zaXRpb246MHMgZWFzZS1pbi1vdXQgbGVmdDt0cmFuc2l0aW9uOjBzIGVhc2UtaW4tb3V0IGxlZnR9PC9zdHlsZT4nKTsgfSk7XG5hbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmRhdGVwaWNrZXInKS5ydW4oZnVuY3Rpb24oKSB7IWFuZ3VsYXIuJCRjc3AoKS5ub0lubGluZVN0eWxlICYmIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnaGVhZCcpLnByZXBlbmQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4udWliLWRhdGVwaWNrZXIgLnVpYi10aXRsZXt3aWR0aDoxMDAlO30udWliLWRheSBidXR0b24sLnVpYi1tb250aCBidXR0b24sLnVpYi15ZWFyIGJ1dHRvbnttaW4td2lkdGg6MTAwJTt9LnVpYi1kYXRlcGlja2VyLXBvcHVwLmRyb3Bkb3duLW1lbnV7ZGlzcGxheTpibG9jazt9LnVpYi1idXR0b24tYmFye3BhZGRpbmc6MTBweCA5cHggMnB4O308L3N0eWxlPicpOyB9KTtcbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAudGltZXBpY2tlcicpLnJ1bihmdW5jdGlvbigpIHshYW5ndWxhci4kJGNzcCgpLm5vSW5saW5lU3R5bGUgJiYgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdoZWFkJykucHJlcGVuZCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPi51aWItdGltZSBpbnB1dHt3aWR0aDo1MHB4O308L3N0eWxlPicpOyB9KTtcbmFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAudHlwZWFoZWFkJykucnVuKGZ1bmN0aW9uKCkgeyFhbmd1bGFyLiQkY3NwKCkubm9JbmxpbmVTdHlsZSAmJiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2hlYWQnKS5wcmVwZW5kKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+W3VpYi10eXBlYWhlYWQtcG9wdXBdLmRyb3Bkb3duLW1lbnV7ZGlzcGxheTpibG9jazt9PC9zdHlsZT4nKTsgfSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlJoNFRweVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfMmFjZjkwOTkuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlJoNFRweVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJSaDRUcHlcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlJoNFRweVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJSaDRUcHlcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSJdfQ==
