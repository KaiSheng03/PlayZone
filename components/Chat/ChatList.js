import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function ChatList({users}) {
    const router = useRouter();

    const goToChat=(user)=>{
        router.push({
            pathname: '/chat-box',
            query: {email: user.email, name: user.name, image: user.image}
        })
    }
    
    return (
        <div className='p-5 mt-5'>
            {users.map((item)=>(
                <div className='flex justify-between border border-grap-500 p-5 rounded-lg cursor-pointer' onClick={()=>goToChat(item)}>
                    <div className='flex'>
                        <img src={item.image} width={45} height={30} alt='user-logo' className='rounded-full'/>
                        <div className='ml-3'>
                            <h3>{item.name}</h3>
                            <p>{item.lastContent}</p>
                        </div>
                    </div>
                    
                    <div className='flex flex-col items-center'>
                        <p>{new Date(item.lastTime).toLocaleDateString()}</p>
                        <p>{new Date(item.lastTime).toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default ChatList