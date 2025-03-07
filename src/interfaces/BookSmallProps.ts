interface BookSmallProps {
    id: string;
    thumbnail?: string;
    title?: string;
    authors?: Array<string> | string;
    publishedDate?: string;
    pageCount?: number;
}
export default BookSmallProps;