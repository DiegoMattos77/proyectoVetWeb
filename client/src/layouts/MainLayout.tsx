import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Section from '../components/Section'
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
            <Section />
            <Footer />
        </>
    )
}

export default MainLayout

