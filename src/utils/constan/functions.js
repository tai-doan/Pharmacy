export default {
    REPORT_STATIC: 'REPORT_STATIC',
    REPORT_STATIC_CHART: 'REPORT_STATIC_CHART',
    DICTIONARY: 'DICTIONARY',
    PRODUCT_DROPDOWN_LIST: 'PRODUCT_DROPDOWN_LIST',
    PRODUCT_GROUP_DROPDOWN_LIST: 'PRODUCT_GROUP_DROPDOWN_LIST',
    UNIT_DROPDOWN_LIST: 'UNIT_DROPDOWN_LIST',
    USER_DROPDOWN_LIST: 'USER_DROPDOWN_LIST',
    SUPPLIER_DROPDOWN_LIST: 'SUPPLIER_DROPDOWN_LIST',
    LOT_NO_BY_PRODUCT: 'LOT_NO_BY_PRODUCT',
    REPORT_IMPORT_TIME: 'REPORT_IMPORT_TIME',
    REPORT_IMPORT_INVENTORY: 'REPORT_IMPORT_INVENTORY',
    REPORT_EXPORT: 'REPORT_EXPORT',
    REPORT_EXPORT_REPAY: 'REPORT_EXPORT_REPAY',
    REPORT_EXPORT_DESTROY: 'REPORT_EXPORT_DESTROY',
    REPORT_IMPORT_PAYMENT: 'REPORT_IMPORT_PAYMENT',
    REPORT_COLLECT_SALES: 'REPORT_COLLECT_SALES',
    REPORT_COLLECT_IMPORT_REPAY: 'REPORT_COLLECT_IMPORT_REPAY',
    REPORT_INVENTORY_LOTNO: 'REPORT_INVENTORY_LOTNO',
    REPORT_TRANSACTION_STATEMENT: 'REPORT_TRANSACTION_STATEMENT',
    GET_PRODUCT_IMPORT_INFO: 'GET_PRODUCT_IMPORT_INFO',
    GET_PRODUCT_BY_BARCODE: 'GET_PRODUCT_BY_BARCODE',
    REGISTER_PHARMACY: 'REGISTER_PHARMACY',
    UPDATE_LOGO: 'UPDATE_LOGO',
    LOGIN: 'LOGIN',
    //-- Lấy danh sách sản phẩm
    GET_PROD_LIST: 'GET_PROD_LIST',
    //-- Lấy thông tin 1 sản phẩm
    GET_PROD: 'GET_PROD',
    //-- Thêm mới sản phẩm
    INS_PROD: 'INS_PROD',
    //-- Sửa thôngtin sản phẩm
    MOD_PROD: 'MOD_PROD',
    //-- Xóa sản phẩm
    DEL_PROD: 'DEL_PROD',
    //-- Lấy danh sách đơn vị
    GET_UNIT_LIST: 'GET_UNIT_LIST',
    //-- Lấy thông tin 1 đơn vị
    GET_UNIT: 'GET_UNIT',
    //-- Thêm mới đơn vị
    INS_UNIT: 'INS_UNIT',
    //-- Sửa thôngtin đơn vị
    MOD_UNIT: 'MOD_UNIT',
    //-- Xóa đơn vị
    DEL_UNIT: 'DEL_UNIT',

    PRODUCT_GROUP_LIST: 'PRODUCT_GROUP_LIST',
    PRODUCT_GROUP_BY_ID: 'PRODUCT_GROUP_BY_ID',
    PRODUCT_GROUP_ADD: 'PRODUCT_GROUP_ADD',
    PRODUCT_GROUP_UPDATE: 'PRODUCT_GROUP_UPDATE',
    PRODUCT_GROUP_DELETE: 'PRODUCT_GROUP_DELETE',

    PRODUCT_LIST: 'PRODUCT_LIST',
    PRODUCT_BY_ID: 'PRODUCT_BY_ID',
    PRODUCT_ADD: 'PRODUCT_ADD',
    PRODUCT_UPDATE: 'PRODUCT_UPDATE',
    PRODUCT_DELETE: 'PRODUCT_DELETE',

    UNIT_RATE_LIST: 'UNIT_RATE_LIST',
    UNIT_RATE_BY_ID: 'UNIT_RATE_BY_ID',
    UNIT_RATE_CREATE: 'UNIT_RATE_CREATE',
    UNIT_RATE_UPDATE: 'UNIT_RATE_UPDATE',
    UNIT_RATE_DELETE: 'UNIT_RATE_DELETE',

    WARN_TIME_LIST: 'WARN_TIME_LIST',
    WARN_TIME_DICTIONNARY: 'WARN_TIME_DICTIONNARY',
    WARN_TIME_BY_ID: 'WARN_TIME_BY_ID',
    WARN_TIME_CREATE: 'WARN_TIME_CREATE',
    WARN_TIME_UPDATE: 'WARN_TIME_UPDATE',
    WARN_TIME_DELETE: 'WARN_TIME_DELETE',

    PRICE_LIST: 'PRICE_LIST',
    PRICE_BY_ID: 'PRICE_BY_ID',
    GET_PRICE_BY_PRODUCT_ID: 'GET_PRICE_BY_PRODUCT_ID',
    PRICE_CREATE: 'PRICE_CREATE',
    PRICE_UPDATE: 'PRICE_UPDATE',
    PRICE_DELETE: 'PRICE_DELETE',

    STORE_LIMIT_LIST: 'STORE_LIMIT_LIST',
    STORE_LIMIT_BY_ID: 'STORE_LIMIT_BY_ID',
    STORE_LIMIT_CREATE: 'STORE_LIMIT_CREATE',
    STORE_LIMIT_UPDATE: 'STORE_LIMIT_UPDATE',
    STORE_LIMIT_DELETE: 'STORE_LIMIT_DELETE',

    CUSTOMER_LIST: 'CUSTOMER_LIST',
    CUSTOMER_BY_ID: 'CUSTOMER_BY_ID',
    CUSTOMER_CREATE: 'CUSTOMER_CREATE',
    CUSTOMER_UPDATE: 'CUSTOMER_UPDATE',
    CUSTOMER_DELETE: 'CUSTOMER_DELETE',

    SUPPLIER_LIST: 'SUPPLIER_LIST',
    SUPPLIER_BY_ID: 'SUPPLIER_BY_ID',
    SUPPLIER_CREATE: 'SUPPLIER_CREATE',
    SUPPLIER_UPDATE: 'SUPPLIER_UPDATE',
    SUPPLIER_DELETE: 'SUPPLIER_DELETE',

    IMPORT_LIST: 'IMPORT_LIST',
    IMPORT_BY_ID: 'IMPORT_BY_ID',
    IMPORT_CREATE: 'IMPORT_CREATE',
    IMPORT_UPDATE: 'IMPORT_UPDATE',
    IMPORT_DELETE: 'IMPORT_DELETE',

    GET_ALL_PRODUCT_BY_INVOICE_ID: 'GET_ALL_PRODUCT_BY_INVOICE_ID',
    PRODUCT_IMPORT_INVOICE_LIST: 'PRODUCT_IMPORT_INVOICE_LIST',
    PRODUCT_IMPORT_INVOICE_BY_ID: 'PRODUCT_IMPORT_INVOICE_BY_ID',
    PRODUCT_IMPORT_INVOICE_CREATE: 'PRODUCT_IMPORT_INVOICE_CREATE',
    PRODUCT_IMPORT_INVOICE_UPDATE: 'PRODUCT_IMPORT_INVOICE_UPDATE',
    PRODUCT_IMPORT_INVOICE_DELETE: 'PRODUCT_IMPORT_INVOICE_DELETE',

    GET_ALL_PRODUCT_BY_IMPORT_INVENTORY_ID: 'GET_ALL_PRODUCT_BY_IMPORT_INVENTORY_ID',
    IMPORT_INVENTORY_LIST: 'IMPORT_INVENTORY_LIST',
    IMPORT_INVENTORY_BY_ID: 'IMPORT_INVENTORY_BY_ID',
    IMPORT_INVENTORY_CREATE: 'IMPORT_INVENTORY_CREATE',
    IMPORT_INVENTORY_UPDATE: 'IMPORT_INVENTORY_UPDATE',
    IMPORT_INVENTORY_DELETE: 'IMPORT_INVENTORY_DELETE',

    EXPORT_LIST: 'EXPORT_LIST',
    EXPORT_BY_ID: 'EXPORT_BY_ID',
    EXPORT_CREATE: 'EXPORT_CREATE',
    EXPORT_UPDATE: 'EXPORT_UPDATE',
    EXPORT_DELETE: 'EXPORT_DELETE',

    GET_ALL_PRODUCT_BY_EXPORT_ID: 'GET_ALL_PRODUCT_BY_EXPORT_ID',
    PRODUCT_EXPORT_INVOICE_LIST: 'PRODUCT_EXPORT_INVOICE_LIST',
    PRODUCT_EXPORT_INVOICE_BY_ID: 'PRODUCT_EXPORT_INVOICE_BY_ID',
    PRODUCT_EXPORT_INVOICE_CREATE: 'PRODUCT_EXPORT_INVOICE_CREATE',
    PRODUCT_EXPORT_INVOICE_UPDATE: 'PRODUCT_EXPORT_INVOICE_UPDATE',
    PRODUCT_EXPORT_INVOICE_DELETE: 'PRODUCT_EXPORT_INVOICE_DELETE',

    EXPORT_REPAY_LIST: 'EXPORT_REPAY_LIST',
    EXPORT_REPAY_BY_ID: 'EXPORT_REPAY_BY_ID',
    EXPORT_REPAY_CREATE: 'EXPORT_REPAY_CREATE',
    EXPORT_REPAY_UPDATE: 'EXPORT_REPAY_UPDATE',
    EXPORT_REPAY_DELETE: 'EXPORT_REPAY_DELETE',

    GET_ALL_PRODUCT_BY_EXPORT_REPAY_ID: 'GET_ALL_PRODUCT_BY_EXPORT_REPAY_ID',
    PRODUCT_EXPORT_REPAY_INVOICE_LIST: 'PRODUCT_EXPORT_REPAY_INVOICE_LIST',
    PRODUCT_EXPORT_REPAY_INVOICE_BY_ID: 'PRODUCT_EXPORT_REPAY_INVOICE_BY_ID',
    PRODUCT_EXPORT_REPAY_INVOICE_CREATE: 'PRODUCT_EXPORT_REPAY_INVOICE_CREATE',
    PRODUCT_EXPORT_REPAY_INVOICE_UPDATE: 'PRODUCT_EXPORT_REPAY_INVOICE_UPDATE',
    PRODUCT_EXPORT_REPAY_INVOICE_DELETE: 'PRODUCT_EXPORT_REPAY_INVOICE_DELETE',

    EXPORT_DESTROY_LIST: 'EXPORT_DESTROY_LIST',
    EXPORT_DESTROY_BY_ID: 'EXPORT_DESTROY_BY_ID',
    EXPORT_DESTROY_CREATE: 'EXPORT_DESTROY_CREATE',
    EXPORT_DESTROY_UPDATE: 'EXPORT_DESTROY_UPDATE',
    EXPORT_DESTROY_DELETE: 'EXPORT_DESTROY_DELETE',

    GET_ALL_PRODUCT_BY_EXPORT_DESTROY_ID: 'GET_ALL_PRODUCT_BY_EXPORT_DESTROY_ID',
    PRODUCT_EXPORT_DESTROY_INVOICE_LIST: 'PRODUCT_EXPORT_DESTROY_INVOICE_LIST',
    PRODUCT_EXPORT_DESTROY_INVOICE_BY_ID: 'PRODUCT_EXPORT_DESTROY_INVOICE_BY_ID',
    PRODUCT_EXPORT_DESTROY_INVOICE_CREATE: 'PRODUCT_EXPORT_DESTROY_INVOICE_CREATE',
    PRODUCT_EXPORT_DESTROY_INVOICE_UPDATE: 'PRODUCT_EXPORT_DESTROY_INVOICE_UPDATE',
    PRODUCT_EXPORT_DESTROY_INVOICE_DELETE: 'PRODUCT_EXPORT_DESTROY_INVOICE_DELETE',

    SETTLEMENT_IMPORT_LIST: 'SETTLEMENT_IMPORT_LIST',
    SETTLEMENT_IMPORT_BY_ID: 'SETTLEMENT_IMPORT_BY_ID',
    SETTLEMENT_IMPORT_BY_INVOICE_ID: 'SETTLEMENT_IMPORT_BY_INVOICE_ID',
    SETTLEMENT_IMPORT_CREATE: 'SETTLEMENT_IMPORT_CREATE',
    SETTLEMENT_IMPORT_UPDATE: 'SETTLEMENT_IMPORT_UPDATE',
    SETTLEMENT_IMPORT_DELETE: 'SETTLEMENT_IMPORT_DELETE',

    SETTLEMENT_EXPORT_LIST: 'SETTLEMENT_EXPORT_LIST',
    SETTLEMENT_EXPORT_BY_ID: 'SETTLEMENT_EXPORT_BY_ID',
    SETTLEMENT_EXPORT_CREATE: 'SETTLEMENT_EXPORT_CREATE',
    SETTLEMENT_EXPORT_UPDATE: 'SETTLEMENT_EXPORT_UPDATE',
    SETTLEMENT_EXPORT_DELETE: 'SETTLEMENT_EXPORT_DELETE',

    SETTLEMENT_EXPORT_REPAY_LIST: 'SETTLEMENT_EXPORT_REPAY_LIST',
    SETTLEMENT_EXPORT_REPAY_BY_ID: 'SETTLEMENT_EXPORT_REPAY_BY_ID',
    SETTLEMENT_EXPORT_REPAY_CREATE: 'SETTLEMENT_EXPORT_REPAY_CREATE',
    SETTLEMENT_EXPORT_REPAY_UPDATE: 'SETTLEMENT_EXPORT_REPAY_UPDATE',
    SETTLEMENT_EXPORT_REPAY_DELETE: 'SETTLEMENT_EXPORT_REPAY_DELETE',

    USER_LIST: 'USER_LIST',
    USER_BY_ID: 'USER_BY_ID',
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_UPDATE_PASSWORD: 'USER_UPDATE_PASSWORD',
    USER_DELETE: 'USER_DELETE',
    USER_LOCK: 'USER_LOCK',

    PHARMACY_LIST: 'PHARMACY_LIST',
    PHARMACY_BY_ID: 'PHARMACY_BY_ID',
    PHARMACY_CREATE: 'PHARMACY_CREATE',
    PHARMACY_UPDATE: 'PHARMACY_UPDATE',
    PHARMACY_DELETE: 'PHARMACY_DELETE',

    PERMISSION_LIST: 'PERMISSION_LIST',
    PERMISSION_BY_ID: 'PERMISSION_BY_ID',
    PERMISSION_CREATE: 'PERMISSION_CREATE',
    PERMISSION_UPDATE: 'PERMISSION_UPDATE',
    PERMISSION_DELETE: 'PERMISSION_DELETE',

    LOCK_ORDER_LIST: 'LOCK_ORDER_LIST',
    LOCK_ORDER_BY_ID: 'LOCK_ORDER_BY_ID',
    LOCK_ORDER_CREATE: 'LOCK_ORDER_CREATE',
    LOCK_ORDER_UPDATE: 'LOCK_ORDER_UPDATE',
    LOCK_ORDER_DELETE: 'LOCK_ORDER_DELETE',

    LOCK_PRODUCT_LIST: 'LOCK_PRODUCT_LIST',
    LOCK_PRODUCT_BY_ID: 'LOCK_PRODUCT_BY_ID',
    LOCK_PRODUCT_CREATE: 'LOCK_PRODUCT_CREATE',
    LOCK_PRODUCT_UPDATE: 'LOCK_PRODUCT_UPDATE',
    LOCK_PRODUCT_DELETE: 'LOCK_PRODUCT_DELETE'
}
