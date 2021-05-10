import type Rpio from "rpio";

type PixelFormat = "rgba" | "bgra";

export class ILI9341_LCD {
  private readonly rpio: Rpio;
  public readonly width: number;
  public readonly height: number;
  public readonly rstPin: number;
  public readonly dcPin: number;

  constructor(
    rpio: Rpio,
    { width = 240, height = 320, rstPin = 27, dcPin = 25 } = {}
  ) {
    this.rpio = rpio;
    this.width = width;
    this.height = height;
    this.rstPin = rstPin;
    this.dcPin = dcPin;
  }

  private moduleInit() {
    this.rpio.open(this.rstPin, this.rpio.OUTPUT);
    this.rpio.open(this.dcPin, this.rpio.OUTPUT);
    this.rpio.spiBegin();
    this.rpio.spiSetClockDivider(8);
  }

  moduleExit() {
    this.rpio.spiEnd();
    this.rpio.write(this.rstPin, this.rpio.HIGH);
    this.rpio.write(this.dcPin, this.rpio.LOW);
  }

  private reset() {
    this.rpio.write(this.rstPin, this.rpio.HIGH);
    this.rpio.sleep(0.01);
    this.rpio.write(this.rstPin, this.rpio.LOW);
    this.rpio.sleep(0.01);
    this.rpio.write(this.rstPin, this.rpio.HIGH);
    this.rpio.sleep(0.01);
  }

  Init() {
    this.moduleInit();
    this.reset();

    this.command(0x11); // '''Sleep out'''

    this.command(0xcf);
    this.data(0x00);
    this.data(0xc1);
    this.data(0x30);
    this.command(0xed);
    this.data(0x64);
    this.data(0x03);
    this.data(0x12);
    this.data(0x81);
    this.command(0xe8);
    this.data(0x85);
    this.data(0x00);
    this.data(0x79);
    this.command(0xcb);
    this.data(0x39);
    this.data(0x2c);
    this.data(0x00);
    this.data(0x34);
    this.data(0x02);
    this.command(0xf7);
    this.data(0x20);
    this.command(0xea);
    this.data(0x00);
    this.data(0x00);
    this.command(0xc0); // '''Power control'''
    this.data(0x1d); // '''VRH[5:0]'''
    this.command(0xc1); // '''Power control'''
    this.data(0x12); // '''SAP[2:0];BT[3:0]'''
    this.command(0xc5); // '''VCM control'''
    this.data(0x33);
    this.data(0x3f);
    this.command(0xc7); // '''VCM control'''
    this.data(0x92);
    this.command(0x3a); // '''Memory Access Control'''
    this.data(0x55);
    this.command(0x36); // '''Memory Access Control'''
    this.data(0x08);
    this.command(0xb1);
    this.data(0x00);
    this.data(0x12);
    this.command(0xb6); // '''Display Function Control'''
    this.data(0x0a);
    this.data(0xa2);

    this.command(0x44);
    this.data(0x02);

    this.command(0xf2); // '''3Gamma Function Disable'''
    this.data(0x00);
    this.command(0x26); // '''Gamma curve selected'''
    this.data(0x01);
    this.command(0xe0); // '''Set Gamma'''
    this.data(0x0f);
    this.data(0x22);
    this.data(0x1c);
    this.data(0x1b);
    this.data(0x08);
    this.data(0x0f);
    this.data(0x48);
    this.data(0xb8);
    this.data(0x34);
    this.data(0x05);
    this.data(0x0c);
    this.data(0x09);
    this.data(0x0f);
    this.data(0x07);
    this.data(0x00);
    this.command(0xe1); // '''Set Gamma'''
    this.data(0x00);
    this.data(0x23);
    this.data(0x24);
    this.data(0x07);
    this.data(0x10);
    this.data(0x07);
    this.data(0x38);
    this.data(0x47);
    this.data(0x4b);
    this.data(0x0a);
    this.data(0x13);
    this.data(0x06);
    this.data(0x30);
    this.data(0x38);
    this.data(0x0f);
    this.command(0x29); // '''Display on'''
  }

  private command(data: number) {
    this.rpio.write(this.dcPin, this.rpio.LOW);
    this.spiWrite(data);
  }

  private data(data: number) {
    this.rpio.write(this.dcPin, this.rpio.HIGH);
    this.spiWrite(data);
  }

  rgb888ToRgb565(
    buffer: Buffer,
    {
      bytesPerPixel = 3,
      pixelFormat = "rgba",
    }: {
      bytesPerPixel?: number;
      pixelFormat?: PixelFormat;
    } = {}
  ) {
    const newBufferSize = (buffer.length * 2) / bytesPerPixel;
    const newBuffer = Buffer.allocUnsafe(newBufferSize);
    let i = 0;
    for (let j = 0; j < buffer.length; j += bytesPerPixel) {
      let { r, g, b } = this.getRgb(buffer, j, pixelFormat);

      r = (r * 249 + 1014) >> 11;
      g = (g * 253 + 505) >> 10;
      b = (b * 249 + 1014) >> 11;
      let rgb565 = 0;
      rgb565 = rgb565 | (r << 11);
      rgb565 = rgb565 | (g << 5);
      rgb565 = rgb565 | b;

      newBuffer[i++] = (rgb565 & 0xff00) >> 8;
      newBuffer[i++] = rgb565 & 0xff;
    }
    return newBuffer;
  }

  private getRgb(buffer: Buffer, startIndex: number, pixelFormat: PixelFormat) {
    if (pixelFormat === "bgra") {
      let r = buffer[startIndex + 2];
      let g = buffer[startIndex + 1];
      let b = buffer[startIndex];
      return { r, g, b };
    }
    let r = buffer[startIndex];
    let g = buffer[startIndex + 1];
    let b = buffer[startIndex + 2];
    return { r, g, b };
  }

  showImage({
    width,
    height,
    data,
    pixelFormat = "rgba",
  }: {
    width: number;
    height: number;
    data: Buffer;
    pixelFormat?: PixelFormat;
  }) {
    if (width !== this.width && height !== this.height) {
      throw new Error(
        `Image dimensions {${width},${height}} do not match display dimensions {${this.width},${this.height}}`
      );
    }
    this.command(0x36);
    this.data(0x08);
    const bytesPerPixel = data.length / width / height;
    const pix = this.rgb888ToRgb565(data, {
      bytesPerPixel,
      pixelFormat,
    });
    this.setCanvas(pix);
  }

  private spiWrite(data: number) {
    const txbuf = Buffer.from([data]);
    this.rpio.spiWrite(txbuf, txbuf.length);
  }

  clear() {
    const buffer = Buffer.alloc(this.width * this.height * 2, 0x00);
    this.setCanvas(buffer);
  }

  private setCanvas(buffer: Buffer) {
    this.setWindows(0, 0, this.width, this.height);
    this.rpio.write(this.dcPin, this.rpio.HIGH);
    for (let i = 0; i < buffer.length; i += 4096) {
      const txbuf = buffer.subarray(i, i + 4096);
      this.rpio.spiWrite(txbuf, txbuf.length);
    }
  }

  private setWindows(
    Xstart: number,
    Ystart: number,
    Xend: number,
    Yend: number
  ) {
    //set the X coordinates
    this.command(0x2a);
    this.data(Xstart >> 8);
    this.data(Xstart & 0xff);
    this.data(Xend >> 8);
    this.data((Xend - 1) & 0xff);

    //set the Y coordinates
    this.command(0x2b);
    this.data(Ystart >> 8);
    this.data(Ystart & 0xff);
    this.data(Yend >> 8);
    this.data((Yend - 1) & 0xff);

    this.command(0x2c);
  }
}
