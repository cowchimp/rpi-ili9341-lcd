const rpio = require("rpio");
const { ILI9341_LCD } = require("../../dist/ILI9341_LCD"); // use require('rpi-ili9341-lcd') in your code

const color = [0xff, 0x00, 0xff];

rpio.init({ mapping: "gpio", gpiomem: false });
const disp = new ILI9341_LCD(rpio);

disp.Init();
disp.clear();
disp.showImage({
  width: 240,
  height: 320,
  data: Buffer.alloc(240 * 320 * 3, Buffer.from(color)),
});
disp.moduleExit();
