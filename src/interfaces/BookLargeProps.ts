import { ReactNode } from "react";
import BookSmallProps from "./BookSmallProps";

interface BookLargeProps extends BookSmallProps {
    description?: ReactNode;
    publisher?: string;
    categories?: Array<string>;
}

export default BookLargeProps;