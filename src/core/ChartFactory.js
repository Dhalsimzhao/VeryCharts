define(function (require , exports , module) {
    "use strict";
    
    var oop = require("oop");
    var ChartDefault = require("verycharts/ChartDefault");
    var Chart = require("verycharts/Chart");
    var Component = require("verycharts/Component");
    
    
    var chartLib = {};
    var componentLib = {};
    
    module.exports = {
        getChartInstance: function (chartType) {
            if (chartLib[chartType]){
                var instance = new chartLib[chartType]();
                return instance;
            }
            return null;
        } ,
        getComponentInstance: function (componentName , chart) {
            if (componentLib[componentName]){
                var instance = new componentLib[componentName](chart);
                return instance;
            }
            return null;
        } ,
        register: function (desc) {
            if (!desc) return;
            var type = desc.type , ctor = desc.ctor , 
                defaultOptions = desc.defaultOptions;
            if (!type || !ctor) return;
            if (type === "chart"){
                chartLib[type] = ctor;
                ChartDefault.mergeDefault(defaultOptions);
            } else if (type === "component"){
                componentLib[type] = ctor;
                ChartDefault.mergeDefault(defaultOptions);
            }
        } 
    }
});