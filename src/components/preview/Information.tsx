"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Icon from "~/components/ui/icon";

import { bytesToReadable, durationToReadable } from "~/lib/utils";

import { type Schema_File } from "~/types/schema";

import config from "config";

type Props = {
  file: z.infer<typeof Schema_File>;
  token: string;
};
export default function PreviewInformation({ file, token }: Props) {
  const pathname = usePathname();

  const fileInfo = useMemo<{ label: string; value: string }[]>(() => {
    const value = [
      {
        label: "File Name",
        value: file.name,
      },
      {
        label: "Mime Type",
        value: file.mimeType,
      },
      {
        label: "Size",
        value: `${bytesToReadable(file.size ?? 0)} (${file.size ?? 0} bytes)`,
      }
    ];
    if (file.imageMediaMetadata) {
      value.push({
        label: "Dimension",
        value: `${file.imageMediaMetadata.width}px x ${file.imageMediaMetadata.height}px (${
          Math.round((file.imageMediaMetadata.width / file.imageMediaMetadata.height) * 100) / 100
        })`,
      });
    }
    if (file.videoMediaMetadata) {
      value.push({
        label: "Dimension",
        value: `${file.videoMediaMetadata.width}px x ${file.videoMediaMetadata.height}px (${
          Math.round((file.videoMediaMetadata.width / file.videoMediaMetadata.height) * 100) / 100
        })`,
      });
      value.push({
        label: "Duration",
        value: durationToReadable(file.videoMediaMetadata.durationMillis),
      });
    }

    return value;
  }, [file]);
  const downloadUrl = useMemo<string>(() => {
    const downloadUrl = new URL(`/api/download/${pathname}`.replace(/\/+/g, "/"), config.basePath);
    if (!config.apiConfig.allowDownloadProtectedFile) downloadUrl.searchParams.append("token", token);
    return downloadUrl.toString();
  }, [pathname, token]);

  const onCopyDownloadLink = useCallback(async () => {
    toast.loading("Copying download link...", {
      id: `download-${file.encryptedId}`,
    });
    try {
      // const downloadUrl = new URL(`/api/download/${file.encryptedId}`, config.basePath);
      // const downloadUrl = new URL(`/api/download/${pathname}`.replace(/\/+/g, "/"), config.basePath);
      // if (!config.apiConfig.allowDownloadProtectedFile) downloadUrl.searchParams.append("token", token);
      await navigator.clipboard.writeText(downloadUrl);
      toast.success("Download link copied!", {
        id: `download-${file.encryptedId}`,
      });
    } catch (error) {
      const e = error as Error;
      console.error(`[CopyDownloadLink] ${e.message}`);
      toast.error(e.message, {
        id: `download-${file.encryptedId}`,
      });
    }
  }, [file.encryptedId, downloadUrl]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>File information</CardTitle>
        </CardHeader>
        <CardContent>
          {fileInfo.map((info) => (
            <div
              key={info.label}
              className='grid items-center gap-2 border border-b-0 last-of-type:border-b tablet:grid-cols-2'
            >
              <span className='grow px-4 py-2 font-semibold tablet:border-r'>{info.label}</span>
              <span className='grow whitespace-pre-wrap text-pretty break-all px-4 py-2 text-sm'>{info.value}</span>
            </div>
          ))}
          <br></br>
          <div className='flex flex-col-reverse items-center gap-4 md:gap-2 tablet:flex-row tablet:justify-end'>
          <Button asChild className='w-full tablet:w-fit'>
            <a href={downloadUrl} target='_blank'>
              <Icon name='Download' />
              Download File
            </a>
          </Button>
          <Button
            variant="outline"
            className="w-full tablet:w-fit"
            onClick={onCopyDownloadLink}
          >
            Copy Link
          </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
