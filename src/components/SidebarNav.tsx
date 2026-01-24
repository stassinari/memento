import { db } from "@/firebaseConfig";
import { useFirestoreDocRealtime } from "@/hooks/firestore/useFirestoreDocRealtime";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { useCurrentUser } from "@/hooks/useInitUser";
import useScreenMediaQuery from "@/hooks/useScreenMediaQuery";
import { User } from "@/types/user";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { DocumentReference, doc } from "firebase/firestore";
import { ReactNode, useMemo } from "react";
import { navLinks } from "./BottomNav";

const SidebarNavItem = ({
  Icon,
  label,
  linkTo,
  nested = false,
}: SidebarNavItemProps) => {
  const isActive = useActiveRoute(linkTo);

  return (
    <Link
      to={linkTo}
      className={clsx([
        "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-orange-600 ",
        nested && "ml-4",
        isActive && "text-orange-600 bg-gray-50",
      ])}
    >
      <span
        className={clsx([
          "shrink-0 w-6 h-6 mr-3 text-gray-400 group-hover:text-orange-600",
          isActive && "text-orange-600",
        ])}
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

export const SidebarNav = () => {
  const user = useCurrentUser();
  const userRef = useMemo(
    () => doc(db, "users", user.uid) as DocumentReference<User>,
    [user?.uid],
  );

  const { details: dbUser } = useFirestoreDocRealtime<User>(userRef);
  const secretKey = dbUser?.secretKey ? dbUser.secretKey : null;

  const isLg = useScreenMediaQuery("lg");

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
        ? [navLinks.aiPlayground, navLinks.designLibrary]
        : []),
    ],
    [secretKey],
  );

  return (
    <div className="hidden md:flex md:w-48 md:flex-col md:fixed md:inset-y-0 lg:w-64">
      <div
        className={clsx([
          "flex flex-col px-4 pb-4 overflow-y-auto bg-white border-r border-gray-200 gap-y-5 grow lg:px-6",
        ])}
        style={{
          paddingLeft: `calc(env(safe-area-inset-left) + ${
            isLg ? "1.5rem" : "1rem"
          })`,
        }}
      >
        <div className="flex items-center h-16 shrink-0">Memento logo here</div>
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1 ">
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
            <li className="mt-auto">
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
