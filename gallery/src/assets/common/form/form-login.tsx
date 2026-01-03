'use client';
import { Button, Form, Input } from 'antd';
import styles from './form-login.module.scss';
import { showError, showSuccess } from '@/assets/lib/message';
import { authService } from '@/assets/services';
import { useRouter } from 'next/navigation';
import { useUser } from '@/assets/providers/user.provider';

interface IProps {
  changePage?: (page: 'login' | 'register') => void;
}
const FormLogin = ({ changePage = () => { } }: IProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { refreshUser } = useUser();

  const onFinish = async (values: any) => {
    try {
      const resp = await authService.login(values);
      console.log('resp', resp);
      showSuccess(resp.message);
      // Refresh user data after login
      await refreshUser();
      router.push('/home');
    } catch (error: any) {
      console.log('Login error:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Login failed';
      showError(errorMessage);
    }
  };

  return (
    <div className={styles.formLogin}>
      <h1 className={styles.title}>Welcome to Pinterest</h1>

      <Form
        form={form}
        name="login_form"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
      >
        <Form.Item
          label="Email"
          name="email"
          className={styles.formItem}
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' }
          ]}
        >
          <Input placeholder="Email" className={styles.input} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          className={styles.formItem}
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Password" className={styles.input} />
        </Form.Item>

        <div className={styles.forgotPassword}>
          <a href="/forgot-password" className={styles.forgotLink}>Forgot your password?</a>
        </div>

        <Form.Item className={styles.formItem}>
          <Button htmlType="submit" className={styles.loginButton} block>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div className={styles.separator}>
        <span className={styles.separatorLine}></span>
        <span className={styles.separatorText}>OR</span>
        <span className={styles.separatorLine}></span>
      </div>

      <div className={styles.footerText}>
        Not on Pinterest yet?{' '}
        <span
          className={styles.signupLink}
          onClick={() => {
            if (changePage) {
              changePage('register');
            }
          }}
        >
          Sign up
        </span>
      </div>
    </div>
  );
}

export default FormLogin;