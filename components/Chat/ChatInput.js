import { app } from '@/shared/FirebaseConfig';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function ChatInput({oppositeEmail, oppositeName}) {
  const db = getFirestore(app);
  const [inputs, setInputs] = useState();
  const {data:session} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState();
  let content = "";

  const fetchSession=async()=>{
    const currentSession = session || await getSession();
    if(currentSession){
      const username = currentSession.user.name;
      const email = currentSession.user.email;
      setInputs({
        sender: email,
        senderName: username,
        receiver: oppositeEmail,
        receiverName: oppositeName
      });
      setLoading(false);
    } 
    else{
      router.push('/');
    }
  }
  
  useEffect(()=>{
    fetchSession();
  },[])

  const handleChange=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values)=>({...values,[name]:value}))
    console.log(inputs);  
  }

  const submitForm=async(e)=>{
    e.preventDefault();
    const currentInput = inputs.content;
    setInputs((values)=>({...values, content:""}));
    const messageData = {
      ...inputs,
      content: currentInput,
      createdAt: new Date(),
    };
    await setDoc(doc(db, "chat", Date.now().toString()), messageData);
  } 

  if(loading){
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className='absolute bottom-0 w-full'>
        <form className='p-1 flex gap-3' onSubmit={submitForm}>
            <input type='text' name='content' value={inputs.content || ""} onChange={handleChange} placeholder='Message' className='border border-gray-400 rounded-lg p-3 w-full'/>
            <button type='submit' className='bg-blue-500 text-white p-2 rounded-lg sm:w-[120px]'>
                Submit
            </button>
        </form>
    </div>
  )
}

export default ChatInput