//with result col in design
export const data1={
    "DataModels": [
        {
            "Guid": "56b31033-ee58-3d7f-522e-78c1919e4905",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "AmaliyatBarRokhdad_Table1",
            "Label": "جدول ۱",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "416e653b-7cb5-5937-e3cb-b5f65aeb8702",
                    "DataType": 6,
                    "Name": "Result",
                    "Label": "Result",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf",
                    "DataType": 3,
                    "Name": "Code",
                    "Label": "کد",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "0042e52c-b2f7-912b-ae83-da4dbdddb176",
                    "DataType": 3,
                    "Name": "Column2",
                    "Label": "تعداد",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "bba98720-ba50-ea73-cb40-5ae1e06bef03",
                    "DataType": 3,
                    "Name": "Column3",
                    "Label": "قیمت",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "001111e0-90eb-eb89-1ac8-59cfdf917684",
                    "DataType": 1,
                    "Name": "Name",
                    "Label": "نام کالا",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        },
        {
            "Guid": "8aabc08e-d242-09d3-7cd6-e08707e14da6",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "AmaliyatBarRokhdad",
            "Label": "تست عملیات بر ررخداد1223",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "8a85bd59-bc9b-ca05-e7b2-9a5ad7f284d2",
                    "DataType": 3,
                    "Name": "Column4",
                    "Label": "عدد1",
                    "Setting": null,
                    "Bookmark": "عدد1",
                    "BookmarkType": 0
                },
                {
                    "Guid": "601e3851-8c3a-5716-3c4e-c15beac73e43",
                    "DataType": 3,
                    "Name": "Column5",
                    "Label": "عدد2",
                    "Setting": null,
                    "Bookmark": "عدد2",
                    "BookmarkType": 0
                },
                {
                    "Guid": "d92e7fef-3a1d-f222-b914-d4c7ec2c1ca2",
                    "DataType": 6,
                    "Name": "Column6",
                    "Label": "محاسبه اعداد",
                    "Setting": null,
                    "Bookmark": "محاسبه اعداد",
                    "BookmarkType": 1
                },
                {
                    "Guid": "b5169045-5cb4-51d9-e0b9-ca30b50c39e1",
                    "DataType": 3,
                    "Name": "Code",
                    "Label": "Code",
                    "Setting": null,
                    "Bookmark": "Code",
                    "BookmarkType": 0
                },
                {
                    "Guid": "33e7efb2-5767-f771-67c2-dcd2273fd3de",
                    "DataType": 1,
                    "Name": "Name",
                    "Label": "Name",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "e05ef382-a3a7-74c1-b514-809f3e1b02ff",
                    "DataType": 6,
                    "Name": "Sum",
                    "Label": "Sum",
                    "Setting": null,
                    "Bookmark": "Sum",
                    "BookmarkType": 0
                }
            ],
            "Relations": [
                {
                    "Guid": "af3c4974-2479-b39d-3674-ecab579f85a0",
                    "ReferenceDataModelGuid": "56b31033-ee58-3d7f-522e-78c1919e4905",
                    "Name": "AmaliyatBarRokhdad_AmaliyatBarRokhdad_Table1",
                    "Label": "1223_جدول ۱",
                    "Nature": 2,
                    "Type": 2,
                    "Bookmark": "",
                    "VariableGuid": null,
                    "Settings": []
                }
            ],
            "Variables": [],
            "InputVariableType": null
        }
    ],
    "Layouts": [
        {
            "Validations": [],
            "ComplexValidations": [],
            "Guid": "bf8be894-a773-dd67-a78b-19d0441b4909",
            "DataModelGuid": "8aabc08e-d242-09d3-7cd6-e08707e14da6",
            "Label": "فرم 05",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.309521553846443,\"Type\":1,\"LayoutItemGuid\":\"e8422e6e-4e46-8e28-e98b-27f8f0c8449c\",\"Children\":[{\"Id\":0.3290366305917565,\"Type\":2,\"Columns\":[{\"Id\":0.42038703062839555,\"Type\":5,\"LayoutItemGuid\":\"676fdc4e-a196-57ac-f27f-1d7a85b23720\",\"Col\":12}]},{\"Id\":0.08480230063354155,\"Type\":2,\"Columns\":[{\"Id\":0.9745110155326706,\"Type\":3,\"LayoutItemGuid\":\"ec9b7019-2a6c-eb52-bb02-5677146a944f\",\"Col\":12}]}]}],\"Events\":[{\"Title\":\"tt\",\"LayoutItems\":[{\"Guid\":\"676fdc4e-a196-57ac-f27f-1d7a85b23720\",\"EventId\":1,\"ExtraData\":{\"isGridEvent\":true,\"layoutItem\":{\"Id\":\"676fdc4e-a196-57ac-f27f-1d7a85b23720\",\"Children\":[{\"Id\":\"5edcdd71-e4d5-184f-29be-4b14508dda28\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"Result\",\"Hierarchy\":[\"5edcdd71-e4d5-184f-29be-4b14508dda28\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"1427fc82-ad04-fc08-836b-c6a370dab740\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"کد\",\"Hierarchy\":[\"1427fc82-ad04-fc08-836b-c6a370dab740\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"f55c4f0c-2857-3f00-1ed8-228c58643260\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"تعداد\",\"Hierarchy\":[\"f55c4f0c-2857-3f00-1ed8-228c58643260\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"9bb19010-b548-baef-bb10-6f621944fa06\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"قیمت\",\"Hierarchy\":[\"9bb19010-b548-baef-bb10-6f621944fa06\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"05937fd8-a73c-96bb-1f84-5565575816fe\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"نام کالا\",\"Hierarchy\":[\"05937fd8-a73c-96bb-1f84-5565575816fe\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,true]}],\"Hierarchy\":[],\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"جدید گ\",\"DisableSelect\":false,\"IsLeaf\":false,\"Metadata\":{\"isGrid\":true},\"IsLastChildHierarchy\":[true,true]}}}],\"Actions\":[{\"Guid\":\"ec9b7019-2a6c-eb52-bb02-5677146a944f\",\"ActionId\":1,\"CodeXml\":null,\"ExtraData\":{\"isGridAction\":true,\"functionName\":\"SUM\",\"layoutItem\":{\"Id\":\"5edcdd71-e4d5-184f-29be-4b14508dda28\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"Result\",\"Hierarchy\":[\"5edcdd71-e4d5-184f-29be-4b14508dda28\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},\"targetLayoutItem\":{\"Id\":\"ec9b7019-2a6c-eb52-bb02-5677146a944f\",\"ParentId\":\"bf8be894-a773-dd67-a78b-19d0441b4909\",\"Text\":\"Sum\",\"Hierarchy\":[\"ec9b7019-2a6c-eb52-bb02-5677146a944f\",\"bf8be894-a773-dd67-a78b-19d0441b4909\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "e8422e6e-4e46-8e28-e98b-27f8f0c8449c",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "e05ef382-a3a7-74c1-b514-809f3e1b02ff",
                    "Guid": "ec9b7019-2a6c-eb52-bb02-5677146a944f",
                    "ParentGuid": "e8422e6e-4e46-8e28-e98b-27f8f0c8449c",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Sum\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "RelationGuid": "af3c4974-2479-b39d-3674-ecab579f85a0",
                    "SubLayoutGuid": "96a1d9c1-697d-396e-b367-39754162d5ca",
                    "Guid": "676fdc4e-a196-57ac-f27f-1d7a85b23720",
                    "ParentGuid": "e8422e6e-4e46-8e28-e98b-27f8f0c8449c",
                    "Type": 4,
                    "Design": "{}",
                    "OrderIndex": 2
                }
            ],
            "Plugins": []
        },
        {
            "Validations": [
                {
                    "Guid": "af536b41-79c5-4ac8-9a2b-b1b0816b3376",
                    "LayoutItemGuid": "708fac5d-3882-4b55-826f-e6911a2daf5f",
                    "Type": 2,
                    "Setting": "{\"Max\": 128}"
                }
            ],
            "ComplexValidations": [],
            "Guid": "6b10974c-306b-48fa-a3df-f37ea419b986",
            "DataModelGuid": "56b31033-ee58-3d7f-522e-78c1919e4905",
            "Label": "جدول_فرم2",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.6453439950768076,\"Type\":1,\"LayoutItemGuid\":\"c57a53c1-daa0-429b-a49a-a19dfd07d526\",\"Children\":[{\"Id\":0.6741138862311843,\"Type\":2,\"Columns\":[{\"Id\":0.3838164170828283,\"Type\":3,\"LayoutItemGuid\":\"c9d48fb3-e59e-411f-91f3-9f348f50b189\",\"Col\":6},{\"Id\":0.08319573076433806,\"Type\":3,\"LayoutItemGuid\":\"708fac5d-3882-4b55-826f-e6911a2daf5f\",\"Col\":6}]},{\"Id\":0.6896324108359716,\"Type\":2,\"Columns\":[{\"Id\":0.16541105270007173,\"Type\":3,\"LayoutItemGuid\":\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"Col\":4},{\"Id\":0.10653506103971155,\"Type\":3,\"LayoutItemGuid\":\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"Col\":4},{\"Id\":0.2139401669204516,\"Type\":3,\"LayoutItemGuid\":\"6f5eb0f3-d197-499d-a270-7912ec60938c\",\"Col\":4}]}]}],\"Events\":[{\"Title\":\"Test\",\"LayoutItems\":[{\"Guid\":\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"ParentId\":\"6b10974c-306b-48fa-a3df-f37ea419b986\",\"Text\":\"تعداد\",\"Hierarchy\":[\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"6b10974c-306b-48fa-a3df-f37ea419b986\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}},{\"Guid\":\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"ParentId\":\"6b10974c-306b-48fa-a3df-f37ea419b986\",\"Text\":\"قیمت\",\"Hierarchy\":[\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"6b10974c-306b-48fa-a3df-f37ea419b986\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true]}}}],\"Actions\":[{\"Guid\":\"6f5eb0f3-d197-499d-a270-7912ec60938c\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"%(.zJOq(@05.jJEbV#`p\\\"&gt;Test&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"]BEU6uW2SSIC?A:%qmq)\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"W=m8XCH.gMo69p5]{k!*\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%(.zJOq(@05.jJEbV#`p\\\"&gt;Test&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"nU9M2ls*6U8EIU}IR.@g\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"Vi`nFd#C=~Rd6tbqk6p.\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;7ec6ea65-fa11-4ca4-81ef-de2603a91542&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"++ue8GCzWQ8Fus%k!r24\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;b5162c7d-ecb8-459c-af41-996e011d803e&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"ui[K8{f}4f^ZVW?sC:2W\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%(.zJOq(@05.jJEbV#`p\\\"&gt;Test&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "bba98720-ba50-ea73-cb40-5ae1e06bef03",
                    "Guid": "b5162c7d-ecb8-459c-af41-996e011d803e",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"قیمت\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 5
                },
                {
                    "ColumnGuid": "1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf",
                    "Guid": "c9d48fb3-e59e-411f-91f3-9f348f50b189",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"کد\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "001111e0-90eb-eb89-1ac8-59cfdf917684",
                    "Guid": "708fac5d-3882-4b55-826f-e6911a2daf5f",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"نام کالا\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "416e653b-7cb5-5937-e3cb-b5f65aeb8702",
                    "Guid": "6f5eb0f3-d197-499d-a270-7912ec60938c",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Result\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "0042e52c-b2f7-912b-ae83-da4dbdddb176",
                    "Guid": "7ec6ea65-fa11-4ca4-81ef-de2603a91542",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"تعداد\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 4
                }
            ],
            "Plugins": []
        },
        {
            "DefineLayoutGuid": "6b10974c-306b-48fa-a3df-f37ea419b986",
            "Guid": "96a1d9c1-697d-396e-b367-39754162d5ca",
            "DataModelGuid": "56b31033-ee58-3d7f-522e-78c1919e4905",
            "Label": "جدید گ",
            "Type": 3,
            "PlatformType": 1,
            "Design": "{\"Widget\":{\"Id\":0,\"SearchSetting\":{\"Enable\":false,\"LayoutItemGuid\":null,\"ColumnViewModelGuid\":null}}}",
            "IsDefault": false,
            "Items": [
                {
                    "ColumnGuid": "001111e0-90eb-eb89-1ac8-59cfdf917684",
                    "Guid": "05937fd8-a73c-96bb-1f84-5565575816fe",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"نام کالا\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 5
                },
                {
                    "ColumnGuid": "416e653b-7cb5-5937-e3cb-b5f65aeb8702",
                    "Guid": "5edcdd71-e4d5-184f-29be-4b14508dda28",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"Result\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf",
                    "Guid": "1427fc82-ad04-fc08-836b-c6a370dab740",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"کد\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "0042e52c-b2f7-912b-ae83-da4dbdddb176",
                    "Guid": "f55c4f0c-2857-3f00-1ed8-228c58643260",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"تعداد\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "bba98720-ba50-ea73-cb40-5ae1e06bef03",
                    "Guid": "9bb19010-b548-baef-bb10-6f621944fa06",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"قیمت\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 4
                }
            ],
            "Plugins": []
        }
    ],
    "Row": null,
    "Variables": null
}
//without result col in design
export const data2={
    "DataModels": [
        {
            "Guid": "56b31033-ee58-3d7f-522e-78c1919e4905",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "AmaliyatBarRokhdad_Table1",
            "Label": "جدول ۱",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "416e653b-7cb5-5937-e3cb-b5f65aeb8702",
                    "DataType": 6,
                    "Name": "Result",
                    "Label": "Result",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf",
                    "DataType": 3,
                    "Name": "Code",
                    "Label": "کد",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "0042e52c-b2f7-912b-ae83-da4dbdddb176",
                    "DataType": 3,
                    "Name": "Column2",
                    "Label": "تعداد",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "bba98720-ba50-ea73-cb40-5ae1e06bef03",
                    "DataType": 3,
                    "Name": "Column3",
                    "Label": "قیمت",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "001111e0-90eb-eb89-1ac8-59cfdf917684",
                    "DataType": 1,
                    "Name": "Name",
                    "Label": "نام کالا",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        },
        {
            "Guid": "8aabc08e-d242-09d3-7cd6-e08707e14da6",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "AmaliyatBarRokhdad",
            "Label": "تست عملیات بر ررخداد1223",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "8a85bd59-bc9b-ca05-e7b2-9a5ad7f284d2",
                    "DataType": 3,
                    "Name": "Column4",
                    "Label": "عدد1",
                    "Setting": null,
                    "Bookmark": "عدد1",
                    "BookmarkType": 0
                },
                {
                    "Guid": "601e3851-8c3a-5716-3c4e-c15beac73e43",
                    "DataType": 3,
                    "Name": "Column5",
                    "Label": "عدد2",
                    "Setting": null,
                    "Bookmark": "عدد2",
                    "BookmarkType": 0
                },
                {
                    "Guid": "d92e7fef-3a1d-f222-b914-d4c7ec2c1ca2",
                    "DataType": 6,
                    "Name": "Column6",
                    "Label": "محاسبه اعداد",
                    "Setting": null,
                    "Bookmark": "محاسبه اعداد",
                    "BookmarkType": 1
                },
                {
                    "Guid": "b5169045-5cb4-51d9-e0b9-ca30b50c39e1",
                    "DataType": 3,
                    "Name": "Code",
                    "Label": "Code",
                    "Setting": null,
                    "Bookmark": "Code",
                    "BookmarkType": 0
                },
                {
                    "Guid": "33e7efb2-5767-f771-67c2-dcd2273fd3de",
                    "DataType": 1,
                    "Name": "Name",
                    "Label": "Name",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "e05ef382-a3a7-74c1-b514-809f3e1b02ff",
                    "DataType": 6,
                    "Name": "Sum",
                    "Label": "Sum",
                    "Setting": null,
                    "Bookmark": "Sum",
                    "BookmarkType": 0
                }
            ],
            "Relations": [
                {
                    "Guid": "af3c4974-2479-b39d-3674-ecab579f85a0",
                    "ReferenceDataModelGuid": "56b31033-ee58-3d7f-522e-78c1919e4905",
                    "Name": "AmaliyatBarRokhdad_AmaliyatBarRokhdad_Table1",
                    "Label": "1223_جدول ۱",
                    "Nature": 2,
                    "Type": 2,
                    "Bookmark": "",
                    "VariableGuid": null,
                    "Settings": []
                }
            ],
            "Variables": [],
            "InputVariableType": null
        }
    ],
    "Layouts": [
        {
            "Validations": [],
            "ComplexValidations": [],
            "Guid": "3b90c3d8-e2dc-efa6-0b5c-d274c3d1f775",
            "DataModelGuid": "8aabc08e-d242-09d3-7cd6-e08707e14da6",
            "Label": "فرم4",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.22530760279049156,\"Type\":1,\"LayoutItemGuid\":\"6ff51578-c3f0-2a84-8a6a-99b1eff84279\",\"Children\":[{\"Id\":0.9027691477108482,\"Type\":2,\"Columns\":[{\"Id\":0.813033903854514,\"Type\":5,\"LayoutItemGuid\":\"fb421875-6863-814e-c4be-a60e77e5e530\",\"Col\":12}]},{\"Id\":0.8607739681675626,\"Type\":2,\"Columns\":[{\"Id\":0.43148944596528127,\"Type\":3,\"LayoutItemGuid\":\"fde85c94-6bce-6122-56a2-c8c43075dc26\",\"Col\":12}]}]}],\"Events\":[{\"Title\":\"تست جدول بیستون\",\"LayoutItems\":[{\"Guid\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"EventId\":1,\"ExtraData\":{\"isGridEvent\":true,\"layoutItem\":{\"Id\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Children\":[{\"Id\":\"416e653b-7cb5-5937-e3cb-b5f65aeb8702\",\"ParentId\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Text\":\"Result\",\"Hierarchy\":[\"416e653b-7cb5-5937-e3cb-b5f65aeb8702\",\"af3c4974-2479-b39d-3674-ecab579f85a0\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf\",\"ParentId\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Text\":\"کد\",\"Hierarchy\":[\"1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf\",\"af3c4974-2479-b39d-3674-ecab579f85a0\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"0042e52c-b2f7-912b-ae83-da4dbdddb176\",\"ParentId\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Text\":\"تعداد\",\"Hierarchy\":[\"0042e52c-b2f7-912b-ae83-da4dbdddb176\",\"af3c4974-2479-b39d-3674-ecab579f85a0\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"bba98720-ba50-ea73-cb40-5ae1e06bef03\",\"ParentId\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Text\":\"قیمت\",\"Hierarchy\":[\"bba98720-ba50-ea73-cb40-5ae1e06bef03\",\"af3c4974-2479-b39d-3674-ecab579f85a0\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"001111e0-90eb-eb89-1ac8-59cfdf917684\",\"ParentId\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Text\":\"نام کالا\",\"Hierarchy\":[\"001111e0-90eb-eb89-1ac8-59cfdf917684\",\"af3c4974-2479-b39d-3674-ecab579f85a0\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,true]}],\"Hierarchy\":[\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"3b90c3d8-e2dc-efa6-0b5c-d274c3d1f775\"],\"ParentId\":\"3b90c3d8-e2dc-efa6-0b5c-d274c3d1f775\",\"Text\":\"1223_جدول ۱\",\"DisableSelect\":false,\"IsLeaf\":false,\"Metadata\":{\"isGrid\":true},\"IsLastChildHierarchy\":[true,true]}}}],\"Actions\":[{\"Guid\":\"e05ef382-a3a7-74c1-b514-809f3e1b02ff\",\"ActionId\":1,\"CodeXml\":null,\"ExtraData\":{\"isGridAction\":true,\"functionName\":\"SUM\",\"layoutItem\":{\"Id\":\"416e653b-7cb5-5937-e3cb-b5f65aeb8702\",\"ParentId\":\"af3c4974-2479-b39d-3674-ecab579f85a0\",\"Text\":\"Result\",\"Hierarchy\":[\"416e653b-7cb5-5937-e3cb-b5f65aeb8702\",\"af3c4974-2479-b39d-3674-ecab579f85a0\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},\"targetLayoutItem\":{\"Id\":\"e05ef382-a3a7-74c1-b514-809f3e1b02ff\",\"ParentId\":\"3b90c3d8-e2dc-efa6-0b5c-d274c3d1f775\",\"Text\":\"Sum\",\"Hierarchy\":[\"e05ef382-a3a7-74c1-b514-809f3e1b02ff\",\"3b90c3d8-e2dc-efa6-0b5c-d274c3d1f775\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "6ff51578-c3f0-2a84-8a6a-99b1eff84279",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "RelationGuid": "af3c4974-2479-b39d-3674-ecab579f85a0",
                    "SubLayoutGuid": "6299653c-e615-4016-821a-5c60919ac022",
                    "Guid": "fb421875-6863-814e-c4be-a60e77e5e530",
                    "ParentGuid": "6ff51578-c3f0-2a84-8a6a-99b1eff84279",
                    "Type": 4,
                    "Design": "{}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "e05ef382-a3a7-74c1-b514-809f3e1b02ff",
                    "Guid": "fde85c94-6bce-6122-56a2-c8c43075dc26",
                    "ParentGuid": "6ff51578-c3f0-2a84-8a6a-99b1eff84279",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Sum\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 2
                }
            ],
            "Plugins": []
        },
        {
            "Validations": [
                {
                    "Guid": "af536b41-79c5-4ac8-9a2b-b1b0816b3376",
                    "LayoutItemGuid": "708fac5d-3882-4b55-826f-e6911a2daf5f",
                    "Type": 2,
                    "Setting": "{\"Max\": 128}"
                }
            ],
            "ComplexValidations": [],
            "Guid": "6b10974c-306b-48fa-a3df-f37ea419b986",
            "DataModelGuid": "56b31033-ee58-3d7f-522e-78c1919e4905",
            "Label": "جدول_فرم2",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.6453439950768076,\"Type\":1,\"LayoutItemGuid\":\"c57a53c1-daa0-429b-a49a-a19dfd07d526\",\"Children\":[{\"Id\":0.6741138862311843,\"Type\":2,\"Columns\":[{\"Id\":0.3838164170828283,\"Type\":3,\"LayoutItemGuid\":\"c9d48fb3-e59e-411f-91f3-9f348f50b189\",\"Col\":6},{\"Id\":0.08319573076433806,\"Type\":3,\"LayoutItemGuid\":\"708fac5d-3882-4b55-826f-e6911a2daf5f\",\"Col\":6}]},{\"Id\":0.6896324108359716,\"Type\":2,\"Columns\":[{\"Id\":0.16541105270007173,\"Type\":3,\"LayoutItemGuid\":\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"Col\":4},{\"Id\":0.10653506103971155,\"Type\":3,\"LayoutItemGuid\":\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"Col\":4},{\"Id\":0.2139401669204516,\"Type\":3,\"LayoutItemGuid\":\"6f5eb0f3-d197-499d-a270-7912ec60938c\",\"Col\":4}]}]}],\"Events\":[{\"Title\":\"Test\",\"LayoutItems\":[{\"Guid\":\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"ParentId\":\"6b10974c-306b-48fa-a3df-f37ea419b986\",\"Text\":\"تعداد\",\"Hierarchy\":[\"7ec6ea65-fa11-4ca4-81ef-de2603a91542\",\"6b10974c-306b-48fa-a3df-f37ea419b986\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}},{\"Guid\":\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"ParentId\":\"6b10974c-306b-48fa-a3df-f37ea419b986\",\"Text\":\"قیمت\",\"Hierarchy\":[\"b5162c7d-ecb8-459c-af41-996e011d803e\",\"6b10974c-306b-48fa-a3df-f37ea419b986\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true]}}}],\"Actions\":[{\"Guid\":\"6f5eb0f3-d197-499d-a270-7912ec60938c\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"%(.zJOq(@05.jJEbV#`p\\\"&gt;Test&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"]BEU6uW2SSIC?A:%qmq)\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"W=m8XCH.gMo69p5]{k!*\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%(.zJOq(@05.jJEbV#`p\\\"&gt;Test&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"nU9M2ls*6U8EIU}IR.@g\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"Vi`nFd#C=~Rd6tbqk6p.\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;7ec6ea65-fa11-4ca4-81ef-de2603a91542&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"++ue8GCzWQ8Fus%k!r24\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;b5162c7d-ecb8-459c-af41-996e011d803e&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"ui[K8{f}4f^ZVW?sC:2W\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%(.zJOq(@05.jJEbV#`p\\\"&gt;Test&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "bba98720-ba50-ea73-cb40-5ae1e06bef03",
                    "Guid": "b5162c7d-ecb8-459c-af41-996e011d803e",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"قیمت\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 5
                },
                {
                    "ColumnGuid": "1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf",
                    "Guid": "c9d48fb3-e59e-411f-91f3-9f348f50b189",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"کد\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "001111e0-90eb-eb89-1ac8-59cfdf917684",
                    "Guid": "708fac5d-3882-4b55-826f-e6911a2daf5f",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"نام کالا\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "416e653b-7cb5-5937-e3cb-b5f65aeb8702",
                    "Guid": "6f5eb0f3-d197-499d-a270-7912ec60938c",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Result\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "0042e52c-b2f7-912b-ae83-da4dbdddb176",
                    "Guid": "7ec6ea65-fa11-4ca4-81ef-de2603a91542",
                    "ParentGuid": "c57a53c1-daa0-429b-a49a-a19dfd07d526",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"تعداد\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 4
                }
            ],
            "Plugins": []
        },
        {
            "DefineLayoutGuid": "6b10974c-306b-48fa-a3df-f37ea419b986",
            "Guid": "6299653c-e615-4016-821a-5c60919ac022",
            "DataModelGuid": "56b31033-ee58-3d7f-522e-78c1919e4905",
            "Label": "جدول_فرم2",
            "Type": 3,
            "PlatformType": 1,
            "Design": "{\"Widget\":{\"Id\":0,\"SearchSetting\":{\"Enable\":false,\"LayoutItemGuid\":null,\"ColumnViewModelGuid\":null}}}",
            "IsDefault": false,
            "Items": [
                {
                    "ColumnGuid": "1f0f1af7-ba8d-f6cc-bb5f-0f410b6f4bcf",
                    "Guid": "c677d2ee-67f8-4ca3-8d02-b2f47489c792",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"کد\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "001111e0-90eb-eb89-1ac8-59cfdf917684",
                    "Guid": "7c359f6b-a812-41a5-b4a7-257d3178fb2d",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"نام کالا\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "0042e52c-b2f7-912b-ae83-da4dbdddb176",
                    "Guid": "e716561d-00ad-4c41-aa23-b7be630eabd9",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"تعداد\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "bba98720-ba50-ea73-cb40-5ae1e06bef03",
                    "Guid": "58fe9653-ac2c-4395-90da-d13bfd70b82d",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"قیمت\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 4
                }
            ],
            "Plugins": []
        }
    ],
    "Row": null,
    "Variables": null
}

export const data3={
    "DataModels": [
        {
            "Guid": "7e90b867-fa1a-a08c-e614-4fe2a23f361a",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "ActiononOperation_Table1",
            "Label": "جدول ۱",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "1b7ee47f-0b78-26aa-cdca-d587e8cf31c6",
                    "DataType": 2,
                    "Name": "Score1",
                    "Label": "Score1",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "8b203bb3-4b2d-3594-06df-4167963c456e",
                    "DataType": 2,
                    "Name": "Score2",
                    "Label": "Score2",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "70c59c55-5757-9ece-d631-c313eaa64dfd",
                    "DataType": 2,
                    "Name": "TotalScore",
                    "Label": "TotalScore",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        },
        {
            "Guid": "ed910a96-2fc1-8ae9-3310-e9985d0a8a19",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "ActiononOperation",
            "Label": "تست عملیات بر رخداد 25 اسفند",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "5b886852-f786-1a27-d263-c303b29a2cf2",
                    "DataType": 2,
                    "Name": "Point3",
                    "Label": "Point3",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "bb15828c-2b1c-7e74-51cd-76e1ab21e92d",
                    "DataType": 2,
                    "Name": "Point4",
                    "Label": "Point4",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "b6e477d2-539b-d258-f866-ff8adc39fa6c",
                    "DataType": 2,
                    "Name": "FilnalyPoint",
                    "Label": "FilnalyPoint",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "4a8f6988-ced3-e5fb-1ca9-5686eb5cedc9",
                    "DataType": 1,
                    "Name": "Approve",
                    "Label": "نتیجه بررسی",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "6b28c783-e5c5-9c06-3ec9-25cc34f2241b",
                    "DataType": 1,
                    "Name": "Description",
                    "Label": "توضیحات",
                    "Setting": "{\"MaxLength\":4000,\"Max\":true}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "2bab5f60-a9cd-455f-390d-e2cd21110988",
                    "DataType": 3,
                    "Name": "Point1",
                    "Label": "Point1",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "cae9a004-d92a-ff62-096b-7a1b13d4f80d",
                    "DataType": 3,
                    "Name": "Point2",
                    "Label": "Point2",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "5f9df141-b0f2-6b98-088f-c3bc52ecb806",
                    "DataType": 3,
                    "Name": "TotalPoint",
                    "Label": "TotalPoint",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "6aabc8db-949b-18fd-fdfb-754f753240b2",
                    "DataType": 2,
                    "Name": "TotalGrid",
                    "Label": "TotalGrid",
                    "Setting": "{\"Precision\":15,\"Scale\":4}",
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [
                {
                    "Guid": "0545cb4a-3ec5-c84f-7933-3ad51c8a43fe",
                    "ReferenceDataModelGuid": "ba18cd70-d4fa-4706-a398-6de1e63633e0",
                    "Name": "Position",
                    "Label": "Position",
                    "Nature": 1,
                    "Type": 1,
                    "Bookmark": "",
                    "VariableGuid": null,
                    "Settings": []
                },
                {
                    "Guid": "b791e317-516e-f040-29e7-c6d78f69d506",
                    "ReferenceDataModelGuid": "4d6184d2-0637-4185-8abc-b9be561f4208",
                    "Name": "Sign",
                    "Label": "محل امضاء",
                    "Nature": 1,
                    "Type": 1,
                    "Bookmark": "",
                    "VariableGuid": null,
                    "Settings": []
                },
                {
                    "Guid": "1fe0b587-9e18-a579-76a0-61e251990e8c",
                    "ReferenceDataModelGuid": "7e90b867-fa1a-a08c-e614-4fe2a23f361a",
                    "Name": "ActiononOperation_ActiononOperation_Table1",
                    "Label": "تست عملیات بر رخداد 25 اسفند_جدول ۱",
                    "Nature": 2,
                    "Type": 2,
                    "Bookmark": "",
                    "VariableGuid": null,
                    "Settings": []
                }
            ],
            "Variables": [
                {
                    "Guid": "663f8e5a-30ff-4656-9792-a631d3d5b2da",
                    "ReferenceType": "4d6184d2-0637-4185-8abc-b9be561f4208",
                    "ReferenceGuid": "b791e317-516e-f040-29e7-c6d78f69d506",
                    "Name": "Sign",
                    "Label": "محل امضاء"
                },
                {
                    "Guid": "796cbf5b-b10a-4793-94ec-e74e39829ade",
                    "ReferenceType": "ba18cd70-d4fa-4706-a398-6de1e63633e0",
                    "ReferenceGuid": "0545cb4a-3ec5-c84f-7933-3ad51c8a43fe",
                    "Name": "Position",
                    "Label": "Position"
                }
            ],
            "InputVariableType": null
        },
        {
            "Settings": [],
            "Guid": "ba18cd70-d4fa-4706-a398-6de1e63633e0",
            "SoftwareGuid": "b90f03a0-5b3b-4027-b9ec-247c2d6ddaac",
            "ScopeGuid": null,
            "Name": "Staff",
            "Label": "کارمند",
            "Type": 3,
            "Columns": [
                {
                    "Guid": "c5bef0ef-85a7-4672-bd76-8b2fd77c177e",
                    "DataType": 1,
                    "Name": "FullTitle",
                    "Label": "FullTitle",
                    "Setting": null,
                    "Bookmark": "FullTitle",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        },
        {
            "Settings": [],
            "Guid": "4d6184d2-0637-4185-8abc-b9be561f4208",
            "SoftwareGuid": "b90f03a0-5b3b-4027-b9ec-247c2d6ddaac",
            "ScopeGuid": null,
            "Name": "UserSignatureSoftwareModel",
            "Label": "امضا",
            "Type": 3,
            "Columns": [
                {
                    "Guid": "9d4b2a99-f78c-40b6-8428-b5b32473e322",
                    "DataType": 1,
                    "Name": "StaffFullTitle",
                    "Label": "عنوان سمت",
                    "Setting": null,
                    "Bookmark": "StaffFullTitle",
                    "BookmarkType": 0
                },
                {
                    "Guid": "d3178251-f57b-4f64-b610-da464375000f",
                    "DataType": 1,
                    "Name": "UserFullName",
                    "Label": "UserFullName",
                    "Setting": null,
                    "Bookmark": "UserFullName",
                    "BookmarkType": 0
                },
                {
                    "Guid": "12219460-274e-46af-9dd9-faeea92f1344",
                    "DataType": 1,
                    "Name": "FileName",
                    "Label": "نام فايل",
                    "Setting": null,
                    "Bookmark": "FileName",
                    "BookmarkType": 0
                },
                {
                    "Guid": "afa0fdd7-e2eb-460b-8168-25f54c82a5f7",
                    "DataType": 1,
                    "Name": "Guid",
                    "Label": "شناسه سراسری",
                    "Setting": null,
                    "Bookmark": "Guid",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        }
    ],
    "Layouts": [
        {
            "ShowFormItemLabelInSepratedRow": false,
            "Validations": [
                {
                    "Guid": "70e6776b-e534-30c0-388e-c3aad0d57970",
                    "LayoutItemGuid": "25fd1f7b-6769-9046-eee4-a77899fc9148",
                    "Type": 2,
                    "Setting": "{\"Max\": 4000}"
                }
            ],
            "ComplexValidations": [],
            "Guid": "e1524d4c-d92b-2763-71a4-20cd059513c7",
            "DataModelGuid": "ed910a96-2fc1-8ae9-3310-e9985d0a8a19",
            "Label": "فرم 1",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.3400170834403182,\"Type\":1,\"LayoutItemGuid\":\"547e84be-f84d-d923-d59f-f61c8249e00f\",\"Children\":[{\"Id\":0.5977182015355835,\"Type\":2,\"Columns\":[{\"Id\":0.846092362209752,\"Type\":3,\"LayoutItemGuid\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"Col\":6},{\"Id\":0.3169097460592266,\"Type\":3,\"LayoutItemGuid\":\"0d3b3c96-59b1-3c76-7a2e-d8866aace902\",\"Col\":6}]},{\"Id\":0.6570625970372425,\"Type\":2,\"Columns\":[{\"Id\":0.29750624692205685,\"Type\":3,\"LayoutItemGuid\":\"25fd1f7b-6769-9046-eee4-a77899fc9148\",\"Col\":6},{\"Id\":0.048760611410647026,\"Type\":3,\"LayoutItemGuid\":\"ab933b8b-3561-1d75-340d-0dd8a004cdee\",\"Col\":6}]},{\"Id\":0.7370585598596889,\"Type\":2,\"Columns\":[{\"Id\":0.04271840614634004,\"Type\":3,\"LayoutItemGuid\":\"0b382c6c-e14a-b255-d37f-c522fb3943a2\",\"Col\":4},{\"Id\":0.12816109196755843,\"Type\":3,\"LayoutItemGuid\":\"b08dded7-41ed-dd8d-3b81-2c2f6311d9d9\",\"Col\":4},{\"Id\":0.9071014737272663,\"Type\":3,\"LayoutItemGuid\":\"f4e73474-2d55-73ea-5adf-050c182dea19\",\"Col\":4}]},{\"Id\":0.46441073166679714,\"Type\":2,\"Columns\":[{\"Id\":0.9973282309913649,\"Type\":5,\"LayoutItemGuid\":\"e6c0fa86-d38c-fc88-ac48-9e06a502cdfa\",\"Col\":12}]},{\"Id\":0.8146788854115009,\"Type\":2,\"Columns\":[{\"Id\":0.4303931564542306,\"Type\":3,\"LayoutItemGuid\":\"6c72f81e-f6a0-f8a9-8d80-9c8dae99d509\",\"Col\":12}]},{\"Id\":0.69974153450389,\"Type\":2,\"Columns\":[{\"Id\":0.963245961057999,\"Type\":3,\"LayoutItemGuid\":\"1a08aedc-1ea7-45af-3a27-1280ffd6e7f8\",\"Col\":4},{\"Id\":0.14974798394726252,\"Type\":3,\"LayoutItemGuid\":\"f99208c0-bb7e-bc31-ca94-168ff67c2665\",\"Col\":4},{\"Id\":0.885620096215667,\"Type\":3,\"LayoutItemGuid\":\"fa9829d8-0a97-67ce-937a-e981f5432311\",\"Col\":4}]}]}],\"Events\":[{\"Title\":\"سناریو1\",\"LayoutItems\":[{\"Guid\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"نتیجه بررسی\",\"Hierarchy\":[\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"25fd1f7b-6769-9046-eee4-a77899fc9148\",\"ActionId\":3,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"a8eAUl9zisf5N5gQ~zY]\\\"&gt;result&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"Rg;@f,I@hqGLh@)FO%`|\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"controls_if\\\" id=\\\"!S?v~8^Ac-q_iA7F|?o3\\\"&gt;&lt;value name=\\\"IF0\\\"&gt;&lt;block type=\\\"logic_compare\\\" id=\\\"jRQCFo@a|-5O35l.q(CS\\\"&gt;&lt;field name=\\\"OP\\\"&gt;EQ&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"O+:vZI8/5nZG`*rq[^U8\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;b3a43985-0289-a2ac-26a9-8607cea09abc&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"text\\\" id=\\\"?68%-T!6*JB,W1Rwk_Q-\\\"&gt;&lt;field name=\\\"TEXT\\\"&gt;عدم تایید&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;statement name=\\\"DO0\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"YyiLFx#Q~O].93Ul`Zf!\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"a8eAUl9zisf5N5gQ~zY]\\\"&gt;result&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"logic_boolean\\\" id=\\\"flVnN5-,+!N.4Mc6j@?h\\\"&gt;&lt;field name=\\\"BOOL\\\"&gt;TRUE&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"|cGqJ413|pc=JTY0BnV*\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"a8eAUl9zisf5N5gQ~zY]\\\"&gt;result&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]},{\"Title\":\"سناریو2\",\"LayoutItems\":[{\"Guid\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"نتیجه بررسی\",\"Hierarchy\":[\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"ab933b8b-3561-1d75-340d-0dd8a004cdee\",\"ActionId\":2,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"O=Grxj1gPsetLqT|45EM\\\"&gt;result&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"gHHFiZ/ijQ8M*r:3Bh@[\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"controls_if\\\" id=\\\"ryOL)8ES|*EKg`nt{C-z\\\"&gt;&lt;value name=\\\"IF0\\\"&gt;&lt;block type=\\\"logic_compare\\\" id=\\\"9TT{U~rGAx4^Z:(bK3eM\\\"&gt;&lt;field name=\\\"OP\\\"&gt;EQ&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"*W_IDuy(]E%IYu!dTKyp\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;b3a43985-0289-a2ac-26a9-8607cea09abc&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"text\\\" id=\\\"tQ@tnBkyl;WCS-EyX!Ho\\\"&gt;&lt;field name=\\\"TEXT\\\"&gt;تایید&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;statement name=\\\"DO0\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"e*MY)):)v,fB4@U@Lt7S\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"O=Grxj1gPsetLqT|45EM\\\"&gt;result&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"logic_boolean\\\" id=\\\"pL#+]of%{CKfL75G+4qu\\\"&gt;&lt;field name=\\\"BOOL\\\"&gt;TRUE&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"H4RtOPbU`n[xuJdc]exQ\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"O=Grxj1gPsetLqT|45EM\\\"&gt;result&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]},{\"Title\":\"سناریو3\",\"LayoutItems\":[{\"Guid\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"نتیجه بررسی\",\"Hierarchy\":[\"b3a43985-0289-a2ac-26a9-8607cea09abc\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"0d3b3c96-59b1-3c76-7a2e-d8866aace902\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"NT2(~%|/G4.!r:P|U[r@\\\"&gt;Result&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"t5=+OXHB#3_1h-(Xst:H\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"controls_if\\\" id=\\\")}3_{I9qyoEj2CALGdn:\\\"&gt;&lt;value name=\\\"IF0\\\"&gt;&lt;block type=\\\"logic_compare\\\" id=\\\"o@#RK2RC$yc}#@#jS)W-\\\"&gt;&lt;field name=\\\"OP\\\"&gt;EQ&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"IaV-7g2cHl]UCX2XExG!\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;b3a43985-0289-a2ac-26a9-8607cea09abc&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"text\\\" id=\\\".01.50s@g?nB#s$arMdP\\\"&gt;&lt;field name=\\\"TEXT\\\"&gt;عدم تایید&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;statement name=\\\"DO0\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"2zG+YgmJ@JGc:7yVm5O{\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"NT2(~%|/G4.!r:P|U[r@\\\"&gt;Result&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"logic_boolean\\\" id=\\\"l6VJa}C6]c,O=~Hl+JjC\\\"&gt;&lt;field name=\\\"BOOL\\\"&gt;TRUE&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"U|a2_eB%-tG!7F^,g(o2\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"NT2(~%|/G4.!r:P|U[r@\\\"&gt;Result&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]},{\"Title\":\"سناریو4\",\"LayoutItems\":[{\"Guid\":\"0b382c6c-e14a-b255-d37f-c522fb3943a2\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"0b382c6c-e14a-b255-d37f-c522fb3943a2\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"Point1\",\"Hierarchy\":[\"0b382c6c-e14a-b255-d37f-c522fb3943a2\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}},{\"Guid\":\"b08dded7-41ed-dd8d-3b81-2c2f6311d9d9\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"b08dded7-41ed-dd8d-3b81-2c2f6311d9d9\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"Point2\",\"Hierarchy\":[\"b08dded7-41ed-dd8d-3b81-2c2f6311d9d9\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"f4e73474-2d55-73ea-5adf-050c182dea19\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"V;*WSIZ`DT,K/]sqcaK_\\\"&gt;result&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"wZ!w!~!HeHlsT$^+fdJ3\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"rCsfg6exheWPtp?H5V_g\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"V;*WSIZ`DT,K/]sqcaK_\\\"&gt;result&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"qR[e@=]4zjeIhq:5mzY_\\\"&gt;&lt;field name=\\\"OP\\\"&gt;ADD&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"J@x;|[GJ!k3v~W_?+p2R\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;0b382c6c-e14a-b255-d37f-c522fb3943a2&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"(Z|OYZXHqe_3/^jk1;j,\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;b08dded7-41ed-dd8d-3b81-2c2f6311d9d9&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"elHjle^M9n9Dfx8oEGCm\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"V;*WSIZ`DT,K/]sqcaK_\\\"&gt;result&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]},{\"Title\":\"سناریو5\",\"LayoutItems\":[{\"Guid\":\"e6c0fa86-d38c-fc88-ac48-9e06a502cdfa\",\"EventId\":1,\"ExtraData\":{\"isGridEvent\":true,\"layoutItem\":{\"Id\":\"e6c0fa86-d38c-fc88-ac48-9e06a502cdfa\",\"Children\":[{\"Id\":\"fe11fe7b-a45b-3615-edc8-f60940a68962\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"TotalScore\",\"Hierarchy\":[\"fe11fe7b-a45b-3615-edc8-f60940a68962\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"59586540-72b8-fab3-ff0c-110721257faa\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"Score1\",\"Hierarchy\":[\"59586540-72b8-fab3-ff0c-110721257faa\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},{\"Id\":\"79e7149f-5ced-4888-cea3-3125caeeccc3\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"Score2\",\"Hierarchy\":[\"79e7149f-5ced-4888-cea3-3125caeeccc3\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,true]}],\"Hierarchy\":[],\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"جدول\",\"DisableSelect\":false,\"IsLeaf\":false,\"Metadata\":{\"isGrid\":true},\"IsLastChildHierarchy\":[true,true]}}}],\"Actions\":[{\"Guid\":\"6c72f81e-f6a0-f8a9-8d80-9c8dae99d509\",\"ActionId\":1,\"CodeXml\":null,\"ExtraData\":{\"isGridAction\":true,\"functionName\":\"SUM\",\"layoutItem\":{\"Id\":\"fe11fe7b-a45b-3615-edc8-f60940a68962\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"TotalScore\",\"Hierarchy\":[\"fe11fe7b-a45b-3615-edc8-f60940a68962\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,true,false]},\"targetLayoutItem\":{\"Id\":\"6c72f81e-f6a0-f8a9-8d80-9c8dae99d509\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"TotalGrid\",\"Hierarchy\":[\"6c72f81e-f6a0-f8a9-8d80-9c8dae99d509\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}]},{\"Title\":\"سناریو6\",\"LayoutItems\":[{\"Guid\":\"1a08aedc-1ea7-45af-3a27-1280ffd6e7f8\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"1a08aedc-1ea7-45af-3a27-1280ffd6e7f8\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"Point3\",\"Hierarchy\":[\"1a08aedc-1ea7-45af-3a27-1280ffd6e7f8\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}},{\"Guid\":\"f99208c0-bb7e-bc31-ca94-168ff67c2665\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"f99208c0-bb7e-bc31-ca94-168ff67c2665\",\"ParentId\":\"e1524d4c-d92b-2763-71a4-20cd059513c7\",\"Text\":\"Point4\",\"Hierarchy\":[\"f99208c0-bb7e-bc31-ca94-168ff67c2665\",\"e1524d4c-d92b-2763-71a4-20cd059513c7\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"fa9829d8-0a97-67ce-937a-e981f5432311\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"eH9q]Uq-lK@6-+ojH,=9\\\"&gt;result&lt;/variable&gt;&lt;variable id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/variable&gt;&lt;variable id=\\\"~?fpK-]3wvKX_f3RN#R=\\\"&gt;result2&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"d3/n;jtPb5b8xKq.LpQI\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"r92[-UXka]-+pJA*=$=2\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"eH9q]Uq-lK@6-+ojH,=9\\\"&gt;result&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"=i{x-JvdM+;Z{;LNSjs!\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"4Nv]7mCG)7${Sga#sdV*\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;1a08aedc-1ea7-45af-3a27-1280ffd6e7f8&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"1.C{]*{g6+k#[J$G[m{$\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;1&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;next&gt;&lt;block type=\\\"variables_set\\\" id=\\\"]@B|{u/XhYA(9ar7HQ|A\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"~?fpK-]3wvKX_f3RN#R=\\\"&gt;result2&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"[lQ71(f`Ta]#_aP+uE*#\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"Xu_:0y|rn8F8-n|Mtul1\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;f99208c0-bb7e-bc31-ca94-168ff67c2665&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"BX0*8=ziz|J=qq115!C3\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;2&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;next&gt;&lt;block type=\\\"variables_set\\\" id=\\\"xf(eBPSTWN#T_{zh0iTw\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"yJ[biC8%Kz9:w6V`0h~H\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"Pio(Sim%;ck%,*)A64Bk\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"eH9q]Uq-lK@6-+ojH,=9\\\"&gt;result&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"46N3w-+BPR}1[Oop=|s*\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"~?fpK-]3wvKX_f3RN#R=\\\"&gt;result2&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;next&gt;&lt;block type=\\\"controls_if\\\" id=\\\"S47RXoEB@t@8;9G7-+kI\\\"&gt;&lt;value name=\\\"IF0\\\"&gt;&lt;block type=\\\"logic_compare\\\" id=\\\"=YbO-68|)sbY3zJJp6ih\\\"&gt;&lt;field name=\\\"OP\\\"&gt;GT&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"wvQS]xqz9R7*$Dpl!MY#\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"*(6-=m#;@:*t/].Ly.=|\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;10&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;statement name=\\\"DO0\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"[Q[Q$Roxu$)|GbP(g3BS\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"fopwk{JplY|x3][.3HHq\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;next&gt;&lt;block type=\\\"controls_if\\\" id=\\\"c;9q%~XptInQ{.aJIj2W\\\"&gt;&lt;value name=\\\"IF0\\\"&gt;&lt;block type=\\\"logic_compare\\\" id=\\\"BSWB$*~^#:l9[9E|QadQ\\\"&gt;&lt;field name=\\\"OP\\\"&gt;LT&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"[fQ4Z4)/PnHJt()f@=]E\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"D8phl[;i/P!O5pE~Lhem\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;10&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;statement name=\\\"DO0\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"]Ak9zQByJhc;LpJ@I`3n\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"k9~7kD4Qx=Bf).Q5+qno\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;8&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;/block&gt;&lt;/next&gt;&lt;/block&gt;&lt;/next&gt;&lt;/block&gt;&lt;/next&gt;&lt;/block&gt;&lt;/next&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"R)C.aKIc!w$ZUDr~Sw_4\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"%0Vr(+m*%N6,/F3a|@St\\\"&gt;result3&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "ColumnGuid": "5b886852-f786-1a27-d263-c303b29a2cf2",
                    "Guid": "1a08aedc-1ea7-45af-3a27-1280ffd6e7f8",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Point3\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 10
                },
                {
                    "ColumnGuid": "bb15828c-2b1c-7e74-51cd-76e1ab21e92d",
                    "Guid": "f99208c0-bb7e-bc31-ca94-168ff67c2665",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Point4\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 11
                },
                {
                    "Guid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "RelationGuid": "1fe0b587-9e18-a579-76a0-61e251990e8c",
                    "SubLayoutGuid": "e8a637ec-246d-7458-6094-4a0cbc8a9cf5",
                    "Guid": "e6c0fa86-d38c-fc88-ac48-9e06a502cdfa",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 4,
                    "Design": "{}",
                    "OrderIndex": 9
                },
                {
                    "ColumnGuid": "4a8f6988-ced3-e5fb-1ca9-5686eb5cedc9",
                    "Guid": "b3a43985-0289-a2ac-26a9-8607cea09abc",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":2},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"نتیجه بررسی\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false,\"WrapperLabel\":4,\"WrapperCol\":20,\"ItemList\":[\"تایید\",\"عدم تایید\"]}",
                    "OrderIndex": 1
                },
                {
                    "RelationGuid": "0545cb4a-3ec5-c84f-7933-3ad51c8a43fe",
                    "ColumnGuids": [
                        "c5bef0ef-85a7-4672-bd76-8b2fd77c177e"
                    ],
                    "Guid": "0d3b3c96-59b1-3c76-7a2e-d8866aace902",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 3,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"Label\":\"Position\",\"LabelMutable\":false,\"Direction\":\"unset\",\"HelpTooltip\":null}",
                    "OrderIndex": 2
                },
                {
                    "RelationGuid": "b791e317-516e-f040-29e7-c6d78f69d506",
                    "ColumnGuids": [
                        "9d4b2a99-f78c-40b6-8428-b5b32473e322",
                        "d3178251-f57b-4f64-b610-da464375000f",
                        "12219460-274e-46af-9dd9-faeea92f1344",
                        "afa0fdd7-e2eb-460b-8168-25f54c82a5f7"
                    ],
                    "Guid": "ab933b8b-3561-1d75-340d-0dd8a004cdee",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 3,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"Label\":\"محل امضاء\",\"LabelMutable\":false,\"Direction\":\"unset\",\"HelpTooltip\":null}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "b6e477d2-539b-d258-f866-ff8adc39fa6c",
                    "Guid": "fa9829d8-0a97-67ce-937a-e981f5432311",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"FilnalyPoint\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 12
                },
                {
                    "ColumnGuid": "6b28c783-e5c5-9c06-3ec9-25cc34f2241b",
                    "Guid": "25fd1f7b-6769-9046-eee4-a77899fc9148",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"توضیحات\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 4
                },
                {
                    "ColumnGuid": "2bab5f60-a9cd-455f-390d-e2cd21110988",
                    "Guid": "0b382c6c-e14a-b255-d37f-c522fb3943a2",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Point1\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 5
                },
                {
                    "ColumnGuid": "cae9a004-d92a-ff62-096b-7a1b13d4f80d",
                    "Guid": "b08dded7-41ed-dd8d-3b81-2c2f6311d9d9",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Point2\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 6
                },
                {
                    "ColumnGuid": "5f9df141-b0f2-6b98-088f-c3bc52ecb806",
                    "Guid": "f4e73474-2d55-73ea-5adf-050c182dea19",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"TotalPoint\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 7
                },
                {
                    "ColumnGuid": "6aabc8db-949b-18fd-fdfb-754f753240b2",
                    "Guid": "6c72f81e-f6a0-f8a9-8d80-9c8dae99d509",
                    "ParentGuid": "547e84be-f84d-d923-d59f-f61c8249e00f",
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"TotalGrid\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 8
                }
            ],
            "Plugins": []
        },
        {
            "ShowFormItemLabelInSepratedRow": false,
            "Validations": [],
            "ComplexValidations": [],
            "Guid": "d9895c2b-4c7a-2fde-597d-1597976fbfa4",
            "DataModelGuid": "7e90b867-fa1a-a08c-e614-4fe2a23f361a",
            "Label": "جدول",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.1620068591813898,\"Type\":1,\"LayoutItemGuid\":\"ca8ac1ff-5eb9-98b7-d927-185b6d158d82\",\"Children\":[{\"Id\":0.44186420933257387,\"Type\":2,\"Columns\":[{\"Id\":0.06385069792825138,\"Type\":3,\"LayoutItemGuid\":\"cba72de9-6bad-4889-9ae3-f071713ce120\",\"Col\":4},{\"Id\":0.31903522207978885,\"Type\":3,\"LayoutItemGuid\":\"ccfcb53a-62f4-742e-3298-b7749a52cc0b\",\"Col\":4},{\"Id\":0.9886985885831581,\"Type\":3,\"LayoutItemGuid\":\"3af5ef0e-04b3-eb86-7173-0101dde85537\",\"Col\":4}]}]}],\"Events\":[{\"Title\":\"سناریو 1\",\"LayoutItems\":[{\"Guid\":\"cba72de9-6bad-4889-9ae3-f071713ce120\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"cba72de9-6bad-4889-9ae3-f071713ce120\",\"ParentId\":\"d9895c2b-4c7a-2fde-597d-1597976fbfa4\",\"Text\":\"Score1\",\"Hierarchy\":[\"cba72de9-6bad-4889-9ae3-f071713ce120\",\"d9895c2b-4c7a-2fde-597d-1597976fbfa4\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}},{\"Guid\":\"ccfcb53a-62f4-742e-3298-b7749a52cc0b\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"ccfcb53a-62f4-742e-3298-b7749a52cc0b\",\"ParentId\":\"d9895c2b-4c7a-2fde-597d-1597976fbfa4\",\"Text\":\"Score2\",\"Hierarchy\":[\"ccfcb53a-62f4-742e-3298-b7749a52cc0b\",\"d9895c2b-4c7a-2fde-597d-1597976fbfa4\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"3af5ef0e-04b3-eb86-7173-0101dde85537\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"XjO(5oGj6Jjp;*129N]X\\\"&gt;result&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"!g.hO2kGi-[g2=4)0LNq\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"@Eom;KydnepZK1le+v@%\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"XjO(5oGj6Jjp;*129N]X\\\"&gt;result&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"jf%luFurFPCH_zD%sAN5\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"VyW4qy`IVA}z_|T2Atag\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;cba72de9-6bad-4889-9ae3-f071713ce120&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"6;bd)[`g)LZ+L2k`#tAL\\\"&gt;&lt;field name=\\\"OP\\\"&gt;DIVIDE&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"j_m|_S(WA2B`!B%mKFMd\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;ccfcb53a-62f4-742e-3298-b7749a52cc0b&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"v{WuC%x[lBGA73Fbi#KX\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;15&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"`=9.1n8du?s0[;-X+8T-\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"XjO(5oGj6Jjp;*129N]X\\\"&gt;result&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "ColumnGuid": "1b7ee47f-0b78-26aa-cdca-d587e8cf31c6",
                    "Guid": "cba72de9-6bad-4889-9ae3-f071713ce120",
                    "ParentGuid": "ca8ac1ff-5eb9-98b7-d927-185b6d158d82",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Score1\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "8b203bb3-4b2d-3594-06df-4167963c456e",
                    "Guid": "ccfcb53a-62f4-742e-3298-b7749a52cc0b",
                    "ParentGuid": "ca8ac1ff-5eb9-98b7-d927-185b6d158d82",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"Score2\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "70c59c55-5757-9ece-d631-c313eaa64dfd",
                    "Guid": "3af5ef0e-04b3-eb86-7173-0101dde85537",
                    "ParentGuid": "ca8ac1ff-5eb9-98b7-d927-185b6d158d82",
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"TotalScore\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 3
                },
                {
                    "Guid": "ca8ac1ff-5eb9-98b7-d927-185b6d158d82",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                }
            ],
            "Plugins": []
        },
        {
            "DefineLayoutGuid": "d9895c2b-4c7a-2fde-597d-1597976fbfa4",
            "Guid": "e8a637ec-246d-7458-6094-4a0cbc8a9cf5",
            "DataModelGuid": "7e90b867-fa1a-a08c-e614-4fe2a23f361a",
            "Label": "جدول",
            "Type": 3,
            "PlatformType": 1,
            "Design": "{\"Widget\":{\"Id\":0,\"SearchSetting\":{\"Enable\":false,\"LayoutItemGuid\":null,\"ColumnViewModelGuid\":null}}}",
            "IsDefault": false,
            "Items": [
                {
                    "ColumnGuid": "70c59c55-5757-9ece-d631-c313eaa64dfd",
                    "Guid": "fe11fe7b-a45b-3615-edc8-f60940a68962",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"TotalScore\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "1b7ee47f-0b78-26aa-cdca-d587e8cf31c6",
                    "Guid": "59586540-72b8-fab3-ff0c-110721257faa",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"Score1\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "8b203bb3-4b2d-3594-06df-4167963c456e",
                    "Guid": "79e7149f-5ced-4888-cea3-3125caeeccc3",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"Score2\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 2
                }
            ],
            "Plugins": []
        }
    ],
    "Row": null,
    "Variables": null
}
//c1 + c2 -> c3 * 2 -> c4
export const data4={
    "DataModels": [
        {
            "Guid": "900aef6e-620c-ab21-b198-2f77cc936af7",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "Table1_On_Event",
            "Label": "Table1_On_Event",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "6b820601-919c-14c8-6dba-0ba304a6485b",
                    "DataType": 3,
                    "Name": "Column1",
                    "Label": "ستون ۱",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "c525bb69-82f7-49fc-d66d-5e22f5f7ceaa",
                    "DataType": 3,
                    "Name": "Column2",
                    "Label": "ستون 2",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "30d67de2-0a29-8873-6435-9eae294d08e8",
                    "DataType": 3,
                    "Name": "Column3",
                    "Label": "ستون 3",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "a56703f4-c13c-6e75-0862-791aead356d2",
                    "DataType": 1,
                    "Name": "Column4",
                    "Label": "ستون 4",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "8689b1a1-d09b-01cc-dafc-627488e57f48",
                    "DataType": 3,
                    "Name": "Column5A",
                    "Label": "ستون 5",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        }
    ],
    "Layouts": [
        {
            "Validations": [
                {
                    "Guid": "ce458eef-19db-39eb-2b49-eccebda05fba",
                    "LayoutItemGuid": "b517166a-6fe5-0e61-594a-0dc8f43b6dcf",
                    "Type": 2,
                    "Setting": "{\"Max\": 128}"
                }
            ],
            "ComplexValidations": [],
            "Guid": "c8218455-7912-537c-a6a3-7e3760f2debe",
            "DataModelGuid": "900aef6e-620c-ab21-b198-2f77cc936af7",
            "Label": "فرم روی rc",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.9158093680262985,\"Type\":1,\"LayoutItemGuid\":\"020e6d48-9866-ad18-1071-396061a7f1a0\",\"Children\":[{\"Id\":0.8357249688873082,\"Type\":2,\"Columns\":[{\"Id\":0.5800197987755126,\"Type\":3,\"LayoutItemGuid\":\"c8033e90-4166-7b57-7442-e2d90c560432\",\"Col\":3},{\"Id\":0.1929516411272736,\"Type\":3,\"LayoutItemGuid\":\"18c12dcc-45f2-eeb9-bd61-54f6bd8129f3\",\"Col\":3},{\"Id\":0.4685220582908606,\"Type\":3,\"LayoutItemGuid\":\"49e6ae74-6669-3b6c-dcf6-9da9c8788e4e\",\"Col\":3},{\"Id\":0.13459469560104365,\"Type\":3,\"LayoutItemGuid\":\"b517166a-6fe5-0e61-594a-0dc8f43b6dcf\",\"Col\":3}]}]}],\"Events\":[{\"Title\":\"1\",\"LayoutItems\":[{\"Guid\":\"c8033e90-4166-7b57-7442-e2d90c560432\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"c8033e90-4166-7b57-7442-e2d90c560432\",\"ParentId\":\"c8218455-7912-537c-a6a3-7e3760f2debe\",\"Text\":\"ستون ۱\",\"Hierarchy\":[\"c8033e90-4166-7b57-7442-e2d90c560432\",\"c8218455-7912-537c-a6a3-7e3760f2debe\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}},{\"Guid\":\"18c12dcc-45f2-eeb9-bd61-54f6bd8129f3\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"18c12dcc-45f2-eeb9-bd61-54f6bd8129f3\",\"ParentId\":\"c8218455-7912-537c-a6a3-7e3760f2debe\",\"Text\":\"ستون 2\",\"Hierarchy\":[\"18c12dcc-45f2-eeb9-bd61-54f6bd8129f3\",\"c8218455-7912-537c-a6a3-7e3760f2debe\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"49e6ae74-6669-3b6c-dcf6-9da9c8788e4e\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"Vp@$Qnj|f)Uu_RJ%IfMo\\\"&gt;r&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"{M=m4[?VkZE:@8E0shN4\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"Lcls%e=$Legiu3^FCaT=\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"Vp@$Qnj|f)Uu_RJ%IfMo\\\"&gt;r&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"I|.I?@=Tn*P^KzmJ%-T/\\\"&gt;&lt;field name=\\\"OP\\\"&gt;ADD&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"(|p{RQZHla{w+-9LDZ[E\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;c8033e90-4166-7b57-7442-e2d90c560432&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"14xl!T12L3ok@V@P#a9?\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;18c12dcc-45f2-eeb9-bd61-54f6bd8129f3&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"ughb*5#q}qs[0mcyP51s\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"Vp@$Qnj|f)Uu_RJ%IfMo\\\"&gt;r&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]},{\"Title\":\"2\",\"LayoutItems\":[{\"Guid\":\"49e6ae74-6669-3b6c-dcf6-9da9c8788e4e\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"49e6ae74-6669-3b6c-dcf6-9da9c8788e4e\",\"ParentId\":\"c8218455-7912-537c-a6a3-7e3760f2debe\",\"Text\":\"ستون 3\",\"Hierarchy\":[\"49e6ae74-6669-3b6c-dcf6-9da9c8788e4e\",\"c8218455-7912-537c-a6a3-7e3760f2debe\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"b517166a-6fe5-0e61-594a-0dc8f43b6dcf\",\"ActionId\":1,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;variables&gt;&lt;variable id=\\\"{DP|-8AW#q%^x3meJm7E\\\"&gt;t&lt;/variable&gt;&lt;/variables&gt;&lt;block type=\\\"main_func\\\" id=\\\"kRB8J9Y!p`]g^adeWTkY\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;statement name=\\\"STATEMENT\\\"&gt;&lt;block type=\\\"variables_set\\\" id=\\\"CBa`8dsX6qM5h,,4Nfn5\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"{DP|-8AW#q%^x3meJm7E\\\"&gt;t&lt;/field&gt;&lt;value name=\\\"VALUE\\\"&gt;&lt;block type=\\\"math_arithmetic\\\" id=\\\"AL,d$?1|cCMSfmMg;Rfv\\\"&gt;&lt;field name=\\\"OP\\\"&gt;MULTIPLY&lt;/field&gt;&lt;value name=\\\"A\\\"&gt;&lt;block type=\\\"Columns\\\" id=\\\"Sj1v0A$fI#C`9%tG-+6I\\\"&gt;&lt;field name=\\\"NAME\\\"&gt;49e6ae74-6669-3b6c-dcf6-9da9c8788e4e&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;value name=\\\"B\\\"&gt;&lt;block type=\\\"math_number\\\" id=\\\"}ag:@MvZENq@IgcjZSMu\\\"&gt;&lt;field name=\\\"NUM\\\"&gt;2&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/statement&gt;&lt;value name=\\\"RETURN\\\"&gt;&lt;block type=\\\"variables_get\\\" id=\\\"fPQyO2dIvm*GEhR$5lVF\\\"&gt;&lt;field name=\\\"VAR\\\" id=\\\"{DP|-8AW#q%^x3meJm7E\\\"&gt;t&lt;/field&gt;&lt;/block&gt;&lt;/value&gt;&lt;/block&gt;&lt;/xml&gt;\"}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "020e6d48-9866-ad18-1071-396061a7f1a0",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "6b820601-919c-14c8-6dba-0ba304a6485b",
                    "Guid": "c8033e90-4166-7b57-7442-e2d90c560432",
                    "ParentGuid": "020e6d48-9866-ad18-1071-396061a7f1a0",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون ۱\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "c525bb69-82f7-49fc-d66d-5e22f5f7ceaa",
                    "Guid": "18c12dcc-45f2-eeb9-bd61-54f6bd8129f3",
                    "ParentGuid": "020e6d48-9866-ad18-1071-396061a7f1a0",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون 2\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "30d67de2-0a29-8873-6435-9eae294d08e8",
                    "Guid": "49e6ae74-6669-3b6c-dcf6-9da9c8788e4e",
                    "ParentGuid": "020e6d48-9866-ad18-1071-396061a7f1a0",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون 3\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "a56703f4-c13c-6e75-0862-791aead356d2",
                    "Guid": "b517166a-6fe5-0e61-594a-0dc8f43b6dcf",
                    "ParentGuid": "020e6d48-9866-ad18-1071-396061a7f1a0",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون 4\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 4
                }
            ],
            "Plugins": []
        }
    ],
    "Row": null,
    "Variables": null
}

export const data5={
    "DataModels": [
        {
            "Guid": "900aef6e-620c-ab21-b198-2f77cc936af7",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "Table1_On_Event",
            "Label": "Table1_On_Event",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "6b820601-919c-14c8-6dba-0ba304a6485b",
                    "DataType": 3,
                    "Name": "Column1",
                    "Label": "ستون ۱",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "c525bb69-82f7-49fc-d66d-5e22f5f7ceaa",
                    "DataType": 3,
                    "Name": "Column2",
                    "Label": "ستون 2",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "30d67de2-0a29-8873-6435-9eae294d08e8",
                    "DataType": 3,
                    "Name": "Column3",
                    "Label": "ستون 3",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "a56703f4-c13c-6e75-0862-791aead356d2",
                    "DataType": 1,
                    "Name": "Column4",
                    "Label": "ستون 4",
                    "Setting": "{\"MaxLength\":128}",
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "8689b1a1-d09b-01cc-dafc-627488e57f48",
                    "DataType": 3,
                    "Name": "Column5A",
                    "Label": "ستون 5",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        }
    ],
    "Layouts": [
        {
            "Validations": [
                {
                    "Guid": "ed4cf9b4-bc73-429d-463d-304e110f7afb",
                    "LayoutItemGuid": "d5370412-b19e-8fb9-6413-3def775653f1",
                    "Type": 2,
                    "Setting": "{\"Max\": 128}"
                }
            ],
            "ComplexValidations": [],
            "Guid": "a2073221-943d-0cc2-56a4-967f63a2b4bb",
            "DataModelGuid": "900aef6e-620c-ab21-b198-2f77cc936af7",
            "Label": "فرم اول",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.6813903411971396,\"Type\":1,\"LayoutItemGuid\":\"198adeba-b91e-0af9-ec3a-ec8916934d62\",\"Children\":[{\"Id\":0.582421396221764,\"Type\":2,\"Columns\":[{\"Id\":0.2530985772717127,\"Type\":3,\"LayoutItemGuid\":\"a3b5d65f-0d18-f4bf-65b9-2845e66a1771\",\"Col\":6},{\"Id\":0.04385043609332462,\"Type\":3,\"LayoutItemGuid\":\"f362a790-b5d9-ae92-4241-6b5cd75f7303\",\"Col\":6}]},{\"Id\":0.05661980087015628,\"Type\":2,\"Columns\":[{\"Id\":0.27772474643221223,\"Type\":3,\"LayoutItemGuid\":\"498d250d-cc8d-1c75-341c-503d11ef230f\",\"Col\":6},{\"Id\":0.09280844063381721,\"Type\":3,\"LayoutItemGuid\":\"d5370412-b19e-8fb9-6413-3def775653f1\",\"Col\":6}]}]}],\"Events\":[{\"Title\":\"1\",\"LayoutItems\":[{\"Guid\":\"6b820601-919c-14c8-6dba-0ba304a6485b\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"6b820601-919c-14c8-6dba-0ba304a6485b\",\"ParentId\":\"a2073221-943d-0cc2-56a4-967f63a2b4bb\",\"Text\":\"ستون ۱\",\"Hierarchy\":[\"6b820601-919c-14c8-6dba-0ba304a6485b\",\"a2073221-943d-0cc2-56a4-967f63a2b4bb\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"c525bb69-82f7-49fc-d66d-5e22f5f7ceaa\",\"ActionId\":3,\"CodeXml\":\"&lt;xml xmlns=\\\"https://developers.google.com/blockly/xml\\\"&gt;&lt;block type=\\\"main_func\\\" id=\\\"@Rd?E?@1)*dOtsy,4*,T\\\" deletable=\\\"false\\\" x=\\\"-271\\\" y=\\\"74\\\"&gt;&lt;/block&gt;&lt;/xml&gt;\"}]},{\"Title\":\"2\",\"LayoutItems\":[{\"Guid\":\"30d67de2-0a29-8873-6435-9eae294d08e8\",\"EventId\":1,\"ExtraData\":{\"layoutItem\":{\"Id\":\"30d67de2-0a29-8873-6435-9eae294d08e8\",\"ParentId\":\"a2073221-943d-0cc2-56a4-967f63a2b4bb\",\"Text\":\"ستون 3\",\"Hierarchy\":[\"30d67de2-0a29-8873-6435-9eae294d08e8\",\"a2073221-943d-0cc2-56a4-967f63a2b4bb\"],\"Children\":[],\"DisableSelect\":false,\"Metadata\":{\"Type\":2},\"IsLeaf\":true,\"IsLastChildHierarchy\":[true,false]}}}],\"Actions\":[{\"Guid\":\"a56703f4-c13c-6e75-0862-791aead356d2\",\"ActionId\":2,\"CodeXml\":\"\\n&lt;xml&gt;&lt;block type=\\\"main_func\\\" x=\\\"-271\\\" y=\\\"74\\\" deletable=\\\"false\\\"&gt;&lt;/block&gt;&lt;/xml&gt;\"}]}],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "198adeba-b91e-0af9-ec3a-ec8916934d62",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "6b820601-919c-14c8-6dba-0ba304a6485b",
                    "Guid": "a3b5d65f-0d18-f4bf-65b9-2845e66a1771",
                    "ParentGuid": "198adeba-b91e-0af9-ec3a-ec8916934d62",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون ۱\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "c525bb69-82f7-49fc-d66d-5e22f5f7ceaa",
                    "Guid": "f362a790-b5d9-ae92-4241-6b5cd75f7303",
                    "ParentGuid": "198adeba-b91e-0af9-ec3a-ec8916934d62",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون 2\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 2
                },
                {
                    "ColumnGuid": "30d67de2-0a29-8873-6435-9eae294d08e8",
                    "Guid": "498d250d-cc8d-1c75-341c-503d11ef230f",
                    "ParentGuid": "198adeba-b91e-0af9-ec3a-ec8916934d62",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون 3\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 3
                },
                {
                    "ColumnGuid": "a56703f4-c13c-6e75-0862-791aead356d2",
                    "Guid": "d5370412-b19e-8fb9-6413-3def775653f1",
                    "ParentGuid": "198adeba-b91e-0af9-ec3a-ec8916934d62",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون 4\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 4
                }
            ],
            "Plugins": []
        }
    ],
    "Row": null,
    "Variables": null
}

const designerData={
    "DataModels": [
        {
            "Guid": "b9b418d0-783a-d0b0-ed56-afebabb7839c",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "Final_NEW_DDM_Table1",
            "Label": "جدول ۱",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "8da81802-f78b-27da-4e5e-30f5e525af7a",
                    "DataType": 3,
                    "Name": "Column1",
                    "Label": "ستون ۱",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "55dd4d7b-020a-23fb-1503-773864f1cfc5",
                    "DataType": 3,
                    "Name": "Column2",
                    "Label": "ستون 2",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "4ae1c762-cb38-105b-00c9-5f0a1ebd9e62",
                    "DataType": 3,
                    "Name": "Column3",
                    "Label": "ستون 3",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [],
            "Variables": [],
            "InputVariableType": null
        },
        {
            "Guid": "24aefe86-fef2-ebed-0e94-e64c6045d9d0",
            "SoftwareGuid": "2cc1539a-9c27-49f8-8202-f2e8ad960c8b",
            "ScopeGuid": "25bb8458-c64c-4b53-973e-a122572ff902",
            "Name": "Final_NEW_DDM",
            "Label": "Final_NEW_DDM",
            "Type": 1,
            "Columns": [
                {
                    "Guid": "c4069ada-5a32-9c6e-ebb0-93a58d649fe1",
                    "DataType": 3,
                    "Name": "F1",
                    "Label": "فیلد یک",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "72fed647-e758-4488-f955-0c3e7427e3b6",
                    "DataType": 3,
                    "Name": "F2",
                    "Label": "فیلد دو",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                },
                {
                    "Guid": "926cbb79-2a45-05aa-ba9f-9efeebc43cbc",
                    "DataType": 3,
                    "Name": "F3",
                    "Label": "فیلد3",
                    "Setting": null,
                    "Bookmark": "",
                    "BookmarkType": 0
                }
            ],
            "Relations": [
                {
                    "Guid": "8c575056-e208-cfe0-5442-29182a22b164",
                    "ReferenceDataModelGuid": "b9b418d0-783a-d0b0-ed56-afebabb7839c",
                    "Name": "Final_NEW_DDM_Final_NEW_DDM_Table1",
                    "Label": "Final_NEW_DDM_جدول ۱",
                    "Nature": 2,
                    "Type": 2,
                    "Bookmark": "",
                    "VariableGuid": null,
                    "Settings": []
                }
            ],
            "Variables": [],
            "InputVariableType": null
        }
    ],
    "Layouts": [
        {
            "ShowFormItemLabelInSepratedRow": false,
            "Validations": [],
            "ComplexValidations": [],
            "Guid": "2c72fc78-de28-129b-3769-c82f6c8fa174",
            "DataModelGuid": "24aefe86-fef2-ebed-0e94-e64c6045d9d0",
            "Label": "main",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.3564813076358465,\"Type\":1,\"LayoutItemGuid\":\"069d828b-6cea-3e31-7a17-8a45fe444e7b\",\"Children\":[{\"Id\":0.28333251100204226,\"Type\":2,\"Columns\":[{\"Id\":0.44639111879876436,\"Type\":3,\"LayoutItemGuid\":\"8e103371-32f0-bb2b-d970-2ca99636b6d1\",\"Col\":12}]},{\"Id\":0.7223285667308591,\"Type\":2,\"Columns\":[{\"Id\":0.2829292399572618,\"Type\":5,\"LayoutItemGuid\":\"32a151da-4bcb-0a1e-dad4-266a57446d04\",\"Col\":12}]}]}],\"Events\":[],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "069d828b-6cea-3e31-7a17-8a45fe444e7b",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "c4069ada-5a32-9c6e-ebb0-93a58d649fe1",
                    "Guid": "8e103371-32f0-bb2b-d970-2ca99636b6d1",
                    "ParentGuid": "069d828b-6cea-3e31-7a17-8a45fe444e7b",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"فیلد یک\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                },
                {
                    "RelationGuid": "8c575056-e208-cfe0-5442-29182a22b164",
                    "SubLayoutGuid": "5093a5b2-1a33-aabc-1555-031c6b34eebc",
                    "Guid": "32a151da-4bcb-0a1e-dad4-266a57446d04",
                    "ParentGuid": "069d828b-6cea-3e31-7a17-8a45fe444e7b",
                    "Type": 4,
                    "Design": "{}",
                    "OrderIndex": 2
                }
            ],
            "Plugins": []
        },
        {
            "ShowFormItemLabelInSepratedRow": false,
            "Validations": [],
            "ComplexValidations": [],
            "Guid": "b0427223-2821-7c4e-45b5-d24d488e92dc",
            "DataModelGuid": "b9b418d0-783a-d0b0-ed56-afebabb7839c",
            "Label": "inner-form",
            "Type": 1,
            "PlatformType": 1,
            "Design": "{\"IsResponsive\":false,\"Arrangement\":[{\"Id\":0.522555646765912,\"Type\":1,\"LayoutItemGuid\":\"1b2a7b5c-9104-d6af-63f7-2e60a288aab8\",\"Children\":[{\"Id\":0.19228404134928612,\"Type\":2,\"Columns\":[{\"Id\":0.6081491399808951,\"Type\":3,\"LayoutItemGuid\":\"7c8c92ff-2256-de76-46b6-9f80d5188efe\",\"Col\":12}]}]}],\"Events\":[],\"DesignType\":0}",
            "IsDefault": false,
            "Items": [
                {
                    "Guid": "1b2a7b5c-9104-d6af-63f7-2e60a288aab8",
                    "ParentGuid": null,
                    "Type": 1,
                    "Design": "{\"Label\":\"فیلدست جدید\",\"Widget\":{\"Id\":1}}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "8da81802-f78b-27da-4e5e-30f5e525af7a",
                    "Guid": "7c8c92ff-2256-de76-46b6-9f80d5188efe",
                    "ParentGuid": "1b2a7b5c-9104-d6af-63f7-2e60a288aab8",
                    "Type": 2,
                    "Design": "{\"Widget\":\"EditWidget\",\"EditWidget\":{\"Id\":0},\"DisplayWidget\":{\"Id\":0},\"SearchWidget\":{\"Id\":0},\"Label\":\"ستون ۱\",\"HelpTooltip\":null,\"Direction\":\"unset\",\"LabelMutable\":false}",
                    "OrderIndex": 1
                }
            ],
            "Plugins": []
        },
        {
            "DefineLayoutGuid": "b0427223-2821-7c4e-45b5-d24d488e92dc",
            "Guid": "5093a5b2-1a33-aabc-1555-031c6b34eebc",
            "DataModelGuid": "b9b418d0-783a-d0b0-ed56-afebabb7839c",
            "Label": "table",
            "Type": 3,
            "PlatformType": 1,
            "Design": "{\"Widget\":{\"Id\":0,\"SearchSetting\":{\"Enable\":false,\"LayoutItemGuid\":null,\"ColumnViewModelGuid\":null}}}",
            "IsDefault": false,
            "Items": [
                {
                    "ColumnGuid": "8da81802-f78b-27da-4e5e-30f5e525af7a",
                    "Guid": "01752a44-fe12-9c5f-40c3-02465badd8b9",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"ستون ۱\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 1
                },
                {
                    "ColumnGuid": "55dd4d7b-020a-23fb-1503-773864f1cfc5",
                    "Guid": "4bf5aa38-0f73-a8a2-8252-3f2f5bbd0338",
                    "ParentGuid": null,
                    "Type": 2,
                    "Design": "{\"Widget\":\"DisplayWidget\",\"DisplayWidget\":{\"Id\":0},\"Label\":\"ستون 2\",\"HelpTooltip\":null,\"Direction\":\"unset\"}",
                    "OrderIndex": 2
                }
            ],
            "Plugins": []
        }
    ]
}

export function toMockApiData(dataset: any): any {
    return {
        DataModels: dataset.DataModels ,
        Layouts: dataset.Layouts,
        Row: dataset.Row,
        Variables: dataset.Variables,
    };
}

export const datasetConfigs = {
    data1: { data: data1, layoutGuid: 'bf8be894-a773-dd67-a78b-19d0441b4909', label: 'فرم05 — with Result col in grid' },
    data2: { data: data2, layoutGuid: '3b90c3d8-e2dc-efa6-0b5c-d274c3d1f775', label: 'فرم4 — without Result col in grid' },
    data3: { data: data3, layoutGuid: 'e1524d4c-d92b-2763-71a4-20cd059513c7', label: 'فرم1 — Score/Point dataset' },
    data4: { data: data4, layoutGuid: 'c8218455-7912-537c-a6a3-7e3760f2debe', label: 'فرم روی rc — c1+c2→c3, c3*2→c4' },
    data5: { data: data5, layoutGuid: 'a2073221-943d-0cc2-56a4-967f63a2b4bb', label: 'فرم اول — required/disabled on event' },
};
