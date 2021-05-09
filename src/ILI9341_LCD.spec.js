const { ILI9341_LCD } = require("./ILI9341_LCD");

describe("rgb888ToRgb565", () => {
  it("converts RGB array correctly", () => {
    const rpio = getMockRpio();
    const disp = new ILI9341_LCD(rpio, { width: 2, height: 4 });
    const singleBit = [0xff, 0x00, 0x00];
    const image = Buffer.alloc(
      disp.width * disp.height * singleBit.length,
      Buffer.from(singleBit)
    );
    const expected = Buffer.alloc(16, Buffer.from([0xf8, 0x00]));

    const result = disp.rgb888ToRgb565(image);

    expect(result).toEqual(expected);
  });

  it("converts RGBA array correctly", () => {
    const rpio = getMockRpio();
    const disp = new ILI9341_LCD(rpio, { width: 2, height: 4 });
    const singleBit = [0xff, 0x00, 0x00, 0xff];
    const image = Buffer.alloc(
      disp.width * disp.height * singleBit.length,
      Buffer.from(singleBit)
    );
    const expected = Buffer.alloc(16, Buffer.from([0xf8, 0x00]));

    const result = disp.rgb888ToRgb565(image, 4);

    expect(result).toEqual(expected);
  });
});

describe("showImage", () => {
  it("sets SPI data correctly", () => {
    const rpio = getMockRpio();
    const disp = new ILI9341_LCD(rpio, { width: 2, height: 4 });

    disp.Init();
    disp.showImage({
      width: 2,
      height: 4,
      data: Buffer.alloc(2 * 4 * 3, Buffer.from([0xff, 0x00, 0x00])),
    });
    disp.moduleExit();

    const data = rpio.spiWrite.mock.calls.map(([buff]) => buff.toString("hex"));
    expect(data).toMatchSnapshot();
  });

  it("throws if provided image dimensions does not match display dimensions", () => {
    const rpio = getMockRpio();
    const disp = new ILI9341_LCD(rpio, { width: 2, height: 4 });

    disp.Init();
    expect(() =>
      disp.showImage({
        width: 4,
        height: 2,
        data: Buffer.alloc(4 * 2 * 3, Buffer.from([0xff, 0x00, 0x00])),
      })
    ).toThrowError(
      "Image dimensions {4,2} do not match display dimensions {2,4}"
    );
  });
});

function getMockRpio() {
  const rpio = {
    init: jest.fn(),
    open: jest.fn(),
    spiBegin: jest.fn(),
    spiSetClockDivider: jest.fn(),
    spiEnd: jest.fn(),
    write: jest.fn(),
    sleep: jest.fn(),
    spiWrite: jest.fn(),
  };
  return rpio;
}
