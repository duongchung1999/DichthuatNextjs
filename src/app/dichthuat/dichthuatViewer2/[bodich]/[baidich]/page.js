import React from 'react';
import DichthuatViewerClient from './DichthuatViewerClient';
import { getKeyValueFromFireBase, getValueFromPath } from '@/component/firebase/Firebase';

export default function DichthuatViewer({ params }) {
    const bodich = params.bodich;
    const baidich = params.baidich;

    return <DichthuatViewerClient bodich={bodich} baidich={baidich}/>;
}

export async function generateStaticParams() {
    const bodichList = await getBodichList();
    const paths = [];

    for (const bodichObj of bodichList) {
        const baidichList = await getBaidichList(bodichObj.key);

        for (const baidich of baidichList) {
            paths.push({
                bodich: bodichObj.key,
                baidich: baidich.key,
            });
        }
    }

    return paths;
}

async function getBodichList() {
    const boDichPath = `/users/dichthuat`;
    const bodichs = await getKeyValueFromFireBase(boDichPath);
    return bodichs;
}

async function getBaidichList(bodichKey) {
    const baidichPath = `/users/dichthuat/${bodichKey}/listBaihoc`;
    const baidichs = await getKeyValueFromFireBase(baidichPath);
    return baidichs;
}
