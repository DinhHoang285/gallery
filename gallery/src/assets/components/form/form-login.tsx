import { Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './form-login.module.scss';
import { showError, showSuccess } from '@/assets/lib/message';
import { authService } from '@/assets/services';
import { useRouter } from 'next/navigation';

interface IProps {
  changePage: (page: 'login' | 'register') => void;
}
const FormLogin = ({ changePage }: IProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const onFinish = async (values: any) => {
    try {
      const resp = await authService.login(values);
      console.log('resp', resp);

      // showSuccess(resp.message);
      // router.push('/home');
    } catch (error: any) {
      showError(error?.message || error?.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className={styles.formLogin}>
      <h2>Log in to see more</h2>
      <Form
        form={form}
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Email or Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email or Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <div className={styles.options}>
          {/* <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
          <a href="/forgot-password" className={styles.forgotLink}>Forgot password?</a>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginButton} block>
            SIGN IN
          </Button>
        </Form.Item>

        <div className={styles.footerText}>
          Don't have an account? <span onClick={() => changePage('register')}>Register now</span>
        </div>
      </Form>
    </div>
  );
}

export default FormLogin;