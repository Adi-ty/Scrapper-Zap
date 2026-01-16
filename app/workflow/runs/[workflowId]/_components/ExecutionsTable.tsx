"use client";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { WorkflowExecution } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

function ExecutionsTable({
    workflowId,
    initialExecutions,
}: {
    workflowId: string;
    initialExecutions: WorkflowExecution[];
}) {
    const router = useRouter();

    const query = useQuery({
        queryKey: ["executions", workflowId],
        initialData: initialExecutions,
        queryFn: () => GetWorkflowExecutions(workflowId),
        refetchInterval: 5000,
    });

    return (
        <div className="border rounded-lg shadow-md overflow-auto">
            <Table className="h-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consumed</TableHead>
                        <TableHead className="text-right text-xs text-muted-foreground">
                            Started at (desc)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="gap-2 h-full overflow-auto">
                    {query.data.map((execution) => {
                        const duration = DatesToDurationString(
                            execution.completedAt,
                            execution.startedAt
                        );

                        return (
                            <TableRow
                                key={execution.id}
                                className="cursor-pointer"
                                onClick={() => {
                                    router.push(
                                        `/workflow/runs/${execution.workflowId}/${execution.id}`
                                    );
                                }}
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {execution.id}
                                        </span>
                                        <div className="text-muted-foreground text-xs">
                                            <span>Triggered via</span>
                                            <Badge variant={"outline"}>
                                                {execution.trigger}
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{execution.status}</TableCell>
                                <TableCell>
                                    {execution.creditsConsumed}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span>
                                            {execution.startedAt
                                                ? new Date(
                                                      execution.startedAt
                                                  ).toLocaleString()
                                                : "-"}
                                        </span>
                                        {duration && (
                                            <span className="text-xs text-muted-foreground">
                                                Duration: {duration}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default ExecutionsTable;
