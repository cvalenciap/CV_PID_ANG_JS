/**
 * Login Controller:
 * 
 * Logica de la vista de ingreso al sistema 
 */

app.controller('LoginCtrl', ['$scope','$uibModal','Auth' ,'$state','TokenRestManager',LoginCtrl]);

function LoginCtrl($scope,$uibModal,Auth,$state,TokenRestManager) {

	var appTitle = 'Home';
    $scope.appTitle = appTitle;

    $scope.loading = false;

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles;

    $scope.alerts = [ ];

    $scope.login = function(){   
        $scope.limpiarAlertas();

        $scope.loading = true;
        Auth.callLogin($scope.formData.user,$scope.formData.password)
        .then(function(response){
            $scope.loading = false;
            if(response.data.status == 1){
                TokenRestManager.setCookieRest(response.data.data.authToken);
                var rol_generado = Auth.generateRoleFromTipo("");
                var opcionesMenu = response.data.data.opciones;
                $scope.user= { username: response.data.data.username, role: rol_generado, opciones: opcionesMenu};

                Auth.changeUser($scope.user);
                obtenerOpcionesMenu(opcionesMenu); 
            }
        })
        .catch(function(error){
            $scope.loading = false;
            $scope.formData.password = '';
            if(error.data != null){
                $scope.addErrorAlert(error.data.Message);
            } else {
                $scope.addErrorAlert('No tiene conexión al servidor.');
            }
        })   
    };    

    $scope.addErrorAlert = function(text) {
        $scope.alerts = [ ];
        $scope.alerts.push({ type: 'danger', msg: text });
    };

    $scope.closeErrorAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.limpiarAlertas = function(){
        $scope.alerts=[];
    };

    var obtenerOpcionesMenu=function(opciones){
        TokenRestManager.setCookieViews(opciones);
        $scope.evaluateWidth($scope.getWidth(),true);
        $state.go('common.dashboard');
    };

    $scope.showForgotPasswordModal = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'recoveryPass.html',
          controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance){
              $scope.formData = { userRecovery: "" };
             
              $scope.ok = function () {
                $uibModalInstance.close($scope.formData.userRecovery);
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
          }],
          size: 'sm'
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.recoveryPass(selectedItem);
        }, function () {
            //console.log('Modal dismissed');
        });
    };

    $scope.recoveryPass = function(email){
        Auth.callRecoveryPassword(email)
        .then(function(response){
            if(response.data.status == 1 ){
                //console.log(response.data);
            }
        }).catch
        (function(response){
            alert(response.data.Message);
        });
    };
}

