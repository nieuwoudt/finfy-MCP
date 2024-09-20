import { UserAvatar } from "@/components/molecules";
import { useUploadFiles } from "@/hooks";
import { FieldUploadAvatar } from "@/components/molecules";

const UserAvatarWithUpload = () => {
  const { handleFilesChange, selectedFiles } = useUploadFiles();
  return (
    <FieldUploadAvatar onChange={handleFilesChange}>
      <UserAvatar src={selectedFiles?.url} />
    </FieldUploadAvatar>
  );
};

export { UserAvatarWithUpload };
