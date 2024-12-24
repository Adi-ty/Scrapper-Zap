"use client";

import useFlowValidation from "@/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";

function NodeCard({
    children,
    nodeId,
    isSelected,
}: {
    children: ReactNode;
    nodeId: string;
    isSelected: boolean;
}) {
    const { getNode, setCenter } = useReactFlow();
    const { invalidInputs } = useFlowValidation();
    const hasInvalidInputs = invalidInputs.some(
        (node) => node.nodeId === nodeId
    );

    return (
        <div
            onDoubleClick={() => {
                const node = getNode(nodeId);
                if (!node) return;
                const { position, measured } = node;
                if (!position || !measured) return;
                const { width, height } = measured;
                // Calculate the center of the node
                const x = position.x + width! / 2;
                const y = position.y + height! / 2;
                if (x === undefined || y === undefined) return;
                // Center the view on the node
                setCenter(x, y, {
                    zoom: 1,
                    duration: 500,
                });
            }}
            className={cn(
                `rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] 
            text-xs gap-1 flex flex-col`,
                isSelected && "border-primary",
                hasInvalidInputs && "border-destructive border-2"
            )}
        >
            {children}
        </div>
    );
}

export default NodeCard;
