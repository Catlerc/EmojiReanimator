export class Option<T> {
  private constructor(private value: T | null) {
  }

  nonEmpty() {
    return this.value != null
  }

  static some<T>(value: T) {
    if (!value) {
      throw Error("Provided value must not be empty")
    }
    return new Option(value)
  }

  static none<T>() {
    return new Option<T>(null)
  }

  static fromValue<T>(value: T) {
    return value ? Option.some(value) : Option.none<T>()
  }

  getOrElse(defaultValue: T) {
    return this.value === null ? defaultValue : this.value
  }

  forEach<B>(func: (a: T) => B): void {
    if (this.value != null) func(this.value)
  }

  map<B>(func: (a: T) => B): Option<B> {
    if (this.value != null) return Option.some(func(this.value))
    return Option.none()
  }

  flatMap<B>(func: (a: T) => Option<B>): Option<B> {
    if (this.value != null) return func(this.value)
    return Option.none()
  }

  fold<B>(ifEmpty: () => B, ifNonEmpty: (value: T) => B) {
    if (this.nonEmpty())
      return ifNonEmpty(this.value)
    else
      return ifEmpty()
  }
}