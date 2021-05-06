
'use strict';


var cleanOnBlur = function (ValidatorUtil) {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ngModelCtrl) {
            if (attrs.type === 'radio' || attrs.type === 'checkbox') 
                return;

            //var expressionToCall = attrs.ngChangeOnBlur;
            var oldValue = null;
            elm.bind('focus',function() {
                scope.$apply(function() {
                    oldValue = elm.val();
                    //console.log(oldValue);
                });
            })
            elm.bind('blur', function() {
                scope.$apply(function() {
                    var newValue = elm.val();
                    if (newValue != oldValue){
                        ngModelCtrl.$setViewValue(ValidatorUtil.cleanInput(newValue));
                        ngModelCtrl.$render();
                    }
                });         
            });
        }
    };

};

app.directive('ngCleanOnBlur', ['ValidatorUtil',cleanOnBlur]);  