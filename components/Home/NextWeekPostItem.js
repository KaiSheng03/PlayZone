import { arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { IoIosTime } from 'react-icons/io';

function NextWeekPostItem({post, profile, modal}) {
    const db = getFirestore();
    const router = useRouter();
    const storage = getStorage();
    const USER_IMAGE = `${post.userImage}`;
    const {data:session} = useSession();
    
    const deletePost=()=>{
        const deleteRef = ref(storage, `${post.image}`);
        deleteObject(deleteRef).then(async()=>{
            await deleteDoc(doc(db, "posts", post.id));
            router.reload();
        })
    }

    const goToChat=()=>{
        router.push({
            pathname: '/chat-box',
            query: {email: post.email, name: post.username, image: post.userImage}
        })
    }

    const routeToProfile=()=>{
        router.push({
            pathname: '/profile',
            query: {email: post.email}
        })
    }

    const addToActivity=async()=>{
        console.log(session);
        const q = query(collection(db, "users"),
        where("name","==",session.user.name));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            router.push("/");
        }
        else{
            console.log(querySnapshot.docs[0].ref);
            const userDoc = querySnapshot.docs[0].ref;
            await updateDoc(userDoc, {
                posts: arrayUnion(post.id)
            });
        }
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
                <div className='flex items-center text-green-700 gap-2'>
                     <IoIosTime className='text-[20px]'/>
                     {post.time}
                </div>
                <div className='flex items-center text-blue-500 gap-2 mb-2'>
                     <HiOutlineLocationMarker className='text-[20px]'/>
                     {post.location}
                </div>
                {modal && (
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.desc}</p>
                )}   
                
                {
                    modal && (
                        <div>
                            <p className='font-bold text-[18px] mb-2'>
                                Posted by  
                            </p>
                            <div className='flex items-center gap-2'>
                                <img src={USER_IMAGE} alt='' width={45} height={60} className='rounded-full cursor-pointer'
                                onClick={()=>routeToProfile()}/>
                                <p className='font-bold'>{post.username}</p>
                            </div>
                        </div>
                    )
                }
                <div className="card-actions">
                    {modal && !profile &&(
                        <div className='w-full mt-2'>
                            <button className='w-full mb-2 rounded-lg bg-red-500 text-white text-[20px] h-[40px]' onClick={()=>addToActivity()}>
                                Add To My Watchlist
                            </button>
                            <button className='w-full rounded-lg bg-blue-500 text-white text-[20px] h-[40px]'
                            onClick={()=>{goToChat()}}
                            >
                                Chat
                            </button>
                        </div>
                    )}
                    {profile && (
                        <button className='w-full rounded-lg bg-red-500 text-white text-[20px] h-[40px]'
                        onClick={()=>{deletePost()}}
                        >
                            Delete
                        </button>
                    )}
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
        //     {modal && !profile &&(
        //         <div>
        //             <button className='w-full bg-red-500 text-white text-[20px] h-[35px]' onClick={()=>addToActivity()}>
        //                 Add To My Watchlist
        //             </button>
        //         </div>
        //     )}
        //     {profile ? (
        //         <button className='w-full bg-red-500 text-white text-[20px] h-[35px]'
        //         onClick={()=>{deletePost()}}
        //         >
        //             Delete
        //         </button>
        //     ):(
        //         <button className='w-full bg-blue-500 text-white text-[20px] h-[35px]'
        //         onClick={()=>{goToChat()}}
        //         >
        //             Chat
        //         </button>
        //     )}
            
        // </div>
  )
}

export default NextWeekPostItem