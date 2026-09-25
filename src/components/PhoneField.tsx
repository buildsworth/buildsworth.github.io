import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PhoneField() {
  const [value, setValue] = useState<string | undefined>();

  return (
    <label className="field field--phone">
      <span>Phone</span>
      <PhoneInput
        international
        defaultCountry="IN"
        countryCallingCodeEditable={false}
        value={value}
        onChange={setValue}
        numberInputProps={{
          name: "phone",
          required: true,
          autoComplete: "tel",
          inputMode: "tel" as const,
        }}
        className="phone-input"
      />
    </label>
  );
}
