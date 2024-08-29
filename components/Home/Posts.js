import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import PostModal from './PostModal';

function Posts({posts, profiles}) {
  const [post, setPost] = useState([]);
  const [modal, setModal] = useState(false);

  return (
    <div className='mb-5 w-full'>
      {posts.length > 0 ? (
        <>
          <PostModal post={post} setModal={setModal} modal={true} profile={profiles}/>
            <div className='flex overflow-x-scroll gap-5 mt-5 px-7'>
              {posts.map((item)=>(
                  <div onClick={()=>
                    {setPost(item);
                    setModal(true);
                    document.getElementById('my_modal_1').showModal();
                    console.log(post);
                    }}>
                    <PostItem post={item} profile={profiles}/>
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

export default Posts