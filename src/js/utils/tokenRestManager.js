'use strict';

var tokenRestManager = function ($sessionStorage) {  
    var tokenFactory = {};

    tokenFactory.setCookieRest = function(new_cookie){
        $sessionStorage['token-pide'] = new_cookie;
    };

    tokenFactory.cookieRest = function (){
        return $sessionStorage['token-pide'];
    };

    tokenFactory.cookieUser = function(){
        return $sessionStorage['user'];
    };

    tokenFactory.cookieViews = function(){
        return $sessionStorage['views'];
    };

    tokenFactory.cleanStorage = function (){
        delete $sessionStorage['token-pide'] ;
        delete $sessionStorage['user'];    
    };

    tokenFactory.setCookieUser = function(user){
        $sessionStorage['user'] = user;
    };
    tokenFactory.setCookieCredentials = function(credenciales){
        $sessionStorage['credential'] = credenciales;
    };
    tokenFactory.setCookieViews = function(views){
        $sessionStorage['views'] = views;
    };
    tokenFactory.cookieCredentials= function(){
        return $sessionStorage['credential'];
    };

    tokenFactory.paramNameCookieRest = function(){
        return 'Authenticate';
    }

    return tokenFactory;

};

app.factory('TokenRestManager', ['$sessionStorage', tokenRestManager]);