"use client";

import { useMemo, useState } from "react";
import { type z } from "zod";

import {
  PreviewInformation,
  PreviewRich,
} from "~/components/preview";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { type getFileType } from "~/lib/previewHelper";
import { cn } from "~/lib/utils";

import { type Schema_File } from "~/types/schema";

type Props = {
  data: z.infer<typeof Schema_File>;
  fileType: "unknown" | ReturnType<typeof getFileType>;
  token: string;
  paths: string[];
};

const isPreviewSupported = (type: string) =>
  ["code", "markdown", "text"].includes(type);

export default function PreviewLayout({ data, fileType, token }: Props) {
  const [view, setView] = useState<"markdown" | "raw">("markdown");

  const PreviewComponent = useMemo(() => {
    switch (fileType) {
      case "code":
        return <PreviewRich file={data} isCode view={"markdown"} />;
      case "markdown":
      case "text":
        return <PreviewRich file={data} view={view} />;
      default:
        return null;
    }
  }, [fileType, data, view]);

  return (
    <div
      slot='preview-container'
      className='flex flex-col gap-2 tablet:gap-4'
    >
      {isPreviewSupported(fileType) && (
        <Card>
          <CardHeader>
            <div
              className={cn(
                "flex flex-col gap-4 overflow-hidden",
                "mobile:flex-row mobile:items-center mobile:justify-between",
              )}
            >
              <CardTitle className='line-clamp-1 flex-grow whitespace-pre-wrap break-all'>
                Preview of {data.name}
              </CardTitle>
              {["text", "markdown"].includes(fileType) && (
                <div className='flex w-full items-center mobile:w-fit'>
                  <Button
                    size={"sm"}
                    variant={view === "markdown" ? "default" : "outline"}
                    onClick={() => setView("markdown")}
                    className='w-full rounded-r-none mobile:w-fit'
                  >
                    Markdown
                  </Button>
                  <Button
                    size={"sm"}
                    variant={view === "raw" ? "default" : "outline"}
                    onClick={() => setView("raw")}
                    className='w-full rounded-l-none mobile:w-fit'
                  >
                    Raw
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {PreviewComponent}
          </CardContent>
        </Card>
      )}

      {!isPreviewSupported(fileType) && (
        <Card>
          <CardHeader>
            <CardTitle className='line-clamp-1 whitespace-pre-wrap break-all'>
              {data.name}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <PreviewInformation file={data} token={token} />
    </div>
  );
}
