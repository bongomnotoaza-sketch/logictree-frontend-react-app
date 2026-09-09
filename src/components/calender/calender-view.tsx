import CalenderBodyTop from "./calenderbodytop";
import CalenderBodyBottom from "./calenderbodybottom";

export default function Calender() {
    return (
        <>
            <div className="grid h-full w-full grid-rows-2 overflow-scroll" >
                <CalenderBodyTop />
                <CalenderBodyBottom />
            </div>
        </>
    )
}