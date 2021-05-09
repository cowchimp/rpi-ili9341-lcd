const rpio = require("rpio");
const { ILI9341_LCD } = require("../../src/ILI9341_LCD"); // use require('rpi-ili9341-lcd') in your code
const fs = require("fs");
const { PNG } = require("pngjs");

const data = fs.readFileSync("demo.png");
const bitmap = PNG.sync.read(data, {
  colorType: 2,
});

rpio.init({ mapping: "gpio", gpiomem: false });
const disp = new ILI9341_LCD(rpio);

disp.Init();
disp.clear();
disp.showImage(bitmap);
disp.moduleExit();
