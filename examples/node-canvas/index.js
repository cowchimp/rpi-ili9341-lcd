const rpio = require("rpio");
const { ILI9341_LCD } = require("../../dist/ILI9341_LCD"); // use require('rpi-ili9341-lcd') in your code
const { createCanvas, registerFont, loadImage } = require("canvas");

registerFont("Font01.ttf", { family: "Font1" });

const canvas = createCanvas(240, 320);
const ctx = canvas.getContext("2d");

//set background to white
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//draw a magenta rectangle
ctx.strokeStyle = "rgb(255,0,255)";
ctx.strokeRect(85, 10, 130, 60);

//draw a cyan circle
ctx.strokeStyle = "#00FFFF";
ctx.beginPath();
ctx.arc(55, 135, 40, 0, 2 * Math.PI);
ctx.stroke();

//draw text
ctx.font = '24px "Font1"';
ctx.fillStyle = "black";
ctx.fillText("Hello World", 60, 240);

//draw image from file
loadImage("dog.png").then((image) => {
  ctx.drawImage(image, 110, 85, 120, 120);

  const bitmap = canvas.toBuffer("raw");

  rpio.init({ mapping: "gpio", gpiomem: false });
  const disp = new ILI9341_LCD(rpio);

  disp.Init();
  disp.clear();
  disp.showImage({
    width: canvas.width,
    height: canvas.height,
    data: bitmap,
    pixelFormat: "bgra",
  });
  disp.moduleExit();
});
