'use strict';

/**
 * Consultar Lista de Asientos Controller
 */

app.controller('ConsListaAsientosCtrl', ['$uibModal', '$state','$scope','$stateParams','Auth','ValidatorUtil', 'GetDetalleTitularidadDatosUtil','FunctionUtil','ConsultasService', 'WebservicesService',ConsListaAsientosCtrl]);

function ConsListaAsientosCtrl($uibModal,$state,$scope,$stateParams,Auth,ValidatorUtil,GetDetalleTitularidadDatosUtil,FunctionUtil, ConsultasService, WebservicesService) {

    /**
     * Common
     */    
    var appTitle = 'Consulta Lista de Asientos';

    var init = function() {
        $scope.state = $state;
        $scope.result = {};
        $scope.resultImage = "http://english.tw/wp-content/themes/qaengine/img/default-thumbnail.jpg";

        $scope.oficinasWs = [];

        /**
            Common variables
        **/
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;
        $scope.loadingImage = false;

        $scope.showFlag = false;
        $scope.wsWorks = false;
        $scope.wsWorksMessage = "El servicio no se encuentra habilitado por ahora";

        $scope.zona = "";
        $scope.oficina = "";
        $scope.partida = "";
        //Instanciación variable zona_oficina
	$scope.zona_oficina = "0";
        var emptyOffice = {codOficinaField: "00", codZonaField:"00", descripcionField: "---ELIJA UNA OPCIÓN---"};

        $scope.oficinasWs.push(emptyOffice);

        $scope.office = emptyOffice;
        $scope.registro = "0";

        FunctionUtil.registrarFuncionesManejoAlertas($scope);
        
        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);

        verificarEstadoWs();

        getOficinas();
    };

    $scope.consultarListaAsientos = function(){
        $scope.limpiarAlertas();

        $scope.loading = true;
        $scope.searching = false;
        $scope.haveResult = false;

        console.log($scope.office);

        if(ValidatorUtil.isValidValue($scope.partida) && $scope.office.codOficinaField != '00' && $scope.registro !== '0'){
            $scope.zona = $scope.office.codZonaField;
            $scope.oficina = $scope.office.codOficinaField;
	    //Asignación de valor de variable a oficina seleccionada
            $scope.zona_oficina = $scope.office.descripcionField;

            ConsultasService.getDetalleTitularidad($scope.zona, $scope.oficina, $scope.partida, $scope.registro)
                .then(function(response){
                    $scope.loading = false;
                    if(response.data.status == 1){
                        $scope.searching = true;
                        var results = response.data.data;
                        if (results.length !== 0){
                            $scope.result = results[0];
                            if($scope.result.total_pag != null){
                                $scope.addInfoAlert('Se encontraron resultados.', false);
                                $scope.haveResult = true;
                            } else {
                                $scope.addWarningAlert('No se encontraron resultados', false);
                                $scope.haveResult = false;
                            }
                            
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
                if(!ValidatorUtil.isValidValue($scope.partida)){
                    $scope.addErrorAlert('Partida ingresada no válida.', false);
                }
                if($scope.office.codOficinaField === '00'){
                    $scope.addErrorAlert('No se ha especificado la oficina.', false);
                }
                if($scope.registro === '0'){
                    $scope.addErrorAlert('No se ha especificado el registro.', false);
                }
            }
    };

    $scope.consultarVigenciaPoder = function(asiento){
        $scope.loadingImage = true;
        ConsultasService.getVigencia($scope.result.transaccion, asiento.id_img, asiento.tipo, $scope.result.total_pag, asiento.pag_ref, asiento.nro_pag)
            .then(function(response){
                $scope.loadingImage = false;
                if(response.data.status == 1){
                    $scope.resultImage = response.data.data;
                    if($scope.resultImage !== ''){
                        $scope.showVigenciaPoderModal($scope.resultImage);
                    } else {
                        $scope.addWarningAlert('No posee una vigencia de poder', false);
                    }
                } else {
                    $scope.addErrorAlert('Hubo un error en el resultado de la consulta.', false);
                }
            })
            .catch(function(error){
                $scope.loadingImage = false;
                $scope.addErrorAlert('Error al realizar la consulta.', false);
            });
    };

    $scope.showVigenciaPoderModal = function(imagen) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'vigenciaPoder.html',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance){
               
                $scope.urlVigenciaPoder = 'data:image/JPEG;base64,'+imagen;
             
                  $scope.ok = function () {
                    $uibModalInstance.close();
                  };

                  $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                  };
            }]
        });
    };

    var verificarEstadoWs = function(){
        WebservicesService.verificarWsDetalleTitularidad()
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

        var data = [];
        var columns = [
            {title: "ID Imagen", key: "imagenid"},
            {title: "Nro de pagina", key: "pagina"}, 
            {title: "Tipo", key: "tipo"}, 
            {title: "Pagina de referencia", key: "referencia"}
        ];

        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text('CONSULTA DE LISTA DE ASIENTOS - PIDE+', 198, 55, null, null, 'center');
        
        doc.setFontSize(11);
        doc.setFontType("normal");
        doc.text('Nro Partida: ', 60, 90);
        doc.text($scope.partida.toString(), 225, 90);

        doc.text('Oficina: ', 60, 105);
        doc.text($scope.zona_oficina, 225, 105);

        doc.text('Registro: ', 60, 120);
        doc.text(GetDetalleTitularidadDatosUtil.obtenerNombreRegistro($scope.registro), 225, 120);

        doc.text('Fecha de exportacion: ', 60, 135);
        doc.text(dateString, 225, 135);

        doc.text('Usuario: ', 60, 150);
        doc.text(Auth.user.username, 225, 150);

        doc.setFontSize(12);
        doc.setFontType("italic");
        doc.text('RESULTADO:', 60, 175);

        doc.setFontSize(10);
        doc.setFontType("normal");
        doc.text('Nro Transaccion:', 60, 200);
        doc.text('Total de paginas:', 410, 200);

        doc.setFontSize(9);
        doc.setFontType("normal");
        doc.text($scope.result.transaccion, 205, 200);
        doc.text($scope.result.total_pag, 525, 200);

        angular.forEach($scope.result.asientos, function(asiento){
            var asientoDetail = {
                "imagenid": asiento.id_img,
                "pagina": asiento.nro_pag,
                "tipo": asiento.tipo,
                "referencia": asiento.pag_ref
            };
            data.push(asientoDetail);
        });

         doc.autoTable(columns,data,{margins:{ horizontal:60, top:220, firstPageTop:220}, fontSize: 8});

        var fileName = 'consulta_lista_asientos_' + dateString + '.pdf';

        doc.save(fileName);
    };

    $scope.limpiarConsulta = function(){
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.zona = "";
        $scope.oficina = "";
        $scope.partida = "";
        $scope.zona_oficina = "0";
        $scope.registro = "0";
        $scope.result = {}

        $scope.limpiarAlertas();
    };

    var getOficinas = function(){
        ConsultasService.getOficinas()
        .then(function(response){
                if(response.data.status == 1){
                    $scope.wsWorks = true;
                    $scope.oficinasWs = $scope.oficinasWs.concat(response.data.data);
                    console.log($scope.oficinasWs);
                } else {
                    $scope.wsWorks = false;
                    $scope.addErrorAlert('Hubo un error al cargar las oficinas.', false);
                }
            })
            .catch(function(error){
                console.log(error);
                $scope.wsWorks = false;
                $scope.addErrorAlert('Hubo un error al cargar las oficinas.', false);
            });
    };

    init();

}
  