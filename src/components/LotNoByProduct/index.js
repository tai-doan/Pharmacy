import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SnackBarService from '../../utils/service/snackbar_service';
import sendRequest from '../../utils/service/sendReq';
import reqFunction from '../../utils/constan/functions';
import { requestInfo } from '../../utils/models/requestInfo';
import glb_sv from '../../utils/service/global_service'
import control_sv from '../../utils/service/control_services'
import socket_sv from '../../utils/service/socket_service'

const serviceInfo = {
    GET_LOT_NO_LIST: {
        functionName: 'get_lotno',
        reqFunct: reqFunction.LOT_NO_BY_PRODUCT,
        biz: 'import',
        object: 'imp_invoices'
    }
}

const LotNoByProduct_Autocomplete = ({ productID, onSelect, label, size = 'small', value, disabled = false, inputRef = null, onKeyPress = () => null }) => {
    const { t } = useTranslation()

    const [dataSource, setDataSource] = useState([])
    const [valueSelect, setValueSelect] = useState({})
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        if (!!productID && productID !== -1) {
            const inputParam = [productID, 'Y']
            sendRequest(serviceInfo.GET_LOT_NO_LIST, inputParam, handleResultGetLotNoList, true, handleTimeOut)
        } else {
            setValueSelect({})
        }
    }, [productID])

    useEffect(() => {
        if (value !== null && value !== undefined) {
            let item = dataSource.find(x => x.o_3 === value)
            if (!!item) {
                setInputValue(value)
                setValueSelect(item)
                onSelect(item)
            }
        }
    }, [value, dataSource])

    const handleResultGetLotNoList = (reqInfoMap, message) => {
        if (message['PROC_CODE'] !== 'SYS000') {
            // xử lý thất bại
            const cltSeqResult = message['REQUEST_SEQ']
            glb_sv.setReqInfoMapValue(cltSeqResult, reqInfoMap)
            control_sv.clearReqInfoMapRequest(cltSeqResult)
        } else if (message['PROC_DATA']) {
            let newData = message['PROC_DATA']
            setDataSource(newData.rows)
        }
    }

    //-- xử lý khi timeout -> ko nhận được phản hồi từ server
    const handleTimeOut = (e) => {
        SnackBarService.alert(t(`message.${e.type}`), true, 4, 3000)
    }

    const handleChangeInput = (event, value, reson) => {
        setInputValue(value)
    }

    const onChange = (event, object, reson) => {
        setValueSelect(object)
        onSelect(object)
    }

    return (
        <Autocomplete
            disabled={disabled}
            onChange={onChange}
            onInputChange={handleChangeInput}
            onKeyPress={onKeyPress}
            size={!!size ? size : 'small'}
            id="combo-box-demo"
            options={dataSource}
            value={valueSelect}
            getOptionLabel={(option) => option.o_3 || ''}
            inputValue={value}
            style={{ marginTop: 8, marginBottom: 4, width: '100%' }}
            renderInput={(params) => <TextField {...params} value={inputValue} inputRef={inputRef} label={!!label ? label : ''} variant="outlined" />}
        />
    )
}

export default LotNoByProduct_Autocomplete