import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { HiMiniChatBubbleLeft, HiPencilSquare } from "react-icons/hi2";
import { HiMiniArrowLeftOnRectangle } from "react-icons/hi2";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { app } from '@/shared/FirebaseConfig';

const USER_IMAGE = 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1686314044/1617826370281_30f9a2a96a.jpg'

function Header() {
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState();
    const [userSaved, setUserSaved] = useState(false);
    const db = getFirestore(app);

    const checkAuthentication=async()=>{
        const q = query(collection(db, "users"),
        where("email","==",session.user.email));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            createUser();
        }
    }
    
    const createUser=async()=>{
        const newUser = {};
        newUser.name = session.user.name;
        newUser.email = session.user.email;
        newUser.image = session.user.image;
        setUser(newUser);
    }
    
    const saveUser=async()=>{
        setUserSaved(true);
        console.log(user);
        await setDoc(doc(db, "users", Date.now().toString()), user);
    }

    useEffect(()=>{
        if(user && userSaved==false){
            saveUser();
        }
    },[user])

    useEffect(()=>{
        if(session){
            checkAuthentication();
        }
    },[session])
    
    return (
        <div className='flex items-center justify-between p-3 border-b-[2px] border-[#FF3366]'>
            <h1 className='font-bold text-[33px] text-green-700 ml-2 cursor-pointer' onClick={()=>router.push('/')}>PlayZone</h1>
            <div className='flex gap-2 items-center sm:gap-4'>
                <button onClick={()=>router.push('/create-post')} className='bg-black p-2 px-3 text-white rounded-full'>
                    <span className='hidden sm:block'>CREATE POST</span>
                    <HiPencilSquare className='sm:hidden text-[20px]' />
                </button>
                
                <HiMiniChatBubbleLeft alt='chat'
                className='cursor-pointer border border-gray-500 rounded-full text-[47px] p-1' 
                onClick={()=>router.push('/chat')}/>

                <details className="dropdown dropdown-end">
                    <summary className="btn p-0 rounded-full m-1">
                        <Image src={session?session?.user?.image:USER_IMAGE} width={45} height={30} alt='user image' 
                        className='rounded-full cursor-pointer'/>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li onClick={(e)=>{
                            router.push('./profile');
                            e.target.closest('details').removeAttribute('open'); 
                        }}>
                            <a>Manage Post</a>
                        </li>
                        {!session?
                            <li onClick={(e)=>{
                                signIn();
                                e.target.closest('details').removeAttribute('open'); 
                            }}>
                                <a>Sign In</a>
                            </li>
                        :
                            <li onClick={(e)=>{
                                signOut();
                                e.target.closest('details').removeAttribute('open'); 
                            }}>
                                <a>Sign Out</a>
                            </li>
                        }
                    </ul>
                </details>
            </div>
        </div>
    )
}

export default Header