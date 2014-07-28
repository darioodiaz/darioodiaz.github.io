//key=AIzaSyDCoD6SiNjG6z6pyviFw7t-uhxSRQmZufs&
define(["jquery", 'async!http://maps.googleapis.com/maps/api/js?sensor=false'], 

/**
 * Modulo Gde componentes para SGE
 *
 * @module sgeComponents
 */
    function($) {
        var sgeMapModule = {};

        sgeMapModule.editMode = false;
        sgeMapModule.mode = -1;
        sgeMapModule.dom = "";
        sgeMapModule.listener;
        sgeMapModule.listaPuntos = [];
        sgeMapModule.markers = [];
        sgeMapModule.centro = new google.maps.LatLng(-31.3989296, -64.18212890000001);
        sgeMapModule.geocoder = new google.maps.Geocoder();

        sgeMapModule.polyOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        };

        sgeMapModule.poligonoRuta = new google.maps.Polygon({
            paths: [],
            strokeColor: "#" + sgeMapModule.colorRuta,
            strokeOpacity: 0.5,
            strokeWeight: 1.5,
            fillColor: "#" + sgeMapModule.colorRuta,
            fillOpacity: 0.5
        });

/**
 * Componente que permite el trabajo con mapas
 *
 * @class sgeMap
 */

/**
* Actualiza la vista del mapa. Es util para cuando el mapa esta oculto y luego se muestra, reDraw deberia ser llamado para actualizar
* la vista
* @method reDraw
*/
        sgeMapModule.reDraw = function() {
            google.maps.event.trigger(sgeMapModule.map,'resize');
        };

        sgeMapModule.reset = function() {
            sgeMapModule.map = new google.maps.Map(document.getElementById(sgeMapModule.dom), sgeMapModule.opciones);
            sgeMapModule.poly = new google.maps.Polyline(sgeMapModule.polyOptions);
            sgeMapModule.poly.setMap(sgeMapModule.map);
            sgeMapModule.listaPuntos = [];
            sgeMapModule.markers = [];
            if (sgeMapModule.editMode && sgeMapModule.listener != null) {
                try {
                    sgeMapModule.listener = google.maps.event.addListener(sgeMapModule.map, 'click', sgeMapModule.addLatLng);
                } catch (e) {console.log("Error en enable");}
            }
            //TODO
        };

        /**
* Carga los puntos de georeferencia al mapa y situa el centro del mapa en uno de los puntos
*
* @method setPointsFrom
* @param domId {String} id del elemento DOM que contiene los puntos de georeferencia
*/
        sgeMapModule.setPointsFrom = function(id) {
            id = "#" + id;
            var splat, lat, lng, first;
            var wayPoints = String( $(id).val() ).split(";");
            if (wayPoints.length == 0) {
                return;
            }
            for (var i = 0; i < wayPoints.length - 1; i++) {
                splat = wayPoints[i].split(",");
                lat = Number( splat[0].replace("(", "").replace(")", "").trim() );
                lng = Number( splat[1].replace("(", "").replace(")", "").trim() );

                var marker = new google.maps.LatLng(lat, lng);
                if (i == 0) {
                    first = marker;
                }
                sgeMapModule.addMarker(marker);
            }
            sgeMapModule.map.setCenter(first);

        };

/**
* Centra el mapa en una posicion especifica, de acuerdo a sus parametros. Pueden buscarse por provincia, localidad
* y/o partido (en este orden), funciona como estructura piramide.
*
* @method searchByProvince
* @param provincia {String} provincia a buscar
* @param localidad {String} localidad a buscar
* @param partido {String} partido/departamento a buscar
* @deprecated Se aconseja usar los metodos `setPais`, `setProvincia`, `setLocalidad`, `setPartido`, `setCalle` y/o `setNroCalle`
* para una mejor organizacion del codigo.
*/
        sgeMapModule.searchByProvince = function(provinceName, localidad, partido) {
            var addrress;
            if (partido) {
                provinceName = provinceName.replace("_", " ").toLowerCase();
                localidad = localidad.replace("_", " ").toLowerCase();
                addrress = partido.replace("_", " ").toLowerCase() + ", " + localidad.replace("_", " ").toLowerCase() + ", " + provinceName + ", Argentina";
            } else if (localidad) {
                provinceName = provinceName.replace("_", " ").toLowerCase();
                addrress = localidad.replace("_", " ").toLowerCase() + ", " + provinceName + ", Argentina";
            } else {
                addrress = provinceName.replace("_", " ").toLowerCase() + ", Argentina";
            }
            var geoObj = {};
            geoObj.address = addrress;
            sgeMapModule.geocoder.geocode(geoObj, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var pos = results[0].geometry.location;
                    sgeMapModule.centro = pos;
                    sgeMapModule.map.setCenter(pos);
                } else {
                    console.log('Error en geocoding: ', status);
              }
          });
        };

/**
* Establece la forma de trabajar (edicion/creacion o solo-vista y que tipo de creacion)
*
* @method createMode
* @param modo {Boolean} edicion/creation true, solo-vista false
* @param modoCreacion {Number} 1 = Punto, 2 = Poligono
* @deprecated Se aconseja usar los metodos `setViewOnly` y `enablePointMode`, `enableStreetMode`, `enablePolygonMode`
* por cuestiones de mantenimient, legibilidad y diseño
*/
        sgeMapModule.createMode = function(enable, mode) {
            sgeMapModule.editMode = enable; 
            if (mode !== undefined) {
                if (mode === true) {
                    sgeMapModule.mode = 2;
                } else {
                    sgeMapModule.mode = mode;
                }
            }
        };

/**
* Crea el mapa segun las configuraciones seteada e inicializa los eventos para comenzar a insertar puntos
*
* @method loadMap
* @param zoom {Number} el nivel de zoom
* @param domID {String} Id del elemento DOM en el que iniciara el mapa
*/
        sgeMapModule.loadMap = function (zoom, domElement) {
        	sgeMapModule.dom = domElement;
            sgeMapModule.opciones = {
                zoom: zoom,
                center: sgeMapModule.centro,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            if (document.getElementById(domElement) != null) {
                sgeMapModule.markers = [];
                sgeMapModule.listaPuntos = [];
                sgeMapModule.colorRuta = "#0000FF";
                sgeMapModule.map = new google.maps.Map(document.getElementById(domElement), sgeMapModule.opciones);
                sgeMapModule.poly = new google.maps.Polyline(sgeMapModule.polyOptions);
                sgeMapModule.poly.setMap(sgeMapModule.map);
            } else {
                alert("No hay elemento para dibujar el mapa.");
            }
            if (sgeMapModule.editMode) {
                try {
                    sgeMapModule.listener = google.maps.event.addListener(sgeMapModule.map, 'click', sgeMapModule.addLatLng);
                } catch (e) {console.log("Error en enable");}
            }
        };

/**
* Establece la forma de trabajar (edicion/creacion o solo-vista y que tipo de creacion)
*
* @method drawPolygon
* @deprecated Se aconseja usar el metodo `draw` que es generico de acuerdo a las configuraciones seteadas
*/
        sgeMapModule.drawPolygon = function (paths) {
            if (sgeMapModule.mode != 2) {
                return;
            }
            if (paths) {
                sgeMapModule.poly.setPath(paths);
                sgeMapModule.poligonoRuta.setPath(paths);
                sgeMapModule.listaPuntos = sgeMapModule.poly.latLngs.j[0].j;
                sgeMapModule.poligonoRuta.setMap(sgeMapModule.map);
            } else {
                sgeMapModule.poly.setPath(sgeMapModule.listaPuntos);
                sgeMapModule.poligonoRuta.setPath(sgeMapModule.listaPuntos);
                sgeMapModule.poligonoRuta.setMap(sgeMapModule.map);
            }
        };

 /**
* Genera los puntos de georeferencia con el siguiente formato '(latitudP1, longuitudP1 ; latitudP2, longuitudP2; ...)'
*
* @method generateGeoReference
*/       
        sgeMapModule.generateGeoReference = function() {
            var geoJson = "";
            for (var i = 0; i < sgeMapModule.listaPuntos.length; i++) {
                geoJson += "(" + sgeMapModule.listaPuntos[i].lat() + ", " + sgeMapModule.listaPuntos[i].lng() + ");";
            }
            return geoJson;
        };

/**
* Deshace el ultimo punto del mapa
*
* @method undoMarker
* @deprecated Usar `undoLastAction` que es mas generico
*/       
        sgeMapModule.undoMarker = function() {
            if (sgeMapModule.listaPuntos != null && sgeMapModule.listaPuntos.length > 0) {
                if (sgeMapModule.mode == 1 && sgeMapModule.listener == null) {
                    sgeMapModule.listener = google.maps.event.addListener(sgeMapModule.map, 'click', sgeMapModule.addLatLng);
                }
                var pos = sgeMapModule.listaPuntos.length - 1;
                if (sgeMapModule.markers != null && sgeMapModule.markers.length > 0) {
                    sgeMapModule.markers[pos].setMap(null);
                    sgeMapModule.markers.splice(pos, 1);
                }
                var path = sgeMapModule.poly.getPath();
                path.pop(); //Elimina la ultima linea dibujada en el poligono
            }
        };

        sgeMapModule.getPoints = function() {
            return sgeMapModule.listaPuntos;
        };

        //PRIVATE METHODS
        sgeMapModule.addLatLng = function (event) {
            if (sgeMapModule.mode == 1) {
                try {
                    google.maps.event.removeListener(sgeMapModule.listener);
                    sgeMapModule.listener = null;
                } catch (e) {console.log("Error en removeListener");}
            }
            sgeMapModule.addMarker(event.latLng);
        };

        sgeMapModule.getListaPuntos = function() {
            return sgeMapModule.listaPuntos;
        };

        sgeMapModule.getPaths = function() {
            //var paths = new google.maps.MVCArray.<LatLng>();
            var paths = [];
            for (var i = 0; i < sgeMapModule.markers.length; i++) {
                paths.push(sgeMapModule.markers[i].getPosition());
            }
            return paths;
        };

        sgeMapModule.addMarker = function (latLng, info) {
            var marker = new google.maps.Marker({
                position: latLng,
                map: sgeMapModule.map,
                draggable: sgeMapModule.editMode
            });

            marker.reDraw = function(e) {
                var paths = sgeMapModule.getPaths();
                sgeMapModule.poly.setPath(paths);
                sgeMapModule.listaPuntos = sgeMapModule.poly.latLngs.j[0].j;
                if (sgeMapModule.mode) {
                    sgeMapModule.drawPolygon(paths);
                }
            };

            if (sgeMapModule.editMode) {
                google.maps.event.addListener(marker, "dragend", marker.reDraw);
            }
            sgeMapModule.markers.push(marker);

            var path = sgeMapModule.poly.getPath();
            path.push(latLng);

            sgeMapModule.InfoWindow = new google.maps.InfoWindow({
                content: "Domicilio: " + info
            });

            sgeMapModule.listaPuntos = sgeMapModule.poly.latLngs.j[0].j;
        };

        return sgeMapModule;
    }
);