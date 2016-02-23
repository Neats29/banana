angular.module("profileUpload", [])
  
  .controller("profileUploadController", ['$scope', '$http', function($scope, $http) {

    $scope.master = {};

    $scope.update = function(user) {
      $scope.master = angular.copy(user);

      var myURL = 'http://banana-onbaord.herokuapp.com/api/employees';
      var myData = $scope.master;
      
      $http.put(myURL, myData);
    };

}])