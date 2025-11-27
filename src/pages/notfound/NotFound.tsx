import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

function NotFound() {
  return (
    <>
        <Nav />
        <section className="min-h-screen flex justify-center items-center select-none">
            <h1 className="text-zinc-300 pop font-bold text-[50px]">
                404
            </h1>
        </section>
        <Footer />   
    </>
  )
}

export default NotFound