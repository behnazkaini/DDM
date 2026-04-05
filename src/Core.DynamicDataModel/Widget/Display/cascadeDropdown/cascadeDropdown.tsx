import { AutoCompleteEx, Form, injectContext, SelectEx, SelectItem, useAjax, widgetFactory } from 'didgah/ant-core-component';
import React, { useEffect, useMemo, useState } from 'react';
import { getApiUrl } from '../../../../Utility/helpers';
import { AggregationOneToOneValue, ComponentProps, IWidget } from "../../../../typings/Core.DynamicDataModel/Types";
import { DataModelViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel';

interface DataModels extends DataModelViewModel {
    title: string;
    dataSource: any[];
    level: number;
}

interface DropDownData {
    dropDownData: SelectItem[]
}

interface AllPermanentsType {
    level: number;
    dropDownData: SelectItem[];
    selectedPrevDropDown?: {
        Key: string,
        Value: any
    };
}

interface ValueType {
    key: string,
    dropDownData: SelectItem[]

}

function CascadeDropdown(props: ComponentProps<AggregationOneToOneValue> & { referenceDataModelGuid: string; CascadeDropDownLevel: number }) {
    const CascadeDropDownLevel = props.CascadeDropDownLevel ? props.CascadeDropDownLevel : 2;
    const ajax = useAjax();
    const [dataModels, setDataModels] = useState<DataModels[]>([]);
    const [levelInfo, setLevelInfo] = useState(getInitialLevelInfo());
    const [values, setValues] = useState<ValueType[]>([]);
    const allPermanents = React.useRef<AllPermanentsType[]>([]);

    function getInitialLevelInfo() {
        const levelInfoTemp = {};
        for (let i = 1; i <= CascadeDropDownLevel; i++) {
            levelInfoTemp[i] = {};
            levelInfoTemp[i].value = null;
            levelInfoTemp[i].disabled = true;
        }
        levelInfoTemp[CascadeDropDownLevel].disabled = false;
        return levelInfoTemp;
    }

    const getDataModels = async () => {
        const sendModel = {
            DataModelGuid: props.mode === 'design' ? props.referenceDataModelGuid : props.initValue.metadata.DataModelGuid
        };
        ajax.post({
            url: getApiUrl('DynamicDataModel', 'DataModel', 'GetAllPermanents'),
            data: sendModel
        }).then((result) => {
            const dataModelsResult = result.DataModels.filter((a, index, array) => array.findIndex((b) => b.Guid === a.Guid) === index);
            const reversedData = dataModelsResult.map((item, index) => ({
                title: item.Label,
                dataSource: [],
                level: index + 1,
                ...item
            })).slice(0, CascadeDropDownLevel).reverse();
            setDataModels(reversedData);
            if (props.mode === 'render' && reversedData.length) {
                const firstDropDownDataSource = result.Rows.map((item, index) => ({
                    key: item.KeyValues[0].Value,
                    value: item.PrimaryKey,
                }));
                const permanents: AllPermanentsType[] = setAllPermanents(result);
                if (!props.value) {
                    setValues([{
                        key: undefined,
                        dropDownData: firstDropDownDataSource
                    }])
                }
                else {
                    setSelectedValues(props.value, permanents)
                }
            }
        })
    }

    function setAllPermanents(result) {
        const permanents: AllPermanentsType[] = [];
        const firstDropDownDataSource = result.Rows.map((item, index) => ({
            key: item.KeyValues[0].Value,
            value: item.PrimaryKey,
        }));

        permanents.push({
            level: 1,
            dropDownData: firstDropDownDataSource,
        });

        const recursiveSetData = (level, data) => {
            level++;
            data.forEach(item => {
                if (item.KeyValues.length === 2) {
                    permanents.push({
                        level: level,
                        selectedPrevDropDown: {
                            Value: item.KeyValues[0].Value,
                            Key: item.PrimaryKey
                        },
                        dropDownData: item.KeyValues[1].Value.map((value, index) => ({
                            key: value.KeyValues[0].Value,
                            value: value.PrimaryKey,
                        }))
                    });
                    item.KeyValues[1].Value.forEach(keyValue => {
                        recursiveSetData(level, [keyValue])
                    });

                }
            })
        }

        recursiveSetData(1, result.Rows);
        allPermanents.current = [...permanents];
        return [...permanents]
    }

    function setSelectedValues(value, permanents: AllPermanentsType[]) {
        const currentValues: ValueType[] = [];
        const recursiveSetData = (key) => {
            permanents.forEach(permanent => {
                const dropDownIncludeValue = permanent.dropDownData.find(dropdown => dropdown.value === key);
                if (dropDownIncludeValue) {
                    currentValues[Number(permanent.level - 1)] = {
                        key,
                        dropDownData: permanent.dropDownData
                    };
                    if (permanent?.selectedPrevDropDown) {
                        recursiveSetData(permanent.selectedPrevDropDown.Key)
                    }
                }
                else {
                    return;
                }
            })
        }
        recursiveSetData(value.key);
        setValues(currentValues);
    }

    const handleChange = (value, level, index) => {
        const levelInfoTemp = { ...levelInfo };
        for (let i = 1; i < level; i++) {
            levelInfoTemp[i].value = null;
            levelInfoTemp[i].disabled = true;
        }
        if (levelInfoTemp[level - 1]) {
            levelInfoTemp[level - 1].disabled = false;
        }

        levelInfoTemp[level].value = value;
        setLevelInfo(levelInfoTemp);
        if (!!value) {
            const selectedItem = values[index].dropDownData.find(data => data.value === value);
            if (index === dataModels.length - 1) {
                const currentValues = [...values];
                currentValues[index] = {
                    ...currentValues[index],
                    key: value
                }
                setValues(currentValues);

                const changes = {
                    key: selectedItem.value,
                    label: selectedItem.key,
                    metadata: {
                        ColumnGuids: dataModels[dataModels.length - 1].Columns.map(column => { column.Guid.toString() }) as any,
                        DataModelGuid: dataModels[dataModels.length - 1].Guid
                    },
                    rowData: [{ Key: selectedItem.value, Value: selectedItem.key }],
                }

                props.onChange(changes);
            }
        }
    }

    const handleSelect = (value, option, index) => {
        const level = index + 1;
        const nextDropDownIndex = index + 1;
        if (!!dataModels[nextDropDownIndex]) {
            const nextLevelDropDown = allPermanents.current.filter(permanent => permanent.level === level + 1);
            if (nextLevelDropDown.length) {
                const nextLevelData = nextLevelDropDown.find(nextLevelData => nextLevelData.selectedPrevDropDown.Key === value);
                if (nextLevelData) {
                    const currentValues = values.slice(0, index + 1);
                    currentValues[index] = {
                        ...currentValues[index],
                        key: value,
                    };
                    currentValues[index + 1] = {
                        key: '',
                        dropDownData: nextLevelData.dropDownData
                    }
                    setValues(currentValues)
                }
            }
        }
    }

    useEffect(() => {
        getDataModels();
    }, []);

    return <>{dataModels.map((dsi, index) => (
        <Form.Item label={dsi.title}>
            <SelectEx
                key={index}
                dataSource={values[index]?.dropDownData ?? []}
                onSelect={(value, option) => handleSelect(value, option, index)}
                disabled={true}
                value={props.mode === 'design' ? levelInfo ? levelInfo[dsi.level].value : null : values[index]?.key}
                onChange={(value) => {
                    handleChange(value, dsi.level, index)
                }}
            />
        </Form.Item>
    ))}
    </>
}

export default CascadeDropdown
