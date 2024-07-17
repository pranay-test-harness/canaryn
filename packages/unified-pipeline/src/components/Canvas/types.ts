/*
 * Copyright 2023 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */
import type { Position, Node as ReactFlowNode } from "reactflow";
import type { PipelineEntity } from "../../components/PipelineConfigPanel/types";
import PlusEdge from "./elements/Edges/PlusEdge/PlusEdge";
import AtomicNode from "./elements/Nodes/AtomicNode/AtomicNode";
import StageNode from "./elements/Nodes/StageNode/StageNode";
import GroupNode from "./elements/Nodes/GroupNode/GroupNode";
import RootNode from "./elements/Nodes/RootNode/RootNode";
import PlusNode from "./elements/Nodes/PlusNode/PlusNode";
import StopNode from "./elements/Nodes/StopNode/StopNode";
import AnchorNode from "./elements/Nodes/AnchorNode/AnchorNode";
import CustomEdge from "./elements/Edges/CustomEdge/CustomEdge";

export enum EdgeType {
  SMOOTHSTEP = "smoothstep",
  PLUS = "plus",
  DEFAULT = "default",
  CUSTOM = "custom",
}

export const EdgeTypes = {
  [EdgeType.PLUS]: PlusEdge,
  [EdgeType.CUSTOM]: CustomEdge,
};

export enum NodeType {
  ANCHOR = "anchor",
  GROUP = "node_group",
  PLUS = "plus",
  STAGE = "stage",
  ROOT = "root",
  ATOMIC = "atomic",
  STOP = "stop",
}

export const GROUPABLE_NODE_TYPES = [NodeType.STAGE, NodeType.ATOMIC];

export const TERMINAL_NODE_TYPES = [NodeType.ROOT, NodeType.PLUS];

export const NodeTypes = {
  [NodeType.ANCHOR]: AnchorNode,
  [NodeType.GROUP]: GroupNode,
  [NodeType.PLUS]: PlusNode,
  [NodeType.STAGE]: StageNode,
  [NodeType.ROOT]: RootNode,
  [NodeType.ATOMIC]: AtomicNode,
  [NodeType.STOP]: StopNode,
};

export enum PositionType {
  RELATIVE = "Relative",
  ABSOLUTE = "Absolute",
}

export interface DefaultNodeProps {
  name: string;
  path: string;
  icon: React.ReactElement | null;
  positionType: PositionType;
  entityType?: PipelineEntity;
  parallel?: boolean;
  groupId?: string;
  nodeType: NodeType;
  targetPosition: Position;
  sourcePosition: Position;
  hasChanged?: boolean;
}

export interface ExpandNodeProps {
  expandable?: boolean;
  expanded?: boolean;
}

export interface DeleteNodeProps {
  deletable: boolean;
}

export enum GroupOrientation {
  LR,
  TB,
}

export interface GroupNodesProps {
  memberNodes: ReactFlowNode[];
}

/* Types for Canvas */
export interface Node
  extends DeleteNodeProps,
    Omit<ExpandNodeProps, "expanded"> {
  name: string;
  path: string;
  icon: React.ReactElement | null;
  children?: Node[];
  parallel?: boolean;
  groupId?: string;
}

export interface Graph {
  nodes: Node[];
}
