"use client";
import { Workflow } from "@prisma/client";
import {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    getOutgoers,
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
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const nodeTypes = {
    ScraperZapNode: NodeComponent,
};

const edgeTypes = {
    default: DeletableEdge,
};

const snapGrid: [number, number] = [16, 16];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } =
        useReactFlow();

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

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();
            const taskType = event.dataTransfer.getData(
                "application/reactflow",
            );
            if (typeof taskType === undefined || !taskType) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = CreateFlowNode(taskType as TaskType, position);
            setNodes((prev) => prev.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
            if (!connection.targetHandle) return;
            // Remove input value when connected to another node
            const node = nodes.find((nd) => nd.id === connection.target);
            if (!node) return;
            const nodeInputs = node.data.inputs;
            updateNodeData(node.id, {
                inputs: {
                    ...nodeInputs,
                    [connection.targetHandle]: "",
                },
            });
        },
        [setEdges, updateNodeData, nodes],
    );

    const isValidConnection = useCallback(
        (connection: Edge | Connection) => {
            // Prevent connecting to the same node
            if (connection.source === connection.target) return false;

            // Prevent connecting if taskParam is not of same type
            const sourceNode = nodes.find(
                (node) => node.id === connection.source,
            );
            const targetNode = nodes.find(
                (node) => node.id === connection.target,
            );
            if (!sourceNode || !targetNode) return false; // Source or target node not found
            const sourceTask = TaskRegistry[sourceNode.data.type];
            const targetTask = TaskRegistry[targetNode.data.type];
            const output = sourceTask.outputs.find(
                (out) => out.name === connection.sourceHandle,
            );
            const input = targetTask.inputs.find(
                (inp) => inp.name === connection.targetHandle,
            );

            console.log("@@@Connection attempt:", {
                sourceHandle: connection.sourceHandle,
                targetHandle: connection.targetHandle,
                output,
                input,
                outputType: output?.type,
                inputType: input?.type,
            });

            if (input?.type !== output?.type) return false; // Input and output type mismatch

            // Prevent connecting if it creates a cycle
            // https://reactflow.dev/examples/interaction/prevent-cycles - Implementation reference
            const hasCycle = (node: AppNode, visited = new Set()) => {
                if (visited.has(node.id)) return true;
                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };

            const detectedCycle = hasCycle(targetNode);

            return !detectedCycle;
        },
        [nodes, edges],
    );

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                snapToGrid
                fitView
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
            >
                <MiniMap
                    position="top-right"
                    nodeStrokeWidth={3}
                    pannable
                    zoomable
                    style={{
                        width: 150,
                        height: 100,
                        backgroundColor: "hsl(var(--background))",
                    }}
                    maskColor="hsl(var(--muted) / 0.5)"
                />
                <Controls position="top-left" fitViewOptions={fitViewOptions} />
                <Background
                    gap={40}
                    size={1}
                    variant={BackgroundVariant.Lines}
                    color="hsl(var(--muted-foreground) / 0.2)"
                />
            </ReactFlow>
        </main>
    );
}

export default FlowEditor;
