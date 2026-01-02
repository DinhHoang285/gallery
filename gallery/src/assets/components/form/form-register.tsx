'use client';
import { Button, Form, Input, DatePicker } from 'antd';
import { QuestionCircleOutlined, GoogleOutlined } from '@ant-design/icons';
import styles from './form-register.module.scss';
import Image from 'next/image';

interface IProps {
  changePage: (page: 'login' | 'register') => void;
}
const FormRegister = ({ changePage }: IProps) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Register values:', values);
  };

  return (
    <div className={styles.formRegister}>
      {/* Logo Pinterest */}
      <div className={styles.logoWrapper}>
        {/* <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
          alt="Pinterest"
          width={40}
          height={40}
        /> */}
      </div>

      <h1 className={styles.title}>Welcome to Pinterest</h1>
      <p className={styles.subtitle}>Find new ideas to try</p>

      <Form
        form={form}
        name="register_form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please create a password!' }]}
        >
          <Input.Password placeholder="Create a password" />
        </Form.Item>
        <p className={styles.hintText}>Use 8 or more letters, numbers and symbols</p>

        <Form.Item
          label={<span>Birthdate <QuestionCircleOutlined /></span>}
          name="birthdate"
          rules={[{ required: true, message: 'Please select your birthdate!' }]}
        >
          <DatePicker
            placeholder="dd/mm/yyyy"
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.continueButton} block>
            Continue
          </Button>
        </Form.Item>

        <div className={styles.divider}>OR</div>

        <Form.Item>
          <Button className={styles.googleButton} icon={<GoogleOutlined />} block>
            Continue as Hoang
          </Button>
        </Form.Item>

        <p className={styles.termsText}>
          By continuing, you agree to Pinterest's
          <a href="#"> Terms of Service</a> and acknowledge you've read our
          <a href="#"> Privacy Policy</a>.
        </p>

        <div className={styles.footerLink}>
          Already a member? <span onClick={() => changePage('login')}>Log in</span>
        </div>
      </Form>

      <div className={styles.businessFooter}>
        <a href="#">Create a free business account</a>
      </div>
    </div>
  );
}

export default FormRegister;