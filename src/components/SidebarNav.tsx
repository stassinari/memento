import { css } from "@emotion/react";
import { DocumentReference, doc } from "firebase/firestore";
import { ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import tw, { theme } from "twin.macro";
import { db } from "../firebaseConfig";
import { useFirestoreDocRealtime } from "../hooks/firestore/useFirestoreDocRealtime";
import { useActiveRoute } from "../hooks/useActiveRoute";
import { useCurrentUser } from "../hooks/useInitUser";
import useMediaQuery from "../hooks/useMediaQuery";
import { User } from "../types/user";
import { navLinks } from "./BottomNav";

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  Icon,
  label,
  linkTo,
  nested = false,
}) => {
  const isActive = useActiveRoute(linkTo);

  return (
    <Link
      to={linkTo}
      className="group"
      css={[
        tw`flex items-center px-2 py-2 text-sm font-medium rounded-md hover:(bg-gray-50 text-orange-600) `,
        nested && tw`ml-4`,
        isActive && tw`text-orange-600 bg-gray-50`,
      ]}
    >
      <span
        css={[
          tw`flex-shrink-0 w-6 h-6 mr-3 text-gray-400 group-hover:text-orange-600`,
          isActive && tw`text-orange-600`,
        ]}
        aria-hidden="true"
      >
        {Icon}
      </span>
      {label}
    </Link>
  );
};

export interface SidebarNavItemProps {
  Icon: ReactNode;
  label: string;
  linkTo: string;
  nested?: boolean;
}

const sidebarNavLinks: SidebarNavItemProps[] = [
  navLinks.home,
  navLinks.beans,
  navLinks.drinks,
  { ...navLinks.brews, nested: true },
  { ...navLinks.espresso, nested: true },
  { ...navLinks.tastings, nested: true },
  navLinks.decentUpload,
  ...(process.env.NODE_ENV === "development" ? [navLinks.designLibrary] : []),
];

export const SidebarNav = () => {
  const user = useCurrentUser();
  const userRef = useMemo(
    () => doc(db, "users", user.uid) as DocumentReference<User>,
    [user?.uid]
  );

  const { details: dbUser } = useFirestoreDocRealtime<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : null;

  const isLg = useMediaQuery(`(min-width: ${theme`screens.lg`})`);

  const sidebarNavLinks: SidebarNavItemProps[] = useMemo(
    () => [
      navLinks.home,
      navLinks.beans,
      navLinks.drinks,
      { ...navLinks.brews, nested: true },
      { ...navLinks.espresso, nested: true },
      { ...navLinks.tastings, nested: true },
      ...(secretKey ? [navLinks.decentUpload] : []),
      ...(process.env.NODE_ENV === "development"
        ? [navLinks.designLibrary]
        : []),
    ],
    [secretKey]
  );

  return (
    <div tw="hidden md:(flex w-48 flex-col fixed inset-y-0) lg:w-64">
      <div
        css={[
          tw`flex flex-col px-4 pb-4 overflow-y-auto bg-white border-r border-gray-200 gap-y-5 grow lg:px-6`,
          css`
            padding-left: calc(
              env(safe-area-inset-left) +
                ${isLg ? theme`spacing.6` : theme`spacing.4`}
            );
          `,
        ]}
      >
        <div tw="flex items-center h-16 shrink-0">
          <img
            tw="w-auto h-8"
            src="https://tailwindui.com/img/logos/workflow-mark.svg?color=orange&shade=600"
            alt="Workflow"
          />
        </div>
        <nav tw="flex flex-col flex-1">
          <ul role="list" tw="flex flex-col flex-1 gap-y-7">
            <li>
              <ul role="list" tw="-mx-2 space-y-1 ">
                {sidebarNavLinks.map(({ Icon, label, linkTo, nested }) => (
                  <li key={label}>
                    <SidebarNavItem
                      Icon={Icon}
                      label={label}
                      linkTo={linkTo}
                      nested={nested}
                    />
                  </li>
                ))}
              </ul>
            </li>
            <li tw="mt-auto">
              <SidebarNavItem
                Icon={navLinks.settings.Icon}
                label={navLinks.settings.label}
                linkTo={navLinks.settings.linkTo}
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
