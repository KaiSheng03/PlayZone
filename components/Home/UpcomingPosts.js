import React, { useEffect, useState } from 'react'
import UpcomingPostItem from './UpcomingPostItem'
import UpcomingPostModal from './UpcomingPostModal';

function UpcomingPosts({posts, profiles}) {
  const [post, setPost] = useState([]);
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
      <UpcomingPostModal post={post} setModal={setModal} modal={true} profile={profiles}/>
      <div className='bg-slate-100 py-5 flex overflow-x-scroll gap-5 mt-3 px-7'>
        {posts.map((item)=>(
            <div onClick={()=>
              {setPost(item);
              setModal(true);
              document.getElementById('my_modal_1').showModal();
              console.log(post);
              }}>
              <UpcomingPostItem post={item} profile={profiles}/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingPosts