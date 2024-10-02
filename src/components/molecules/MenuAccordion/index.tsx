"use client";

import { FC } from "react";
import { Accordion, Button, Icon as IconComponent } from "@/components/atoms";
import { DropDownModal } from "@/components/molecules";
import Link from "next/link";
import { categorizeDate, cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/types";
import { menuItems } from "./index.constants";
import { useChat, useSidebar } from "@/hooks";
import { extractDate } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import {
  fetchMessagesForChat,
  setChatId,
} from "@/lib/store/features/chat/chatSlice";
import { useAppDispatch } from "@/lib/store/hooks";
interface MenuAccordionItemProps {
  item: MenuItem;
  contents: any;
  handleOpen?: any;
  isHideChevron?: boolean;
}

const MenuAccordionItem: FC<MenuAccordionItemProps> = ({
  item,
  contents,
  isHideChevron,
  handleOpen,
}) => {
  const { open } = useSidebar();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const Icon = item.icon;
  // Sort contents by date in descending order
  const sortedContents = [...contents].sort(
    (a, b) =>
      new Date(b.created_at || b.date).getTime() -
      new Date(a.created_at || b.date).getTime()
  );

  // Function to categorize and group contents by date
  const groupedContents = sortedContents.reduce((groups, content) => {
    const category = categorizeDate(
      content.created_at ? extractDate(content.created_at) : content.date
    );
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(content);
    return groups;
  }, {} as Record<string, { title: string; chatId: string; date: string }[]>);

  const handleClick = (link: string, chatId: string) => {
    router.push(link, undefined);
    if (chatId) {
      dispatch(fetchMessagesForChat(chatId as string));
      dispatch(setChatId(chatId as string));
    }
  };

  const isActive =
    pathname === item.link || pathname.startsWith(`${item.link}/`);

  return (
    <Accordion.Item className="flex flex-col gap-0.5" value={item.value}>
      <Accordion.Trigger
        isHideChevron={isHideChevron}
        disabled={isHideChevron}
        onClick={() => handleOpen()}
        className={cn("p-2 rounded-sm group hover:text-white hover:bg-navy-5", {
          "bg-navy-25": isActive,
        })}
      >
        <div className={"flex justify-between w-full items-center"}>
          <div className="flex gap-3 items-center">
            <Icon />
            <span>{item.title}</span>
          </div>
          {isHideChevron && <span className="text-[10px] font-normal">Coming Soon</span>}
        </div>
      </Accordion.Trigger>
      {open && (
        <>
          {Object.keys(groupedContents).length ? (
            Object.entries(groupedContents).map(([group, contents]: any) => (
              <Accordion.Content key={group}>
                <p className="text-xs my-1">{group}</p>
                {contents.map((content: any, index: number) => (
                  <div key={index} className="flex justify-between hover:bg-navy-25 p-2 rounded-sm">
                    <button
                      onClick={() =>
                        handleClick(
                          content.id ? `${item.link}/${content.id}` : item.link,
                          content.id
                        )
                      }
                      className="flex flex-col w-[180px]"
                    >
                      <p className="menu-list-btn max-w-[calc(100%)] text-start m-0 group-hover:text-white text-grey-5">
                        {content.title}
                      </p>
                    </button>
                    <Button className="!px-2 !py-0 !rounded-sm" variant="ghost">
                      <IconComponent
                        type="DotsIcon"
                        className="stroke-grey-15 w-4 h-4"
                      />
                    </Button>
                    {/* <DropDownModal /> */}
                  </div>
                ))}
              </Accordion.Content>
            ))
          ) : (
            <Accordion.Content className="flex justify-between">
              <Link
                href={item.link}
                className="menu-list-btn flex gap-1 ml-1 items-center"
              >
                Start a new thread...
              </Link>
            </Accordion.Content>
          )}
        </>
      )}
    </Accordion.Item>
  );
};

const MenuAccordion: FC = () => {
  const { chats } = useChat();
  const { handleOpen } = useSidebar();

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-0.5 max-w-[calc(100%)]">
      {menuItems.map((item) => (
        <MenuAccordionItem
          key={item.value}
          item={item}
          contents={item.value === "assistant" ? chats : item.contents}
          handleOpen={handleOpen}
          isHideChevron={item.isHideChevron}
        />
      ))}
    </Accordion>
  );
};

export { MenuAccordion };
