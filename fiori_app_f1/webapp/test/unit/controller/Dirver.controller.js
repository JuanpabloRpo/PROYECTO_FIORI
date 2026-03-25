/*global QUnit*/

sap.ui.define([
	"com/consapiens/fiori/f1/fioriappf1/controller/Dirver.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Dirver Controller");

	QUnit.test("I should test the Dirver controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
