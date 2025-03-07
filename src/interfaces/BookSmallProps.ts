interface BookSmallProps {
    thumbnail: string | undefined;
    title: string;
    authors: Array<string> | string;
    publishedDate: string;
    pageCount: number;
}
export default BookSmallProps;