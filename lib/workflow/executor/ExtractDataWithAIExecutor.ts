import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function ExtractDataWithAIExecutor(
    environment: ExecutionEnvironment<typeof ExtractDataWithAITask>,
): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("Credentials not provided");
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("Prompt not provided");
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("Content not provided");
        }

        const credential = await prisma.credential.findUnique({
            where: { id: credentials },
        });

        if (!credential) {
            environment.log.error("Invalid credentials provided");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("Failed to decrypt credentials");
            return false;
        }

        const genAI = new GoogleGenerativeAI(plainCredentialValue);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(prompt + "\n\n" + content);
        if (!result) {
            environment.log.error("Failed to extract data using AI");
            return false;
        }
        let text = result.response.text();

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        environment.setOutput("Extracted Data", text);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
