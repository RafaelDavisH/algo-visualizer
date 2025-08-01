/**
 * Tree Node class for tree traversal visualization
 */
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.index = null; // For visualization purposes
  }
}

/**
 * Creates a binary tree from an array (level-order)
 * @param {number[]} arr - Array to convert to tree
 * @returns {TreeNode|null} - Root of the tree
 */
function createBinaryTree(arr) {
  if (!arr || arr.length === 0) return null;

  const root = new TreeNode(arr[0]);
  root.index = 0;
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (!node) continue;

    // Add left child
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i]);
      node.left.index = i;
      queue.push(node.left);
    }
    i++;

    // Add right child
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i]);
      node.right.index = i;
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

/**
 * Breadth-First Search generator for binary tree.
 * Yields objects of the form:
 *   { type: 'visit', index: number, value: number, level: number }
 *   { type: 'queue', indices: number[] } (current queue state)
 *   { type: 'found', index: number, value: number } (if searching for target)
 *   { type: 'complete', traversal: number[] } (final traversal order)
 * @param {number[]} arr - Array representing tree in level-order
 * @param {number} [target] - Optional target value to search for
 * @yields {{type: string, index?: number, indices?: number[], value?: number, level?: number, traversal?: number[], found?: boolean}}
 */
export function* breadthFirstSearch(arr, target) {
  if (!arr || arr.length === 0) return;

  const root = createBinaryTree(arr);
  if (!root) return;

  const queue = [{ node: root, level: 0 }];
  const traversal = [];
  let found = false;

  while (queue.length > 0) {
    // Show current queue state
    const queueIndices = queue.map(item => item.node.index);
    yield { type: 'queue', indices: queueIndices };

    const current = queue.shift();
    if (!current) continue;

    const { node, level } = current;

    // Visit current node
    yield { type: 'visit', index: node.index, value: node.value, level };
    traversal.push(node.value);

    // Check if this is the target we're searching for
    if (target !== null && target !== undefined && node.value === target) {
      yield { type: 'found', index: node.index, value: node.value };
      found = true;
    }

    // Add children to queue
    if (node.left) {
      queue.push({ node: node.left, level: level + 1 });
    }
    if (node.right) {
      queue.push({ node: node.right, level: level + 1 });
    }
  }

  // Show final traversal
  yield { type: 'complete', traversal, found: target !== null && target !== undefined ? found : undefined };
}

/**
 * Depth-First Search generator for binary tree.
 * Yields objects of the form:
 *   { type: 'visit', index: number, value: number, level: number }
 *   { type: 'stack', indices: number[] } (current stack state)
 *   { type: 'found', index: number, value: number } (if searching for target)
 *   { type: 'backtrack', index: number } (when backtracking)
 *   { type: 'complete', traversal: number[] } (final traversal order)
 * @param {number[]} arr - Array representing tree in level-order
 * @param {number} [target] - Optional target value to search for
 * @param {'preorder'|'inorder'|'postorder'} [order='preorder'] - DFS traversal order
 * @yields {{type: string, index?: number, indices?: number[], value?: number, level?: number, traversal?: number[], found?: boolean}}
 */
export function* depthFirstSearch(arr, target = undefined, order = 'preorder') {
  if (!arr || arr.length === 0) return;

  const root = createBinaryTree(arr);
  if (!root) return;

  const traversal = [];
  let found = false;

  function* dfsHelper(node, level, stack) {
    if (!node) return;

    // Show current stack state
    const stackIndices = stack.map(n => n.index);
    yield { type: 'stack', indices: stackIndices };

    // Add current node to stack for visualization
    stack.push(node);

    // Preorder: Visit node before children
    if (order === 'preorder') {
      yield { type: 'visit', index: node.index, value: node.value, level };
      traversal.push(node.value);

      // Check if this is the target
      if (target !== undefined && node.value === target) {
        yield { type: 'found', index: node.index, value: node.value };
        found = true;
        return;
      }
    }

    // Recursively visit left subtree
    if (node.left) {
      yield* dfsHelper(node.left, level + 1, [...stack]);
      if (found && target !== undefined) return;
    }

    // Inorder: Visit node between children
    if (order === 'inorder') {
      yield { type: 'visit', index: node.index, value: node.value, level };
      traversal.push(node.value);

      // Check if this is the target
      if (target !== undefined && node.value === target) {
        yield { type: 'found', index: node.index, value: node.value };
        found = true;
        return;
      }
    }

    // Recursively visit right subtree
    if (node.right) {
      yield* dfsHelper(node.right, level + 1, [...stack]);
      if (found && target !== undefined) return;
    }

    // Postorder: Visit node after children
    if (order === 'postorder') {
      yield { type: 'visit', index: node.index, value: node.value, level };
      traversal.push(node.value);

      // Check if this is the target
      if (target !== undefined && node.value === target) {
        yield { type: 'found', index: node.index, value: node.value };
        found = true;
        return;
      }
    }

    // Show backtracking
    yield { type: 'backtrack', index: node.index };
  }

  // Start DFS
  yield* dfsHelper(root, 0, []);

  // Show final traversal
  yield { type: 'complete', traversal, found: target !== undefined ? found : undefined };
}
