"use client";

import { TaskParam, TaskParamType } from "@/types/task";
import StringParam from "./param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import BrowserInstanceParam from "./param/BrowserInstanceParam";

function NodeParamField({
    param,
    nodeId,
}: {
    param: TaskParam;
    nodeId: string;
}) {
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[param.name];

    const updateNodeParamValue = useCallback(
        (newValue: string) => {
            updateNodeData(nodeId, {
                inputs: {
                    ...node.data.inputs,
                    [param.name]: newValue,
                },
            });
        },
        [updateNodeData, nodeId, node?.data.inputs, param.name]
    );
    switch (param.type) {
        case TaskParamType.STRING:
            return (
                <StringParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                />
            );
        case TaskParamType.BROWSER_INSTANCE:
            return (
                <BrowserInstanceParam
                    param={param}
                    value={""}
                    updateNodeParamValue={updateNodeParamValue}
                />
            );
        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">
                        Not Implemented
                    </p>
                </div>
            );
    }
}

export default NodeParamField;