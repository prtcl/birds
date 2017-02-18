
import assign from 'lodash/assign';

export default function createDelay (args = {}, audioContext) {
  const options = assign({ time: 0 }, args),
        delay = audioContext.createDelay();
  delay.delayTime.value = options.time;
  return delay;
}
