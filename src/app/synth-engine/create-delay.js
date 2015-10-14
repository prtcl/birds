
var _ = { assign: require('lodash/object/assign') };

module.exports = function (args, audioContext) {
    args || (args = {});
    var options = _.assign({ time: 0 }, args),
        delay = audioContext.createDelay();
    delay.delayTime.value = options.time;
    return delay;
};
