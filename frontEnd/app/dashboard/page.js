"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import Link from "next/link";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  let debounceTimer;
  useEffect(() => {
    if (!session || !session.user) {
      router.push("/login");
    }
    else {
      fetchItems(session.user.id);
    }
  }, [session, router]);
    if (status === "loading") {
      return <p>Loading...</p>;
    }
  const fetchItems = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/get-items?user_id=${userId}`); //Fetching all the items which have user's id 
        const data = await response.json();
        setItems(data); // Set the fetched items to state
        setFilteredItems(data);
        setTotalItems(data.length);
        const outOfStockItems = data.filter(item => item.quantity <=3).length;
        setOutOfStock(outOfStockItems > 0 ? outOfStockItems : 0)
        const storeValue = data.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        setTotalValue(storeValue)
        const allcategory = new Set(data.map(item => item.category)).size ;
        setCategories(allcategory)
        
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
  const toggleSidebar = () => {
      setIsSidebarOpen((prev) => !prev);
  };
  const handleSearch = async(e)=>{
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = async(e)=>{
    e.preventDefault();
    const filtered = items.filter((item) =>  //filtering the data we entered in searchbox
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);      //jo matches aae unhe setFilteredItems me daal dia
  }


  const handleDelete = async(itemId)=>{
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    try {
      // Make API call to delete the item
      await fetch(`http://localhost:5000/delete-item`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId }),
      });
      // const newItems = items.filter((item)=>item.id !=itemId);
      // setItems(newItems)
      // console.log(newItems)
  
  }catch (error) {
    console.error("Error deleting item:", error);
  }
};

  const handleEdit = async(itemId)=>{
    const itemToEdit = items.find(item => item.id === itemId);
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    try {
      await fetch(`http://localhost:5000/delete-item`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId }),
      });
      router.push(`/addproduct?id=${itemToEdit.id}&name=${encodeURIComponent(itemToEdit.item_name)}&category=${encodeURIComponent(itemToEdit.category)}&price=${itemToEdit.price}&quantity=${itemToEdit.quantity}`);

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  const handleAdd = (itemId)=>{
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      updateQuantityInDB(itemId, updatedItems.find(item => item.id === itemId).quantity);
    }, 2000);
  }


  const handleRemove = (itemId)=>{
    const updatedItems = items.map((item) => // Yaha se vo item pta kra jisko minus kra h 
      item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
    );
    setItems(updatedItems);
    setFilteredItems(updatedItems);
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => { //Use kra h taki aaram jaise user add/remove kr le uske ek do second baad databse update ho
      updateQuantityInDB(itemId, updatedItems.find(item => item.id === itemId).quantity);
    }, 2000);
  }
  const updateQuantityInDB = async(itemId , newQuantity)=>{  // newQuantity represents the updated quantity which is now going to databse
    try {
      const res = await fetch("http://127.0.0.1:5000/update-quantity",{
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId, quantity: newQuantity }),
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }
  

  
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-green-400 dark:border-green-400">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg onClick={toggleSidebar}
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap dark:text-black">
                  Bussiness Devlopment
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="userimage.jpg"
                      alt=""
                    />
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-green-300 dark:border-green-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
      
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-green-300">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-black group-hover:text-gray-900 dark:group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <Link
                href="/addproduct"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-black transition duration-75 dark:text-black group-hover:text-gray-900 dark:group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Add Product
                </span>
                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-black">
                  Pro
                </span> */}
              </Link>
            </li>

            <li>
              <a
                href="/profile"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-black transition duration-75 dark:text-black group-hover:text-gray-900 dark:group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </a>
            </li>
            
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-black transition duration-75 dark:text-black group-hover:text-gray-900 dark:group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span
                  onClick={() => signOut()}
                  className="flex-1 ms-3 whitespace-nowrap"
                >
                  Sign Out
                </span>
              </a>
            </li>
            
          </ul>
        </div>
      </aside>

      <div className="py-14 px-4 sm:ml-64">
        <div className="">
          <h1 className="text-3xl text-black my-4">Inventory Stats</h1>
          <div className="flex flex-col gap-8 justify-evenly my-4 sm:flex-row ">
            <div className="border max-w-[420px] border-gray-800 p-3 text-center">
              <h1>Total Items</h1>
              <p>{totalItems}</p>
            </div>
            <div className="border max-w-[420px] border-gray-800 p-3 text-center">
              <h1>Out Of Stock Items</h1>
              <p>{outOfStock}</p>
            </div>
            <div className="border max-w-[420px] border-gray-800 p-3 text-center">
              <h1>Total Store Value</h1>
              <p>{totalValue} Rs</p>
            </div>
            <div className="border max-w-[420px] border-gray-800 p-3 text-center">
              <h1>All Categories</h1>
              <p>{categories}</p>
            </div>
          </div>
        </div>
        <div className="h-1 w-full my-2 bg-gray-300"></div>
        <div className="flex justify-between">
          <h1 className=" text-2xl">Inventory Items</h1>

          <form onSubmit={handleSearchSubmit} className="flex items-center max-w-sm">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search branch name..."
                value={searchQuery}
                onChange={handleSearch}
                required
              />
            </div>
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-black bg-blue-600 rounded-lg border border-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
        <div className="my-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg text-black ">
            <table className="w-full text-sm text-left rtl:text-right max-h-[80vh]">
              <thead className="text-xs  uppercase bg-gray-300  ">
                <tr>
                  <th scope="col" className="p-4">
                    Sr No
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Category
                  </th>

                  <th scope="col" className="px-4 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Value
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              {filteredItems.map((item,index)=>(
              <tbody key={index} className="bg-gray-200 overflow-scroll ">
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {index + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {item.item_name}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {item.category}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {item.price}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex gap-3"
                  >
                    <p>{item.quantity}</p>
                    <div className="flex gap-2"><img onClick={()=>handleAdd(item.id)} className="h-5 cursor-pointer invert" src="add_24.png" alt="" />
                    <img onClick={()=>handleRemove(item.id)} className="h-5 cursor-pointer invert" src="remove_24.png" alt="" /> </div>
                    
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-950 whitespace-nowrap"
                  >
                    {item.price * item.quantity} Rs. 
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex gap-4 "
                  >
                    <img onClick={()=> handleEdit(item.id)} className="h-5 invert cursor-pointer" src="edit_24.png" alt="" />
                    <img onClick={()=> handleDelete(item.id)} className="h-5 invert cursor-pointer" src="delete_24.png" alt="" />
                  </th>
                </tr>
              </tbody>))}
            </table>
          </div>
        </div>
        {/* <div>{user.user_id}</div> */}
      </div>
    </>
  );
};

export default page;
