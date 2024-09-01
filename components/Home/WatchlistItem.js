import React, { useEffect } from 'react'
import { HiOutlineCalendar } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { useSession } from 'next-auth/react';

function ActivityItem({post, profile, modal}) {
    const db = getFirestore();
    const router = useRouter();
    const storage = getStorage();
    const USER_IMAGE = `${post.userImage}`;
    const {data:session} = useSession();

    useEffect(()=>{
        console.log(post);
    })
    
    const removeActivity=async()=>{
        const removeRef = query(collection(db, "users"),
        where("email","==",session.user.email));
        const querySnapshot = await getDocs(removeRef);
        console.log(querySnapshot);
        const userDoc = querySnapshot.docs[0].ref;
        await updateDoc(userDoc, {
            posts: arrayRemove(post.id)
        })
        router.reload();
    }

    const goToChat=()=>{
        router.push({
            pathname: '/chat-box',
            query: {email: post.email, name: post.username, image: post.userImage}
        })
    }

    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                src={post.image}
                alt="Image"
                className='h-[180px]'/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <div className='flex items-center text-orange-500 gap-2'>
                     <HiOutlineCalendar className='text-[20px]'/>
                     {post.date}
                </div>
                <div className='flex items-center text-blue-500 gap-2 mb-2'>
                     <HiOutlineLocationMarker className='text-[20px]'/>
                     {post.location}
                </div>
                {modal && (
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.desc}</p>
                )}   
                <p className='font-bold text-[18px]'>
                    Posted by  
                </p>
                <div className='flex items-center gap-2'>
                    <img src={USER_IMAGE} alt='' width={45} height={60} className='rounded-full'/>
                    <p className='font-bold'>{post.username}</p>
                </div>
                <div className="card-actions">
                    <button className='w-full rounded-lg bg-red-500 text-white text-[20px] h-[40px]'
                    onClick={()=>{removeActivity()}}
                    >
                        Remove from WatchList
                    </button>
                    <button className='w-full rounded-lg bg-blue-500 text-white text-[20px] h-[40px]'
                    onClick={()=>{goToChat()}}
                    >
                        Chat
                    </button>
                </div>
            </div>
        </div>
        // <div className="w-[300px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        //     <img className="rounded-t-lg w-full h-[180px] object-cover" src={post.image} alt="" />
        //     <div className="p-5">
        //         <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        //             {post.title}
        //         </h5>
        //         <div className='flex items-center text-orange-500 gap-2 mb-2'>
        //             <HiOutlineCalendar className='text-[20px]'/>
        //             {post.date}
        //         </div>
        //         <div className='flex items-center text-blue-500 gap-2 mb-2'>
        //             <HiOutlineLocationMarker className='text-[20px]'/>
        //             {post.location}
        //         </div>
        //         {modal && (
        //             <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.desc}</p>
        //         )}   
        //         <p className='font-bold text-[18px]'>
        //             Posted by  
        //         </p>
        //         <div className='flex items-center gap-2 mt-[5px]'>
        //             <img src={USER_IMAGE} alt='' width={45} height={60} className='rounded-full'/>
        //             <p className='font-bold'>{post.username}</p>
        //         </div>
        //     </div>
            
        //     <button className='w-full bg-red-500 text-white text-[20px] h-[35px]'
        //     onClick={()=>{removeActivity()}}
        //     >
        //         Remove from WatchList
        //     </button>
        //     <button className='w-full bg-blue-500 text-white text-[20px] h-[35px]'
        //     onClick={()=>{goToChat()}}
        //     >
        //         Chat
        //     </button>
            
        // </div>
  )
}

export default ActivityItem