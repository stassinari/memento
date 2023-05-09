import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import "twin.macro";
import { Beans } from "../../types/beans";
import { getTimeAgo, isNotArchived, isNotFrozenOrIsThawed } from "../../util";
import { Input, labelStyles } from "../Input";
import { InputRadioCardsOption } from "../InputRadioCards";
import { RadixModal } from "../Modal";
import { Toggle } from "../Toggle";
import { FormInputRadioCards } from "../form/FormInputRadioCards";

const toBeansFormValue = (beans: Beans) => `beans/${beans.id ?? ""}`;

const beansRadioOption = (beans: Beans): InputRadioCardsOption => ({
  value: toBeansFormValue(beans),
  left: { top: beans.name, bottom: beans.roaster },
  right: {
    top: beans.roastDate && (
      <>
        Roasted{" "}
        <time dateTime={beans.roastDate?.toDate().toLocaleDateString()}>
          {getTimeAgo(beans.roastDate.toDate())}
        </time>
      </>
    ),
    bottom: beans.origin === "single-origin" ? beans.country : "Blend",
  },
});

interface BeansCardsSelectProps {
  beansList: Beans[];
}

export const BeansCardsSelect: React.FC<BeansCardsSelectProps> = ({
  beansList,
}) => {
  const { watch, formState } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFrozenBeans, setShowFrozenBeans] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedBeans = watch("beans");

  const mainBeans = useMemo(() => {
    if (selectedBeans) {
      // return the only beans to display
      return beansList.filter((b) => selectedBeans === toBeansFormValue(b));
    }
    return beansList
      .filter(isNotFrozenOrIsThawed)
      .filter(isNotArchived)
      .slice(0, !selectedBeans ? 3 : 1);
  }, [beansList, selectedBeans]);

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

  return (
    <div>
      <FormInputRadioCards
        name="beans"
        label="Select beans *"
        options={mainBeans.map(beansRadioOption)}
        requiredMsg="Please select the beans you're using"
        error={formState.errors.beans?.message?.toString()}
      />

      <RadixModal
        triggerSlot={
          <>
            {showMore && (
              <button
                type="button"
                tw="mt-2 text-sm font-medium text-orange-500 hover:underline"
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
        <div tw="w-full space-y-5">
          <div>
            <span css={labelStyles}>Filters</span>
            <Input
              type="text"
              tw="mt-2 mb-4"
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
            options={modalBeans.map(beansRadioOption)}
            onChange={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
      </RadixModal>
    </div>
  );
};
