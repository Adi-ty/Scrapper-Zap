import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Code2Icon } from "lucide-react";

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: "Get HTML from Page",
    icon: (props) => <Code2Icon className="stroke-pink-400" {...props} />,
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
            required: true,
        },
    ] as const,
    outputs: [
        { name: "Html", type: TaskParamType.STRING },
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
        },
    ] as const,
} satisfies WorkflowTask;
