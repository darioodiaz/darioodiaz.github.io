define(["moment"], function(moment) {

	/**
 * Modulo Gde componentes para SGE
 *
 * @module sgeComponents
 */

	var moduleDef = {};
	moduleDef.init = function(app) {

		/**
 		* Componente que permite el trabajo con fechas
 		*
 		* @class sgeDateService
 		*/
		app.factory("sgeDateService", function() {
			var srv = {};
			srv.today = moment();
			srv.defaultFormat = "DD/MM/YYYY";

		  /**
			* Permite establecer la fecha maxima que sera usada para comparar con una fecha variable
			*
			* @method setMaximumDate
			* @param fecha {String | Date} la fecha que sera usada como maxima
			*/
			srv.setMaximumDate = function(date) {
				try {
					srv.maximumDate = moment(date);
				} catch (e) {
					console.log("");
				}
			};

			/**
			* Devuelve la fecha actual pudiendo especificar algun formato
			*
			* @method getToday
			* @return {String} fecha actual
			* @param formato {String} el formato que se le dara a la fecha, pueden ser cualquiera de los establecidos por momentJS.
			* Si se omite se devuelve con el formato Dia/Mes/Año
			*/
			srv.getToday = function(format) {
				if (format) {
					return srv.today.format(format);
				} else {
					return srv.today.format(srv.defaultFormat);
				}
			};

			/**
			* Permite establecer la fecha minima que sera usada para comparar con una fecha variable
			*
			* @method setMinimumDate
			* @param fecha {String | Date} la fecha que sera usada como minima
			*/
			srv.setMinimumDate = function(date) {
				try {
					srv.minimumDate = moment(date);
				} catch (e) {
					console.log("");
				}
			};

			/**
			* Devuelve la fecha maxima pudiendo especificar algun formato
			*
			* @method getMaxDate
			* @return {String} fecha maxima (si no fue seteada devuelve la fecha actual como maxima)
			* @param formato {String} el formato que se le dara a la fecha, pueden ser cualquiera de los establecidos por momentJS.
			* Si se omite se devuelve con el formato Dia/Mes/Año
			*/
			srv.getMaxDate = function(format) {
				if (format) {
					return srv.maximumDate.format(format);
				} else {
					return srv.maximumDate;
				}
			};

			/**
			* Devuelve la fecha minima pudiendo especificar algun formato
			*
			* @method getMinDate
			* @return {String} fecha minima (si no fue seteada devuelve 01/01/1900)
			* @param formato {String} el formato que se le dara a la fecha, pueden ser cualquiera de los establecidos por momentJS.
			* Si se omite se devuelve con el formato Dia/Mes/Año
			*/
			srv.getMinDate = function(format) {
				if (format) {
					return srv.minimumDate.format(format);
				} else {
					return srv.minimumDate;
				}
			};

			/**
			* Verifica si el formato de una fecha es valido
			*
			* @method isDateValid
			* @return {Boolean} true = fecha valida, false = fecha invalida
			* @param fecha {String} la fecha a validar			
			*/
			srv.isDateValid = function(date) {
				var result;
				try {
					result = moment(date, srv.defaultFormat).isValid();
				} catch(e) {
					result = false;
				}
				return Boolean(result);
			};

			/**
			* Formatea una fecha de acuerdo con los formatos establecidos por momentJS
			*
			* @method formatDate
			* @return {String} la fecha formateada
			* @param fecha {String | Date} la fecha a formatear			
			* @param formato {String} el formato de la fecha			
			*/
			srv.formatDate = function(date, formatString) {
				var formattedDate = "##/##/####";
				try {
					formattedDate =  moment(date).format( String(formatString) );
				} catch(e) {
					this.showMessage("La fecha no pudo formatearse." + e.message);
				}
				return formattedDate;
			};

			/**
			* Verifica si 2 fechas son iguales
			*
			* @method isSameDate
			* @return {Boolean} 
			* @param fecha {String | Date} primera fecha
			* @param fecha {String | Date} segunda fecha
			*/
			srv.isSameDate = function(_date1, _date2) {
				var date1;
				var date2;
				var result;
				try {
					date1 = moment(_date1, srv.defaultFormat);
					date2 = moment(_date2, srv.defaultFormat);
					result = date1.isSame(date2);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};	

			/**
			* Verifica si una fecha esta antes que otra
			*
			* @method isDateBefore
			* @return {Boolean} 
			* @param fecha {String | Date} primera fecha
			* @param fecha {String | Date} segunda fecha
			*/
			srv.isDateBefore = function(_date1, _date2) {
				var date1;
				var date2;
				var result;
				try {
					date1 = moment(_date1, srv.defaultFormat);
					date2 = moment(_date2, srv.defaultFormat);
					result = date1.isBefore(date2);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};

			/**
			* Verifica si una fecha esta despues que otra
			*
			* @method isDateAfter
			* @return {Boolean} 
			* @param fecha {String | Date} primera fecha
			* @param fecha {String | Date} segunda fecha
			*/
			srv.isDateAfter = function(_date1, _date2) {
				var date1;
				var date2;
				var result;
				try {
					date1 = moment(_date1, srv.defaultFormat);
					date2 = moment(_date2, srv.defaultFormat);
					result = date1.isAfter(date2);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};

			//Min

			/**
			* Verifica si la fecha minima seteada esta despues de una fecha
			*
			* @method minDateAfter
			* @return {Boolean} 
			* @param fecha {String | Date} fecha a comparar			
			*/
			srv.minDateAfter = function(date) {
				var date1;
				var result;
				if (!srv.minimumDate) {
					this.showMessage("No hay fecha minima seteada" + e.message);
					return;
				}
				try {
					date1 = moment(date, srv.defaultFormat);
					result = srv.minimumDate.isAfter(date1);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};

			/**
			* Verifica si la fecha minima seteada esta antes de una fecha
			*
			* @method minDateBefore
			* @return {Boolean} 
			* @param fecha {String | Date} fecha a comparar			
			*/
			srv.minDateBefore = function(date) {
				var date1;
				var result;
				if (!srv.minimumDate) {
					this.showMessage("No hay fecha minima seteada" + e.message);
					return;
				}
				try {
					date1 = moment(date, srv.defaultFormat);
					result = srv.minimumDate.isBefore(date1);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};

			//Max
			/**
			* Verifica si la fecha maxima seteada esta despues de una fecha
			*
			* @method maxDateAfter
			* @return {Boolean} 
			* @param fecha {String | Date} fecha a comparar			
			*/
			srv.maxDateAfter = function(date) {
				var date1;
				var result;
				if (!srv.maximumDate) {
					this.showMessage("No hay fecha maxima seteada" + e.message);
					return;
				}
				try {
					date1 = moment(date, srv.defaultFormat);
					result = srv.maximumDate.isAfter(date1);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};

			/**
			* Verifica si la fecha maxima seteada esta antes de una fecha
			*
			* @method maxDateBefore
			* @return {Boolean} 
			* @param fecha {String | Date} fecha a comparar			
			*/
			srv.maxDateBefore = function(date) {
				var date1;
				var result;
				if (!srv.maximumDate) {
					this.showMessage("No hay fecha maxima seteada" + e.message);
					return;
				}
				try {
					date1 = moment(date, srv.defaultFormat);
					result = srv.maximumDate.isBefore(date1);
				} catch(e) {
					this.showMessage("Las fecha estan mal formadas o nulas." + e.message);
				}
				return result;
			};

			// Common
			/**
			* Verifica si una fecha esta dentro de la fecha minima y maxima. La igualdad esta dentro de lo limites
			*
			* @method isDateBetween
			* @return {Boolean} 
			* @param fecha {String | Date} fecha a comparar			
			*/
			srv.isDateBetween = function(date) {
				if (!srv.minimumDate) {
					this.showMessage("No hay fecha minima seteada");
					return;
				}
				if (!srv.maximumDate) {
					this.showMessage("No hay fecha maxima seteada");
					return;
				}
				var compareDate;
				try {
					compareDate = moment(date, "DD/MM/YYYY");
				} catch (e) {
					this.showMessage("La fecha pasada por parametro esta incorrecta");
				}

				return ( srv.minimumDate.isAfter(compareDate) && srv.maximumDate.isBefore(compareDate) );
			};

			srv.showMessage = function(msj) {
				console.log("DateValidatorError: " + msj);
			};
			return srv;
		});
	};
