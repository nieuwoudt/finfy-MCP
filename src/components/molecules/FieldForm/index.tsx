import { Field, FieldProps } from "@/components/atoms";
import { FC } from "react";

interface FieldFormProps extends FieldProps {}

const FieldForm: FC<FieldFormProps> = (props) => {
  return (
    <Field
      {...props}
      classes={{
        ...props?.classes,
        containerInput: "border-navy-5 border bg-navy-25 rounded-sm",
      }}
    />
  );
};

export { FieldForm };
