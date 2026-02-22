import { ReactNode } from "react";

import { Card } from "./Card";

interface FormSectionProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const FormSection = ({ children, title, subtitle }: FormSectionProps) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <Card.Container className="mt-5 md:col-span-2 md:mt-0">
        <Card.Content className="space-y-6">{children}</Card.Content>
      </Card.Container>
    </div>
  );
};
