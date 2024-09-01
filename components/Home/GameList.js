import React, { useEffect, useState } from 'react'
import Data from './../../shared/Data'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Posts from './Posts';

function GameList({setPosts, setNextWeekDisplay, setFilterOn, initialPosts, nextWeekPosts}) {
    const [games, setGames] = useState([]);
    const db = getFirestore();

    useEffect(()=>{
        setGames(Data.GameList);
    },[])

    const filterGame=async(item)=>{
        setFilterOn(true);
        const newPosts = [];
        let filterResults = initialPosts.filter(post=>
            post.game == item.name
        )

        let filterResults2 = nextWeekPosts.filter(post=>
            post.game == item.name
        )
        setPosts(filterResults);
        setNextWeekDisplay(filterResults2);
    }

    return (
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 mt-4'>
            {games.length>0 ? (
                games.map((item)=>(
                    <div className='flex flex-col items-center cursor-pointer' onClick={()=>filterGame(item)}>
                        <img src={item.image} width={45} height={45} className='hover:animate-bounce transition-all duration-150'/>
                        <h2 className='text-[14px] text-center'>{item.name}</h2>
                    </div>
                ))
            )
            :(
                <p>No games available</p>
            )}
        </div>
    )
}

export default GameList