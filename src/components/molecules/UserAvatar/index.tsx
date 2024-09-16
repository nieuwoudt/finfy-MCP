import { Avatar } from "@/components/atoms";

const UserAvatar = ({ className }: { className: string }) => {
  return (
    <Avatar className={className}>
      <Avatar.Image src="https://github.com/shadcn.png" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar>
  );
};

export { UserAvatar };
