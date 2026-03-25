sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.consapiens.fiori.f1.fioriappf1.controller.Dirver", {
        onInit() {
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
        }
    });
});