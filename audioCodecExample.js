const codecAPI = require("./Codec")

codecAPI.codec("input.mp3", "output.ogg", "orbis").then(() => {
 console.log("YES")
})