import { MenuItem } from "@/types";
import { Icon } from "@/components/atoms";

export const menuItems: MenuItem[] = [
  {
    value: "assistant",
    icon: () => (
      <Icon
        type="SparkleIcon"
        className="w-6 h-6 stroke-grey-15 group-hover:stroke-white"
      />
    ),
    title: "Assistant",
    link: "/dashboard/chat",
    href: "/dashboard",
    contents: [],
  },
  {
    value: "budget",
    icon: () => (
      <Icon
        type="GoalsIcon"
        className="w-6 h-6 stroke-grey-15 group-hover:stroke-white fill-grey-15 group-hover:fill-white"
      />
    ),
    title: "Budget",
    link: "/dashboard/chat",
    href: "/dashboard",
    contents: [
      // {
      //   title: "🗂️ Manage, track, and review accounts.",
      //   date: "2024-03-18",
      //   chatId: "12345",
      //   category: "goals",
      // },
      // {
      //   title: "🧑‍ Expert guidance on financial strategies.",
      //   date: "2024-10-23",
      //   chatId: "54321",
      //   category: "goals",
      // },
      // {
      //   title: "🛒 Explore and compare financial offerings.",
      //   date: "2024-01-01",
      //   chatId: "96732",
      //   category: "goals",
      // },
    ],
  },
  // {
  //   value: "payments",
  //   icon: () => (
  //     <Icon
  //       type="CreditCardIcon"
  //       className="w-6 h-6 stroke-grey-15 group-hover:stroke-white"
  //     />
  //   ),
  //   isHideChevron: true,
  //   title: "Payments",
  //   link: "/payments",
  //   href: "/dashboard",
  //   contents: [],
  // },
  {
    value: "discover",
    icon: () => (
      <Icon
        type="SearchIcon"
        className="w-5 h-5 fill-grey-15 group-hover:fill-white"
      />
    ),
    isHideChevron: true,
    title: "Discover",
    link: "/discover",
    href: "/dashboard",
    contents: [
      {
        title: "🗂️ Manage, track, and review accounts.",
        date: "2024-07-02",
        chatId: "12345",
        category: "payments",
      },
      {
        title: "🧑‍ Expert guidance on financial strategies.",
        date: "2024-08-31",
        chatId: "54321",
        category: "payments",
      },
      {
        title: "🛒 Explore and compare financial offerings.",
        date: "2024-08-23",
        chatId: "96732",
        category: "payments",
      },
    ],
  },
  // {
  //   value: "advisor",
  //   icon: () => (
  //     <Icon
  //       type="UsersIcon"
  //       className="w-6 h-6 stroke-grey-15 group-hover:stroke-white"
  //     />
  //   ),
  //   title: "Advisors",
  //   link: "/advisors",
  //   isHideChevron: true,
  //   href: "/dashboard",
  //   contents: [
  //     {
  //       title: "🗂️ Manage, track, and review accounts.",
  //       date: "2024-01-31",
  //       chatId: "12345",
  //       category: "advisor",
  //     },
  //     {
  //       title: "🧑‍ Expert guidance on financial strategies.",
  //       date: "2024-09-09",
  //       chatId: "54321",
  //       category: "advisor",
  //     },
  //     {
  //       title: "🛒 Explore and compare financial offerings.",
  //       date: "2024-07-23",
  //       chatId: "96732",
  //       category: "advisor",
  //     },
  //   ],
  // },
];
