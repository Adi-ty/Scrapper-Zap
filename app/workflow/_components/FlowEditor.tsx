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
    useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { DragEvent, useCallback, useEffect } from "react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/appNode";

const nodeTypes = {
    ScraperZapNode: NodeComponent,
};

const snapGrid: [number, number] = [16, 16];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { setViewport, screenToFlowPosition } = useReactFlow();

    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if (!flow) return;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);

            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
            // Viewport won't be restored as we are using fitView in ReactFlow
        } catch (error) {}
    }, [workflow.definition, setNodes, setEdges, setViewport]);

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        const taskType = event.dataTransfer.getData("application/reactflow");
        if (typeof taskType === undefined || !taskType) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode = CreateFlowNode(taskType as TaskType, position);
        setNodes((prev) => prev.concat(newNode));
    }, []);

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                snapToGrid
                fitView
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <MiniMap
                    position="top-right"
                    nodeStrokeWidth={3}
                    pannable
                    zoomable
                />
                <Controls position="top-left" fitViewOptions={fitViewOptions} />
                <Background
                    gap={16}
                    size={1}
                    variant={BackgroundVariant.Dots}
                />
            </ReactFlow>
        </main>
    );
}

export default FlowEditor;
