"use client";

import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { PlayCircleIcon } from "lucide-react";

export default function ExecuteButton({ workflowId }: { workflowId: string }) {
    const generate = useExecutionPlan();

    return (
        <Button
            variant={"outline"}
            className="flex items-center gap-2"
            onClick={() => {
                const plan = generate();
                console.log("____plan____");
                console.table(plan);
            }}
        >
            <PlayCircleIcon size={16} className="stroke-green-400" />
            Execute
        </Button>
    );
}
