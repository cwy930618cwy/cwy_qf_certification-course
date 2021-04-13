import ElementUi from 'element-ui'
const log = {
    success(data) {
		console.log(ElementUi)
        ElementUi.Message({
            message: data || '操作成功',
            type: 'success'
        })
    },
    err(data) {
		console.log(ElementUi)
        ElementUi.Message({
            message: data || '操作失败',
            type: 'error'
        })
    }
}
export { log }
