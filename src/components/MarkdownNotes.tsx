import clsx from "clsx";
import { type HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownNotesProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  markdown?: string | null;
  emptyText?: string;
}

export const MarkdownNotes = ({
  markdown,
  className,
  emptyText = "-",
  ...props
}: MarkdownNotesProps) => {
  const trimmedMarkdown = markdown?.trim();

  if (!trimmedMarkdown) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</p>;
  }

  return (
    <article
      className={clsx(
        "prose prose-sm max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert",
        "prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
        "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
        "prose-a:text-orange-600 dark:prose-a:text-orange-300",
        className,
      )}
      {...props}
    >
      <ReactMarkdown>{trimmedMarkdown}</ReactMarkdown>
    </article>
  );
};
