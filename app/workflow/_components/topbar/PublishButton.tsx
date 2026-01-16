"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayCircleIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

export default function PublishButton({ workflowId }: { workflowId: string }) {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();

    const { mutate, isPending } = useMutation({
        mutationFn: PublishWorkflow,
        onSuccess: () => {
            toast.success("Workflow published successfully", {
                id: workflowId,
            });
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: workflowId,
            });
        },
    });

    return (
        <Button
            variant={"outline"}
            className="flex items-center gap-2"
            disabled={isPending}
            onClick={() => {
                const plan = generate();
                if (!plan) return;

                toast.loading("Published workflow...", { id: workflowId });
                mutate({
                    id: workflowId,
                    flowDefinition: JSON.stringify(toObject()),
                });
            }}
        >
            <UploadIcon size={16} className="stroke-green-400" />
            Publish
        </Button>
    );
}
