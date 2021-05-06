'use strict';

var webservicesService = function ($http,TokenRestManager) {

    var webservicesService = {};
    var standardSuccessFunction = function (result){
        return result; 
    };   

    webservicesService.verificarWsRuc = function () {
      return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'webservices/verificarWsRuc',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8'}
        })
        .then(standardSuccessFunction);
        
    };

    webservicesService.verificarWsDni = function () {
        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'webservices/verificarWsDni',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8' }
        })
        .then(standardSuccessFunction);
        
    };

    webservicesService.verificarWsTitularidad = function () {
        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'webservices/verificarWsTitularidad',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8' }
        })
        .then(standardSuccessFunction);
        
    };

    webservicesService.verificarWsDetalleTitularidad = function () {
        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'webservices/verificarWsDetalleTitularidad',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8' }
        })
        .then(standardSuccessFunction);
        
    };

    webservicesService.verificarWsVigencia = function () {
        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'webservices/verificarWsVigencia',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8' }
        })
        .then(standardSuccessFunction);
        
    };

    return webservicesService;


};

app.factory('WebservicesService', ['$http','TokenRestManager', webservicesService]);