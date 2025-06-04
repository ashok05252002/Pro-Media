import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectFormInput = ({ label, value, onChange, options, fullWidth = true }) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-select-label`}
        id={`${label}-select`}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.website}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFormInput;
