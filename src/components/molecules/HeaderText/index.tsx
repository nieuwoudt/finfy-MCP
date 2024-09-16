"use client";
import { usePathname } from "next/navigation";

const HeaderText = () => {
  const pathname = usePathname();
  const firstName = "Nieve";

  const headerText = {
    home: {
      title: (
        <h1 className="header">
          <span className="text-purple-15">Hey {firstName}!</span> I&apos;m your
          financial assistant.
        </h1>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Ask any question to get started.
        </p>
      ),
    },
    payments: {
      title: (
        <h1 className="header">
          Lets narrow our focus to your
          <span className="text-purple-15">&nbsp;spending</span>.
        </h1>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Ask any question to get started.
        </p>
      ),
    },
    advisors: {
      title: (
        <h1 className="header">
          Lets narrow our focus to your
          <span className="text-purple-15">&nbsp;spending</span>.
        </h1>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Ask any question to get started.
        </p>
      ),
    },
    discover: {
      title: (
        <h1 className="header">
          {firstName}, let&apos;s John, set some
          <span className="text-purple-15">&nbsp;goals</span>.
        </h1>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Tell me about your financial goals to get started.
        </p>
      ),
    },
    goals: {
      title: (
        <h1 className="header">
          {firstName}, let&apos;s see how you are
          <span className="text-purple-15">&nbsp;tracking</span> on your goals.
        </h1>
      ),
      cta: (
        <p className="text-grey-15 text-lg mt-2">
          Tell me about your financial goals to get started.
        </p>
      ),
    },
  };

  let content;
  if (pathname.includes("payments")) {
    content = headerText.payments;
  } else if (pathname.includes("discover")) {
    content = headerText.discover;
  } else if (pathname.includes("advisors")) {
    content = headerText.advisors;
  } else if (pathname.includes("goals")) {
    content = headerText.goals;
  } else {
    content = headerText.home;
  }

  return (
    <div className="flex flex-1 flex-col w-full items-center justify-end pb-10">
      {content && (
        <>
          {content.title}
          {content.cta}
        </>
      )}
    </div>
  );
};

export { HeaderText };
