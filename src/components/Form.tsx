import { ReactNode } from "react";
import "twin.macro";

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
    // <Card>
    <div tw="md:grid md:grid-cols-3 md:gap-6">
      <div tw="md:col-span-1">
        <h3 tw="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {subtitle && <p tw="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div tw="mt-5 space-y-6 md:col-span-2 md:mt-0">{children}</div>
    </div>
    // </Card>
  );
};
