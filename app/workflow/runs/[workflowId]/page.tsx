import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";

export default function ExecutionsPage({
    params,
}: {
    params: { workflowId: string };
}) {
    return (
        <div className="h-full w-full overflow-auto">
            <Topbar
                workflowId={params.workflowId}
                hideButtons
                title="All Runs"
            />
            <Suspense
                fallback={
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2
                            size={30}
                            className="animate-spin stroke-primary"
                        />
                    </div>
                }
            >
                <ExecutionsTableWrapper workflowId={params.workflowId} />
            </Suspense>
        </div>
    );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
    const executions = await GetWorkflowExecutions(workflowId);
    if (!executions || executions.length === 0) {
        return <div>No executions found.</div>;
    }

    return (
        <div className="container py-6 w-full">
            <ExecutionsTable
                workflowId={workflowId}
                initialExecutions={executions}
            />
        </div>
    );
}
