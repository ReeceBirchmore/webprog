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
                this.getParams(window.location.pathname);
                //console.log(this.getParams(window.location.pathname))
                //console.log(this.getUrlVars()["id"]);
            this.routes.push(route)
        }





//Initialise Router


//Check if URL exists
        //If does
            //Check parameters
            //return values
        //If does not
            //Create in route array
            //Check parameters
            //return values






        init() {
            this.routes.some(route => {
                let regEx = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));
                console.log(regEx)
                //let regEx = new RegExp(route.uri.replace(`^${route.uri}$`));
                let path = window.location.pathname;
                if(path.match(regEx)) {
                    const params = this.getParams(path);
                    let req = { path }
                    //console.log(params)
                    return route.callback.call(this, req, params);
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

                //console.log(path)
                //console.log(path.split("/").length - 2)
                const numParams = path.split("/").length - 1
                const url = path.split( '/' );
                //console.log(url)
                if(numParams === 2) {
                    //console.log(( url[ url.length - 2 ] ))
                    return [( url )];
                } else if(numParams === 3) {
                    return [( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
                } else if(numParams === 4) {
                    return [( url[ url.length - 3 ] ), ( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
                }
            }






            navigate() {

            }












        getUrlVars() {
            let vars = {};
            let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        }

}