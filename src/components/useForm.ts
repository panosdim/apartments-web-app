import { useState } from 'react';

const useForm = (callback: () => void) => {
    const [values, setValues] = useState<FormData>({});
    const [errors, setErrors] = useState<FormData>({});

    const handleSubmit = (event: React.FormEvent) => {
        if (event) event.preventDefault();
        if (Object.keys(errors).length === 0) {
            callback();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const el = event.target;
        setValues(values => ({ ...values, [el.name]: el.value }));
        if (!el.validity.valid) {
            setErrors({ ...errors, [el.name]: el.validationMessage });
        } else {
            let { [el.name]: omit, ...res } = errors;
            setErrors(res);
        }
    };

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
    };
};

export type FormData = { [key: string]: string };

export default useForm;
