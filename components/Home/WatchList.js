import React, { useEffect, useState } from 'react'
import WatchlistModal from './WatchlistModal';
import WatchlistItem from './WatchlistItem';

function WatchList({posts, profiles}) {
  const [watchlist, setWatchlist] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(()=>{
    console.log(posts);
  })

  return (
    <div className='mb-5'>
      {posts.length > 0 ? (
        <>
          <WatchlistModal post={watchlist} setModal={setModal} modal={true} profile={profiles}/>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10'>
                {posts.map((item)=>(
                    <div onClick={()=>
                        {setWatchlist(item);
                        setModal(true);
                        document.getElementById('my_modal_2').showModal();
                        console.log(watchlist);}}>
                        <WatchlistItem post={item} profile={profiles}/>
                  </div>
              ))}
            </div>
        </>
      ) 
      : (
        <div className='text-[20px] mt-5'>
          No post found
        </div>
      )}
      
    </div>
    
  )
}

export default WatchList