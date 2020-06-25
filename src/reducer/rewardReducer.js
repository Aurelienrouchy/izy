
export const rewardReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_TICKET':
            return {
                ...state,
                isTicketVisible: action.isVisible,
            };
        case 'TOGGLE_REWARD':
            return {
                ...state,
                isReward: action.isReward,
            };
        case 'TOGGLE_ADS':
            return {
                ...state,
                isAdsVisible: action.isVisible,
            };
        case 'TOGGLE_ADS_LOADING':
            return {
                ...state,
                isAdsLoading: action.isLoading,
            };
        default:
            return state
    }
};

export const rewardState = {
    isTicketVisible: false,
    isAdsLoading: true,
    isAdsVisible: false,
    isReward: false
};
