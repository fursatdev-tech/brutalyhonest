import { UserRole } from "@prisma/client";

import Conversation from "@/components/hosting/Conversation";
import { getThreadByMessageId } from "@/lib/actions/getThreadByMessageId";

interface Props {
    params: Promise<{
        messageId?: string;
    }>;
}

const ThreadById = async ({ params }: Props) => {
    const currentParams = await params;

    const role = UserRole.host;

    const threadData = await getThreadByMessageId(
        currentParams.messageId,
        role
    );

    return <Conversation {...threadData} role={role} />;
};

export default ThreadById;
