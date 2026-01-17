import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileJson, MousePointerClick } from "lucide-react";

export const ReadPropertyFromJsonTask = {
    type: TaskType.READ_PROPERTY_FROM_JSON,
    label: "Read Property from JSON",
    icon: (props) => <FileJson className="stroke-pink-400" {...props} />,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "JSON",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Property name",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [{ name: "Property value", type: TaskParamType.STRING }] as const,
} satisfies WorkflowTask;
