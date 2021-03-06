import React, { useState, useEffect } from 'react';
import {
    Intent,
    Button,
    Classes,
    Dialog,
    FormGroup,
    InputGroup,
    NumericInput,
    H5,
    Popover,
    Position,
} from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';
import { AppToaster, useForm } from '.';
import { DateInput } from '@blueprintjs/datetime';
import { BalanceType } from '../model';
import { format, toMySQLDateString, now } from './dateUtils';

interface Props {
    isShowing: boolean;
    hide: () => void;
    isNew: boolean;
    onFinish: (balance: BalanceType) => void;
}

export const BalanceForm: React.FC<Props> = (props: Props) => {
    const { isShowing, hide, isNew, onFinish } = props;
    const [isLoading, setLoading] = useState(false);
    const [selectedBalance] = useGlobal('selectedBalance');
    const [allBalance, setAllBalance] = useGlobal('allBalance');
    const [selectedFlat] = useGlobal('selectedFlat');
    const { values, errors, handleChange, checkValidity, setValues, setErrors, setRef } = useForm();
    const balanceFormRef = setRef as React.Ref<HTMLFormElement>;
    const [date, setDate] = useState<Date>(now);
    const [dateError, setDateError] = useState<string | null>(null);
    const [dateIntent, setDateIntent] = useState<Intent>(Intent.NONE);

    useEffect(() => {
        if (isNew) {
            setValues({ amount: '', comment: '' });
            setErrors({});
            setDate(now);
            setDateIntent(Intent.NONE);
        } else {
            if (selectedBalance) {
                setValues({
                    amount: selectedBalance.amount,
                    comment: selectedBalance.comment,
                });

                setDate(new Date(selectedBalance.date));
                setDateIntent(Intent.SUCCESS);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBalance, isNew, isShowing]);

    const handleSubmit = () => {
        if (!checkValidity() || !date) {
            // Check validity of Date inputs
            if (!date) {
                setDateError('Please fill out this field.');
                setDateIntent(Intent.DANGER);
            }
            return;
        }

        setLoading(true);
        const method = isNew ? 'post' : 'put';
        const url = isNew ? 'balance' : `balance/${selectedBalance.id}`;
        const data: Partial<BalanceType> = { ...values };

        // Check if values changed
        if (!isNew) {
            if (
                selectedBalance.date === toMySQLDateString(date) &&
                selectedBalance.amount === Number(values.amount) &&
                selectedBalance.comment === values.comment
            ) {
                setLoading(false);
                handleClose();
                return;
            }
        } else {
            data.flat_id = selectedFlat.id;
        }

        data.date = toMySQLDateString(date);

        axios({
            method,
            url,
            data,
        })
            .then((response) => {
                setLoading(false);
                onFinish(response.data);
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Balance saved successfully.',
                });
                handleClose();
            })
            .catch((error) => {
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
                        message: 'Fail to save Balance',
                    });
                    setLoading(false);
                }
            });
    };

    const handleClose = () => {
        hide();
        setValues({ amount: '', comment: '' });
        setDate(now);
        setDateError(null);
        setDateIntent(Intent.NONE);
        setErrors({});
    };

    const handleValueChange = (_valueAsNumber: number, valueAsString: string) => {
        setValues({ ...values, amount: valueAsString });
        if (valueAsString) {
            const { amount: omit, ...res } = errors;
            setErrors(res);
        } else {
            setErrors({ ...errors, amount: 'Please fill out this field.' });
        }
    };

    const deleteBalance = () => {
        setLoading(true);
        axios
            .delete(`balance/${selectedBalance.id}`)
            .then(() => {
                setAllBalance(allBalance.filter((bal) => bal.id !== selectedBalance.id));
                setLoading(false);

                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Balance deleted successfully.',
                });

                handleClose();
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setGlobal({ isLoggedIn: false });
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: error.response.data.error,
                    });
                } else {
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: 'Fail to delete Balance',
                    });
                }
            });
    };

    const popoverContent = (
        <div key='text'>
            <H5>Confirm deletion</H5>
            <p>Are you sure you want to delete selected balance? You won't be able to recover it.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS} onClick={deleteBalance}>
                    Delete
                </Button>
            </div>
        </div>
    );

    return (
        <Dialog
            icon='info-sign'
            onClose={handleClose}
            title={isNew ? 'Add New Balance' : 'Edit Selected Balance'}
            autoFocus={true}
            canEscapeKeyClose={true}
            canOutsideClickClose={true}
            enforceFocus={true}
            isOpen={isShowing}
            usePortal={true}
        >
            <div className={Classes.DIALOG_BODY}>
                <form noValidate ref={balanceFormRef}>
                    <FormGroup
                        label='Date'
                        labelInfo='(required)'
                        helperText={dateError}
                        intent={dateError ? Intent.DANGER : date ? Intent.SUCCESS : Intent.NONE}
                    >
                        <DateInput
                            placeholder='Date'
                            formatDate={format}
                            onChange={(selectedDate) => {
                                setDate(selectedDate);
                                setDateIntent(selectedDate ? Intent.SUCCESS : Intent.NONE);
                                setDateError(null);
                            }}
                            parseDate={(str) => new Date(str)}
                            inputProps={{ intent: dateIntent }}
                            value={date}
                        />
                    </FormGroup>

                    <FormGroup
                        label='Amount'
                        labelFor='amount-input'
                        labelInfo='(required)'
                        helperText={errors.amount}
                        intent={errors.amount ? Intent.DANGER : values.amount ? Intent.SUCCESS : Intent.NONE}
                    >
                        <NumericInput
                            id='amount-input'
                            name='amount'
                            placeholder='Amount'
                            leftIcon='euro'
                            selectAllOnFocus={true}
                            onValueChange={handleValueChange}
                            value={values.amount || ''}
                            intent={errors.amount ? Intent.DANGER : values.amount ? Intent.SUCCESS : Intent.NONE}
                            required
                        />
                    </FormGroup>

                    <FormGroup
                        label='Comment'
                        labelFor='comment-input'
                        labelInfo='(required)'
                        helperText={errors.comment}
                        intent={errors.comment ? Intent.DANGER : values.comment ? Intent.SUCCESS : Intent.NONE}
                    >
                        <InputGroup
                            id='comment-input'
                            name='comment'
                            placeholder='Comment'
                            onChange={handleChange}
                            value={values.comment || ''}
                            intent={errors.comment ? Intent.DANGER : values.comment ? Intent.SUCCESS : Intent.NONE}
                            required
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

                    {!isNew && (
                        <Popover
                            content={popoverContent}
                            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                            position={Position.BOTTOM}
                        >
                            <Button icon='trash' loading={isLoading} intent={Intent.DANGER} text='Delete' />
                        </Popover>
                    )}
                </div>
            </div>
        </Dialog>
    );
};
