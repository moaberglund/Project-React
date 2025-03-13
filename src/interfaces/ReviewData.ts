interface ReviewData {
    _id: string;
    rating: number;
    title: string;
    text: string;
    user: string | object;
    book_id: string;
    likes?: number;
    createdAt?: Date;
    updatedAt?: Date;
    onReviewDeleted?: () => void;
}

export default ReviewData;