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
    .controller('ChatCtrl', function($scope, $http, Chat, $timeout) {
      var username = localStorage.getItem('username');
      $http.get('/channels')
        .success(function(data) {
          $scope.servers = data;
        });

      $scope.sendMsg = function() {
        if ($scope.text !== '') {
          Chat.send({from: username, text: $scope.text, when: new Date()});
          $scope.text = '';
        }
      };

      $scope.chatMessages = [];
      $scope.$on('messageReceived', function(event, msg) {
        if (msg.text) {
          $timeout($scope.chatMessages.push(msg));
        }
      })
    });

  // services
  angular.module('ansible')
    .factory('Chat', function($rootScope) {
      var socket = io.connect(location.origin);
      socket.on('connect', function() {
        console.log('connected');
      });
      socket.on('message', function (msg) {
        $rootScope.$broadcast('messageReceived', msg);
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
