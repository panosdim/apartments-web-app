import React, { useState, useEffect } from 'react';
import { Intent, Button, Classes, Dialog, FormGroup, InputGroup } from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';
import { AppToaster, useForm } from '.';
import { DateInput } from '@blueprintjs/datetime';
import { LesseeType } from '../model';
import { format } from './dateUtils';

interface Props {
    isShowing: boolean;
    hide: () => void;
    isNew: boolean;
    onFinish: (lessee: LesseeType) => void;
}

export const LesseesForm: React.FC<Props> = (props: Props) => {
    const { isShowing, hide, isNew, onFinish } = props;
    const [isLoading, setLoading] = useState(false);
    const [selectedLessee] = useGlobal('selectedLessee');
    const { values, errors, handleChange, checkValidity, setValues, setErrors, setRef } = useForm();
    const lesseeFormRef = setRef as React.Ref<HTMLFormElement>;
    const [from, setFrom] = useState<Date | null>(null);
    const [until, setUntil] = useState<Date | null>(null);
    const [fromError, setFromError] = useState<String | null>(null);
    const [untilError, setUntilError] = useState<String | null>(null);
    const [fromIntent, setFromIntent] = useState<Intent>(Intent.NONE);
    const [untilIntent, setUntilIntent] = useState<Intent>(Intent.NONE);

    useEffect(() => {
        if (isNew) {
            setValues({ name: '', address: '', postalCode: '', from: '', until: '' });
            setFrom(null);
            setUntil(null);
            setErrors({});
        } else {
            if (selectedLessee) {
                setValues({
                    name: selectedLessee.name,
                    address: selectedLessee.address,
                    postalCode: selectedLessee.postalCode,
                });

                setFrom(new Date(selectedLessee.from));
                setUntil(new Date(selectedLessee.until));
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLessee, isNew]);

    const handleSubmit = () => {
        if (!checkValidity() || !from || !until) {
            // Check validity of Date inputs
            if (!from) {
                setFromError('Please fill out this field.');
                setFromIntent(Intent.DANGER);
            }
            if (!until) {
                setUntilError('Please fill out this field.');
                setUntilIntent(Intent.DANGER);
            }
            return;
        }

        setLoading(true);
        const method = isNew ? 'post' : 'put';
        const url = isNew ? 'lessee' : `lessee/${selectedLessee.id}`;

        // Check if values changed
        if (!isNew) {
            if (
                selectedLessee.name === values.name &&
                selectedLessee.address === values.address &&
                selectedLessee.postalCode === values.postalCode &&
                selectedLessee.from === values.from &&
                selectedLessee.until === values.until
            ) {
                setLoading(false);
                handleClose();
                return;
            }
        }

        axios({
            method: method,
            url: url,
            data: values,
        })
            .then(response => {
                setLoading(false);
                onFinish(response.data);
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Lessee saved successfully.',
                });
                handleClose();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setLoading(false);
                    setGlobal({ isLoggedIn: false });
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: error.response.data.error,
                    });
                } else {
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: 'Fail to save Lessee',
                    });
                    setLoading(false);
                }
            });
    };

    const handleClose = () => {
        hide();
        setValues({ name: '', address: '', postalCode: '', from: '', until: '' });
        setFrom(null);
        setUntil(null);
        setFromError(null);
        setUntilError(null);
        setFromIntent(Intent.NONE);
        setUntilIntent(Intent.NONE);
        setErrors({});
    };

    return (
        <Dialog
            icon='info-sign'
            onClose={handleClose}
            title={isNew ? 'Add New Lessee' : 'Edit Selected Lessee'}
            autoFocus={true}
            canEscapeKeyClose={true}
            canOutsideClickClose={true}
            enforceFocus={true}
            isOpen={isShowing}
            usePortal={true}
        >
            <div className={Classes.DIALOG_BODY}>
                <form noValidate ref={lesseeFormRef}>
                    <FormGroup
                        label='Name'
                        labelFor='name-input'
                        labelInfo='(required)'
                        helperText={errors.name}
                        intent={errors.name ? Intent.DANGER : values.name ? Intent.SUCCESS : Intent.NONE}
                    >
                        <InputGroup
                            id='name-input'
                            name='name'
                            placeholder='Name'
                            onChange={handleChange}
                            value={values.name || ''}
                            intent={errors.name ? Intent.DANGER : values.name ? Intent.SUCCESS : Intent.NONE}
                            required
                        />
                    </FormGroup>

                    <FormGroup
                        label='Address'
                        labelFor='address-input'
                        labelInfo='(required)'
                        helperText={errors.address}
                        intent={errors.address ? Intent.DANGER : values.address ? Intent.SUCCESS : Intent.NONE}
                    >
                        <InputGroup
                            id='address-input'
                            name='address'
                            placeholder='Address'
                            onChange={handleChange}
                            value={values.address || ''}
                            intent={errors.address ? Intent.DANGER : values.address ? Intent.SUCCESS : Intent.NONE}
                            required
                        />
                    </FormGroup>

                    <FormGroup
                        label='Postal Code'
                        labelFor='postal-code-input'
                        labelInfo='(required)'
                        helperText={errors.postalCode}
                        intent={errors.postalCode ? Intent.DANGER : values.postalCode ? Intent.SUCCESS : Intent.NONE}
                    >
                        <InputGroup
                            id='postal-code-input'
                            name='postalCode'
                            placeholder='Postal Code'
                            onChange={handleChange}
                            value={values.postalCode || ''}
                            intent={
                                errors.postalCode ? Intent.DANGER : values.postalCode ? Intent.SUCCESS : Intent.NONE
                            }
                            required
                        />
                    </FormGroup>

                    <FormGroup
                        label='Rent From'
                        labelInfo='(required)'
                        helperText={fromError}
                        intent={fromError ? Intent.DANGER : from ? Intent.SUCCESS : Intent.NONE}
                    >
                        <DateInput
                            placeholder='Rent From'
                            formatDate={format}
                            onChange={selectedDate => {
                                setFrom(selectedDate);
                                setFromIntent(selectedDate ? Intent.SUCCESS : Intent.NONE);
                                setFromError(null);
                            }}
                            parseDate={str => new Date(str)}
                            inputProps={{ intent: fromIntent }}
                            value={from}
                        />
                    </FormGroup>

                    <FormGroup
                        label='Rent Until'
                        labelFor='rent-until-input'
                        labelInfo='(required)'
                        helperText={untilError}
                        intent={untilError ? Intent.DANGER : until ? Intent.SUCCESS : Intent.NONE}
                    >
                        <DateInput
                            placeholder='Rent Until'
                            formatDate={format}
                            onChange={selectedDate => {
                                setUntil(selectedDate);
                                setUntilIntent(selectedDate ? Intent.SUCCESS : Intent.NONE);
                                setUntilError(null);
                            }}
                            inputProps={{ intent: untilIntent }}
                            parseDate={str => new Date(str)}
                            value={until}
                        />
                    </FormGroup>
                </form>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        icon='floppy-disk'
                        intent={Intent.PRIMARY}
                        loading={isLoading}
                        text='Save'
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Dialog>
    );
};
