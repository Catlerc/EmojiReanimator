var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { fabric } from "../Vendor.js";
export var LinearGenerator = function (image, time) { return __awaiter(void 0, void 0, void 0, function () {
    var clone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, image.copy()];
            case 1:
                clone = _a.sent();
                image.setPos(time + 0.5, 0.5);
                clone.setPos((time - 1) + 0.5, 0.5);
                return [2, [image, clone]];
        }
    });
}); };
export var RotationGenerator = function (image, time) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        image.setPos(.5, .5);
        image.set({
            originX: "center",
            originY: "center",
            angle: 360 * time
        });
        return [2, [image]];
    });
}); };
export var TurnGenerator = function (image, time) { return __awaiter(void 0, void 0, void 0, function () {
    var copy0, copy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, image.copy()];
            case 1:
                copy0 = _a.sent();
                return [4, image.copy()];
            case 2:
                copy = _a.sent();
                if (time <= 0.5)
                    copy0.setPos(time - 0.5, 0.5);
                else {
                    copy0.setPos(0, 1);
                    copy0.set({
                        originX: "center",
                        originY: "bottom",
                        angle: 90 * (time - 0.5)
                    });
                }
                if (time >= 0.5) {
                    copy.set({
                        angle: 90
                    });
                    copy.setPos(0.5, time + 0.5);
                }
                else {
                    copy.setPos(0, 1);
                    copy.set({
                        originX: "center",
                        originY: "bottom",
                        angle: 90 * (time + 0.5)
                    });
                }
                return [2, [copy0, copy]];
        }
    });
}); };
var linesN = 24;
export var TurnGeneratorFlex = function (image, time) { return __awaiter(void 0, void 0, void 0, function () {
    function createSlices(copies, time) {
        time = time - 0.005;
        var sliceWidth = image.underlying.width / linesN;
        var computedCopies = copies.map(function (pair) {
            var index = pair.key;
            var copy = pair.value;
            copy.set({
                originX: index / (linesN),
                angle: 90 * (time + index / (linesN - .5))
            });
            copy.setPos(0, 1);
            var rate = 1;
            var w = sliceWidth * rate;
            var h = copy.underlying.height;
            var upXR = 1.4;
            var upYR = 0.99;
            var leftXR = 1;
            var leftYR = 0.5;
            var footXR = 0.3;
            copy.underlying.clipPath =
                new fabric.Path("M " + w * footXR + " 0 L " + -w * footXR + " 0 L " + -w * leftXR + " " + -h * leftYR + " L " + -w * upXR + " " + -h * upYR + " L 0 " + -h + " L " + w * upXR + " " + -h * upYR + " L " + w * leftXR + " " + -h * leftYR + " L " + w * footXR + " 0 z", {
                    originX: 0.5,
                    top: -copy.underlying.height / 2,
                    left: sliceWidth * index - copy.underlying.width / 2
                });
            return copy;
        });
        var tmp = [];
        var linesHalfN = linesN / 2;
        for (var i = 0; i < linesHalfN; i++) {
            var otherSideIndex = linesHalfN * 2 - i - 1;
            tmp = __spreadArray(__spreadArray([], tmp), [computedCopies[i], computedCopies[otherSideIndex]]);
        }
        return tmp.reverse();
    }
    var copies1, copies2, layers1, layers2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                image.setPos(0, 1);
                image.set({
                    originX: 0,
                    originY: "bottom",
                    angle: 90 * time
                });
                return [4, image.copyN(linesN)];
            case 1:
                copies1 = _a.sent();
                return [4, image.copyN(linesN)];
            case 2:
                copies2 = _a.sent();
                layers1 = createSlices(copies1, time - 1);
                layers2 = createSlices(copies2, time);
                return [2, __spreadArray(__spreadArray([], layers1), layers2)];
        }
    });
}); };
export function Reverse(underlying) {
    var _this = this;
    return function (image, timeNormalized) { return __awaiter(_this, void 0, void 0, function () {
        var newImage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, image.copy()];
                case 1:
                    newImage = _a.sent();
                    return [4, underlying(newImage, 1 - timeNormalized)];
                case 2: return [2, _a.sent()];
            }
        });
    }); };
}
export var Shake = function (image, _) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        image.setPos(0.5 + (Math.random() - 0.5) / 10, 0.5 + (Math.random() - 0.5) / 10);
        image.set({
            angle: 10 * (Math.random() - 0.5)
        });
        return [2, [image]];
    });
}); };
export var Just = function (image, _) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        image.setPos(0.5, 0.5);
        return [2, [image]];
    });
}); };
//# sourceMappingURL=FrameGenerator.js.map