import React, { useEffect, useState } from 'react'
import { Space, Table, Modal,Select, } from 'antd';
import { Button, Drawer } from 'antd';
import { Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"

import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const Material = () => {

  const [open, setOpen] = useState(false);
  const { Search } = Input;
  const [form] = Form.useForm();
  const [DrawerTitle, setDrawerTitle] = useState("Create Material")
  const [editRecord, setEditRecord] = useState<any>(null)
  const [dataSource, setDataSource] = useState([])
  const [viewRecord, setViewRecord] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editor, setEditor] = useState("")
  const [formFields, setFormFields] = useState<any>([])
  // Model 
  const showModal = (record: any) => {
    setIsModalOpen(true);
    setViewRecord(record)
    modalData()
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  // Get Material Data
  useEffect(() => {
    getMaterial()
    getDropDown()
  }, [])

  const getMaterial = (() => {
    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    axios.get("http://files.covaiciviltechlab.com/material_list/",
      {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res) => {
        setDataSource(res?.data)
        setFilterData(res.data)
      }).catch((error: any) => {
        console.log(error)
      })
  })

  const getDropDown = (() => {

    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    axios.get("http://files.covaiciviltechlab.com/create_report_template/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setFormFields(res?.data)
    }).catch((error: any) => {
      console.log(error)
    })


  })


  useEffect(() => {
    if (editRecord) {
      setDrawerTitle("Edit Material")
    } else {
      setDrawerTitle("Create Material")
    }
  }, [editRecord])

  
  // editor
  const handleEditorChange = (value: any) => {
    setEditor(value);
  };

  // drawer
  const showDrawer = (record: any) => {
    if (record) {
      setEditRecord(record)
      form.setFieldsValue(record)
    }
    else {
      setEditRecord(null)
      form.resetFields()
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields()
  };


  const columns = [
    {
      title: 'Material Name',
      dataIndex: 'material_name',
      key: 'material_name',
    },

    {
      title: 'Created At',
      dataIndex: 'created_date',
      key: 'created_date',
      render: (text: any, record: any) => {
        // Assuming created_date is in the format: 2023-12-12T08:41:09.567980Z
        const date = new Date(text);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(date);

        return <span>{formattedDate}</span>;
      },
    },
    // {
    //   title: 'Tax Status',
    //   dataIndex: 'taxStatus',
    //   key: 'taxStatus',
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (

        <Space size="middle">
          <EyeOutlined style={{ cursor: "pointer" }}
            onClick={() => showModal(record)} className='view-icon' rev={undefined} />
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record)}
            className='edit-icon' rev={undefined} />

{
            localStorage.getItem('admin') === 'true' ? (
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(record)}
                className='delete-icon'
                rev={undefined}
              />
            ) : (
              <DeleteOutlined
                style={{ display: "none" }}
                onClick={() => handleDelete(record)}
                className='delete-icon'
                rev={undefined}
              />
            )
          }

        
        </Space>
      ),
    }
  ];



  const handleDelete = (record: any) => {
    // Implement your delete logic here
    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    Modal.confirm({
      title: "Are you sure, you want to delete this MATERIAL record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        console.log("values", record)
        axios.delete(`http://files.covaiciviltechlab.com/delete_material/${record.id}`, {
          headers: {
            "Authorization": `Token ${Token}`
          }
        }).then((res) => {
          console.log(res)
          getMaterial()
        }).catch((err) => {
          console.log(err)
        })

      },

    });
  };

  const [filterData, setFilterData] = useState(dataSource )

  const inputChange = (e:any) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = dataSource.filter((item:any) =>
      item?.material_name?.toLowerCase().includes(searchValue)
    );
    setFilterData(searchValue ? filteredData : dataSource);
  };




  // form submit
  const onFinish = (values: any) => {
    console.log('Success:', values);

    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    if (editRecord) {
      axios.put(`http://files.covaiciviltechlab.com/edit_material/${editRecord.id}/`, values, {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res: any) => {
        getMaterial()
        console.log(res)
      }).catch((error: any) => {
        console.log(error)
      })

    } else {
      axios.post("http://files.covaiciviltechlab.com/create_material/", values, {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res: any) => {
        getMaterial()
        console.log(res)
      }).catch((error) => {
        console.log(error)
      })

      form.resetFields();

    }
    // Close the drawer
    onClose();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    material_name?: string;
  };

  console.log("dataSource", dataSource)


  // modal data
  const modalData = () => {
    const formatDate = (dateString: any) => {
      if (!dateString) {
        return "N/A"; // or handle it according to your requirements
      }

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid Date"; // or handle it according to your requirements
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    };

    const data = [
      {
        label: "Material Name:",
        value: viewRecord?.material_name || "N/A",
      },
      {
        label: "Created By:",
        value: viewRecord?.created_by || "N/A",
      },
      {
        label: "Created Date:",
        value: formatDate(viewRecord?.created_date),
      },
      {
        label: "Modified By:",
        value: viewRecord?.modified_by || "N/A",
      },
      {
        label: "Modified Date:",
        value: formatDate(viewRecord?.modified_date) || "N/A"
      },
    ];

    return data;
  };


  return (
    <>
      <div  className='panel'>
        <div className='tax-heading-main'>
          <div>
            <h1 className='text-lg font-semibold dark:text-white-light'>Manage Material</h1>
          </div>
          <div>
          <Search placeholder="Input search text" onChange={inputChange} enterButton className='search-bar' />
            <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Material</button>
          </div>
        </div>
        <div  className='table-responsive'>
          <Table dataSource={filterData} columns={columns} />
        </div>

        <Drawer title={DrawerTitle} placement="right" width={600} onClose={onClose} open={open}>
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
              label="Material Name"
              name="material_name"
              required={true}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Templates"
              name="template"
              required={true}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <ReactQuill
                value={editor}
                onChange={handleEditorChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2,3,4,5,6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image", "video"],
                    ["clean"],
                    ['code'],
                    // Add your custom features here
                  ],
                }}
              />
            </Form.Item>


            <Form.Item label="Print Format" name='print_format'
             required={true}
             rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Select>
                {
                  formFields?.print_format?.map((val: any) => {
                    return (
                      <Select.Option value={val.id}>{val.name}</Select.Option>

                    )
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="Letter Pad Logo" name='letter_pad_logo'
             required={true}
             rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Select>
                {
                  formFields?.letter_pad_logo?.map((val: any) => {
                    return (
                      <Select.Option value={val?.id}>{val?.name}</Select.Option>

                    )
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item >
              <div className='form-btn-main'>
                <Space>
                  <Button danger htmlType="submit" onClick={() => onClose()}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Space>

              </div>

            </Form.Item>
          </Form>
        </Drawer>

        {/* modal */}
        <Modal title="View Material" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
          {
            modalData()?.map((value: any) => {
              return (
                <>
                  <div className='content-main' >
                    <p className='content-1'>{value?.label}</p>
                    <p className='content-2'>{value?.value}</p>
                  </div>
                </>
              )
            })
          }
        </Modal>

      </div>
    </>
  )
}

export default Material