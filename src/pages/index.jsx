import React, { useState, useMemo, useEffect } from 'react';
import {
  InputNumber,
  Button,
  Card,
  Form,
  Col,
  Row,
  Input,
  Checkbox,
} from 'antd';
import { useVirtualList } from 'ahooks';
import { MinusOutlined } from '@ant-design/icons';

export default () => {
  const countryList = [
    {
      id: 1,
      abbreviation: 'IE',
      name: '爱尔兰',
    },
    {
      id: 2,
      abbreviation: 'AT',
      name: '奥地利',
    },
    {
      id: 3,
      abbreviation: 'AU',
      name: '澳大利亚',
    },
    {
      id: 4,
      abbreviation: 'BR',
      name: '巴西',
    },
    {
      id: 5,
      abbreviation: 'BE',
      name: '比利时',
    },
    {
      id: 6,
      abbreviation: 'PL',
      name: '波兰',
    },
    {
      id: 7,
      abbreviation: 'DK',
      name: '丹麦',
    },
    {
      id: 8,
      abbreviation: 'DE',
      name: '德国',
    },
    {
      id: 9,
      abbreviation: 'RU',
      name: '俄罗斯',
    },
    {
      id: 10,
      abbreviation: 'FR',
      name: '法国',
    },
    {
      id: 11,
      abbreviation: 'other',
      name: '其他国家',
    },
  ];
  const myConfig = [
    { min_weight: 0, max_weight: 2, ratio: 0.08 },
    { min_weight: 4, max_weight: 5, ratio: 0.08 },
    { min_weight: 8, max_weight: 10, ratio: 0.08 },
    { min_weight: 888, max_weight: 999999, ratio: 0.08 },
  ];
  const [itemValues, setItemValues] = useState({});
  const [checkedCountries, setCheckedCountries] = useState([]);
  const countryOptions = useMemo(
    () =>
      countryList.map(item => ({
        value: item.id,
        label: item.name,
        disabled: item.abbreviation === 'other',
      })) || [],
    [JSON.stringify(countryList)],
  );
  const { list, containerProps, wrapperProps } = useVirtualList(
    checkedCountries,
    {
      overscan: 30,
      itemHeight: 60,
    },
  );

  useEffect(() => {
    setCheckedCountries([
      countryList.find(item => item.abbreviation === 'other')?.id,
    ]);
  }, []);
  useEffect(() => {
    const myValue = {};
    myConfig.forEach(item => {
      myValue[`ratio${item.country_id}`] = item.ratio;
      myValue[`cost${item.country_id}`] = item.base_shipping_amount;
      myValue[`weight${item.country_id}`] = item.last_weight;
    });
    setItemValues(myValue);
  }, [checkedCountries]);
  return (
    <div>
      <Card
        bordered={false}
        hoverable
        style={{
          margin: '20px 20px',
          borderRadius: '14px',
        }}
      >
        <Form.Item label="选择国家：">
          <Checkbox.Group
            options={countryOptions}
            value={checkedCountries}
            onChange={checkedValues => {
              //判断是选中添加
              if (checkedValues?.length > checkedCountries.length) {
                const filter = checkedValues.filter(
                  item => checkedCountries.indexOf(item) === -1,
                );
                if (filter.length > 0) {
                  const num = filter[0];
                  setCheckedCountries([...checkedCountries, num]);
                } else {
                  setCheckedCountries(checkedValues);
                }
              } else {
                // 判断是选中删除
                const filter = checkedCountries.filter(
                  item => checkedValues.indexOf(item) === -1,
                );
                if (filter.length > 0) {
                  const num = filter[0];
                  const newList = { ...itemValues };
                  delete newList[`ratio${num}`];
                  delete newList[`cost${num}`];
                  delete newList[`weight${num}`];
                  setItemValues(newList);
                  setCheckedCountries(
                    checkedCountries.filter(item => item !== num),
                  );
                } else {
                  setCheckedCountries(checkedValues);
                }
              }
            }}
          />
        </Form.Item>
        <Form>
          国家配置:
          <Form.Item>
            <Row type="flex">
              <Col span={5}>国家</Col>
              <Col span={4} offset={1}>
                标准价格/g
              </Col>
              <Col span={4} offset={1}>
                基础运费
              </Col>
              <Col span={4} offset={1}>
                最低重量(g)
              </Col>
            </Row>
          </Form.Item>
          <div
            {...containerProps}
            style={{ height: '300px', overflow: 'auto' }}
          >
            <div {...wrapperProps}>
              {list.map((item, index) => (
                <div
                  style={{
                    height: 60,
                  }}
                  key={item}
                >
                  <Row>
                    <Col span={5}>
                      <Form.Item>
                        <Input
                          disabled
                          name={`countries${index}.id`}
                          value={
                            countryOptions.find(
                              option => option.value === item.data,
                            )?.label
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item>
                        <InputNumber
                          defaultValue={0}
                          min={0}
                          max={1}
                          step={0.01}
                          required
                          placeholder="标准价格/g"
                          value={itemValues[`ratio${index}`] || 0.0}
                          onChange={value => {
                            if (value >= 0) {
                              setItemValues(state => ({
                                ...state,
                                [`ratio${index}`]: Number(value).toFixed(3),
                              }));
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item>
                        <InputNumber
                          min={0}
                          step={0.01}
                          max={9999}
                          required
                          placeholder="基础运费"
                          value={itemValues[`cost${index}`] || 0.0}
                          onChange={value => {
                            if (value >= 0) {
                              setItemValues(state => ({
                                ...state,
                                [`cost${index}`]: Number(value).toFixed(2),
                              }));
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item>
                        <InputNumber
                          min={0}
                          max={9999}
                          placeholder="最低重量(g)"
                          value={itemValues[`weight${index}`] || 50}
                          required
                          onChange={value => {
                            if (Number.isInteger(value) && value >= 0) {
                              setItemValues(state => ({
                                ...state,
                                [`weight${index}`]: value,
                              }));
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2} offset={1}>
                      {countryList.find(l => l.abbreviation === 'other')?.id !==
                        item.data && (
                        <Button
                          icon={<MinusOutlined />}
                          style={{
                            color: 'rgba(0, 0, 0, 0.65)',
                          }}
                          onClick={() => {
                            const newList = { ...itemValues };
                            delete newList[`ratio${index}`];
                            delete newList[`cost${index}`];
                            delete newList[`weight${index}`];
                            setItemValues(newList);
                            setCheckedCountries(
                              checkedCountries.filter(
                                checked => checked !== item.data,
                              ),
                            );
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};
