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
import { useEffect } from "react";

const nodeTypes = {
    ScraperZapNode: NodeComponent,
};

const snapGrid: [number, number] = [16, 16];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { setViewport } = useReactFlow();

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
