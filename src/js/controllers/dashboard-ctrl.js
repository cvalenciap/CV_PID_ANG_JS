'use strict';

/**
 * Dashboard Controller
 */

app.controller('DashboardCtrl', ['$scope', 'FunctionUtil', DashboardCtrl]);

function DashboardCtrl($scope, FunctionUtil) {
    /**
     * Common
     */
    var appTitle = 'Inicio';
    
    var init = function(){
        FunctionUtil.registrarFuncionesManejoAlertas($scope);
        
        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);
    };    

    init();

}