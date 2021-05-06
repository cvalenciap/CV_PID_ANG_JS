'use strict';

/**
 * Master Controller
 */

app.controller('MasterCtrl', ['$scope', '$sessionStorage', 'Auth','$location', '$state', '$timeout', 'GetOpcionesMenuUtil',MasterCtrl]);

function MasterCtrl($scope, $sessionStorage,Auth,$location,$state,$timeout,GetOpcionesMenuUtil) {
    
    /**
    *  Auth Logic
    */    
    $scope.user = Auth.user;
    $scope.userRoles = routingConfig.userRoles;
    $scope.accessLevels = routingConfig.accessLevels; 

    /**
     * Common
     */

    var appTitle = 'Inicio';

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.evaluateWidth = function (newValue,ignoreCookie){
        if(!Auth.isLoggedIn()){
           $scope.toggle = false; 
           return;
        }else{
            obtenerVistasMenu($sessionStorage['views']);
        }

        if(ignoreCookie ==undefined){
            ignoreCookie = false;
        }

        if (newValue >= mobileView) {
            if (angular.isDefined($sessionStorage['toggle'])) {
                if(ignoreCookie == false){
                    $scope.toggle = ! $sessionStorage['toggle'] ? false : true;  
                }else{
                    $scope.toggle = true;
                }
                
            } else {
                $scope.toggle = true;                
            }
        } else {
            $scope.toggle = false;
        }  
    };

    var init = function(){
        $scope.changeViewTitle(appTitle);
    };    

    var obtenerVistasMenu = function(opciones){
        $scope.consultas = [];
        $scope.auditoria = [];

        angular.forEach(opciones, function(val){
            var menuItem = GetOpcionesMenuUtil.obteneOpcion(val);

            if(menuItem.opcion === 'CON'){
                $scope.consultas.push(menuItem);
            }
            if(menuItem.opcion === 'LOG'){
                $scope.auditoria.push(menuItem);
            }
        });
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {        
        $scope.evaluateWidth (newValue);
    });

    $scope.toggleSidebar = function() {
        var tmpToggle = $scope.toggle;
        $scope.toggle = !tmpToggle;
        $sessionStorage['toggle'] = $scope.toggle;
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.changeViewTitle = function(newValue) {
        $scope.appTitle = newValue;
    };

    $scope.logout = function(){
        Auth.callLogout(); 
        $scope.evaluateWidth($scope.getWidth());
        $scope.toggle = false;
        Auth.changeUser({ username: '', role:  $scope.userRoles.public });
        $location.path("/");        
    };

    init();

}