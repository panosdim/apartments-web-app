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
import { FlatType } from '../model';
import { AppToaster, useForm } from '.';
import { Colors } from '@blueprintjs/core';

export const Flats: React.FC = () => {
    const [flats, setFlats] = useGlobal('flats');
    const [selectedFlat, setSelectedFlat] = useGlobal('selectedFlat');
    const [isOpen, setOpen] = useState(false);
    const [isNew, setNew] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { values, errors, handleChange, checkValidity, setValues, setErrors, setRef } = useForm();
    const flatFormRef = setRef as React.Ref<HTMLFormElement>;

    useEffect(() => {
        axios
            .get('flat')
            .then(response => {
                setFlats(response.data);
                setSelectedFlat(response.data[0]);
            })
            .catch(error => {
                AppToaster.show({
                    intent: Intent.DANGER,
                    message: 'Could not fetch flat data from server.',
                });
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFlat = () => {
        if (!checkValidity()) {
            return;
        }
        setLoading(true);
        const method = isNew ? 'post' : 'put';
        const url = isNew ? 'flat' : `flat/${selectedFlat.id}`;

        // Check if values changed
        if (!isNew) {
            if (
                selectedFlat.name === values.name &&
                selectedFlat.address === values.address &&
                Number(selectedFlat.floor) === Number(values.floor)
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
                    ? setFlats([...flats, response.data])
                    : setFlats(flats.map(flt => (flt.id === selectedFlat.id ? response.data : flt)));
                setLoading(false);
                setSelectedFlat(response.data);
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Flat saved successfully.',
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
                        message: 'Fail to save Flat',
                    });
                    setLoading(false);
                }
            });
    };

    const handleSelection = (flat: FlatType) => {
        setSelectedFlat(flat);
    };

    const handleClose = () => {
        setOpen(false);
        setValues({ name: '', address: '', floor: '' });
        setErrors({});
    };

    const addFlat = () => {
        setOpen(true);
        setNew(true);
    };

    const editFlat = () => {
        setOpen(true);
        setNew(false);
        setValues({ name: selectedFlat.name, address: selectedFlat.address, floor: String(selectedFlat.floor) });
    };

    const deleteFlat = () => {
        setLoading(true);
        axios
            .delete(`flat/${selectedFlat.id}`)
            .then(response => {
                setFlats(flats.filter(flt => flt.id !== selectedFlat.id));
                setLoading(false);
                if (flats.length) {
                    setSelectedFlat(flats[0]);
                } else {
                    setSelectedFlat({ id: 0, name: '', address: '', floor: -1 });
                }
                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Flat deleted successfully.',
                });
                handleClose();
            })
            .catch(error => {
                setLoading(false);
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setGlobal({ isLoggedIn: false });
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: error.response.data.error,
                    });
                } else if (error.response && error.response.status === 409) {
                    // Foreign Key Conflict
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: error.response.data.error,
                    });
                } else {
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: 'Fail to delete Flat',
                    });
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
            <p>Are you sure you want to delete selected flat? You won't be able to recover it.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS} onClick={deleteFlat}>
                    Delete
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
                <H3>Flats Management</H3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addFlat} />
                    <Button icon='edit' intent={Intent.WARNING} text='Edit' onClick={editFlat} />
                    <Popover
                        content={popoverContent}
                        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                        position={Position.BOTTOM}
                    >
                        <Button icon='trash' loading={isLoading} intent={Intent.DANGER} text='Delete' />
                    </Popover>
                </div>
                <HTMLTable className={flats ? '' : Classes.SKELETON} interactive={true} condensed={true}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Floor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flats &&
                            flats.map(flat => (
                                <tr
                                    key={flat.id}
                                    onClick={() => handleSelection(flat)}
                                    style={
                                        selectedFlat && flat.id === selectedFlat.id ? { background: Colors.BLUE3 } : {}
                                    }
                                >
                                    <td>{flat.name}</td>
                                    <td>{flat.address}</td>
                                    <td>{flat.floor}</td>
                                </tr>
                            ))}
                    </tbody>
                </HTMLTable>
            </Card>
            <Dialog
                icon='info-sign'
                onClose={handleClose}
                title={isNew ? 'Add New Flat' : 'Edit Selected Flat'}
                autoFocus={true}
                canEscapeKeyClose={true}
                canOutsideClickClose={true}
                enforceFocus={true}
                isOpen={isOpen}
                usePortal={true}
            >
                <div className={Classes.DIALOG_BODY}>
                    <form noValidate ref={flatFormRef}>
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
                            label='Floor'
                            labelFor='floor-input'
                            labelInfo='(required)'
                            helperText={errors.floor}
                            intent={errors.floor ? Intent.DANGER : values.floor ? Intent.SUCCESS : Intent.NONE}
                        >
                            <NumericInput
                                id='floor-input'
                                name='floor'
                                placeholder='Floor'
                                onValueChange={handleValueChange}
                                value={values.floor || ''}
                                intent={errors.floor ? Intent.DANGER : values.floor ? Intent.SUCCESS : Intent.NONE}
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
                            onClick={handleFlat}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
