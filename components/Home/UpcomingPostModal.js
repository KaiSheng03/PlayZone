import React, { useEffect } from 'react'
import UpcomingPostItem from './UpcomingPostItem'
import { HiOutlineXCircle } from 'react-icons/hi2'

function UpcomingPostModal({post, setModal, modal, profile}) {
  useEffect(()=>{
    console.log(post);
  })

  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box p-0 sm:p-[1.5rem] w-fit">
          <UpcomingPostItem post={post} modal={modal} profile={profile}/>
          <div method="modal-action">
            <form method='dialog'>
              <button className='text-[22px] absolute top-2 right-2' onClick={()=>setModal(false)}>
                < HiOutlineXCircle />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
    
  )
}

export default UpcomingPostModal