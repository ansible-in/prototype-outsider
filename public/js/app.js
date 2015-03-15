(function() {
  'use strict';

  angular.module('ansible', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/join', {templateUrl: 'partial/join.html', controller: 'JoinCtrl'})
        .when('/', {templateUrl: 'partial/chat.html', controller: 'ChatCtrl'})
        .otherwise({redirectTo: '/'});
      $locationProvider.html5Mode(true);
    })
    .run(function($location) {
      var hasUsername = localStorage.getItem('username');
      if (!hasUsername) {
        $location.path('join');
      } else {
        $location.path('');
      }

      var socket = io.connect('http://localhost:3000');
      socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
      });
    });

  // controllers
  angular.module('ansible')
    .controller('JoinCtrl', function($scope, $http, $location) {
      $scope.submit = function() {
        if ($scope.username) {
          $http.post('/join', {username: $scope.username})
            .success(function(data, status, headers, config) {
              localStorage.setItem('username', $scope.username);
              $location.path('');
            })
            .error(function(data, status, headers, config) {
              $scope.error = data.msg;
            });
        }
      };
    })
    .controller('ChatCtrl', function($scope, $http) {
      $http.get('/channels')
        .success(function(data) {
          $scope.servers = data;
        });
    });

  // services
})();
