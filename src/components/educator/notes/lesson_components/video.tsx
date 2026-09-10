interface VideoProps {
    videoUrl: string;
}

export default function Video({ videoUrl }: VideoProps) {
    return (
        <div className="w-[700px] h-[400px] flex items-center justify-center">
            <iframe
                src={videoUrl}
                title="Video"
                className="w-full h-full"
                allowFullScreen
            />
        </div>
    );
}