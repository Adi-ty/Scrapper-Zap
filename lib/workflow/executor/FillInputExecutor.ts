import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";

export async function FillInputExecutor(
    environment: ExecutionEnvironment<typeof FillInputTask>,
): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("No selector provided.");
        }
        const value = environment.getInput("Value");
        if (!value) {
            environment.log.error("No value provided.");
        }

        await environment.getPage()!.type(selector, value);

        setTimeout(() => {
            console.log("Input filled");
        }, 3000); // Wait for 3 seconds to ensure the input is processed

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
