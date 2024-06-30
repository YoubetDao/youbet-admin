import {
  ActionType,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Drawer } from 'antd';
import { ethers } from 'ethers';
import React, { useRef, useState } from 'react';
import { GoalInfo, NetworkType, SDK } from 'youbet-sdk';

const sdk = new SDK({
  networkType: NetworkType.Mainnet,
});
const networkOptions = sdk.sdkOptions.networkOptions;
const provider = new ethers.JsonRpcProvider(networkOptions.rpcUrl);
console.log(networkOptions.rpcUrl);
console.log(networkOptions.contractAddress);

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<GoalInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await provider.getLogs({
        address: '0xaCb54d07cA167934F57F829BeE2cC665e1A5ebEF',
        fromBlock: 6000000,
        toBlock: 'latest',
        topics: [],
      });
      console.log(events);
      console.log('events:', events);
      return events;
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  const columns: ProDescriptionsItemProps<GoalInfo>[] = [
    {
      title: 'Transaction Hash',
      dataIndex: 'transactionHash',
    },
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
    },
  ];

  return (
    <PageContainer header={{ title: 'CROAK log' }}>
      <ProTable<any>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async () => {
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here
          const result = await fetchEvents();
          return {
            data: result,
            // Please return true for success.
            // otherwise the table will stop parsing the data, even if there is data
            success: true,
            // not passed will use the length of the data, if it is paged you must pass
            total: result?.length,
          };
        }}
        loading={loading}
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
