/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Objeto:           getOpcionesMenuUtil
 *   Descripcion:      Servicio que controla el acceso y muestra de los modúlos
 *   Autor:            
 * ---------------------------------------------------------------------------------------------------------------------------
 *   Historia de modificaciones:
 *   Requerimiento:        Autor:           Fecha:         Descripcion:
 *   REQ2086 - RSIS005 	   cvalenciap	    10/01/2018     Agregación de parámetro para el módulo actualizar credenciales	 		 
 * ---------------------------------------------------------------------------------------------------------------------------
 */
'use strict';

var getOpcionesMenuUtil = function () {  
    var getOpcionesMenuUtilFactory = {};

    var menuOpcs = {
            "CONDNI": { nombre: "Consulta DNI", ruta: "common.consultaDni", opcion: "CON" },
            "CONRUC": { nombre: "Consulta RUC", ruta: "common.consultaRuc", opcion: "CON" },
            "CONTIDO": { nombre: "Titularidad de Dominio", ruta: "common.consultaTitularidad", opcion: "CON" },
            "CONASI": { nombre: "Lista de Asientos", ruta: "common.consultaListaAsientos", opcion: "CON" },
            "REGLOG": { nombre: "Registro de Logs", ruta: "common.auditoriaRegistro", opcion: "LOG" },
            "RESULOG": { nombre: "Resumen de Logs", ruta: "common.auditoriaResumen", opcion: "LOG" }
            /*"REGLOG": { nombre: "Registro de Logs", ruta: "admin.auditoriaRegistro", opcion: "LOG" },
            "RESULOG": { nombre: "Resumen de Logs", ruta: "admin.auditoriaResumen", opcion: "LOG" }*/
            //REQ2086 - RSIS005 - INICIO
            ,"CONACTCRED": {nombre: "Actualizar Credenciales", ruta: "common.actualizarCredencial", opcion: "CON"}
            //REQ2086 - RSIS005 - FIN
    };

    getOpcionesMenuUtilFactory.obteneOpcion = function(codMenu){
        return menuOpcs[codMenu];
    };

    return getOpcionesMenuUtilFactory;
};

app.factory('GetOpcionesMenuUtil', [ getOpcionesMenuUtil]);