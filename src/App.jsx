import { Form, Button, TextArea, Selector, Input } from 'antd-mobile';
import { QR25D, QRBubble, QRDsj, QRLine, QRNormal, QRRandRect } from 'react-qrbtf';
import html2canvas from 'html2canvas';
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useMemo, useRef, useState } from 'react';
const map = {
    1: QRNormal,
    2: QR25D,
    3: QRBubble,
    4: QRDsj,
    5: QRLine,
    6: QRRandRect
};
const picTypeMap = {
    1: {
        type: 'image/jpeg',
        suffix: '.jpg'
    },
    2: {
        type: 'image/png',
        suffix: '.png'
    }
};
const options = [
    {
        label: '样式一',
        value: 1
    },
    {
        label: '样式二',
        value: 2
    },
    {
        label: '样式三',
        value: 3
    },
    {
        label: '样式四',
        value: 4
    },
    {
        label: '样式五',
        value: 5
    },
    {
        label: '样式六',
        value: 6
    }
];

const typeOptions = [
    {
        label: 'JPG',
        value: 1
    },
    {
        label: 'PNG',
        value: 2
    }
];
function App() {
    const [state, setState] = useState(null);
    const [picType, setPicType] = useState([1]);
    const codeRef = useRef();
    const onChange = (val) => {
        console.log(val);
        setPicType(val);
    };
    const download = useCallback(async () => {
        if (!codeRef.current) return;
        const { type, suffix } = picTypeMap[picType[0]];
        const canvas = await html2canvas(codeRef.current, {
            backgroundColor: picType[0] === 1 ? '#fff' : null
        });
        let imgUrl = canvas.toDataURL(type);
        //imgUrl是截图后图片的地址，是base64格式的
        const aDom = document.createElement('a');
        aDom.href = imgUrl;
        aDom.download = '二维码' + suffix; // 图片的名字
        aDom.click();
    }, [picType]);
    const getQrCode = useMemo(() => {
        if (!state) return false;
        const { tel, message, style } = state;
        const Com = map[style];
        const search = new URLSearchParams();
        search.append('tel', tel);
        search.append('message', message);
        const url = `https://movecar.blackcell.fun?${encodeURIComponent(search.toString())}`;
        return (
            <div>
                <div ref={codeRef}>
                    <Com value={url}></Com>
                </div>
                <div className="my-5">
                    <Selector value={picType} onChange={onChange} options={typeOptions} />
                </div>
                <Button block type="submit" onClick={download} color="primary" size="large">
                    下载
                </Button>
            </div>
        );
    }, [state, download]);
    const onFinish = (values) => {
        setState(() => values);
    };
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <Form
                layout="horizontal"
                className="w-full"
                onFinish={onFinish}
                footer={
                    <Button block type="submit" color="primary" size="large">
                        生成二维码
                    </Button>
                }
            >
                <Form.Header>生成挪车二维码</Form.Header>
                <Form.Item
                    name="tel"
                    label="手机号"
                    rules={[{ required: true, message: '手机号不能为空' }]}
                >
                    <Input placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item name="message" label="默认短信">
                    <TextArea placeholder="请输入默认短信" />
                </Form.Item>
                <Form.Item name="style" label="样式">
                    <Selector options={options} />
                </Form.Item>
            </Form>
            {getQrCode}
            <div className="flex mt-8 flex-col justify-center items-center gap-1 !text-default-600 dark:!text-default-500 font-extralight text-sm">
                <p>
                    备案号:&nbsp;
                    <a
                        className="text-sm"
                        target="_blank"
                        href="https://beian.miit.gov.cn/"
                        rel="noreferrer"
                    >
                        鄂ICP备2021009860号
                    </a>
                </p>
                <p>BlackCell&nbsp;2021-present</p>
            </div>
        </div>
    );
}

export default App;
