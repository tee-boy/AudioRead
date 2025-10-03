import Image from "next/image";

const nav = () => {
  return (
 <nav className="flex justify-between items-center p-4 border-b">
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
        className="border px-4 py-1 rounded-md active:to-100% hover:bg-gray-100 transition">
        Sign Up
        </button>
      </nav>
  )
}

export default nav
