/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Objeto:           consultaDni-ctrl
 *   Descripcion:      Controlador de vista consultasDni.html
 *   Autor:            
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Historia de modificaciones:
 *   Requerimiento:        Autor:           Fecha:         Descripcion:
 *   REQ2086    	   cvalenciap	    10/01/2018     Adecuación de funciones para muestra de datos de la consulta de DNI
 *							   Adecuación de funciones para nueva estructura de archivo PDF	 		 
 * ---------------------------------------------------------------------------------------------------------------------------
 */
 'use strict';


//REQ2086 - RSIS004 - INICIO
app.controller('ConsDniCtrl', ['$scope','Auth','ValidatorUtil','FunctionUtil','ConsultasService', 'WebservicesService', '$filter','$uibModal', ConsDniCtrl]);
//REQ2086 - RSIS004 - FIN

//REQ2086 - RSIS004 - INICIO
app.filter('bytetobase', function () {
    return function (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
});
//REQ2086 - RSIS004 - FIN

//REQ2086 - RSIS004 - INICIO
function ConsDniCtrl( $scope,Auth,ValidatorUtil,FunctionUtil,ConsultasService,WebservicesService, $filter, $uibModal) {
//REQ2086 - RSIS004 - FIN

	/**
     * Common
     */    
    var appTitle = 'Consulta Dni';

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

    $scope.consultarDni = function(){
        $scope.limpiarAlertas();

        if(ValidatorUtil.isDNIFormat($scope.dni)){
            $scope.loading = true;
            $scope.searching = false;
            $scope.haveResult = false;

            //REQ2086 - RSIS003 - INICIO
            ConsultasService.getByDni($scope.dni, Auth.user.username)
            .then(function(response){
                $scope.loading = false;
                var message = response.data.message;
                if(response.data.status == 1){
                    $scope.searching = true;
                    var results = response.data.data;
                    if (results.length != 0){
                        $scope.addInfoAlert(message, false);
                        $scope.haveResult = true;
                        $scope.result = results[0];
                    } else {
                        $scope.addWarningAlert(message, false);
                        $scope.haveResult = false;
                    }
                } else {
                    $scope.searching = false;
                    $scope.haveResult = false;
                    $scope.addErrorAlert(message, false);
                }
            })
            .catch(function(error){
                $scope.loading = false;
                $scope.searching = false;
                $scope.haveResult = false;
                $scope.addErrorAlert('Error al realizar la consulta.' , false);
            });
	    //REQ2086 - RSIS003 - FIN
        } else {
            $scope.loading = false;
            $scope.searching = false;
            $scope.haveResult = false;
            $scope.addErrorAlert('DNI de consulta no válido', false);
        }
    };

    var verificarEstadoWs = function(){
        WebservicesService.verificarWsDni()
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
        var doc = new jsPDF('p', 'pt','a4');
        var exportDate = new Date();
        var dateString = exportDate.toLocaleString();

        //REQ2086 - RSIS004 - INICIO
        var imgBase64 = $filter('bytetobase')($scope.result.foto);
        var imgData ='data:image/jpeg;base64,'+ imgBase64;
        var imgData ='data:image/jpeg;base64,'+ $scope.result.foto;
        //REQ2086 - RSIS004 - FIN

        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text('CONSULTA DE DNI - PIDE+', 221, 55, null, null, 'center');
        
        doc.setFontSize(11);
        doc.setFontType("normal");
        doc.text('DNI de consulta: ', 90, 90);
        doc.text($scope.dni.toString(), 205, 90);

        doc.text('Fecha de exportacion: ', 90, 105);
        doc.text(dateString, 205, 105);

        doc.text('Usuario: ', 90, 120);
        doc.text(Auth.user.username, 205, 120);

        doc.setFontSize(12);
        doc.setFontType("italic");
        doc.text('RESULTADO:', 90, 145);

        doc.setFontSize(10);
        doc.setFontType("normal");
        //REQ2086 - RSIS004 - INICIO

        doc.addImage(imgData, 'JPEG', 385, 130, 120, 160);
        doc.text('Apellido Paterno', 90, 325);
        doc.text('Apellido Materno' , 90, 340);
        doc.text('Nombres' , 90, 310);
        doc.text('Estado Civil',90, 355);
        doc.text('Ubigeo' , 90, 370);
        doc.text('Dirección' , 90, 385);
        doc.text('Restricción' , 90, 400);
        //REQ2086 - RSIS004 - FIN

        doc.setFontSize(8);
        doc.setFontType("normal");

        //REQ2086 - RSIS004 - INICIO
        doc.text($scope.result.apPaterno, 205, 325);
        doc.text($scope.result.apMaterno, 205, 340);
        doc.text($scope.result.preNombres, 205, 310)
        doc.text($scope.result.estCivil,205, 355);
        doc.text($scope.result.ubigeo, 205, 370);
        doc.text($scope.result.direccion, 205, 385);
        doc.text($scope.result.restriccion, 205, 400);
        
	doc.line(195, 295, 195, 403);

        doc.line(85, 313, 505, 313);
        doc.line(85, 328, 505, 328);
        doc.line(85, 343, 505, 343);
        doc.line(85, 358, 505, 358);
        doc.line(85, 373, 505, 373);
        doc.line(85, 388, 505, 388);

        doc.rect(85,295,420,108);
	//REQ2086 - RSIS004 - FIN

        var fileName = 'consulta_dni_' + dateString + '.pdf';

        doc.save(fileName);
    };

    $scope.limpiarConsulta = function(){
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.dni = "";
        $scope.result = {}

        $scope.limpiarAlertas();
    };

    //REQ2086 - RSIS003 - INICIO
    $scope.consultarFoto = function(foto){
        $scope.resultImage = foto;
        $scope.showFotoModal($scope.resultImage);
    };

    $scope.showFotoModal = function(imagen) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'mostrarFoto.html',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance){
                $scope.urlFoto = 'data:image/JPEG;base64,'+imagen;
                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    };
    //REQ2086 - RSIS003 - FIN

    init();

}
  