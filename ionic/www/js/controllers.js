angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.developers = [
    { title: 'Frontend', id: 1 },
    { title: '.Net', id: 2 },
    { title: 'Mobile', id: 3 },
    { title: 'PHP', id: 4 },
    { title: 'Wordpress', id: 5 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('ProfileCtrl', function($scope, $http) {
  $scope.single = function(image) {
    var formData = new FormData();
    formData.append('image', image, image.name);
    $http.post('upload', formData, {
        headers: { 'Content-Type': false },
        transformRequest: angular.identity
    }).success(function(result) {
        $scope.uploadedImgSrc = result.src;
    });
  };
});