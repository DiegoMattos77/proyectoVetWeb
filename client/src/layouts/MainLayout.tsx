import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const MainLayout = () => {
    return (
        <>
            <Header />
            <ToastContainer />
            <main className="pt-24">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout