const codecAPI = require("./Codec")

codecAPI.codec("misery_but_synced.mp4", "output.mp4", "h264").then(() => {
  codecAPI.codec("output.mp4", "output2.webm", "vp9").then(() => {
   console.log("YES")
  })
})