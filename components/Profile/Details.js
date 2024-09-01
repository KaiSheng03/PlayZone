import { arrayRemove, arrayUnion, collection, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function Details() {
  const { data: session } = useSession();
  const db = getFirestore();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const {email} = router.query;

  const fetchUser=async()=>{
    const q = query(collection(db, "users"),
    where("email", "==", email));
    
    onSnapshot(q, (querySnapshot) =>{
      if(!querySnapshot.empty){
        const user = querySnapshot.docs[0];
        setUser(user.data());    
      }
    })
  }

  const checkFollowed=()=>{
    if(user.followers){
      user.followers.forEach((user)=>{
        if(user == currentUser.id){
          console.log("followed");
          setFollowed(true);
        }
        else{
          console.log("unfollowed");
          setFollowed(false);
        }
      })
    }
  }

  const fetchCurrentUser = async() =>{
    const q = query(collection(db, "users"),
    where("email", "==", session?.user.email));
    const querySnapshot = await getDocs(q);
    const currentUser = querySnapshot.docs[0];
    const currentUserData = currentUser.data();
    currentUserData.id = currentUser.id;
    setCurrentUser(currentUserData);
  }

  const follow=async()=>{
    setFollowed(true);
    const q = query(collection(db, "users"),
    where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0].ref;

    await updateDoc(userDoc, {
        followers: arrayUnion(currentUser.id),
        followerCount: Number(user.followerCount) + 1
    });
  }

  const unFollow=async()=>{
    setFollowed(false);
    const q = query(collection(db, "users"),
    where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0].ref;

    await updateDoc(userDoc, {
        followers: arrayRemove(currentUser.id),
        followerCount: Number(user.followerCount) - 1
    });
  }
  
  useEffect(()=>{
    if(session){
      if(email && !user){ 
        fetchUser();
      }
      if(!currentUser){
        fetchCurrentUser();
      }
      else{
        setLoading(false);
      }
      if(user && currentUser){
        checkFollowed();
      }
    }
    
    console.log(email)
  },[session, currentUser, email, user])

  if(loading){
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div>
      {email ? (
        <div className="hero bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image src={user.image} width={100} height={85} alt='user image' 
            className='rounded-full cursor-pointer'/>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="my-3 flex flex-col">
                <span>Follower: {user.followerCount}</span>
                <span>Game Joined: {}</span>
                <span>Sports: {}</span>
              </div>
              <div className='flex gap-5'>
                {followed ? (
                  <button className='btn bg-slate-300' onClick={()=>unFollow()}>
                    Unfollow
                  </button>
                )
                :
                (
                  <button className='btn btn-primary' onClick={()=>follow()}>
                    Follow
                  </button>
                )}
                <button className='btn btn-primary'>Message</button>
              </div>
            </div>
          </div>
        </div>
      )
      :
      (
        <div className="hero bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image src={session?.user.image} width={100} height={85} alt='user image' 
            className='rounded-full cursor-pointer'/>
            <div>
              <h1 className="text-3xl font-bold">{session?.user.name}</h1>
              <div className="mt-3 flex flex-col">
                <span>Follower: {currentUser.followerCount}</span>
                <span>Game Joined: {}</span>
                <span>Sports: {}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default Details