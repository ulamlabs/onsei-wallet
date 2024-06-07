import { Column } from "../layout";
import OptionGroup from "./OptionGroup";
import Radio from "./Radio";

type RadioGroupProps<T extends string> = {
  options: { name: T; description?: string; subtitle?: string }[];
  activeOption: T;
  onChange: (option: T) => void;
};

export default function RadioGroup<T extends string>({
  options,
  activeOption,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <Column>
      <OptionGroup>
        {options.map((option) => (
          <Radio
            key={option.name}
            title={option.name}
            subtitle={option.subtitle}
            description={option.description}
            isActive={activeOption === option.name}
            onPress={() => onChange(option.name)}
          />
        ))}
      </OptionGroup>
    </Column>
  );
}
