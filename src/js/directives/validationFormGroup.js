'use strict';

var validationFormGroup = function () {
  return {
    restrict: 'C',
    require: '?form',
    link: function(scope, element, attrs, formController){

      if(!formController)
        return;

      scope.$watch(function(){
        return formController.$valid;
      }, function(valid) {

        var userHadUsedInput = element[0].querySelector('.ng-dirty');
        if(userHadUsedInput){
          if(valid)
            element.removeClass('has-error');
          else
            element.addClass('has-error'); 
        }
       
      });

      scope.$watch(function(){
        return formController.$pristine;
      },function(pristine) {
        if(pristine)
          element.removeClass('has-error');
      });

      scope.$watch(function(){
        return formController.$dirty;
      },function(dirty) {
        var valid =formController.$valid 
        var userHadUsedInput = element[0].querySelector('.ng-dirty');
        if(userHadUsedInput){
          if(valid)
            element.removeClass('has-error');
          else
            element.addClass('has-error'); 
        }

      });

    }
  };

};

app.directive('formGroup', [validationFormGroup]); 