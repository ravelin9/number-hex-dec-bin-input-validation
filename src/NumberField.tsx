import TextField from "@mui/material/TextField";
import _ from "lodash"
import {TextFieldProps} from "@mui/material";
import React, {useState} from "react";

interface NumberFieldProps extends Omit<TextFieldProps, "value" | "onChange"> {
    numberValue: string | number | undefined;
    onValueChange: (value: any) => void;
    minValue?: number;
    maxValue?: number;
    bits?: number;
    floating?: boolean;
    signed?: boolean
}


const NumberField: React.FC<NumberFieldProps> = ({
                                                     numberValue,
                                                     onValueChange,
                                                     minValue,
                                                     maxValue,
                                                     bits,
                                                     floating,
                                                     signed = true,
                                                     ...props
                                                 }) => {
    const [inputValue, setInputValue] = useState<string | undefined>(
        numberValue === undefined
            ? numberValue
            : numberValue.toString()
    );
    const [error, setError] = useState("")
    //RegEx для классификации ошибок валидации
    // Вместо вычисления isHex и.т.д можно это делать в if else выражении, будет меньше операций выполняться
    const isHex = !_.isUndefined(inputValue) && inputValue.toLowerCase().startsWith("0x");
    const isBinary = !_.isUndefined(inputValue) && inputValue.toLowerCase().startsWith("0b");
    const BINARY_REGEX = /^[01]*$/;
    const HEX_REGEX = /^[0-9a-fA-F]*$/;
    const DECIMAL_REGEX = /^(-?\d*)(,\d*)?$/

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        let value: string | undefined = undefined;

        const inputWithDots = inputValue.replace(".", ",");

        if (_.isEmpty(inputWithDots)) {
            setInputValue("");
            setError("Введите значение")
            onValueChange(undefined);
            return;
        }

        if (!signed && inputValue.indexOf("-") >= 0) {
            onValueChange(undefined);
            setError("Отрицательные числа не поддерживаются");
            setInputValue(inputValue.replace("-", ""));
            return;
        }

        if (!floating && (inputValue.indexOf(",") >= 0 || inputValue.indexOf(".") >= 0)) {
            onValueChange(undefined);
            setError("Дробные числа не поддерживаются");
            setInputValue(inputValue.replace(",", "").replace(".", ""));
            return;
        }

        if (isHex && inputWithDots.length > 2) {
            if (!HEX_REGEX.test(inputWithDots.substring(2))) {
                onValueChange(undefined);
                setError("Введите значение в шестнадцатеричном формате")
                setInputValue(inputWithDots);
                return;
            }

            value = "0x" + inputWithDots.substring(2);
        } else if (isBinary && inputWithDots.length > 2) {
            if (!BINARY_REGEX.test(inputWithDots.substring(2))) {
                onValueChange(undefined);
                setError("Введите значение в двоичном формате")
                setInputValue(inputWithDots);
                return
            }

            value = "0b" + inputWithDots.substring(2);
        } else if (DECIMAL_REGEX.test(inputWithDots)) {
            value = inputWithDots;
        } else if (inputWithDots.toLowerCase() === "0x" || inputWithDots.toLowerCase() === "0b") {
            setError("")
            onValueChange(undefined);
            setInputValue(inputWithDots);
        }

        else {
            // invalid input
            onValueChange(undefined);
            setError("Введите значение в двоичном, десятичном или шестнадцатеричном формате")
            setInputValue(inputWithDots);
            return;
        }

        const numericValue = Number(value);

        if (
            (!_.isUndefined(minValue) && numericValue < minValue) ||
            (!_.isUndefined(maxValue) && numericValue > maxValue) ||
            (!_.isUndefined(bits) && bits % 4 !== 0) ||
            (!_.isUndefined(bits) && Math.abs(numericValue) >= 2 ** (bits - (signed ? 1 : 0)))
        ) {
            onValueChange(undefined);
            setError(`Значение должно быть от ${minValue} до ${maxValue}`)
            setInputValue(inputWithDots);
            return;
        }

        if (isNaN(numericValue)) {
            setError("")
            onValueChange(inputWithDots.replace(",", "."))
            setInputValue(inputWithDots)
            return;
        }

        onValueChange(value);
        setError("")
        setInputValue(isHex || isBinary ? inputValue : numericValue.toString());
    };

    return (
        <TextField
            {...props}
            error={Boolean(error)}
            value={_.isEmpty(inputValue) ? !_.isNumber(numberValue) ? _.stubString() : numberValue : inputValue}
            onChange={handleInputChange}
        />
    );
};

export default NumberField;