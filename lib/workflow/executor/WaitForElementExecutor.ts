import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
    environment: ExecutionEnvironment<typeof WaitForElementTask>,
): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("No selector provided.");
        }

        const visibility = environment.getInput("Visibility");
        if (!visibility) {
            environment.log.error("No visibility provided.");
        }

        await environment.getPage()!.waitForSelector(selector, {
            visible: visibility === "visible",
            hidden: visibility === "hidden",
        });
        environment.log.info(`Element "${selector}" is now ${visibility}.`);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
