export default function CodeBox({ input, output }) {
    return (
        <div className="w-[700px]">
            <div className="w-full">
                {input}
            </div>

            <div className="w-full">
                {output}
            </div>
        </div>
    )
}