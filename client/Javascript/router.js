'use strict'

// export default class Router {

//     constructor() {
//         this.routes =[];
//         console.log("router active");
//     }

//         get(uri, callback) {
//             console.log(uri, "URI", callback)
//             if(!uri || !callback) throw new Error('error here');


//             if(typeof uri !=="string") throw new TypeError('error');
//             if(typeof callback !== "function") throw new TypeError('error');

//             this.routes.forEach(route => {
//                 if(route.uri === uri) throw new Error('error');
//             });
//             const route = {
//                 uri,
//                 callback
//             }
//                 this.getUrlVars(); 
//                 this.getParams(window.location.pathname);
//                 //console.log(this.getParams(window.location.pathname))
//                 //console.log(this.getUrlVars()["id"]);
//             this.routes.push(route)

//             console.log(this.routes)
//         }





// //Initialise Router


// //Check if URL exists
//         //If does
//             //Check parameters
//             //return values
//         //If does not
//             //Create in route array
//             //Check parameters
//             //return values

//         link(uri, callback) {
//             console.log(uri, callback)
//             this.get(uri, callback);
//             console.log()
//             this.init()
//         }




//         init() {
//             this.routes.some(route => {
//                 // console.log(route)
//                 let regEx = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));
//                 //let regEx = new RegExp(route.uri.replace(`^${route.uri}$`));
//                 let path = window.location.pathname;
//                 if(path.match(regEx)) {
//                     // console.log(path, "MATCH")
//                     const params = this.getParams(path);
//                     let req = { path }
//                     //console.log(params)
//                     return route.callback.call(this, req, params);
//                 }   
//                 // console.log(this.routes);
//             })
//         }

//         /*
//         init() {
//             this.routes.some(route => {

//             let regEx = new RegExp(route.uri.replace(/:[^\s/]+/g, '([\\w-]+)'));
//             //let regEx = new RegExp(route.uri.replace(`^${route.uri}$`));
//             let path = window.location.pathname;
         
//                 if(path.match(regEx)) {
//                     let req = { path }
//                     return route.callback.call(this, req);
//                 }

//             })
//         }
// */







//             getParams(path) {

//                 //console.log(path)
//                 //console.log(path.split("/").length - 2)
//                 const numParams = path.split("/").length - 1
//                 const url = path.split( '/' );
//                 //console.log(url)
//                 if(numParams === 2) {
//                     //console.log(( url[ url.length - 2 ] ))
//                     return [( url )];
//                 } else if(numParams === 3) {
//                     return [( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
//                 } else if(numParams === 4) {
//                     return [( url[ url.length - 3 ] ), ( url[ url.length - 2 ] ), ( url[ url.length - 1 ] )];
//                 }
//             }






//             navigate() {

//             }












//         getUrlVars() {
//             let vars = {};
//             let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//                 vars[key] = value;
//             });
//             return vars;
//         }

// }






export default class Router {
    routes = [];
    mode = null;
    root = '/';
  
    constructor(options) {
        console.log(options)
      this.mode = window.history.pushState ? 'history' : 'hash';
      if (options.mode) this.mode = options.mode;
      if (options.root) this.root = options.root;
      this.listen();
    }
  
    add = (path, cb) => {
      this.routes.push({ path, cb });
      return this;
    };
  
    remove = path => {
      for (let i = 0; i < this.routes.length; i += 1) {
        if (this.routes[i].path === path) {
          this.routes.slice(i, 1);
          return this;
        }
      }
      return this;
    };
  
    flush = () => {
      this.routes = [];
      return this;
    };
  
    clearSlashes = path =>
      path
        .toString()
        .replace(/\/$/, '')
        .replace(/^\//, '');
  
    getFragment = () => {
      let fragment = '';
      if (this.mode === 'history') {
        fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
      } else {
        const match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';
      }
      return this.clearSlashes(fragment);
    };
  
    navigate = (path = '') => {
      if (this.mode === 'history') {
        window.history.pushState(null, null, this.root + this.clearSlashes(path));
      } else {
        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
      }
      return this;
    };
  
    listen = () => {
      clearInterval(this.interval);
      this.interval = setInterval(this.interval, 50);
    };
  
    interval = () => {
      if (this.current === this.getFragment()) return;
      this.current = this.getFragment();
  
      this.routes.some(route => {
        const match = this.current.match(route.path);
        if (match) {
          match.shift();
          route.cb.apply({}, match);
          return match;
        }
        return false;
      });
    };
  }
  
