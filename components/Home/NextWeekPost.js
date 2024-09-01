import React, { useEffect, useState } from 'react'
import PostModal from './PostModal';
import PostItem from './PostItem';
import NextWeekPostItem from './NextWeekPostItem';
import NextWeekPostModal from './NextWeekPostModal';

function NextWeekPost({posts, profiles}) {
    const [post, setPost] = useState([]);
    const [modal, setModal] = useState(false);

    return (
      <div className='mb-5 w-full'>
        {posts.length > 0 ? (
          <>
            <NextWeekPostModal post={post} setModal={setModal} modal={true} profile={profiles}/>
              <div className='bg-slate-100 py-5 flex overflow-x-scroll gap-5 mt-3 px-7'>
                {posts.map((item)=>(
                    <div onClick={()=>
                      {setPost(item);
                      setModal(true);
                      document.getElementById('my_modal_2').showModal();
                      console.log(post);
                      }}>
                      <NextWeekPostItem post={item} profile={profiles}/>
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

export default NextWeekPost