interface ImageProps {
    imageUrl: string;
}


export default function Image({ imageUrl }: ImageProps) {
    return (
        <div className="w-full max-w-[700px] h-[250px] sm:h-[400px] flex items-center justify-center self-center overflow-hidden">
            <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-contain"
            />
        </div>
    );
}
