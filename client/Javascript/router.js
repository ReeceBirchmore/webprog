'use strict'

export default class Router {

    constructor() {
        this.routes =[];
    }

        get(uri, callback) {
            if(!uri || !callback) throw new Error('error here');


            if(typeof uri !=="string") throw new TypeError('error');
            if(typeof callback !== "function") throw new TypeError('error');

            this.routes.forEach(route => {
                if(route.uri === uri) throw new Error('error');
            });



            const route = {
                uri,
                callback
            }

            this.getUrlVars(); 
            console.log(this.getUrlVars()["id"]);
            
                    


            this.routes.push(route)


        }

        init() {
            this.routes.some(route => {

            let regEx = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));
            //let regEx = new RegExp(route.uri.replace(`^${route.uri}$`));
            let path = window.location.pathname;
         
            if(path.match(regEx)) {
                const params = this.getParams(path);
                let req = { path }
                return route.callback.call(this, req, params[0]);
            }

            })
        }

        /*
        init() {
            this.routes.some(route => {

            let regEx = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));
            //let regEx = new RegExp(route.uri.replace(`^${route.uri}$`));
            let path = window.location.pathname;
         
                if(path.match(regEx)) {
                    let req = { path }
                    return route.callback.call(this, req);
                }

            })
        }
*/







            getParams(path) {

                console.log(path)
        
                const numParams = path.split("/").length - 1
        
                const url = path.split( '/' );
        
                if(numParams === 2) {
                    return [( url[ url.length - 1 ] )];
                } else if(numParams === 3) {
                    return [( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
                } else if(numParams === 4) {
                    return [( url[ url.length - 3 ] ), ( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
                }
            }

















        getUrlVars() {
            let vars = {};
            let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        }

}