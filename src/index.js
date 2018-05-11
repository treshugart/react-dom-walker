export function isEmpty(node) {
  return node == null;
}

export function isSimple(node) {
  return (
    typeof node === "boolean" ||
    typeof node === "number" ||
    typeof node === "string"
  );
}

export function getChildren(node) {
  if (node.child) {
    return getChildrenFromChild(node.child);
  } else if (node.memoizedProps) {
    return getChildrenFromProps(node.memoizedProps);
  } else if (node.props) {
    return getChildrenFromProps(node.props);
  }
  return [];
}

export function getChildrenFromChild(node) {
  const children = [];
  while (node) {
    children.push(node);
    node = node.sibling;
  }
  return children;
}

export function getChildrenFromProps(props) {
  return Array.isArray(props.children) ? props.children : [props.children];
}

export function getDisplayName(node) {
  if (!node.type) {
    return null;
  }
  if (typeof node.type === "string") {
    return node.type;
  }
  return node.type.displayName || node.type.name || "[anonymous]";
}

export function getDomNode(node) {
  const { stateNode } = node;
  return stateNode && stateNode.tagName ? stateNode : null;
}

export function getInstance(node) {
  for (const key in node) {
    if (key.indexOf("__reactInternalInstance") === 0) {
      return node[key];
    }
  }
}

export function getRoot(node) {
  return (
    node._reactRootContainer && node._reactRootContainer._internalRoot.current
  );
}

export function findRoots(node) {
  const roots = [];
  const tree = document.createTreeWalker(node);
  while (tree.nextNode()) {
    const root = getRoot(tree.currentNode);
    if (root) {
      roots.push(root);
    }
  }
  return roots;
}

export function walk(root, call) {
  // Skip empty nodes.
  if (isEmpty(root)) return;

  // Allow returning false to throw out the inclusive tree.
  if (call(root) === false) return;

  // Recursively walk children.
  getChildren(root).forEach(node => {
    // We add the parent node so we can look up in the tree if need be.
    if (!isEmpty(node) && typeof node === "object") {
      node.parent = root;
    }
    walk(node, call);
  });
}

export function json(node) {
  // Return empty and simple nodes.
  if (isEmpty(node) || isSimple(node)) {
    return node;
  }

  // Memoized props may also be simple, but we don't return if they're empty.
  if (isSimple(node.memoizedProps)) {
    return node.memoizedProps;
  }

  // In the last case we generate data for the corresponding React node.
  return {
    children: getChildren(node).map(json),
    name: getDisplayName(node)
  };
}
