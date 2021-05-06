'use strict';

var getDetalleTitularidadDatosUtil = function () {  
    var getDetalleTitularidadDatosUtilFactory = {};

    getDetalleTitularidadDatosUtilFactory.obtenerOficinaYZona = function(oficina){
        var result = { oficina: '0', zona: '0' };

        if(oficina === 'LIMA'){
            result = { oficina: '01', zona: '01' };
        } else if(oficina === 'CALLAO'){
            result = { oficina: '02', zona: '01' };
        } else if(oficina === 'HUARAL'){
            result = { oficina: '03', zona: '01' };
        } else if(oficina === 'HUACHO'){
            result = { oficina: '04', zona: '01' };
        } else if(oficina === 'CAÑETE'){
            result = { oficina: '05', zona: '01' };
        } else if(oficina === 'BARRANCA'){
            result = { oficina: '06', zona: '01' };
        } else if(oficina === 'HUANCAYO'){
            result = { oficina: '01', zona: '02' };
        } else if(oficina === 'HUANUCO'){
            result = { oficina: '02', zona: '02' };
        } else if(oficina === 'PASCO'){
            result = { oficina: '04', zona: '02' };
        } else if(oficina === 'SATIPO'){
            result = { oficina: '05', zona: '02' };
        } else if(oficina === 'LA MERCED'){
            result = { oficina: '06', zona: '02' };
        } else if(oficina === 'TARMA'){
            result = { oficina: '07', zona: '02' };
        } else if(oficina === 'TINGO MARIA'){
            result = { oficina: '08', zona: '02' };
        } else if(oficina === 'HUANCAVELICA'){
            result = { oficina: '09', zona: '02' };
        } else if(oficina === 'AREQUIPA'){
            result = { oficina: '01', zona: '03' };
        } else if(oficina === 'CAMANA'){
            result = { oficina: '02', zona: '03' };
        } else if(oficina === 'CASTILLA - APLAO'){
            result = { oficina: '03', zona: '03' };
        } else if(oficina === 'ISLAY - MOLLENDO'){
            result = { oficina: '04', zona: '03' };
        } else if(oficina === 'HUARAZ'){
            result = { oficina: '01', zona: '04' };
        } else if(oficina === 'CASMA'){
            result = { oficina: '02', zona: '04' };
        } else if(oficina === 'CHIMBOTE'){
            result = { oficina: '03', zona: '04' };
        } else if(oficina === 'PIURA'){
            result = { oficina: '01', zona: '05' };
        } else if(oficina === 'SULLANA'){
            result = { oficina: '02', zona: '05' };
        } else if(oficina === 'TUMBES'){
            result = { oficina: '03', zona: '05' };
        } else if(oficina === 'CUSCO'){
            result = { oficina: '01', zona: '06' };
        } else if(oficina === 'ABANCAY'){
            result = { oficina: '02', zona: '06' };
        } else if(oficina === 'MADRE DE DIOS'){
            result = { oficina: '03', zona: '06' };
        } else if(oficina === 'QUILLABAMBA'){
            result = { oficina: '04', zona: '06' };
        } else if(oficina === 'SICUANI'){
            result = { oficina: '05', zona: '06' };
        } else if(oficina === 'ESPINAR'){
            result = { oficina: '06', zona: '06' };
        } else if(oficina === 'ANDAHUAYLAS'){
            result = { oficina: '07', zona: '06' };
        } else if(oficina === 'TACNA'){
            result = { oficina: '01', zona: '07' };
        } else if(oficina === 'ILO'){
            result = { oficina: '02', zona: '07' };
        } else if(oficina === 'JULIACA'){
            result = { oficina: '03', zona: '07' };
        } else if(oficina === 'MOQUEGUA'){
            result = { oficina: '04', zona: '07' };
        } else if(oficina === 'PUNO'){
            result = { oficina: '05', zona: '07' };
        } else if(oficina === 'TRUJILLO'){
            result = { oficina: '01', zona: '08' };
        } else if(oficina === 'CHEPEN'){
            result = { oficina: '02', zona: '08' };
        } else if(oficina === 'HUAMACHUCO'){
            result = { oficina: '03', zona: '08' };
        } else if(oficina === 'OTUZCO'){
            result = { oficina: '04', zona: '08' };
        } else if(oficina === 'SAN PEDRO'){
            result = { oficina: '05', zona: '08' };
        } else if(oficina === 'MAYNAS'){
            result = { oficina: '01', zona: '09' };
        } else if(oficina === 'ICA'){
            result = { oficina: '01', zona: '10' };
        } else if(oficina === 'CHINCHA'){
            result = { oficina: '02', zona: '10' };
        } else if(oficina === 'PISCO'){
            result = { oficina: '03', zona: '10' };
        } else if(oficina === 'NAZCA'){
            result = { oficina: '04', zona: '10' };
        } else if(oficina === 'CHICLAYO'){
            result = { oficina: '01', zona: '11' };
        } else if(oficina === 'CAJAMARCA'){
            result = { oficina: '02', zona: '11' };
        } else if(oficina === 'JAEN'){
            result = { oficina: '03', zona: '11' };
        } else if(oficina === 'BAGUA'){
            result = { oficina: '04', zona: '11' };
        } else if(oficina === 'CHACHAPOYAS'){
            result = { oficina: '05', zona: '11' };
        } else if(oficina === 'CHOTA'){
            result = { oficina: '06', zona: '11' };
        } else if(oficina === 'MOYOBAMBA'){
            result = { oficina: '01', zona: '12' };
        } else if(oficina === 'TARAPOTO'){
            result = { oficina: '02', zona: '12' };
        } else if(oficina === 'JUANJUI'){
            result = { oficina: '03', zona: '12' };
        } else if(oficina === 'YURIMAGUAS'){
            result = { oficina: '04', zona: '12' };
        } else if(oficina === 'PUCALLPA'){
            result = { oficina: '01', zona: '13' };
        } else if(oficina === 'AYACUCHO'){
            result = { oficina: '01', zona: '14' };
        } else if(oficina === 'HUANTA'){
            result = { oficina: '02', zona: '14' };
        }

        return result;
    };

    getDetalleTitularidadDatosUtilFactory.obtenerRegistro = function(registro){
        if(registro === 'REGISTRO DE PROPIEDAD INMUEBLE'){
            return '21000';
        } else if (registro === 'REGISTRO DE PERSONAS JURIDICAS') {
            return '22000';
        } else if(registro === 'REGISTRO DE PERSONAS NATURALES') {
            return '23000';
        } else if(registro === 'REGISTRO DE BIENES MUEBLES') {
            return '24000';
        }

        return '0';
    };

    getDetalleTitularidadDatosUtilFactory.obtenerNombreRegistro = function(registro){
        if(registro === '21000'){
            return 'REGISTRO DE PROPIEDAD INMUEBLE';
        } else if (registro === '22000') {
            return 'REGISTRO DE PERSONAS JURIDICAS';
        } else if(registro === '23000') {
            return 'REGISTRO DE PERSONAS NATURALES';
        } else if(registro === '24000') {
            return 'REGISTRO DE BIENES MUEBLES';
        }

        return '';
    };

    return getDetalleTitularidadDatosUtilFactory;
};

app.factory('GetDetalleTitularidadDatosUtil', [ getDetalleTitularidadDatosUtil]);