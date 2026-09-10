interface CodeBoxProps {
    input: string;
    output: string;
}

export default function CodeBox({ input, output }: CodeBoxProps) {
    return (
        <div className="w-[700px]">
            <div className="w-full">
                {input}
            </div>

            <div className="w-full">
                {output}
            </div>
        </div>
    );
}