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
            heading: "For Loops in Python",
        },
        {
            index: 2,
            type: "subheading",
            subheading: "What is a For Loop?",
        },
        {
            index: 3,
            type: "text",
            text: "A for loop is used to iterate over a sequence (such as a list, tuple, dictionary, set, or string). It allows you to execute a block of code repeatedly for each item in the sequence.",
        },
        {
            index: 4,
            type: "image",
            imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
        },
        {
            index: 5,
            type: "subheading",
            subheading: "Basic Syntax",
        },
        {
            index: 6,
            type: "text",
            text: "The basic syntax of a for loop in Python is simple. You use the 'for' keyword, followed by a variable name, the 'in' keyword, and the sequence you want to iterate over.",
        },
        {
            index: 7,
            type: "codebox",
            input: "fruits = [\"apple\", \"banana\", \"cherry\"]\n\nfor fruit in fruits:\n    print(fruit)",
            output: "Press run",
        },
        {
            index: 8,
            type: "subheading",
            subheading: "Using the Range Function",
        },
        {
            index: 9,
            type: "text",
            text: "The range() function is commonly used with for loops to generate a sequence of numbers. It can take one, two, or three arguments: stop, start and stop, or start, stop, and step.",
        },
        {
            index: 10,
            type: "codebox",
            input: "# Loop from 0 to 4\nfor i in range(5):\n    print(i)\n\n# Loop from 2 to 6\nfor i in range(2, 7):\n    print(i)\n\n# Loop with step of 2\nfor i in range(0, 10, 2):\n    print(i)",
            output: "Press run",
        },
        {
            index: 11,
            type: "subheading",
            subheading: "Nested For Loops",
        },
        {
            index: 12,
            type: "text",
            text: "You can also nest for loops inside each other. A nested loop is a loop inside another loop. The inner loop will be executed one time for each iteration of the outer loop.",
        },
        {
            index: 13,
            type: "codebox",
            input: "for i in range(1, 4):\n    for j in range(1, 4):\n        print(i, \"x\", j, \"=\", i * j)",
            output: "Press run",
        },
        {
            index: 14,
            type: "subheading",
            subheading: "Loop Control Statements",
        },
        {
            index: 15,
            type: "text",
            text: "Python provides loop control statements to change the execution of a loop. The 'break' statement terminates the loop, while the 'continue' statement skips the rest of the code inside the loop for the current iteration and moves to the next iteration.",
        },
        {
            index: 16,
            type: "codebox",
            input: "# Using break\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)\n\nprint(\"---\")\n\n# Using continue\nfor i in range(10):\n    if i % 2 == 0:\n        continue\n    print(i)",
            output: "Press run",
        },
        {
            index: 17,
            type: "subheading",
            subheading: "Video Tutorial",
        },
        {
            index: 18,
            type: "text",
            text: "Watch this video for a visual explanation of for loops in Python.",
        },
        {
            index: 19,
            type: "video",
            videoUrl: "https://www.youtube.com/watch?v=KWgYha0clzw",
        },
        {
            index: 20,
            type: "subheading",
            subheading: "Summary",
        },
        {
            index: 21,
            type: "text",
            text: "In this lesson, you learned what for loops are, how to use them with sequences, how to use the range() function, how to create nested loops, and how to use break and continue statements. Practice these concepts by writing your own for loops!",
        },
    ];

    const sortedContent = [...lessonContent].sort(
        (a, b) => a.index - b.index
    );

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6">
                {sortedContent.map((element) => {
                    const key = element.index;

                    switch (element.type) {
                        case "heading":
                            return (
                                <div key={key} className="w-full min-w-0">
                                    <Heading heading={element.heading} />
                                </div>
                            );

                        case "subheading":
                            return (
                                <div key={key} className="w-full min-w-0">
                                    <SubHeading subheading={element.subheading} />
                                </div>
                            );

                        case "text":
                            return (
                                <div key={key} className="w-full min-w-0">
                                    <Text text={element.text} />
                                </div>
                            );

                        case "image":
                            return (
                                <div key={key} className="w-full min-w-0">
                                    <Image imageUrl={element.imageUrl} />
                                </div>
                            );

                        case "video":
                            return (
                                <div key={key} className="w-full min-w-0">
                                    <Video videoUrl={element.videoUrl} />
                                </div>
                            );

                        case "codebox":
                            return (
                                <div
                                    key={key}
                                    className="w-full min-w-0 overflow-hidden"
                                >
                                    <CodeBox
                                        input={element.input}
                                        output={element.output}
                                    />
                                </div>
                            );

                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
}

export default LessonBuilder;