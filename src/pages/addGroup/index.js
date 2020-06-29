//@flow
import React, { Component } from "react";
import { Row, Col, Card, Form, Upload, Typography, message } from "antd";
import addGroupcss from "./addGroup.module.css";
import InputText from "../../UIKIT/InputText";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import UIKITBUTTON from "../../UIKIT/button/UIKITBUTTON";
import Group from "../../assets/images/group";

import { connect } from "react-redux";

const { Text } = Typography;
const _accessToken = localStorage.getItem("access_token");

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class index extends Component {
  state = {
    company_name: "",
    website: "",
    image: null,
    loading: false,
    imageUrl: null,
  };
  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      this.setState({ image: info.file.originFileObj });
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl: imageUrl,
          loading: false,
        })
      );
    }
  };
  handleSubmit = () => {
    const data = new FormData();
    if (this.state.company_name && this.state.website) {
      data.append("name", this.state.company_name);
      data.append("website", this.state.website);
      data.append("members", this.props.user.Auth.userId);
      data.append("myFile", this.state.image);

      const url = `${process.env.REACT_APP_BACKEND_URL}/api/group/createGroup`;
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + _accessToken,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status === 201) {
            let action = {
              type: "SET_GROUP",
              data: response.groupID,
            };
            this.props.dispatch(action);
            localStorage.setItem("group", response.groupID);
            window.location = "/dashboard";
          } else {
            message.error("Something went wrong please retry");
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      message.error("company name and website are required");
    }
  };
  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Row style={{ overflow: "hidden" }}>
        <Col xs={0} sm={0} md={8} lg={8} xl={8} style={{ height: "100vh" }}>
          <Group />
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card className={addGroupcss.cardRegister}>
            <h1 className={addGroupcss.title}>Add your company</h1>
            <div className={addGroupcss.divLogin}>
              <Form className="login-form" >
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter company name",
                    },
                  ]}>
                  <InputText
                    label="Company Name"
                    placeholder="name"
                    onChange={(event) => {
                      this.setState({
                        company_name: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="website"
                  rules={[
                    {
                      required: true,
                      message: "Please enter company website",
                    },
                  ]}>
                  <InputText
                    label="website"
                    placeholder="www.."
                    onChange={(event) => {
                      this.setState({
                        website: event.target.value,
                      });
                    }}
                  />
                </Form.Item>

                <Text className={addGroupcss.labelForm}>Company Logo</Text>
                <br />
                <Form.Item>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "50%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>

                {/* <p style={{ color: "red" }}>{this.state.errorMsg}</p> */}
                <Form.Item>
                  <UIKITBUTTON
                    text={"Continue"}
                    action={() => this.handleSubmit()}
                  />
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
