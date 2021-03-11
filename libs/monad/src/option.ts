/* eslint-disable @typescript-eslint/no-unused-vars */
abstract class BaseOption<T> {
  abstract readonly type: "Some" | "None"

  isSome(): this is Some<T> {
    return this.type === "Some"
  }

  isNone(): this is None<T> {
    return this.type === "None"
  }
}

export class Some<T> extends BaseOption<T> {
  static create<T>(value?: T | undefined): Option<T> {
    return value == undefined ? new None<T>() : new Some<T>(value)
  }

  readonly type = "Some" as const

  private constructor(private readonly value: T) {
    super()
  }

  andThen<U>(fn: (val: T) => Option<U>): Option<U> {
    return fn(this.value)
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some<U>(fn(this.value))
  }

  orElse<U>(_fn: () => Option<U>): Option<U | T> {
    return this
  }

  unwrap(): T {
    return this.value
  }
}

export class None<T> extends BaseOption<T> {
  static create<T>(): None<T> {
    return new None<T>()
  }

  readonly type = "None" as const

  andThen<U>(_fn: (val: T) => Option<U>): Option<U> {
    return new None()
  }

  map<U>(_fn: (value: T) => U): Option<U> {
    return new None<U>()
  }

  orElse<U>(fn: () => Option<U>): Option<U | T> {
    return fn()
  }
}

export type Option<T> = Some<T> | None<T>

export const Option = {
  isOption: (value: unknown): value is Option<unknown> =>
    typeof value === "object" &&
    value != null &&
    "type" in value &&
    typeof (value as Option<unknown>)["type"] === "string" &&
    ((value as Option<unknown>).type === "Some" ||
      (value as Option<unknown>).type === "None"),

  all<T>(...args: Option<T>[]): Option<T[]> {
    const values: T[] = []

    for (let i = 0; i < args.length; i++) {
      const option = args[i]
      if (Option.isOption(option) && option.isSome()) {
        values.push(option.unwrap())
      } else {
        return None.create()
      }
    }

    return Some.create(values)
  },
}

export const some = Some.create
export const none = None.create
