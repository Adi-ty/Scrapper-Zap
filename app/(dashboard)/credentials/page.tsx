import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyhole, ShieldIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialsDialog from "./_components/CreateCredentialsDialog";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "./_components/DeleteCredentialDialog";

function CredentialsPage() {
    return (
        <div className="flex flex-1 flex-col h-full">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Credentials</h1>
                    <p className="text-muted-foreground">
                        Manage your credentials here.
                    </p>
                </div>
                <CreateCredentialsDialog />
            </div>

            <div className="h-full py-6 space-y-8">
                <Alert>
                    <ShieldIcon className="h-4 w-4 stroke-primary" />
                    <AlertTitle className="text-green-500">
                        Encryption
                    </AlertTitle>
                    <AlertDescription>
                        All information is securely encrypted, ensuring your
                        data remains save.
                    </AlertDescription>
                </Alert>

                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                    <UserCredentials />
                </Suspense>
            </div>
        </div>
    );
}

async function UserCredentials() {
    const credentials = await GetCredentialsForUser();
    if (!credentials) {
        return <div>Something went wrong</div>;
    }
    if (credentials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-8 border border-dashed rounded-lg">
                <div className="rounded-full bg-accent p-4">
                    <ShieldIcon className="h-8 w-8 stroke-primary" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-lg font-semibold">
                        No credentials found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Create a credential to get started with secure
                        automation.
                    </p>
                </div>
                <CreateCredentialsDialog triggerText="Create Your First Credential" />
            </div>
        );
    }

    return (
        <div className="flex gap-2 flex-wrap">
            {credentials.map((credential) => {
                const createdAt = formatDistanceToNow(credential.createdAt);
                return (
                    <Card
                        key={credential.id}
                        className="w-full p-4 flex justify-between"
                    >
                        <div className="flex gap-2 items-center">
                            <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                                <LockKeyhole
                                    size={18}
                                    className="stroke-primary"
                                />
                            </div>
                            <div>
                                <p className="font-bold">{credential.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {createdAt}
                                </p>
                            </div>
                        </div>
                        <DeleteCredentialDialog name={credential.name} />
                    </Card>
                );
            })}
        </div>
    );
}

export default CredentialsPage;
