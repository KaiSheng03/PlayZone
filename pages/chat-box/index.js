import ChatBox from '@/components/Chat/ChatBox';
import ChatInput from '@/components/Chat/ChatInput';
import { app } from '@/shared/FirebaseConfig';
import { collection, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function index() {
    const router = useRouter();
    const {email} = router.query;
    const {name} = router.query;
    const {image} = router.query;
    const db = getFirestore(app);
    const {data:session, status} = useSession();
    const [chats, setChats] = useState();
    const [loading, setLoading] = useState(true);

    const fetchSession=async()=>{
        const currentSession = session || await getSession();
        if(currentSession){
            console.log(currentSession);
            fetchChat(currentSession);
        }
        else{
            router.push('/');
        }
    }

    const fetchChat=async(currentSession)=>{
        const newChat = [];
        const q = query(
            collection(db, "chat"),
            where("sender", "in", [currentSession.user.email, email]),
            where("receiver", "in", [currentSession.user.email, email]),
            orderBy("createdAt", "asc")
        );
        
        onSnapshot(q, (querySnapshot) => {
            const newChat = [];
            querySnapshot.forEach((item) => {
                newChat.push(item.data());
            });
            setChats(newChat);
            setLoading(false);
        });
    }

    useEffect(()=>{
        console.log(email);
        if(email){
            fetchSession();
        }
    },[email])

    if(loading || status==="loading"){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className='mt-5'>
            <ChatBox chat={chats} oppositeImage={image}/>
            <ChatInput oppositeEmail={email} oppositeName={name}/>
        </div>
  )
}

export default index