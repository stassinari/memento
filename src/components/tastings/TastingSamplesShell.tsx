import type { ReactNode } from "react";

interface TastingSamplesShellProps {
  title?: string;
  list: ReactNode;
  children: ReactNode;
}

export const TastingSamplesShell = ({ title = "Samples", list, children }: TastingSamplesShellProps) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
    <div className="grid grid-cols-12">
      <aside className="col-span-12 border-b border-gray-200 bg-gray-50/50 dark:border-white/10 dark:bg-white/5 sm:col-span-4 sm:border-b-0 sm:border-r">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-white/10">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
        {list}
      </aside>

      <main className="col-span-12 p-4 sm:col-span-8">{children}</main>
    </div>
  </div>
);
