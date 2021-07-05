import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import VisibilityIcon from '@material-ui/icons/Visibility';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ColumnCtrComp from '../../../components/_ColumnCtr'
import SearChComp from '../../../components/_Search'

import glb_sv from '../../../utils/service/global_service'
import control_sv from '../../../utils/service/control_services'
import socket_sv from '../../../utils/service/socket_service'
import SnackBarService from '../../../utils/service/snackbar_service'
import { requestInfo } from '../../../utils/models/requestInfo'
import reqFunction from '../../../utils/constan/functions';
import sendRequest from '../../../utils/service/sendReq'

import { tableColumn, config } from './Modal/ProductGroup.modal'
import ProductGroupAdd from './ProductGroupAdd';
import ProductGroupView from './ProductGroupView'
import ProductGroupEdit from './ProductGroupEdit'

const serviceInfo = {
    GET_ALL: {
        functionName: config['list'].functionName,
        reqFunct: config['list'].reqFunct,
        biz: config.biz,
        object: config.object
    },
    CREATE: {
        funct: config['insert'].functionName,
        reqFunct: config['insert'].reqFunct,
        biz: config.biz,
        object: config.object
    },
    UPDATE: {
        funct: config['update'].functionName,
        reqFunct: config['update'].reqFunct,
        biz: config.biz,
        object: config.object
    },
    DELETE: {
        functionName: config['delete'].functionName,
        reqFunct: config['delete'].reqFunct,
        biz: config.biz,
        object: config.object
    }
}

const ProductGroupList = () => {
    const { t } = useTranslation()
    const [anChorEl, setAnChorEl] = useState(null)
    const [column, setColumn] = useState(tableColumn)
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [dataSource, setDataSource] = useState([])

    const [shouldOpenModal, setShouldOpenModal] = useState(false)
    const [shouldOpenEditModal, setShouldOpenEditModal] = useState(false)
    const [shouldOpenRemoveModal, setShouldOpenRemoveModal] = useState(false)
    const [shouldOpenViewModal, setShouldOpenViewModal] = useState(false)
    const [id, setId] = useState(0)
    const [name, setName] = useState('')
    const [note, setNote] = useState('')
    const [processing, setProcessing] = useState(false)

    const productGroup_SendReqFlag = useRef(false)
    const productGroup_ProcTimeOut = useRef(null)
    const dataSourceRef = useRef([])
    const searchRef = useRef('')
    const saveContinue = useRef(false)
    const productGroupNameFocus = useRef(null)
    const productGroupNoteFocus = useRef(null)
    const idRef = useRef(0)

    useEffect(() => {
        getList(999999999999, '');
        const productGroupSub = socket_sv.event_ClientReqRcv.subscribe(msg => {
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
                    case reqFunction.PRODUCT_GROUP_LIST:
                        resultGetList(msg, cltSeqResult, reqInfoMap)
                        break
                    // case reqFunction.PRODUCT_GROUP_BY_ID:
                    //     resultGetById(msg, cltSeqResult, reqInfoMap)
                    //     break
                    case reqFunction.PRODUCT_GROUP_ADD:
                        resultCreate(msg, cltSeqResult, reqInfoMap)
                        break
                    case reqFunction.PRODUCT_GROUP_UPDATE:
                        resultUpdate(msg, cltSeqResult, reqInfoMap)
                        break
                    case reqFunction.PRODUCT_GROUP_DELETE:
                        resultRemove(msg, cltSeqResult, reqInfoMap)
                        break
                    default:
                        return
                }
            }
        })
        return () => {
            productGroupSub.unsubscribe()
        }
    }, [])

    const getList = (lastIndex, value) => {
        const inputParam = [lastIndex, value.trim() + '%']
        sendRequest(serviceInfo.GET_ALL, inputParam, e => console.log('result ', e), true, handleTimeOut)
    }

    //-- xử lý khi timeout -> ko nhận được phản hồi từ server
    const handleTimeOut = (e) => {
        SnackBarService.alert(t('message.noReceiveFeedback'), true, 4, 3000)
    }

    const resultGetList = (message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
        control_sv.clearTimeOutRequest(reqInfoMap.timeOutKey)
        productGroup_SendReqFlag.current = false
        setProcessing(false)
        if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
            return
        }
        reqInfoMap.procStat = 2
        if (message['PROC_STATUS'] === 2) {
            reqInfoMap.resSucc = false
            glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
        }
        if (message['PROC_DATA']) {
            let newData = message['PROC_DATA']
            dataSourceRef.current = dataSourceRef.current.concat(newData.rows)
            setDataSource(dataSourceRef.current)
            if (newData.rows.length > 0) {
                setTotalRecords(newData.rowTotal)
            }
        }
    }

    const resultCreate = (message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
        control_sv.clearTimeOutRequest(reqInfoMap.timeOutKey)
        productGroup_SendReqFlag.current = false
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
            setName('')
            setNote('')
            setId(0)
            if (saveContinue.current) {
                setShouldOpenModal(true)
                setTimeout(() => {
                    if (productGroupNameFocus.current) productGroupNameFocus.current.focus()
                }, 100)
            } else {
                setShouldOpenModal(false)
            }
            dataSourceRef.current = [];
            getList(999999999999, searchValue)
        }
    }

    const resultUpdate = (message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
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
            setId(0)
            setShouldOpenEditModal(false)
            dataSourceRef.current = [];
            getList(999999999999, searchValue)
        }
    }

    const resultRemove = (props, message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
        control_sv.clearTimeOutRequest(reqInfoMap.timeOutKey)
        productGroup_SendReqFlag.current = false
        if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
            return
        }
        reqInfoMap.procStat = 2
        SnackBarService.alert(message['PROC_MESSAGE'], true, message['PROC_STATUS'], 3000)

        if (message['PROC_STATUS'] === 2) {
            reqInfoMap.resSucc = false
            glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
        } else {
            setShouldOpenRemoveModal(false)
            dataSourceRef.current = dataSourceRef.current.filter(item => item.o_1 !== cltSeqResult.inputParam[0])
            setDataSource(dataSourceRef.current);
            setTotalRecords(dataSourceRef.current.length)
        }
    }

    const onClickColumn = e => {
        setAnChorEl(e.currentTarget);
    }

    const onCloseColumn = () => {
        setAnChorEl(null);
    }

    const onChangeColumnView = item => {
        const newColumn = [...column]
        const index = newColumn.findIndex(obj => obj.field === item.field)
        if (index >= 0) {
            newColumn[index]['show'] = !column[index]['show']
            setColumn(newColumn)
        }
    }

    const searchSubmit = value => {
        if (value === searchRef.current) return
        searchRef.current = value
        dataSourceRef.current = []
        setSearchValue(value)
        setPage(0)
        setTotalRecords(0)
        getList(999999999999, value)
    }

    const onRemove = item => {
        setShouldOpenRemoveModal(item ? true : false);
        setId(item ? item.o_1 : 0)
        setName(item ? item.o_2 : '')
    }

    const onEdit = item => {
        setShouldOpenEditModal(item ? true : false)
        setId(item ? item.o_1 : 0)
        idRef.current = item && item.o_1 > 0 ? item.item && item.o_1 > 0 : 0
    }

    const onView = item => {
        setShouldOpenViewModal(item ? true : false)
        setId(item ? item.o_1 : 0)
    }

    const handleDelete = e => {
        e.preventDefault();
        idRef.current = id;
        sendRequest(serviceInfo.DELETE, [id], null, true, handleTimeOut)
        setId(0)
        setName('')
    }

    const getNextData = () => {
        if (dataSourceRef.current.length > 0) {
            const lastIndex = dataSourceRef.current.length - 1;
            const lastID = dataSourceRef.current[lastIndex].o_1
            getList(lastID, searchValue)
        }
    }

    const handleCreate = (actionType, newName, newNote) => {
        saveContinue.current = actionType
        const inputParam = [newName, newNote]
        sendRequest(serviceInfo.CREATE, inputParam, e => console.log(e), true, handleTimeOut)
    }

    const handleUpdate = newProductGroupData => {
        const inputParam = [newProductGroupData.o_1, newProductGroupData.o_3, newProductGroupData.o_3]
        sendRequest(serviceInfo.UPDATE, inputParam, e => console.log(e), true, handleTimeOut)
    }

    const handleCloseEditModal = value => {
        setId(0);
        setShouldOpenEditModal(value)
    }

    const handleCloseViewModal = value => {
        setId(0);
        setShouldOpenViewModal(value)
    }

    const handleCloseAddModal = value => {
        setId(0);
        setShouldOpenModal(value)
    }

    return (
        <>
            <div className="align-items-center ">
                <div className='d-flex justify-content-between mb-3'>
                    <div className="d-flex align-items-center mr-2">
                        <SearChComp
                            searchSubmit={searchSubmit}
                            setSearchVal={setSearchValue}
                            placeholder={'products.productGroup.search_name'}
                        />
                    </div>
                    <div className='d-flex'>
                        <Button size="small" style={{ backgroundColor: 'green', color: '#fff' }} onClick={() => setShouldOpenModal(true)} variant="contained">{t('btn.add')}</Button>
                        <IconButton onClick={onClickColumn}>
                            <MoreVertIcon />
                        </IconButton>

                        <ColumnCtrComp
                            anchorEl={anChorEl}
                            columns={tableColumn}
                            handleClose={onCloseColumn}
                            checkColumnChange={onChangeColumnView}
                        />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <h6 className="d-flex font-weight-bold mb-2">{t('products.productGroup.titleList')}</h6>
                    <div className='d-flex'>
                        <Chip size="small" variant='outlined' className='mr-1' label={dataSourceRef.current.length + '/' + totalRecords + ' ' + t('rowData')} />
                        <Chip size="small" deleteIcon={<AutorenewIcon />} onDelete={() => null} color="primary" label={t('getMoreData')} onClick={getNextData} disabled={dataSourceRef.current.length >= totalRecords} />
                    </div>
                </div>
            </div>

            {/* table */}
            <Paper className="mb-3">
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
                                {column?.map(col => (
                                    <TableCell nowrap="true"
                                        className={['p-2 border-0', col.show ? 'd-table-cell' : 'd-none'].join(' ')}
                                        key={col.field}
                                    >
                                        {t(col.title)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataSource?.length > 0 ? dataSource?.map((item, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {column?.map((col, indexRow) => {
                                            let value = item[col.field]
                                            if (col.show) {
                                                switch (col.field) {
                                                    case 'action':
                                                        return (
                                                            <TableCell nowrap="true" key={indexRow} align={col.align}>
                                                                <IconButton
                                                                    onClick={e => {
                                                                        onRemove(item)
                                                                    }}
                                                                >
                                                                    <DeleteIcon style={{ color: 'red' }} fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={e => {
                                                                        onEdit(item)
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={e => {
                                                                        onView(item)
                                                                    }}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        )
                                                    case 'o_4':
                                                        return (
                                                            <TableCell nowrap="true" key={indexRow} align={col.align}>
                                                                {value === 'Y' ? t('products.productGroup.isMain') : t('products.productGroup.notMain')}
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
                            }) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* modal delete */}
            <Dialog
                open={shouldOpenRemoveModal}
                onClose={e => {
                    setShouldOpenRemoveModal(false)
                }}
            >
                <DialogContent>
                    <DialogContentText className="m-0 text-dark">
                        {t('products.productGroup.titleRemove', { name: name })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={e => {
                            setShouldOpenRemoveModal(false)
                        }}
                        variant="contained"
                        disableElevation
                    >
                        {t('btn.close')}
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="secondary">
                        {t('btn.agree')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* modal add */}
            <ProductGroupAdd
                id={id}
                Bname={name}
                Bnote={note}
                shouldOpenModal={shouldOpenModal}
                handleCloseAddModal={handleCloseAddModal}
                productGroupNameFocus={productGroupNameFocus}
                productGroupNoteFocus={productGroupNoteFocus}
                handleCreate={handleCreate}
            />

            <ProductGroupEdit
                id={id}
                shouldOpenModal={shouldOpenEditModal}
                handleCloseEditModal={handleCloseEditModal}
                productGroupNameFocus={productGroupNameFocus}
                productGroupNoteFocus={productGroupNoteFocus}
                handleUpdate={handleUpdate}
            />

            <ProductGroupView
                id={id}
                shouldOpenModal={shouldOpenViewModal}
                handleCloseViewModal={handleCloseViewModal}
            />
        </>
    )
}

export default ProductGroupList