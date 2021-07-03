import {
    compose,
    withHandlers,
    withState,
    // withProps,
    // defaultProps,
    // hoistStatics,
    lifecycle,
} from 'recompose'

import { withTranslation } from 'react-i18next'

import ImportView from './ImportView'
import SnackBarService from '../../../utils/service/snackbar_service'

import glb_sv from '../../../utils/service/global_service'
import socket_sv from '../../../utils/service/socket_service'
import { inputPrmRq } from '../../../utils/models/inputPrmRq'
import { requestInfo } from '../../../utils/models/requestInfo'

let importorder_SendReqFlag = false //-- cờ đánh dấu các bước xử lý (từ khi gửi request xuống server, tới khi nhận được phản hồi or tới khi time out)
let importorder_ProcTimeOut //-- đối tượng control timeout, sẽ được clear nếu nhận được phản hồi từ server trước 15s
let subcr_ClientReqRcv //-- Đối tượng subscribe (ghi nhận) phản hồi từ server
let onChangeEvTimeoutDelay // xử lý debounce event Onchange Input

//-- gửi request xuống server --
const getList = (props, valueSearch, action = '') => {
    console.log("Get Warn_exp");
    const { t } = props
    //-- Kiểm tra cờ xem hệ thống đã thực hiện chưa -> tránh việc double khi click vào button nhiều liền
    if (importorder_SendReqFlag) {
        return
    } else {
        importorder_SendReqFlag = true //-- => Bật cờ đánh dấu trạng thái bắt đầu thực hiện
    }
    //- luôn kiểm tra trạng thái socket kết nối tới server trước
    if (!socket_sv.getSocketStat()) {
        importorder_SendReqFlag = false
        SnackBarService.alert(t('message.network'), true, 4, 3000)
        return
    }
    props.setpPocessing(true)
    const clientSeq = socket_sv.getClientSeq()
    // -- send requst to server
    // let nextSeq = props.data.length == 0 ? 9999999999 : props.data[props.data.length - 1]['id']
    // if (action === 'reload') {
    //     nextSeq = 9999999;
    //     props.setData([])
    // }
    console.log('getList', valueSearch);
    const svInputPrm = new inputPrmRq()
    svInputPrm.clientSeq = clientSeq
    svInputPrm.moduleName = config.moduleName
    svInputPrm.screenName = config.screenName
    svInputPrm.functionName = config['list'].functionName
    svInputPrm.operation = config['list'].operation
    svInputPrm.inputPrm = ['20200722', '20200822', '%', 1, 0]
    socket_sv.sendMsg(socket_sv.key_ClientReq, svInputPrm)
    // -- push request to request hashmap
    const reqInfo = new requestInfo()
    reqInfo.reqFunct = config['list'].reqFunct
    reqInfo.inputParam = svInputPrm.inputPrm
    glb_sv.setReqInfoMapValue(clientSeq, reqInfo)
    //-- start function to callback if timeout happened
    importorder_ProcTimeOut = setTimeout(solving_TimeOut, glb_sv.timeoutNumber, props, clientSeq)
}

const resultGetList = (props, message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
    console.log('resultGetList', message, reqInfoMap);
    clearTimeout(importorder_ProcTimeOut)
    importorder_SendReqFlag = false
    props.setpPocessing(false)
    if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
        return
    }
    reqInfoMap.procStat = 2
    if (message['PROC_STATUS'] === 2) {
        reqInfoMap.resSucc = false
        glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
        SnackBarService.alert(message['PROC_MESSAGE'], true, 4, 3000)
        return
    }

    // props.setData(message['PROC_DATA'])
    console.log('props.data', props.data.length)
    let newData = !!props.data ? props.data : []
    newData = newData.concat(message['PROC_DATA'])
    console.log('PROC_DATA', message)
    console.log('newData', newData.length)
    props.setCustList(newData)
    if (newData.length > 0) {
        // props.setTotalRecords(newData[0]['total'])
    }
}

const getCusList = (props, valueSearch, action = '') => {
    console.log("Get getCusList");
    const { t } = props
    //-- Kiểm tra cờ xem hệ thống đã thực hiện chưa -> tránh việc double khi click vào button nhiều liền
    if (importorder_SendReqFlag) {
        return
    } else {
        importorder_SendReqFlag = true //-- => Bật cờ đánh dấu trạng thái bắt đầu thực hiện
    }
    //- luôn kiểm tra trạng thái socket kết nối tới server trước
    if (!socket_sv.getSocketStat()) {
        importorder_SendReqFlag = false
        SnackBarService.alert(t('message.network'), true, 4, 3000)
        return
    }
    props.setpPocessing(true)
    const clientSeq = socket_sv.getClientSeq()
    // -- send requst to server
    // let nextSeq = props.data.length == 0 ? 9999999999 : props.data[props.data.length - 1]['id']
    // if (action === 'reload') {
    //     nextSeq = 9999999;
    //     props.setData([])
    // }
    const svInputPrm = new inputPrmRq()
    svInputPrm.clientSeq = clientSeq
    svInputPrm.moduleName = config['vender_list'].moduleName
    svInputPrm.screenName = config['vender_list'].screenName
    svInputPrm.functionName = config['vender_list'].functionName
    svInputPrm.operation = config['vender_list'].operation
    svInputPrm.inputPrm = ['%']
    socket_sv.sendMsg(socket_sv.key_ClientReq, svInputPrm)
    // -- push request to request hashmap
    const reqInfo = new requestInfo()
    reqInfo.reqFunct = config['vender_list'].reqFunct
    reqInfo.inputParam = svInputPrm.inputPrm
    glb_sv.setReqInfoMapValue(clientSeq, reqInfo)
    //-- start function to callback if timeout happened
    importorder_ProcTimeOut = setTimeout(solving_TimeOut, glb_sv.timeoutNumber, props, clientSeq)
}
const resultGetVenderList = (props, message = {}, cltSeqResult = 0, reqInfoMap = new requestInfo()) => {
    console.log('resultGetVenderList', message, reqInfoMap);
    clearTimeout(importorder_ProcTimeOut)
    importorder_SendReqFlag = false
    props.setpPocessing(false)
    if (reqInfoMap.procStat !== 0 && reqInfoMap.procStat !== 1) {
        return
    }
    reqInfoMap.procStat = 2
    if (message['PROC_STATUS'] === 2) {
        reqInfoMap.resSucc = false
        glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
        SnackBarService.alert(message['PROC_MESSAGE'], true, 4, 3000)
        return
    }

    // props.setData(message['PROC_DATA'])
    console.log('props.data', props.data.length, message)
    let newData = !!props.data ? props.data : []
    newData = newData.concat(message['PROC_DATA'])
    props.setData(newData)
}
//-- xử lý khi timeout -> ko nhận được phản hồi từ server
const solving_TimeOut = (props, cltSeq = 0) => {
    if (cltSeq == null || cltSeq === undefined || isNaN(cltSeq)) {
        return
    }
    const reqIfMap = glb_sv.getReqInfoMapValue(cltSeq)
    if (reqIfMap == null || reqIfMap === undefined || reqIfMap.procStat !== 0) {
        return
    }
    reqIfMap.resTime = new Date()
    reqIfMap.procStat = 4
    glb_sv.setReqInfoMapValue(cltSeq, reqIfMap)
    if (reqIfMap.reqFunct === glb_sv.Product_FunctNm) {
        importorder_SendReqFlag = false
        props.setpPocessing(false)
    }
    const { t } = props
    SnackBarService.alert(t('message.noReceiveFeedback'), true, 4, 3000)
}

const config = {
    moduleName: 'report',
    screenName: 'import',
    list: {
        functionName: 'get_imp',
        operation: 'Q',
        reqFunct: glb_sv.rpt_import_FcntNm,
    },
    vender_list: {
        moduleName: 'common',
        screenName: 'com-info',
        functionName: 'get_vender_ddw_list',
        operation: 'Q',
        reqFunct: glb_sv.rpt_supplierImport_FcntNm,
    }

}

const tableCols = [
    { field: 'invoice_no', title: 'report.import_order.invoice_no', show: true, disabled: true, minWidth: 100 },
    { field: 'invoice_stat', title: 'report.import_order.invoice_stat', show: true, disabled: false, minWidth: 100 },
    { field: 'vender_nm_v', title: 'report.import_order.vender_nm_v', show: true, disabled: false, minWidth: 100 },
    { field: 'input_dt', title: 'report.import_order.input_dt', show: true, disabled: false, minWidth: 100, type: 'date' },
    { field: 'imp_tp_nm', title: 'report.import_order.imp_tp_nm', show: true, disabled: false, minWidth: 100 },
    { field: 'prod_nm', title: 'report.import_order.prod_nm', show: true, disabled: false, minWidth: 100 },
    { field: 'lot_no', title: 'report.import_order.lot_no', show: true, disabled: false, minWidth: 100 },
    { field: 'made_dt', title: 'report.import_order.made_dt', show: true, disabled: false, minWidth: 100, type: 'date' },
    { field: 'exp_dt', title: 'report.import_order.exp_dt', show: true, disabled: false, minWidth: 100, type: 'date' },
    { field: 'qty', title: 'report.import_order.qty', show: true, disabled: false, minWidth: 100 },
    { field: 'unit_nm', title: 'report.import_order.unit_nm', show: true, disabled: false, minWidth: 100 },
    { field: 'price', title: 'report.import_order.price', show: true, disabled: false, minWidth: 100 },
    { field: 'vals', title: 'report.import_order.vals', show: true, disabled: false, minWidth: 100 },
    { field: 'upd_user', title: 'updateUser', show: true, disabled: false, minWidth: 100 },
    { field: 'upd_date', title: 'updateDate', show: true, disabled: false, minWidth: 100, type: 'date' },
]

const enhance = compose(
    withState('tableCol', 'setTableCol', tableCols),
    withState('data', 'setData', []),
    withState('custList', 'setCustList', []),
    withState('id', 'setId', 0),
    withState('totalRecords', 'setTotalRecords', 0),
    withState('processing', 'setpPocessing', false),
    withState('valueSearch', 'setValueSearch', ''),
    // -------------------------------   nghiệp vụ

    withHandlers({
        changeSearch: props => event => {
            props.setValueSearch(event.target.value)
            let valueSearch = event.target.value;
            if (onChangeEvTimeoutDelay) clearTimeout(onChangeEvTimeoutDelay)
            onChangeEvTimeoutDelay = setTimeout(() => {
                getList(props, valueSearch)
            }, 300);
        },

        handleCheckChangeColumnsView: props => item => {
            const index = tableCols.findIndex(obj => obj.field === item.field)
            if (index >= 0) {
                tableCols[index]['show'] = !tableCols[index]['show']
                props.setTableCol(tableCols)
            }
        },

        handleQueryNext: props => event => {
            getList(props, '%')
            event.preventDefault()
        },

        // --------------------------nghiệp vụ 

    }),

    lifecycle({
        componentDidMount() {
            getList(this.props, '')

            subcr_ClientReqRcv = socket_sv.event_ClientReqRcv.subscribe(message => {
                if (message) {
                    const cltSeqResult = message['REQUEST_SEQ']
                    if (cltSeqResult == null || cltSeqResult === undefined || isNaN(cltSeqResult)) {
                        return
                    }
                    const reqInfoMap = glb_sv.getReqInfoMapValue(cltSeqResult)
                    // glb_sv.logMessage('reqInfoMap result: ' + JSON.stringify(reqInfoMap))
                    if (reqInfoMap == null || reqInfoMap === undefined) {
                        return
                    }
                    switch (reqInfoMap.reqFunct) {
                        case glb_sv.rpt_import_FcntNm:
                            resultGetList(this.props, message, cltSeqResult, reqInfoMap)
                            getCusList(this.props, '%')
                            break
                        case glb_sv.rpt_supplierImport_FcntNm:
                            resultGetVenderList(this.props, message, cltSeqResult, reqInfoMap)
                            break
                        default:
                            return
                    }
                }
            })
        },

        componentWillUnmount() {
            if (subcr_ClientReqRcv) subcr_ClientReqRcv.unsubscribe()
        },
    })
)

export default withTranslation()(enhance(ImportView))
