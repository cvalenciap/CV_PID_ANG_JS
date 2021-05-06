/**
 * -------------------------------------------------------------------------------------
 *   Objeto:           actCredencial-ctrl
 *   Descripcion:      Controlador de vista actualizarCredencial.html
 *   Autor:            Carlos Valencia
 * -------------------------------------------------------------------------------------
 *   Historia de modificaciones:
 *   Requerimiento:    Autor:            Fecha:        Descripcion:
 * -------------------------------------------------------------------------------------
 */
'use strict';


app.controller('ActCredCtrl', ['$scope','Auth','ValidatorUtil','FunctionUtil','ConsultasService', 'WebservicesService',ActCredCtrl]);

function ActCredCtrl($scope,Auth,ValidatorUtil,FunctionUtil,ConsultasService,WebservicesService) {

    /**
     * Common
     */
    var appTitle = 'Actualizar Credenciales';

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
        //$scope.actCred = false;
        $scope.cred_act = "";
        $scope.cred_new = "";
        $scope.conf_cred_new = "";

        $scope.wsWorksMessage = "El servicio no se encuentra habilitado por ahora";

        FunctionUtil.registrarFuncionesManejoAlertas($scope);

        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);

        verificarEstadoWs();
    };

    $scope.actualizarCred = function(){
        $scope.limpiarAlertas();

        $scope.loading = true;
        $scope.searching = false;
        $scope.haveResult = false;

        if(ValidatorUtil.isCredFormat($scope.cred_act) && ValidatorUtil.isCredFormat($scope.cred_new)){

            if($scope.cred_new === $scope.conf_cred_new){
                ConsultasService.actNewCred(Auth.user.username, $scope.cred_act, $scope.cred_new)
                    .then(function(response){
                        $scope.loading = false;
                        var message = response.data.message;
                        if(response.data.status == 1){
                            $scope.searching = true;
                            var results = response.data.data;
                            if(results.length != 0){
                                $scope.haveResult = true;
                                $scope.addInfoAlert(message, false);
                            }else{
                                $scope.haveResult = false;
                                $scope.addWarningAlert(message, false);
                                $scope.limpiarInputs();
                            }
                        }else{
                            //$scope.loading = false;
                            $scope.searching = false;
                            $scope.haveResult = false;
                            $scope.addErrorAlert(message, false);
                            $scope.limpiarInputs();
                        }
                    })
                    .catch(function(error){
                        $scope.loading = false;
                        $scope.searching = false;
                        $scope.haveResult = false;
                        $scope.limpiarInputs();
                        $scope.addErrorAlert('Error al realizar la operacion actualizar credenciales.', false);
                    });
            }else{
                $scope.loading = false;
                $scope.searching = false;
                $scope.haveResult = false;
                $scope.limpiarInputs();
                $scope.addErrorAlert('El ingreso de la nueva credencial no coincide con la confirmacion', false);
            }
        }else{
            $scope.loading = false;
            $scope.searching = false;
            $scope.haveResult = false;
            if(!ValidatorUtil.isCredFormat($scope.cred_act)){
                $scope.addErrorAlert('Credencial actual ingresada no valida', false);
            }
            if(!ValidatorUtil.isCredFormat($scope.cred_new)){
                $scope.addErrorAlert('Credencial nueva ingresada no valida', false);
            }
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

    $scope.limpiarInputs = function(){
        $scope.cred_act = "";
        $scope.cred_new = "";
        $scope.conf_cred_new = "";
    }

    init();

}
