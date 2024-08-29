import Image from "next/image";
import { Inter } from "next/font/google";
import Hero from "@/components/Home/Hero";
import Search from "@/components/Home/Search";
import GameList from "@/components/Home/GameList";
import {getFirestore, collection, getDocs, query, limit, startAfter} from "firebase/firestore";
import app from '../shared/FirebaseConfig'
import { useEffect, useState, useCallback } from "react";
import Posts from "@/components/Home/Posts";
import { initial } from "lodash";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps(){
  const db = getFirestore(app);
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = querySnapshot.docs.map(doc=>{
    let data = doc.data();
    data.id = doc.id;
    return data;
  });
  
  return {
    props: {initialPosts: posts}
  }
}

export default function Home({initialPosts}) {
  const db=getFirestore(app);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOn, setFilterOn] = useState(false);

  useEffect(()=>{
    getPost();
  },[filterOn])

  const getPost = async() =>{
    if(!filterOn){
      setPosts(initialPosts);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-9">
      <div className="w-[70%] md:w-[50%] lg:w-[55%]">
        <Hero />
        <Search setPosts={setPosts} setFilterOn={setFilterOn} initialPosts={initialPosts}/>
        <GameList setPosts={setPosts} setFilterOn={setFilterOn} initialPosts={initialPosts}/>
      </div>
      {loading? 
      (
        <div className="mt-9">
          Loading...
        </div>
      ) 
      : 
      (
        <>
        {filterOn && (
          <div>
            <button className="btn mt-3" onClick={()=>setFilterOn(false)}>
              Remove filter
            </button>
          </div>
        )}
        
        {posts? <Posts posts={posts} profiles={false}/>:null}
        </>
      )}
    </div>
  )
}
