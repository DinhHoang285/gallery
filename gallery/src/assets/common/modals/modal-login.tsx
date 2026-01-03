'use client';

import React from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './modal-login.module.scss';
import FormLogin from '../form/form-login';
import { useMainThemeLayout } from '@/assets/providers/main-layout.provider';
import FormRegister from '../form/form-register';


const ModalLogin = () => {
  const { modal, setState } = useMainThemeLayout();

  const handleCancel = () => {
    setState('modal', null);
  };


  return (
    <Modal
      title={<div className={styles.title}>SIGN IN</div>}
      open={modal === 'login' || modal === 'register'}
      onCancel={handleCancel}
      footer={null}
      centered
      className={styles.modalCustom}
    >
      {modal === 'login' && <FormLogin />}
      {modal === 'register' && <FormRegister />}
    </Modal>
  );
};

export default ModalLogin;