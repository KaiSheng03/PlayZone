import Form from '@/components/CreatePost/Form';
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function CreatePost() {
    const {data:session, status} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const fetchSession=async()=>{
        const currentSession = session || await getSession();
        if(!currentSession){
            router.push('/')
        }
        else{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchSession();
    },[])

    if(loading || status === "loading"){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className='flex justify-center'>
            <div className='p-6 mt-8 lg:w-[35%] md:w-[50%]'>
                <h2 className='text-[30px] 
                font-extrabold text-blue-500'>CREATE POST</h2>
                <p>Create Post and Discover/Invite new Friends and Player </p>
                <Form/>
            </div>
        </div>
    )
}

export default CreatePost