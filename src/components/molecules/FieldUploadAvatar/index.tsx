import { Icon } from "@/components/atoms";
import { FC, PropsWithChildren, ComponentProps } from "react";

interface FieldUploadAvatarProps
  extends PropsWithChildren<ComponentProps<"input">> {}

const FieldUploadAvatar: FC<FieldUploadAvatarProps> = ({
  children,
  ...props
}) => {
  return (
    <label className="relative cursor-pointer">
      {children}
      <input
        {...props}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        className="absolute w-0 h-0 translate-x-full"
      />
      <span className="bg-navy-15 p-1.5 -right-1 absolute -bottom-1 border cursor-pointer border-navy-5 w-7 h-7 rounded-full flex justify-center items-center ">
        <Icon type="PlusIcon" className="w-4 h-4 stroke-purple-15" />
      </span>
    </label>
  );
};

export { FieldUploadAvatar };
