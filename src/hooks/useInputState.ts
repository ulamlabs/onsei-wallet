import { useCallback, useState } from "react";

export type DropdownItem = {
  label: string;
  value: string;
};

type InputProps = {
  initialValue?: string;
  autoCompleteData?: DropdownItem[] | null;
};

export type InputHookResponse = {
  value: string;
  suggestions: DropdownItem[] | null;
  onChangeText: (query: string) => void;
  onSelect: (index: number) => void;
};

export const useInputState = (props: InputProps = {}): InputHookResponse => {
  const [value, setValue] = useState(props.initialValue ?? "");
  const [suggestions, setSuggestions] = useState(
    props.autoCompleteData ?? null,
  );

  const onChangeText = useCallback((query: string) => {
    setValue(query);
    if (props.autoCompleteData) {
      setSuggestions(
        props.autoCompleteData.filter(
          (data) =>
            data.label.toLowerCase().includes(query.toLowerCase()) ||
            data.value.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }
  }, []);

  const onSelect = useCallback(
    (index: number) => {
      if (suggestions) {
        onChangeText(suggestions[index].value);
      }
    },
    [suggestions],
  );

  return { value, suggestions, onChangeText, onSelect };
};
