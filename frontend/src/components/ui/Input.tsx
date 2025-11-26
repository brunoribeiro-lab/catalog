"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputProps } from "@/types/Input";

const Input: React.FC<InputProps> = ({
    label,
    type = "text",
    id,
    name,
    placeholder,
    value,
    onChange,
    required = false,
    error,
    helperText,
    showPasswordToggle = false,
    className,
    ...rest
}) => {
    const [inputType, setInputType] = useState<string>(type);

    useEffect(() => {
        setInputType(type);
    }, [type]);

    const togglePasswordVisibility = () => {
        setInputType((prev) => (prev === "password" ? "text" : "password"));
    };

    const showToggleButton = type === "password" && showPasswordToggle;
    const hasError = Boolean(error);

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    aria-invalid={hasError}
                    className={`w-full px-3 py-2 border text-gray-200 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${hasError ? "border-red-500 ring-1 ring-red-500" : ""
                        } ${className ?? ""}`}
                    {...rest}
                />

                {showToggleButton && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={inputType === "password" ? "Mostrar senha" : "Ocultar senha"}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-100"
                    >
                        {inputType === "password" ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                )}
            </div>

            {helperText && !hasError && <p className="mt-1 text-xs text-gray-400">{helperText}</p>}

            {hasError && (
                <p className="mt-1 text-xs text-red-400">
                    {typeof error === "string" ? error : "Campo inválido"}
                </p>
            )}
        </div>
    );
};

export default Input;
