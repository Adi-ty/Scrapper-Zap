"use client";
import { CreateCredential } from "@/actions/credentials/createCredential";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    createCredentialSchema,
    createCredentialSchemaType,
} from "@/schemas/credential";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateCredentialsDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false);

    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {},
    });

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: () => {
            toast.success("Credential created successfully", {
                id: "create-credential",
            });
            form.reset();
            setOpen(false);
        },
        onError: () => {
            toast.error("Failed to create credential", {
                id: "create-credential",
            });
        },
    });

    const onSubmit = useCallback(
        (values: createCredentialSchemaType) => {
            toast.loading("Creating credential...", {
                id: "create-credential",
            });
            mutate(values);
        },
        [mutate],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create Credential"}</Button>
            </DialogTrigger>
            <DialogContent className="px-0">
                <CustomDialogHeader
                    icon={Shield}
                    title="Create credential"
                    subTitle="Start building your credential"
                />
                <div className="p-6">
                    <Form {...form}>
                        <form
                            className="space-y-8 w-full"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-1 items-center">
                                            Name
                                            <p className="text-xs text-red-600">
                                                (required)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Choose a descriptive and unique name
                                            for your credentials. This will be
                                            used to identify credentials
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-1 items-center">
                                            Value
                                            <p className="text-xs text-primary">
                                                (required)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the value for your credential.
                                            <br /> This will be securely stored
                                            and encrypted.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Proceed"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCredentialsDialog;
