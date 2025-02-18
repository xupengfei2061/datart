import { Checkbox, Table, TableColumnProps } from 'antd';
import { LoadingMask } from 'app/components';
import produce from 'immer';
import { Key, memo, useCallback, useMemo } from 'react';
import styled from 'styled-components/macro';
import { SPACE_TIMES } from 'styles/StyleConstants';
import { DefaultValue } from '../DefaultValue';
import { RowPermissionSubject, Variable } from '../slice/types';

interface SubjectFormProps {
  type: 'role' | 'member';
  visible: boolean;
  editingVariable: undefined | Variable;
  loading: boolean;
  listLoading: boolean;
  selectedRowKeys: Key[];
  rowPermissionSubjects: undefined | RowPermissionSubject[];
  onSelectedRowKeyChange: (rowKeys: Key[]) => void;
  onRowPermissionSubjectChange: (
    rowPermissionSubjects: undefined | RowPermissionSubject[],
  ) => void;
}

export const RowPermissionTable = memo(
  ({
    type,
    visible,
    editingVariable,
    loading,
    listLoading,
    selectedRowKeys,
    rowPermissionSubjects,
    onSelectedRowKeyChange,
    onRowPermissionSubjectChange,
  }: SubjectFormProps) => {
    const checkUseDefaultValue = useCallback(
      id => e => {
        onRowPermissionSubjectChange(
          produce(rowPermissionSubjects, draft => {
            const permission = draft?.find(p => p.id === id)!;
            permission.useDefaultValue = e.target.checked;
          }),
        );
      },
      [rowPermissionSubjects, onRowPermissionSubjectChange],
    );

    const valueChange = useCallback(
      id => value => {
        onRowPermissionSubjectChange(
          produce(rowPermissionSubjects, draft => {
            const permission = draft?.find(p => p.id === id)!;
            permission.value = value;
          }),
        );
      },
      [rowPermissionSubjects, onRowPermissionSubjectChange],
    );

    const columns: TableColumnProps<RowPermissionSubject>[] = useMemo(
      () => [
        { dataIndex: 'name', title: '名称' },
        {
          title: '使用变量默认值',
          width: SPACE_TIMES(32),
          render: (_, record) => {
            return (
              <Checkbox
                checked={record.useDefaultValue}
                disabled={!selectedRowKeys.includes(record.id)}
                onChange={checkUseDefaultValue(record.id)}
              />
            );
          },
        },
        {
          title: '值',
          width: SPACE_TIMES(72),
          render: (_, record) =>
            editingVariable && (
              <DefaultValue
                type={editingVariable.valueType}
                expression={false}
                disabled={
                  !selectedRowKeys.includes(record.id) || record.useDefaultValue
                }
                value={record.value}
                onChange={valueChange(record.id)}
              />
            ),
        },
      ],
      [selectedRowKeys, editingVariable, checkUseDefaultValue, valueChange],
    );

    const rowClassName = useCallback(
      (record: RowPermissionSubject) => {
        return selectedRowKeys.includes(record.id) ? '' : 'disabled-row';
      },
      [selectedRowKeys],
    );

    return (
      <LoadingMask loading={loading}>
        <TableWrapper visible={visible}>
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            loading={listLoading}
            dataSource={rowPermissionSubjects}
            rowClassName={rowClassName}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectedRowKeyChange,
            }}
            bordered
          />
        </TableWrapper>
      </LoadingMask>
    );
  },
);

const TableWrapper = styled.div<{ visible: boolean }>`
  display: ${p => (p.visible ? 'block' : 'none')};

  .disabled-row {
    color: ${p => p.theme.textColorDisabled};
    cursor: not-allowed;
    background-color: ${p => p.theme.bodyBackground};
  }
`;
