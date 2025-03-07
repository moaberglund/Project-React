import BookSmallProps from "./BookSmallProps";

interface BookLargeProps extends BookSmallProps {
    description: string;
    publisher: string;
    categories: Array<string>;
}

export default BookLargeProps;