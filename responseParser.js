const between = require("./between").getFromBetween

module.exports = {
 parse: function(str) {
  let frameCount = between.get(str, "frame=", "fps=")[0].trim()
  let FPS = between.get(str, "fps=", "q=")[0].trim()
  let codedFramesQuality = between.get(str, "q=", "size=")[0].trim()
  let size = between.get(str, "size=", "time=")[0].trim()
  let timeEstimated = between.get(str, "time=", "bitrate=")[0].trim()
  let bitrate = between.get(str, "bitrate=", "speed=")[0].trim()
  let speed = str.slice(str.indexOf("speed=")+"speed=".length).trim()
  return {
   codedFrames: frameCount,
   FPS: FPS,
   quality: codedFramesQuality,
   size: size,
   timeEst: timeEstimated,
   bitrate: bitrate,
   speed: speed
  }
 }
}