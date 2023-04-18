import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

interface Props {
  numberValue?: string;
  onValueChange?: (value: string) => void;
  bits: number;
  minHexValue?: string;
  maxHexValue?: string;
}

const HexTextField: React.FC<Props> = ({
                                         numberValue = '',
                                         onValueChange,
                                         bits,
                                         minHexValue = '0x0',
                                         maxHexValue = `0x${(2 ** bits - 1).toString(16)}`,
                                       }) => {
  const [value, setValue] = useState<string>(numberValue);

  useEffect(() => {
    if (numberValue !== undefined && numberValue !== '') {
      setValue(numberValue);
    }
  }, [numberValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === '') {
      setValue('');
      if (onValueChange) {
        onValueChange('');
      }
    } else if (newValue === '0x') {
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    } else if (newValue.match(/^0x[0-9a-fA-F]*$/)) {
      const intValue = parseInt(newValue, 16);

      if (intValue <= parseInt(maxHexValue, 16)) {
        setValue(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      }
    } else if (newValue.match(/^[0-9a-fA-F]*$/)) {
      const intValue = parseInt(newValue, 16);
      const hexValue = '0x' + newValue;

      if (intValue <= parseInt(maxHexValue, 16)) {
        setValue(hexValue);
        if (onValueChange) {
          onValueChange(hexValue);
        }
      }
    }
  };




  return (
      <TextField
          value={value}
          onChange={handleChange}
          error={
              value !== '' &&
              (value.length > maxHexValue.length || parseInt(value, 16) > parseInt(maxHexValue, 16) || parseInt(value, 16) < parseInt(minHexValue, 16))
          }
          helperText={
            value !== '' &&
            (value.length > maxHexValue.length || parseInt(value, 16) > parseInt(maxHexValue, 16) || parseInt(value, 16) < parseInt(minHexValue, 16))
                ? `Ошибка: введите значение от ${minHexValue.toUpperCase()} до ${maxHexValue.toUpperCase()}`
                : ''
          }
      />
  );
};

export default HexTextField;
