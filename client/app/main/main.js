'use strict';

angular.module('threeParticlePhysics')
  .config(function($stateProvider) {
      $stateProvider
          .state('main', {
              url: '/',
              templateUrl: 'app/main/main.html',
              controller: 'MainController',
              controllerAs: 'main'
          });
  });
