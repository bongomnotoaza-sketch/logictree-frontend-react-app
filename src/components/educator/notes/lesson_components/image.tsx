interface ImageProps {
    imageUrl: string;
}

export default function Image({ imageUrl }: ImageProps) {
    return (
        <div className="w-[700px] h-[400px] flex items-center justify-center">
            <img
                src={imageUrl}
                alt=""
                className="max-w-full max-h-full object-contain"
            />
        </div>
    );
}