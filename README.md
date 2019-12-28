# Pylon

Some useful functionalities.

## Index

### Type aliases

- [ModifyProps](README.md#modifyprops)
- [PropsType](README.md#propstype)
- [TypeEqual](README.md#typeequal)
- [UnionKeyOf](README.md#unionkeyof)
- [UnionOmit](README.md#unionomit)
- [UnionOptional](README.md#unionoptional)

## Type aliases

### ModifyProps

Add, remove or replace properties of an object.

```ts
type T = { a: string; b: number };
type X1 = ModifyProps<T, 'a'>; // X1 = { b: number }
type X2 = ModifyProps<T, { c: string }>; // X2 = { a: string; b: number; c: string }
type X3 = ModifyProps<T, { a: boolean }>; // X3 = { a: boolean; b: number; }
type X4 = ModifyProps<T, 'a', { c: string }>; // X4 = { b: number; c: string }
```

---

### PropsType

Infer props type for React component X, i.e. functions, React.FC,
React.PureComponent and React.Component, with or without defaultProps.

```ts
const Comp = (props: { a: string }) => <div />;
type Props = PropsType<typeof Comp>; // expect { a: string }

class Comp extends React.Component<{ a: string }> {
  render() {
    return <div />;
  }
}
type Props = PropsType<typeof Comp>; // expect { a: string, children?: ReactNode }
```

---

### TypeEqual

Test if types X and Y are identical.

[https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts#L153-L157](https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts#L153-L157)
[https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript](https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript)

---

### UnionKeyOf

Returns keys of a type (same as keyword `keyof`), or the union of keys of a union type.

This is to complement keyword `keyof` returning only intersection
of keys for a union type.

```ts
type T = { a: string; b: number } | { b: boolean; c: number };
type X = keyof T; // X = 'b'
type Y = UnionKeyOf<T>; // Y = 'a' | 'b' | 'c'
```

---

### UnionOmit

Remove keys in K from type T. Works with union types as well.

The default `Omit` has an odd behavior for the follow code, while `UnionOmit` fixes it:

```ts
type T = { a: string; b: number } | { b: boolean; c: number };
type X = Omit<T, 'b'>; // X = {}
type Y = UnionOmit<T, 'b'>; // Y = { a: string } | { c: number }
```

---

### UnionOptional

Make keys from K optional in T. Works with union types as well.

```ts
type T = { a: string; b: number };
type X = UnionOptional<T, 'a'>; // X = { a?: string; b: number}

type T = { a: string; b: number } | { b: boolean; c: number };
type X = UnionOptional<T, 'a'>; // X = { a?: string; b: number} | { b: boolean; c: number }
```
