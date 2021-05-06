/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Objeto:           validatorUtil
 *   Descripcion:      Utilitario de validaciones sobre parámetros
 *   Autor:            
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Historia de modificaciones:
 *   Requerimiento:        Autor:           Fecha:         Descripcion:
 *   REQ2086 - RSIS005 	   cvalenciap	    10/01/2018     Agregación de validación de credenciales	 		 
 * ---------------------------------------------------------------------------------------------------------------------------
 */
'use strict';

var validatorUtil = function () {  
    var validatorUtilFactory = {};

    validatorUtilFactory.isPeriodoFormat = function($value){
        if($value==null) return false;
        if($value.length!=6) return false;

        var mes = parseInt($value.substring(0, 2));
        var anio = parseInt($value.substring(2, 6));

        if(mes<1 || mes > 12) return false;
        if(anio<2000 ) return false;

        return true;

    };

    validatorUtilFactory.isRucFormat = function($value){
    	var regex = /^\d{11}$/;
    	return regex.test($value);
    };

    validatorUtilFactory.isDNIFormat = function($value){
        var regex = /^\d{8}$/;
        return regex.test($value);
    };

    validatorUtilFactory.isEmailFormat = function ($value,allowBlank) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        var result = re.test($value);

        if(allowBlank==null ||allowBlank == undefined){
            return result;
        }else{
            if(!allowBlank){
                return result;
            }else{
                return result ||  $value == '';
            }

        }
    };

    validatorUtilFactory.cleanInput = function(value){
    	if(value!=null && value!=undefined){
    		return value.trim();	
    	}else{
    		return "";
    	}    	
    };

    validatorUtilFactory.isNoSelected = function($value,$skipValidator){

        if($skipValidator != undefined && $skipValidator!=null){
            if($skipValidator) return true;
        }

        if($value==undefined || $value ==null){
            return true;
        }

        if($value==-1){
            return false;
        }else{
            return true;
        }
    };

    validatorUtilFactory.isValidValue = function(value){
        if(value != null && value !== undefined){
            return true;
        } else {
            return false;
        }
    }

    //REQ2086 - RSIS005 - INICIO
    validatorUtilFactory.isCredFormat = function(value){
        if(value != null && value !== undefined && value != ''){
            return true;
        } else {
            return false;
        }
    }
    //REQ2086 - RSIS005 - FIN

    return validatorUtilFactory;
};

app.factory('ValidatorUtil', [ validatorUtil]);