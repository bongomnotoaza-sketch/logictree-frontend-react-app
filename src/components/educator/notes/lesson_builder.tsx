import Heading from "./lesson_components/heading";
import SubHeading from "./lesson_components/sub-heading";
import Text from "./lesson_components/text";
import Image from "./lesson_components/image";
import Video from "./lesson_components/video";
import CodeBox from "./lesson_components/codebox";


type LessonElement =
    | {
          index: number;
          type: "heading";
          heading: string;
      }
    | {
          index: number;
          type: "subheading";
          subheading: string;
      }
    | {
          index: number;
          type: "text";
          text: string;
      }
    | {
          index: number;
          type: "image";
          imageUrl: string;
      }
    | {
          index: number;
          type: "video";
          videoUrl: string;
      }
    | {
          index: number;
          type: "codebox";
          input: string;
          output: string;
      };

function LessonBuilder() {
    const lessonContent: LessonElement[] = [
        {
            index: 1,
            type: "heading",
            heading: "Introduction to Python",
        },
        {
            index: 2,
            type: "subheading",
            subheading: "What is Python?",
        },
        {
            index: 3,
            type: "text",
            text: "Python is a programming language used to build many different types of applications.",
        },
        {
            index: 4,
            type: "image",
            imageUrl: "https://example.com/python.png",
        },
        {
            index: 5,
            type: "subheading",
            subheading: "Your First Program",
        },
        {
            index: 6,
            type: "text",
            text: "Let's write our first Python program.",
        },
        {
            index: 7,
            type: "codebox",
            input: "print('Hello World')",
            output: "Hello World",
        },
    ];

    const sortedContent = [...lessonContent].sort(
        (a, b) => a.index - b.index
    );

    return (
        <div className="w-full h-full overflow-auto">
            {sortedContent.map((element) => {
                switch (element.type) {
                    case "heading":
                        return (
                            <Heading
                                key={element.index}
                                heading={element.heading}
                            />
                        );

                    case "subheading":
                        return (
                            <SubHeading
                                key={element.index}
                                subheading={element.subheading}
                            />
                        );

                    case "text":
                        return (
                            <Text
                                key={element.index}
                                text={element.text}
                            />
                        );

                    case "image":
                        return (
                            <Image
                                key={element.index}
                                imageUrl={element.imageUrl}
                            />
                        );

                    case "video":
                        return (
                            <Video
                                key={element.index}
                                videoUrl={element.videoUrl}
                            />
                        );

                    case "codebox":
                        return (
                            <CodeBox
                                key={element.index}
                                input={element.input}
                                output={element.output}
                            />
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

export default LessonBuilder;