var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { Pixels } from "../Image/AnimatedImage.js";
export var FlipVertical = function (pixels) {
    return new Pixels(__spreadArray([], pixels.data).reverse());
};
export var FlipHorizontal = function (pixels) {
    return new Pixels(__spreadArray([], pixels.data).map(function (a) { return __spreadArray([], a).reverse(); }));
};
//# sourceMappingURL=ImagePreprocess.js.map