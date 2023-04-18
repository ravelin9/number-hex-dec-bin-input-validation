import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import IntegerTextField from './NumberField';
import HexTextField from './HexTextField';
import NumberField from "./NumberField";

interface Props {
  numberValue?: any;
  onValueChange: (value: any) => void;
  bits: number;
  minHexValue?: string;
  maxHexValue?: string;
}

const TextFieldSelector: React.FC<Props> = ({
                                              numberValue = '',
                                              onValueChange,
                                              bits,
                                              minHexValue = '0x0',
                                              maxHexValue = `0x${(2 ** bits - 1).toString(16)}`,
                                            }) => {
  const [inputType, setInputType] = useState('dec');

  const handleInputChange = (event: { target: { value: string; }; }) => {
    setInputType(event.target.value as string);
  };

  return (
    <div>
      <FormControl>
        <InputLabel id="input-type-select-label">Input Type</InputLabel>
        <Select
          labelId="input-type-select-label"
          id="input-type-select"
          value={inputType}
          label="Input Type"
          onChange={handleInputChange}
          sx={{width: 120}}
        >
          <MenuItem value="num">Hex/Dec</MenuItem>
          <MenuItem value="hex">Hex</MenuItem>
        </Select>
      </FormControl>

      {inputType === 'num' ? (
        <NumberField bits={64} signed={false} floating={true} minValue={-999} maxValue={9999} numberValue={numberValue} onValueChange={onValueChange} />
      ) : (
        <HexTextField
          numberValue={numberValue}
          onValueChange={onValueChange}
          bits={bits}
          minHexValue={minHexValue}
          maxHexValue={maxHexValue}
        />
      )}
    </div>
  );
};

export default TextFieldSelector;
