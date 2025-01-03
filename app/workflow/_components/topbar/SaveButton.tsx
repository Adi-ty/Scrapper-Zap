"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
    const { toObject } = useReactFlow();

    const { mutate, isPending } = useMutation({
        mutationFn: UpdateWorkflow,
        onSuccess: () => {
            toast.success("Flow saved successfully", { id: "save-workflow" });
        },
        onError: () => {
            toast.error("Something went wrong", { id: "save-workflow" });
        },
    });

    return (
        <Button
            variant={"outline"}
            className="flex items-center gap-2"
            disabled={isPending}
            onClick={() => {
                const workflowDefinition = JSON.stringify(toObject());
                toast.loading("Saving flow...", { id: "save-workflow" });
                mutate({
                    id: workflowId,
                    definition: workflowDefinition,
                });
            }}
        >
            <CheckIcon size={16} className="stroke-blue-400" />
            Save
        </Button>
    );
}

export default SaveButton;
