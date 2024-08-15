import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'

function ChatBox({chat, oppositeImage}) {
    const {data:session, status} = useSession();
    const router = useRouter();
    let currentSession = [];
    const [user, setUser] = useState();
    const chatEndRef = useRef(null);
    const [userImage, setUserImage] = useState();

    const fetchSession=async()=>{
        currentSession = session || await getSession();
        if(currentSession){
            setUser(currentSession.user.name);
            setUserImage(currentSession.user.image);
        }
        else{
            router.push('/');
        }
    }

    const scrollToBottom=()=>{
        if (chatEndRef.current) {
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
        }
    }

    useEffect(()=>{
        fetchSession();
    },[])

    useEffect(()=>{
        scrollToBottom();
    },[chat])

    return (
        <div ref={chatEndRef} className='max-h-[80vh] overflow-scroll p-5'>
            {chat.map(element => (
                user == element.senderName ? (
                    <div className="chat chat-end">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                            <img
                                src={userImage} />
                            </div>
                        </div>

                        <div className="chat-header">
                            {element.senderName}
                        </div>
                        <div className="chat-bubble">{element.content}</div>
                    </div>
                )
                :(
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                alt="Tailwind CSS chat bubble component"
                                src={oppositeImage} />
                            </div>
                        </div>
                        <div className="chat-header">
                            {element.senderName}
                        </div>
                        <div className="chat-bubble">{element.content}</div>
                    </div>
                )
            ))}
            
                
        </div>
    )
}

export default ChatBox