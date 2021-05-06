'use strict';

/**
 * Resumen de Auditoria Controller
 */

app.controller('AuditResumenCtrl', ['$scope','FunctionUtil','AuditoriasService',AuditResumenCtrl]);

function AuditResumenCtrl($scope,FunctionUtil,AuditoriasService) {

	/**
     * Common
     */    
    var appTitle = 'Resumen de Logs';

    var init = function() {
        $scope.results = [];

        /**
            Common variables
        **/
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.monthYear =  new Date();
        
        FunctionUtil.registrarFuncionesManejoAlertas($scope);
        
        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);
    };

    $scope.consultarResumenLogs = function(){
        $scope.limpiarAlertas();

        $scope.loading = true;
        $scope.searching = false;
        $scope.haveResult = false;
        if($scope.monthYear != null && $scope.monthYear != null){
            AuditoriasService.getResumenLogs($scope.monthYear)
            .then(function(response){
                $scope.loading = false;
                if(response.data.status == 1){
                    $scope.searching = true;
                    $scope.results = response.data.data;
                    $scope.haveResult = true;

                    var totalConsultas = 0;
                    for (var i = 0; i < $scope.results.length; i++) {
                        var consulta = $scope.results[i];
                        totalConsultas += consulta.cantidad_consultas;
                    }

                    if (totalConsultas !== 0){
                        $scope.addInfoAlert('Se encontraron ' + totalConsultas + ' resultado(s)', false);
                    } else {
                        $scope.addWarningAlert('No se encontraron resultados', false);
                    }
                } else {
                    $scope.searching = false;
                    $scope.haveResult = false;
                    $scope.addErrorAlert('Hubo un error en el resultado de la consulta.', false);
                }
            })
            .catch(function(error){
                $scope.loading = false;
                $scope.searching = false;
                $scope.haveResult = false;
                $scope.addErrorAlert('Error al realizar la consulta.', false);
            });
        } else {
            $scope.loading = false;
            $scope.searching = false;
            $scope.haveResult = false;
            $scope.addErrorAlert('La fecha ingresada no es válido', false);
        }
    };

    $scope.exportExcel = function(){
        var monthIndex = $scope.monthYear.getMonth();
        var year = $scope.monthYear.getFullYear();
        var searchField = monthIndex + "_" + year;
        var fileName = "ResumenAuditorias_" + searchField + ".xls";
        var blob = new Blob([document.getElementById('export-table-resumen').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, fileName);
    };

    init();

}
  