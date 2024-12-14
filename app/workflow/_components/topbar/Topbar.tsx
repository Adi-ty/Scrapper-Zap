"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveButton from "./SaveButton";

interface Props {
    title?: string;
    workflowId: string;
}

export default function Topbar({ title, workflowId }: Props) {
    const router = useRouter();
    return (
        <header
            className="flex p-2 border-p-2 border-separate 
        justify-between w-full h-[60px] sticky top-0 bg-background 
        z-10"
        >
            <div className="flex gap-1 flex-1 items-center">
                <TooltipWrapper content="Back">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <ChevronLeft size={20} />
                    </Button>
                </TooltipWrapper>

                {title && (
                    <p className="font-bold text-ellipsis truncate">{title}</p>
                )}
            </div>
            <div className="flex gap-1 flex-1 justify-end">
                <SaveButton workflowId={workflowId} />
            </div>
        </header>
    );
}
