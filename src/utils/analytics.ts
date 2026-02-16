import { track } from '@plausible-analytics/tracker';

const getUserId = (): string => {
    let userId = localStorage.getItem('plausible_user_uuid');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('plausible_user_uuid', userId);
    }
    return userId;
};

export const trackEvent = (eventName: string, props: Record<string, any> = {}) => {
    const userId = getUserId();
    const now = new Date().toISOString();
    
    track(eventName, {
        props: {
            ...props,
            userId,
            datetime: now
        }
    });
};
