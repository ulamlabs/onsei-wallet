import { Column } from "../layout";
import Radio from "./Radio";

type RadioGroupProps<T extends string> = {
  options: T[];
  activeOption: T;
  onChange: (option: T) => void;
};

export default function RadioGroup<T extends string>({
  options,
  activeOption,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <Column style={{ padding: 10 }}>
      {options.map((option) => (
        <Radio
          key={option}
          label={option}
          isActive={activeOption === option}
          onPress={() => onChange(option)}
        />
      ))}
    </Column>
  );
}
