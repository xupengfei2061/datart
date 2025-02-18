/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Form, FormInstance, Input, Modal } from 'antd';
import { FC, memo, useRef } from 'react';
import { useI18NPrefix } from '../ChartWorkbenchPage/hooks';

const INPUT_PASSWORD_KEY = 'password-input';

const PasswordModal: FC<{
  visible: boolean;
  onChange: (password: string) => void;
}> = memo(({ visible, onChange }) => {
  const t = useI18NPrefix(`share.modal`);
  const formInstance = useRef<FormInstance>(null);

  return (
    <Modal
      title={t('password')}
      visible={visible}
      onOk={() => {
        formInstance?.current
          ?.validateFields()
          .then(() => {
            const useInput = formInstance?.current?.getFieldsValue([
              INPUT_PASSWORD_KEY,
            ]);
            onChange(useInput?.[INPUT_PASSWORD_KEY]);
          })
          .catch(info => {
            return Promise.reject();
          });
      }}
    >
      <Form ref={formInstance}>
        <Form.Item
          label={t('password')}
          name={INPUT_PASSWORD_KEY}
          rules={[{ required: true }]}
        >
          <Input.Password placeholder={t('pleaseInputPassword')} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default PasswordModal;
