'use strict';

var ngConfirmClick = function(){
    return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Esta seguro de querer eliminar este elemento?";
            var clickAction = attr.confirmedClick;
            element.bind('click',function (event) {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
};

app.directive('ngConfirmClick', ngConfirmClick);
