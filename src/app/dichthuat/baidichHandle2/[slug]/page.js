import React from 'react';
import BaidichHandleClient from './BaidichHandleClient';
import { getKeyValueFromFireBase } from '@/component/firebase/Firebase';

export default function BaidichHandle({ params }) {
    const slug = params.slug;

    return <BaidichHandleClient slug={slug} />;
}

export async function generateStaticParams() {
    const slugPath = '/users/dichthuat';
    const slugs = await getKeyValueFromFireBase(slugPath);
    
    // Extracting the 'key' from each item in the array
    const slugList = slugs.map(({ key }) => key);
    
    return slugList.map(slug => ({ slug }));
}


