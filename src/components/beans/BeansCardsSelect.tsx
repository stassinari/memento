import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import "twin.macro";
import { Beans } from "../../types/beans";
import { getTimeAgo, isNotFrozenOrIsThawed } from "../../util";
import { FormInputRadioCards } from "../form/FormInputRadioCards";
import { Input, labelStyles } from "../Input";
import { InputRadioCardsOption } from "../InputRadioCards";
import { Modal } from "../Modal";
import { Toggle } from "../Toggle";

const toBeansFormValue = (beans: Beans) => `beans/${beans.id ?? ""}`;

const beansRadioOption = (beans: Beans): InputRadioCardsOption => ({
  value: toBeansFormValue(beans),
  left: { top: beans.name, bottom: beans.roaster },
  right: {
    top: beans.roastDate && (
      <React.Fragment>
        Roasted{" "}
        <time dateTime={beans.roastDate?.toDate().toLocaleDateString()}>
          {getTimeAgo(beans.roastDate.toDate())}
        </time>
      </React.Fragment>
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
    return beansList
      .filter(isNotFrozenOrIsThawed)
      .sort((a) => (toBeansFormValue(a) === selectedBeans ? -1 : 1))
      .slice(0, !selectedBeans ? 3 : 1);
  }, [beansList, selectedBeans]);

  const modalBeans = useMemo(() => {
    return beansList
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

  return (
    <div>
      <FormInputRadioCards
        name="beans"
        label="Select beans *"
        options={mainBeans.map(beansRadioOption)}
        requiredMsg="Please select the beans you're using"
        error={formState.errors.beans?.message?.toString()}
      />

      <button
        type="button"
        tw="mt-2 text-sm font-medium text-orange-500 hover:underline"
        onClick={() => setIsModalOpen(true)}
      >
        More...
      </button>

      <Modal open={isModalOpen} handleClose={() => setIsModalOpen(false)}>
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
      </Modal>
    </div>
  );
};
