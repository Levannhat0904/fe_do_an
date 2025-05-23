import React from 'react';
import { Table, Button, Space, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface DataTableProps {
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  rowKey?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAdd?: () => void;
  emptyText?: string;
  pagination?: any;
  scroll?: any;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  showAddButton = false,
  addButtonText = "Thêm mới",
  onAdd,
  emptyText = "Không có dữ liệu",
  pagination,
  scroll,
}) => {
  return (
    <div>
      {showAddButton && onAdd && (
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            {addButtonText}
          </Button>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        pagination={pagination}
        scroll={scroll}
        locale={{
          emptyText: <Empty description={emptyText} />
        }}
      />
    </div>
  );
};

export default DataTable; 