define(function (require , exports , module) {
    module.exports = {
        groupType: {
            COLUMN: "column" ,
            ROW: "row" ,
            VALUE: "value" ,
            COLOR: "color" ,
            SIZE: "size" ,
            LEGEND: "legend" ,
            ATTRIBUTE: "attribute"
        } ,
        prop2css: {
            "fontSize": "font-size" ,
            "fontWeight": "font-weight" ,
            "fontFamily": "font-family"
        }
    };
});