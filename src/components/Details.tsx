import "twin.macro";

interface DetailsRowProps {
  label: string;
  value: string;
}

const DetailsRow: React.FC<DetailsRowProps> = ({ label, value }) => (
  <div tw="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt tw="text-sm font-medium text-gray-500">{label}</dt>
    <dd tw="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value}</dd>
  </div>
);

interface DetailsProps {
  rows: DetailsRowProps[];
}

export const Details: React.FC<DetailsProps> = ({ rows }) => {
  return (
    <div tw="mt-5 border-t border-gray-200">
      <dl tw="sm:divide-y sm:divide-gray-200">
        {rows.map(({ label, value }) => (
          <DetailsRow key={label} label={label} value={value} />
        ))}

        {/* <div tw="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
          <dt tw="text-sm font-medium text-gray-500">Attachments</dt>
          <dd tw="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <ul
              role="list"
              tw="border border-gray-200 divide-y divide-gray-200 rounded-md"
            >
              <li tw="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div tw="flex items-center flex-1 w-0">
                  <PaperClipIcon
                    tw="flex-shrink-0 w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span tw="flex-1 w-0 ml-2 truncate">
                    resume_back_end_developer.pdf
                  </span>
                </div>
                <div tw="flex-shrink-0 ml-4">
                  <a
                    href="#"
                    tw="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Download
                  </a>
                </div>
              </li>
              <li tw="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div tw="flex items-center flex-1 w-0">
                  <PaperClipIcon
                    tw="flex-shrink-0 w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span tw="flex-1 w-0 ml-2 truncate">
                    coverletter_back_end_developer.pdf
                  </span>
                </div>
                <div tw="flex-shrink-0 ml-4">
                  <a
                    href="#"
                    tw="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Download
                  </a>
                </div>
              </li>
            </ul>
          </dd>
        </div> */}
      </dl>
    </div>
  );
};
