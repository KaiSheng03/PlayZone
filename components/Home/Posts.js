import React, { useEffect, useState } from 'react'
import PostModal from './PostModal';
import PostItem from './PostItem';

function Posts({posts, profiles}) {
  const [post, setPost] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(()=>{
    console.log(posts);
  })

  return (
    <div className="ml-3 mb-5">
      <table className="table table-xs table-pin-rows table-pin-cols ">
        <thead className='text-[17px]'>
          <tr>
            <td>Name</td>
            <td>Game</td>
            <td>location</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
      </table>
      <div className='max-h-60 overflow-y-scroll'>
        <table className="table table-xs table-pin-rows table-pin-cols">
          <tbody className=''>
            <PostModal post={post} setModal={setModal} modal={true} profile={profiles}/>
            {posts.map((item)=>(
              <tr className='cursor-pointer' onClick={()=>{
                  setPost(item);
                  setModal(true);
                  document.getElementById('my_modal_3').showModal();}}>
                <td className='text-[15px] py-3'>{item.title}</td>
                <td className='text-[15px] py-3'>{item.game}</td>
                <td className='text-[15px] py-3'>{item.location}</td>
                <td className='text-[15px] py-3 w-[20%]'>{item.date}</td>
                <td className='text-[15px] py-3'>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Posts