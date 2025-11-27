import { Link } from "react-router-dom"

function Footer() {
  return (
    <>
        <footer className="flex justify-center px-3 py-[20px] border-t border-t-blue-500/20 bg-white">
            <div className="w-full max-w-screen-xl">

                <div className="flex justify-center">
                    <Link to={'/'}>
                        LOGO
                    </Link>
                </div>
                <p className="pop text-xs text-center text-black mt-2">
                    © 2024 <Link to={'https://discord.gg/FfGmbTERBs'} className="hover:underline pop">PROLEAK INNOVATION</Link>
                </p>
                
            </div>
        </footer>
    </>
  )
}

export default Footer