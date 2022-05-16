const codecAPI = require("./Codec")

codecAPI.codec("input.mp3", "output.ogg", "vorbis").then(() => {
 console.log("YES")
})