import { localStore } from "@/util/LocalStore"
import supabase from "@/util/SupabaseClient"
import { Button, Form, Input, message } from "antd"
import { useNavigate } from "react-router-dom"

export const Login = () => {
  const navigate = useNavigate()

  const handleLogin = async (values: any) => {
    const { data, error } = await supabase.auth.signInWithPassword(values)

    console.log(values);

    if (error) {
      console.log(error.message)
      message.error(error.message)
    } else {
      localStore.setItem("supabaseSession", JSON.stringify(data.session))
      localStore.setItem("supabaseUser", JSON.stringify(data.user))
      navigate("/")
    }
  }

  return (
    <div className="relative w-screen h-screen flex justify-center items-center px-[15px]">
      <img
        src="/kfc_store.webp"
        alt="login"
        className="absolute top-0 left-0 z-0 w-full h-full object-cover"
      />
      <div className="bg-white rounded-lg w-full max-w-[400px] relative z-10 px-6 pt-10 pb-6">
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: 'email', message: "Email không hợp lệ!" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" }
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
