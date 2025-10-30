import React, { useState } from "react";
import { Input, Select, Textarea, Button } from "./index";

export default function Form({
  fields = [],
  initialValues = {},
  onSubmit,
  submitText = "Submit",
  loading = false,
  className = "",
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // 🔹 Handle input change
  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔹 Validate a single field
  const validateField = (field, value) => {
    if (field.required && !value) {
      return `${field.label || field.name} is required`;
    }

    if (field.minLength && value.length < field.minLength) {
      return `${field.label || field.name} must be at least ${field.minLength} characters`;
    }

    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label || field.name} must be less than ${field.maxLength} characters`;
    }

    if (field.pattern && !field.pattern.test(value)) {
      return `Invalid ${field.label || field.name}`;
    }

    if (field.customValidator) {
      const customError = field.customValidator(value);
      if (customError) return customError;
    }

    return "";
  };

  // 🔹 Validate all fields
  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      const value = values[f.name] || "";
      const errorMsg = validateField(f, value);
      if (errorMsg) newErrors[f.name] = errorMsg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 ${className}`}
    >
      {fields.map((field) => {
        const commonProps = {
            label: field.label,
            placeholder: field.placeholder,
            required: field.required,
            value: values[field.name] || "",
            error: errors[field.name],
            onChange: (e) => handleChange(field.name, e.target.value),
        };

        switch (field.type) {
            case "textarea":
            return (
                <Textarea
                key={field.name}
                {...commonProps}
                rows={field.rows || 4}
                />
            );
            case "select":
            return (
                <Select
                key={field.name}
                {...commonProps}
                options={field.options || []}
                />
            );
            default:
            return (
                <Input
                key={field.name}
                {...commonProps}
                type={field.type || "text"}
                />
            );
        }
        })}

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Submitting..." : submitText}
        </Button>
      </div>
    </form>
  );
}
