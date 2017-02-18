
import assign from 'lodash/assign';

export default function (args = {}, audioContext) {
  const options = assign({ type: 'sine', frequency: 440 }, args),
        osc = audioContext.createOscillator();
  osc.type = options.type;
  osc.frequency.value = options.frequency;
  osc.start(0);
  return osc;
}
