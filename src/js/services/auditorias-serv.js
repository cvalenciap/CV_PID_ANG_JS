'use strict';

var auditoriasService = function ($http,TokenRestManager) {

    var auditoriasService = {};
    var standardSuccessFunction = function (result){
        return result; 
    };   

    auditoriasService.getResumenLogs = function (fecha) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.date = fecha;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'auditoria/resumenConsultas',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    auditoriasService.getRegistroLogs = function (fechaInicio, fechaFin) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.startDate = fechaInicio;
        data_request.endDate = fechaFin;
        
        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'auditoria/registroConsultas',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    return auditoriasService;


};

app.factory('AuditoriasService', ['$http','TokenRestManager', auditoriasService]);