"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { DragEvent } from "react";

export default function TaskMenu() {
    return (
        <aside className="w-[270px] min-w-[270px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
            <Accordion
                type="multiple"
                className="w-full"
                defaultValue={[
                    "extraction",
                    "interactions",
                    "timing",
                    "results",
                ]}
            >
                <AccordionItem value="extraction">
                    <AccordionTrigger className="font-bold">
                        Data Extraction
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                        <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                        <TaskMenuBtn
                            taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT}
                        />
                        <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                        <TaskMenuBtn
                            taskType={TaskType.READ_PROPERTY_FROM_JSON}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="interactions">
                    <AccordionTrigger className="font-bold">
                        User Interactions
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                        <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                        <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timing">
                    <AccordionTrigger className="font-bold">
                        Timing Controls
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                        <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="results">
                    <AccordionTrigger className="font-bold">
                        Deliver Results
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1">
                        <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType];

    const onDragStart = (event: DragEvent, type: TaskType) => {
        event.dataTransfer.setData("application/reactflow", taskType);
        event.dataTransfer.effectAllowed = "move";
    };
    return (
        <Button
            variant={"secondary"}
            className="flex justify-center items-center gap-2 w-full"
            draggable
            onDragStart={(event) => onDragStart(event, taskType)}
        >
            <div className="flex gap-2">
                <task.icon size={20} />
                {task.label}
            </div>
        </Button>
    );
}
