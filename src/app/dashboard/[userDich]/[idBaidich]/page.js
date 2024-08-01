import React from 'react';
import DashboardViewItemClient from './DashboardViewItemClient';
import { getKeyValueFromFireBase, getValueFromPath } from '@/component/firebase/Firebase';

export default function DashboardViewItem({ params }) {
    const userDich = params.userDich;
    const idBaidich = params.idBaidich;

    return <DashboardViewItemClient idBaidich={idBaidich} userDich={userDich}/>;
}

export async function generateStaticParams() {
    const slugList = await getUserList();
    const idList = await getIdList();
    const paths = [];
    for (const slug of slugList) {
        for(const id of idList){
            paths.push({
                params: {
                    slug: slug,
                },
            });
        }
        
    }

    return paths;
}

async function getUserList() {
    const userDichPath = `/users/dichthuat`;
    const userDichs = await getKeyValueFromFireBase(userDichPath);
    return Object.keys(userDichs);
}

async function getIdList() {
    const userDichPath = `/users/dichthuat`;
    const userDichs = await getKeyValueFromFireBase(userDichPath);
    const ids = {};

    const idPromises = userDichs.map(async (userDich) => {
        const key = userDich.key;
        const value = await getKeyValueFromFireBase(`${userDichPath}/${key}`);
        ids[key] = value;
    });

    await Promise.all(idPromises);

    return Object.keys(ids);
}