import ChatList from '@/components/Chat/ChatList';
import { app } from '@/shared/FirebaseConfig';
import { collection, getDocs, getFirestore, limit, limitToLast, orderBy, query, where } from 'firebase/firestore';
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function index() {
    const router = useRouter();
    const {data:session} = useSession();
    const db = getFirestore(app);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState();

    const fetchSession=async()=>{
      const currentSession = session || await getSession();
      if(currentSession){
        setSessionData(currentSession);
        const sentQuery = query(collection(db, "chat"),
        where("sender", "==", currentSession.user.email));

        const receivedQuery = query(collection(db, "chat"),
        where("receiver", "==", currentSession.user.email));

        const sentSnapshot = await getDocs(sentQuery)
        const receivedSnapshot = await getDocs(receivedQuery);

        const userMap = new Map();

        const addToUserMap=async(email, name) => {
          if (!userMap.has(email)) {
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const userSnapshot = await getDocs(userQuery);
            let image = '';
            userSnapshot.forEach((user) => {
              image = user.data().image;
            });
            userMap.set(email, { email, name, image });
          }
        };

        const sentPromises = sentSnapshot.docs.map(async(item)=>{
          const email = item.data().receiver;
          const name = item.data().receiverName;
          await addToUserMap(email, name);
        });

        const receivedPromises = receivedSnapshot.docs.map(async (item) => {
          const email = item.data().sender;
          const name = item.data().senderName;
          await addToUserMap(email, name);
        });

        
        await Promise.all([...sentPromises, ...receivedPromises]);
        setUsers(Array.from(userMap.values()));
      }
      else{
        router.push('/');
      }
    }
    
    const fetchLastContent=async(user)=>{
      const q = query(collection(db, "chat"),
      where("sender", "in", [sessionData.user.email, user.email]),
      where("receiver", "in", [sessionData.user.email, user.email]),
      orderBy("createdAt", "desc"),limit(1));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((item)=>{
        user.lastContent = item.data().content;
        user.lastTime = item.data().createdAt.toDate();
      })
    }

    useEffect(()=>{
      fetchSession();
    },[])

    useEffect(()=>{
      if(users.length > 0 && loading==true){
        const fetchContents = async() => {
          await Promise.all(users.map(user=>fetchLastContent(user)));
          setUsers([...users]);
          setLoading(false);
        }
        fetchContents();
      }
    },[users])

    if(loading){
      return (
        <div>
          Loading...
        </div>
      )
    }

    return (
      <div>
          <ChatList users={users} />
      </div>
    )
}

export default index