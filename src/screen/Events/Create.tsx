import { useGetListGame } from "@/hook/useGames";
import { Button, DatePicker, Form, FormProps, GetProps, Input, message, Modal, Select } from "antd"
import { useEffect } from "react";
import { PAGINATION } from "@/config/constant";
import dayjs from 'dayjs';
import { range } from "lodash";
import TextArea from "antd/es/input/TextArea";
import { useCreateEvent, useEventDetail, useUpdateEvent } from "@/hook/useEvents";
import { trans } from "@/locale";

const { RangePicker } = DatePicker;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;


interface Props {
    openModal: boolean,
    eventId: number,
    setOpen: () => void
    resetData: () => void
}

const CreateEvent = (props: Props) => {
    const [formRef] = Form.useForm()
    const {data: eventDetail} = useEventDetail(props.eventId, props.eventId !== 0 && props.openModal)
    
    const { mutate: updateEvent } = useUpdateEvent();
    const { mutate: createEvent } = useCreateEvent();

    const params = {
        pageFrom: 0,
        pageTo: PAGINATION.DEFAULT_PAGE_SIZE - 1,
        text: '',
    }

    const { data: listGame} = useGetListGame(params)

    useEffect(() => {
        if (eventDetail) {
            const detail = eventDetail?.data?.[0]
            formRef.setFieldsValue(detail)
            formRef.setFieldValue('gameId', detail?.game_id);
            const startDate = dayjs(detail?.start_date) || null
            const endDate = dayjs(detail?.end_date) || null
            if (detail?.end_date !== null && detail?.start_date !== null) {
                formRef.setFieldValue('dateFormTo', [startDate, endDate]);
            }
        }
        // eslint-disable-next-line
    }, [eventDetail])

    useEffect(() => {
        if (props.eventId === 0) {
            formRef.resetFields()
        }
        // eslint-disable-next-line
    }, [props.eventId])
    
    const onFinish: FormProps['onFinish'] = (values) => {
        let formattedStartDate = null
        let formattedEndDate = null
        if (values.dateFormTo) {
            const [startDate, endDate] = values.dateFormTo;
            formattedStartDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')
            formattedEndDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')
        }
        const requestData = {
            ...values,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            is_start: props?.eventId !== 0 ? eventDetail?.data?.[0]?.is_start : false,
            game_id: values.gameId
        }
        delete requestData.dateFormTo
        delete requestData.gameId

        if (props.eventId && props.eventId !== 0) {
            updateEvent(requestData)
            message.open({
                type: 'success',
                content: trans('game.update_successful'),
            })
        } else {
            createEvent(requestData)
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

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(20, 4),
            disabledMinutes: () => range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    };

    return <>
        <Modal
            width={600}
            title={props.eventId !== 0 ? trans('campaign.edit_campaigns') : trans('campaign.add_new_campaign')}
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
                    label={trans('campaign.campaign_code')}
                    name="code"
                    rules={[{ required: true, message: trans('campaign.required_code') }]}
                    >
                    <Input placeholder="Code"/>
                </Form.Item>
                <Form.Item
                    label={trans('campaign.name_capaign')}
                    name="name"
                    rules={[{ required: true, message: trans('campaign.required_name') }]}
                    >
                    <Input placeholder={trans('campaign.name_capaign')}/>
                </Form.Item>
                <Form.Item
                    label="Game"
                    name="gameId">
                    <Select
                        mode="multiple"
                        showSearch={false}
                        placeholder={trans('campaign.select_games')}
                        style={{ width: '100%' }}
                        options={listGame?.data || []}
                        fieldNames={{label: 'name', value: 'id'}}
                    />
                </Form.Item>
                <Form.Item
                    label={trans('campaign.time')}
                    name="dateFormTo">
                    <RangePicker
                        disabledDate={disabledDate}
                        disabledTime={disabledRangeTime}
                        style={{ width: '100%' }}
                        placeholder={[trans('campaign.start'), trans('campaign.End')]}
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>
                <Form.Item
                    label={trans('game.description')}
                    name="description"
                    >
                    <TextArea autoSize={{ minRows: 2, maxRows: 8 }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="float-end">
                    {trans('button.save')}
                </Button>
                <Button type="default" onClick={handleCancel} className="float-end mr-3">
                    {trans('button.cancel')}
                </Button>
            </Form>
        </Modal>
    </>
}

export default CreateEvent