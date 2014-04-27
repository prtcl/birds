
var app = (function () {
    var app = {};
    function createOscillator (args) {
        var options = $.extend({ type: 'sine', frequency: 440 }, args),
            osc = app.context.createOscillator(),
            types = { sine: osc.SINE, square: osc.SQUARE, saw: osc.SAWTOOTH };
        osc.type = types[options.type]
        osc.frequency.value = options.frequency;
        osc.noteOn && osc.noteOn(0);
        return osc;
    }
    function createGainNode (args) {
        var options = $.extend({ gain: 0 }, args),
            gainNode = app.context.createGainNode();
        gainNode.gain.value = options.gain;
        return gainNode;
    }
    function createFilter (args) {
        var options = $.extend({ type: 'lowpass', frequency: 1000, q: 0.0001, gain: 0 }, args),
            filter = app.context.createBiquadFilter(),
            types = {
                hipass: filter.HIGHPASS,
                lowpass: filter.LOWPASS,
                bandpass: filter.BANDPASS,
                allpass: filter.ALLPASS,
                highshelf: filter.HIGHSHELF,
                lowshelf: filter.LOWSHELF,
                peak: filter.PEAKING
            };
        filter.type = types[options.type];
        filter.frequency.value = options.frequency;
        filter.Q.value = options.q;
        filter.gain.value = options.gain;
        return filter;        
    }
    function createDelayNode (args) {
        var options = $.extend({ time: 0 }, args),
            delay = app.context.createDelayNode();
        delay.delayTime.value = options.time;
        return delay;
    }
    function createCompressor (args) {
        var options = $.extend({ ratio: 1.5, threshold: -1, attack: 0.1, release: 0.25 }, args),
            comp = app.context.createDynamicsCompressor();
        comp.threshold.value = options.threshold;
        comp.ratio.value = options.ratio;
        comp.attack.value = options.attack;
        comp.release.value = options.release;
        return comp;
    }
    app.context = (function(){
        var context;
        if (typeof AudioContext != 'undefined'){
            context = new AudioContext();
        } else if (typeof webkitAudioContext != 'undefined'){
            context = new webkitAudioContext();
        }
        return context;
    })();
    app.run = function () {
        this.container = $('#container');
        this.infoWindow = $('#info');
        this.footer = $('#footer');
        this.errorBar = $('#error-bar')
        this.videoOne = $('#birds-one');
        this.videoTwo = $('#birds-two');
        this.resize();
        if (this.context) {
            this.play();
        } else {
            this.bork();
        }
        return this;
    };
    app.resize = function () {
        var width = this.container.width(),
            height = this.container.height();
        this.videoOne.css({ height: height });
        this.videoTwo.css({ height: height });
        return this;
    };
    window.addEventListener('resize', plonk.limit(100, app.resize, app));
    if (app.context) {
        app.nodes = {
            oscA: createOscillator({ type: 'saw', frequency: 100 }),
            oscB: createOscillator({ type: 'sine', frequency: 600 }),
            xmodGainA: createGainNode({ gain: 1 }),
            xmodGainB: createGainNode({ gain: 1 }),
            oscGainA: createGainNode(),
            oscGainB: createGainNode(),
            delay: createDelayNode({ time: 0.1 }),
            filter: createFilter({ type: 'lowpass', frequency: 330, q: 0.45 }),
            compressor: createCompressor({ ratio: 8, threshold: -1, attack: 0.1, release: 0.25 }),
            master: createGainNode()
        };
        app.nodes.oscB.connect(app.nodes.xmodGainA);
        app.nodes.xmodGainA.connect(app.nodes.oscA.frequency);
        app.nodes.oscA.connect(app.nodes.xmodGainB); 
        app.nodes.xmodGainB.connect(app.nodes.oscB.frequency);
        app.nodes.oscA.connect(app.nodes.oscGainA);
        app.nodes.oscB.connect(app.nodes.oscGainB);
        app.nodes.oscGainA.connect(app.nodes.filter);
        app.nodes.oscGainB.connect(app.nodes.filter);
        app.nodes.oscGainA.connect(app.nodes.delay);
        app.nodes.oscGainB.connect(app.nodes.delay);
        app.nodes.delay.connect(app.nodes.filter);
        app.nodes.filter.connect(app.nodes.compressor);
        app.nodes.compressor.connect(app.nodes.master);
        app.nodes.master.connect(app.context.destination);
    }
    app.play = function () {
        var videoOne = this.videoOne[0],
            videoTwo = this.videoTwo[0],
            speedOne = plonk.drunk(0.75, 3),
            speedTwo = plonk.drunk(0.75, 3),
            xmodA = plonk.drunk(1, 400, 0.05),
            xmodB = plonk.drunk(1, 400, 0.05),
            oscAGain = plonk.drunk(0.75, 1, 0.05),
            oscBGain = plonk.drunk(0.75, 1, 0.05),
            oscAFreq = plonk.drunk(95, 105),
            oscBFreq = plonk.drunk(28, 38),
            delay = plonk.drunk(0.01, 1, 0.075),
            filter = plonk.drunk(100, 6000);
        videoOne.play();
        videoTwo.play();
        plonk.dust(250, 1000, function () {
            videoOne.playbackRate = speedOne();
        }, this);
        plonk.dust(250, 1000, function () {
            videoTwo.playbackRate = speedTwo();
        }, this);
        plonk.walk(20, 50, function () {
            app.nodes.xmodGainA.gain.value = xmodA();
        });
        plonk.walk(20, 50, function () {
            app.nodes.xmodGainB.gain.value = xmodB();
        });
        plonk.walk(20, 50, function () {
            app.nodes.oscGainA.gain.value = plonk.log(oscAGain());
        });
        plonk.walk(20, 50, function () {
            app.nodes.oscGainB.gain.value = plonk.log(oscBGain());
        });
        plonk.walk(50, 300, function () {
            app.nodes.oscA.frequency.value = oscAFreq();
        });
        plonk.walk(50, 300, function () {
            app.nodes.oscB.frequency.value = oscBFreq();
        });
        plonk.walk(1000, 10000, function(time){
            var n = delay();
            app.nodes.delay.delayTime.setTargetValueAtTime(n, 0, 10);
        });
        plonk.walk(100, 300, function () {
            app.nodes.filter.frequency.value = filter();
        });
        plonk.wait(250, function () {
            plonk.env(0, 1, 3000, function (n, i) {
                app.nodes.master.gain.value = n;
            });
        });
        plonk.wait(20000, function () {
            app.infoWindow.fadeOut(1000);
            app.footer.fadeIn(1000);
        });
        return this;
    };
    app.bork = function () {
        this.infoWindow.hide();
        this.errorBar.fadeIn(500);
        return this;
    };
    return app;
})();
