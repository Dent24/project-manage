import { Modal, Form, Input, Select, Radio } from 'antd';

const IssuePop = ({ isEdit, isModalOpen, handleOk, setIsModalOpen, adding, addForm, user }) => {
  return (
    <Modal
      title={isEdit ? '修改項目' : '新增項目'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={()=>setIsModalOpen(false)}
      closeIcon={false}
      keyboard={false}
      maskClosable={false}
      confirmLoading={adding}
    >
      <Form form={addForm}>
        <Form.Item
          label="項目名稱"
          name="name"
          rules={[{ required: true, message: '請輸入名稱' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="指派對象"
          name="assign"
        >
          <Select>
            {Object.entries(user).map(([key, name]) => <Select.Option key={key} value={key}>{name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label="內容"
          name="content"
          rules={[{ required: true, message: '請輸入任意內容' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="類型"
          name="type"
          rules={[{ required: true, message: '請輸入項目類型' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="Bug">Bug</Radio.Button>
            <Radio.Button value="Task">Task</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="緊急程度"
          name="level"
          rules={[{ required: true, message: '請輸入緊急程度' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={1}>Normal</Radio.Button>
            <Radio.Button value={2}>Priority</Radio.Button>
            <Radio.Button value={3}>Urgent</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IssuePop;