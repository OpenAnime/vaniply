const spinner = ['◜', '◠', '◝', '◞', '◡', '◟']
let currentSpinnerIndex = 0
const readline = require('readline');
let infos;
let finished = false
let audioFile = false;
let chalk;
let currentMode;

(async () => {
 let chalk_base = await import("chalk");
  chalk = chalk_base.default;
})();

function rec() {
 return new Promise((resolve) => {
  if (finished == true) {
   readline.clearLine(process.stdout, 0)
   readline.cursorTo(process.stdout, 0);
   process.stdout.write(chalk.greenBright("Finished"))
   resolve("ok")
  } else {
   readline.cursorTo(process.stdout, 0);
   if (infos === undefined || infos === null) {
    process.stdout.write("Waiting for data to come...")
    readline.clearLine(process.stdout, 0)
    setTimeout(() => {
     rec()
    }, 100);
   } else {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0);
    if(audioFile == true) {
     process.stdout.write(chalk.blueBright(`Audio Size: ${infos.size} | Bitrate ${infos.bitrate} | Time Est.: ${infos.timeEst} | Speed: ${infos.speed} | Mode: ${currentMode.toUpperCase()}  ${spinner[currentSpinnerIndex]}`));
    } else {
     process.stdout.write(chalk.blueBright(`Frames: ${infos.codedFrames} | FPS: ${infos.FPS} | Size: ${infos.size} | Time Est.: ${infos.timeEst} | Speed: ${infos.speed} | Mode: ${currentMode.toUpperCase()}  ${spinner[currentSpinnerIndex]}`));
    }
    if (currentSpinnerIndex == spinner.length - 1) {
     currentSpinnerIndex = 0
    } else {
     currentSpinnerIndex++
    }
    setTimeout(() => {
     rec()
    }, 100);
   }
  }
 })
}


module.exports = {
 codec: function (input, output, mode) {
  let arr;
  if(mode.toLowerCase() == "vp9") {
   arr = ["-i", input, "-c:v", "libvpx-vp9", "-c:a", "libopus", output]
  } else if(mode.toLowerCase() == "h264") {
   arr = [`-i`, input, `-c:v`, `libx264`, `-preset`, `slow`, `-crf`, `22`, `-c:a`, `copy`, output]
  } else if(mode.toLowerCase() == "orbis") {
   arr = [`-i`, input, `-c:a`, `libvorbis`, `-q:a`, `4`, output]
   audioFile = true
  }
  return new Promise((resolve) => {
   const {
    spawn
   } = require("node:child_process");
   const resParser = require("./responseParser")
   var proc = spawn(`ffmpeg`, arr)
   currentMode = mode;
   rec().then(() => {
    resolve("ok")
   })

   proc.stderr.setEncoding("utf8")
   proc.stderr.on('data', function (data) {
    if (data.includes("size=")) {
     let info = resParser.parse(data, audioFile)
     infos = info
    }
   });

   proc.on('close', function () {
    finished = true
   });
  })
 }
}