interface TextProps {
    text: string;
}

export default function Text({ text }: TextProps) {
    return (
        <div className="w-full">
            <p className="w-full text-center text-justify text-base text-white">
                {text}
            </p>
        </div>
    );
}