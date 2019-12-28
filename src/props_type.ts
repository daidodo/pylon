import {
  ComponentClass,
  ComponentProps,
  ComponentType,
  PropsWithChildren,
} from 'react';

import { Optional } from 'utility-types';

/**
 * Test if types X and Y are identical.
 *
 * {@link https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts#L153-L157}
 * {@link https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript}
 */
export type TypeEqual<X, Y, A = true, B = false> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;

/**
 * Returns keys of a type (same as keyword keyof), or the union of keys of a union type.
 *
 * This is to complement keyword keyof returning only intersection
 * of keys for a union type.
 * ```ts
 *    type T = { a: string; b: number } | { b: boolean; c: number };
 *    type X = keyof T;       // X = 'b'
 *    type Y = UnionKeyOf<T>; // Y = 'a' | 'b' | 'c'
 * ```
 */
export type UnionKeyOf<T> = T extends any ? keyof T : never;

/**
 * Remove keys in K from type T. Works with union types as well.
 *
 * The default `Omit` has an odd behavior for the follow code, while `UnionOmit` fixes it:
 * ```ts
 *    type T = { a: string; b: number } | { b: boolean; c: number };
 *    type X = Omit<T, 'b'>;      // X = {}
 *    type Y = UnionOmit<T, 'b'>; // Y = { a: string } | { c: number }
 * ```
 */
export type UnionOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

/**
 * Make keys from K optional in T. Works with union types as well.
 * ```ts
 *    type T = { a: string; b: number }
 *    type X = UnionOptional<T, 'a'>; // X = { a?: string; b: number}
 *
 *    type T = { a: string; b: number } | { b: boolean; c: number };
 *    type X = UnionOptional<T, 'a'>; // X = { a?: string; b: number} | { b: boolean; c: number }
 * ```
 */
export type UnionOptional<T extends object, K extends UnionKeyOf<T> = UnionKeyOf<T>> = T extends any
  ? Optional<T, K>
  : never;

/**
 * Add, remove or replace properties of an object.
 * ```ts
 *    type T = { a: string; b: number };
 *    type X1 = ModifyProps<T, 'a'>;                // X1 = { b: number }
 *    type X2 = ModifyProps<T, { c: string }>;      // X2 = { a: string; b: number; c: string }
 *    type X3 = ModifyProps<T, { a: boolean }>;     // X3 = { a: boolean; b: number; }
 *    type X4 = ModifyProps<T, 'a', { c: string }>; // X4 = { b: number; c: string }
 * ```
 *
 * @typeparam T - Target object
 * @typeparam KA - Keys taken out from T, or properties added or updated to T
 * @typeparam A - Properties added or updated to T when KA is type of keys.
 */
export type ModifyProps<
  T extends object,
  KA extends keyof any | object,
  A extends object = {}
> = KA extends keyof any ? UnionOmit<T, UnionKeyOf<A> | KA> & A : UnionOmit<T, UnionKeyOf<KA>> & KA;

/**
 * Infer props type for React component X, i.e. functions, React.FC,
 * React.PureComponent and React.Component, with or without defaultProps.
 *
 * ```ts
 *     const Comp = (props: { a: string }) => <div />;
 *     type Props = PropsType<typeof Comp>; // expect { a: string }
 *
 *     class Comp extends React.Component<{ a: string }> {
 *       render() {
 *         return <div />;
 *       }
 *     }
 *     type Props = PropsType<typeof Comp>; // expect { a: string, children?: ReactNode }
 * ```
 */
export type PropsType<X extends ComponentType<any>, D = _DefaultProps<X>> = _OptionalChildren<
  UnionOmit<_AllProps<X>, keyof D> & Partial<D>
>;

type _AllProps<X extends ComponentType<any>> = X extends ComponentClass<infer P>
  ? PropsWithChildren<P>
  : ComponentProps<X>;

type _DefaultProps<X extends ComponentType<any>> = _PickValueType<X, 'defaultProps'>;

type _PickValueType<X, K extends keyof any, A = {}> = K extends keyof X ? X[K] : A;

type _OptionalChildren<X extends object, K = 'children'> = K extends UnionKeyOf<X>
  ? UnionOptional<X, K>
  : X;
