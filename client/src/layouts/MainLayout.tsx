import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Inicio from '../views/Inicio'
import Footer from '../components/Footer'
import ProductDetail from '../views/ProductDetail'


const MainLayout = () => {
    return (
        <>
            <Header />
            <div>
                <ProductDetail />
                <Outlet />
            </div>
            <Inicio />
            <Footer />
        </>
    )
}

export default MainLayout

