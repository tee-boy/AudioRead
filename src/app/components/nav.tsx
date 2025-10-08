import Image from "next/image";

const nav = () => {
  return (
 <nav className="flex justify-between items- border-[#263537] border-w-90 p-4 border-b">
        <div className="flex items-center gap-3">
          <Image
          src="/AudioreadLogo.png" 
          alt="Logo" 
          width={50} 
          height={50} 
          />

          <Image
          src="/dulogo.png" 
          alt="DuLogo" 
          width={40} 
          height={40} 
          />

        </div>

        <button 
        className="rounded-md px-6 py-3 cursor-pointer backdrop-blur-md font-bold bg-[#2c383d] text-[#f4894c] hover:bg-[#263537] transition active:scale-95 active:shadow-sm">
        Sign Up
        </button>
      </nav>
  )
}

export default nav
