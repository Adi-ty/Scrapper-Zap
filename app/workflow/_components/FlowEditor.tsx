"use client";
import { Workflow } from "@prisma/client";
import {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import React from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";

const nodeTypes = {
    ScraperZapNode: NodeComponent,
};

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([
        CreateFlowNode(TaskType.LAUNCH_BROWSER),
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
            >
                <MiniMap
                    position="top-right"
                    nodeStrokeWidth={3}
                    pannable
                    zoomable
                />
                <Controls position="top-left" />
                <Background gap={24} variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </main>
    );
}

export default FlowEditor;
