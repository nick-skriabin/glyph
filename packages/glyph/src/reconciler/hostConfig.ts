import type {
  GlyphNode,
  GlyphTextInstance,
  GlyphContainer,
  GlyphNodeType,
} from "./nodes.js";
import {
  createGlyphNode,
  appendChild as glyphAppendChild,
  removeChild as glyphRemoveChild,
  insertBefore as glyphInsertBefore,
} from "./nodes.js";
import type { Style } from "../types/index.js";

// react-reconciler/constants
// We import these at the module level - they're simple numeric values
const DefaultEventPriority = 32;

type Props = Record<string, any>;
type UpdatePayload = { props: Props } | null;

export const hostConfig = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: true,

  // Timeouts
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1 as const,
  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,

  getCurrentEventPriority: () => DefaultEventPriority,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => {},

  createInstance(
    type: string,
    props: Props,
    _rootContainer: GlyphContainer,
    _hostContext: null,
    _internalHandle: any,
  ): GlyphNode {
    return createGlyphNode(type as GlyphNodeType, props);
  },

  createTextInstance(
    text: string,
    _rootContainer: GlyphContainer,
    _hostContext: null,
    _internalHandle: any,
  ): GlyphTextInstance {
    return { type: "raw-text", text, parent: null };
  },

  appendInitialChild(
    parentInstance: GlyphNode,
    child: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text") {
      // Append raw text to parent's text
      parentInstance.text =
        (parentInstance.text ?? "") + (child as GlyphTextInstance).text;
      child.parent = parentInstance;
    } else {
      glyphAppendChild(parentInstance, child as GlyphNode);
    }
  },

  finalizeInitialChildren(
    _instance: GlyphNode,
    _type: string,
    _props: Props,
    _rootContainer: GlyphContainer,
    _hostContext: null,
  ): boolean {
    return false;
  },

  prepareUpdate(
    _instance: GlyphNode,
    _type: string,
    oldProps: Props,
    newProps: Props,
    _rootContainer: GlyphContainer,
    _hostContext: null,
  ): UpdatePayload {
    // Simple: always update if props changed
    return { props: newProps };
  },

  shouldSetTextContent(_type: string, _props: Props): boolean {
    return false;
  },

  getRootHostContext(_rootContainer: GlyphContainer): null {
    return null;
  },

  getChildHostContext(
    parentHostContext: null,
    _type: string,
    _rootContainer: GlyphContainer,
  ): null {
    return parentHostContext;
  },

  getPublicInstance(instance: GlyphNode | GlyphTextInstance): GlyphNode | GlyphTextInstance {
    return instance;
  },

  prepareForCommit(_containerInfo: GlyphContainer): null {
    return null;
  },

  resetAfterCommit(containerInfo: GlyphContainer): void {
    containerInfo.onCommit();
  },

  preparePortalMount(): void {},

  // Mutation methods
  appendChild(
    parentInstance: GlyphNode,
    child: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text") {
      parentInstance.text =
        (parentInstance.text ?? "") + (child as GlyphTextInstance).text;
      child.parent = parentInstance;
    } else {
      glyphAppendChild(parentInstance, child as GlyphNode);
    }
  },

  appendChildToContainer(
    container: GlyphContainer,
    child: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text") return;
    const node = child as GlyphNode;
    node.parent = null;
    container.children.push(node);
  },

  insertBefore(
    parentInstance: GlyphNode,
    child: GlyphNode | GlyphTextInstance,
    beforeChild: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text" || beforeChild.type === "raw-text") return;
    glyphInsertBefore(parentInstance, child as GlyphNode, beforeChild as GlyphNode);
  },

  insertInContainerBefore(
    container: GlyphContainer,
    child: GlyphNode | GlyphTextInstance,
    beforeChild: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text" || beforeChild.type === "raw-text") return;
    const node = child as GlyphNode;
    const before = beforeChild as GlyphNode;
    const idx = container.children.indexOf(before);
    if (idx !== -1) {
      container.children.splice(idx, 0, node);
    } else {
      container.children.push(node);
    }
  },

  removeChild(
    parentInstance: GlyphNode,
    child: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text") {
      child.parent = null;
      // Rebuild text from remaining text children - simplified
      return;
    }
    glyphRemoveChild(parentInstance, child as GlyphNode);
  },

  removeChildFromContainer(
    container: GlyphContainer,
    child: GlyphNode | GlyphTextInstance,
  ): void {
    if (child.type === "raw-text") return;
    const node = child as GlyphNode;
    const idx = container.children.indexOf(node);
    if (idx !== -1) {
      container.children.splice(idx, 1);
    }
  },

  commitTextUpdate(
    textInstance: GlyphTextInstance,
    _oldText: string,
    newText: string,
  ): void {
    textInstance.text = newText;
    if (textInstance.parent) {
      // Rebuild parent text
      rebuildParentText(textInstance.parent);
    }
  },

  commitUpdate(
    instance: GlyphNode,
    updatePayload: UpdatePayload,
    _type: string,
    _prevProps: Props,
    newProps: Props,
    _internalHandle: any,
  ): void {
    instance.props = newProps;
    instance.style = (newProps.style as Style) ?? {};
    if (newProps.focusable && !instance.focusId) {
      instance.focusId = `focus-${Math.random().toString(36).slice(2, 9)}`;
    }
  },

  hideInstance(instance: GlyphNode): void {
    instance.hidden = true;
  },

  hideTextInstance(textInstance: GlyphTextInstance): void {
    textInstance.text = "";
  },

  unhideInstance(instance: GlyphNode, _props: Props): void {
    instance.hidden = false;
  },

  unhideTextInstance(textInstance: GlyphTextInstance, text: string): void {
    textInstance.text = text;
  },

  clearContainer(container: GlyphContainer): void {
    container.children.length = 0;
  },

  resetTextContent(instance: GlyphNode): void {
    instance.text = null;
  },
};

function rebuildParentText(parent: GlyphNode): void {
  // For text nodes, we rebuild the combined text from all raw-text children
  // This is simplified; in a more complex implementation, we'd track text children separately
  parent.text = null;
}
