'use strict';

var functionUtil = function ($timeout) {  
    var functionFactory = {};    

    /** Alertas  **/

    var addErrorAlert = function(text,timeout) {
        addAlert('danger',text,timeout);
    };

    var addWarningAlert = function(text,timeout) {
        addAlert('warning',text,timeout);
    };

    var addInfoAlert = function(text,timeout) {
        addAlert('info',text,timeout);
    };

    var addAlert = function(type,text,timeout){
        limpiarAlertas();
        functionFactory.scope.alerts.push({ type: type, msg: text });

        if(timeout!=null && timeout!=undefined){
            if(timeout){
                setTimeoutToAlerts();
            }
        }
    };

    var closeErrorAlert = function(index) {
        functionFactory.scope.alerts.splice(index, 1);
    };

    var limpiarAlertas = function(){
        functionFactory.scope.alerts=[];
    };

    var setTimeoutToAlerts = function(){
        $timeout(function(){
            limpiarAlertas();
        },3000);
    };

    /** Formularios **/

    var resetearInputsFormulario = function(formName){
        var formulario = functionFactory.scope.$$childTail[formName];

        if(formulario !=null && formulario !=undefined){
            formulario.$setPristine(); 
            formulario.$valid = false ; 
        }
    };

    var getErrorFromInputForm = function(formName,InputName,validatorName){
        var formulario = functionFactory.scope.$$childTail[formName];
        
        if(formulario !=null && formulario !=undefined){
            if(validatorName==null || validatorName == undefined){
                validatorName = 'validator';
            }

            var error = formulario.$error;

            if(error==null || error == undefined) return;

            var validators = error[validatorName];

            if(validators==null || validators==undefined) return;

            if(validators.length==0) return;
            
            var found = false;

            angular.forEach(validators,function(val){
                if(val[InputName] != null) {
                    found = true;
                }
            });           

            return found;

            
        }else{
            return;
        }
    };

    /** Contadores para ng-table **/

    var contadorTabla = function(tableParams,label_tipo_registro){
        if(tableParams==null || tableParams==undefined){
            return "";
        }

        var label = "Registros";
        if(label_tipo_registro != null && label_tipo_registro != undefined){
            label = label_tipo_registro; 
        }

        if(tableParams.total()>0){

            var current_page = tableParams.page();
            var reg_per_page = tableParams.count();
            var first_reg = 1;
            var last_reg = 1;

            var total = tableParams.total();

            if(total<= reg_per_page){
                last_reg = total;
            }else{

                if(current_page !=1){
                    first_reg = (( current_page - 1) * reg_per_page) + 1;                    
                }

                last_reg = current_page * reg_per_page;

                if(last_reg>total){
                    last_reg = total;
                }
            }

            return first_reg +"-"+last_reg+" de "+total+" "+label;
            

        }else{
            return "0-0 de 0 "+label;
        }
    };

    /** Funciones de Registro para controladores **/

    functionFactory.registrarFuncionesManejoAlertas = function ($scope){
        if($scope==null) return;
        functionFactory.scope = $scope;

        $scope.addErrorAlert = addErrorAlert;
        $scope.addInfoAlert = addInfoAlert;
        $scope.addWarningAlert = addWarningAlert; 
        $scope.closeErrorAlert = closeErrorAlert;
        $scope.limpiarAlertas = limpiarAlertas;
    };

    functionFactory.registrarFuncionesFormulario = function ($scope){
        $scope.resetearInputsFormulario=resetearInputsFormulario;
        $scope.getErrorFromInputForm = getErrorFromInputForm;
        $scope.contadorTabla = contadorTabla;
    };

    return functionFactory;
};

app.factory('FunctionUtil', ['$timeout', functionUtil]);