import { useCreateGame, useGameDetail, useUpdateGame } from "@/hook/useGames";
import { trans } from "@/locale";
// import { InfiniteData, QueryObserverResult } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, message, Modal, Switch } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";

interface Props {
    openModal: boolean,
    gameId: number,
    setOpen: () => void
    resetData: () => void
}

const CreateGames = (props: Props) => {
    const [formRef] = Form.useForm()
    const {data: gameDetail} = useGameDetail(props.gameId, props.gameId !== 0 && props.openModal)
    
    const { mutate: updateGame } = useUpdateGame();
    const { mutate: createGame } = useCreateGame();

    useEffect(() => {
        formRef.setFieldsValue(gameDetail?.data?.[0])

        // eslint-disable-next-line
    }, [gameDetail])

    useEffect(() => {
        if (props.gameId === 0) {
            formRef.resetFields()
        }
        // eslint-disable-next-line
    }, [props.gameId])
    
    const onFinish: FormProps['onFinish'] = (values) => {
        if (props.gameId && props.gameId !== 0) {
            updateGame(values)
            message.open({
                type: 'success',
                content: trans('game.update_successful'),
            })
        }else {
            createGame(values)
            message.open({
                type: 'success',
                content: trans('game.create_success'),
            })
        }
        props?.setOpen()
        props.resetData()
        formRef.resetFields()
    };

    const handleCancel = () => {
        formRef.resetFields()
        props?.setOpen()
    };

    return <>
        <Modal
            title={props.gameId !== 0 ? trans('game.edit_game') : trans('game.create_game')}
            open={props?.openModal}
            onCancel={handleCancel}
            footer={<></>}
        >
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                form={formRef}
                autoComplete="off"
                className="py-5"
            >
                <Form.Item
                    name="id"
                    hidden>
                    <Input />
                </Form.Item>
                <Form.Item
                    label={trans("game.code_game")}
                    name="code"
                    rules={[{ required: true, message: trans('game.required_code_game') }]}
                    >
                    <Input placeholder="Code"/>
                </Form.Item>
                <Form.Item
                    label="Icon"
                    name="icon"
                    >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Games"
                    name="name"
                    rules={[{ required: true, message: trans("game.required_game") }]}
                    >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={trans("game.description")}
                    name="description"
                    >
                    <TextArea autoSize={{ minRows: 2, maxRows: 8 }} />
                </Form.Item>
                <Form.Item
                    label="Url Game"
                    name="url"
                    rules={[{ required: true, message: trans("game.required_url_game") }]}
                    >
                    <Input />
                </Form.Item>
                <Form.Item label={trans('game.status')} name="is_active" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="float-end">
                    {trans("button.save")}
                </Button>
                <Button type="default" onClick={handleCancel} className="float-end mr-3">
                    {trans("button.cancel")}
                </Button>
            </Form>
        </Modal>
    </>
}

export default CreateGames