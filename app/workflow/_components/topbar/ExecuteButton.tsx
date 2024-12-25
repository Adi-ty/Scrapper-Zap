"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayCircleIcon } from "lucide-react";
import { toast } from "sonner";

export default function ExecuteButton({ workflowId }: { workflowId: string }) {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();

    const { mutate, isPending } = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => {
            toast.success("Execution started", {
                id: "flow-execution",
            });
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: "flow-execution",
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
                // console.log("____plan____");
                // console.table(plan);
                if (!plan) return; // Client side validation! If the plan is not generated, return

                mutate({
                    workflowId: workflowId,
                    flowDefinition: JSON.stringify(toObject()),
                });
            }}
        >
            <PlayCircleIcon size={16} className="stroke-green-400" />
            Execute
        </Button>
    );
}
