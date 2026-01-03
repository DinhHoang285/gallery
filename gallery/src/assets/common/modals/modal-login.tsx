'use client';

import React from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './modal-login.module.scss';
import FormLogin from '../form/form-login';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const ModalLogin = ({ isOpen, onCancel }: Props) => {


  return (
    <Modal
      title={<div className={styles.title}>SIGN IN</div>}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      centered
      className={styles.modalCustom}
    >
      <FormLogin changePage={() => { console.log('changePage') }} />
    </Modal>
  );
};

export default ModalLogin;