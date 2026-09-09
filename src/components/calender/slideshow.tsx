
import { useEffect, useState } from "react";

export default function Slideshow() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    const images = [
        "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b"
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((current) => (current + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative mx-auto my-auto aspect-square w-[80%] overflow-hidden rounded-md md:aspect-auto md:h-[95%] md:w-[95%]">
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: `url(${images[currentImage]})` }}
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                <p className="text-8xl font-bold text-white">{day}</p>

                <div className="flex items-center justify-center gap-2 text-l text-white">
                    <p>{month}</p>
                    <p>{year}</p>
                </div>
            </div>
        </div>
    );
}