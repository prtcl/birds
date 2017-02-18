
import assign from 'lodash/assign';

export default function createGain (args = {}, audioContext) {
  const options = assign({ gain: 0 }, args),
        gainNode = audioContext.createGain();
  gainNode.gain.value = options.gain;
  return gainNode;
}
