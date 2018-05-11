import { json } from "..";
import React, { Component, Fragment } from "react";
import { render } from "react-dom";

const tree = node => {
  const root = document.createElement("div");
  render(node, root);
  return root._reactRootContainer._internalRoot.current.child;
};

test("basic", () => {
  const root = tree(
    <div>
      <span>test</span>
    </div>
  );
  expect(json(root)).toEqual({
    name: "div",
    children: [
      {
        name: "span",
        children: ["test"]
      }
    ]
  });
});

test("component first", () => {
  const Div = ({ children }) => <div>{children}</div>;
  const root = tree(
    <Div>
      <span>test</span>
    </Div>,
    root
  );
  expect(json(root)).toEqual({
    name: "Div",
    children: [
      {
        name: "div",
        children: [
          {
            name: "span",
            children: ["test"]
          }
        ]
      }
    ]
  });
});

test("component in the middle", () => {
  const Span = ({ children }) => <span>{children}</span>;
  const root = tree(
    <div>
      <Span>test</Span>
    </div>,
    root
  );
  expect(json(root)).toEqual({
    name: "div",
    children: [
      {
        name: "Span",
        children: [
          {
            name: "span",
            children: ["test"]
          }
        ]
      }
    ]
  });
});

test("component first + middle", () => {
  const Div = ({ children }) => <div>{children}</div>;
  const Span = ({ children }) => <span>{children}</span>;
  const root = tree(
    <Div>
      <div>
        <Span>
          <span>test</span>
        </Span>
      </div>
    </Div>,
    root
  );
  expect(json(root)).toEqual({
    name: "Div",
    children: [
      {
        name: "div",
        children: [
          {
            name: "div",
            children: [
              {
                name: "Span",
                children: [
                  {
                    name: "span",
                    children: [
                      {
                        name: "span",
                        children: ["test"]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
});

test("only components", () => {
  const Div = ({ children }) => <div>{children}</div>;
  const Span = ({ children }) => <span>{children}</span>;
  const root = tree(
    <Div>
      <Span>test</Span>
    </Div>,
    root
  );
  expect(json(root)).toEqual({
    name: "Div",
    children: [
      {
        name: "div",
        children: [
          {
            name: "Span",
            children: [
              {
                name: "span",
                children: ["test"]
              }
            ]
          }
        ]
      }
    ]
  });
});

test("render props", () => {
  const Hello = ({ children, name }) => (
    <div>{children(`Hello, ${name}!`)}</div>
  );
  const root = tree(
    <Hello name="World">
      {text => {
        return <span>{text}</span>;
      }}
    </Hello>
  );
  expect(json(root)).toEqual({
    name: "Hello",
    children: [
      {
        name: "div",
        children: [
          {
            name: "span",
            children: ["Hello, World!"]
          }
        ]
      }
    ]
  });
});

test("higher-order components", () => {
  const withHello = Comp =>
    class extends Component {
      static get displayName() {
        return "withHello()";
      }
      render() {
        return (
          <div>
            <Comp>Hello, {this.props.name}!</Comp>
          </div>
        );
      }
    };
  class ChildComponent extends Component {
    render() {
      return <span>{this.props.children}</span>;
    }
  }
  const Hello = withHello(ChildComponent);
  const root = tree(<Hello name="World" />);
  expect(json(root)).toEqual({
    name: "withHello()",
    children: [
      {
        name: "div",
        children: [
          {
            name: "ChildComponent",
            children: [
              {
                name: "span",
                children: ["Hello, ", "World", "!"]
              }
            ]
          }
        ]
      }
    ]
  });
});

test("multiple children", () => {
  const root = tree(
    <div>
      <span>test1</span>
      <span>test2</span>
    </div>
  );
  expect(json(root)).toEqual({
    name: "div",
    children: [
      {
        name: "span",
        children: ["test1"]
      },
      {
        name: "span",
        children: ["test2"]
      }
    ]
  });
});

test("simple values are passed through", () => {
  expect(json(null)).toBe(null);
  expect(json(undefined)).toBe(undefined);
  expect(json(false)).toBe(false);
  expect(json(0)).toBe(0);
  expect(json(true)).toBe(true);
  expect(json(1)).toBe(1);
  expect(json("")).toBe("");
  expect(json("string")).toBe("string");
});

test.skip("fragments", () => {
  const root = tree(
    <Fragment>
      <span>test1</span>
      <span>test2</span>
    </Fragment>
  );
  expect(json(root)).toEqual({
    name: "Fragment",
    children: [
      {
        name: "span",
        children: ["test1"]
      },
      {
        name: "span",
        children: ["test2"]
      }
    ]
  });
});
