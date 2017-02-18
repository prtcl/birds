
import assign from 'lodash/assign';

export default function createFilter (args = {}, audioContext) {
  const options = assign({ type: 'lowpass', frequency: 1000, q: 0.0001, gain: 0 }, args),
        filter = audioContext.createBiquadFilter();
  filter.type = options.type;
  filter.frequency.value = options.frequency;
  filter.Q.value = options.q;
  filter.gain.value = options.gain;
  return filter;
}
