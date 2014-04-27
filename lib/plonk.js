// plonk.js - timer and utility micro-library

(function () {

    var plonk = {};

    // Function.prototype.bind fallback
    plonk.bind = function (fn, context) {
        if (fn.bind) return fn.bind(context || this);
        return function () {
            return fn.apply(context || this, arguments);
        };
    };

    // returns the current datetime in milliseconds since epoch
    plonk.now = (Date.now || function () {
        return (new Date).valueOf();
    });

    // returns a random number between min and max
    plonk.rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    // linear map of value from input range to output range
    plonk.scale = function (value, minIn, maxIn, minOut, maxOut) {
        return minOut + (value - minIn) * (maxOut - minOut) / (maxIn - minIn);
    };

    // constrain value between min and max
    plonk.constrain = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    // poor mans logarithmic map
    plonk.log = function (value) {
        return Math.pow(value, Math.E);
    };

    // executes the callback function N times
    plonk.times = function (times, callback, context) {
        for (var i = 0; i < times; i++) {
            callback.apply(context || this, [i + 1]);
        }
    };

    // returns a function that performs a "drunk walk" between min and max
    plonk.drunk = function (min, max, step) {
        var n = plonk.rand(min, max);
        step || (step = 0.1);
        return function () {
            n = plonk.constrain(n + (max * plonk.rand(-1, 1) * step), min, max);
            return n;
        };
    };

    // simple wrapper for setTimeout
    plonk.wait = function (time, callback, context) {
        return setTimeout(plonk.bind(callback, context || this), Math.round(time));
    };

    // poor mans nextTick polyfill
    plonk.tick = (function () {
        if (typeof process === 'object' && 'nextTick' in process) {
            return function (callback, context) {
                process.nextTick(plonk.bind(callback, context || this));
            };
        } else if (window && 'setImmediate' in window) {
            return function (callback, context) {
                setImmediate(plonk.bind(callback, context || this));
            };
        } else if (window && 'postMessage' in window) {
            return (function(){
                var callbacks = {};
                window.addEventListener('message', function (e) {
                    var name = e.data;
                    if (e.source !== window && !(name in callbacks)) return;
                    callbacks[name]();
                    delete callbacks[name];
                }, true);
                return function (callback, context) {
                    var name = 'tick-' + Math.random();
                    callbacks[name] = plonk.bind(callback, context || this);
                    postMessage(name, '*');
                };
            }).apply(this);
        }
        return function (callback, context) {
            setTimeout(plonk.bind(callback, context || this), 0);
        };
    }).apply(this);

    // returns a function that will only be executed N milliseconds after the last call
    plonk.limit = function (time, callback, context) {
        var timer;
        return function () {
            timer && clearTimeout(timer);
            timer = setTimeout(plonk.bind(callback, context || this), Math.round(time));
        };
    };

    // simple wrapper for setInterval with stop function
    plonk.metro = function (time, callback, context) {
        var i = 0, timer;
        timer = setInterval(function(){
            var cont = callback.apply(context || this, [i++]);
            if (cont === false) clearInterval(timer);
        }, Math.round(time));
    };

    // timer function that jitters between min and max milliseconds
    plonk.dust = function (min, max, callback, context) {
        var i = 0;
        (function dust () {
            var time = Math.round(plonk.rand(min, max));
            setTimeout(function(){
                var cont = callback.apply(context || this, [time, i++]);
                if (cont !== false) dust();
            }, time);
        })();
    };

    // timer function that performs a "drunk walk" between min and max milliseconds
    plonk.walk = function (min, max, callback, context) {
        var drunk = plonk.drunk(min, max),
            i = 0;
        (function walk () {
            var time = Math.round(drunk());
            setTimeout(function(){
                var cont = callback.apply(context || this, [time, i++]);
                if (cont !== false) walk();
            }, time);
        })();
    };

    // interpolate between value and target over time
    plonk.env = function (value, target, time, callback, context) {
        var steps = Math.round(time / 10),
            i = 0,
            timer;
        if (time > 10) {
            timer = setInterval(function(){
                i++;
                callback.apply(context || this, [plonk.scale(i, 1, steps, value, target), i]);
                if (steps === i) clearInterval(timer);
            }, 10);
        } else {
            timer = setTimeout(function(){
                callback.apply(context || this, [target]);
            }, time);
        }
    };

    // execute the callback function with increasing speed, starting with delay
    plonk.ramp = function (delay, callback, context) {
        (function env (i) {
            var step = Math.floor(delay / i--);
            setTimeout(function(){
                callback.apply(context || this, [step]);
                if (i > 0) env(i);
            }, step);
        })(11);
    };

    if (typeof module === 'object' && module.exports) {
        module.exports = plonk;
    } else if (typeof define === 'function') {
        define('plonk', [], function (){
            return plonk;
        });
    } 

    if (typeof window === 'object' && window === this) {
        this.plonk = plonk;
    }

}).apply(this);
