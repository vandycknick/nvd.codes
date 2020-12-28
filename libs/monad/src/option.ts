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

// export interface BaseOption<T> {
//   _type: string
//   isSome(): this is Some<T>
//   isNone(): this is None<T>
//   match<U>(fn: MatchOption<T, U>): U
//   matchAsync<U>(fn: MatchOptionAsync<T, U>): Promise<U>
//   map<U>(fn: (val: T) => U): Option<U>
//   andThen<U>(fn: (val: T) => Option<U>): Option<U>
//   or<U>(optb: Option<U>): Option<T | U>
//   orElse<U>(_fn: () => Option<U>): Option<T | U>
//   and<U>(optb: Option<U>): Option<U>
//   unwrapOr(def: T): T
// }

// export interface None<T> extends BaseOption<T> {
//   or<U>(optb: Option<U>): Option<U>
//   and<U>(optb: Option<U>): None<U>
// }

// export interface Some<T> extends BaseOption<T> {
//   unwrap(): T
//   or<U>(optb: Option<U>): Option<T>
//   and<U>(optb: Option<U>): Option<U>
// }

// export type Option<T> = Some<T> | None<T>

// export class NoneImpl<T> implements None<T> {
//   static create<T>(): None<T> {
//     return new NoneImpl<T>()
//   }

//   readonly _type = "None" as const

//   isSome(): this is Some<T> {
//     return !this.isNone()
//   }

//   isNone(): this is None<T> {
//     return true
//   }

//   match<U>(matchObject: MatchOption<T, U>): U {
//     const { none } = matchObject

//     if (typeof none === "function") {
//       return (none as () => U)()
//     }

//     return none
//   }

//   matchAsync<U>(matchObject: MatchOptionAsync<T, U>): Promise<U> {
//     const { none } = matchObject

//     if (typeof none === "function") {
//       return (none as () => Promise<U>)()
//     }

//     return none
//   }

//   map<U>(_fn: (val: T) => U): Option<U> {
//     return new NoneImpl()
//   }

//   andThen<U>(_fn: (val: T) => Option<U>): Option<U> {
//     return new NoneImpl<U>()
//   }

//   or<U>(optb: Option<U>): Option<U> {
//     return optb
//   }

//   orElse<U>(fn: () => Option<U>): Option<U> {
//     return fn()
//   }

//   and<U>(_optb: Option<U>): None<U> {
//     return new NoneImpl<U>()
//   }

//   unwrapOr(def: T): T {
//     if (def == null) {
//       throw new Error("Cannot call unwrapOr with a missing value.")
//     }

//     return def
//   }

//   unwrap(): null {
//     return null
//   }
// }

// export class SomeImpl<T> implements Some<T> {
//   static create<T>(value?: T | undefined): None<T> | Some<T> {
//     return value == undefined ? new NoneImpl<T>() : new SomeImpl<T>(value)
//   }

//   readonly _type = "Some" as const
//   private constructor(private readonly value: T) {}

//   isSome(): this is Some<T> {
//     return true
//   }

//   isNone(): this is None<T> {
//     return !this.isSome()
//   }

//   match<U>(fn: MatchOption<T, U>): U {
//     return fn.some(this.value)
//   }

//   matchAsync<U>(fn: MatchOptionAsync<T, U>): Promise<U> {
//     return fn.some(this.value)
//   }

//   map<U>(fn: (value: T) => U): Option<U> {
//     return new SomeImpl<U>(fn(this.value))
//   }

//   andThen<U>(fn: (value: T) => Option<U>): Option<U> {
//     return fn(this.value)
//   }

//   or<U>(_optb: Option<U>): Option<T> {
//     return this
//   }

//   orElse<U>(_fn: () => Option<U>): Option<T> {
//     return this
//   }

//   and<U>(optb: Option<U>): Option<U> {
//     return optb
//   }

//   unwrapOr(_def: T): T {
//     return this.value
//   }

//   unwrap(): T {
//     return this.value
//   }
// }

// export const None = NoneImpl.create
// export const Some = SomeImpl.create
