import { Avatar, Icon } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface UserAvatarProps {
  className?: string;
  src?: string;
  initials?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ className, src, initials }) => {
  return (
    <Avatar className={cn("border-navy-5 border w-16 h-16", className)}>
      <Avatar.Image src={src} />
      <Avatar.Fallback>
        {initials ? (
          initials
        ) : (
          <Icon type="UserIcon" className="w-8 h-8 stroke-grey-15" />
        )}
      </Avatar.Fallback>
    </Avatar>
  );
};

export { UserAvatar };
