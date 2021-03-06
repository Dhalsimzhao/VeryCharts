define(function (require , exports , module) {
    "use strict";
    var helper = require("verycharts/helper");
    var Component = require("verycharts/Component");
    var ChartFactory = require("verycharts/ChartFactory");
    var htmlUtil = require("verycharts/htmlUtil");
    
    var Title = Component.extend({
        constructor: function Title(owner , renderer) {
            Component.apply(this , arguments);
        } ,
        options: function (options) {
            if (arguments.length === 0) { return this._options; }
            this._options = options.title;
            this._options.style = helper.parseOption("stats" , this._options.style);
            this._isDirty = true;
            return this;
        } , 
        layout: function (bounds) {
            var options = this.options();
            if (options.enabled === false){
                return bounds;
            }else{
                var titleSize = htmlUtil.stringSize(options.text , options.style.normal);
                var ret = helper.archorLayout(titleSize , bounds , options.layout);
                this.bounds(ret.bounds);
                this.bbox(ret.bbox);
                
                return ret.rest;
            }
        } ,
        redraw: function () {
            var renderer = this.renderer;
            var titleDisplay = renderer.select(".title");
            var options = this.options();
            if (options.enabled === false){
                if (!titleDisplay.empty()){
                    titleDisplay.remove();
                }
            }else{
                if (titleDisplay.empty()){
                    titleDisplay = renderer.label().attr("class" , "title");
                }
                var bbox = this.bbox();
                var transform = "";
                var layout = options.layout;
                var normalStyle = options.style.normal;
                if (layout.anchor === "left"){
                    transform = "translate(" + bbox.width + " , " + bbox.height + ")";
                    transform += " rotate(-90 , " + bbox.x + " , " + bbox.y + ")";
                } else if (layout.anchor === "right"){
                    transform = "rotate(90 , " + bbox.x + " , " + bbox.y + ")";
                } else {
                    transform = "translate(0 , " + bbox.height + ")";
                }
                //描绘的时候上提2像素位置
                titleDisplay.attr("x" , bbox.x)
                        .attr("y" , bbox.y - 2)
                        .attr("transform" , transform)
                        .style({
                            "fill": normalStyle.color ,
                            "font-size": normalStyle.fontSize + "px" ,
                            "font-weight": normalStyle.fontWeight ,
                            "font-family": normalStyle.fontFamily
                        })
                        .text(options.text);
            }
            return this;
        } ,
    });
    
    ChartFactory.register({
        type: "title" ,
        factory: "component" ,
        ctor: Title ,
        defaultOptions: {
            "title": {
                "enabled": true ,
                "text": "Chart Title" ,
                // "useHTML": false ,
                "style": {
                    "color": "#000000" ,
                    "fontSize": 24 ,
                    "fontWeight": "none" ,
                    "fontFamily": "Verdana , Arial, sans-serif"
                } ,
                "layout": {
                    "floating": false ,
                    "anchor": "top" ,
                    "horizontal": "center" ,
                    "vertical": "center" ,
                    "margin": 4 ,
                }
            }
        }
    });
    
    module.exports = Title;
})