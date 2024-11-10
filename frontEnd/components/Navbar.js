import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-green-200 to-green-400 text-black">
      <div className="flex justify-center items-center py-1 px-14">
        <div className='flex items-center justify-center gap-3'>
          <img className='h-12 rounded-full' src="logo.png" alt="" />
          <h1 className="font-bold text-2xl">Bussiness Management</h1>
        </div>
        
        {/* <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ">Login</button> */}
      </div>
    </nav>
  )
}

export default Navbar