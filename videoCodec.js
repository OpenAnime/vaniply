module.exports = {
 codec: function (input, output, mode) {
  let arr;
  if(mode.toLowerCase() == "vp9") {
   arr = ["-i", input, "-c:v", "libvpx-vp9", "-c:a", "libopus", output]
  } else if(mode.toLowerCase() == "h264") {
   arr = [`-i`, input, `-c:v`, `libx264`, `-preset`, `slow`, `-crf`, `22`, `-c:a`, `copy`, output]
  }
  return new Promise((resolve) => {

   let chalk;
   async function chalkImport() {
    let chalk_base = await import("chalk")
    chalk = chalk_base.default
   }
   chalkImport()

   const {
    spawn
   } = require("child_process");
   const resParser = require("./responseParser")
   const spinner = ['◜', '◠', '◝', '◞', '◡', '◟']
   let currentSpinnerIndex = 0
   const readline = require('readline');
   let infos;
   let finished = false

   var proc = spawn(`ffmpeg`, arr)

   function rec() {
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
      process.stdout.write(chalk.blueBright(`Frames: ${infos.codedFrames} | FPS: ${infos.FPS} | Size: ${infos.size} | Time Est.: ${infos.timeEst} | Speed: ${infos.speed} | Mode: ${mode.toUpperCase()}  ${spinner[currentSpinnerIndex]}`));
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
   }

   rec()

   proc.stderr.setEncoding("utf8")
   proc.stderr.on('data', function (data) {
    if (data.startsWith("frame=") && data.includes("size=")) {
     let info = resParser.parse(data)
     infos = info
    }
   });

   proc.on('close', function () {
    finished = true
   });
  })
 }
}