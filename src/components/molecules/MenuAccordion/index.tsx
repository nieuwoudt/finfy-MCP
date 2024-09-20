"use client";

import { FC } from "react";
import { Accordion } from "@/components/atoms";
import { DropDownModal } from "@/components/molecules";
import Link from "next/link";
import { categorizeDate, cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/types";
import { menuItems } from "./index.constants";
import { useSidebar } from "@/hooks";

interface MenuAccordionItemProps {
  item: MenuItem;
}

const MenuAccordionItem: FC<MenuAccordionItemProps> = ({ item }) => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const Icon = item.icon;

  // Sort contents by date in descending order
  const sortedContents = [...item.contents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Function to categorize and group contents by date
  const groupedContents = sortedContents.reduce((groups, content) => {
    const category = categorizeDate(content.date); // Categorize the date
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(content);
    return groups;
  }, {} as Record<string, { title: string; chatId: string; date: string }[]>);

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
            Object.entries(groupedContents).map(([group, contents]) => (
              <Accordion.Content key={group}>
                <p className="text-xs my-1">{group}</p>
                {contents.map((content, index) => (
                  <div key={index} className="flex justify-between">
                    <Link href={item.link} className="flex flex-col w-[210px]">
                      <p className="menu-list-btn pl-2">{content.title}</p>
                    </Link>
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
  return (
    <Accordion type="single" collapsible className="flex flex-col gap-0.5">
      {menuItems.map((item) => (
        <MenuAccordionItem key={item.value} item={item} />
      ))}
    </Accordion>
  );
};

export { MenuAccordion };
