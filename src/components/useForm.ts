import { useState } from 'react';

export const useForm = (callback: () => void) => {
    const [values, setValues] = useState<FormData>({});
    const [errors, setErrors] = useState<FormData>({});
    const [formRef, setRef] = useState<React.Ref<HTMLFormElement>>(null);

    const handleSubmit = (event: React.FormEvent) => {
        if (event) event.preventDefault();
        let form = (formRef as unknown) as HTMLFormElement;
        let tempErrors: FormData = {};

        if (formRef && !form.checkValidity()) {
            form.querySelectorAll(':invalid').forEach(element => {
                const el = element as HTMLInputElement;
                if (!el.validity.valid) {
                    tempErrors = { ...tempErrors, [el.name]: el.validationMessage };
                } else {
                    let { [el.name]: omit, ...res } = tempErrors;
                    tempErrors = res;
                }
            });
            setErrors(tempErrors);
        }

        if (Object.keys(tempErrors).length === 0) {
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
        setValues,
        setErrors,
        setRef,
    };
};

export type FormData = { [key: string]: string };
