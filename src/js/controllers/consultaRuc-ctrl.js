'use strict';

/**
 * Consulta RUC Controller
 */

app.controller('ConsRucCtrl', ['$scope','Auth','ValidatorUtil','FunctionUtil','ConsultasService', 'WebservicesService' , ConsRucCtrl]);

function ConsRucCtrl($scope,Auth,ValidatorUtil,FunctionUtil,ConsultasService,WebservicesService) {

	/**
     * Common
     */    
    var appTitle = 'Consulta Ruc';

    var init = function() {
        $scope.result = {};

        /**
            Common variables
        **/
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;
        
        $scope.showFlag = false;
        $scope.wsWorks = false;
        $scope.wsWorksMessage = "El servicio no se encuentra habilitado por ahora";

        FunctionUtil.registrarFuncionesManejoAlertas($scope);

        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);

        verificarEstadoWs();
    };

    $scope.consultarRuc = function(){
        $scope.limpiarAlertas();

        if(ValidatorUtil.isRucFormat($scope.ruc)){
            $scope.loading = true;
            $scope.searching = false;
            $scope.haveResult = false;

            ConsultasService.getByRuc($scope.ruc)
            .then(function(response){
                $scope.loading = false;
                if(response.data.status == 1){
                    $scope.searching = true;
                    var results = response.data.data;
                    if (results.length != 0){
                        $scope.addInfoAlert('Se encontraron resultados', false);
                        $scope.haveResult = true;
                        $scope.result = results[0];
                    } else {
                        $scope.addWarningAlert('No se encontraron resultados', false);
                        $scope.haveResult = false;
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
            $scope.addErrorAlert('RUC de consulta no válido', false);
        }
    };

    var verificarEstadoWs = function(){
        WebservicesService.verificarWsRuc()
            .then(function(response){
                console.log(response.data);
                $scope.showFlag = true;
                if(response.data.status === 1){
                    $scope.wsWorks = response.data.data;
                    $scope.wsWorksMessage = response.data.message;
                } else {
                    $scope.wsWorks = false;
                }
            })
            .catch(function(error){
                $scope.showFlag = true;
                $scope.wsWorks = false;
            });
    };

    $scope.exportPdf = function(){
        var doc = new jsPDF('l', 'pt','a4');
        var exportDate = new Date();
        var dateString = exportDate.toLocaleString();

        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text('CONSULTA DE RUC - PIDE+', 321, 55, null, null, 'center');

        doc.setFontSize(11);
        doc.setFontType("normal");
        doc.text('RUC de consulta: ', 90, 90);
        doc.text($scope.ruc.toString(), 205, 90);

        doc.text('Fecha de exportacion: ', 90, 105);
        doc.text(dateString, 205, 105);

        doc.text('Usuario: ', 90, 120);
        doc.text(Auth.user.username, 205, 120);

        doc.setFontSize(12);
        doc.setFontType("italic");
        doc.text('RESULTADO:', 90, 145);

        doc.setFontSize(10);
        doc.setFontType("normal");
        doc.text('Razon Social' , 90, 170);
        doc.text('RUC', 90, 185);
        doc.text('Dirección' , 90, 200);
        doc.text('Estado',90,215);
        doc.text('Condicion' , 90, 230);
        doc.text('Teléfono' , 90, 245);
        doc.text('Representante Legal' , 90, 260);
        doc.text('Otros' , 90, 275);

        doc.setFontSize(8);
        doc.setFontType("normal");
        doc.text($scope.result.razon_social, 205, 170);
        doc.text($scope.result.ruc, 205, 185);
        doc.text($scope.result.direccion , 205, 200);
        doc.text($scope.result.estado,205,215);
        doc.text($scope.result.condicion, 205, 230);
        doc.text($scope.result.telefono, 205, 245);
        doc.text($scope.result.representate_legal, 205, 260);
        doc.text($scope.result.otro, 205, 275);

        doc.line(195, 155, 195, 280);

        doc.line(85, 173, 755, 173);
        doc.line(85, 188, 755, 188);
        doc.line(85, 203, 755, 203);
        doc.line(85, 218, 755, 218);
        doc.line(85, 233, 755, 233);
        doc.line(85, 248, 755, 248);
        doc.line(85, 263, 755, 263);

        doc.rect(85,155,670,125);

        var fileName = 'consulta_ruc_' + dateString + '.pdf';

        doc.save(fileName);
    };

    $scope.limpiarConsulta = function(){
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.ruc = "";
        $scope.result = {}

        $scope.limpiarAlertas();
    };

    init();

}
  