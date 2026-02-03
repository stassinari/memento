import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAtomValue } from "jotai";

import clsx from "clsx";
import type { Beans } from "~/db/types";
import { userAtom } from "~/hooks/useInitUser";
import { getTimeAgo } from "~/util";
import { Input, labelStyles } from "../Input";
import { InputRadioCardsOption } from "../InputRadioCards";
import { RadixModal } from "../Modal";
import { Toggle } from "../Toggle";
import { FormInputRadioCards } from "../form/FormInputRadioCards";

const toBeansFormValue = (beans: Beans, uid: string) =>
  `users/${uid}/beans/${beans.fbId ?? ""}`;

// PostgreSQL-specific filter functions
const isNotArchived = (beans: Beans) => !beans.isFinished;

const isNotFrozenOrIsThawed = (beans: Beans) =>
  !beans.freezeDate || !!beans.thawDate;

const beansRadioOption = (beans: Beans, uid: string): InputRadioCardsOption => ({
  value: toBeansFormValue(beans, uid),
  left: { top: beans.name, bottom: beans.roaster },
  right: {
    top: beans.roastDate && (
      <>
        Roasted{" "}
        <time dateTime={new Date(beans.roastDate).toLocaleDateString()}>
          {getTimeAgo(new Date(beans.roastDate))}
        </time>
      </>
    ),
    bottom: beans.origin === "single-origin" ? beans.country : "Blend",
  },
});

interface BeansCardsSelectProps {
  beansList: Beans[];
}

export const BeansCardsSelect = ({ beansList }: BeansCardsSelectProps) => {
  const { watch, formState } = useFormContext();
  const user = useAtomValue(userAtom);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFrozenBeans, setShowFrozenBeans] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedBeans = watch("beans");

  const mainBeans = useMemo(() => {
    if (selectedBeans && user?.uid) {
      // return the only beans to display
      return beansList.filter(
        (b) => selectedBeans === toBeansFormValue(b, user.uid),
      );
    }
    return beansList
      .filter(isNotFrozenOrIsThawed)
      .filter(isNotArchived)
      .slice(0, !selectedBeans ? 3 : 1);
  }, [beansList, selectedBeans, user?.uid]);

  const modalBeans = useMemo(() => {
    return beansList
      .filter(isNotArchived)
      .filter((b) => {
        if (!searchQuery) return b;
        return (
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.origin === "single-origin" &&
            b.country?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
      .filter(showFrozenBeans ? () => true : isNotFrozenOrIsThawed);
  }, [beansList, searchQuery, showFrozenBeans]);

  const showMore = useMemo(() => {
    const shownLength = beansList
      .filter(isNotFrozenOrIsThawed)
      .filter(isNotArchived).length;
    return (!!selectedBeans && shownLength > 1) || shownLength >= 3;
  }, [beansList, selectedBeans]);

  if (!user?.uid) return null;

  return (
    <div>
      <FormInputRadioCards
        name="beans"
        label="Select beans *"
        options={mainBeans.map((b) => beansRadioOption(b, user.uid))}
        requiredMsg="Please select the beans you're using"
        error={formState.errors.beans?.message?.toString()}
      />

      <RadixModal
        triggerSlot={
          <>
            {showMore && (
              <button
                type="button"
                className="mt-2 text-sm font-medium text-orange-500 hover:underline"
                onClick={() => setIsModalOpen(true)}
              >
                More...
              </button>
            )}
          </>
        }
        open={isModalOpen}
        setOpen={setIsModalOpen}
      >
        <div className="w-full space-y-5">
          <div>
            <span className={clsx(labelStyles)}>Filters</span>
            <Input
              type="text"
              className="mt-2 mb-4"
              id="beans-radio-search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Toggle
              label="Show frozen"
              checked={showFrozenBeans}
              onChange={setShowFrozenBeans}
            />
          </div>

          <FormInputRadioCards
            name="beans"
            label="Select beans *"
            options={modalBeans.map((b) => beansRadioOption(b, user.uid))}
            onChange={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      </RadixModal>
    </div>
  );
};
