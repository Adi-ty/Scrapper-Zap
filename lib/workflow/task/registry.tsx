import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowserTask";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FillInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebhookTask } from "./DeliverViaWebhook";

type Registry = {
    [k in TaskType]: WorkflowTask & { type: k }; // Ensure that the type field in the task object is the same as the key in the registry
};

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
};
