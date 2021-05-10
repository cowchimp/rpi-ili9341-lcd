const rpio = require("rpio");
const { ILI9341_LCD } = require("../../dist/ILI9341_LCD"); // use require('rpi-ili9341-lcd') in your code
const sharp = require("sharp");

sharp("mario.jpg")
  .rotate(-90)
  .resize(240, 320)
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    rpio.init({ mapping: "gpio", gpiomem: false });
    const disp = new ILI9341_LCD(rpio);

    disp.Init();
    disp.clear();

    disp.showImage({
      width: info.width,
      height: info.height,
      data: data,
    });
    disp.moduleExit();
  });
