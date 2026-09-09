import CalenderNavMobile from "./calendernavigation-mobile";
import { CalendarCard } from "./CalenderCard";

export default function Calendermobile() {
    return (
        <>
            <div className="grid h-full w-full grid-rows-2">
                <CalenderNavMobile />
                <CalendarCard />     
            </div>
        </>
    )
}