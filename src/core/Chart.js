define(function (require , exports , module) {
    "use strict";
    var oop = require("oop");
    var evts = require("evts");
    var helper = require("verycharts/helper");
    var ChartDefault = require("verycharts/ChartDefault");
    var ChartFactory = require("verycharts/ChartFactory");
    
    var Chart = evts.EventTrigger.extend({
        constructor: function Chart(dom) {
            this._dom = dom;
            this._defaultOptions = ChartDefault.cloneDefault();
            this._chartPlots = {};
        } ,
        _components: null ,
        _chartPlots: null ,
        _defaultOptions: null ,
        _mergedOptions: null ,
        _options: null ,
        _dom: null ,
        _data: null ,
        _theme: null ,
        
        _originOptions: null ,
        _originData: null ,
        setData: function (data) {
            this._data = data;
            this._dataChanged = true;
            this.invalidateRender();
            return this;
        } ,
        setOptions: function (options , merge) {
            this._options = options;
            this._mergeOptionFlag = (merge === true);
            this._optionChanged = true;
            this.invalidateRender();
            return this;
        } ,
        getOptions: function () {
            return this._options;
        } ,
        setTheme: function (theme) {
            this._theme = theme;
            this._themeChanged = true;
            this.invalidateRender();
            return this;
        } ,
        resize: function () {
            this.invalidateLayout();
            return this;
        } ,
        invalidateRender: function () {
            if (!this._renderFlag){
                this._renderFlag = true;
                this._nextFrame();
            }
        } ,
        invalidateLayout: function () {
            if (!this._layoutFlag){
                this._layoutFlag = true;
                this._nextFrame();
            }
        } ,
        destroy: function () {
            this._selector = null;
            this._styles = null;
            this._data = null;
            this._theme = null;
            this._originData = null;
            if (this._space){
                this._space.destroy();
                this._space = null;
            }
            this._destroyed = true;
            return this;
        } ,
        _commitChanged: function () {
            if (this._themeChanged){
                this._mergeTheme();
                this._optionChanged = true;
                this._themeChanged = false;
            }
            if (this._optionChanged){
                this._mergeOption();
                this.invalidateLayout();
                this._optionChanged = false;
            }
            if (this._dataChanged){
                this._performData();
                this.invalidateLayout();
                this._dataChanged = false;
            }
        } ,
        _mergeTheme: function () {
            helper.merge(this._defaultOptions , this._theme);
        } ,
        _mergeOption: function () {
            if (this._mergeOptionFlag && this._mergedOptions){
                this._mergedOptions = helper.merge(this._mergedOptions , this._options);
            }else{
                this._mergedOptions = this._options;
            }
            this._originOptions = helper.merge(helper.clone(this._defaultOptions) , this._mergedOptions);
            
            var type;
            for (type in this._chartPlots) {
                this._chartPlots[type].setOptions(this._originOptions);
            }
            for (var type in this._components) {
                this._components[type].setOptions(this._originOptions)
            }
        } ,
        _performData: function () {
            var header , data , plotTypes , plot , type , i;
            // 准备数据
            if (!this._data){
                this._originData = null;
            }else{
                if (oop.is(this._data , Array)){
                    header = this._data[0];
                    data = this._data.slice(1);
                    // 一维数组,转为二维结构。
                    if (!oop.is(header , Array)){
                        header = [header];
                        data = [data];
                    }
                    this._originData = {
                        header: header ,
                        data: data
                    }
                } else if (typeof this._data === "object") {
                    header = this._data.header;
                    data = this._data.data;
                    if (!header || !data || !oop.is(header , Array) || oop.is(data , Array)){
                        this._originData = null;
                    }else{
                        this._originData = data;
                    }
                } else {
                    this._originData = null;
                }
            }
            // 解析header
            plotTypes = {};
            if (this._originData){
                header = this._originData.header;
                data = this._originData.data;
                for (i = 0; i < header.length; i++) {
                    if (header[i].plotType){
                        plotTypes[header[i].plotType] = true;
                    }
                }
            }
            // 更新或删除plot
            for (type in this._chartPlots) {
                if (plotTypes[type] === true){
                    this._chartPlots[type].setData(this._originData);
                    delete plotTypes[type];
                }else{
                    this._chartPlots[type].destroy();
                    delete this._chartPlots[type];
                }
            }
            // 创建plot
            for (type in plotTypes) {
                plot = ChartFactory.getChartPlotInstance(type);
                if (plot){
                    this._chartPlots[type] = plot;
                    plot.setOptions(this._originOptions).setData(this._originData);
                }
            }
        } ,
        _performLayout: function () {
            if (!this._originData){
                
            }else{
                // 更新基础组件布局
                // 更新布局
            }
        } ,
        _render: function () {
            // 渲染基础组件及chart
        } ,
        _nextFrame: function () {
            if (!this._nextFrameFlag){
                this._nextFrameFlag = true;
                var self = this;
                helper.nextFrame(function () {
                    self._enterFrame();
                    self._nextFrameFlag = false;
                });
            }
        } ,
        _enterFrame: function () {
            if (this._destroyed)
                return;
            this._commitChanged();
            if (this._layoutFlag){
                this._performLayout();
                this._renderFlag = true;
                this._layoutFlag = false;
            }
            if (this._renderFlag){
                this.trigger("render_start");
                this._render();
                this._renderFlag = false;
                this.trigger("render_end");
            }
        }
    });
    
    module.exports = Chart;
})