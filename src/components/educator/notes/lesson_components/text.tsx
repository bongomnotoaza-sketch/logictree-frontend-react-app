export default function Text({ text }) {
    return (
        <div className="w-full">
            <p className="w-full text-center text-justify text-base text-white">
                {text}
            </p>
        </div>
    )
}