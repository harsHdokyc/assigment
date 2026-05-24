import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getOrganizationId, uploadCsv } from "@/lib/api";

import { invalidateAppData } from "./invalidation";

export type UploadVariables = {
  file: File;
  sourceType: string;
};

export function useUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, sourceType }: UploadVariables) =>
      uploadCsv(file, sourceType, getOrganizationId()),
    onSuccess: () => invalidateAppData(queryClient),
  });
}
