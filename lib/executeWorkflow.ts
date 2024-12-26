import "server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function ExecuteWorkflow(executionId: string) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
        },
        include: { workflow: true, phases: true },
    });

    if (!execution) throw new Error("Execution not found");

    // TODO: setup the execution environment

    // TODO: initialize the workflow execution
    // TODO: initialize phases status

    let executionFailed = false;
    for (const phase of execution.phases) {
        // TODO: execute phase
    }

    //TODO: finalize execution
    //TODO: clean up the environment

    revalidatePath("/workflow/runs");
}
