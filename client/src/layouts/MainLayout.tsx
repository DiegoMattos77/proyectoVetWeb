import { Outlet, Form } from 'react-router-dom'
import Header from '../components/Header'
import Section from '../components/Section'
import Footer from '../components/Footer'


const MainLayout = () => {
    return (
        <>
            <Header />
            <Section />
            <Footer />
        </>
    )
}

export default MainLayout

