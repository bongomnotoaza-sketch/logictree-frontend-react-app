interface SubHeadingProps {
    subheading: string;
}

export default function SubHeading({ subheading }: SubHeadingProps) {
    return (
        <h2 className="text-lg font-semibold text-left">
            {subheading}
        </h2>
    );
}