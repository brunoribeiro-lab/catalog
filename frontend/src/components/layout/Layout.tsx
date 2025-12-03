import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    const SIDEBAR_WIDTH_PX = 224;
    const HEADER_HEIGHT_PX = 56;
    
    return (
        <div className="min-h-screen text-neutral-200">
            <Sidebar />
            <Header />
            <main
                className="min-h-[calc(100vh-56px)]"
                style={{
                    marginLeft: `${SIDEBAR_WIDTH_PX}px`,
                    paddingTop: `${HEADER_HEIGHT_PX}px`,
                }}
            >
                <div className="p-6">
                    {children}
                </div>

                <Footer />
            </main>
        </div>
    )
}