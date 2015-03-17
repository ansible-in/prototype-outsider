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
    .controller('ChatCtrl', function($scope, $http, Chat) {
      $http.get('/channels')
        .success(function(data) {
          $scope.servers = data;
        });

      $scope.sendMsg = function() {
        console.log($scope.text);

      };
    });

  // services
  angular.module('ansible')
    .factory('Chat', function() {
      var socket = io.connect(location.origin);
      socket.on('connect', function() {
        console.log('connected');
      });
      socket.on('message', function (msg) {
        console.log(msg);
      });
      return {
        join: function() {

        },
        send: function(msg) {
          socket.send(msg);
        }
      };
    });
})();
