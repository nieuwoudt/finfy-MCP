"use client";

import { FC } from "react";
import { Accordion } from "@/components/atoms";
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
}

const MenuAccordionItem: FC<MenuAccordionItemProps> = ({ item, contents }) => {
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
        className={cn("p-2 rounded-sm group hover:text-white hover:bg-navy-5", {
          "bg-navy-25": isActive,
        })}
      >
        <div className="flex gap-3 items-center">
          <Icon />
          <span>{item.title}</span>
        </div>
      </Accordion.Trigger>
      {open && (
        <>
          {Object.keys(groupedContents).length ? (
            Object.entries(groupedContents).map(([group, contents]: any) => (
              <Accordion.Content key={group}>
                <p className="text-xs my-1">{group}</p>
                {contents.map((content: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <button
                      onClick={() =>
                        handleClick(
                          content.id ? `${item.link}/${content.id}` : item.link,
                          content.id
                        )
                      }
                      className="flex flex-col w-[210px]"
                    >
                      <p className="menu-list-btn pl-2">{content.title}</p>
                    </button>
                    <DropDownModal />
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

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-0.5">
      {menuItems.map((item) => (
        <MenuAccordionItem
          key={item.value}
          item={item}
          contents={item.value === "assistant" ? chats : item.contents}
        />
      ))}
    </Accordion>
  );
};

export { MenuAccordion };
