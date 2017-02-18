
import EventEmitter from 'events';
import isUndefined from 'lodash/isUndefined';

import audioContext from 'app/synth-engine/audio-context';
import createGain from 'app/synth-engine/create-gain';
import createCompressor from 'app/synth-engine/create-compressor';
import createFilter from 'app/synth-engine/create-filter';
import createOscillator from 'app/synth-engine/create-oscillator';
import createDelay from 'app/synth-engine/create-delay';


export default class SynthEngine extends EventEmitter {

  constructor () {
    super();
    this.audioContext = audioContext();
    this.nodes = {};
    this._ready = false;
    this._compatibleBrowser = this.isCompatibleBrowser();
  }

  isCompatibleBrowser () {
    if (isUndefined(this.audioContext)) return false;
    if (isUndefined(this.audioContext.createGain) || isUndefined(this.audioContext.createMediaElementSource)) return false;
    return true;
  }

  run () {
    if (this.isReady()) return this;

    if (!this._compatibleBrowser) {
      this.emit('error', new Error('Browser is not compatible with Web Audio API.'));
      return this;
    }

    try {
      this.nodes.oscA = createOscillator({ type: 'sawtooth', frequency: 100 }, this.audioContext);
      this.nodes.oscB = createOscillator({ type: 'sine', frequency: 600 }, this.audioContext);
      this.nodes.xmodGainA = createGain({ gain: 1 }, this.audioContext);
      this.nodes.xmodGainB = createGain({ gain: 1 }, this.audioContext);
      this.nodes.oscGainA = createGain({ gain: 0 }, this.audioContext);
      this.nodes.oscGainB = createGain({ gain: 0 }, this.audioContext);
      this.nodes.delay = createDelay({ time: 0.1 }, this.audioContext);
      this.nodes.delayGain = createGain({ gain: 0.5 }, this.audioContext);
      this.nodes.filter = createFilter({ type: 'bandpass', frequency: 330, q: 0.25 }, this.audioContext);
      this.nodes.compressor = createCompressor({ ratio: 8, threshold: -1, attack: 0.1, release: 0.25 }, this.audioContext);
      this.nodes.output = createGain({ gain: 0 }, this.audioContext);
      this.nodes.oscB.connect(this.nodes.xmodGainA);
      this.nodes.xmodGainA.connect(this.nodes.oscA.frequency);
      this.nodes.oscA.connect(this.nodes.xmodGainB);
      this.nodes.xmodGainB.connect(this.nodes.oscB.frequency);
      this.nodes.oscA.connect(this.nodes.oscGainA);
      this.nodes.oscB.connect(this.nodes.oscGainB);
      this.nodes.oscGainA.connect(this.nodes.filter);
      this.nodes.oscGainB.connect(this.nodes.filter);
      this.nodes.filter.connect(this.nodes.delay);
      this.nodes.filter.connect(this.nodes.compressor);
      this.nodes.delay.connect(this.nodes.delayGain);
      this.nodes.delayGain.connect(this.nodes.filter);
      this.nodes.delayGain.connect(this.nodes.compressor);
      this.nodes.compressor.connect(this.nodes.output);
      this.nodes.output.connect(this.audioContext.destination);
      this._ready = true;
    } catch (err) {
      this.emit('error', err);
    }

    if (this.isReady()) {
      this.emit('ready');
    }

    return this;
  }

  isReady () {
    return (this._compatibleBrowser && this._ready);
  }

  play () {
    if (!this.isReady()) return this;
    var currentTime = this.audioContext.currentTime;
    this.nodes.output.gain.setTargetAtTime(1.5, currentTime, 10);
    return this;
  }

  stop () {
    if (!this.isReady()) return this;
    var currentTime = this.audioContext.currentTime;
    this.nodes.output.gain.setTargetAtTime(0, currentTime, 0.1);
    return this;
  }

  setParameters (attrs = {}) {
    const currentTime = this.audioContext.currentTime;

    this.nodes.xmodGainA.gain.setValueAtTime(attrs.xmodA, currentTime);
    this.nodes.xmodGainB.gain.setValueAtTime(attrs.xmodB, currentTime);
    this.nodes.oscGainA.gain.setValueAtTime(attrs.oscA_gain, currentTime);
    this.nodes.oscGainB.gain.setValueAtTime(attrs.oscB_gain, currentTime);
    this.nodes.oscA.frequency.setValueAtTime(attrs.oscA_freq, currentTime);
    this.nodes.oscB.frequency.setValueAtTime(attrs.oscB_freq, currentTime);
    this.nodes.delay.delayTime.setTargetAtTime(attrs.delay_time, currentTime, 0.1);
    this.nodes.filter.frequency.setTargetAtTime(attrs.filter_freq, currentTime, 0.1);
    return this;
  }
}
