import Header from "../../HeaderComp";
import GuestDownload from "./GuestDownload";
import "./GuestDownload.css";



const GuestHome = () => {

    return (
        <>
          <div className="guest-download-page min-h-screen bg-[#090909] text-[#f5f5f5]">
          <Header />
            <main className="guest-download-main">
            <div className="guest-download-heading">
              <p className="guest-download-eyebrow">JUSTSHARE / FILE DELIVERY</p>
              <h1>Download your file</h1>
              <p>Your file is ready to download.</p>
            </div>
            <GuestDownload />
            </main>

          </div>
        </>
    );
};
export default GuestHome;