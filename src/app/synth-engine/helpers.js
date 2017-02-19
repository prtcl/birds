
import assign from 'lodash/assign';

export function createAudioContext () {
  var audioContext;
  if (typeof AudioContext !== 'undefined') {
    audioContext = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
    audioContext = new webkitAudioContext();
  }
  return audioContext;
}

export function createCompressor (audioContext, args = {}) {
  const options = assign({ ratio: 1.5, threshold: -1, attack: 0.1, release: 0.25 }, args),
        comp = audioContext.createDynamicsCompressor();
  comp.threshold.value = options.threshold;
  comp.ratio.value = options.ratio;
  comp.attack.value = options.attack;
  comp.release.value = options.release;
  return comp;
}

export function createDelay (audioContext, args = {}) {
  const options = assign({ time: 0 }, args),
        delay = audioContext.createDelay();
  delay.delayTime.value = options.time;
  return delay;
}

export function createFilter (audioContext, args = {}) {
  const options = assign({ type: 'lowpass', frequency: 1000, q: 0.0001, gain: 0 }, args),
        filter = audioContext.createBiquadFilter();
  filter.type = options.type;
  filter.frequency.value = options.frequency;
  filter.Q.value = options.q;
  filter.gain.value = options.gain;
  return filter;
}

export function createGain (audioContext, args = {}) {
  const options = assign({ gain: 0 }, args),
        gainNode = audioContext.createGain();
  gainNode.gain.value = options.gain;
  return gainNode;
}

export function createOscillator (audioContext, args = {}) {
  const options = assign({ type: 'sine', frequency: 440 }, args),
        osc = audioContext.createOscillator();
  osc.type = options.type;
  osc.frequency.value = options.frequency;
  osc.start(0);
  return osc;
}
