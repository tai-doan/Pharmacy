import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import { Grid } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import Supplier_Autocomplete from '../../Partner/Supplier/Control/Supplier.Autocomplete'
import NumberFormat from 'react-number-format'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import glb_sv from '../../../utils/service/global_service'
import control_sv from '../../../utils/service/control_services'
import socket_sv from '../../../utils/service/socket_service'
import SnackBarService from '../../../utils/service/snackbar_service'
import { requestInfo } from '../../../utils/models/requestInfo'
import reqFunction from '../../../utils/constan/functions';
import sendRequest from '../../../utils/service/sendReq'

import { tableListEditColumn, invoiceImportModal } from './Modal/InsImport.Modal'
import moment from 'moment'
import AddProduct from '../Import/AddProduct'

import { Link } from 'react-router-dom'
import EditProductRows from './EditProductRows'
import { Card, CardHeader, CardContent } from '@material-ui/core'

const serviceInfo = {
    GET_INVOICE_BY_ID: {
        functionName: 'get_by_id',
        reqFunct: reqFunction.IMPORT_BY_ID,
        biz: 'import',
        object: 'imp_invoices'
    },
    UPDATE_INVOICE: {
        functionName: 'update',
        reqFunct: reqFunction.IMPORT_UPDATE,
        biz: 'import',
        object: 'imp_invoices'
    },
    GET_ALL_PRODUCT_BY_INVOICE_ID: {
        functionName: 'get_all',
        reqFunct: reqFunction.GET_ALL_PRODUCT_BY_INVOICE_ID,
        biz: 'import',
        object: 'imp_invoices_dt'
    },
    ADD_PRODUCT_TO_INVOICE: {
        functionName: 'insert',
        reqFunct: reqFunction.PRODUCT_IMPORT_INVOICE_CREATE,
        biz: 'import',
        object: 'imp_invoices_dt'
    },
    UPDATE_PRODUCT_TO_INVOICE: {
        functionName: 'update',
        reqFunct: reqFunction.PRODUCT_IMPORT_INVOICE_UPDATE,
        biz: 'import',
        object: 'imp_invoices_dt'
    },
    DELETE_PRODUCT_TO_INVOICE: {
        functionName: 'delete',
        reqFunct: reqFunction.PRODUCT_IMPORT_INVOICE_DELETE,
        biz: 'import',
        object: 'imp_invoices_dt'
    }
}

const EditImport = ({ }) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { id } = history?.location?.state || 0
    const [Import, setImport] = useState({ ...invoiceImportModal })
    const [supplierSelect, setSupplierSelect] = useState('')
    const [dataSource, setDataSource] = useState([])
    const [productEditData, setProductEditData] = useState({})
    const [productEditID, setProductEditID] = useState(-1)
    const [column, setColumn] = useState([...tableListEditColumn])

    const newInvoiceId = useRef(-1)
    const dataSourceRef = useRef([])

    useEffect(() => {
        const importSub = socket_sv.event_ClientReqRcv.subscribe(msg => {
            if (msg) {
                const cltSeqResult = msg['REQUEST_SEQ']
                if (cltSeqResult == null || cltSeqResult === undefined || isNaN(cltSeqResult)) {
                    return
                }
                const reqInfoMap = glb_sv.getReqInfoMapValue(cltSeqResult)
                if (reqInfoMap == null || reqInfoMap === undefined) {
                    return
                }
                switch (reqInfoMap.reqFunct) {
                    case reqFunction.IMPORT_BY_ID:
                        resultGetInvoiceByID(msg, cltSeqResult, reqInfoMap)
                        break
                    case reqFunction.PRODUCT_IMPORT_INVOICE_CREATE:
                        resultActionProductToInvoice(msg, cltSeqResult, reqInfoMap)
                        break
                    case reqFunction.GET_ALL_PRODUCT_BY_INVOICE_ID:
                        resultGetProductByInvoiceID(msg, cltSeqResult, reqInfoMap)
                        break
                    case reqFunction.PRODUCT_IMPORT_INVOICE_UPDATE:
                        resultActionProductToInvoice(msg, cltSeqResult, reqInfoMap)
                        break
                    default:
                        return
                }
            }
        })

        if (id !== 0) {
            sendRequest(serviceInfo.GET_INVOICE_BY_ID, [id], e => console.log(e), true, handleTimeOut)
            sendRequest(serviceInfo.GET_ALL_PRODUCT_BY_INVOICE_ID, [id], null, true, timeout => console.log('timeout: ', timeout))
        }
        return () => {
            importSub.unsubscribe()
        }
    }, [])

    useEffect(() => {
        console.log('import data: ', Import)
    }, [Import])

    //-- xử lý khi timeout -> ko nhận được phản hồi từ server
    const handleTimeOut = (e) => {
        SnackBarService.alert(t('message.noReceiveFeedback'), true, 4, 3000)
    }

    const resultGetInvoiceByID = (message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
        control_sv.clearTimeOutRequest(reqInfoMap.timeOutKey)
        if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
            return
        }
        reqInfoMap.procStat = 2
        if (message['PROC_STATUS'] === 2) {
            reqInfoMap.resSucc = false
            glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
            control_sv.clearReqInfoMapRequest(cltSeqResult)
        } else {
            let newData = message['PROC_DATA']
            let dataImport = {
                invoice_id: newData.rows[0].o_1,
                invoice_no: newData.rows[0].o_2,
                invoice_stat: newData.rows[0].o_3,
                supplier: newData.rows[0].o_5,
                order_dt: moment(newData.rows[0].o_6, 'YYYYMMDD').toString(),
                person_s: newData.rows[0].o_8,
                person_r: newData.rows[0].o_9,
                cancel_reason: newData.rows[0].o_10,
                note: newData.rows[0].o_11
            }
            setSupplierSelect(newData.rows[0].o_5)
            setImport(dataImport)
        }
    }

    const resultGetProductByInvoiceID = (message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
        control_sv.clearTimeOutRequest(reqInfoMap.timeOutKey)
        if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
            return
        }
        reqInfoMap.procStat = 2
        if (message['PROC_STATUS'] === 2) {
            reqInfoMap.resSucc = false
            glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
            control_sv.clearReqInfoMapRequest(cltSeqResult)
        } else {
            let newData = message['PROC_DATA']
            setDataSource(newData.rows)
        }
    }

    const resultActionProductToInvoice = (message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
        control_sv.clearTimeOutRequest(reqInfoMap.timeOutKey)
        if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
            return
        }
        reqInfoMap.procStat = 2
        SnackBarService.alert(message['PROC_MESSAGE'], true, message['PROC_STATUS'], 3000)
        if (message['PROC_STATUS'] === 2) {
            reqInfoMap.resSucc = false
            glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
            control_sv.clearReqInfoMapRequest(cltSeqResult)
        } else {
            sendRequest(serviceInfo.GET_ALL_PRODUCT_BY_INVOICE_ID, [Import.invoice_id || id], null, true, timeout => console.log('timeout: ', timeout))
        }
    }

    const handleSelectSupplier = obj => {
        const newImport = { ...Import };
        newImport['supplier'] = !!obj ? obj?.o_1 : null
        setSupplierSelect(!!obj ? obj?.o_2 : '')
        setImport(newImport)
    }

    const handleDateChange = date => {
        const newImport = { ...Import };
        newImport['order_dt'] = date;
        setImport(newImport)
    }

    const handleChange = e => {
        const newImport = { ...Import };
        newImport[e.target.name] = e.target.value
        setImport(newImport)
    }

    const handleAddProduct = productObject => {
        if (!productObject) {
            SnackBarService.alert(t('wrongData'), true, 'error', 3000)
            return
        }
        const inputParam = [
            Import.invoice_id,
            productObject.imp_tp,
            productObject.prod_id,
            productObject.lot_no,
            productObject.made_dt,
            moment(productObject.exp_dt).format('YYYYMMDD'),
            productObject.qty,
            productObject.unit_id,
            productObject.price,
            productObject.discount_per,
            productObject.vat_per
        ]
        sendRequest(serviceInfo.ADD_PRODUCT_TO_INVOICE, inputParam, e => console.log(e), true, handleTimeOut)
    }

    const handleEditProduct = productObject => {
        if (productObject === null) {
            setProductEditData({})
            setProductEditID(-1);
            return
        }
        const inputParam = [
            Import.invoice_id,
            productEditID,
            productObject.imp_tp,
            productObject.qty,
            productObject.price,
            productObject.discount_per,
            productObject.vat_per
        ]
        sendRequest(serviceInfo.UPDATE_PRODUCT_TO_INVOICE, inputParam, e => console.log(e), true, handleTimeOut)
        setProductEditData({})
        setProductEditID(-1);
    }

    const onRemove = item => {
        if (!item) {
            SnackBarService.alert(t('wrongData'), true, 'error', 3000)
            return
        }
        const inputParam = [item.o_2, item.o_1];
        sendRequest(serviceInfo.DELETE_PRODUCT_TO_INVOICE, inputParam, e => console.log(e), true, handleTimeOut)
    }

    const checkValidate = () => {
        console.log(dataSource, Import)
        if (dataSource.length > 0 && !!Import.supplier && !!Import.order_dt) {
            return false
        }
        return true
    }

    const handleUpdateInvoice = () => {
        if (!Import.invoice_id) {
            SnackBarService.alert(t('can_not_found_id_invoice_please_try_again'), true, 'error', 3000)
            return
        }
        //bắn event update invoice
        const inputParam = [
            Import.invoice_id,
            Import.supplier,
            moment(Import.order_dt).format('YYYYMMDD'),
            Import.person_s,
            Import.person_r,
            Import.note
        ];
        sendRequest(serviceInfo.UPDATE_INVOICE, inputParam, e => console.log(e), true, handleTimeOut)
    }

    const onDoubleClickRow = rowData => {
        if (!rowData) {
            SnackBarService.alert(t('wrongData'), true, 'error', 3000)
            return
        }
        setProductEditID(rowData.o_1)
    }

    return (
        <Grid container spacing={1}>
            <EditProductRows productEditID={productEditID} productData={productEditData} handleEditProduct={handleEditProduct} />
            <Grid item md={9} xs={12}>
                <Card>
                    {/* <div className='d-flex justify-content-between align-items-center mr-2'>
                        <Link to="/page/order/import" className="normalLink">
                            <Button variant="contained" size="small">
                                {t('btn.back')}
                            </Button>
                        </Link>
                        
                    </div> */}
                    <CardHeader
                        title={t('order.import.productImportList')}
                        action={
                            <AddProduct handleAddProduct={handleAddProduct} />
                        }
                    />
                    <CardContent>
                        <TableContainer className="tableContainer">
                            <Table stickyHeader>
                                <caption
                                    className={['text-center text-danger border-bottom', dataSource.length > 0 ? 'd-none' : ''].join(
                                        ' '
                                    )}
                                >
                                    {t('lbl.emptyData')}
                                </caption>
                                <TableHead>
                                    <TableRow>
                                        {column.map(col => (
                                            <TableCell nowrap="true" align={col.align}
                                                className={['p-2 border-0', col.show ? 'd-table-cell' : 'd-none'].join(' ')}
                                                key={col.field}
                                            >
                                                {t(col.title)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSource.map((item, index) => {
                                        return (
                                            <TableRow onDoubleClick={e => { onDoubleClickRow(item) }} hover role="checkbox" tabIndex={-1} key={index}>
                                                {column.map((col, indexRow) => {
                                                    let value = item[col.field]
                                                    if (col.show) {
                                                        switch (col.field) {
                                                            case 'action':
                                                                return (
                                                                    <TableCell nowrap="true" nowrap="true" key={indexRow} align={col.align}>
                                                                        <IconButton
                                                                            onClick={e => {
                                                                                onRemove(item)
                                                                            }}
                                                                        >
                                                                            <DeleteIcon style={{ color: 'red' }} fontSize="small" />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                )
                                                            case 'stt':
                                                                return (
                                                                    <TableCell nowrap="true" nowrap="true" key={indexRow} align={col.align}>
                                                                        {index + 1}
                                                                    </TableCell>
                                                                )
                                                            case 'imp_tp':
                                                                return (
                                                                    <TableCell nowrap="true" nowrap="true" key={indexRow} align={col.align}>
                                                                        {value === '1' ? t('order.import.import_type_buy') : t('order.import.import_type_selloff')}
                                                                    </TableCell>
                                                                )
                                                            default:
                                                                return (
                                                                    <TableCell nowrap="true" key={indexRow} align={col.align}>
                                                                        {glb_sv.formatValue(value, col['type'])}
                                                                    </TableCell>
                                                                )
                                                        }
                                                    }
                                                })}
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item md={3} xs={12}>
                <Card>
                    <CardHeader title={t('order.import.invoice_info')} />
                    <CardContent>
                        <Grid container spacing={1}>
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                multiline
                                rows={1}
                                autoComplete="off"
                                label={t('order.import.invoice_no')}
                                disabled={true}
                                value={Import.invoice_no || ''}
                                name='invoice_no'
                                variant="outlined"
                            />
                            <Supplier_Autocomplete
                                value={supplierSelect || ''}
                                style={{ marginTop: 8, marginBottom: 4, width: '100%' }}
                                size={'small'}
                                label={t('menu.supplier')}
                                onSelect={handleSelectSupplier}
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    margin="dense"
                                    variant="outlined"
                                    style={{ width: '100%' }}
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    id="order_dt-picker-inline"
                                    label={t('order.import.order_dt')}
                                    value={Import.order_dt}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <NumberFormat
                                style={{ width: '100%' }}
                                required
                                value={dataSource.reduce(function (acc, obj) {
                                    return acc + Math.round(obj.o_10 * obj.o_13)
                                }, 0) || 0}
                                label={t('order.import.invoice_val')}
                                customInput={TextField}
                                autoComplete="off"
                                margin="dense"
                                type="text"
                                variant="outlined"
                                thousandSeparator={true}
                                disabled={true}
                            />
                            <NumberFormat
                                style={{ width: '100%' }}
                                required
                                value={dataSource.reduce(function (acc, obj) {
                                    return acc + Math.round(obj.o_15 / 100 * (obj.o_10 * obj.o_13))
                                }, 0) || 0}
                                label={t('order.import.invoice_discount')}
                                customInput={TextField}
                                autoComplete="off"
                                margin="dense"
                                type="text"
                                variant="outlined"
                                thousandSeparator={true}
                                disabled={true}
                            />
                            <NumberFormat
                                style={{ width: '100%' }}
                                required
                                value={dataSource.reduce(function (acc, obj) {
                                    return acc + Math.round(obj.o_14 / 100 * (obj.o_10 * obj.o_13))
                                }, 0) || 0}
                                label={t('order.import.invoice_vat')}
                                customInput={TextField}
                                autoComplete="off"
                                margin="dense"
                                type="text"
                                variant="outlined"
                                thousandSeparator={true}
                                disabled={true}
                            />
                            <NumberFormat
                                style={{ width: '100%' }}
                                required
                                value={dataSource.reduce(function (acc, obj) {
                                    return acc + Math.round(Math.round(obj.o_10 * obj.o_13) - Math.round(obj.o_15 / 100 * (obj.o_10 * obj.o_13)) - Math.round(obj.o_14 / 100 * (obj.o_10 * obj.o_13)))
                                }, 0) || 0}
                                label={t('order.import.invoice_needpay')}
                                customInput={TextField}
                                autoComplete="off"
                                margin="dense"
                                type="text"
                                variant="outlined"
                                thousandSeparator={true}
                                disabled={true}
                            />
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                multiline
                                rows={1}
                                autoComplete="off"
                                label={t('order.import.person_s')}
                                onChange={handleChange}
                                value={Import.person_s || ''}
                                name='person_s'
                                variant="outlined"
                            />
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                multiline
                                rows={1}
                                autoComplete="off"
                                label={t('order.import.person_r')}
                                onChange={handleChange}
                                value={Import.person_r || ''}
                                name='person_r'
                                variant="outlined"
                            />
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                multiline
                                autoComplete="off"
                                rows={2}
                                rowsMax={5}
                                label={t('order.import.note')}
                                onChange={handleChange}
                                value={Import.note || ''}
                                name='note'
                                variant="outlined"
                            />
                        </Grid>
                        <Grid container spacing={1} className='mt-2'>
                            <Button
                                onClick={() => {
                                    handleUpdateInvoice();
                                }}
                                variant="contained"
                                disabled={checkValidate()}
                                className={checkValidate() === false ? 'bg-success text-white' : ''}
                            >
                                {t('btn.update')}
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default EditImport