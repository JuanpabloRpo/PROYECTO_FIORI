sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], (Controller, Filter, FilterOperator, Sorter) => {
    "use strict";

    return Controller.extend("com.consapiens.fiori.f1.fioriappf1.controller.Dirver", {
        onInit() {
            this._sLastSortField = "";
            this._bSortDescending = false;

            this._mSortButtons = {
                IdPiloto: {
                    id: "btnSortIdPiloto",
                    text: "Número"
                },
                Nombre: {
                    id: "btnSortNombre",
                    text: "Nombre"
                },
                Apellidos: {
                    id: "btnSortApellidos",
                    text: "Apellido"
                },
                Edad: {
                    id: "btnSortEdad",
                    text: "Edad"
                },
                Debut: {
                    id: "btnSortDebut",
                    text: "Año debut"
                },
                Escuderia: {
                    id: "btnSortEscuderia",
                    text: "Escuderia"
                },
                Puntostotales: {
                    id: "btnSortPuntos",
                    text: "Puntos totales"
                }
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

            this._actualizarIndicadorOrden();

        },

        _actualizarIndicadorOrden: function(){
            var sFlecha = this._bSortDescending ? " ↓" : " ↑";
        }

    });
});