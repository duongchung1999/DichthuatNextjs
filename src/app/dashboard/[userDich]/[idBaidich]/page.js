import React from 'react';
import DashboardViewItemClient from './DashboardViewItemClient';
import { getKeyValueFromFireBase, getValueFromPath } from '@/component/firebase/Firebase';

export default function Page({ params }) {
    const userDich = params.userDich;
    const idBaidich = params.idBaidich;

    return <DashboardViewItemClient idBaidich={idBaidich} userDich={userDich}/>;
}

export async function generateStaticParams() {
    const slugList = await getUserList();
    const paths = [];

    for (const userDichObj of slugList) {
        // console.log(userDichObj.key);
        const idList = await getIdList(userDichObj.key);

        for (const id of idList) {
            paths.push({
                userDich: userDichObj.key,
                idBaidich: id.key,
            });
        }
    }

    return paths;
}

async function getUserList() {
    const userDichPath = '/users/dashboard';
    const userDichs = await getKeyValueFromFireBase(userDichPath);
    // console.log("User List:", userDichs);
    return userDichs;
}

async function getIdList(userDichKey) {
    const idPath = `/users/dashboard/${userDichKey}`;
    const idObjects = await getKeyValueFromFireBase(idPath);
    // console.log(`ID List for ${userDichKey}:`, idObjects);
    return idObjects;
}

