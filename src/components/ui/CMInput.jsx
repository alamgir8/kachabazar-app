import { useController } from "react-hook-form";
import { TextInput } from "react-native";

const CMInput = ({
  type,
  name,
  control,
  pattern,
  required,
  placeholder,
  defaultValue,
  disable = true,
}) => {
  const { field } = useController({
    name,
    control: control,
    defaultValue: defaultValue,
    rules: {
      pattern: pattern,
      required: required ? true : false,
    },
  });

  return (
    <TextInput
      editable={disable}
      multiline={true}
      cursorColor={"gray"}
      autoCapitalize="none"
      onBlur={field.onBlur}
      placeholder={placeholder}
      value={`${field.value || ""}`}
      keyboardType={type ? type : "default"}
      onChangeText={(e) => field.onChange(e)}
      className={`block w-full border mt-2 px-3 py-2 h-13 text-sm focus:outline-none rounded-md focus:border-gray-200 border-gray-300 ${
        !disable && "bg-gray-300 border-gray-400"
      }`}
    />
  );
};

export default CMInput;
