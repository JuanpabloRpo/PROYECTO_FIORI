sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox"
], (Controller, Filter, FilterOperator, Sorter, MessageBox) => {
    "use strict";

    return Controller.extend("com.consapiens.fiori.f1.fioriappf1.controller.Dirver", {
        onInit() {
            this._sLastSortField = "";
            this._bSortDescending = false;

            this._mSortButtons = {
                IdPiloto: "btnSortIdPiloto",
                Nombre: "btnSortNombre",
                Apellidos: "btnSortApellido",
                Edad: "btnSortEdad",
                Debut: "btnSortDebut",
                Escuderia: "btnSortEscuderia",
                Puntostotales: "btnSortPuntos"
            };
        },

        onFiltroChange: function(){
            var oTable = this.byId("tbl_pilotos");
            var oBinding = oTable.getBinding("items");

            var sCampo = this.byId("selectFiltro").getSelectedKey();
            var sValor = this.byId("searchFiltro").getValue();

            var aFilters = [];
            var oFilter;

            if(sValor && sValor.trim() !== ""){
                if (sCampo === "Nombre" || sCampo === "Apellidos" || sCampo === "Escuderia") {
                    oFilter = new Filter(sCampo, FilterOperator.Contains, sValor);
                } else {
                    oFilter = new Filter(sCampo, FilterOperator.EQ, sValor);
                }

                aFilters.push(oFilter);
            }

            oBinding.filter(aFilters);
        },

        onSortColumn: function(oEvent){
            var oButton = oEvent.getSource();
            var sCampo = oButton.data("sortField");

            var oTable = this.byId("tbl_pilotos");
            var oBinding = oTable.getBinding("items");

            if(this._sLastSortField === sCampo){
                this._bSortDescending = !this._bSortDescending;
            }else{
                this._sLastSortField = sCampo;
                this._bSortDescending = false;
            }

            var oSorter = new Sorter(sCampo, this._bSortDescending);
            oBinding.sort(oSorter);

            this._actualizarIconsOrden();

        },

        _actualizarIconsOrden: function(){
            var sIcono = this._bSortDescending ?
            "sap-icon://slim-arrow-down"
            : "sap-icon://slim-arrow-up";

            var sTooltip = this._bSortDescending
            ? "Ordenado descendente"
            : "ordenado ascendente";

            Object.keys(this._mSortButtons).forEach(function (sCampo) {
                var oButton = this.byId(this._mSortButtons[sCampo]);
                if(oButton) {
                    oButton.setIcon("");
                    oButton.setTooltip("");
                }
            }.bind(this));

            if(this._sLastSortField && this._mSortButtons[this._sLastSortField]) {
                var oActiveButton = this.byId(this._mSortButtons[this._sLastSortField]);

                if(oActiveButton){
                    oActiveButton.setIcon(sIcono);
                    oActiveButton.setTooltip(sTooltip);
                }
            }
        },

        onAbrirCrearPiloto: function(){
            this.byId("inpCreateIdPiloto").setEditable(true);
            this.byId("inpCreateIdPiloto").setValue("");
            this.byId("inpCreateNombre").setValue("");
            this.byId("inpCreateApellido").setValue("");
            this.byId("inpCreateEdad").setValue("");
            this.byId("inpCreateDebut").setValue("");
            this.byId("inpCreateEscuderia").setValue("");
            this.byId("inpCreatePuntos").setValue("");

            this.byId("dlgCrearPiloto").open();

            this._isUpdate = false;
        },

        onCrearPiloto: function () {
            var oModel = this.getView().getModel();

            var sFechaDebut = this.byId("inpCreateDebut").getValue();

            // Si la fecha fue seleccionada
            if (sFechaDebut) {
                    // Completamos la hora al formato deseado (hora 19:00:00 por ejemplo)
        
            var sFechaCompleta = sFechaDebut + "T19:00:00";

            // Creamos el objeto para enviar
            if(!this._isUpdate){
                var oNuevoPiloto = {
                IdPiloto: this.byId("inpCreateIdPiloto").getValue(),
                Nombre: this.byId("inpCreateNombre").getValue(),
                Apellidos: this.byId("inpCreateApellido").getValue(),
                Edad: this.byId("inpCreateEdad").getValue(),
                Debut: sFechaCompleta,  // Aquí enviamos la fecha con hora
                Escuderia: this.byId("inpCreateEscuderia").getValue(),
                Puntostotales: this.byId("inpCreatePuntos").getValue()
            };
            }{
                var oNuevoPiloto = {
                Nombre: this.byId("inpCreateNombre").getValue(),
                Apellidos: this.byId("inpCreateApellido").getValue(),
                Edad: this.byId("inpCreateEdad").getValue(),
                Debut: sFechaCompleta,  // Aquí enviamos la fecha con hora
                Escuderia: this.byId("inpCreateEscuderia").getValue(),
                Puntostotales: this.byId("inpCreatePuntos").getValue()
            };
            }

        // Llamada a OData para crear
        if(!this._isUpdate){
            oModel.create("/DriverSet", oNuevoPiloto, {
            success: function () {
                sap.m.MessageToast.show("Piloto creado correctamente");
            },
            error: function () {
                sap.m.MessageToast.show("Error al crear el piloto");
            }
        });
        }else{

            var sPath = this._oContext.getPath();  // Obtener la ruta del objeto en el modelo

        oModel.update(sPath, oNuevoPiloto, {
            success: function () {
                sap.m.MessageToast.show("Piloto actualizado correctamente");
            },
            error: function () {
                sap.m.MessageToast.show("Error al actualizar el piloto");
            }
        });

        }

            // Cerrar el diálogo después de guardar
                this.byId("dlgCrearPiloto").close();
            } else {
                sap.m.MessageToast.show("Por favor, seleccione una fecha de debut.");
            }
        },

        onCancelarCrearPiloto: function () {
            this.byId("dlgCrearPiloto").close();
        },

        onEditarPiloto: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();  // Obtiene el contexto de la fila seleccionada
            var oData = oContext.getObject();  // Obtiene los datos de la fila

            // Guarda el contexto para usarlo después al hacer el update
            this._oContext = oContext;

            this._isUpdate = true;

            var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
                pattern: "yyyy-MM-dd"  // Formato de fecha: 31 Dec 2023
            });

            var sFormattedDebut = oDateFormat.format(new Date(oData.Debut));

            // Asignar la fecha formateada al campo del dialog
            this.byId("inpCreateDebut").setValue(sFormattedDebut);

            // Abre el dialog y asigna los valores a los inputs
            this.byId("inpCreateIdPiloto").setValue(oData.IdPiloto);  // Asigna el valor del IdPiloto
            this.byId("inpCreateNombre").setValue(oData.Nombre);
            this.byId("inpCreateApellido").setValue(oData.Apellidos);
            this.byId("inpCreateEdad").setValue(oData.Edad);
            this.byId("inpCreateEscuderia").setValue(oData.Escuderia);
            this.byId("inpCreatePuntos").setValue(oData.Puntostotales);

            // Hacer que el campo IdPiloto no sea editable en el dialog
            this.byId("inpCreateIdPiloto").setEditable(false);  // Deshabilitar el campo IdPiloto para que no sea editable

            // Abre el dialog para editar
            this.byId("dlgCrearPiloto").open();
        },

        onEliminarPiloto: function (oEvent) {
    var oButton = oEvent.getSource();
    var oContext = oButton.getBindingContext();  // Obtener el contexto de la fila seleccionada
    var sPath = oContext.getPath();  // Obtener la ruta del objeto a eliminar

    // Confirmar eliminación con un MessageBox
    sap.m.MessageBox.confirm(
        "¿Está seguro de que desea eliminar este piloto?", {
            title: "Eliminar Piloto",
            onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                    // Llamada para eliminar el piloto en el backend
                    var oModel = this.getView().getModel();  // Obtener el modelo
                    oModel.remove(sPath, {
                        success: function () {
                            sap.m.MessageToast.show("Piloto eliminado correctamente");
                        },
                        error: function () {
                            sap.m.MessageToast.show("Error al eliminar el piloto");
                        }
                    });
                }
            }.bind(this)  // Asegura que el contexto de `this` sea el controlador actual
        }
    );
}

    });
});