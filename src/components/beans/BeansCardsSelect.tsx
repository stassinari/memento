import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import "twin.macro";
import { Beans } from "../../types/beans";
import { getTimeAgo } from "../../util";
import { FormInputRadioCards } from "../form/FormInputRadioCards";
import { Input } from "../Input";
import { InputRadioCardsOption } from "../InputRadioCards";
import { Modal } from "../Modal";

const toBeansFormValue = (beans: Beans) => `beans/${beans.id}`;

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
  const [collapseToOne, setCollapseToOne] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedBeans: string = watch("beans");

  const mainBeans = useMemo(() => {
    const sortedBeans = beansList.sort((a, b) =>
      toBeansFormValue(a) === selectedBeans ? -1 : 1
    );
    return collapseToOne ? sortedBeans.slice(0, 1) : sortedBeans.slice(0, 3);
  }, [beansList, collapseToOne, selectedBeans]);

  const modalBeans = searchQuery
    ? beansList.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.origin === "single-origin" &&
            b.country?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : beansList;

  return (
    <div>
      <FormInputRadioCards
        name="beans"
        label="Select beans *"
        options={mainBeans.map(beansRadioOption)}
        requiredMsg="Please select the beans you're using"
        onChange={() => setCollapseToOne(true)}
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
        <div tw="w-full">
          <Input
            type="text"
            tw="mb-3"
            id="beans-radio-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <FormInputRadioCards
            name="beans"
            label="Select beans *"
            options={modalBeans.map(beansRadioOption)}
            onChange={() => {
              setIsModalOpen(false);
              setCollapseToOne(true);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
