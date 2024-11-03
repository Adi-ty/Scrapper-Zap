"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(workflowId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.workflow.delete({
        where: {
            id: workflowId,
            userId,
        },
    });

    revalidatePath("/workflows");
}
