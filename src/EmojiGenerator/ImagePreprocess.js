import { Pixels } from "../Image/AnimatedImage.js";
export var FlipVertical = function (pixels) {
    return new Pixels(pixels.copy().data.reverse());
};
export var FlipHorizontal = function (pixels) {
    return new Pixels(pixels.copy().data.map(function (a) { return a.reverse(); }));
};
//# sourceMappingURL=ImagePreprocess.js.map