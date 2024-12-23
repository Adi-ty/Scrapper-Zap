import { TaskParamType, TaskType } from "@/types/task";
import { Code2Icon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: "Get HTML from Page",
    icon: (props: LucideProps) => (
        <Code2Icon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Webpage",
            type: TaskParamType.BROWSER_INSTANCE,
            required: true,
        },
    ],
};
