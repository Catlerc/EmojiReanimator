var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EitherPart = (function () {
    function EitherPart() {
    }
    EitherPart.prototype.fold = function (ifLeft, ifRight) {
        if (this.isLeft)
            return ifLeft(this.left);
        else
            return ifRight(this.right);
    };
    return EitherPart;
}());
var Left = (function (_super) {
    __extends(Left, _super);
    function Left(value) {
        var _this = _super.call(this) || this;
        _this.right = undefined;
        _this.isLeft = true;
        _this.isRight = false;
        _this.left = value;
        return _this;
    }
    Left.prototype.mapLeft = function (func) {
        return new Left(func(this.left));
    };
    Left.prototype.mapRight = function (func) {
        return new Left(this.left);
    };
    return Left;
}(EitherPart));
export { Left };
var Right = (function (_super) {
    __extends(Right, _super);
    function Right(value) {
        var _this = _super.call(this) || this;
        _this.left = undefined;
        _this.isLeft = false;
        _this.isRight = true;
        _this.right = value;
        return _this;
    }
    Right.prototype.mapLeft = function (func) {
        return new Right(this.right);
    };
    Right.prototype.mapRight = function (func) {
        return new Right(func(this.right));
    };
    return Right;
}(EitherPart));
export { Right };
//# sourceMappingURL=Either.js.map