var Option = (function () {
    function Option(value) {
        this.value = value;
    }
    Option.prototype.nonEmpty = function () {
        return this.value != null;
    };
    Option.some = function (value) {
        if (!value) {
            throw Error("Provided value must not be empty");
        }
        return new Option(value);
    };
    Option.none = function () {
        return new Option(null);
    };
    Option.fromValue = function (value) {
        return value ? Option.some(value) : Option.none();
    };
    Option.prototype.getOrElse = function (defaultValue) {
        return this.value === null ? defaultValue : this.value;
    };
    Option.prototype.orElse = function (elseOption) {
        return this.value === null ? elseOption : this;
    };
    Option.prototype.forEach = function (func) {
        if (this.value != null)
            func(this.value);
    };
    Option.prototype.map = function (func) {
        if (this.value != null)
            return Option.some(func(this.value));
        return Option.none();
    };
    Option.prototype.flatMap = function (func) {
        if (this.value != null)
            return func(this.value);
        return Option.none();
    };
    Option.prototype.fold = function (ifEmpty, ifNonEmpty) {
        if (this.nonEmpty())
            return ifNonEmpty(this.value);
        else
            return ifEmpty();
    };
    Option.prototype.isEmpty = function () {
        return !this.nonEmpty();
    };
    return Option;
}());
export { Option };
//# sourceMappingURL=Option.js.map