# Memento -> Tailwind Plus component mapping (for dark mode)

This is a first-pass map between current components in `src/components` and downloaded Tailwind Plus examples in `tailwind-plus/application-ui`.

Confidence levels:
- `high`: structure/classes closely match a known Tailwind Plus component.
- `medium`: strong family-level match, but with notable customizations.
- `low`: partial resemblance only; likely custom or heavily modified.
- `none`: no meaningful Tailwind Plus source match.

## Core primitives

| Memento component | Tailwind Plus source candidate(s) | Confidence | Notes |
|---|---|---|---|
| `src/components/Button.tsx` | `elements/buttons/primary_buttons.jsx`, `elements/buttons/secondary_buttons.jsx`, `elements/buttons/soft_buttons.jsx` | medium | Same button families/sizing pattern; custom `main/accent` color system and gradients. |
| `src/components/IconButton.tsx` | `elements/buttons/circular_buttons.jsx` | high | Circular icon button variant aligns closely. |
| `src/components/Input.tsx` | `forms/input-groups/input_with_label.jsx`, `forms/input-groups/input_with_label_and_help_text.jsx` | high | Label/input/helper/error composition follows input-group conventions. |
| `src/components/Textarea.tsx` | `forms/textareas/simple.jsx` | high | Same base textarea styling intent; autosize wrapper is custom. |
| `src/components/Toggle.tsx` | `forms/toggles/simple_toggle.jsx`, `forms/toggles/with_right_label.jsx` | high | Headless UI switch pattern and sizing are very close. |
| `src/components/Badge.tsx` | `elements/badges/flat_pill.jsx`, `elements/badges/flat_with_remove_button.jsx`, `elements/badges/flat_pill_with_dot.jsx` | high | Pill + removable icon badge variant matches Tailwind Plus badge set. |
| `src/components/Link.tsx` | N/A | none | Utility wrapper, not a direct Tailwind Plus component. |
| `src/components/Divider.tsx` | `layout/dividers/with_label.jsx`, `layout/dividers/with_title.jsx` | high | Horizontal divider + centered label pattern. |

## Overlays and feedback

| Memento component | Tailwind Plus source candidate(s) | Confidence | Notes |
|---|---|---|---|
| `src/components/Modal.tsx` | `overlays/modal-dialogs/simple_with_dismiss_button.jsx`, `overlays/modal-dialogs/simple_with_gray_footer.jsx` | high | Standard Headless UI dialog structure and transitions from Tailwind Plus patterns. |
| `src/components/Notification.tsx` | `overlays/notifications/simple.jsx`, `overlays/notifications/with_actions_below.jsx` | high | Toast panel layout/classes strongly align; adapted to `react-hot-toast`. |
| `src/components/EmptyState.tsx` | `feedback/empty-states/simple.jsx` | high | Icon + title + description + optional action button pattern. |
| `src/components/ErrorPage.tsx` | likely `feedback/empty-states/*` | low | Needs explicit review; probably custom error-page composition. |

## Navigation and shell

| Memento component | Tailwind Plus source candidate(s) | Confidence | Notes |
|---|---|---|---|
| `src/components/SidebarNav.tsx` | `navigation/sidebar-navigation/light.jsx` | high | Close structural match: logo, grouped nav, active state treatment. |
| `src/components/BottomNav.tsx` | no direct 1:1 in application-ui set | low | Mobile tab bar appears custom (not a standard Tailwind Plus app-ui artifact). |
| `src/components/Breadcrumbs.tsx` | `navigation/breadcrumbs/simple_with_chevrons.jsx` | high | Same chevron + optional home icon approach. |
| `src/components/Layout.tsx` | `application-shells/sidebar/*`, `page-examples/*/sidebar.jsx` | medium | Shell concept from Tailwind Plus, but combined with custom mobile nav/safe-area handling. |
| `src/components/Heading.tsx` | `headings/page-headings/with_actions.jsx`, `headings/page-headings/with_actions_and_breadcrumbs.jsx` | medium | Simplified page heading derived from Tailwind Plus heading patterns. |

## Cards, lists, tables

| Memento component | Tailwind Plus source candidate(s) | Confidence | Notes |
|---|---|---|---|
| `src/components/Card.tsx` | `layout/cards/card_with_header.jsx`, `layout/cards/card_with_footer.jsx`, `layout/cards/card_with_header_and_footer.jsx` | high | Card container/header/footer/description-list pattern is directly aligned. |
| `src/components/ListCard.tsx` | `layout/cards/basic_card.jsx`, `lists/stacked-lists/in_card_with_links.jsx` | medium | Composite abstraction built from card/list patterns. |
| `src/components/DataList.tsx` | `lists/stacked-lists/with_links.jsx`, `layout/list-containers/card_with_dividers.jsx` | medium | Stacked linked rows in a card container; customized metadata rows. |
| `src/components/EquipmentTable.tsx` | `data-display/description-lists/left_aligned.jsx` | medium | Semantically a description list, not a tabular Tailwind Plus table. |
| `src/components/Details.tsx` | inherits `Card` + description-list patterns | high | Thin composition wrapper, no distinct source. |
| `src/components/table/ColumnVisibility.tsx` | `elements/dropdowns/*` (likely) | low | Needs file-level review for exact source. |

## Form controls

| Memento component | Tailwind Plus source candidate(s) | Confidence | Notes |
|---|---|---|---|
| `src/components/InputCheckbox.tsx` | `forms/checkboxes/simple_list_with_heading.jsx` | medium | Single checkbox style from Tailwind Plus checkbox tokens. |
| `src/components/InputRadio.tsx` | `forms/radio-groups/simple_inline_list.jsx`, `forms/radio-groups/simple_list.jsx` | high | Base radio list pattern. |
| `src/components/InputRadioCards.tsx` | `forms/radio-groups/cards.jsx`, `forms/radio-groups/stacked_cards.jsx` | high | Headless UI card-radio pattern closely matches. |
| `src/components/InputRadioButtonGroup.tsx` | `elements/button-groups/basic.jsx` | medium | Button-group semantics adapted to radio selection. |
| `src/components/ButtonWithDropdown.tsx` | `elements/button-groups/with_dropdown.jsx`, `elements/dropdowns/simple.jsx` | high | Split button and dropdown menu closely match. |
| `src/components/Combobox/ComboboxSingle.tsx` | `forms/comboboxes/simple.jsx` | high | Core structure and behavior match Tailwind Plus combobox. |
| `src/components/Combobox/ComboboxMulti.tsx` | `forms/comboboxes/simple.jsx` + custom multi-select/tagging | medium | Tailwind Plus single-combobox pattern extended to multiselect chips. |
| `src/components/Combobox/ComboboxElements.tsx` | `forms/comboboxes/simple.jsx` | high | Shared options/button fragments from same source family. |

## Auth/login

| Memento component | Tailwind Plus source candidate(s) | Confidence | Notes |
|---|---|---|---|
| `src/components/EmailPasswordLogin.tsx` | `forms/sign-in-forms/simple.jsx`, `forms/sign-in-forms/simple_card.jsx` | medium | Form shape and spacing track sign-in examples; integrated with app form primitives. |
| `src/components/GoogleLogin.tsx` | `forms/sign-in-forms/simple.jsx` | low | Mostly custom CTA built on local `Button`. |

## Domain-specific components (mostly custom)

These are primarily application/domain components and should generally inherit dark-mode behavior from primitives above rather than being mapped 1:1 to Tailwind Plus examples:

- `src/components/beans/*`
- `src/components/brews/*`
- `src/components/espresso/*`
- `src/components/drinks/*`
- `src/components/form/*` (wrappers around mapped controls)
- `src/components/icons/*`
- `src/components/Stopwatch.tsx`
- `src/components/ReloadPrompt.tsx`
- `src/components/PoweredByMarkdown.tsx`
- `src/components/ErrorFallback.tsx`
- `src/components/CardSkeleton.tsx`

## Suggested migration order (after mapping)

1. Theme infrastructure and shell: `Layout`, `SidebarNav`, `BottomNav`.
2. Primitive tokens: `Button`, `IconButton`, `Input`, `Textarea`, `Toggle`, `Badge`, `Card`.
3. Overlay/feedback components: `Modal`, `Notification`, `EmptyState`.
4. Complex form controls: combobox/radio/button-group.
5. Domain pages/components, relying on updated primitives.
