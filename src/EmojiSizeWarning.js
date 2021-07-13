import { Option } from "./Utils/Option.js";
var EmojiSizeWarning = (function () {
    function EmojiSizeWarning() {
        this.rootElement = Option.none();
        this.element = document.createElement("div");
        this.element.className = "SizeFailureSign";
        this.hide();
    }
    EmojiSizeWarning.prototype.updateRoot = function (rootElement) {
        var _this = this;
        this.rootElement.forEach(function (root) { return root.removeChild(_this.element); });
        this.rootElement = Option.some(rootElement);
        rootElement.prepend(this.element);
    };
    EmojiSizeWarning.prototype.updatePosition = function (nearElement) {
        var rect = nearElement.getBoundingClientRect();
        var translateX = rect.x;
        var translateY = rect.y;
        this.element.style.transform = "translateY(" + translateY + "px)";
        this.element.style.transform += "translateX(" + translateX + "px)";
        this.element.style.display = "block";
    };
    EmojiSizeWarning.prototype.hide = function () {
        this.element.style.display = "none";
    };
    EmojiSizeWarning.prototype.setText = function (msg) {
        this.element.innerText = msg;
    };
    return EmojiSizeWarning;
}());
export { EmojiSizeWarning };
//# sourceMappingURL=EmojiSizeWarning.js.map