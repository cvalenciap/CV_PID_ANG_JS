'use strict';

/**
 * Registro de Auditoria Controller
 */

app.controller('AuditRegistroCtrl', ['$scope','ValidatorUtil','FunctionUtil','AuditoriasService',AuditRegistroCtrl]);

function AuditRegistroCtrl($scope,ValidatorUtil,FunctionUtil,AuditoriasService) {

	/**
     * Common
     */    
    var appTitle = 'Registro de Logs';

    var init = function() {
        $scope.results = [];
        $scope.filterResults = [];

        /**
            Common variables
        **/
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;

        $scope.fechaInicio =  new Date();
        $scope.fechaFin =  new Date();

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        FunctionUtil.registrarFuncionesManejoAlertas($scope);
        
        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);
    };

    $scope.consultarRegistroLogs = function(){
        $scope.limpiarAlertas();

        $scope.loading = true;
        $scope.searching = false;
        $scope.haveResult = false;
        if($scope.fechaInicio != null && $scope.fechaFin != null && $scope.fechaInicio !== undefined && $scope.fechaFin !== undefined){  
            AuditoriasService.getRegistroLogs($scope.fechaInicio, $scope.fechaFin)
            .then(function(response){
                $scope.loading = false;
                if(response.data.status == 1){
                    $scope.searching = true;
                    $scope.results = response.data.data;
                    $scope.haveResult = $scope.results.length !== 0;
                    if ($scope.haveResult){
                        $scope.currentPage = 1;
                        $scope.getDataInPage();
                        $scope.addInfoAlert('Se encontraron ' + $scope.results.length + ' resultado(s)', false);
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
            if($scope.fechaInicio == null || $scope.fechaInicio === undefined){
                $scope.addErrorAlert('Fecha de inicio no válida', false);
            } else if($scope.fechaFin == null || $scope.fechaFin === undefined){
                $scope.addErrorAlert('Fecha de fin no válida', false);
            }
        }
    };

    $scope.validarFechaInicio = function(){
        if($scope.fechaFin != null && $scope.fechaFin !== undefined && $scope.fechaFin < $scope.fechaInicio){
            $scope.addErrorAlert('La fecha de inicio no puede ser mayor a la fecha de fin.', false);
            $scope.fechaInicio = null;
        } else {
            $scope.limpiarAlertas();
        }
    };

    $scope.validarFechaFin = function(){
        if($scope.fechaInicio != null && $scope.fechaInicio !== undefined && $scope.fechaFin < $scope.fechaInicio){
            $scope.addErrorAlert('La fecha de fin no puede ser menor a la fecha de inicio.', false);
            $scope.fechaFin = null;
        } else {
            $scope.limpiarAlertas();
        }
    };

    $scope.$watch("currentPage + numPerPage", function() {
        $scope.getDataInPage();
    });

    $scope.getDataInPage = function(){
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterResults = $scope.results.slice(begin, end);
    };

    $scope.exportExcel = function(){
        var dayS = $scope.fechaInicio.getDay();
        var monthS = $scope.fechaInicio.getMonth();
        var yearS = $scope.fechaInicio.getFullYear();

        var dayF = $scope.fechaFin.getDay();
        var monthF = $scope.fechaFin.getMonth();
        var yearF = $scope.fechaFin.getFullYear();

        var searchField = dayS + "_" + monthS +"_" + yearS + "-" + dayF + "_" + monthF +"_" + yearF;
        var fileName = "RegistroAuditorias_" + searchField + ".xls";
        var blob = new Blob([document.getElementById('export-table-registro').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, fileName);
    };

    init();

}
  