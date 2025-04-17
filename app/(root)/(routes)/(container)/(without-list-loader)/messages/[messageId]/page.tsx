import { UserRole } from "@prisma/client";

import Conversation from "@/components/hosting/Conversation";
import { getThreadByMessageId } from "@/lib/actions/getThreadByMessageId";

interface Props {
    params: Promise<{
        messageId?: string;
    }>;
}

const ThreadById = async ({ params }: Props) => {
    const role = UserRole.guest;

    const threadData = await getThreadByMessageId(
        (
            await params
        ).messageId,
        role
    );

    return <Conversation {...threadData} role={role} />;
};

export default ThreadById;
