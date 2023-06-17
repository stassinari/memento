import { ReactNode } from "react";
import "twin.macro";
import { Card } from "./Card";

interface FormSectionProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div tw="md:(grid grid-cols-3 gap-6)">
      <div tw="md:col-span-1">
        <h3 tw="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {subtitle && <p tw="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <Card.Container tw="mt-5 md:col-span-2 md:mt-0">
        <Card.Content tw="space-y-6">{children}</Card.Content>
      </Card.Container>
    </div>
  );
};
