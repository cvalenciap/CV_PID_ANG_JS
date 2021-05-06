/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Objeto:           app
 *   Descripcion:      Controlador de carácteristicas generales sobre las vistas
 *   Autor:            
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Historia de modificaciones:
 *   Requerimiento:        Autor:           Fecha:         Descripcion:
 *   REQ2086 - RSIS005 	   cvalenciap	    10/01/2018     Creación de redirección a la vista actualizarCredencial.html en el config	 		 
 * ---------------------------------------------------------------------------------------------------------------------------
 */
'use strict';

var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

var app = angular.module('PideWeb', ['ui.bootstrap', 'ui.router', 'ui.router.state.events','ngStorage','ngTable','ui.validate','angular-spinkit','ui.utils']);

app.constants = {
    backend_path : env.backend_path
};

app.help_messages = env.help_messages;

/**
 * Route configuration for the RDash module.
 */
app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$qProvider',
    function($stateProvider, $urlRouterProvider,$httpProvider,$qProvider) {

        var access = routingConfig.accessLevels;

        // Anonymous routes
        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.anon
                }
            })
            .state('anon.login', {
                url: '/',
                templateUrl: 'templates/login.html'
            });
            
        // Common user routes
        $stateProvider
            .state('common', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.common
                }
            })
            .state('common.dashboard', {
                url: '/home',
                templateUrl: 'templates/dashboard.html'
            })
            .state('common.consultaDni', {
                url: '/consultasDni',
                templateUrl: 'templates/consultas/consultasDni.html'
            })
            .state('common.consultaRuc', {
                url: '/consultaRuc',
                templateUrl: 'templates/consultas/consultaRuc.html'
            })
            .state('common.consultaTitularidad', {
                url: '/consultaTitularidad',
                templateUrl: 'templates/consultas/consultaTitularidad.html'
            })
            .state('common.consultaListaAsientos', {
                url: '/consultaListaAsientos',
                templateUrl: 'templates/consultas/consultaListaAsientos.html'
            })
            .state('common.auditoriaRegistro', {
                url: '/auditoriaRegistro',
                templateUrl: 'templates/auditorias/auditoriaRegistro.html'
            })
            .state('common.auditoriaResumen', {
                url: '/auditoriaResumen',
                templateUrl: 'templates/auditorias/auditoriaResumen.html'
            })
            //REQ2086 - RSIS005 - INICIO
            .state('common.actualizarCredencial', {
                url: '/actualizarCredencial',
                templateUrl: 'templates/consultas/actualizarCredencial.html'
            })
            //REQ2086 - RSIS005 - FIN
            ;

        $urlRouterProvider.otherwise(function ($injector, $location) {
          $injector.get('$state').transitionTo('common.dashboard', null, {
            location: false
          });
        });

        $httpProvider.interceptors.push(['$q','$location',function($q,$location) {
            return {
                responseError: function(response) {
                    var path = $location.path();
                    if( (response.status === 401 || response.status === 403 
                        || response.status === 302 )&& (path!=="/") ) {
                        alert("Session expirada!")
                        sessionStorage.clear(); 
                        window.location.href="/";                           
                        //$location.path('/');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            }
        }]);

        $qProvider.errorOnUnhandledRejections(false);
    }
]);

//Only needed for Breeze. Maps Q (used by default in Breeze) to Angular's $q to avoid having to call scope.$apply() 
app.run(['$q', '$rootScope', '$timeout', '$state', 'Auth',
    function ($q, $rootScope, $timeout, $state, Auth) {

        $rootScope.help_messages = app.help_messages;

        $rootScope.$on('$stateChangeStart', function (event, toState) {

            if (!Auth.authorize(toState.data.access)) {
               
                $rootScope.error = "No tienes los permisos suficientes para esta opción.";
                $timeout(function() {
                    $rootScope.error = null;
                }, 4000);
                event.preventDefault();

                if(Auth.isLoggedIn()) {
                    $state.go('common.dashboard');
                }
                else {
                    $state.go('anon.login');
                }
            }
        });
}]);