'use strict';

var loginService = function ($http,$rootScope, $q,$window,$timeout,$location,TokenRestManager) {

    var loginFactory = {};
    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = TokenRestManager.cookieUser() || { username: 'Invitado', role: userRoles.public };

    function changeUser(user) {
        TokenRestManager.setCookieUser(user);
        angular.copy(user,currentUser);
    };

    function reinituser(){
        currentUser =  { username: 'Invitado', role: userRoles.public };
    }

    loginFactory.accessLevels = accessLevels;
    loginFactory.userRoles= userRoles;
    loginFactory.user = currentUser;

    var standardSuccessFunction = function (result){
        return result; 
    };

    loginFactory.changeUser = function (user) {
        changeUser(user);
    };

    loginFactory.authorize = function(accessLevel, role) {
        if(role === undefined)
            role = currentUser.role;      

        return accessLevel.bitMask & role.bitMask;
    };

    loginFactory.isLoggedIn = function(user) {
        var valido = false,keepGoing=true;

        if(user === undefined)
            user = currentUser;       

        angular.forEach(userRoles, function(value){
            if(keepGoing){
                if(user.role.title == value.title && value.title!='public'){
                    valido = true;
                    keepGoing = false;
                }   
            }
        } );

        return valido;
    };

    //loginFactory.callLogin = function (username,password,isAdmin) {
    loginFactory.callLogin = function (username,password) {
        var auth = {};
        auth.user = username;
        auth.pass = password;
        //auth.type = isAdmin ? 1 : 0;
        $rootScope.usuario = username;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'autenticacion/login',
            headers : { 'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'}  ,
            data: auth
        })
        .then(standardSuccessFunction);  
    };
    
    loginFactory.callLogout = function(){
        TokenRestManager.cleanStorage();        
    };

    loginFactory.generateRoleFromTipo = function(code){
        if( code == 'ADM'  ){
            return userRoles.admin;
        }else{         
            return userRoles.personal; 
        }     
    };

    loginFactory.deleteLocalCredentials = function(){
        TokenRestManager.cleanStorage();
    };

    loginFactory.callRecoveryPassword = function(username){
        var auth = {};
        auth.email = username;

        return $http({
            method  : 'POST',
            url     : app.constants.backend_path + 'autenticacion/recoveryPass',
            headers : { 'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'}  ,
            data: auth
        })
        .then(standardSuccessFunction);
    };

    return loginFactory;
};

app.factory('Auth', ['$http','$rootScope', '$q','$window','$timeout','$location','TokenRestManager', loginService]);

