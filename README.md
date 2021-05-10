# rpi-ili9341-lcd

A Raspberry Pi display driver for LCDs running the ILI9341 chip, like the [Waveshare 2.4inch LCD Module](https://www.waveshare.com/wiki/2.4inch_LCD_Module).

## Installation

⚠️ This package was designed to be used with the [rpio](https://github.com/jperkin/node-rpio) library for Node.js.  
Please make sure that you have [rpio](https://www.npmjs.com/package/rpio) installed and set-up according to its [system requirements](https://www.npmjs.com/package/rpio#important-system-requirements).

```bash 
  npm install rpio
  npm install rpi-ili9341-lcd
```

## Getting started

You need to pass the bitmap of the image you want to display to the `showImage()` method.  
Here's a simple example that fills the entire display with a single color.
See the [Examples](#Examples) section for more advanced usages.

```js
const rpio = require("rpio");
const { ILI9341_LCD } = require('rpi-ili9341-lcd');

const color = [0xff, 0x00, 0xff];  //magenta #FF00FF

rpio.init({ mapping: "gpio", gpiomem: false });
const disp = new ILI9341_LCD(rpio, { width: 240, height: 320 });

disp.Init();
disp.clear();
disp.showImage({
  width: 240,
  height: 320,
  data: Buffer.alloc(240 * 320 * 3, Buffer.from(color))
});
disp.moduleExit();
```

## Examples

* [Fill the screen with a single color](examples/basic/index.js)
* [Using `pngjs` to display an image from a .png file](examples/pngjs/index.js) 
* [Using `node-canvas` to draw different elements](examples/node-canvas/index.js)
* [Using `sharp` to resize and rotate a .jpg file before displaying it](examples/sharp/index.js)

## FAQ

#### What LCD models does this library support?

It was only tested on the [Waveshare 2.4inch LCD Module](https://www.waveshare.com/wiki/2.4inch_LCD_Module) because it's the only ILI9341-based display that I own.  
Please open an issue if you need support for a different model.

#### Which GPIO pin should each pin on the LCD be connected to?

See the "Raspberry Pi Guides" section [here](https://www.waveshare.com/wiki/2.4inch_LCD_Module) to learn how to connect your LCD to the Raspberry Pi, but as listed in the [FAQ](https://www.waveshare.com/wiki/2.4inch_LCD_Module) section there, do **not** connect the BL pin.

#### How was this code written?

This code was ported from the Python version [here](https://github.com/Hagishilta/waveshareLCD)

#### I'm getting a `Cannot find module 'rpio'` error when trying to run the example code. What should I do?

This library depends on [rpio](https://www.npmjs.com/package/rpio) as a `peerDependency`. Make sure that you have it installed and set-up according to its [system requirements](https://www.npmjs.com/package/rpio#important-system-requirements).

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
