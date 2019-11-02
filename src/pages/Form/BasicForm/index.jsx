import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class BasicForm extends Component {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'formAndBasicForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    return (
      <PageHeaderWrapper content={<FormattedMessage id="formandbasicform.basic.description" />}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasicform.title.label" />}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'formandbasicform.title.required',
                    }),
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'formandbasicform.title.placeholder',
                  })}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasicform.date.label" />}
            >
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'formandbasicform.date.required',
                    }),
                  },
                ],
              })(
                <RangePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder={[
                    formatMessage({
                      id: 'formandbasicform.placeholder.start',
                    }),
                    formatMessage({
                      id: 'formandbasicform.placeholder.end',
                    }),
                  ]}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasicform.goal.label" />}
            >
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'formandbasicform.goal.required',
                    }),
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder={formatMessage({
                    id: 'formandbasicform.goal.placeholder',
                  })}
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasicform.standard.label" />}
            >
              {getFieldDecorator('standard', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'formandbasicform.standard.required',
                    }),
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder={formatMessage({
                    id: 'formandbasicform.standard.placeholder',
                  })}
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="formandbasicform.client.label" />
                  <em className={styles.optional}>
                    <FormattedMessage id="formandbasicform.form.optional" />
                    <Tooltip title={<FormattedMessage id="formandbasicform.label.tooltip" />}>
                      <Icon
                        type="info-circle-o"
                        style={{
                          marginRight: 4,
                        }}
                      />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('client')(
                <Input
                  placeholder={formatMessage({
                    id: 'formandbasicform.client.placeholder',
                  })}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="formandbasicform.invites.label" />
                  <em className={styles.optional}>
                    <FormattedMessage id="formandbasicform.form.optional" />
                  </em>
                </span>
              }
            >
              {getFieldDecorator('invites')(
                <Input
                  placeholder={formatMessage({
                    id: 'formandbasicform.invites.placeholder',
                  })}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="formandbasicform.weight.label" />
                  <em className={styles.optional}>
                    <FormattedMessage id="formandbasicform.form.optional" />
                  </em>
                </span>
              }
            >
              {getFieldDecorator('weight')(
                <InputNumber
                  placeholder={formatMessage({
                    id: 'formandbasicform.weight.placeholder',
                  })}
                  min={0}
                  max={100}
                />,
              )}
              <span className="ant-form-text">%</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="formandbasicform.public.label" />}
              help={<FormattedMessage id="formandbasicform.label.help" />}
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      <FormattedMessage id="formandbasicform.radio.public" />
                    </Radio>
                    <Radio value="2">
                      <FormattedMessage id="formandbasicform.radio.partially-public" />
                    </Radio>
                    <Radio value="3">
                      <FormattedMessage id="formandbasicform.radio.private" />
                    </Radio>
                  </Radio.Group>,
                )}
                <FormItem
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder={formatMessage({
                        id: 'formandbasicform.publicUsers.placeholder',
                      })}
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">
                        <FormattedMessage id="formandbasicform.option.A" />
                      </Option>
                      <Option value="2">
                        <FormattedMessage id="formandbasicform.option.B" />
                      </Option>
                      <Option value="3">
                        <FormattedMessage id="formandbasicform.option.C" />
                      </Option>
                    </Select>,
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="formandbasicform.form.submit" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
              >
                <FormattedMessage id="formandbasicform.form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading }) => ({
    submitting: loading.effects['formAndBasicForm/submitRegularForm'],
  }))(BasicForm),
);
