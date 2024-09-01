import React, { useEffect } from 'react'
import { HiOutlineXCircle } from 'react-icons/hi2'
import WatchlistItem from './WatchlistItem';

function WatchlistModal({post, setModal, modal, profile}) {
  useEffect(()=>{
    console.log(post);
})

  return (
    <div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box p-0 sm:p-[1.5rem] w-fit">
          <WatchlistItem post={post} modal={modal} profile={profile}/>
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

export default WatchlistModal