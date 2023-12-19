import { size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Space, Table, Modal, Flex } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"
import Link from 'next/link';

const Invoice = () => {

    const [open, setOpen] = useState(false);
    const { Search } = Input;
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [dataSource, setDataSource] = useState([])
    const [formFields, setFormFields] = useState([])
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerAddress, setCustomerAddress] = useState('');


    useEffect(() => {
        getInvoice()
    }, [])

    const getInvoice = (() => {
        axios.get("http://files.covaiciviltechlab.com/invoice_list/", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setDataSource(res?.data)
        }).catch((error: any) => {
            console.log(error)
        })
    })
    console.log("datasource", dataSource)


    useEffect(() => {
        axios.get("http://files.covaiciviltechlab.com/create_invoice/", {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            setFormFields(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    }, [])

    console.log("formFields", formFields)



    // useEffect(() => {
    //     if (editRecord) {
    //         setDrawerTitle("Edit Tax");
    //     } else {
    //         setDrawerTitle("Create Tax");
    //     }
    // }, [editRecord, open]);



    // drawer
    const showDrawer = () => {
        setOpen(true);
     
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
        setCustomerAddress('')
    };



    const columns = [
        {
            title: 'Invoice Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: 'Advance',
            dataIndex: 'advance',
            key: 'advance',
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: any) => (

                <Space size="middle">
                    <Link href='/invoice/preview'>
                        <EyeOutlined style={{ cursor: "pointer" }}
                            className='view-icon' rev={undefined} />
                    </Link>
                    <Link href='/invoice/edit'>
                        <EditOutlined
                            style={{ cursor: "pointer" }}
                            className='edit-icon' rev={undefined} />
                    </Link>
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(record)} className='delete-icon' rev={undefined} />
                </Space>
            ),
        }
    ];


    const handleDelete = (record: any) => {
        // Implement your delete logic here
        console.log(`Delete record with key ${record}`);

        Modal.confirm({
            title: "Are you sure, you want to delete this TAX record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                console.log(record, "values")
                axios.delete(`http://files.covaiciviltechlab.com/delete_invoice/${record.id}`,{
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("token")}`
                    }
                }).then((res) => {
                    console.log(res)
                    getInvoice()
                }).catch((err: any) => {
                    console.log(err)
                })

            },

        });
    };

    // input search
    const onSearch = (value: string, _e: any, info: any) => {
        const filteredData = dataSource.filter((item: any) =>
            item.taxName.toLowerCase().includes(value.toLowerCase())
        );

        setDataSource(filteredData);
    };


    // form submit
    const onFinish = (values:any) => {
    const Token = localStorage.getItem("token");
console.log("valuesvaluesvaluesvaluesvalues", values)

    const body = {
        customer: values.customer,
        project_name: values.project_name,
        advance: values.advance,
        balance: values.balance,
        discount: values.discount,
        sales_mode: values.sales_mode,
        tax: values.tax,
        id: values.id
    };

    axios.post("http://files.covaiciviltechlab.com/create_invoice/", body, {
        headers: {
            "Authorization": `Token ${Token}`
        }
    }).then((res) => {
        getInvoice();
        console.log(res?.data);
        setOpen(false);
    }).catch((error) => {
        console.log(error);
    });

    form.resetFields();
    onClose();
};

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        discount?: string;
        advance?: string;
        balance?: string;
        customer?: string;
        beforeTax?: string;
        afterTax?: string;
    };


   
    const handleSelectChange = (customerId: any) => {
        // Find the selected customer in the data array
        const selectedCustomer = formFields?.customer?.find((customer: any) => customer.id === customerId);

        // Update the state with the selected customer's address
        setSelectedCustomerId(customerId);
        setCustomerAddress(selectedCustomer?.address1 || '');
        console.log("customerAddress", customerAddress)
    };
  
    return (
        <>
            <div>
                <div className='tax-heading-main'>
                    <div>
                        <h1 className='tax-title'>Manage Invoices</h1>
                    </div>
                    <div>
                        <Search placeholder="input search text" onSearch={onSearch} enterButton className='search-bar' />
                        <button type='button' className='create-button' onClick={() => showDrawer()}>+ Create Tax</button>
                    </div>
                </div>
                <div>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                </div>

                <Drawer title="Create Invoice" placement="right" width={600} onClose={onClose} open={open}>
                    <Form
                        name="basic-form"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}
                    >
                        {/* <div style={{ border: "1px solid gray", padding: "20px" }}> */}
                            <p style={{ textAlign: "center", color: "blue", fontSize: "22px", fontWeight: "600", paddingBottom: "30px" }}>Invoice Number :<span style={{ color: "red" }}> 02322</span></p>
                            <Form.Item
                                label="customer Name"
                                name="customer"
                                required={false}
                                rules={[{ required: true, message: 'Please select Material Name!' }]}
                            >
                                <Select onChange={handleSelectChange}
                                    placeholder="Select a customer"
                                    value={selectedCustomerId}>
                                    {formFields?.customer?.map((val: any) => (
                                        <Select.Option key={val.id} value={val.id}>
                                            {val.customer_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Input.TextArea rows={4}  value={customerAddress}   />
                            </Form.Item>

                            <Form.Item
                                label="Project Name"
                                name="project_name"
                                required={false}
                                rules={[{ required: true, message: 'Please input your Project Name!' }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item label="Sales Mode" name='sales_mode'>
                                <Select>
                                    {formFields?.sales_mode?.map((val: any) => (
                                        <Select.Option key={val.id} value={val.id}>
                                            {val.sales_mode}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* <Form.Item label="Material ID" name='materialId'>
                                <Select>
                                    {formFields?.taxs?.map((val: any) => (
                                        <Select.Option key={val.id} value={val.id}>
                                            {val.tax_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item> */}

                            <Form.Item >
                                {/* <Space> */}
                                <div className='form-btn-main'>
                                    <Space>
                                        <Button danger htmlType="submit" onClick={() => onClose()}>
                                            cancel
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Space>

                                </div>
                                {/* <Button htmlType="submit" style={{ borderColor: "blue", color: "blue" }}>
                                        Add Invoice Test
                                    </Button> */}
                                {/* </Space> */}
                            </Form.Item>
                        {/* </div> */}
                    </Form>

                    {/* <div style={{ paddingTop: "50px" }}>
                        <Table dataSource={dataSource2} columns={columns2} />
                    </div>

                    <Form
                        name="basic"
                        layout="vertical"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Discount( % )"
                            name="discount"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Amount Before Tax"
                            name="beforeTax"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Percentage!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Amount After Tax"
                            name="afterTax"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Advance"
                            name="advance"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Balance"
                            name="balance"
                            required={false}
                            rules={[{ required: true, message: 'Please input your Tax Status!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item >
                            <div className='form-btn-main'>
                                <Space>
                                    <Button danger htmlType="submit" onClick={() => onClose()}>
                                        cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space>

                            </div>

                        </Form.Item>
                    </Form> */}
                </Drawer>

            </div>
        </>
    )
}

export default Invoice