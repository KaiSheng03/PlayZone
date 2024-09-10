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
import NextWeekPost from "@/components/Home/NextWeekPost";
import UpcomingPosts from "@/components/Home/UpcomingPosts";

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

  const [nextWeekPosts, setNextWeekPosts] = useState([]);
  const [nextWeekDisplay, setNextWeekDisplay] = useState([]);

  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [upcomingDisplay, setUpcomingDisplay] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filterOn, setFilterOn] = useState(false);
  
  const sortAllPosts = (posts, sortBy) =>{
    // A - B : Ascending : 1
    // B - A : Descending : -1
    posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
  
      if(dateA.getTime() !== dateB.getTime()){
        return (sortBy * (dateA - dateB));
      }
      const timeA = a.time ? a.time.split(":").map(Number) : [0,0];
      const timeB = b.time ? b.time.split(":").map(Number) : [0,0];

      if(timeA[0] !== timeB[0]) return (sortBy * (timeA[0] - timeB[0]));
      if(timeA[1] !== timeB[1]) return (sortBy * (timeA[1] - timeB[1]));
    })
  }

  const fetchUpcomingPosts = () =>{
    if(upcomingPosts <= 0){
      let filteredByDatePosts = initialPosts.filter((post)=>{
        const postDate = new Date(post.date);
        const currentDate = new Date();
        postDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return (postDate >= currentDate);
      })

      sortAllPosts(filteredByDatePosts, 1);

      const currentDate = new Date();
      currentDate.setHours(0,0,0,0);

      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate()-currentDate.getDay());
      startOfWeek.setHours(0,0,0,0);

      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(startOfWeek.getDate()+6);
      endOfWeek.setHours(0,0,0,0);

      const upcomingPost = filteredByDatePosts.filter(post=>{
        const postDate = new Date(post.date);
        postDate.setHours(0,0,0,0);
        return postDate >= startOfWeek && postDate <= endOfWeek;
      })
      setUpcomingPosts(upcomingPost);
    }
  }

  const fetchNextWeekPosts = () =>{
    if(nextWeekPosts <= 0){
      const allPosts = initialPosts;
      sortAllPosts(allPosts, 1);

      const currentDate = new Date();
      const startOfCurrentWeek = new Date(currentDate);
      startOfCurrentWeek.setDate(currentDate.getDate()-currentDate.getDay());
      startOfCurrentWeek.setHours(0,0,0,0);

      const endOfCurrentWeek = new Date();
      endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);
      endOfCurrentWeek.setHours(0,0,0,0);

      const startOfNextWeek = new Date();
      startOfNextWeek.setDate(startOfCurrentWeek.getDate() + 7);
      startOfNextWeek.setHours(0,0,0,0);

      const endOfNextWeek = new Date();
      endOfNextWeek.setDate(endOfCurrentWeek.getDate() + 7)
      endOfCurrentWeek.setHours(0,0,0,0);

      const nextWeekPosts = allPosts.filter((post)=>{
        const postDate = new Date(post.date);
        postDate.setHours(0,0,0,0);
        return postDate >= startOfNextWeek && postDate <= endOfNextWeek;
      })
      setNextWeekPosts(nextWeekPosts);
    }
  }

  useEffect(()=>{
    fetchUpcomingPosts();
    fetchNextWeekPosts();
    sortAllPosts(initialPosts, -1);
  },[])

  useEffect(()=>{
    getPost();
  },[filterOn, upcomingPosts, nextWeekPosts, posts])

  const getPost = async() =>{
    if(!filterOn){
      setPosts(initialPosts);
      setUpcomingDisplay(upcomingPosts); // This week posts
      setNextWeekDisplay(nextWeekPosts); // Next week posts
      setLoading(false);
    }
  }

  if(loading){
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div className="w-[70%] md:w-[50%] lg:w-[55%]">
        <Hero />
        <Search setUpcomingDisplay={setUpcomingDisplay} setNextWeekDisplay={setNextWeekDisplay} setPosts={setPosts} setFilterOn={setFilterOn} upcomingPosts={upcomingPosts} nextWeekPosts={nextWeekPosts} posts={posts}/>
        <GameList setUpcomingDisplay={setUpcomingDisplay} setNextWeekDisplay={setNextWeekDisplay} setPosts={setPosts} setFilterOn={setFilterOn} upcomingPosts={upcomingPosts} nextWeekPosts={nextWeekPosts} posts={posts}/>
      </div>
      
      {filterOn && (
        <div>
          <button className="btn mt-3" onClick={()=>setFilterOn(false)}>
            Remove filter
          </button>
        </div>
      )}
      
      <div className="this-week w-full mt-5">
        <h1 className="font-bold ml-5 text-[30px] text-blue-500">This Week</h1>
        {upcomingDisplay? <UpcomingPosts posts={upcomingDisplay} profiles={false}/>:null}
      </div>
      <div className="next-week w-full mt-5">
        <h1 className="font-bold ml-5 text-[30px] text-blue-500">Next Week</h1>
        {nextWeekDisplay? <NextWeekPost posts={nextWeekDisplay} profiles={false}/>:null}
      </div>
      <div className="all w-full mt-5">
        <h1 className="font-bold ml-5 text-[30px] text-blue-500">All Posts</h1>
        {posts? <Posts posts={posts} profiles={false}/>:null}
      </div>
    </div>
  )
}
