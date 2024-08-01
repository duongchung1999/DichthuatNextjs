import React from 'react';
import BaidichHandleClient from './BaidichHandleClient';
import { getKeyValueFromFireBase } from '@/component/firebase/Firebase';

export default function BaidichHandle({ params }) {
    const slug = params.slug;

    return <BaidichHandleClient slug={slug} />;
}

export async function generateStaticParams() {
    const slugList = await getSlugList();
    return slugList.map(slug => ({ params: { slug } }));
}

async function getSlugList() {
    const slugPath = `/users/dichthuat`;
    const slugs = await getKeyValueFromFireBase(slugPath);
    return Object.keys(slugs);
}



