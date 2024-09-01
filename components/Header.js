import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { HiMiniArrowLeftStartOnRectangle, HiMiniChatBubbleLeft, HiPencilSquare } from "react-icons/hi2";
import { HiMiniArrowLeftOnRectangle } from "react-icons/hi2";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoIosPaper } from "react-icons/io";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { app } from '@/shared/FirebaseConfig';
import { FaMessage } from "react-icons/fa6";

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
            <div className='flex gap-3 items-center sm:gap-4'>
                <button onClick={()=>router.push('/create-post')} className='bg-black p-2 px-3 text-white rounded-full'>
                    <HiPencilSquare className='text-[23px]' />
                </button>
                
                <button onClick={()=>router.push('/chat')} className='bg-black p-2 px-3 text-white rounded-full'>
                    <FaMessage alt='chat' className='text-[23px]'/>
                </button>
                

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
                            <a><IoPersonCircleSharp className='text-[25px]'/>Profile</a>
                        </li>
                        <li onClick={(e)=>{
                            router.push('./manage-post');
                            e.target.closest('details').removeAttribute('open'); 
                        }}>
                            <a><IoIosPaper className='text-[25px]'/>Manage Post</a>
                        </li>
                        {!session?
                            <li onClick={(e)=>{
                                signIn();
                                e.target.closest('details').removeAttribute('open'); 
                            }}>
                                <a><HiMiniArrowLeftOnRectangle className='text-[25px]'/>Sign In</a>
                            </li>
                        :
                            <li onClick={(e)=>{
                                signOut();
                                e.target.closest('details').removeAttribute('open'); 
                            }}>
                                <a><HiMiniArrowLeftStartOnRectangle className='text-[25px]'/>Sign Out</a>
                            </li>
                        }
                    </ul>
                </details>
            </div>
        </div>
    )
}

export default Header