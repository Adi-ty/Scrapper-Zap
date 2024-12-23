import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNodeData } from "@/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const NodeComponent = memo((props: NodeProps) => {
    const nodeData = props.data as AppNodeData;
    const task = TaskRegistry[nodeData.type];

    return (
        <NodeCard nodeId={props.id} isSelected={!!props.selected}>
            {/* The !! syntax converts the value of props.selected to a boolean */}
            <NodeHeader taskType={nodeData.type} />
            <NodeInputs>
                {task.inputs.map((input) => (
                    <NodeInput
                        key={input.name}
                        input={input}
                        nodeId={props.id}
                    />
                ))}
            </NodeInputs>

            <NodeOutputs>
                {task.outputs.map((output) => (
                    <NodeOutput key={output.name} output={output} />
                ))}
            </NodeOutputs>
        </NodeCard>
    );
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";
