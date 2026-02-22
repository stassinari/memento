import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import clsx from "clsx";
import { getSelectableBeans } from "~/db/queries";
import { getTimeAgo } from "~/util";
import { Input, labelStyles } from "../Input";
import { InputRadioCardsOption } from "../InputRadioCards";
import { RadixModal } from "../Modal";
import { Toggle } from "../Toggle";
import { FormInputRadioCards } from "../form/FormInputRadioCards";

type BeansForSelect = NonNullable<
  Awaited<ReturnType<typeof getSelectableBeans>>
>[0];

const beansRadioOption = (beans: BeansForSelect): InputRadioCardsOption => ({
  value: beans.id,
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
  beansList: BeansForSelect[];
  existingBeans?: BeansForSelect;
}

export const BeansCardsSelect = ({
  beansList,
  existingBeans,
}: BeansCardsSelectProps) => {
  console.log("BeansCardsSelect with no memos!");

  const { watch, formState } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFrozenBeans, setShowFrozenBeans] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedBeans = watch("beans") as string | null;

  const quickSelectBeans = useMemo(() => {
    if (selectedBeans && beansList.some((b) => b.id === selectedBeans)) {
      // if there's a selected beans and it's in the list, show only that one
      return beansList.filter((b) => selectedBeans === b.id);
    } else if (selectedBeans && existingBeans) {
      // if there's a selected beans but it's not in the list, it means it's archived, so show the archived one
      return [
        {
          id: existingBeans.id,
          name: existingBeans.name,
          roaster: existingBeans.roaster,
          roastDate: existingBeans.roastDate,
          origin: existingBeans.origin,
          country: existingBeans.country,
          isArchived: existingBeans.isArchived,
          isFrozen: existingBeans.isFrozen,
          isOpen: existingBeans.isOpen,
        },
      ];
    }
    return beansList.filter((b) => b.isOpen).slice(0, 3);
  }, [beansList, selectedBeans, existingBeans]);

  const modalBeans = beansList
    .filter((b) => {
      if (!searchQuery) return b;
      return (
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.origin === "single-origin" &&
          b.country?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .filter((b) => b.isFrozen === showFrozenBeans);

  const showMore = quickSelectBeans?.length !== beansList.length;

  return (
    <div>
      <FormInputRadioCards
        name="beans"
        label="Select beans *"
        options={quickSelectBeans.map((b) => beansRadioOption(b))}
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
            options={modalBeans.map((b) => beansRadioOption(b))}
            onChange={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      </RadixModal>
    </div>
  );
};
