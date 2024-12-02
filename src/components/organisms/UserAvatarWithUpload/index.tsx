import { UserAvatar } from "@/components/molecules";
import { useUploadFiles, useUser } from "@/hooks";
import { FieldUploadAvatar } from "@/components/molecules";

const UserAvatarWithUpload = () => {
  const { handleFilesChange, selectedFiles } = useUploadFiles();
  const { user } = useUser();

  return (
    <FieldUploadAvatar onChange={handleFilesChange}>
      <UserAvatar src={selectedFiles?.url || user?.avatar_url} />
    </FieldUploadAvatar>
  );
};

export { UserAvatarWithUpload };
