import React, { useEffect, useState } from 'react'
import WatchlistModal from './WatchlistModal';
import WatchlistItem from './WatchlistItem';

function WatchList({posts, profiles}) {
  const [watchlist, setWatchlist] = useState([]);
  const [modal, setModal] = useState(false);

  if(posts.length <= 0){
    return (
      <div className='text-[20px] ml-5 my-5'>
          No post found
      </div>
    )
  }

  return (
    <div className='mb-5 w-full'>
      <WatchlistModal post={watchlist} setModal={setModal} modal={true} profile={profiles}/>
      <div className='bg-slate-100 py-5 flex overflow-x-scroll gap-5 mt-5 px-7'>
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
    </div>
    
  )
}

export default WatchList