import { Reply } from "../classes/reply";
import { upvoteReply, downvoteReply } from "../services/replyService";

import { faArrowAltCircleUp, faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mantine/core";

const ReplyComponent = (reply: Reply) => {
    const handleUpvote = async (replyId: string) => {
        try {
            const response = await upvoteReply(replyId);
            console.log('Upvoted', response);

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownvote = async (replyId: string) => {
        try {
            const response = await downvoteReply(replyId);
            console.log('Downvoted', response);

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div className="flex items-center gap-1" style={{ marginBottom: '5px' }}>
                <Avatar
                    src={reply.owner.profileImage}
                    alt={reply.owner.fullName}
                    radius="xl"
                    size="md" />
                <h2 className='desc' style={{ fontSize: '16px' }}>
                    {reply.owner.fullName}
                </h2>
                <p className="desc" style={{ marginLeft: 'auto' }}>
                    {reply.timestamp.split("T")[0]}
                </p>
            </div>
            <div className="flex items-center gap-1 justify-between">
                <p>{reply.content}</p>
                <div>
                    <FontAwesomeIcon
                        icon={faArrowAltCircleUp}
                        className='icons text-green-500'
                        onClick={() => handleUpvote(reply._id)} /> &nbsp; {reply.upvotes}

                    <FontAwesomeIcon
                        icon={faArrowAltCircleDown}
                        className='icons text-red-500'
                        onClick={() => handleDownvote(reply._id)} /> &nbsp; {reply.downvotes}
                </div>
            </div>
        </>
    );
};

export default ReplyComponent;