import React from 'react'
import PostItem from './PostItem'
import { HiOutlineXCircle } from 'react-icons/hi2'

function PostModal({post, setModal, modal, profile}) {
    return (
        <div>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box p-0 sm:p-[1.5rem] w-fit">
              <PostItem post={post} modal={modal} profile={profile}/>
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

export default PostModal