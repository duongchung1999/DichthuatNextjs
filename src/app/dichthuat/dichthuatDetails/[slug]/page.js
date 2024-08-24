import React from 'react';
import DichThuatDetailsClient from './DichthuatDetailsClient';
import { getKeyValueFromFireBase } from '@/component/firebase/Firebase';

export default function DichThuatDetails({ params }) {
    const slug = params.slug;

    return <DichThuatDetailsClient slug={slug} />;
}

// export async function generateStaticParams() {
//     const slugList = await getSlugList();
//     return slugList.map(slug => ({ slug }));
// }

// async function getSlugList() {
//     const userDichPath = `/users/dichthuat`;
//     const userDichs = await getKeyValueFromFireBase(userDichPath);
//     return Object.keys(userDichs);
// }
export async function generateStaticParams() {
    const slugPath = '/users/dichthuat';
    const slugs = await getKeyValueFromFireBase(slugPath);
    
    // Extracting the 'key' from each item in the array
    const slugList = slugs.map(({ key }) => key);
    
    return slugList.map(slug => ({ slug }));
}