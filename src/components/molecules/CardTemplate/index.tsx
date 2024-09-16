import { Card } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { FC, PropsWithChildren, ReactNode } from "react";

interface CardTemplateComponentProps extends PropsWithChildren {
  title?: ReactNode;
  description?: string;
  classes?: {
    card?: string;
    cardHeader?: string;
    cardTitle?: string;
    cardDescription?: string;
  };
}

const CardTemplateComponent: FC<CardTemplateComponentProps> = ({
  title,
  description,
  children,
  classes,
}) => {
  return (
    <Card
      className={cn(
        "border border-navy-15 bg-navy-25 rounded-xl w-full max-w-[400px]",
        classes?.card
      )}
    >
      {(title || description) && (
        <Card.Header className={cn(classes?.cardHeader, "mb-4")}>
          {title && typeof title === "string" ? (
            <Card.Title
              className={cn(
                "text-white text-2xl text-start font-bold",
                classes?.cardTitle
              )}
            >
              {title}
            </Card.Title>
          ) : (
            title
          )}
          {description && (
            <Card.Description
              className={cn(
                "text-sm font-medium mt-2",
                classes?.cardDescription
              )}
            >
              {description}
            </Card.Description>
          )}
        </Card.Header>
      )}
      {children}
    </Card>
  );
};

export const CardTemplate = Object.assign(CardTemplateComponent, Card);
