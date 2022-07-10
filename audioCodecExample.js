const codecAPI = require("./Codec")

codecAPI.codec("input.mp3", "output.mp3", "h265").then(() => {
 console.log("YES")
})