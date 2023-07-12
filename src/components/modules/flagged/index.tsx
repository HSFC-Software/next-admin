import { useFlags } from "launchdarkly-react-client-sdk";
import { ReactNode } from "react";

const Flagged = (props: { flagKey: string; children: ReactNode }) => {
    const { children, flagKey } = props;

    const flags = useFlags();

    if (flags[flagKey]) {
        return <>{children}</>;
    }

    return null;
};

export default Flagged;
