import React, { useEffect, useState } from 'react'
import Data from '@/shared/Data'
import { useSession } from 'next-auth/react';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/shared/FirebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from 'next/router';

function Form() {
    const [inputs, setInputs] = useState([{}]);
    const [file, setFile] = useState([]);
    const [submit, setSubmit] = useState(false);
    const {data:session} = useSession();
    const db = getFirestore(app);

    const storage = getStorage();
    const router = useRouter();

    useEffect(()=>{
        setInputs((values)=>({...values,
            username:session.user.name}));
        setInputs((values)=>({...values,
            userImage:session.user.image}));
        setInputs((values)=>({...values,
            email:session.user.email}));
        setInputs((values)=>({...values,
            game:"Cricket"}));
    },[session])

    useEffect(()=>{
        if(submit){
            savePost();
        }
    },[submit])

    const savePost=async()=>{
        await setDoc(doc(db, "posts", Date.now().toString()), inputs);
        router.back();
    }

    const handleChange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values)=>({...values,[name]:value}))
        console.log(inputs);
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log("Onsubmit", inputs);
        const storageRef = ref(storage, 'ninja-player/'+file?.name+(Date.now().toString()));
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        }).then(resp=>{
            getDownloadURL(storageRef).then(async(url)=>{
                setInputs((values)=>({...values,
                    image:url}));
                setSubmit(true);
            })
        });
    }

    return (
        <div className='mt-4'>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={handleChange} required name='title' placeholder='Title' className='w-full mb-4 border-[1px] p-2 rounded-md'/>
                <textarea name='desc' onChange={handleChange} required className='w-full mb-4 outline-blue-400 border-[1px] p-2 rounded-md' placeholder='Write Description Here'/>
                <input type='date' onChange={handleChange} required name='date' className='w-full mb-4 border-[1px] p-2 rounded-md'/>
                <input type='time' onChange={handleChange} required name='time' className='w-full mb-4 border-[1px] p-2 rounded-md'/>
                <input type='text' onChange={handleChange} required placeholder='Location' name='location' className='w-full mb-4 border-[1px] p-2 rounded-md'/>
                <input type='text' onChange={handleChange} required placeholder='Zip' name='zip' className='w-full mb-4 border-[1px] p-2 rounded-md'/>
                <select name='game' onChange={handleChange} required className='w-full mb-4 border-[1px] p-2 rounded-md'>
                    {Data.GameList.map((item) => (
                        <option key={item.id}>{item.name}</option>
                    ))}
                </select>
                <input type="file" onChange={(e)=>setFile(e.target.files[0])} accept="image/gif, image/jpeg, image/png" className="mb-5 border-[1px] w-full"/>
                <button type='submit' className='bg-blue-500 w-full p-1 h-[40px] rounded-lg text-white'>
                    Submit
                </button>   
            </form>
            
        </div>
    ) 
}

export default Form