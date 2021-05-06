'use strict';

/**
 * Consulta de Titularidad Controller
 */

app.controller('ConsTitularidadCtrl', ['$uibModal','$state','$scope','Auth','GetDetalleTitularidadDatosUtil','ValidatorUtil','FunctionUtil','ConsultasService','WebservicesService',ConsTitularidadCtrl]);

function ConsTitularidadCtrl($uibModal,$state,$scope,Auth,GetDetalleTitularidadDatosUtil,ValidatorUtil,FunctionUtil,ConsultasService,WebservicesService) {

	/**
     * Common
     */    
    var appTitle = 'Consulta Titularidad';

    var init = function() {
        $scope.results = [];
        $scope.filterResults = [];

        /**
            Common variables
        **/
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.showFlag = false;
        $scope.wsWorks = false;
        $scope.wsWorksMessage = "El servicio no se encuentra habilitado por ahora";

        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;

        $scope.tipo = "0";
        $scope.nombre = "";
        $scope.apPaterno = "";
        $scope.apMaterno = "";
        $scope.razonSocial = "";

        /***** DETALLE TITULARIDAD *****/
        $scope.showDetalle = false;
        $scope.resultDetalle = {};
        $scope.resultImage = "http://english.tw/wp-content/themes/qaengine/img/default-thumbnail.jpg";

        $scope.searchingDetalle = false;
        $scope.haveResultDetalle = false;
        $scope.loadingDetalle = false;
        $scope.loadingImage = false;

        $scope.partidaDetalle = "";
        $scope.oficinaDetalle = "";
        $scope.registroDetalle = "";

        FunctionUtil.registrarFuncionesManejoAlertas($scope);
        
        $scope.limpiarAlertas();

        $scope.changeViewTitle(appTitle);

        verificarEstadoWs();
    };

    $scope.elegirTipoParticipante = function(){
        if($scope.tipo === 'J'){
            $scope.nombre = "";
            $scope.apPaterno = "";
            $scope.apMaterno = "";
        } else if($scope.tipo === 'N'){
            $scope.razonSocial = "";
        } else { 
            $scope.nombre = "";
            $scope.apPaterno = "";
            $scope.apMaterno = "";
            $scope.razonSocial = "";
        }
    };

    $scope.consultarTitularidad = function(){
        $scope.limpiarAlertas();

        $scope.loading = true;
        $scope.searching = false;
        $scope.haveResult = false;

        if(ValidatorUtil.isValidValue($scope.nombre) && ValidatorUtil.isValidValue($scope.apPaterno) && 
            ValidatorUtil.isValidValue($scope.apMaterno) && ValidatorUtil.isValidValue($scope.razonSocial)){

            ConsultasService.getTitularidad($scope.tipo, $scope.nombre, $scope.apPaterno, $scope.apMaterno, $scope.razonSocial)
            .then(function(response){
                $scope.loading = false;
                if(response.data.status == 1){
                    $scope.searching = true;
                    $scope.results = response.data.data;
                    $scope.haveResult = $scope.results.length !== 0;
                    if ($scope.haveResult){
                        $scope.currentPage = 1;
                        $scope.getDataInPage();
                        $scope.addInfoAlert('Se encontraron ' + $scope.results.length + ' resultado(s)', false);
                    } else {
                        $scope.addWarningAlert('No se encontraron resultados', false);
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
            if(!ValidatorUtil.isValidValue($scope.nombre)){
                $scope.addErrorAlert('Nombre ingresado no válido', false);
            }
            if(!ValidatorUtil.isValidValue($scope.apPaterno)){
                $scope.addErrorAlert('Apellido Paterno igresado no válido', false);
            }
            if(!ValidatorUtil.isValidValue($scope.apMaterno)){
                $scope.addErrorAlert('Apellido Materno ingresado no válido', false);
            }
            if(!ValidatorUtil.isValidValue($scope.razonSocial)){
                $scope.addErrorAlert('Razón Social ingresada no válida', false);
            }
        }
    };

    $scope.verDetalleTitularidad = function(titularidad){
        $scope.ocultarResultadosTitularidad();
        $scope.consultarDetalleTitularidad(titularidad.oficina, titularidad.nro_partida, titularidad.registro);
    }

    $scope.$watch("currentPage + numPerPage", function() {
        $scope.getDataInPage();
    });

    $scope.getDataInPage = function(){
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;
        $scope.filterResults = $scope.results.slice(begin, end);
    };

    var verificarEstadoWs = function(){
        WebservicesService.verificarWsTitularidad()
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
        var doc = new jsPDF('l', 'pt','a4');
        var exportDate = new Date();
        var dateString = exportDate.toLocaleString();

        var adicionalSpace = 15;

        var data = [];
        var columns = [
            {title: "Registro", key: "registro"},
            {title: "Libro", key: "libro"},
            {title: "Nro de partida", key: "partida"}, 
            {title: "Estado", key: "estado"}, 
            {title: "Zona", key: "zona"},
            {title: "Oficina", key: "oficina"},
            {title: "Dirección", key: "direccion"},
            {title: "Tipo de Documento", key: "tipodoc"},
            {title: "Documento", key: "doc"},
            {title: "Placa", key: "placa"}
        ];

        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text('CONSULTA DE TITULARIDAD DE DOMINIO - PIDE+', 290, 55, null, null, 'center');
        
        doc.setFontSize(11);
        doc.setFontType("normal");
        doc.text('Tipo de Representante: ', 60, 90);
        if($scope.tipo === 'N'){
            doc.text('Natural', 225, 90);

            doc.text('Nombres: ', 60, 105);
            doc.text($scope.nombre, 225, 105);

            doc.text('Apellido Paterno: ', 60, 120);
            doc.text($scope.apPaterno, 225, 120);

            doc.text('Apellido Materno: ', 60, 135);
            doc.text($scope.apMaterno, 225, 135);

            adicionalSpace += 30;
        } else if ($scope.tipo === 'J'){
            doc.text('Juridica', 225, 90);

            doc.text('Razon Social: ', 60, 105);
            doc.text($scope.razonSocial, 225, 105);
        }

        doc.text('Fecha de exportacion: ', 60, (105+adicionalSpace));
        doc.text(dateString, 225, (105+adicionalSpace));

        doc.text('Usuario: ', 60, (120+adicionalSpace));
        doc.text(Auth.user.username, 225, (120+adicionalSpace));

        doc.setFontSize(12);
        doc.setFontType("italic");
        doc.text('RESULTADOS:', 60, (155+adicionalSpace));

        doc.setFontType("normal");

        angular.forEach($scope.results, function(titularidad){
            console.log(titularidad);
            var tituloDetail = {
                "registro": titularidad.registro,
                "libro" : titularidad.libro ? titularidad.libro : '',
                "partida": titularidad.nro_partida,
                "estado": titularidad.estado,
                "zona": titularidad.zona,
                "oficina": titularidad.oficina,
                "direccion": titularidad.direccion ? titularidad.direccion : '',
                "tipodoc": titularidad.tipo_doc ? titularidad.tipo_doc : '',
                "doc": titularidad.nro_doc ? titularidad.nro_doc : '',
                "placa": titularidad.nro_placa ? titularidad.nro_placa : ''
            };
            data.push(tituloDetail);
        });

        var maxFirstPage = 16
        var currentPage = 1;
        var numPerPage = 26;
        var totalElements = data.length;
        
        if(data.length > maxFirstPage){
            var firstData = data.slice(0, maxFirstPage);
            doc.autoTable(columns,firstData
                ,{margins:{ horizontal:60, top:(175+adicionalSpace), firstPageTop:(175+adicionalSpace)}, fontSize: 6,
                bodyStyles: {valign: 'middle'},
                styles: {overflow: 'visible', columnWidth:'auto'},
                columnStyles: {
                    registro: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    libro: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    partida: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    estado: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    zona: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    oficina: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    direccion: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    tipodoc: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    doc: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    },
                    placa: {
                        columnWdth: 'auto',
                        overflow: 'visible'
                    }
                }}
            );

            var numPagTotal = Math.floor((totalElements - maxFirstPage) / numPerPage) + 1;
            if(numPagTotal != 0){
                while(currentPage - 1 < numPagTotal){
                    var begin = ((currentPage - 1) * numPerPage) + maxFirstPage;
                    var end = begin + numPerPage;

                    if(end < totalElements && currentPage >= numPagTotal){
                        end = totalElements;
                    }

                    doc.addPage();
                    var restData = data.slice(begin, end);
                    doc.autoTable(columns,restData
                        ,{margins:{ horizontal:60, top:20, firstPageTop:20}, fontSize: 8,
                        bodyStyles: {valign: 'middle'},
                            styles: {overflow: 'visible', columnWidth:'auto'},
                            columnStyles: {
                                registro: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                libro: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                partida: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                estado: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                zona: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                oficina: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                direccion: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                tipodoc: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                doc: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                },
                                placa: {
                                    columnWdth: 'auto',
                                    overflow: 'visible'
                                }
                        }}
                    );
                    currentPage++;
                }
            }
        } else {
            doc.autoTable(columns,data
                ,{margins:{ horizontal:60, top:(175+adicionalSpace), firstPageTop:(175+adicionalSpace)}, fontSize: 8,
                bodyStyles: {valign: 'middle'},
                    styles: {overflow: 'visible', columnWidth:'auto'},
                    columnStyles: {
                        registro: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        libro: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        partida: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        estado: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        zona: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        oficina: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        direccion: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        tipodoc: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        doc: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        },
                        placa: {
                            columnWdth: 'auto',
                            overflow: 'visible'
                        }
                }}
            );
        }

        var fileName = 'consulta_titularidad_' + dateString + '.pdf';

        doc.save(fileName);
    };

    $scope.limpiarConsulta = function(){
        $scope.searching = false;
        $scope.haveResult = false;
        $scope.loading = false;

        $scope.tipo = "0";
        $scope.nombre = "";
        $scope.apPaterno = "";
        $scope.apMaterno = "";
        $scope.razonSocial = "";
        $scope.results = [];
        $scope.filterResults = [];

        $scope.limpiarAlertas();
    };

    /******** DETALLE DE TITULARIDAD *********/
    $scope.ocultarResultadosTitularidad = function(){
        $scope.showDetalle = true;
    };

    $scope.volverListado = function(){
        $scope.limpiarAlertas();
        $scope.showDetalle = false;
        $scope.searchingDetalle = false;
        $scope.haveResultDetalle = false;
        $scope.loadingDetalle = false;
        $scope.loadingImage = false;
        $scope.resultDetalle = {};
        $scope.partidaDetalle = "";
        $scope.oficinaDetalle = "";
        $scope.registroDetalle = "";
    };

    $scope.consultarDetalleTitularidad = function(oficina, partida, registro){
        $scope.limpiarAlertas();

        $scope.partidaDetalle = partida;
        $scope.oficinaDetalle = oficina;
        $scope.registroDetalle = registro;

        var zona_oficina = GetDetalleTitularidadDatosUtil.obtenerOficinaYZona(oficina);

        var zonaCod = zona_oficina.zona;
        var oficinaCod = zona_oficina.oficina;
        var registroCod = GetDetalleTitularidadDatosUtil.obtenerRegistro(registro);

        ConsultasService.getDetalleTitularidad(zonaCod, oficinaCod, partida, registroCod)
            .then(function(response){
                $scope.loadingDetalle = false;
                if(response.data.status == 1){
                    $scope.searchingDetalle = true;
                    var results = response.data.data;
                    if (results.length !== 0){
                            $scope.resultDetalle = results[0];
                            if($scope.resultDetalle.total_pag != null){
                                $scope.addInfoAlert('Se encontraron resultados.', false);
                                $scope.haveResultDetalle = true;
                            } else {
                                $scope.addWarningAlert('No se encontraron resultados', false);
                                $scope.haveResultDetalle = false;
                            }
                        } else {
                            $scope.addWarningAlert('No se encontraron resultados', false);
                            $scope.haveResultDetalle = false;
                        }
                } else {
                    $scope.searchingDetalle = false;
                    $scope.haveResultDetalle = false;
                    $scope.addErrorAlert('Hubo un error en el resultado de la consulta.', false);
                }
            })
            .catch(function(error){
                $scope.loadingDetalle = false;
                $scope.searchingDetalle = false;
                $scope.haveResultDetalle = false;
                $scope.addErrorAlert('Error al realizar la consulta.', false);
            });
    };

    $scope.consultarVigenciaPoder = function(asiento){
        $scope.loadingImage = true;
        ConsultasService.getVigencia($scope.resultDetalle.transaccion, asiento.id_img, asiento.tipo, $scope.resultDetalle.total_pag, asiento.pag_ref, asiento.nro_pag)
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

    $scope.exportDetallePdf = function(){
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
        doc.text('Fecha de exportacion: ', 60, 90);
        doc.text(dateString, 225, 90);

        doc.text('Usuario: ', 60, 105);
        doc.text(Auth.user.username, 225, 105);

        doc.setFontSize(12);
        doc.setFontType("italic");
        doc.text('RESULTADO:', 60, 130);

        doc.setFontSize(10);
        doc.setFontType("normal");
        doc.text('Nro Transaccion:', 60, 155);
        doc.text('Total de paginas:', 410, 155);

        doc.setFontSize(9);
        doc.setFontType("normal");
        doc.text($scope.resultDetalle.transaccion, 205, 155);
        doc.text($scope.resultDetalle.total_pag, 525, 155);

        angular.forEach($scope.resultDetalle.asientos, function(asiento){
            var asientoDetail = {
                "imagenid": asiento.id_img,
                "pagina": asiento.nro_pag,
                "tipo": asiento.tipo,
                "referencia": asiento.pag_ref
            };
            data.push(asientoDetail);
        });

        doc.autoTable(columns,data,{margins:{ horizontal:60, top:175, firstPageTop:174}, fontSize: 8});

        var fileName = 'consulta_detalle_titulo_partida' + $scope.partidaDetalle  + '_oficina'+ $scope.oficinaDetalle + '_registro' + $scope.registroDetalle  +'_' + dateString + '.pdf';

        doc.save(fileName);
    };

    init();

}
  