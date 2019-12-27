import React, {
  ComponentType,
  ReactNode,
} from 'react';

import { connect } from 'react-redux';

import { PropsType } from './props_type';

type Assignable<X, Y, A = true, B = false> = X extends Y ? A : B;

function testAssignable<C extends ComponentType<any>, P, PP = PropsType<C>>(
  r1: Assignable<P, PP>,
  r2?: Assignable<PP, P>,
) {
  return r2 || r1;
}

describe('PropsType<T>', () => {
  describe('For function', () => {
    describe('Without props', () => {
      const Comp = () => <div />;
      it('should compile', () => {
        testAssignable<typeof Comp, {}>(true, true);
        testAssignable<typeof Comp, { a: number }>(true, false);
      });
    });
    describe('With props', () => {
      describe('With only required properties', () => {
        const Comp = (props: { a: string }) => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string }>(true, true);
          testAssignable<typeof Comp, {}>(false);
          testAssignable<typeof Comp, { a: number }>(false);
          testAssignable<typeof Comp, { a: string; b: string }>(true, false);
          testAssignable<typeof Comp, { b: string }>(false);
          testAssignable<typeof Comp, { a: string; children: ReactNode }>(true, false);
        });
      });
      describe('With optional properties', () => {
        const Comp = (props: { a: string; b?: number }) => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string; b?: number }>(true, true);
          testAssignable<typeof Comp, { b?: number }>(false);
          testAssignable<typeof Comp, { a: number; b?: number }>(false);
          testAssignable<typeof Comp, { a: string; b: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
          testAssignable<typeof Comp, { c: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
        });
      });
      describe('With defaultProps', () => {
        const Comp = (props: { a: string; b: number }) => <div />;
        Comp.defaultProps = { b: 3 };
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string; b?: number }>(true, true);
          testAssignable<typeof Comp, { b?: number }>(false);
          testAssignable<typeof Comp, { a: number; b?: number }>(false);
          testAssignable<typeof Comp, { a: string; b: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
          testAssignable<typeof Comp, { c: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
        });
      });
      describe('With required children', () => {
        const Comp = (props: { a: string; children: string }) => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string }>(true, true);
          testAssignable<typeof Comp, {}>(false);
          testAssignable<typeof Comp, { a: number }>(false);
          testAssignable<typeof Comp, { a: string; b: string }>(true, false);
          testAssignable<typeof Comp, { b: string }>(false);
          testAssignable<typeof Comp, { a: string; children: string }>(true, false);
          testAssignable<typeof Comp, { a: string; children: number }>(false);
        });
      });
      describe('With union props', () => {
        const Comp = (props: { a: string; b: number } | { b: number; c: boolean }) => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, {}>(false);
          testAssignable<typeof Comp, { a: string }>(false);
          testAssignable<typeof Comp, { a: string; b: number }>(true, false);
          testAssignable<typeof Comp, { a: string; b: boolean }>(false);
          testAssignable<typeof Comp, { a: number; b: number }>(false);
          testAssignable<typeof Comp, { b: number }>(false);
          testAssignable<typeof Comp, { b: number; c: boolean }>(true, false);
          testAssignable<typeof Comp, { b: number; c: string }>(false);
          testAssignable<typeof Comp, { b: boolean; c: boolean }>(false);
          testAssignable<typeof Comp, { c: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b: number; c: boolean }>(true, false);
          testAssignable<typeof Comp, { a: string; b: boolean; c: boolean }>(false);
          // TODO: Fix edge cases.
          // testAssignable<typeof Comp, { a: string; b: number; c: number }>(false);
          // testAssignable<typeof Comp, { a: boolean; b: number; c: boolean }>(false);
          // testAssignable<typeof Comp, { a: string; b: number; d: string }>(false);
        });
      });
    });

    describe('For React.FC', () => {
      describe('With only required properties', () => {
        const Comp: React.FC<{ a: string }> = props => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string; children?: ReactNode }>(true, true);
          testAssignable<typeof Comp, {}>(false);
          testAssignable<typeof Comp, { a: number }>(false);
          testAssignable<typeof Comp, { a: string; b: string }>(true, false);
          testAssignable<typeof Comp, { b: string }>(false);
          testAssignable<typeof Comp, { a: string; children: ReactNode }>(true, false);
        });
      });
      describe('With optional properties', () => {
        const Comp: React.FC<{ a: string; b?: number }> = props => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
          testAssignable<typeof Comp, { b?: number }>(false);
          testAssignable<typeof Comp, { a: number; b?: number }>(false);
          testAssignable<typeof Comp, { a: string; b: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
          testAssignable<typeof Comp, { c: boolean }>(false);
          testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
        });
      });
      describe('With defaultProps', () => {
        const Comp: React.FC<{ a: string; b: number }> = props => <div />;
        Comp.defaultProps = { b: 3 };
        it('should compile', () => {
          // FC doesn't support defaultProps yet.
          // ext<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
          testAssignable<typeof Comp, { b?: number }>(false);
          testAssignable<typeof Comp, { a: number; b?: number }>(false);
          testAssignable<typeof Comp, { a: string; b: boolean }>(false);
          // ext<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
          testAssignable<typeof Comp, { c: boolean }>(false);
          // testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
        });
      });
      describe('With required children', () => {
        const Comp: React.FC<{ a: string; children: string }> = props => <div />;
        it('should compile', () => {
          testAssignable<typeof Comp, { a: string }>(true, true);
          testAssignable<typeof Comp, {}>(false);
          testAssignable<typeof Comp, { a: number }>(false);
          testAssignable<typeof Comp, { a: string; b: string }>(true, false);
          testAssignable<typeof Comp, { b: string }>(false);
          testAssignable<typeof Comp, { a: string; children: string }>(true, false);
          testAssignable<typeof Comp, { a: string; children: number }>(false);
        });
      });
    });
  });

  describe('For React.PureComponent', () => {
    describe('With only required properties', () => {
      class Comp extends React.PureComponent<{ a: string }> {
        render() {
          return <div />;
        }
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, {}>(false);
        testAssignable<typeof Comp, { a: number }>(false);
        testAssignable<typeof Comp, { a: string; b: string }>(true, false);
        testAssignable<typeof Comp, { b: string }>(false);
        testAssignable<typeof Comp, { a: string; children: ReactNode }>(true, false);
      });
    });
    describe('With optional properties', () => {
      class Comp extends React.PureComponent<{ a: string; b?: number }> {
        render() {
          return <div />;
        }
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, { b?: number }>(false);
        testAssignable<typeof Comp, { a: number; b?: number }>(false);
        testAssignable<typeof Comp, { a: string; b: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
        testAssignable<typeof Comp, { c: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
      });
    });
    describe('With defaultProps', () => {
      class Comp extends React.PureComponent<{ a: string; b: number }> {
        render() {
          return <div />;
        }
        static defaultProps = { b: 3 };
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, { b?: number }>(false);
        testAssignable<typeof Comp, { a: number; b?: number }>(false);
        testAssignable<typeof Comp, { a: string; b: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
        testAssignable<typeof Comp, { c: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
      });
    });
    describe('With required children', () => {
      class Comp extends React.PureComponent<{ a: string; children: string }> {
        render() {
          return <div />;
        }
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string }>(true, true);
        testAssignable<typeof Comp, {}>(false);
        testAssignable<typeof Comp, { a: number }>(false);
        testAssignable<typeof Comp, { a: string; b: string }>(true, false);
        testAssignable<typeof Comp, { b: string }>(false);
        testAssignable<typeof Comp, { a: string; children: string }>(true, false);
        testAssignable<typeof Comp, { a: string; children: number }>(false);
      });
    });
  });

  describe('For React.Component', () => {
    describe('With only required properties', () => {
      class Comp extends React.Component<{ a: string }> {
        render() {
          return <div />;
        }
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, {}>(false);
        testAssignable<typeof Comp, { a: number }>(false);
        testAssignable<typeof Comp, { a: string; b: string }>(true, false);
        testAssignable<typeof Comp, { b: string }>(false);
        testAssignable<typeof Comp, { a: string; children: ReactNode }>(true, false);
      });
    });
    describe('With optional properties', () => {
      class Comp extends React.Component<{ a: string; b?: number }> {
        render() {
          return <div />;
        }
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, { b?: number }>(false);
        testAssignable<typeof Comp, { a: number; b?: number }>(false);
        testAssignable<typeof Comp, { a: string; b: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
        testAssignable<typeof Comp, { c: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
      });
    });
    describe('With defaultProps', () => {
      class Comp extends React.Component<{ a: string; b: number }> {
        render() {
          return <div />;
        }
        static defaultProps = { b: 3 };
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, { b?: number }>(false);
        testAssignable<typeof Comp, { a: number; b?: number }>(false);
        testAssignable<typeof Comp, { a: string; b: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
        testAssignable<typeof Comp, { c: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
      });
    });
    describe('With required children', () => {
      class Comp extends React.Component<{ a: string; children: string }> {
        render() {
          return <div />;
        }
      }
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string }>(true, true);
        testAssignable<typeof Comp, {}>(false);
        testAssignable<typeof Comp, { a: number }>(false);
        testAssignable<typeof Comp, { a: string; b: string }>(true, false);
        testAssignable<typeof Comp, { b: string }>(false);
        testAssignable<typeof Comp, { a: string; children: string }>(true, false);
        testAssignable<typeof Comp, { a: string; children: number }>(false);
      });
    });
  });

  describe('For redux connected React.Component', () => {
    describe('With only required properties', () => {
      class WrappedComp extends React.Component<{ a: string }> {
        render() {
          return <div />;
        }
      }
      const Comp = connect()(WrappedComp);
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, {}>(false);
        testAssignable<typeof Comp, { a: number }>(false);
        testAssignable<typeof Comp, { a: string; b: string }>(true, false);
        testAssignable<typeof Comp, { b: string }>(false);
        testAssignable<typeof Comp, { a: string; children: ReactNode }>(true, false);
      });
    });
    describe('With optional properties', () => {
      class WrappedComp extends React.Component<{ a: string; b?: number }> {
        render() {
          return <div />;
        }
      }
      const Comp = connect()(WrappedComp);
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, { b?: number }>(false);
        testAssignable<typeof Comp, { a: number; b?: number }>(false);
        testAssignable<typeof Comp, { a: string; b: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
        testAssignable<typeof Comp, { c: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
      });
    });
    describe('With defaultProps', () => {
      class WrappedComp extends React.Component<{ a: string; b: number }> {
        render() {
          return <div />;
        }
        static defaultProps = { b: 3 };
      }
      const Comp = connect()(WrappedComp);
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string; b?: number; children?: ReactNode }>(true, true);
        testAssignable<typeof Comp, { b?: number }>(false);
        testAssignable<typeof Comp, { a: number; b?: number }>(false);
        testAssignable<typeof Comp, { a: string; b: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; c: boolean }>(true, false);
        testAssignable<typeof Comp, { c: boolean }>(false);
        testAssignable<typeof Comp, { a: string; b?: number; children: ReactNode }>(true, false);
      });
    });
    describe('With required children', () => {
      class WrappedComp extends React.Component<{ a: string; children: string }> {
        render() {
          return <div />;
        }
      }
      const Comp = connect()(WrappedComp);
      it('should compile', () => {
        testAssignable<typeof Comp, { a: string }>(true, true);
        testAssignable<typeof Comp, {}>(false);
        testAssignable<typeof Comp, { a: number }>(false);
        testAssignable<typeof Comp, { a: string; b: string }>(true, false);
        testAssignable<typeof Comp, { b: string }>(false);
        testAssignable<typeof Comp, { a: string; children: string }>(true, false);
        testAssignable<typeof Comp, { a: string; children: number }>(false);
      });
    });
  });
});
