import Posts from '@/components/Home/Posts';
import WatchList from '@/components/ManagePost/WatchList';
import { app } from '@/shared/FirebaseConfig';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function index() {
    const {data:session} = useSession();
    const [sessionDone, setSessionDone] = useState(false);
    const [watchlistDone, setWatchlistDone] = useState(false);
    const [postsDone, setPostsDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [sessionData, setSessionData] = useState();
    const router = useRouter();
    const db = getFirestore(app);

    const fetchSession=async()=>{
        const currentSession = session || await getSession();
        if(!currentSession){
            router.push('/');
        }
        else{
            setSessionData(currentSession);
            // const q = query(collection(db, "posts"),
            // where("email","==",currentSession?.user.email)); 
            // const querySnapshot = await getDocs(q);
            // querySnapshot.forEach((doc)=>{
            //     let data = doc.data();
            //     data.id = doc.id;
            //     newPosts.push(data);
            // })
            // setPosts(newPosts);
        }
    } 

    const fetchPosts=async()=>{
        const newPosts = [];
        const q = query(collection(db, "posts"),
        where("email","==",sessionData.user.email)); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            let data = doc.data();
            data.id = doc.id;
            newPosts.push(data);
        })
        setPosts(newPosts);
    }

    const fetchWatchlist=async()=>{
        const q = query(collection(db, "users"),
        where("email","==",sessionData.user.email));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        if (userDoc) {
            const activitiesFound = userDoc.data().posts || [];
            const watchlistPromises = activitiesFound.map(async (postId) => {
                const qWatchlist = doc(db, "posts", postId);
                const watchlistSnapShot = await getDoc(qWatchlist);
                return watchlistSnapShot.exists() ? { id: watchlistSnapShot.id, ...watchlistSnapShot.data() } : null;
            });
            const activities = await Promise.all(watchlistPromises);
            setWatchlist(activities.filter(Boolean));
        }
        setWatchlistDone(true);
    }

    useEffect(()=>{
        fetchSession();
    },[])

    useEffect(()=>{
        if(sessionData){
            setSessionDone(true);
            fetchPosts();
            fetchWatchlist();
        }
    },[sessionData])
   
    useEffect(()=>{
        if(sessionDone && watchlistDone){
            setLoading(false);
        }
    },[sessionDone, watchlistDone])

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }
    
    return (
        <div>
            <div className='flex flex-col items-center justify-center mt-9'>
                <div className='w-full'>
                    <h1 className='text-center text-blue-500 font-bold text-[35px]'>Your Watchlist</h1>
                    {watchlist?<WatchList posts={watchlist} profiles={false}/>:null}
                </div>
                <div className='w-full'>
                    <h1 className='text-center text-blue-500 font-bold text-[35px]'>Manage Post</h1>
                    {posts?<Posts posts={posts} profiles={true}/>:null}
                </div>                
            </div>
        </div>
    )
}

export default index