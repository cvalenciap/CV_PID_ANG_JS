/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Objeto:           consultas-serv
 *   Descripcion:      Servicio que enlaza los controladores de las vistas de consultas con las fuentes del aplicativo
 *   Autor:            
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Historia de modificaciones:
 *   Requerimiento:        Autor:           Fecha:         Descripcion:
 *   REQ2086    	   cvalenciap	    10/01/2018     Adecuación de método getByDni, ingreso de parámetro de entrada usuario 
 *							   Creación de método actNewCred, enlace a las operaciones de actualizar credenciales	 		 
 * ---------------------------------------------------------------------------------------------------------------------------
 */
'use strict';

var consultasService = function ($http,TokenRestManager) {

    var consultasService = {};
    var standardSuccessFunction = function (result){
        return result; 
    };   

    consultasService.getByRuc = function (ruc) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.ruc = ruc;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/getByRuc',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    //REQ2086 - RSIS003 - INICIO
    consultasService.getByDni = function (dni, user) {
    //REQ2086 - RSIS003 - FIN
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.dni = dni;
        //REQ2086 - RSIS003 - INICIO
        data_request.user = user;
        //REQ2086 - RSIS003 - FIN

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/getByDni',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    //REQ2086 - RSIS005 - INICIO
    consultasService.actNewCred = function (user, cred_act, cred_new) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.user = user;
        data_request.cred_act = cred_act;
        data_request.cred_new = cred_new;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/actNewCred',
            headers : { 'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);

    };
    //REQ2086 - RSIS005 - FIN

    consultasService.getTitularidad = function (tipo, nombre, apPaterno, apMaterno, razonSocial) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.tipo = tipo;
        data_request.nombre = nombre;
        data_request.apPaterno = apPaterno;
        data_request.apMaterno = apMaterno;
        data_request.razonSocial = razonSocial;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/getTitularidad',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    consultasService.getDetalleTitularidad = function (zona, oficina, partida, registro) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.zona = zona;
        data_request.oficina = oficina;
        data_request.partida = partida;
        data_request.registro = registro;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/getAsientosTitularidad',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    consultasService.getVigencia = function (transaccion, id_img, tipo, total_pag, pag_ref, nro_pag) {
        var param = TokenRestManager.paramNameCookieRest();

        var data_request = {};
        data_request.transaccion = transaccion;
        data_request.id_img = id_img;
        data_request.tipo = tipo;
        data_request.total_pag = total_pag;
        data_request.pag_ref = pag_ref;
        data_request.nro_pag = nro_pag;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/getVigencia',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() },
            data: data_request
        })
        .then(standardSuccessFunction);
        
    };

    consultasService.getOficinas = function () {
        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'consultas/getOficinas',
            headers : { 'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization' : TokenRestManager.cookieRest() }
        })
        .then(standardSuccessFunction);
        
    };

    return consultasService;


};

app.factory('ConsultasService', ['$http','TokenRestManager', consultasService]);