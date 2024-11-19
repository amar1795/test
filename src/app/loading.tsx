import Spinner from '@/components/spinner/Spinner'
import React from 'react'

const loading = () => {
  return (
    <div>
    <div className=" text-[2rem] flex w-full justify-center "><Spinner/></div>
   </div>
  )
}

export default loading
