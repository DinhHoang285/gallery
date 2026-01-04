'use client';
import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { authService } from '@/assets/services';
import { showError, showSuccess } from '@/assets/lib/message';
import { useUser } from '@/assets/providers/user.provider';
import styles from './style.module.scss';

const LoginComponent = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { refreshUser } = useUser();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const resp = await authService.login(values);
      showSuccess(resp.message);

      // Wait for user data to be refreshed before redirecting
      await refreshUser();

      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Login failed';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.formContainer}>
        <div className={styles.logoWrapper}>
          <h1 className={styles.title}>Admin Login</h1>
        </div>
        <Form
          form={form}
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
          className={styles.form}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
            className={styles.formItem}
          >
            <Input placeholder="Email" className={styles.input} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
            className={styles.formItem}
          >
            <Input.Password placeholder="Password" className={styles.input} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
              block
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginComponent;

