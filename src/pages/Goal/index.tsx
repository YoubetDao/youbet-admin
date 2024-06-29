import {
  ActionType,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { GoalInfo, NetworkType, SDK } from 'youbet-sdk';

const sdk = new SDK({
  networkType: NetworkType.Testnet, // or NetworkType.Testnet
});

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<GoalInfo>();
  const [data, setData] = useState<GoalInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const goals = await sdk.client.getAllGoals();
        const filteredGoals = goals
          .filter((goal) => !row || row?.goalType === goal.goalType)
          .filter((goal) => !row || goal.name.includes(row?.name));
        setData(filteredGoals);
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const columns: ProDescriptionsItemProps<GoalInfo>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'text',
    },
    {
      title: '质押金额',
      dataIndex: 'requiredStake',
      valueType: 'text',
      render: (_, record) => record.requiredStake / 1e18 + 'eth',
    },
    {
      title: '参与者人数',
      dataIndex: 'participants',
      valueType: 'text',
      render: (_, record) => record.participants.length,
    },
    {
      title: '目标类型',
      dataIndex: 'goalType',
      valueType: 'select',
      valueEnum: {
        0: { text: '单人模式', status: 'Solo' },
        1: { text: '对赌模式', status: 'Gambling' },
      },
    },
  ];

  return (
    <PageContainer header={{ title: '目标列表' }}>
      <ProTable<GoalInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          optionRender: false, // 关闭默认的重置和搜索按钮
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        onRow={(record) => ({
          onClick: () => {
            setRow(record);
          },
        })}
      />
      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<GoalInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
