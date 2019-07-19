import React, { useState, useEffect } from 'react';
import {
    Card,
    H3,
    Elevation,
    HTMLTable,
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
import { LesseeType } from '../model';
import { AppToaster, useForm } from '.';
import { Colors } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';

const emptyLessee = {
    id: 0,
    name: '',
    address: '',
    postalCode: '',
    from: '',
    until: '',
    flatId: -1,
};
export const Lessees: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allLessees, setAllLessees] = useGlobal('allLessees');
    const [isOpen, setOpen] = useState(false);
    const [isNew, setNew] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [lessees, setLessees] = useState<LesseeType[]>([emptyLessee]);
    const [selectedLessee, setSelectedLessee] = useState<LesseeType>(emptyLessee);

    useEffect(() => {
        axios
            .get('lessee')
            .then(response => {
                setAllLessees(response.data);
            })
            .catch(error => {
                AppToaster.show({
                    intent: Intent.DANGER,
                    message: 'Could not fetch lessees data from server.',
                });
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedFlat.id) {
            setLessees(allLessees.filter(lessee => lessee.flatId === selectedFlat.id));
        }
    }, [selectedFlat, allLessees]);

    useEffect(() => {
        setSelectedLessee(lessees[0]);
    }, [lessees]);

    const handleLessee = () => {
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
                isNew
                    ? setLessees([...lessees, response.data])
                    : setLessees(lessees.map(lessee => (lessee.id === selectedLessee.id ? response.data : lessee)));
                setLoading(false);
                setSelectedLessee(response.data);
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

    const { values, errors, handleChange, handleSubmit, setValues, setErrors, setRef } = useForm(handleLessee);
    const lesseeFormRef = setRef as React.Ref<HTMLFormElement>;

    const handleSelection = (lessee: LesseeType) => {
        setSelectedLessee(lessee);
    };

    const handleClose = () => {
        setOpen(false);
        setValues({ name: '', address: '', postalCode: '', from: '', until: '' });
        setErrors({});
    };

    const addLessee = () => {
        setOpen(true);
        setNew(true);
    };
    const editLessee = () => {
        setOpen(true);
        setNew(false);
        setValues({
            name: selectedLessee.name,
            address: selectedLessee.address,
            postalCode: selectedLessee.postalCode,
            from: selectedLessee.from,
            until: selectedLessee.until,
        });
    };
    const deleteLessee = () => {
        axios
            .delete(`lessee/${selectedLessee.id}`)
            .then(() => {
                setLessees(lessees.filter(lessee => lessee.id !== selectedLessee.id));
                setLoading(false);
                if (lessees.length) {
                    setSelectedLessee(lessees[0]);
                } else {
                    setSelectedLessee(emptyLessee);
                }
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Lessee deleted successfully.',
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
                        message: 'Fail to delete Lessee',
                    });
                    setLoading(false);
                }
            });
    };

    const handleValueChange = (_valueAsNumber: number, valueAsString: string) => {
        if (valueAsString) {
            setValues({ ...values, floor: valueAsString });
            let { floor: omit, ...res } = errors;
            setErrors(res);
        } else {
            setErrors({ ...errors, floor: 'Please fill out this field.' });
        }
    };

    const popoverContent = (
        <div key='text'>
            <H5>Confirm deletion</H5>
            <p>Are you sure you want to delete selected lessee? You won't be able to recover it.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS} onClick={deleteLessee}>
                    Delete
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
                <H3>Lessees Management</H3>
                <HTMLTable className={lessees ? '' : Classes.SKELETON} interactive={true} condensed={true}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Postal Code</th>
                            <th>Rented From</th>
                            <th>Rented Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessees &&
                            lessees.map(lessee => (
                                <tr
                                    key={lessee.id}
                                    onClick={() => handleSelection(lessee)}
                                    style={
                                        selectedLessee && lessee.id === selectedLessee.id
                                            ? { background: Colors.BLUE3 }
                                            : {}
                                    }
                                >
                                    <td>{lessee.name}</td>
                                    <td>{lessee.address}</td>
                                    <td>{lessee.postalCode}</td>
                                    <td>{lessee.from}</td>
                                    <td>{lessee.until}</td>
                                </tr>
                            ))}
                    </tbody>
                </HTMLTable>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addLessee} />
                    <Button icon='edit' intent={Intent.WARNING} text='Edit' onClick={editLessee} />
                    <Popover
                        content={popoverContent}
                        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                        position={Position.BOTTOM}
                    >
                        <Button icon='trash' intent={Intent.DANGER} text='Delete' />
                    </Popover>
                </div>
            </Card>
            <Dialog
                icon='info-sign'
                onClose={handleClose}
                title={isNew ? 'Add New Lessee' : 'Edit Selected Lessee'}
                autoFocus={true}
                canEscapeKeyClose={true}
                canOutsideClickClose={true}
                enforceFocus={true}
                isOpen={isOpen}
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
                            intent={errors.postalCode ? Intent.DANGER : values.floor ? Intent.SUCCESS : Intent.NONE}
                        >
                            <InputGroup
                                id='postal-code-input'
                                name='postalCode'
                                placeholder='Postal Code'
                                onChange={handleChange}
                                value={values.postalCode || ''}
                                intent={errors.postalCode ? Intent.DANGER : values.floor ? Intent.SUCCESS : Intent.NONE}
                                required
                            />
                        </FormGroup>

                        <FormGroup
                            label='Rent From'
                            labelInfo='(required)'
                            helperText={errors.rentFrom}
                            intent={errors.rentFrom ? Intent.DANGER : values.floor ? Intent.SUCCESS : Intent.NONE}
                        >
                            <DateInput
                                placeholder='Rent From'
                                formatDate={date => date.toLocaleString()}
                                parseDate={str => new Date(str)}
                                value={new Date(values.rentForm)}
                            />
                        </FormGroup>

                        <FormGroup
                            label='Rent Until'
                            labelFor='rent-until-input'
                            labelInfo='(required)'
                            helperText={errors.rentUntil}
                            intent={errors.rentUntil ? Intent.DANGER : values.floor ? Intent.SUCCESS : Intent.NONE}
                        >
                            <DateInput
                                placeholder='Rent Until'
                                formatDate={date => date.toLocaleString()}
                                parseDate={str => new Date(str)}
                                value={new Date(values.rentForm)}
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
        </>
    );
};
