import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const ProductGroupAdd = ({ id, Bname, Bnote, shouldOpenModal, handleCloseAddModal, productGroupNameFocus, productGroupNoteFocus, handleCreate }) => {
    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [note, setNote] = useState('')

    useEffect(() => {
        return () => {
            setName('')
            setNote('')
        }
    }, [])

    useEffect(() => {
        setName(Bname)
        setNote(Bnote)
    }, [Bname, Bnote])

    const checkValidate = () => {
        if (!!name) {
            return false
        }
        return true
    }

    const handleChangeName = e => {
        setName(e.target.value);
    }

    const handleChangeNote = e => {
        setNote(e.target.value);
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={shouldOpenModal}
            onClose={e => {
                handleCloseAddModal(false)
                setNote('')
                setName('')
            }}
        >
            <DialogTitle className="titleDialog pb-0">
                {t('products.productGroup.titleAdd')}
            </DialogTitle>
            <DialogContent className="pt-0">
                <TextField
                    fullWidth={true}
                    required
                    autoFocus
                    inputRef={productGroupNameFocus}
                    autoComplete="off"
                    margin="dense"
                    label={t('products.productGroup.name')}
                    onChange={handleChangeName}
                    value={name}
                    variant="outlined"
                    className="uppercaseInput"
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            handleCreate(false, name, note)
                            setName('')
                            setNote('')
                        }
                    }}
                />

                <TextField
                    fullWidth={true}
                    margin="dense"
                    multiline
                    rows={2}
                    inputRef={productGroupNoteFocus}
                    autoComplete="off"
                    label={t('products.productGroup.note')}
                    onChange={handleChangeNote}
                    value={note || ''}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={e => {
                        handleCloseAddModal(false);
                        setName('');
                        setNote('')
                    }}
                    variant="contained"
                    disableElevation
                >
                    {t('btn.close')}
                </Button>
                <Button
                    onClick={() => {
                        handleCreate(false, name, note);
                        setName('');
                        setNote('')
                    }}
                    variant="contained"
                    disabled={checkValidate()}
                    className={checkValidate() === false ? 'bg-success text-white' : ''}
                >
                    {t('btn.save')}
                </Button>
                <Button
                    onClick={() => {
                        handleCreate(true, name, note);
                        setName('');
                        setNote('')
                    }}
                    variant="contained"
                    disabled={checkValidate()}
                    className={checkValidate() === false ? 'bg-success text-white' : ''}
                >
                    {t('save_continue')}
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default ProductGroupAdd