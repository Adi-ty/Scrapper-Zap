import { AppNode } from "@/types/appNode";
import {
    WorkflowExecutionPlan,
    WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "@/lib/workflow/task/registry";

type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
};
export function FlowToExecutionPlan(
    nodes: AppNode[],
    edges: Edge[]
): FlowToExecutionPlanType {
    const entrypoint = nodes.find(
        (node) => TaskRegistry[node.data.type].isEntryPoint
    );

    if (!entrypoint)
        throw new Error("TODO: Handle this error (Entrypoint not found)");

    const planned = new Set<string>();
    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [entrypoint],
        },
    ];

    planned.add(entrypoint.id);

    for (
        let phase = 2;
        phase <= nodes.length && planned.size < nodes.length;
        phase++
    ) {
        const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
        for (const currentNode of nodes) {
            if (planned.has(currentNode.id)) continue; // Skip if already planned in execution plan

            const invalidInputs = getInvalidInputs(currentNode, edges, planned);
            if (invalidInputs.length > 0) {
                // Invalid inputs doesn't mean the workflow is invalid
                // It is also possible that the input is from a node that is not yet planned
                const incomers = getIncomers(currentNode, nodes, edges);
                if (incomers.every((incomer) => planned.has(incomer.id))) {
                    // check if the all the dependencies/incomers are planned
                    // if not, skip this node for now
                    // and if all dependencies are planned, then this node is invalid
                    console.error(
                        "invalid inputs",
                        currentNode.id,
                        invalidInputs
                    );
                    throw new Error("TODO: Handle this error (Invalid inputs)");
                } else {
                    continue;
                }
            }

            nextPhase.nodes.push(currentNode);
        }
        for (const node of nextPhase.nodes) {
            planned.add(node.id);
        }
        executionPlan.push(nextPhase);
    }

    return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;
        if (inputValueProvided) {
            // if input is provided then it is valid we can continue
            continue;
        }

        // If value is not provided by the user
        // then check if the value is provided by the output of any other node
        const incomingEdges = edges.filter((edge) => edge.target === node.id);

        const inputLinkedToOutput = incomingEdges.find(
            (edge) => edge.targetHandle === input.name
        );

        const requiredInputProvidedByVisitedOutput =
            input.required &&
            inputLinkedToOutput &&
            planned.has(inputLinkedToOutput.source);

        if (requiredInputProvidedByVisitedOutput) {
            // the input is required and we have a valid value for it
            // provided by a task that is already planned
            continue;
        } else if (!input.required) {
            // if the input is not required but there is an output linked to it
            // then we need to be sure that the output is already planned
            if (!inputLinkedToOutput) continue;
            if (
                inputLinkedToOutput &&
                planned.has(inputLinkedToOutput.source)
            ) {
                // The output is providing a value for this input
                continue;
            }
        }

        invalidInputs.push(input.name);
    }

    return invalidInputs;
}
