// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';

type MainLayoutProps = {
    children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div>
            <nav className="bg-blue-500 text-white p-4">
                <h1 className="text-3xl">My Store</h1>
            </nav>
            <main className="container mx-auto p-4">{children}</main>
        </div>
    );
};

export default MainLayout;
