import Posts from '@/components/Home/Posts';
import WatchList from '@/components/Home/WatchList';
import { app } from '@/shared/FirebaseConfig';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function index() {
    const {data:session} = useSession();
    const [sessionDone, setSessionDone] = useState(false);
    const [activityDone, setActivityDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [activity, setActivity] = useState();
    const [sessionData, setSessionData] = useState();
    const router = useRouter();
    const db = getFirestore(app);

    const fetchSession=async()=>{
        const newPosts = [];
        const currentSession = session || await getSession();
        if(!currentSession){
            router.push('/');
        }
        else{
            setSessionData(currentSession);
            const q = query(collection(db, "posts"),
            where("email","==",currentSession?.user.email)); 
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                let data = doc.data();
                data.id = doc.id;
                newPosts.push(data);
            })
            setPosts(newPosts);
            setSessionDone(true);
        }
    } 

    const fetchActivity=async()=>{
        const activities = [];
        const q = query(collection(db, "users"),
        where("email","==",sessionData.user.email));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        if (userDoc) {
            const activitiesFound = userDoc.data().posts || [];
            const activityPromises = activitiesFound.map(async (postId) => {
                const qActivity = doc(db, "posts", postId);
                const activitySnapShot = await getDoc(qActivity);
                return activitySnapShot.exists() ? { id: activitySnapShot.id, ...activitySnapShot.data() } : null;
            });
            const activities = await Promise.all(activityPromises);
            setActivity(activities.filter(Boolean));
        }
        setActivityDone(true);
    }

    useEffect(()=>{
        fetchSession();
    },[])

    useEffect(()=>{
        if(sessionData){
            console.log(sessionData);
            fetchActivity();
        }
    },[sessionData])
   
    useEffect(()=>{
        if(sessionDone && activityDone){
            console.log(activity);
            console.log(posts);
            setLoading(false);
        }
    },[sessionDone, activityDone])

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
                <div>
                    <h1 className='text-center text-blue-500 font-bold text-[35px]'>Your Activity</h1>
                    {activity?<WatchList posts={activity} profiles={false}/>:null}
                </div>
                <div>
                    <h1 className='text-center text-blue-500 font-bold text-[35px]'>Manage Post</h1>
                    {posts?<Posts posts={posts} profiles={true}/>:null}
                </div>                
            </div>
        </div>
    )
}

export default index