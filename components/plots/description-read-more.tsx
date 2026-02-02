"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DescriptionWithReadMoreProps {
    text: string;
    maxLines?: number; // Approximate lines not strictly CSS
    maxLength?: number; // Character limit
}

export function DescriptionWithReadMore({
    text,
    maxLength = 250,
}: DescriptionWithReadMoreProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const shouldTruncate = text.length > maxLength;

    const displayText =
        !isExpanded && shouldTruncate ? text.slice(0, maxLength) + "..." : text;

    return (
        <div className="mt-2">
            <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">
                {displayText}
            </p>
            {shouldTruncate && (
                <Button
                    variant="link"
                    className="p-0 h-auto mt-1 text-black font-semibold underline decoration-1 underline-offset-2 hover:text-gray-800"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <span className="flex items-center">
                            Read Less <ChevronUp className="ml-1 h-4 w-4" />
                        </span>
                    ) : (
                        <span className="flex items-center">
                            Read More <ChevronDown className="ml-1 h-4 w-4" />
                        </span>
                    )}
                </Button>
            )}
        </div>
    );
}
