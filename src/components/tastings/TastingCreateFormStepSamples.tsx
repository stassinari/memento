import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Button } from "~/components/Button";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { FormSection } from "~/components/Form";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { FormInput } from "~/components/form/FormInput";
import { FormTextarea } from "~/components/form/FormTextarea";
import { SortableFormCard } from "~/components/form/SortableFormCard";
import { TastingVariable } from "~/db/schema";
import { Beans } from "~/db/types";
import { TastingSetupFormInputs } from "./form-types";
import {
  buildBeansById,
  getEmptySample,
  getBeansSelectGroups,
  groupBeansOptions,
  toNullableString,
} from "./tasting-create-form-utils";

interface TastingCreateFormStepSamplesProps {
  beansList: Pick<Beans, "id" | "name" | "roaster" | "isFrozen" | "roastDate">[];
  isEditMode: boolean;
  isSubmitting?: boolean;
  stepError?: string;
  onBack: () => void;
  onSave: () => void;
}

export const TastingCreateFormStepSamples = ({
  beansList,
  isEditMode,
  isSubmitting = false,
  stepError,
  onBack,
  onSave,
}: TastingCreateFormStepSamplesProps) => {
  const [collapsedSampleIds, setCollapsedSampleIds] = useState<Record<string, boolean>>({});
  const [pendingRemoval, setPendingRemoval] = useState<{ fieldId: string; label: string } | null>(null);
  const fallbackSampleOrderByIdRef = useRef<Record<string, number>>({});
  const nextFallbackSampleOrderRef = useRef(1);

  const { control, register } = useFormContext<TastingSetupFormInputs>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "samples",
    keyName: "fieldId",
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const variable = useWatch({ control, name: "variable" });
  const samples = useWatch({ control, name: "samples" }) ?? [];

  const beansById = useMemo(() => buildBeansById(beansList), [beansList]);
  const groupedBeansOptions = useMemo(() => groupBeansOptions(beansList), [beansList]);

  const selectedBeanIds = samples
    .map((sample) => sample.variableValueBeansId)
    .filter((value): value is string => Boolean(value));
  const shouldShowCollapseAll = fields.some((field) => collapsedSampleIds[field.fieldId] !== true);

  useEffect(() => {
    fields.forEach((field) => {
      if (!fallbackSampleOrderByIdRef.current[field.fieldId]) {
        fallbackSampleOrderByIdRef.current[field.fieldId] = nextFallbackSampleOrderRef.current++;
      }
    });
  }, [fields]);

  const getSampleDisplayTitle = (index: number, fieldId?: string): string => {
    const sample = samples[index];
    if (sample) {
      if (variable === TastingVariable.Beans) {
        if (sample.variableValueBeansId) {
          const beanLabel = beansById.get(sample.variableValueBeansId);
          if (beanLabel) return beanLabel;
        }
      } else {
        const variableValue = toNullableString(sample.variableValueText);
        if (variableValue) return variableValue;
      }
    }

    const stableOrder = fieldId ? fallbackSampleOrderByIdRef.current[fieldId] : undefined;
    return `Sample #${stableOrder ?? index + 1}`;
  };

  const addSample = () => {
    append(getEmptySample(fields.length));
  };

  const removeSample = (index: number) => {
    if (fields.length <= 2) return;

    const removedId = fields[index]?.fieldId;
    remove(index);
    if (removedId) {
      setCollapsedSampleIds((current) => {
        const next = { ...current };
        delete next[removedId];
        return next;
      });
    }
  };

  const requestRemoveSample = (index: number) => {
    if (fields.length <= 2) return;
    const fieldId = fields[index]?.fieldId;
    if (!fieldId) return;

    const hasPersistedSample = isEditMode && Boolean(samples[index]?.id);
    if (!hasPersistedSample) {
      removeSample(index);
      return;
    }

    setPendingRemoval({
      fieldId,
      label: getSampleDisplayTitle(index, fieldId),
    });
  };

  const confirmRemoveSample = () => {
    if (!pendingRemoval) return;

    const index = fields.findIndex((field) => field.fieldId === pendingRemoval.fieldId);
    if (index >= 0) {
      removeSample(index);
    }
    setPendingRemoval(null);
  };

  const handleSamplesDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.fieldId === active.id);
    const newIndex = fields.findIndex((field) => field.fieldId === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    move(oldIndex, newIndex);
  };

  const toggleSampleCollapse = (id: string) => {
    setCollapsedSampleIds((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const toggleAllSampleCards = () => {
    if (shouldShowCollapseAll) {
      const collapsedAll: Record<string, boolean> = {};
      fields.forEach((field) => {
        collapsedAll[field.fieldId] = true;
      });
      setCollapsedSampleIds(collapsedAll);
      return;
    }

    setCollapsedSampleIds((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field.fieldId] = false;
      });
      return next;
    });
  };

  return (
    <>
      <FormSection
        title="Samples"
        subtitle="Define samples and what changes between them. Note: a tasting needs at least two samples."
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">{fields.length} samples</p>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="white"
              colour="accent"
              size="sm"
              onClick={toggleAllSampleCards}
            >
              {shouldShowCollapseAll ? <ArrowsPointingInIcon /> : <ArrowsPointingOutIcon />}
              <span className="sr-only">
                {shouldShowCollapseAll ? "Collapse all samples" : "Expand all samples"}
              </span>
              <span className="hidden md:inline">
                {shouldShowCollapseAll ? "Collapse all" : "Expand all"}
              </span>
            </Button>
            <Button type="button" variant="white" colour="accent" size="sm" onClick={addSample}>
              <PlusIcon />
              <span className="sr-only">Add sample</span>
              <span className="hidden md:inline">Add sample</span>
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
          onDragEnd={handleSamplesDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.fieldId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {fields.map((field, index) => {
                const currentSample = samples[index];
                const isLockedSampleValue = isEditMode && Boolean(currentSample?.id);

                return (
                  <SortableFormCard
                    key={field.fieldId}
                    id={field.fieldId}
                    title={getSampleDisplayTitle(index, field.fieldId)}
                    canRemove={fields.length > 2}
                    onRemove={() => requestRemoveSample(index)}
                    isCollapsed={collapsedSampleIds[field.fieldId] ?? false}
                    onToggleCollapse={() => toggleSampleCollapse(field.fieldId)}
                  >
                    {variable === TastingVariable.Beans ? (
                      isLockedSampleValue ? (
                        <FormInput
                          label="Beans"
                          id={`samples.${index}.variableValueBeansId`}
                          inputProps={{
                            value: currentSample?.variableValueBeansId
                              ? (beansById.get(currentSample.variableValueBeansId) ?? "Unknown beans")
                              : "",
                            disabled: true,
                            readOnly: true,
                          }}
                        />
                      ) : (
                        <div>
                          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Beans *
                          </p>
                          <div className="mt-1">
                            <Controller
                              control={control}
                              name={`samples.${index}.variableValueBeansId` as const}
                              render={({ field: beansField }) => (
                                <Select
                                  id={`samples.${index}.variableValueBeansId`}
                                  value={beansField.value}
                                  onChange={(nextValue) => beansField.onChange(nextValue)}
                                  emptyOptionLabel="Select beans"
                                  groups={getBeansSelectGroups({
                                    groupedBeansOptions,
                                    selectedBeanIds,
                                    currentBeansId: currentSample?.variableValueBeansId ?? null,
                                  })}
                                />
                              )}
                            />
                          </div>
                        </div>
                      )
                    ) : (
                      <>
                        {isLockedSampleValue ? (
                          <FormInput
                            label="Variable value"
                            id={`samples.${index}.variableValueText`}
                            inputProps={{
                              value: currentSample?.variableValueText ?? "",
                              disabled: true,
                              readOnly: true,
                            }}
                          />
                        ) : (
                          <FormInput
                            label="Variable value *"
                            id={`samples.${index}.variableValueText`}
                            inputProps={{
                              ...register(`samples.${index}.variableValueText` as const),
                            }}
                          />
                        )}
                      </>
                    )}

                    <div className="mt-3">
                      <FormTextarea
                        label="Sample note"
                        id={`samples.${index}.note`}
                        textareaProps={{ ...register(`samples.${index}.note` as const) }}
                      />
                    </div>
                  </SortableFormCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
        {stepError && <Input.Error>{stepError}</Input.Error>}
      </FormSection>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="white" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="primary" colour="accent" onClick={onSave}>
          {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Save setup"}
        </Button>
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remove sample?"
        description={
          pendingRemoval
            ? `${pendingRemoval.label} already has scoring data. If you save setup after removing it, all associated scoring will be permanently deleted.`
            : ""
        }
        confirmLabel="Remove sample"
        cancelLabel="Keep sample"
        onCancel={() => setPendingRemoval(null)}
        onConfirm={confirmRemoveSample}
      />
    </>
  );
};
